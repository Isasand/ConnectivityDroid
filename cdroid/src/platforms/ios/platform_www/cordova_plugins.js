cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
    "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
    "pluginId": "cordova-plugin-bluetooth-serial",
    "clobbers": [
      "window.bluetoothSerial"
    ]
  },
  {
    "id": "cordova-plugin-context-menu.ContextMenu",
    "file": "plugins/cordova-plugin-context-menu/www/ContextMenu.js",
    "pluginId": "cordova-plugin-context-menu",
    "clobbers": [
      "ContextMenu"
    ]
  },
  {
    "id": "cordova-plugin-context-menu.ContextMenuProxy",
    "file": "plugins/cordova-plugin-context-menu/src/browser/ContextMenuProxy.js",
    "pluginId": "cordova-plugin-context-menu",
    "merges": [
      ""
    ]
  },
  {
    "id": "cordova-plugin-device-mrdo.device",
    "file": "plugins/cordova-plugin-device-mrdo/www/device.js",
    "pluginId": "cordova-plugin-device-mrdo",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.Coordinates",
    "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Coordinates"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "PositionError"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.Position",
    "file": "plugins/cordova-plugin-geolocation/www/Position.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Position"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-listpicker.ListPicker",
    "file": "plugins/cordova-plugin-listpicker/www/ListPicker.js",
    "pluginId": "cordova-plugin-listpicker",
    "clobbers": [
      "window.plugins.listpicker"
    ]
  },
  {
    "id": "cordova-plugin-x-toast.Toast",
    "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
    "pluginId": "cordova-plugin-x-toast",
    "clobbers": [
      "window.plugins.toast"
    ]
  },
  {
    "id": "cordova-plugin-keyboard.keyboard",
    "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
    "pluginId": "cordova-plugin-keyboard",
    "clobbers": [
      "window.Keyboard"
    ]
  },
  {
    "id": "cordova-plugin-appcenter-shared.AppCenter",
    "file": "plugins/cordova-plugin-appcenter-shared/www/AppCenter.js",
    "pluginId": "cordova-plugin-appcenter-shared",
    "clobbers": [
      "AppCenter"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-bluetooth-serial": "0.4.7",
  "cordova-plugin-context-menu": "0.1.1",
  "cordova-plugin-device-mrdo": "1.1.3",
  "cordova-plugin-geolocation": "4.0.1",
  "cordova-plugin-listpicker": "2.2.2",
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-x-toast": "2.7.2",
  "cordova-plugin-keyboard": "1.2.0",
  "cordova-plugin-appcenter-shared": "0.3.0"
};
// BOTTOM OF METADATA
});