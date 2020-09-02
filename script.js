
//let gdxDevice = "";
    const selectDeviceBtn = document.querySelector('#select_device');
    const output = document.querySelector('#output');
    const selectDevice = async () => {
      try {
        const gdxDevice = await godirect.selectDevice(); 
        // print name and serial number 
        output.textContent = `\n Connected to `+gdxDevice.name;
      } catch (err) {
        console.error(err);
      }
    };
    selectDeviceBtn.addEventListener('click', selectDevice);
