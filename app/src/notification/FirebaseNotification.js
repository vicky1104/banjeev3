import React, { useContext } from "react";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/messaging";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import axios from "axios";
import { getLocalStorage } from "../utils/Cache/TempStorage";
import jwtDecode from "jwt-decode";
import { Platform } from "react-native";
import { AppContext } from "../Context/AppContext";

function Firebase(props) {
	const { userData } = useContext(AppContext);

	const firebaseRegistry = React.useCallback(async (token, systemUserId) => {
		try {
			let l = await axios.post(
				"https://gateway.banjee.org/services/message-broker/api/fireBaseRegistry",
				{
					fireBaseToken: token,
					id: systemUserId,
					user: {
						age: 0,
						authorities: null,
						avtarImageUrl: null,
						avtarUrl: null,
						birthDate: null,
						domain: null,
						email: null,
						firstName: null,
						gender: null,
						id: null,
						lastName: null,
						locale: null,
						mcc: null,
						mobile: null,
						realm: null,
						ssid: null,
						systemUserId: systemUserId,
						timeZoneId: null,
						username: null,
					},
					userId: systemUserId,
					deviceType: Platform.OS === "android" ? "Android" : "Apple",
				}
			);
		} catch (err) {
			console.log("firebase registry", err);
		}
	}, []);

	// const sendNotificationCall = React.useCallback((message) => {
	// 	PushNotification.localNotification({
	// 		...pushNotificationParams,
	// 		title: `Notification`,
	// 		message: `Firebase notification`,
	// 	});
	// }, []);

	// const getNotification = React.useCallback(() => {
	// 	messaging().setBackgroundMessageHandler((payload) => {
	// 		// sendNotificationCall();
	// 		// console.log("Message handled in the background!", payload);
	// 	});
	// 	messaging().onMessage((remoteMessage) => {
	// 		// sendNotificationCall();
	// 		// console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
	// 	});
	// 	messaging().onNotificationOpenedApp(async (remoteMessage) => {
	// 		// sendNotificationCall();
	// 		// console.log("Message handled in the background!", remoteMessage);
	// 	});
	// 	// messaging()
	// 	// 	.getInitialNotification()
	// 	// 	.then((remoteMessage) => {
	// 	// 		sendNotificationCall();
	// 	// 		console.warn(
	// 	// 			"Message handled in the background!------------------------------->>>>>>>",
	// 	// 			remoteMessage
	// 	// 		);
	// 	// 	});
	// }, [sendNotificationCall]);

	const getToken = React.useCallback(
		(systemUserId) => {
			firebase
				.messaging()
				.getToken()
				.then((token) => {
					firebaseRegistry(token, systemUserId);
					// getNotification();
				})
				.catch((error) => console.log("Fire base ", error));
		},
		[firebaseRegistry]
	);

	const requestUserPermission = React.useCallback(async () => {
		if (userData) {
			getToken(userData?.id);
		}
	}, [userData]);

	React.useEffect(() => {
		requestUserPermission();
	}, [requestUserPermission]);

	return null;
}

export default Firebase;

// import React from "react";
// import firebase from "react-native-firebase";

// export default function Firebase() {
// 	const getToken = React.useCallback(async () => {
// 		const fcmToken = await firebase.messaging().getToken();
// 		console.warn("Firebase token ---->>", fcmToken);
// 	}, []);

// 	const requestPermission = React.useCallback(async () => {
// 		try {
// 			await firebase.messaging().requestPermission();
// 			getToken();
// 		} catch (error) {
// 			console.error("permission rejected");
// 		}
// 	}, [getToken]);

// 	const checkPermission = React.useCallback(async () => {
// 		const enabled = await firebase.messaging().hasPermission();
// 		if (enabled) {
// 			getToken();
// 		} else {
// 			requestPermission();
// 		}
// 	}, [getToken, requestPermission]);

// 	const createNotificationListeners = React.useCallback(() => {
// 		firebase.notifications().onNotification((notification) => {
// 			firebase.notifications().displayNotification(notification);
// 		});
// 	}, []);

// 	//   const removeNotificationListeners = () => {
// 	//     onUnsubscribeNotificaitonListener();
// 	//   };

// 	React.useEffect(() => {
// 		checkPermission();
// 		createNotificationListeners();
// 		// return () => {
// 		//     removeNotificationListeners();
// 		// }
// 	}, [checkPermission, createNotificationListeners]);

// 	return null;
// }
