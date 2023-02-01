import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PermissionsAndroid } from "react-native";
import RNCallKeep from "react-native-callkeep";
import uuid from "react-native-uuid";

export default function CallKeepConfig(params) {
	const navigate = useNavigation();
	const initOptions = {
		ios: {
			appName: "Banjee",
		},
		android: {
			alertTitle: "Permissions required",
			alertDescription: "This application needs to access your phone accounts",
			cancelButton: "Cancel",
			okButton: "ok",
			imageName: "phone_account_icon",
			// additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
			// Required to get audio in background when using Android 11
			foregroundService: {
				channelId: "Banjee_Call_Channel",
				channelName: "banjee message channel",
				notificationTitle: "CallKeep",
				// notificationIcon: "Path to the resource icon of the notification",
			},
		},
	};

	// const incomingCall = React.useCallback((mData) => {
	// 	console.warn("mData", mData);
	// 	navigate("OneToOneCall", {
	// 		...mData,
	// 		...mData.sender,
	// 		senderId: mData?.senderId,
	// 		userId: mData.senderId,
	// 		initiator: false,
	// 	});
	// }, []);

	// const endCall = React.useCallback(() => {}, []);
	// React.useEffect(() => {
	// 	RNCallKeep.addEventListener("answerCall", incomingCall);
	// 	RNCallKeep.addEventListener("endCall", endCall);
	// }, [incomingCall, endCall]);

	RNCallKeep.setup(initOptions).then(async (accepted) => {
		RNCallKeep.setAvailable(true);
		RNCallKeep.checkPhoneAccountEnabled();
		// let uuid = "89374897239";
		// const uuidvv = "ce810e1e-fb86-4bcd-b7cc-665667b594e2";
		// let handle = "9512795581";
		// let localizedCallerName = "Harsh Patel";
		// let handleType = "number";
		// let hasVideo = false;
		// let options = {};
		// let contactIdentifier = "Harsh Patel";

		// RNCallKeep.addEventListener("answerCall", incomingCall);
		// RNCallKeep.addEventListener("endCall", this.onEndCallAction);
		// setTimeout(async () => {
		// await RNCallKeep.displayIncomingCall(
		// 	uuidvv,
		// 	handle,
		// 	localizedCallerName,
		// 	handleType,
		// 	hasVideo,
		// 	options
		// );
		// .then((res) => connsole.warn(res))
		// .catch((err) => console.error(err));
		// await RNCallKeep.answerIncomingCall(uuidvv);
		// await RNCallKeep.startCall(uuidvv, handle, contactIdentifier);
		// }, 10000);
		// await RNCallKeep.isConnectionServiceAvailable();
	});
	return null;
}
