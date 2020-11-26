import { BleManager } from "react-native-ble-plx";
const manager = new BleManager();

const sendToPeripheral = (deviceId, message)=>{
    console.log("Instruction:",message)
    manager.isDeviceConnected(deviceId)
    .then(async(deviceIsConnected)=>{
      if(deviceIsConnected){
        await manager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
        manager.writeCharacteristicWithResponseForDevice(deviceId,"FFE0", 'FFE1',message)
        .then((x)=>{
          console.log("Device is already connected and instruction was executed successfully!");
        })       
      }
      else{          
        manager.connectToDevice(deviceId)
        .then(async(device) => {
          await device.discoverAllServicesAndCharacteristics();
          manager.writeCharacteristicWithResponseForDevice(deviceId,"FFE0", 'FFE1',message)
          .then((x)=>{
          console.log("connection has been created and instruction was executed successfully!");
          })
          .catch((e)=>{
            //console.error(e)
          });  
        })
        .catch((e)=>{
          //console.error(e)
        });
      }
  });
}

const calculateCheckSum= (hexDigits, isArray) =>{
    // console.log({hexDigits});
    let csum = 0x00;
    if (!isArray) {
        hexDigits = hexDigits.split(' ');
    }

    hexDigits.forEach((item) => {
        csum = (parseInt(csum, 16) + parseInt(item, 16)).toString(16);
        csum = `0x${csum}`;
    });

    csum = `0x${(csum % 0x100).toString(16)}`;
    csum = `0x${decimalToHex((csum ^ 0xFF) + 1)}`;

    if (parseInt(csum) >= 256) {
        csum = `0x${((csum % 0x100).toString(16)).padStart(2, '0')}`;
        // csum = Math.min(Math.max(Math.round(parseInt(csum)), 0), 255);
        // csum = `0x${("0" + csum.toString(16)).slice(-2)}`;
        console.warn({ csum });
    }

    // 0x40 masking

    /*
    if (blockItem === '0x40') {
                return ['0x3c', '0x01']
            } else if (blockItem === '0x3c' || blockItem === '0x3C') {
                return ['0x3c', '0x02'];
            } else if (blockItem === '0x4f' || blockItem === '0x4F') {
                return ['0x3c', '0x03'];
            } else if (blockItem === '0x41') {
                return ['0x3c', '0x04'];
    */
    if (csum === '0x40') {
        csum = '0x3C 0x01';
    }

    // 0x0C masking
    if (csum === '0x3c' || csum === '0x3C') {
        csum = '0x3C 0x02';
    }

    // 0x4F masking
    if (csum === '0x4f' || csum === '0x4F') {
        csum = '0x3C 0x03';
    }
    
    // 0x41 masking
    if (csum === '0x41') {
        csum = '0x3C 0x04'
    }

    /* if (csum.length > 4) {
        let newCSum = '';
        for (let i = 2; i < csum.length; i++) {
            if (newCSum.length >= 2 && (newCSum.length % 2) === 0) {
                newCSum = `${newCSum} `;
            }
            newCSum = `${newCSum}${csum[i]}`;
        }

        console.log({ newCSum });

        newCSum = newCSum.split(' ');
        console.log({ newCSum });
        csum = newCSum.map(i => `0x${i.padStart(2, '0')}`);
        console.log({ csum });

        csum = csum.join(' ');
        console.log({ csum });
    } */

    return csum;
}

const createCommandFromString = (hexString) =>{
    let checkSum = '';
    let hexDigits = hexString.split(' ');

    checkSum = calculateCheckSum(hexDigits, true);
    hexDigits.splice(5, 0, checkSum);
    //console.log("hexDigits: ",hexDigits.join(" "));
    return hexDigits.join(" ");
}

const decimalToHex=(d, padding) =>{
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

export {sendToPeripheral,createCommandFromString,calculateCheckSum,decimalToHex,manager}