    const selectDeviceBtn = document.querySelector('#select_device');
    const output = document.querySelector('#output');
    const selectDevice = async () => {
      try {
        const gdxDevice = await godirect.selectDevice(); 
        // print name and serial number 
        output.textContent = `\n Connected to `+gdxDevice.name;
        
        //turns on the Default sensor
        gdxDevice.enableDefaultSensors();
        //create a constant enabledSensors that correlates with the enabled sensors of the gdx Device
        const enabledSensors = gdxDevice.sensors.filter(s => s.enabled );

    //create a function that runs for each of the enabled sensor measurements    
        enabledSensors.forEach(sensor => {
//trigger a set of actions to occur whenever the value the sensor detects changes
          sensor.on('value-changed', (sensor) => {
            console.log("sensors are enabled");
            document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed(3)} ${sensor.unit}`;
          });
        });

      } catch (err) {
        console.error(err);
      }
    };
    selectDeviceBtn.addEventListener('click', selectDevice);
