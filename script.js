//create constants that link to html elements
const selectDeviceBtn = document.querySelector("#select_device"); //connect select device button to js variable
const output = document.querySelector("#output"); // output
const cutDeviceBtn = document.querySelector("#cut_device"); // disconnect device button
const sensorData = document.querySelector("#data"); // sensor data
let gdxDevice;
let enabledSensors;

const selectDevice = async () => {
  try {
    //selectDevice calls dialog. Waits for user selection
    gdxDevice = await godirect.selectDevice();
    // print name and serial number
    output.textContent = `\n Connected to ` + gdxDevice.name;
    cutDeviceBtn.style.visibility = "visible"; //make button visible to deselect sensor
    selectDeviceBtn.style.visibility = "hidden"; //hide select sensor button
    sensorData.style.visibility = "visible"; //make visible output from sensor

    output.textContent += `\n Availiable sensors: (type the channel number into the alert box) `;

    // enable all sensor to print info
    enabledSensors = gdxDevice.sensors.filter(s => (s.enabled = true));

    enabledSensors.forEach(sensor => {
      output.textContent += `\n\n Sensor: ${sensor.name} units: ${sensor.unit} channel: ${sensor.number} `;
    });
    // wait 1 seconds before starting the chooseSensor function
    setTimeout(chooseSensor, 1000);
  } catch (err) {
    console.error(err);
  }
};

//create a function that runs for each of the enabled sensor measurements
function showData() {
    enabledSensors.forEach(sensor => {
      //trigger a set of actions to occur whenever the value the sensor detects changes
      sensor.on("value-changed", sensor => {
        document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed(
          2
        )} ${sensor.unit}`;
        sensor.on("value-changed", sensor => {
          console.log("sensor on");
        });
      });
    });
}

function chooseSensor() {
  try {
    // prompt the user for a channel input choice
    const channel = prompt("choose a sensor");
    // set the desired sensor according to the channel selection
    output.textContent += `\n\n Selected sensor: `;
    if () {
          const sensor = gdxDevice.getSensor(parseInt(channel));
    }
    // enable the selected sensor channel
    sensor.setEnabled(true);
    else {
      
    }
      
    showData();
  } catch (err) {
    console.error(err);
  }
}
const cutDevice = async () => {
  try {
    gdxDevice.close();
    document.getElementById("data").innerHTML = "No Data";
    output.textContent = `\n Disconnected from ` + gdxDevice.name;
    selectDeviceBtn.style.visibility = "visible";
    cutDeviceBtn.style.visibility = "hidden";
    sensorData.style.visibility = "hidden";
  } catch (err) {
    console.error(err);
  }
};

selectDeviceBtn.addEventListener("click", selectDevice); //opens selection window displaying available Go Direct sensors
cutDeviceBtn.addEventListener("click", cutDevice); //disconnects sensor device
