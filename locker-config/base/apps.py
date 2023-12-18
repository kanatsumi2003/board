from django.apps import AppConfig

def start_connection() -> None:
    from .mqtt import client as mqtt_client
    import logging
    import json
    from .import services, constants, types
    from .scheduler import scheduler
    
    # init MQTT connection
    try:
        mqtt_settings = services.SettingService.get_settings(key=constants.MQTT_SETTING_KEY)
        if mqtt_settings is not None:
            mqtt_client.start(types.MqttInfo(
                host=mqtt_settings["host"],
                port=mqtt_settings["port"],
                username=mqtt_settings["username"],
                password=mqtt_settings["password"],
                locker_code=mqtt_settings["locker_code"],
                secret_key=mqtt_settings["secret_key"]
            ))
    except Exception as e:
        logging.error(f"Failed to connect mqtt broker. {str(e)}")
        
class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'
    
    def ready(self, *args, **kwargs) -> None:
        import sys
        
        is_manage_py = any(arg.casefold().endswith("manage.py") for arg in sys.argv)
        is_runserver = any(arg.casefold() == "runserver" for arg in sys.argv)

        if (is_manage_py and is_runserver) or (not is_manage_py):
            start_connection()
        