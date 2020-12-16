const PROGRAMS = [
    { label: 'Program1', value: 'Program1' },
    { label: 'Program2', value: 'Program2' },
    { label: 'Program3', value: 'Program3' },
    { label: 'Program4', value: 'Program4' },
    { label: 'Program5', value: 'Program5' },
];

const FREQUENCIES = [
    { label: 'Once', value: 'Once' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Custom', value: 'Custom' },
];

const WEEKDAYS = [
    {name:"Monday",dow:1,index:1},
    {name:"Tuesday",dow:2,index:2},
    {name:"Wednesday",dow:4,index:3},
    {name: "Thursday",dow:8,index:4},
    {name:"Friday",dow:16,index:5},
    {name:"Saturday",dow:32,index:6},
    {name:"Sunday",dow:64,index:7}];

const INITIALMODES=[
    {id:"1",name:"Reading Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Up",motor2direction:"Up"},
    {id:"2",name:"Sleep Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Down",motor2direction:"Down"},
    {id:"3",name:"Relax Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Up",motor2direction:"Up"},
    {id:"4",name:"Reset Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Down",motor2direction:"Down",static:true},
    ];

const MOTOR_LATENCY = 500;
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

// BLE constants
const BLE_SERVICE = 'FFE0';
const BLE_CHARACTERISTIC = 'FFE1';

//Command
const START='40';
const END='40';
const TYPE='02';
const COMMAND='72';
const LENGTH1='00' ;
const LENGTH2='08' ;
const CHECKSUM='ff';
const SET_TIME='10';
const CONTROLLER_PROGRAM='04';

//Storage keys
const DEVICE_STORAGE_KEY="Device";
const ALARM_GROUPS_KEY = "AlarmGroups";
const MODES_STORAGE_KEY = "modes"
const BED_STORAGE_KEY="Bed"

export {PROGRAMS, FREQUENCIES, WEEKDAYS,INITIALMODES, DEVICE_STORAGE_KEY,  ALARM_GROUPS_KEY,MODES_STORAGE_KEY,BED_STORAGE_KEY,
    BLE_SERVICE, BLE_CHARACTERISTIC,START,END,TYPE,COMMAND,LENGTH1,LENGTH2,CHECKSUM,SET_TIME,CONTROLLER_PROGRAM,
    MOTOR_LATENCY, MOVE_SINGLE_UP, MOVE_SINGLE_DOWN, MOVE_DUAL_HEAD_UP, MOVE_DUAL_HEAD_DOWN, MOVE_DUAL_LEGS_UP, MOVE_DUAL_LEGS_DOWN, MOVE_DUAL_BOTH_UP, MOVE_DUAL_BOTH_DOWN, MOVE_ALL_DOWN,
    MOVE_HEAD, MOVE_BACK, MOVE_THIGH, MOVE_LOWER_LEG, MOVE_HEAD_BACK, MOVE_THIGH_LOWER_LEG, MOVE_ALL,
    MOTOR_ONE_ON, MOTOR_ONE_OFF, MOTOR_TWO_ON, MOTOR_TWO_OFF, MOTOR_THREE_ON, MOTOR_THREE_OFF, MOTOR_FOUR_ON, MOTOR_FOUR_OFF,
    MOTOR_ONE_AND_TWO_ON, MOTOR_ONE_AND_TWO_OFF, MOTOR_THREE_AND_FOUR_ON, MOTOR_THREE_AND_FOUR_OFF, MOTOR_ONE_TWO_THREE_FOUR_OFF,
 
};
