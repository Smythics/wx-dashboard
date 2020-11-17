//create constants that link to html elements
const selectDeviceBtn = document.querySelector("#select_device"); //connect/select device button
const output = document.querySelector("#output"); //
const cutDeviceBtn = document.querySelector("#cut_device"); // disconnect device button
const sensorData = document.querySelector("#data"); // sensor data
let gdxDevice;

const selectDevice = async () => {
  try {
    //selectDevice calls dialog. Waits for user selection
    gdxDevice = await godirect.selectDevice();
    // print name and serial number
    output.textContent = `\n Connected to ` + gdxDevice.name;
    cutDeviceBtn.style.visibility = "visible"; //make button visible to deselect sensor
    selectDeviceBtn.style.visibility="hidden"; //hide select sensor button
    sensorData.style.visibility="visible"; //make visible output from sensor
    //turns on the Default sensor(s)
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
    selectDeviceBtn.style.visibility="visible";
    cutDeviceBtn.style.visibility="hidden";
    sensorData.style.visibility="hidden"; 
  } catch (err) {
    console.error(err);
  }
};

selectDeviceBtn.addEventListener("click", selectDevice); //opens selection window displaying available Go Direct sensors
cutDeviceBtn.addEventListener("click", cutDevice); //disconnects sensor device
