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
let port_selected = null;

async function request_ports() {
	const portsExistingPermissions = await navigator.serial.getPorts();
	console.log("Existing port permissions: ");
	portsExistingPermissions.forEach((port) => {
		console.log(port.getInfo());
	});

	const filters = [
		{ usbVendorId: 0x10c4, usbProductId: 0xea60 }, // Silicon Labs CP210x
		{ usbVendorId: 0x0403, usbProductId: 0x6015 }, // FTDI
		{ usbVendorId: 0x0403, usbProductId: 0x6001 }, // FTDI
		{ usbVendorId: 0x1a86, usbProductId: 0x7523 }, // CH340
		{ usbVendorId: 0x1a86, usbProductId: 0x55d3 }, // QinHeng Electronics USB Single Serial Ch343
		{ usbVendorId: 0x2341, usbProductId: 0x0043 }, // Arduino Uno
		{ usbVendorId: 0x2341, usbProductId: 0x0001 }, // Arduino Uno
	];

	const port = await navigator.serial.requestPort({ filters });
	console.log("Selected port", port.getInfo());
	port_selected = port;
	const portsUpdatedPermissions = await navigator.serial.getPorts();
	console.log("Port permissions after navigator.serial.requestPort:");
	portsUpdatedPermissions.forEach((port) => {
		const info = port.getInfo();
		if (info.usbProductId > 0) {
			console.info(info);
			// confirm(`usbProductId: ${info.usbProductId}, usbVendorId: ${info.usbVendorId}`);
		}
	});
}

function open_port() {
	if (port_selected == null) {
		alert("please select a port first");
		return;
	} else {
		port_selected
			.open({
				baudRate: 9600,
				dataBits: 8,
				parity: "none",
				stopBits: 1,
				flowControl: "none",
			})
			.then(() => {
				const info = port_selected.getInfo();
				console.info(`port ${info.usbVendorId}:${info.usbProductId} is opened`);
				confirm(`port ${info.usbVendorId}:${info.usbProductId} is opened`);
			})
			.catch((error) => {
				alert(`open_port error: ${error}`);
			});
	}
}
document.getElementById("request_ports").addEventListener("click", request_ports);
document.getElementById("open_port").addEventListener("click", open_port);
