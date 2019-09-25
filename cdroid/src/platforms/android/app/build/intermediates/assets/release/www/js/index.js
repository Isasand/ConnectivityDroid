/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var m_protocol = ""; 
var m_lat = ""; 
var m_lon = ""; 
var m_power = 0; 
var m_quality = 0;
var savedPoints = []; 
var tablePoints = []; 
var attached = false; 
var detached = false; 
var searching = 0; 

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        //turn bluetooth on if it is not enabled
        if(device.platform =="Android"){
            checkBluetoothStatus(); 
        }
    }
};

app.initialize();

function checkBluetoothStatus(){

    //if it is enabled, dont do anything special for now
    var enabled = function(){
    }; 

    //callbacks for isEnabled function 
    var notEnabled = function(){
        //if not enabled, try to enable
        bluetoothSerial.enable(function(){
            showToast("Enabled bluetooth"); 
        }, function(){
            showToast("Unable to enable bluetooth"); 
        });
    }; 
    //check if bluetooth is enabled and otherwise ask to turn it on
    bluetoothSerial.isEnabled(enabled, notEnabled); 
}

function showFirstPage(){
    $("#progressbars, #info, #title, #buttons, #testpage, #aboutpage, #historypage, #protocol").hide(); 
    $("#scanBtnDiv, #starttext, #title, #banner").show();  
}

function pairBluetooth(){
    //change text of button 
    var out = document.getElementById("scanBtn"); 
    out.innerHTML = "SCANNING.."; 

    //empty list to collect discovered devices
    var items = []; 

    //scan devices and put them in a list
    //sort this callback out to do something when it fails
    bluetoothSerial.discoverUnpaired(function(devices){
        devices.forEach(function(device){
            var obj = {}; 
            if(typeof device.name !== 'undefined'){
                obj['text'] = JSON.stringify(device.name); 
                obj['value'] = JSON.stringify(device.id);
                items.push(obj);
            }
        })
        //make a scroll list of the devices 
        var config = {
            title: "Discovered devices", 
            items: items,
            selectedValue: items[0].name,
            doneButtonLabel: "Done",
            cancelButtonLabel: "Cancel"
        };

        /*
        callbacks for a successfull and failed connection 
        */
        var connectSuccess = function(){
            showToast("Paired");
            //if connected, show scan page 
            showScanPage();
            bluetoothSerial.subscribe('#', function(data){
                subHandler(data); 
            }, function(){ 
                //fail
            })
            attached = true; 
            //get longitude and latitude 
            //TODO: make this update based on an interval 
            navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError);
            //request imsi and current protocol from device application 
            bluetoothSerial.write('0'); 
        }

        var connectFailure = function(){
            showToast("Error connecting to device"); 
            out.innerHTML = "SCAN DEVICES";
        }

        /*
        show picker and connect to the selected device
        show an alert if user cancel
        */
        window.plugins.listpicker.showPicker(config, 
            function(item) { 
                bluetoothSerial.connect(JSON.parse(item), connectSuccess, connectFailure);
            },
            function() { 
                alert("Cancelled");
                out.innerHTML = "SCAN DEVICES"; 
            }
        );
    });
}

//handle subscription to get incoming data to the right place.. 
function subHandler(data){
    var fields = data.split(':'); 

    //showToast(data); 
    //if we recieved IMSI 
    if(fields[0] == "IMSI"){
        var imsi = document.getElementById("imsi");
        imsi.innerHTML = "IMSI: " + fields[1].replace('#', '' ); 
    }   
    
    //if we recieved power and quality 
    else if(fields[0] == "PQ"){
        if(fields[1].replace('#', '') != "255" && fields[2].replace('#', '') != "255"){
            searching = 0; 
            document.getElementById("error").innerHTML = "";
            fields[1] = parseInt(fields[1]); 
            fields[2] = parseInt(fields[2].replace('#', '')); 

            //map quality to dBm
            var quality = mapToRange(fields[1], 0, 34, -3, -19); 
            var qualityProgress = fields[1];

            //save current quality to our global quality variable 
            m_quality = quality; 

            //map Power to dB
            var power = mapToRange(fields[2], 0, 98, -44, -141);
            var powerProgress = fields[2];

            //save current power to ous global power variable 
            m_power = power; 
            var max = -219.99078369140625;
            forEach(document.querySelectorAll('.progress'), function (index, value) {
                
                if(value.getAttribute('id') == 'powerbar'){
                    percent = powerProgress; 
                    value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((98 - percent) / 98) * max);
                    value.querySelector('.value').innerHTML = Math.round(power);
                }

                if(value.getAttribute('id') == 'qualitybar'){
                    percent = qualityProgress; 
                    value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((34 - percent) / 34) * max);
                    value.querySelector('.value').innerHTML = Math.round(quality); 
                }
            })
        }
        else{
            document.getElementById("error").innerHTML ="Searching..."; 
            searching +=1; 
            if(searching > 10){
                document.getElementById("error").innerHTML ="no network service"; 
            }
        }
    }

    //if we recieved anything else 
    else if(fields[0] == "ALERT"){
        //if attach did not succeed
        if(fields[1].replace('#', '') == "A_FALSE"){
            attached = false; 
            detached = true; 
            showToast("Attach not successful"); 
        }
        //if detach did not succeed
        else if(fields[1] .replace('#', '') == "D_FALSE"){
            detached = false; 
            attached = true; 
            showToast("Detach not successful");
        }
        else{
            showToast(fields[1].replace('#', ''));
        }
    }

    else if(fields[0] == "PROTOCOL"){
        if(fields[1].replace('#', '') == "0"){
            m_protocol = "NB"; 
            $('#refresh').show(); 
        }
        else{
            m_protocol = "LTE-M";
            $('#refresh').hide(); 
        }
        var max = -219.99078369140625;
        forEach(document.querySelectorAll('.progress'), function (index, value) {
                   
            if(value.getAttribute('id') == 'powerbar'){
                value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((98 - 0) / 98) * max);
                value.querySelector('.value').innerHTML = 0;
            }
            if(value.getAttribute('id') == 'qualitybar'){
                value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((34 - 0) / 34) * max);
                value.querySelector('.value').innerHTML = 0; 
            }
        })
        document.getElementById("currentProtocol").innerHTML = "Protocol : " + m_protocol; 
    }
    
    else if(fields[0] == "ECHO"){
        alert("Success: " + fields[2].replace('#', ' ')); 
    }

    else{
        ///unknown data
        //showToast(data); 
    }

}

