
//let gdxDevice = "";
    const selectDeviceBtn = document.querySelector('#select_device');
    const output = document.querySelector('#output');
    const selectDevice = async () => {
      try {
        const gdxDevice = await godirect.selectDevice(); 
        // print name, serial number, order code and measurement period
        output.textContent = `\n Connected to `+gdxDevice.name;
/*  output.textContent += `\n Order Code: `+gdxDevice.orderCode;
    output.textContent += `\n Order Code: `+gdxDevice.orderCode;
    output.textContent += `\n Typical Measurement Period: `+gdxDevice.measurementPeriod + ` ms/sample`;

wait for battery level and battery state and print
        output.textContent += `\n Battery Level: `+await gdxDevice.getBatteryLevel() +`%`;
        output.textContent += `\n Charging: ` +(await gdxDevice.getChargingState() === 1 ? `yes` : `no`);
*/
      } catch (err) {
        console.error(err);
      }
    };