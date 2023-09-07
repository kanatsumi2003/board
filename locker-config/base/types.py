
from dataclasses import dataclass
from dataclasses_json import dataclass_json
from typing import Optional

@dataclass_json
@dataclass
class LockerInfo:
    locker_id: int
    locker_name: str
    locker_status: str
    locker_code: str
    api_host: str
    api_key: str

@dataclass_json
@dataclass
class MqttInfo:
    host: str
    port: int
    username: str
    password: str
    secret_key: str
    locker_code: str
    connected: Optional[bool] = None

@dataclass_json
@dataclass
class NetworkInfo:
    ip_address: str
    mac_address: str
    ip_config: str
