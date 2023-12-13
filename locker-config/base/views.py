from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .forms import MqttForm, LoginForm
from . import constants
import json
from .utils import networks, board
from .services import BoxService, SettingService, NetworkService
from .mqtt import client as mqtt_client, topics
from .types import MqttInfo
from django.http import JsonResponse
import time
from django.core import serializers

def loginPage(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            form_data = form.cleaned_data
            username = form_data["username"]
            password = form_data["password"]

            try:
                user = User.objects.get(username=username)
            except:
                messages.error(request, 'User does not existed')
                return render(request, 'base/login.html', {"form": form})

            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                messages.success(request, "Login successfully")

                redirect_url = request.GET.get('next')
                if redirect_url is not None:
                    return redirect(redirect_url)
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password')
    else:
        form = LoginForm()

    return render(request, 'base/login.html', {"form": form})


def logoutUser(request):
    logout(request)
    return redirect('home')


@login_required(login_url='login')
def home(request):
    try:
        # get locker info
        locker_info = SettingService.get_settings(
            key=constants.LOCKER_INFO_SETTING_KEY)
        mqtt_info = SettingService.get_settings(key=constants.MQTT_SETTING_KEY)

        if mqtt_info is not None:
            mqtt_info["connected"] = connected_to_server()

        boxes = BoxService.get_boxes()
        boards = board.scan_slave_addresses()
        boxes_closed = board.check_boxes_closed();

        return render(request, 'base/home.html', context={
            "locker_info": locker_info,
            "mqtt_info": mqtt_info,
            "boxes": boxes,
            "boards": boards,
            "boxes_closed": boxes_closed
        })
    except Exception as ex:
        messages.error(request, f"Error happened: {ex}")
        return render(request, "base/home.html")


@login_required(login_url='login')
def mqttConfig(request):
    settings = SettingService.get_settings(constants.MQTT_SETTING_KEY)
    connected = mqtt_client.connected()
    if settings is not None:
        form = MqttForm(initial=settings)
    else:
        form = MqttForm()
    return render(request, 'base/mqtt.html', {"form": form, "connected": connected})


@login_required(login_url='login')
def mqttConnect(request):
    if request.method == "POST":
        form = MqttForm(request.POST)
        if form.is_valid():

            form_data = form.cleaned_data

            try:
                # Remove current connection
                if mqtt_client.connected():
                    mqtt_client.disconnect()

                SettingService.remove_setting(key=constants.MQTT_SETTING_KEY)
                SettingService.remove_setting(key=constants.LOCKER_INFO_SETTING_KEY)
    
                # connect to mqtt
                mqtt_config = MqttInfo(
                    host=form_data["host"].strip(),
                    port=form_data["port"],
                    username=form_data["username"].strip(),
                    password=form_data["password"].strip(),
                    secret_key=form_data["secret_key"].strip(),
                    locker_code = form_data["locker_code"].strip()
                )
                
                mqtt_client.start(mqtt_config)

                # check connection
                timeout = time.time() + 10  # 10s
                mqtt_connected = False
                locker_info = None

                while (time.time() < timeout):
                    # check mqtt connection
                    mqtt_connected = mqtt_client.connected()
                    
                    # check locker info
                    locker_info = SettingService.get_settings(
                        key=constants.LOCKER_INFO_SETTING_KEY)
                    
                    # check boxes

                    if mqtt_connected and locker_info is not None:
                        SettingService.save_setting(key=constants.MQTT_SETTING_KEY, value=mqtt_config)
                        
                        # response
                        return JsonResponse({"message": "Connect to MQTT broker successfully"}, status=200)                
                
                if not mqtt_connected:
                    return JsonResponse({"message": "Can't connect to MQTT broker"}, status=400)
                    
                if locker_info is None:
                    if mqtt_client.connected():
                        mqtt_client.disconnect()
                    return JsonResponse({"message": "Can't update Locker information. Check locker code or secret key"}, status=400)
                    
            except Exception as ex:
                return JsonResponse({"message": str(ex)}, status=400)

    return JsonResponse({"message": "Some error occurred"}, status=400)


@login_required(login_url='login')
def disconnectMqtt(request):
    try:
        if mqtt_client.connected():
            mqtt_client.disconnect()

        SettingService.remove_setting(key=constants.MQTT_SETTING_KEY)
        SettingService.remove_setting(key=constants.LOCKER_INFO_SETTING_KEY)
        BoxService.reset_boxes()
        
        return JsonResponse({"message": "Disconnect from MQTT broker successfully"}, status=200)  
    
    except Exception as ex:
        return JsonResponse({"message": str(ex)}, status=400)
            

# @login_required(login_url='login')
def checkMqttConnection(request):
    try:
        return JsonResponse({"connected": connected_to_server()}, status=200)  
    except Exception as ex:
        return JsonResponse({"message": str(ex)}, status=400)


@login_required(login_url='login')
def networkConfig(request):
    init_data = {
        "ip_address": networks.get_mac_address(),
        "mac_address": networks.get_private_ip_address(),
        "ip_config": json.dumps(networks.ipconfig(), indent=4),
    }

    return render(request, 'base/network.html', {"network": init_data})


@login_required(login_url='login')
def boxPage(request):
    if not connected_to_server():
        messages.warning(
            request, "Connect to MQTT broker to use this function")

    context = {}
    try:
        context["boxes"] = BoxService.get_boxes()
        context["boards"] = board.scan_slave_addresses()
    except Exception as e:
        messages.error(
            request, "[Board] Error when check boxes status: " + str(e))

    return render(request, "base/box-status.html", context)


@login_required(login_url='login')
def testBox(request):
    if request.method == "POST":
        board_no = request.POST["board_no"]
        pin = request.POST["pin"]
        
        if board_no is not None and pin is not None:
            try:
                if board.open_board_box(board_no=int(board_no), pin=int(pin)):
                    return JsonResponse({"message": "Open box successfully"}, status=200)
            except Exception as e:
                return JsonResponse({"message": str(e)}, status=400)

    return JsonResponse({"message": "Some error occurred"}, status=400)


@login_required(login_url='login')
def openBox(request):
    if request.method == "POST":
        box_number = request.POST["box_number"]
        if box_number is not None:
            try:
                if board.open_box(box_number):
                    return JsonResponse({"message": f"Open box {box_number} successfully"}, status=200)
            except Exception as e:
                return JsonResponse({"message": str(e)}, status=400)

    return JsonResponse({"message": "Some error occurred"}, status=400)


@login_required(login_url='login')
def addBox(request):
    if request.method == "POST":
        try:
            box_number = request.POST["box_number"]
            board_no = request.POST["board_no"]
            pin = request.POST["pin"]

            if not connected_to_server():
                return JsonResponse({"message": "Connect to MQTT Server before doing this action"}, status=400)

            # validate data
            if BoxService.get_box_number(box_number=box_number) is not None:
                return JsonResponse({"message": f"Box {box_number} existed"}, status=400)

            if BoxService.get_box(board_no=board_no, pin=pin) is not None:
                return JsonResponse({"message": f"Pin: {pin}, board: {board_no}  has been located"}, status=400)
            
            print(board_no, pin)

            if BoxService.add_box(box_number=box_number, board_no=board_no, pin=pin):
                mqtt_settings = SettingService.get_settings(key=constants.MQTT_SETTING_KEY)
                mqtt_client.publish(topic=topics.TOPIC_ADD_BOX, message=json.dumps({
                    "lockerCode": mqtt_settings["locker_code"],
                    "boxNumber": int(box_number),
                    "boardNo": int(board_no),
                    "pin": int(pin)
                }))
                
                return JsonResponse({"message": "Add new box successfully"}, status=200)

        except Exception as ex:
            return JsonResponse({"message": str(ex)}, status=400)

    return JsonResponse({"message": "Some error occurred"}, status=400)


@login_required(login_url='login')
def removeBox(request):
    if request.method == "POST":
        try:
            if not connected_to_server():
                    return JsonResponse({"message": "Connect to MQTT Server before doing this action"}, status=400)
            
            box_number = request.POST["box_number"]
            if BoxService.get_box_number(box_number=box_number) is None:
                return JsonResponse({"message": f"Box {box_number} not existed"}, status=400)
            
            BoxService.remove_box(box_number)

            mqtt_settings = SettingService.get_settings(
                key=constants.MQTT_SETTING_KEY)
            mqtt_client.publish(topic=topics.TOPIC_REMOVE_BOX, message=json.dumps({
                "lockerCode": mqtt_settings["locker_code"],
                "boxNumber": int(box_number)
            }))

            return JsonResponse({"message": f"Remove box {box_number} successfully"}, status=200)
        
        except Exception as ex:
            return JsonResponse({"message": str(ex)}, status=400)

    return JsonResponse({"message": "Some error occurred"}, status=400)


@login_required(login_url='login')
def resetBoxes(request):
    try:
        if not connected_to_server():
            return JsonResponse({"message": "Connect to MQTT Server before doing this action"}, status=400)
        
        BoxService.reset_boxes()

        mqtt_settings = SettingService.get_settings(
            key=constants.MQTT_SETTING_KEY)
        mqtt_client.publish(topic=topics.TOPIC_RESET_BOXES, message=json.dumps({
            "lockerCode": mqtt_settings["locker_code"]
        }))
        return JsonResponse({"message": f"Reset boxes successfully"}, status=200)
    except Exception as ex:
       return JsonResponse({"message": str(ex)}, status=400)


@login_required(login_url='login')
def loadBoxes(request):
    try:
        boxes = BoxService.get_boxes()
        return JsonResponse({"boxes": list(boxes)}, status=200)
    except Exception as ex:
        return JsonResponse({"message": str(ex)}, status=400)


# NETWORK VIEWS
def check_internet(request):
    # request should be ajax and method should be POST.
    if request.method == "GET":
        # get the form data
        internet_connected = NetworkService.check_internet()
        internet_connection = {
            "connected": internet_connected
        }

        return JsonResponse(internet_connection, status=200)

    # some error occured
    return JsonResponse({"error": ""}, status=400)


def information(request):
    context = {
        "info": SettingService.get_settings(key=constants.LOCKER_INFO_SETTING_KEY)
    }
    
    return render(request, 'base/info.html', context=context)
    
def connected_to_server() -> bool:
    locker_info = SettingService.get_settings(key=constants.LOCKER_INFO_SETTING_KEY)
    mqtt_info = SettingService.get_settings(key=constants.MQTT_SETTING_KEY)
    connected = mqtt_client.connected() and locker_info is not None and mqtt_info is not None and locker_info["locker_code"] == mqtt_info["locker_code"]  
    return connected;
