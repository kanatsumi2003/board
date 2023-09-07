from apscheduler.schedulers.background import BackgroundScheduler
from ..utils import board

def start():
    scheduler = BackgroundScheduler()
    # run this job every 24 hours
    scheduler.add_job(board.scan_slave_addresses, 'interval', seconds=10, name='scan_rs485_slave', replace_existing=True)
    scheduler.start()
