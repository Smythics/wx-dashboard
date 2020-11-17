const selectDeviceBtn = document.querySelector("#select_device");
const output = document.querySelector("#output");
const cutDeviceBtn = document.querySelector("#cut_device");
const sensorData = document.querySelector("#data");
//const output2 = document.querySelector("#output2");
let gdxDevice;

const selectDevice = async () => {
  try {
    gdxDevice = await godirect.selectDevice();
    // print name and serial number
    output.textContent = `\n Connected to ` + gdxDevice.name;
    cutDeviceBtn.style.visibility = "visible";
    selectDeviceBtn.style.visibility="hidden";
    sensorData.style.visibility="visible";
    //turns on the Default sensor
    gdxDevice.enableDefaultSensors();
    //create a constant enabledSensors that correlates with the enabled sensors of the gdx Device
    const enabledSensors = gdxDevice.sensors.filter(s => s.enabled);

    //create a function that runs for each of the enabled sensor measurements
    enabledSensors.forEach(sensor => {
      //trigger a set of actions to occur whenever the value the sensor detects changes
      sensor.on("value-changed", sensor => {
        document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed (2)} ${sensor.unit}`;
        sensor.on("value-changed", sensor => {
          console.log("sensor on");
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const cutDevice = async () => {
  try {
    gdxDevice.close();
    document.getElementById("data").innerHTML = "No Data";
    output.textContent = `\n Disconnected from ` + gdxDevice.name;
  } catch (err) {
    console.error(err);
  }
};

selectDeviceBtn.addEventListener("click", selectDevice); //opens selection window displaying available Go Direct sensors
cutDeviceBtn.addEventListener("click", cutDevice); //disconnects sensor device