/*
hide and show elements for three different pages 
*/

function showScanPage(){
    $('#test, #about, #history').removeClass('active'); 
    $('#scanpage').addClass('active'); 

    bluetoothSerial.isConnected(
        function(){
            $("#small-logo, #progressbars, #info, #buttons, #protocol").show(); 
            $('#banner, #starttext, #aboutpage, #testpage, #scanBtnDiv, #title, #historypage').hide(); 
            if(m_protocol == "LTE-M"){
                $('#refresh').hide(); 
            }
        },
        function(){
            $("#progressbars, #info, #title, #buttons, #testpage, #aboutpage, #historypage, #protocol").hide(); 
            $("#scanBtnDiv, #starttext, #title, #banner").show();  
        }
    ); 
}

function showTestPage(){
    $('#test').addClass('active'); 
    $('#scanpage, #about, #history').removeClass('active'); 
    $('#banner, #progressbars, #scanBtnDiv, #aboutpage, #info, #title, #buttons, #starttext, #historypage, #protocol').hide(); 
    $('#testpage, #small-logo').show(); 
}

function showAboutPage(){
    $('#test, #scanpage, #history').removeClass('active'); 
    $('#about').addClass('active'); 
    $('#banner, #progressbars, #scanBtnDiv, #info, #title, #buttons, #testpage, #starttext, #historypage, #protocol').hide(); 
    $('#aboutpage, #small-logo').show(); 
}

var forEach = function (array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};

/*
Geo positioning 
Possible geo data: 
latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp
*/

var geoOnSuccess = function(position) {
    document.getElementById('lat').innerHTML = "Latitude : " + position.coords.latitude;
    m_lat = position.coords.latitude;
    document.getElementById('lon').innerHTML = "Longitude : " + position.coords.longitude; 
    m_lon = position.cords.longitude; 
};

// onError Callback receives a PositionError object
function geoOnError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

/*    
map an input from one range to an other
used to map the signal power and quality data
*/

function mapToRange(Input, InputLow, InputHigh, OutputHigh, OutputLow){
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}

function sendToEcho(){
    bluetoothSerial.isConnected(function(){
        var input = document.getElementById("data"); 
        //alert("Sending " + input.value + " to UBLOX echo server");
        bluetoothSerial.write('6');
        bluetoothSerial.write(input.value); 
        showToast("Sending " + input.value + " to echo server"); 
        input.value = ""; 
    }, function(){
        showToast("Not connected to any device."); 
    });
}

function sendToIp(){
    /*var ip = document.getElementById("ipserver"); 
    var port = document.getElementById("portserver"); 
    var data = document.getElementById("dataserver");
    alert("sending " + data.value + " to port " + port.value + " on IP " + ip.value);
    port.value = ""; 
    data.value = ""; 
    ip.value = ""; */
    alert("Sending to server not supported in this version."); 
}

function sendToAzure(){
    alert("Sending to Azure not supported in this version.");
}

function saveMeasurements(){
    //update coordinates and timestamp
    navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError);

    //fill a point object with the current values
    var point = {
        longitude: m_lon, 
        latitude : m_lat, 
        timestamp : new Date().toLocaleString(),
        power : m_power, 
        quality : m_quality,
        protocol : m_protocol
    }
    //push it into the list of saved points
    savedPoints.push(point); 
    tablePoints.push(point);
    alert("Saved!"); 
}

