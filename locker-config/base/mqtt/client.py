import logging
from paho.mqtt import client as mqtt_client
from paho.mqtt.properties import Properties
from paho.mqtt.packettypes import PacketTypes 
import json
from . import topics
from ..utils import board, secure
from .. import constants, services
from ..types import LockerInfo, MqttInfo
from datetime import datetime, timezone

MQTT_CLIENT = None
SECRET_KEY = None
MQTTv5 = 5
SIGNATURE_PROPERTY = 'signature'

def on_disconnect(client, userdata, rc, properties=None) -> bool:
    global MQTT_CLIENT
    MQTT_CLIENT = None
    
    if rc == 0:        
        logging.info("[MQTT] MQTT gracefully disconnected")
        return True
    else:
        logging.info("[MQTT] Unexpected MQTT disconnection. Will auto-reconnect")
        return False


def connect_mqtt(host, port, username, password, locker_code) -> mqtt_client:
    def on_connect(client, userdata, flags, rc, properties=None):
        logging.info(f"[MQTT] Connected/Reconnected with result code {rc}")
        if rc == 0:
            global MQTT_CLIENT
            MQTT_CLIENT = client
            
            networkInfo = services.NetworkService.get_network_info()
            
            # send connect message
            publish(topics.TOPIC_CONNECT, json.dumps({
                "lockerCode": locker_code,
                "ipAddress": networkInfo.ip_address,
                "macAddress": networkInfo.mac_address,
            }))

            logging.info("[MQTT] Connected to the MQTT Broker!")

            # Subscribe topics
            subscribe(topic=f"{topics.TOPIC_OPEN_BOX}/{locker_code}", locker_code=locker_code)
            subscribe(topic=f"{topics.TOPIC_UPDATE_INFO}/{locker_code}", locker_code=locker_code)

    # Disconnect current connection
    if connected:
        try:
            global MQTT_CLIENT
            MQTT_CLIENT.disconnect()
            MQTT_CLIENT = None
        except Exception as ex:
             logging.error("[MQTT] Error when disconnected from MQTT!")
            
    client = mqtt_client.Client(protocol=MQTTv5)
    client.username_pw_set(username, password)

    # last will message
    lwMessage = json.dumps({"lockerCode": locker_code})
    publish_properties = Properties(PacketTypes.PUBLISH)
    publish_properties.UserProperty = (SIGNATURE_PROPERTY, secure_message(lwMessage))
    
    client.will_set(topics.TOPIC_DISCONNECT, lwMessage , 2, False, properties=publish_properties)

    client.on_connect = on_connect
    client.connect(host, port, keepalive=30)

    return client


def disconnect():
    mqtt_settings = services.SettingService.get_settings(key=constants.MQTT_SETTING_KEY)
    if mqtt_settings is None:
        return

        # send disconnect message
    result = publish(topics.TOPIC_DISCONNECT, json.dumps({
            "lockerCode": mqtt_settings["locker_code"]
        }))
    if result:
        MQTT_CLIENT.disconnect()


def publish(topic, message) -> bool:
    global MQTT_CLIENT
    if not connected():
        return False
    
    publish_properties = Properties(PacketTypes.PUBLISH)
    publish_properties.UserProperty = (SIGNATURE_PROPERTY, secure_message(message))

    result = MQTT_CLIENT.publish(topic, message, qos=2, properties=publish_properties)
    result.wait_for_publish(2)
    
    status = result[0]
    if status == 0:
        logging.info(f"[MQTT] Pushlish message successfully: {message}")
        return True
    else:
        logging.info(f"[MQTT] Failed to pushlish message {message}")
        return False


def subscribe(topic, locker_code) -> bool:
    global MQTT_CLIENT
    if not connected():
        return False

    def on_message(client, userdata, message):
        if not connected():
            return False
    
        try:
            topic = message.topic
            message_decode = str(message.payload.decode("utf-8", "ignore"))
            data = json.loads(message_decode)
            
            # Validate signature
            user_properties = list(filter(lambda property: property[0] == SIGNATURE_PROPERTY, message.properties.UserProperty))
            signature_property = user_properties[0] if user_properties else None
            signature = signature_property[1] if signature_property else None;
            
            if signature is None or not secure.verify(message_decode, signature, SECRET_KEY):
                logging.error(f"[MQTT] Validate message failed. Invalid message signature")
                return False
            
            # check locker code
            if data["lockerCode"] is None or data["lockerCode"] != locker_code:
                return False
            
            logging.info(
                f"[MQTT] Topic: {topic}. Receive message from broker: {message_decode}")

            if topic.startswith(topics.TOPIC_OPEN_BOX):
                # open box
                box_number=data["boxNumber"]
                board.open_box(box_number=box_number)

            elif topic.startswith(topics.TOPIC_UPDATE_INFO):
                locker_info = LockerInfo(
                    locker_id=data["lockerId"],
                    locker_code=data["lockerCode"],
                    locker_name=data["lockerName"],
                    locker_status=data["lockerStatus"],
                    api_host=data["apiHost"],
                    api_key=data["apiKey"],
                    boxes=data["boxes"])
                logging.info(f"[MQTT] Updated information: {locker_info}")
            
                services.SettingService.save_setting(key=constants.LOCKER_INFO_SETTING_KEY, value=locker_info)
                
                # Save boxes
                services.BoxService.reset_boxes();
                for box in locker_info.boxes:
                    services.BoxService.add_box(box_number=box["number"], board_no=box["boardNo"], pin=box["pin"])
                
        except Exception as ex:
            logging.error(f"[MQTT] Error when receive message. {str(ex)}")
            return False

    MQTT_CLIENT.subscribe(topic)
    MQTT_CLIENT.on_message = on_message
    return True


def on_log(client, userdata, level, buf):
    logging.info(f"[MQTT] {buf}")


def start(mqtt_config: MqttInfo):
    global SECRET_KEY
    SECRET_KEY = mqtt_config.secret_key;
    
    # Connect to broker
    client = connect_mqtt(mqtt_config.host, mqtt_config.port, mqtt_config.username, mqtt_config.password, mqtt_config.locker_code)
    client.on_disconnect = on_disconnect
    client.on_log = on_log
    # Start loop
    client.loop_start()


def connected() -> bool:
    global MQTT_CLIENT
    return MQTT_CLIENT is not None;


def secure_message(message) -> str:
    return secure.hash_message(message, SECRET_KEY)
