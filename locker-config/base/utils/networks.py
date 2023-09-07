# import module
import os
import uuid
import ifcfg
import socket
import platform
import subprocess

def get_mac_address():
    mac_address = uuid.getnode()
    mac_address_hex = ':'.join(['{:02x}'.format((mac_address >> elements) & 0xff) for elements in range(0,8*6,8)][::-1])
    return mac_address_hex

def get_private_ip_address():
    try:
        # Create a socket object
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
        # Connect to a public server (in this case, Google's DNS server)
        sock.connect(("8.8.8.8", 80))
        
        # Get the socket's local address
        private_ip = sock.getsockname()[0]
        
        return private_ip
    except socket.error:
        return None
    
def ipconfig():
    return ifcfg.interfaces()

def ping(host: str) -> bool:
    param = '-n' if platform.system().lower()=='windows' else '-c'
    command = ['ping', param, '1', host]
    
    return subprocess.call(command) == 0

