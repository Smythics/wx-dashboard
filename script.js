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

    // enable all sensors to output channel info
    enabledSensors = gdxDevice.sensors.filter(s => (s.enabled = true));
    output.textContent += `\n Availiable sensors: (type the channel number into the alert box) `;
    enabledSensors.forEach(sensor => {
    output.textContent += `\n\n Sensor: ${sensor.name} units: ${sensor.unit} channel: ${sensor.number} `;
    });
    // wait 1 seconds before starting the chooseSensor function
    setTimeout(chooseSensor, 1000);
  } catch (err) {
    console.error(err);
  }
};

function chooseSensor() {
  try {
    // prompt the user for a channel input choice
    const channel = prompt("choose a sensor");
    const sensor = gdxDevice.getSensor(parseInt(channel));
    // set the desired sensor according to the channel selection
    //Note: "=" vs "+=" replaces existing text so the list of sensors doesn't appear
    output.textContent = `\n\n Selected sensor: ${sensor.name}`;
    sensor.setEnabled(true);
    sensor.on("value-changed", (sensor) => {
        document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed(
          2
        )} ${sensor.unit}`;
        console.log("sensor on");
        });
    }
 catch (err) {
    console.error(err);
  }
};

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
