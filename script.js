//Chart formating
window.chartColors = {
  // create colors for chart to use
  green: "rgb(255, 99, 132)",
  white: "rgb(255,255,255)",
  black: "rgb(0, 0, 0)"
};
//create constants that link to html elements
const selectDeviceBtn = document.querySelector("#select_device"); //connect select device button to js variable
const output = document.querySelector("#output"); // output
const cutDeviceBtn = document.querySelector("#cut_device"); // disconnect device button
const sensorData = document.querySelector("#data"); // sensor data element
//var myChart = document.querySelector("#myChart");

let gdxDevice;
let enabledSensors;
let time = [];
let sensorReadings = [];
const samplingRate = 50; //seconds per sample in ms
const frequency = samplingRate / 1000;

const selectDevice = async () => {
  try {
    //selectDevice calls dialog. Waits for user selection
    gdxDevice = await godirect.selectDevice();
    // print name and serial number
    output.textContent = `\n Connected to ` + gdxDevice.name;
    gdxDevice.start(samplingRate); // sets sampling rate
    cutDeviceBtn.style.visibility = "visible"; //make button visible to deselect sensor
    selectDeviceBtn.style.visibility = "hidden"; //hide select sensor button
    sensorData.style.visibility = "visible"; //make visible output from sensor
    // enable all sensors to output channel info
    enabledSensors = gdxDevice.sensors.filter(s => (s.enabled = true));
    output.textContent += `\n Availiable sensors: (type the channel number into the alert box) `;
    enabledSensors.forEach(sensor => {
      output.textContent += `\n\n Sensor: ${sensor.name} units: ${sensor.unit} channel: ${sensor.number} `;
    });
    // wait 1 seconds before starting the chooseChannel function
    setTimeout(chooseChannel, 1000);
  } catch (err) {
    console.error(err);
  }
};

function chooseChannel() {
  var i = 0;
  try {
    // prompt the user for a channel input choice
    const channel = prompt("choose a sensor channel");
    // set the desired sensor according to the channel selection
    const sensor = gdxDevice.getSensor(parseInt(channel));
    // display the sensor channel name selected
    clearData();
    output.textContent = `\n\n Selected sensor: ${sensor.name}`;
    sensor.setEnabled(true); // enable the sensor
    // push the sensor data to the "data" element on the web page
    sensor.on("value-changed", sensor => {
      document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed(2)} ${sensor.unit}`;
      time.push(i.toPrecision(3)); //i represents time stamp tied to data sampling rate
      i = i + frequency;// creates next time stamp
      sensorReadings.push(sensor.value.toFixed(2));
      addData(config, sensor.unit);
      console.log("sensor on");
    });
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
// chart setup and appearance
let config = {
  // type of chart, could be 'line' or 'bar'
  type: "line",
  data: {
    // x axis labels
    labels: time, //uses time[] array for x-axis values
    datasets: [
      {
        label: "Sensor Value",
        backgroundColor: window.chartColors.black,
        data: [],
        fill: false
      }
    ]
  },
  elements: {
    line: {
      tension: 0 // disables bezier curves so the max and min on the graph are true
      }
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Chart.js Line Chart"
    },
    tooltips: {
      mode: "index", //nearest x-axis value
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Time"
          }
        }
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Sensor Value"
          }
        }
      ]
    }
  }
};
//
window.onload = function() {
  let ctx = document.getElementById("canvas").getContext("2d");
  window.myLine = new Chart(ctx, config);
};

let colorNames = Object.keys(window.chartColors);

config.data.datasets.forEach(function(dataset) {
  // send the data to the dataset to be added to the line
  dataset.data.pop();
});

function addData(chart, unit) {
  // label the chart with the units from the sensor
  chart.data.label = unit;
  // for each data point in the data set, add the sensorReading value
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(sensorReadings.pop());
  });
  // update the chart line
  window.myLine.update();
}
function clearData(chart) {
  for (var i = 0; i < sensorReadings.length; i++) {
    chart.dataset.data.pop();
  }
  window.myLine.update();
}

selectDeviceBtn.addEventListener("click", selectDevice); //opens selection window displaying available Go Direct sensors
cutDeviceBtn.addEventListener("click", cutDevice); //disconnects sensor device
