# Connectivity Droid

Android app for communicating with the NB/LTE Connectivity checker.

## Startup 

User must grant the application access to location and bluetooth. 
This will be asked on startup. 

## Connecting to device 

User may be asked to enter a pass code first time connecting to device. This is "0000" or "1234" by default. 

### Communication between device application and Condroid

IMSI:     
Will be recieved once after connection like this:     
IMSI:<imsi>#

```
IMSI:123458690#
```

PROTOCOL: 
Will be recieved once after connection like this: 
PROTOCOL:<protocol>#

Protocol will be recieved as a bool. 
0 > Narrowband IoT.
1 > LTE Cat M1.

```
PROTOCOL:0#
```

POWER AND QUALITY:      
Will be recieved when Android sends '1'.     
PQ:<power>:<quality>#

```
PQ:23:45#
```

CHANGE PROTOCOL:      
Will be done when Android sends '2.      
Answer will be recieved in following format:

ALERT:<message>#

```
ALERT:Changed protocol to NB-IoT#
```

REFRESH REQUEST:     
Will be requested when Android sends '3'.     
Answer will be recieved in following format:

ALERT:<message>#

```
ALERT:Refresh successful#
```

ATTACH REQUEST:      
Will be requested when Android sends '4'.      
Answer will be recieved in following format:

ALERT:<message>#

```
ALERT:Attach successful#
```

DETACH REQUEST:      
 Will be requested when Android sends '5'.      
Answer will be recieved in following format: 

ALERT:<message>#

```
ALERT:Detach successful#
```

SEND DATA REQUEST: 
Will be requested when Android sends '6' followed by the data to send.

Example: 
```
6DataToSend
```

Answer will be recieved like this

```
ECHO:EchoedData#
```

