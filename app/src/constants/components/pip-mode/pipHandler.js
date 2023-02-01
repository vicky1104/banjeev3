import {NativeEventEmitter, NativeModules, Platform} from "react-native";

class PipHandler {
	EventEmitter = NativeEventEmitter;

	constructor() {
		this.EventEmitter =
			Platform.OS === "android"
				? new NativeEventEmitter(NativeModules.PipAndroid)
				: null;
	}

	onPipModeChanged(listener) {
		return this?.EventEmitter?.addListener("PIP_MODE_CHANGE", listener);
	}

	enterPipMode(width, height) {
		return NativeModules?.PipAndroid?.enterPipMode(
			width ? Math.floor(width) : 0,
			height ? Math.floor(height) : 0
		);
	}
}

export default new PipHandler();
