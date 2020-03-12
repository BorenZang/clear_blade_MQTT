from clearblade.ClearBladeCore import System, Query, Developer
import psutil
import platform
import time
from datetime import datetime

#grabing system information of my own laptop
def get_size(bytes, suffix="B"):
    """
    Scale bytes to its proper format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor

# System credentials
SystemKey = "ce8dd0e50b8acd82fc969396be3f"
SystemSecret = "CE8DD0E50BE0B183A7EDC89EA39001"

mySystem = System(SystemKey, SystemSecret)

# Log in as Sanket
boren = mySystem.User("borenzang@gmail.com", "19990219Zbr#")

# Use Boren to access a messaging client
mqtt = mySystem.Messaging(boren)

#Connect
mqtt.connect()

#When i connect to the broker, start publishing sytem information to the update topic in a static 1s interval

while(True):
    #Grab memory Information
    svmem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    mem_total = f"{get_size(svmem.total)}"
    mem_available = f"{get_size(svmem.available)}"
    mem_used = f"{get_size(svmem.used)}"
    mem_per = f"{svmem.percent}%"
    swap_total = f"{get_size(swap.total)}"
    swap_free = f"{get_size(swap.free)}"
    swap_used = f"{get_size(swap.used)}"
    swap_percentage = f"{svmem.percent}%"
    mqtt.publish("mem_info", mem_total)
    mqtt.publish("mem_info", mem_available)
    mqtt.publish("mem_info", mem_used)
    mqtt.publish("mem_info", mem_per)
    mqtt.publish("mem_info", swap_total)
    mqtt.publish("mem_info", swap_free)
    mqtt.publish("mem_info", swap_used)
    mqtt.publish("mem_info", swap_percentage)

    code = mySystem.Service("createMemoryCollection")
    params = {
        "item":{
            "memory_total":mem_total,
            "memory_available": mem_available,
            "memory_used": mem_used,
            "memory_percentage": mem_per,
            "swap_memory_total": swap_total,
            "swap_memory_free":swap_free,
            "swap_memory_used":swap_used,
            "swap_memory_percentage":swap_percentage
        }
    }
    code.execute(boren, params)
    time.sleep(1)


mqtt.disconnect()
