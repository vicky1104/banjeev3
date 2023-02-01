import { Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { PERMISSIONS, request } from "react-native-permissions";

// readonly ACCEPT_HANDOVER: "android.permission.ACCEPT_HANDOVER";
// readonly ACCESS_BACKGROUND_LOCATION: "android.permission.ACCESS_BACKGROUND_LOCATION";
// readonly ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION";
// readonly ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION";
// readonly ACCESS_MEDIA_LOCATION: "android.permission.ACCESS_MEDIA_LOCATION";
// readonly ACTIVITY_RECOGNITION: "android.permission.ACTIVITY_RECOGNITION";
// readonly ADD_VOICEMAIL: "com.android.voicemail.permission.ADD_VOICEMAIL";
// readonly ANSWER_PHONE_CALLS: "android.permission.ANSWER_PHONE_CALLS";
// readonly BLUETOOTH_ADVERTISE: "android.permission.BLUETOOTH_ADVERTISE";
// readonly BLUETOOTH_CONNECT: "android.permission.BLUETOOTH_CONNECT";
// readonly BLUETOOTH_SCAN: "android.permission.BLUETOOTH_SCAN";
// readonly BODY_SENSORS: "android.permission.BODY_SENSORS";
// readonly CALL_PHONE: "android.permission.CALL_PHONE";
// readonly CAMERA: "android.permission.CAMERA";
// readonly GET_ACCOUNTS: "android.permission.GET_ACCOUNTS";
// readonly PROCESS_OUTGOING_CALLS: "android.permission.PROCESS_OUTGOING_CALLS";
// readonly READ_CALENDAR: "android.permission.READ_CALENDAR";
// readonly READ_CALL_LOG: "android.permission.READ_CALL_LOG";
// readonly READ_CONTACTS: "android.permission.READ_CONTACTS";
// readonly READ_EXTERNAL_STORAGE: "android.permission.READ_EXTERNAL_STORAGE";
// readonly READ_PHONE_NUMBERS: "android.permission.READ_PHONE_NUMBERS";
// readonly READ_PHONE_STATE: "android.permission.READ_PHONE_STATE";
// readonly READ_SMS: "android.permission.READ_SMS";
// readonly RECEIVE_MMS: "android.permission.RECEIVE_MMS";
// readonly RECEIVE_SMS: "android.permission.RECEIVE_SMS";
// readonly RECEIVE_WAP_PUSH: "android.permission.RECEIVE_WAP_PUSH";
// readonly RECORD_AUDIO: "android.permission.RECORD_AUDIO";
// readonly SEND_SMS: "android.permission.SEND_SMS";
// readonly USE_SIP: "android.permission.USE_SIP";
// readonly WRITE_CALENDAR: "android.permission.WRITE_CALENDAR";
// readonly WRITE_CALL_LOG: "android.permission.WRITE_CALL_LOG";
// readonly WRITE_CONTACTS: "android.permission.WRITE_CONTACTS";
// readonly WRITE_EXTERNAL_STORAGE: "android.permission.WRITE_EXTERNAL_STORAGE";

export default function usePermission() {
	const checkAndroidFunc = useCallback(async (permission) => {
		const getOS = PERMISSIONS.ANDROID;
		switch (permission) {
			case "WRITE_STORAGE":
				return await request(getOS.WRITE_EXTERNAL_STORAGE);

			case "STORAGE":
				return await request(getOS.READ_EXTERNAL_STORAGE);

			case "LOCATION":
				return await request(getOS.ACCESS_FINE_LOCATION, {
					title: "Location Required",
					message:
						"Banjee collects location data to find nearby Neighbourhood and activity (Neighbourhood watch) when the app is open or in use",
					buttonNegative: "Deny",
					buttonPositive: "Accept",
				});

			case "MEDIA":
				return await request(getOS.ACCESS_MEDIA_LOCATION);

			case "BLUETOOTH":
				return await request(getOS.BLUETOOTH_CONNECT);

			case "CAMERA":
				return await request(getOS.CAMERA);

			case "AUDIO":
				return await request(getOS.RECORD_AUDIO);
			case "CONTACT":
				return await request(getOS.READ_CONTACTS);

			default:
				break;
		}
	}, []);

	const checkIosFunc = useCallback(async (permission) => {
		const getOS = PERMISSIONS.IOS;
		switch (permission) {
			case "LOCATION":
				return await request(getOS.LOCATION_WHEN_IN_USE || getOS.LOCATION_ALWAYS);
			case "PHOTO":
				return await request(getOS.PHOTO_LIBRARY);
			case "STORAGE":
			case "MEDIA":
				return await request(getOS.MEDIA_LIBRARY);

			case "CAMERA":
				return await request(getOS.CAMERA);

			case "AUDIO":
				return await request(getOS.MICROPHONE);
			case "CONTACT":
				return await request(getOS.CONTACTS);
			default:
				break;
		}
	}, []);
	const checkPermission = useCallback(
		async (per) => {
			if (Platform.OS === "android") {
				return await checkAndroidFunc(per);
			} else {
				return await checkIosFunc(per);
			}
		},
		[checkAndroidFunc, checkIosFunc]
	);
	return { checkPermission };
}