function dateToEpoch(date){
    return (date.getTime() / 1000); 
}

function showHistoryPage(){
    //TODO SHOW HISTORY
    
    $('#test, #scanpage, #about').removeClass('active'); 
    $('#history').addClass('active'); 
    $('#banner, #aboutpage, #progressbars, #scanBtnDiv, #info, #title, #buttons, #testpage, #starttext, #banner, #protocol').hide(); 
    $('#historypage, #small-logo').show(); 
    
    //generate table from saved arrays
    generateTable(); 
    
}

function generateTable(){
    var table = document.getElementById("table"); 

    //make a row and columns for each point we have saved 

    tablePoints.forEach(function(element){
        var row = table.insertRow(0); 
        var cell1 = row.insertCell(0); 
        var cell2 = row.insertCell(1); 

        cell1.innerHTML = element.timestamp; 
        cell2.innerHTML = element.protocol; 
    });
    tablePoints = []; 
}


//request device for power and quality 
function signalRequest(){
    var SIGNALREQUEST = '1'; 
    //success and failiure for sending data 
    var sendSuccess = function(){
        showToast("Waiting for device.."); 
    }

    var failure = function(){
        showToast("Error: could not send message to device"); 
    }
    bluetoothSerial.write(SIGNALREQUEST, sendSuccess, failure);
}

//request device to change protocol to NB or Cat M1
function protocolRequest(){
    /*var PROTOCOLREQUEST = '2'; 
    bluetoothSerial.write(PROTOCOLREQUEST);
    showToast("Sending request to change protocol");*/
    alert("Only Narrowband IoT is supported in this version"); 
}

//send a request for refresh to device
function refreshRequest(){
    bluetoothSerial.isConnected(function(){
        var REFRESHREQUEST = '3'; 
        bluetoothSerial.write(REFRESHREQUEST);
        showToast("Sending refresh request..."); 
    }, function(){
        showToast("Not connected to any device"); 
    }); 
}

//send a request for attachment to device
function attachRequest(){
    bluetoothSerial.isConnected(function(){
        if(attached){
            showToast("Already attached. Try to detach from network first."); 
        }
        else{
            var ATTACHREQUEST = '4'; 
            bluetoothSerial.write(ATTACHREQUEST, function(){
                showToast("Sending attach request"); 
            });
            attached = true; 
            detached = false; 
        }
    }, function(){
        showToast("Not connected to any device."); 
    }); 
}

//send a request for detach to device
function detachRequest(){
    bluetoothSerial.isConnected(function(){
        if(detached){
            showToast("Already detached. Try to attach from network first."); 
         }
         else{
             var DETACHREQUEST = '5'; 
             bluetoothSerial.write(DETACHREQUEST, function(){
                 showToast("Sending detach request"); 
             });
             attached = false; 
             detached = true; 
         }
    }, function(){
        showToast("Not connected to any device."); 
    }); 
}

//toggle an display element
function toggleEl(elementID) {
    var x = document.getElementById(elementID);
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function showToast(message){
    window.plugins.toast.showWithOptions(
        {
            message: message,
            duration: "short",
            position: "top",
            addPixelsY: 0 
        }  
    );
}

//TODO: try to connect to paired devices
function connectToPaired(){
    bluetoothSerial.list(function(list){
        alert(Object.size(list)); 
        for(var i = 0; i < Object.size(list); i++){
            if(list[i].name === "HC-06"){
                alert(JSON.stringify(list[i].id)); 
                /*bluetoothSerial.connect(list[i].id, function(i){
                    i = Object.size(list);
                    alert("Connecting to " + JSON.stringify(list[i].id));
                }, function(){
                    alert("Not able to connect to" + JSON.stringify(list[i].id) ); 
                });*/
            }
        }
    });
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


$(document).ready(function(){
    //set eventhandlers for the elements on startup 
    $('#test').click(function(){ showTestPage(); return false; });
    $('#about').click(function(){ showAboutPage(); return false; });
    $('#scanpage').click(function(){ showScanPage(); return false; });
    $('#history').click(function(){ showHistoryPage(); return false; });
    $('#sendtestecho').click(function(){ sendToEcho(); return false;});
    $('#sendtoip').click(function(){ sendToIp(); return false; });
    $('#send').click(function(){ sendToAzure(); return false; });
    $('#save').click(function(){ saveMeasurements(); return false;});
    $('#attach').click(function(){ attachRequest(); return false; });
    $('#detach').click(function(){ detachRequest(); return false; });
    $('#scanBtn').click(function(){ AppCenter.Crashes.generateTestCrash(); return false; });
    $('#protocol').click(function(){ protocolRequest(); return false; });
    $('#refresh').click(function() { refreshRequest(); return false; });
    $('#scan').click(function(){ signalRequest(); return false; });
    setInterval(navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError), 60000);
    
});