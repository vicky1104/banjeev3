import {
	NativeModules,
	NativeEventEmitter,
	Platform,
	PermissionsAndroid,
} from "react-native";
import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge";
import CallStateUpdateActionModule from "./CallStateUpdateActionModule";

export const permissionDenied = "PERMISSION DENIED";

const NativeCallDetector = NativeModules.CallDetectionManager;
const NativeCallDetectorAndroid = NativeModules.CallDetectionManagerAndroid;

BatchedBridge.registerCallableModule(
	"CallStateUpdateActionModule",
	CallStateUpdateActionModule
);

const requestPermissionsAndroid = async (permissionMessage) => {
	await PermissionsAndroid.check(
		PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
	).then(async (gotPermission) =>
		gotPermission
			? true
			: await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
					permissionMessage
			  ).then((result) => result === PermissionsAndroid.RESULTS.GRANTED)
	);
};

class CallDetectorManager {
	subscription;
	callback;
	constructor(
		callback,
		readPhoneNumberAndroid = false,
		permissionDeniedCallback = () => {},
		permissionMessage = {
			title: "Phone State Permission",
			message:
				"This app needs access to your phone state in order to react and/or to adapt to incoming calls.",
		}
	) {
		this.callback = callback;
		if (Platform.OS === "ios") {
			if (NativeCallDetector) {
				NativeCallDetector.startListener();
				console.warn(NativeCallDetector);
				this.subscription = new NativeEventEmitter(NativeCallDetector);
				this.subscription.addListener("PhoneCallStateUpdate", callback);
			}
		} else {
			if (NativeCallDetectorAndroid) {
				if (readPhoneNumberAndroid) {
					requestPermissionsAndroid(permissionMessage)
						.then((permissionGranted) => {
							if (!permissionGranted) {
								permissionDeniedCallback(permissionDenied);
							}
						})
						.catch(permissionDeniedCallback);
				}
				NativeCallDetectorAndroid.startListener();
			}
			CallStateUpdateActionModule.callback = callback;
		}
	}

	dispose() {
		NativeCallDetector && NativeCallDetector.stopListener();
		NativeCallDetectorAndroid && NativeCallDetectorAndroid.stopListener();
		CallStateUpdateActionModule.callback = undefined;
		if (this.subscription) {
			this.subscription.removeAllListeners("PhoneCallStateUpdate");
			this.subscription = undefined;
		}
	}
}
export default CallDetectorManager;
