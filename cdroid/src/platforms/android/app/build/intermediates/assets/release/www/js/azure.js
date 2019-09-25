'use strict';

//var Protocol = require('azure-iot-device-mqtt').Mqtt;

// Uncomment one of these transports and then change it in fromConnectionString to test other transports

// var Protocol = require('azure-iot-device-amqp').AmqpWs;

// var Protocol = require('azure-iot-device-http').Http;

var Protocol = require('azure-iot-device-amqp').Amqp;

// var Protocol = require('azure-iot-device-mqtt').MqttWs;

var Client = require('azure-iot-device').Client;

var Message = require('azure-iot-device').Message;

 

// String containing Hostname, Device Id & Device Key in the following formats:

//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"

var connectionString = 'HostName=iothubforapp.azure-devices.net;DeviceId=appdevice1;SharedAccessKey=bwfaSw5fV+oPtW1BzcHSJXUon8E39c7ZhmX52FJFWmg=';

 

// fromConnectionString must specify a transport constructor, coming from any transport package.

var client = Client.fromConnectionString(connectionString, Protocol);

 

var connectCallback = function (err) {

  if (err) {

    console.error('Could not connect: ' + err.message);

  } else {

    console.log('Client connected');

    client.on('message', function (msg) {

      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);

      // When using MQTT the following line is a no-op.

      client.complete(msg, printResultFor('completed'));
    });


    // Create a message and send it to the IoT Hub every two seconds

    var sendInterval = setInterval(function () {

      var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]

      var temperature = 20 + (Math.random() * 10); // range: [20, 30]

      var humidity = 60 + (Math.random() * 20); // range: [60, 80]

      var data = JSON.stringify({ deviceId: 'AndroidIoT', windSpeed: windSpeed, temperature: temperature, humidity: humidity });

      var message = new Message(data);

      message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');

      console.log('Sending message: ' + message.getData());

      client.sendEvent(message, printResultFor('send'));

    }, 2000);

 

    client.on('error', function (err) {

      console.error(err.message);

    });

 

    client.on('disconnect', function () {

      clearInterval(sendInterval);

      client.removeAllListeners();

      client.open(connectCallback);

    });

  }

};


client.open(connectCallback);


function printResultFor(op) {

  return function printResult(err, res) {

    if (err) console.log(op + ' error: ' + err.toString());

    if (res) console.log(op + ' status: ' + res.constructor.name);

  };

}

