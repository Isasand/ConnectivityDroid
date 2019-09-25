cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "pluginId": "cordova-plugin-bluetooth-serial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-bluetooth-serial/src/browser/bluetoothSerial.js",
        "id": "cordova-plugin-bluetooth-serial.BluetoothSerial_browser",
        "pluginId": "cordova-plugin-bluetooth-serial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-context-menu/www/ContextMenu.js",
        "id": "cordova-plugin-context-menu.ContextMenu",
        "pluginId": "cordova-plugin-context-menu",
        "clobbers": [
            "ContextMenu"
        ]
    },
    {
        "file": "plugins/cordova-plugin-context-menu/src/browser/ContextMenuProxy.js",
        "id": "cordova-plugin-context-menu.ContextMenuProxy",
        "pluginId": "cordova-plugin-context-menu",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-mrdo/www/device.js",
        "id": "cordova-plugin-device-mrdo.device",
        "pluginId": "cordova-plugin-device-mrdo",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-listpicker/www/ListPicker.js",
        "id": "cordova-plugin-listpicker.ListPicker",
        "pluginId": "cordova-plugin-listpicker",
        "clobbers": [
            "window.plugins.listpicker"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "id": "cordova-plugin-x-toast.Toast",
        "pluginId": "cordova-plugin-x-toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
        "id": "cordova-plugin-keyboard.keyboard",
        "pluginId": "cordova-plugin-keyboard",
        "clobbers": [
            "window.Keyboard"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-shared/www/AppCenter.js",
        "id": "cordova-plugin-appcenter-shared.AppCenter",
        "pluginId": "cordova-plugin-appcenter-shared",
        "clobbers": [
            "AppCenter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-analytics/www/Analytics.js",
        "id": "cordova-plugin-appcenter-analytics.Analytics",
        "pluginId": "cordova-plugin-appcenter-analytics",
        "clobbers": [
            "AppCenter.Analytics"
        ]
    },
    {
        "file": "plugins/cordova-plugin-appcenter-crashes/www/Crashes.js",
        "id": "cordova-plugin-appcenter-crashes.Crashes",
        "pluginId": "cordova-plugin-appcenter-crashes",
        "clobbers": [
            "AppCenter.Crashes"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-bluetooth-serial": "0.4.7",
    "cordova-plugin-context-menu": "0.1.1",
    "cordova-plugin-device-mrdo": "1.1.3",
    "cordova-plugin-listpicker": "2.2.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-x-toast": "2.7.2",
    "cordova-plugin-geolocation": "4.0.1",
    "cordova-plugin-keyboard": "1.2.0",
    "cordova-plugin-appcenter-shared": "0.3.0",
    "cordova-plugin-appcenter-analytics": "0.3.0",
    "cordova-plugin-appcenter-crashes": "0.3.0"
}
// BOTTOM OF METADATA
});