/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
//console.log("hi");

let gdxDevice = "";
    const selectDeviceBtn = document.querySelector('#select_device');
    const selectSensorsBtn = document.querySelector('#select_sensors');
    const output = document.querySelector('#output');
    const error = document.querySelector('#error');

    selectSensorsBtn.style.visibility='hidden';

    if (!navigator.bluetooth) {
      error.innerHTML = `<p><b>Web Bluetooth API is needed for this example.</b></p>`;
      error.innerHTML += `<p>This browser does not have support yet. <a href="https://webbluetoothcg.github.io/web-bluetooth/">More information</a></p>`;
      selectDeviceBtn.style.visibility='hidden';
    }
   
    const selectDevice = async () => {
      try {
        const bleDevice = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: 'GDX' }],
          optionalServices: ['d91714ef-28b9-4f91-ba16-f0d9a604f112']
        });
        // create the device and open it, but don't start measurements
        gdxDevice = await godirect.createDevice(bleDevice, {open:true, startMeasurements:false});

        selectSensorsBtn.style.visibility='visible';
        selectDeviceBtn.style.visibility='hidden';

        sensors.textContent = `Connected to ` + gdxDevice.name;
        sensors.textContent += `\n\n Available sensors: `;

        gdxDevice.sensors.forEach(sensor => {
           sensors.textContent += `\n ${sensor.number}: ${sensor.name} units: ${sensor.unit}`  ;
        }); 
    
      } catch (err) {
        console.error(err);