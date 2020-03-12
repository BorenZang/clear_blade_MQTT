# clear_blade_MQTT
The repository stores the key scripts of a mqtt service accomplished by Clearblde platform

The python file collects basic memory information of my Mac laptop and sends it to Clearblade platform


createMeoryCollection_service.js is a code service running on Clearblade Platform which stores the information recieved into Collections after every publish of a sigle row in Messaging


fetchMemoryCollection is a code services runs every minute on Clearblade Platform to publish the latest memory percentage used on my laptop to the "analytics" Topic
