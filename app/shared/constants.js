let device = null;
let ble = null;
let toast = null;
let localStorage = null;
let globalization = null;
let platform = null;
let navigator = null;
let intent = null;
let file = null;
let fileTransfer = null;
let crashLytics = null;
let analytics = null;
let connection = null;
let zipper = null;

const BLE_CHAR_VALUE_UID = "A010";
const BLE_CHAR_EMPTY_UID = "A020";
const BLE_CHAR_FULL_UID = "A021";
const BLE_CHAR_WRITE_1 = "A0F0";
const BLE_CHAR_WRITE_2 = "A0F1";
const BLE_CHAR_WRITE_3 = "A0F2";

const MOVE_SINGLE_UP = 0;
const MOVE_SINGLE_DOWN = 1;
const MOVE_DUAL_HEAD_UP = 2;
const MOVE_DUAL_HEAD_DOWN = 3;
const MOVE_DUAL_LEGS_UP = 4;
const MOVE_DUAL_LEGS_DOWN = 5;
const MOVE_DUAL_BOTH_UP = 6;
const MOVE_DUAL_BOTH_DOWN = 7;
const MOVE_ALL_DOWN = 8;

const MOTOR_ONE_ON = '1-1'; // For Motor One
const MOTOR_ONE_OFF = '1-0'; // For Motor Two
const MOTOR_TWO_ON = '2-1'; // For Second Motor
const MOTOR_TWO_OFF = '2-0'; // For Second Motor
const MOTOR_THREE_ON = '3-1'; // For Third Motor
const MOTOR_THREE_OFF = '3-0'; // For Third Motor
const MOTOR_FOUR_ON = '4-1'; // For Fourth Motor
const MOTOR_FOUR_OFF = '4-0'; // For Forth Motor
const MOTOR_ONE_AND_TWO_ON = '5-1'; // For Motor One and Two simultaneously
const MOTOR_ONE_AND_TWO_OFF = '5-0'; // For Motor One and Two simultaneously
const MOTOR_THREE_AND_FOUR_ON = '6-1'; // For Motor Three and Four simultaneously
const MOTOR_THREE_AND_FOUR_OFF = '6-0'; // For Motor Three and Four simultaneously
const MOTOR_ONE_TWO_THREE_FOUR_OFF = '7-0'; // For All Motors simultaneously

const MOVE_HEAD = '1';
const MOVE_BACK = '2';
const MOVE_THIGH = '3';
const MOVE_LOWER_LEG = '4';
const MOVE_HEAD_BACK = '5';
const MOVE_THIGH_LOWER_LEG = '6';
const MOVE_ALL = '7';

const BLE_SERVICE = 'FFE0';
const BLE_CHARACTERISTIC = 'FFE1';

let bleErrors = {
    NOTCONNECTED: {code: "01", message: "The device is not connected."},
    COULDNOTSENDDATA: {code: "02", message: "The data transfer to the device was not successful."},
    COULDNOTREAD: {code:"03", message: "Could not read from device."}
};

let bleStatuses = {
    PROCESSING:0, //Used when any ble progress is ongoing
    CHECKDEVICECONNECTION: 1,
    FETCHINGFIRMWARE: 2,
    SENDING: 3,
    VALIDATING: 4,
    ERROR: 5,
    DONE: 6, //Used when any ble progress is ongoing
};

function initializeConstants(){
    device = window.device;
    platform = window.device.platform;
    ble = window.bluetoothle;
    toast = window.plugins.toast;
    localStorage = window.localStorage;
    globalization = window.navigator.globalization;
    navigator = window.navigator;
    intent = window.sendmailIntent;
    file = window.cordova.file;
    fileTransfer = window.FileTransfer;
    crashLytics = window.FirebaseCrashlytics;
    analytics = window.cordova.plugins.firebase.analytics;
    connection = window.navigator.connection;
    zipper = window.zip;
}


export default initializeConstants;
export {device, ble, toast, localStorage, globalization, platform, navigator, intent, file, fileTransfer, crashLytics, analytics,
    connection, zipper, BLE_SERVICE, BLE_CHARACTERISTIC,
    BLE_CHAR_VALUE_UID, BLE_CHAR_EMPTY_UID, BLE_CHAR_FULL_UID, BLE_CHAR_WRITE_1, BLE_CHAR_WRITE_2, BLE_CHAR_WRITE_3,
    MOVE_SINGLE_UP, MOVE_SINGLE_DOWN, MOVE_DUAL_HEAD_UP, MOVE_DUAL_HEAD_DOWN, MOVE_DUAL_LEGS_UP, MOVE_DUAL_LEGS_DOWN, MOVE_DUAL_BOTH_UP, MOVE_DUAL_BOTH_DOWN, MOVE_ALL_DOWN,
    MOVE_HEAD, MOVE_BACK, MOVE_THIGH, MOVE_LOWER_LEG, MOVE_HEAD_BACK, MOVE_THIGH_LOWER_LEG, MOVE_ALL,
    MOTOR_ONE_ON, MOTOR_ONE_OFF, MOTOR_TWO_ON, MOTOR_TWO_OFF, MOTOR_THREE_ON, MOTOR_THREE_OFF, MOTOR_FOUR_ON, MOTOR_FOUR_OFF,
    MOTOR_ONE_AND_TWO_ON, MOTOR_ONE_AND_TWO_OFF, MOTOR_THREE_AND_FOUR_ON, MOTOR_THREE_AND_FOUR_OFF, MOTOR_ONE_TWO_THREE_FOUR_OFF,
    bleErrors, bleStatuses
};
