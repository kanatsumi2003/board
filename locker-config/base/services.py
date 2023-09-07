from .models import Setting, Box
from .utils import networks
from .mqtt import client as mqtt_client
import logging
from .types import NetworkInfo
import requests

class NetworkService:
    @staticmethod
    def get_network_info() -> NetworkInfo:
        try:
            info = NetworkInfo(
                ip_address=networks.get_private_ip_address(),
                mac_address=networks.get_mac_address(),
                ip_config=networks.ipconfig()
            )
            return info
            
        except Exception as ex:
            logging.error(f"Error when load network info: {str(ex)}")
            return None
    
    @staticmethod
    def update_network_info(ip_address, mac_address, ip_config):
        if ip_address is not None:
            ip_address_config = NetworkService.get_private_ip()
            ip_address_config.value = ip_address
            ip_address_config.save()
        
        if mac_address is not None:
            mac_address_config = NetworkService.get_mac_address()
            mac_address_config.value = mac_address
            mac_address_config.save()
        
        if ip_config is not None:
            ip_config_config = NetworkService.get_ip_config()
            ip_config_config.value = ip_config
            ip_config_config.save()
            
    @staticmethod
    def check_internet():
        try:
            res = requests.get('https://google.com')
            if res.status_code:
                return True
            else:
                return False
        except Exception as err: 
            return False

class SettingService:
    @staticmethod
    def get_settings(key: str):
        settings = Setting.objects.filter(key=key).first()
        if settings is None:
            return None
        return settings.value 
    
    @staticmethod
    def save_setting(key: str, value) -> None:
        settings = Setting.objects.filter(key=key).first()
        if settings is None:
            settings = Setting(key=key, value=value)
        else:
            settings.value = value
        
        settings.save()
    
    @staticmethod
    def remove_setting(key: str) -> None:
        settings = Setting.objects.filter(key=key).first()
        if settings is not None:
            settings.delete()

class BoxService:
    @staticmethod
    def get_boxes():
        return Box.objects.values().order_by('number')
    
    @staticmethod
    def add_box(board_no: int, box_number: int, pin: int) -> bool:
        box = Box(board_no=board_no, number=box_number, pin=pin)

        if BoxService.get_box_number(box_number) is not None:
            return False
        if BoxService.get_box(board_no=box.board_no, pin=box.pin):
            return False

        box.save()
        return True
    
    
    @staticmethod
    def get_box_number(box_number: int) -> Box:
        return Box.objects.filter(number=box_number).first()
    
    @staticmethod
    def get_box(board_no: int, pin: int) -> Box:
        return Box.objects.filter(board_no=board_no, pin=pin).first()
    
    @staticmethod
    def remove_box(box_number: int):
        box = BoxService.get_box_number(box_number=box_number) 
        if box is not None:
            box.delete()
    
    @staticmethod
    def reset_boxes():
        Box.objects.all().delete()
