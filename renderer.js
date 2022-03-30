// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
navigator.serial.addEventListener("connect", (e) => {
	// Connect to `e.target` or add it to a list of available ports.
	console.info("event connect", e);
});

navigator.serial.addEventListener("disconnect", (e) => {
	// Remove `e.target` from the list of available ports.
	console.info("event disconnect", e);
});

navigator.serial.getPorts().then((ports) => {
	// Initialize the list of available ports with `ports` on page load.
	console.info("mounted getPorts", ports);
	ports.forEach((port) => {
		let port_info = port.getInfo();
		if (port_info && Object.keys(port_info).length > 0) {
			console.info(port_info);
		}
	});
});

async function testIt() {
  const portsExistingPermissions = await navigator.serial.getPorts();
  console.log("Existing port permissions: ");
  portsExistingPermissions.forEach((port) => {
    console.log(port.getInfo());
  });
	
  const filters = [
    { usbVendorId: 0x0403, usbProductId: 0x6001 }, // FTDI
    { usbVendorId: 0x1a86, usbProductId: 0x7523 }, // CH340
    { usbVendorId: 0x2341, usbProductId: 0x0043 }, // Arduino Uno
    { usbVendorId: 0x2341, usbProductId: 0x0001 }, // Arduino Uno
  ];

  const port = await navigator.serial.requestPort({ filters });
  console.log("Selected port", port.getInfo());
  const portsUpdatedPermissions = await navigator.serial.getPorts();
  console.log("Port permissions after navigator.serial.requestPort:");
  portsUpdatedPermissions.forEach((port) => {
    console.log(port.getInfo());
  });
}

document.getElementById("clickme").addEventListener("click", testIt);
