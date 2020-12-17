//Chart formating
window.chartColors = {
			// create colors for chart to use
			green: 'rgb(255, 99, 132)', white:'rgb(255,255,255)', black: 'rgb(0, 0, 0)'
		}; 
//create constants that link to html elements
const selectDeviceBtn = document.querySelector("#select_device"); //connect select device button to js variable
const output = document.querySelector("#output"); // output
const cutDeviceBtn = document.querySelector("#cut_device"); // disconnect device button
const sensorData = document.querySelector("#data"); // sensor data element
let gdxDevice;
let enabledSensors;
let time;
let sensorReadings=[];

const selectDevice = async () => {
  try {
    //selectDevice calls dialog. Waits for user selection
    gdxDevice = await godirect.selectDevice();
    // print name and serial number
    output.textContent = `\n Connected to ` + gdxDevice.name;
    gdxDevice.start(1000); // sets sampling rate to 1 second
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
  try {
    // prompt the user for a channel input choice
    const channel = prompt("choose a sensor channel");
    // set the desired sensor according to the channel selection
    const sensor = gdxDevice.getSensor(parseInt(channel));
    // display the sensor channel name selected 
    output.textContent = `\n\n Selected sensor: ${sensor.name}`; 
    sensor.setEnabled(true); // enable the sensor
    // push the sensor data to the "data" element on the web page
    sensor.on("value-changed", (sensor) => {
        document.getElementById("data").innerHTML = `\n ${sensor.value.toFixed(2)} ${sensor.unit}`;
     // time=time+1; // creates a time stamp for each sensor value
        sensorReadings.push(sensor.value);
      let unit = sensor.unit;
      addData(config, sensor.unit);
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
 // chart setup
    let config = {

		  // type of chart, could be 'line' or 'bar' 			
			type: 'line', 		
			data: {
				// x axis labels
				labels: [],   
				datasets: [{
					label: 'Time',
					backgroundColor: window.chartColors.black,
					borderColor: window.chartColors.black,
					// initial data, sensor data to be added with addData function
					data: [], 				
					fill: false,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: sensorName
						}
					}]
				}
			}
		}; 		
    
		window.onload = function() {
			let ctx = document.getElementById('canvas').getContext('2d');
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
			chart.data.datasets.forEach((dataset) => { 		
				dataset.data.push(sensorReadings.pop());
			});
			
			// update the chart line
			window.myLine.update(); 		
		}

selectDeviceBtn.addEventListener("click", selectDevice); //opens selection window displaying available Go Direct sensors
cutDeviceBtn.addEventListener("click", cutDevice); //disconnects sensor device
