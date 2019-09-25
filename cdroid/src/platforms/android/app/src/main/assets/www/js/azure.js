'use strict';

module.exports.default = connectAndSend(); 



function connectAndSend(){

  var Protocol = require('azure-iot-device-mqtt').Mqtt;
  var Client = require('azure-iot-device').Client;
  var Message = require('azure-iot-device').Message;

  var connectionString = "HostName=iot-devices-dev-1.azure-devices.net;DeviceId=ConDroid;SharedAccessKey=G9FjI7cVFeetImvJrkwIVpjx+/2xwnCLNRdkRM61YZ4=";

// fromConnectionString must specify a transport constructor, coming from any transport package.

  var client = Client.fromConnectionString(connectionString, Protocol);
  client.open();
  console.log("connected"); 

  var data = JSON.stringify({ deviceId: 'ConDroid', imsi: 1234567890, lat: 18.453628, lon: 58.9329392, power: 43, quality: 21, network: "narrowband", timestamp: "17:59" });

  var message = new Message(data);

  client.sendEvent(message);
  console.log("Sent"); 
};
