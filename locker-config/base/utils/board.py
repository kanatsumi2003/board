import minimalmodbus
import logging
from ..services import BoxService
import time
import platform

board_addresses = [];
SWITCH_PIN = 0
SERIAL_BAURATE = 19200

SERIAL_PORT = ''
if platform.system().lower()=="windows":
    SERIAL_PORT = "COM6"
elif platform.system().lower()=="linux":
    SERIAL_PORT = "/dev/ttyUSB0"
else:
    raise Exception('Platform is not supported') 

def open_board_box(board_no: int, pin: int) -> bool:
    instrument = minimalmodbus.Instrument(SERIAL_PORT, board_no)  
    instrument.serial.baudrate = SERIAL_BAURATE; 
    instrument.write_register(int(pin), int(1), 0)
    time.sleep(0.01)
    instrument.write_register(int(pin), int(0), 0)
    return True
    
def open_box(box_number: int) -> bool:
    # get box
    box = BoxService.get_box_number(box_number)
    if box is None:
        logging.info(f"[Modbus] Box {box_number} not found")
        return False
    return open_board_box(board_no=box.board_no, pin=box.pin)

def check_boxes_closed() -> bool:
    # get all board and check switch
    board_addresses = scan_slave_addresses();
    if not board_addresses:
        return False;

    for board in board_addresses:
        instrument = minimalmodbus.Instrument(SERIAL_PORT, board)
        instrument.serial.baudrate = SERIAL_BAURATE; 
        
        closed = instrument.read_register(SWITCH_PIN, 0)
        if closed == 1:
            return False
    return True

def scan_slave_addresses(start_address=1, end_address=8, baudrate=SERIAL_BAURATE, port=SERIAL_PORT) :
    logging.info("[MOBUS] Start scan slave address...")
    board_addresses = []
    for address in range(start_address, end_address + 1):
        try:
            instruement = minimalmodbus.Instrument(port, address)        
            instruement.serial.baudrate = baudrate
            response = instruement.read_register(0, functioncode=3)
            
            board_addresses.append(address)
            
            logging.info(f"[Modbus] Address {address} response {response}")
            
        except minimalmodbus.NoResponseError:
            logging.error(f"[Modbus] Address {address}: No response")
            # return board_addresses;
    
        except Exception as ex:
            logging.error(f"[Modbus] Error {ex}")
            raise ex;
            
    return board_addresses
