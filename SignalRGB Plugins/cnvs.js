export function Name() { return "HYTE CNVS"; }
export function Version() { return "1.0.0"; }
export function Type() { return "network"; }
export function Publisher() { return "Someone"; }
export function Size() { return [22, 8]; }
export function DefaultPosition() { return [50, 50]; }
export function DefaultScale() { return 1.0; }
/* global
discovery:readonly
controller:readonly
turnOffOnShutdown:readonly
*/
export function ControllableParameters() {
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
	];
}

const vLedPositions = [
	[1,0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],[11,0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], 
	[21,1],[21,2],[21,3],[21,4],[21,5],
	[20,6], [19, 6], [18, 6], [17, 6], [16, 6], [15, 6], [14, 6], [13, 6], [12, 6], [11, 6],[10,6], [9, 6], [8, 6], [7, 6], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6],
	[0,5], [0,4], [0,3], [0,2], [0,1],																																										
		
];
const vLedNames = [
	"LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6", "LED 7", "LED 8", "LED 9", "LED 10","LED 11", "LED 12", "LED 13", "LED 14", "LED 15", "LED 16", "LED 17", "LED 18", "LED 19", "LED 20",
	"LED 21", "LED 22", "LED 23", "LED 24", 
	"LED 25", "LED 26", "LED 27", "LED 28", "LED 29", "LED 30","LED 31", "LED 32", "LED 33", "LED 34", "LED 35", "LED 36", "LED 37", "LED 38", "LED 39", "LED 40","LED 41", "LED 42", "LED 43", "LED 44", "LED 45", 
	"LED 46", "LED 47", "LED 48", "LED 49", "LED 50"
];

export function LedNames() {
	return vLedNames;
}

export function LedPositions() {
	return vLedPositions;
}

export function Initialize() {
	device.setName(controller.name);
	device.addFeature("udp");
}

export function Render() {
	grabColors();
}

export function Shutdown(suspend) {
	grabColors(true);
}

function grabColors(shutdown = false) {
	const RGBData = [];

	for(let iIdx = 0; iIdx < vLedPositions.length; iIdx++) {
		const iPxX = vLedPositions[iIdx][0];
		const iPxY = vLedPositions[iIdx][1];
		let color;

		if(shutdown) {
			color = hexToRgb(shutdownColor);
		} else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		} else {
			color = device.color(iPxX, iPxY);
		}

		const iLedIdx = iIdx * 3;
		RGBData[iLedIdx] = color[1]*.70;
		RGBData[iLedIdx+1] = color[0]*.70;
		RGBData[iLedIdx+2] = color[2]*.70;
	}

	udp.send(controller.ip, controller.port, RGBData);
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

export function DiscoveryService() {

	this.Initialize = () => {
		service.addController(new HyteCNVS({
			id: "CNVS",
			port: 1337,
			ip: "127.0.0.1",
			name: "CNVS",
		}));

		const controller = service.getController("CNVS");

		service.updateController(controller);
		service.announceController(controller);
	};

	this.Update = () => {

		for(const cont of service.controllers) {
			cont.obj.update();
		}
	};
}



class HyteCNVS {
	constructor(value) {
		this.id = value.id;
		this.port = value.port;
		this.ip = value.ip;
		this.name = value.name;

		this.initialized = false;
	}

	update(){
		if(!this.initialized){
			this.initialized = true;

			service.updateController(this);
			service.announceController(this);
		}
	}
}

export function ImageUrl() {
	return "https://i.imgur.com/yknEGHA.png";
}