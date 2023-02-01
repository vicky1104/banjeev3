import React, { useCallback, useEffect } from "react";
import {
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { PermissionsAndroid, Platform, SafeAreaView } from "react-native";
import RtcEngine, {
	ChannelProfile,
	ClientRole,
	RtcEngineContext,
} from "react-native-agora";
import PushNotification from "react-native-push-notification";
import InCallManager from "react-native-incall-manager";
import axios from "axios";
import { AppContext } from "../../../Context/AppContext";
import CallContext from "./Context";
import IncomingCallScreen from "./Components/IncomingCallScreen";
import VideoCallSurface from "./Components/VideoCallSurface";
import AudioCallSurface from "./Components/AudioCallSurface";
import SocketContext from "../../../Context/Socket";
import { showToast } from "../../../constants/components/ShowToast";
import SwitchRequestReceiveModal from "./Components/SwitchRequestReceiveModal";
import SwitchRequestModal from "./Components/SwitchRequestModal";
import SplashScreen from "react-native-splash-screen";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { isNull, isNumber, isString } from "underscore";
import {
	getLocalStorage,
	removeLocalStorage,
	setLocalStorage,
} from "../../../utils/Cache/TempStorage";
import CallDetectorManager from "../CallDetection";
import Sound from "react-native-sound";

export default function RoomVideoCall() {
	const { goBack } = useNavigation();
	const isFocused = useIsFocused();

	const { params } = useRoute();

	const { _rtcEngine, setRtcEngine } = React.useContext(CallRtcEngine);

	const { setCallType: setMainCallType } = React.useContext(AppContext);

	const { initiator, callType, roomId, callAccepted, fromFixedNotification } =
		params;
	const { socket } = React.useContext(SocketContext);
	const { setActiveCallTimer } = React.useContext(AppContext);

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || false;

	const {
		setCallContext,
		setRemoteUid,
		setVideoMute,
		setAudioMute,
		setSwitchCall,
		setCallType,
		setConnectionState,
		setCallingTune,
		setAllCallContext,
		setTimer,
	} = React.useContext(CallContext);

	const callTypeContext = React.useContext(CallContext)?.callType || "audio";
	const remoteUid = React.useContext(CallContext)?.remoteUid;
	const switchCall = React.useContext(CallContext)?.switchCall || {
		receive: false,
		requesting: false,
	};
	const videoMute = React.useContext(CallContext)?.videoMute || {
		remote: false,
		local: false,
	};
	const audioMute = React.useContext(CallContext)?.audioMute || {
		remote: false,
		local: false,
	};
	const timer = React.useContext(CallContext)?.timer || 0;

	const [callTimeOut, setCallTimeout] = React.useState(false);
	// const [timer, setTimer] = React.useState(0);

	const getUid = React.useCallback(() => {
		if (mobile) {
			if (mobile) {
				let reverseMobile = mobile.split("").reverse();
				let newMobile = reverseMobile.slice(0, 7);
				return parseInt(newMobile.reverse().join(""));
			} else {
				return parseInt(mobile);
			}
		} else {
			if (params.mobile) {
				let reverseMobile = params.mobile.split("").reverse();
				let newMobile = reverseMobile.slice(0, 7);
				return parseInt(newMobile.reverse().join(""));
			} else {
				return parseInt(params.mobile);
			}
		}
	}, [mobile]);

	const uid = getUid();

	const [initiatorState, setInitiatorState] = React.useState(initiator);
	const [ringer, setRinger] = React.useState(false);

	const formatTime = () => {
		const getSeconds = `0${parseInt(timer) % 60}`.slice(-2);
		const minutes = `${Math.floor(parseInt(timer) / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(parseInt(timer) / 3600)}`.slice(-2);
		return getHours > 0
			? `${getHours} : ${getMinutes} : ${getSeconds}`
			: `${getMinutes} : ${getSeconds}`;
	};

	const eventListeners = React.useCallback(
		(data, engine) => {
			const { action, data: mData } = JSON.parse(data);
			switch (action) {
				case "CALL_DECLINE":
					engine?.leaveChannel().then(() => {
						engine?.destroy().then(() => {
							removeLocalStorage("OTOCallType").then().catch();
							removeLocalStorage("OTOCallContext").then().catch();
							removeLocalStorage("OTORemoteUid").then().catch();
							removeLocalStorage("OTOMuteAudio").then().catch();
							removeLocalStorage("OTOMuteVideo").then().catch();
							removeLocalStorage("OTOSwitchCall").then().catch();
							removeLocalStorage("OTOConnectionState").then().catch();
							removeLocalStorage("RtcEngine").then().catch();
							removeLocalStorage("CallType").then().catch();
							setRtcEngine(false);
							PushNotification.cancelLocalNotification(8);
							showToast(
								mData.sender.firstName +
									" " +
									mData.sender.lastName +
									" " +
									"decline your call..."
							);
							// if (callingTune) {
							// 	alert("callingTune");
							// 	callingTune.stop();
							// 	callingTune.release();
							// 	setCallingTune(false);
							// }
							InCallManager.turnScreenOn();
							InCallManager.stopRingtone();
							InCallManager.stop();
							InCallManager.stopRingback();
							setMainCallType(false);
							setActiveCallTimer(0);
							setTimeout(() => {
								goBack();
								setAllCallContext();
							}, 500);
						});
					});
					break;
				case "VIDEO_CALL_REQUEST_RECEIVE":
					setLocalStorage("OTOSwitchCall", {
						...switchCall,
						receive: true,
						data: mData,
					})
						.then()
						.catch();
					setSwitchCall((prev) => ({ ...prev, receive: true, data: mData }));
					break;
				case "VIDEO_CALL_REQUEST_CANCEL":
					showToast(
						mData.sender.firstName +
							" " +
							mData.sender.lastName +
							" " +
							"cancel video call request..."
					);
					setLocalStorage("OTOSwitchCall", { ...switchCall, receive: false })
						.then()
						.catch();
					setSwitchCall((prev) => ({ ...prev, receive: false }));
					break;
				case "VIDEO_CALL_REQUEST_DECLINE":
					showToast(
						mData.sender.firstName +
							" " +
							mData.sender.lastName +
							" " +
							"decline your video call request..."
					);
					setLocalStorage("OTOSwitchCall", { ...switchCall, requesting: false })
						.then()
						.catch();
					setSwitchCall((prev) => ({ ...prev, requesting: false }));
					break;
				default:
					break;
			}
		},
		[setSwitchCall]
	);

	const socketEventListen = React.useCallback(
		(engine) => {
			socket &&
				socket.addEventListener("message", ({ data }) =>
					eventListeners(data, engine)
				);

			return () => {
				socket.removeEventListener("message", eventListeners);
			};
		},
		[socket, eventListeners]
	);

	let callDetector;

	const callDetection = React.useCallback((engine) => {
		callDetector = new CallDetectorManager(
			(event, phoneNumber) => {
				if (event === "Disconnected") {
					console.warn("Disconnected ------------------------>>>>>>>>>");
				} else if (event === "Connected" && engine) {
					console.warn("On going call");
					setLocalStorage("OTORemoteUid", false).then().catch();
					setRemoteUid(false);
					engine?.destroy().then((res) => {
						PushNotification.cancelLocalNotification(8);
						setRtcEngine(false);
						setMainCallType(false);
						setActiveCallTimer(0);
						removeLocalStorage("OTOCallType").then().catch();
						removeLocalStorage("OTOCallContext").then().catch();
						removeLocalStorage("OTORemoteUid").then().catch();
						removeLocalStorage("OTOMuteAudio").then().catch();
						removeLocalStorage("OTOMuteVideo").then().catch();
						removeLocalStorage("OTOSwitchCall").then().catch();
						removeLocalStorage("OTOConnectionState").then().catch();
						removeLocalStorage("RtcEngine").then().catch();
						removeLocalStorage("CallType").then().catch();
						setAllCallContext();
						InCallManager.turnScreenOn();
						InCallManager.stopRingtone();
						InCallManager.stopRingback();
						InCallManager.stop();
						showToast(
							params.firstName + " " + params.lastName + " " + "left the call..."
						);
						if (isFocused) {
							goBack();
						}
					});
					console.warn("Connected ------------------------>>>>>>>>>");
					// Do something call got connected
					// This clause will only be executed for iOS
				} else if (event === "Incoming") {
					console.warn("Incoming ------------------------>>>>>>>>>");
					// Do something call got incoming
				} else if (event === "Dialing") {
					console.warn("Dialing ------------------------>>>>>>>>>");
					// Do something call got dialing
					// This clause will only be executed for iOS
				} else if (event === "Offhook" && engine) {
					setLocalStorage("OTORemoteUid", false).then().catch();
					setRemoteUid(false);
					engine?.destroy().then((res) => {
						PushNotification.cancelLocalNotification(8);
						setRtcEngine(false);
						setMainCallType(false);
						setActiveCallTimer(0);
						removeLocalStorage("OTOCallType").then().catch();
						removeLocalStorage("OTOCallContext").then().catch();
						removeLocalStorage("OTORemoteUid").then().catch();
						removeLocalStorage("OTOMuteAudio").then().catch();
						removeLocalStorage("OTOMuteVideo").then().catch();
						removeLocalStorage("OTOSwitchCall").then().catch();
						removeLocalStorage("OTOConnectionState").then().catch();
						removeLocalStorage("RtcEngine").then().catch();
						removeLocalStorage("CallType").then().catch();
						setAllCallContext();
						InCallManager.turnScreenOn();
						InCallManager.stopRingtone();
						InCallManager.stopRingback();
						InCallManager.stop();
						showToast(
							params.firstName + " " + params.lastName + " " + "left the call..."
						);
						if (isFocused) {
							goBack();
						}
					});
					console.warn("Offhook ------------------------>>>>>>>>>");
					//Device call state: Off-hook.
					// At least one call exists that is dialing,
					// active, or on hold,
					// and no calls are ringing or waiting.
					// This clause will only be executed for Android
				} else if (event === "Missed") {
					console.warn("Missed ------------------------>>>>>>>>>");
					// Do something call got missed
					// This clause will only be executed for Android
				}
			},
			true, // To detect incoming calls [ANDROID]
			() => {
				// If your permission got denied [ANDROID]
				// Only if you want to read incoming number
				// Default: console.error
				console.log("Permission Denied by User");
			},
			{
				title: "Phone State Permission",
				message:
					"This app needs access to your phone state in order to react and/or to adapt to incoming calls.",
			}
		);
		return () => {
			callDetector && callDetector.dispose();
		};
	}, []);

	const _addListeners = React.useCallback(
		(engine, ding) => {
			socketEventListen(engine);
			engine?.addListener("Warning", (warningCode) => {
				// console.info("Warning", warningCode);
			});
			engine?.addListener("Error", (errorCode) => {
				console.info("Error", errorCode);
			});
			engine?.addListener("RtcStats", (state) => {
				if (parseInt(state.duration) === 30) {
					const leaveFunc = () => {
						ringer && ringer?.stop();
						callDetector && callDetector.dispose();
						setRemoteUid(false);
						deactivateKeepAwake();
						engine?.destroy().then((res) => {
							socket.send(
								JSON.stringify({
									action: "CANCEL_CALL",
									data: {
										senderId: systemUserId,
										sender: {
											firstName: firstName,
											lastName: lastName,
										},
										receiverId: params.userId,
										receiver: {
											firstName: params.firstName,
											lastName: params.lastName,
										},
										roomId: params.roomId,
										callType: params.callType,
									},
								})
							);
							PushNotification.cancelLocalNotification(8);
							setRtcEngine(false);
							setMainCallType(false);
							setActiveCallTimer(0);
							removeLocalStorage("OTOCallType").then().catch();
							removeLocalStorage("OTOCallContext").then().catch();
							removeLocalStorage("OTORemoteUid").then().catch();
							removeLocalStorage("OTOMuteAudio").then().catch();
							removeLocalStorage("OTOMuteVideo").then().catch();
							removeLocalStorage("OTOSwitchCall").then().catch();
							removeLocalStorage("OTOConnectionState").then().catch();
							removeLocalStorage("RtcEngine").then().catch();
							removeLocalStorage("CallType").then().catch();
							setAllCallContext();
							InCallManager.turnScreenOn();
							InCallManager.stopRingtone();
							InCallManager.stopRingback();
							InCallManager.stop();
							showToast(
								params.firstName + " " + params.lastName + " " + "not answering..."
							);
							if (isFocused) {
								goBack();
							}
						});
					};
					getLocalStorage("OTORemoteUid")
						?.then((res) => {
							if (!res) {
								leaveFunc();
							} else {
								// alert("have uid");
							}
						})
						.catch(() => {
							leaveFunc();
						});
				}
				setTimer(parseInt(state.duration));
				setTimeout(() => {
					setTimer(parseInt(state.duration) + 1);
				}, 1000);
			});
			engine?.addListener("UserJoined", async (uid, elapsed) => {
				// if (callingTune) {
				// 	callingTune.stop();
				// 	callingTune.release();
				// 	setCallingTune(false);
				// }
				ding ? ding?.stop() : ringer && ringer?.stop();
				await setLocalStorage("OTORemoteUid", uid);
				setRemoteUid(uid);
				InCallManager.stopRingtone();
				InCallManager.stop();
			});
			engine?.addListener("UserOffline", (uid, reason) => {
				setLocalStorage("OTORemoteUid", false).then().catch();
				setRemoteUid(false);
				deactivateKeepAwake();
				engine?.destroy().then((res) => {
					callDetector && callDetector.dispose();
					PushNotification.cancelLocalNotification(8);
					setRtcEngine(false);
					setMainCallType(false);
					setActiveCallTimer(0);
					showToast(
						params.firstName + " " + params.lastName + " " + "left the call..."
					);
					if (isFocused) {
						goBack();
					}
					setMainCallType(false);
					removeLocalStorage("OTOCallType").then().catch();
					removeLocalStorage("OTOCallContext").then().catch();
					removeLocalStorage("OTORemoteUid").then().catch();
					removeLocalStorage("OTOMuteAudio").then().catch();
					removeLocalStorage("OTOMuteVideo").then().catch();
					removeLocalStorage("OTOSwitchCall").then().catch();
					removeLocalStorage("OTOConnectionState").then().catch();
					removeLocalStorage("RtcEngine").then().catch();
					removeLocalStorage("CallType").then().catch();
					setAllCallContext();
					InCallManager.turnScreenOn();
					InCallManager.stopRingtone();
					InCallManager.stopRingback();
					InCallManager.stop();
				});
			});
			engine?.addListener("LeaveChannel", (stats) => {
				callDetector && callDetector.dispose();
				setLocalStorage("OTORemoteUid", false).then().catch();
				setRemoteUid(false);
				deactivateKeepAwake();
				engine?.destroy().then((res) => {
					PushNotification.cancelLocalNotification(8);
					setRtcEngine(false);
					setMainCallType(false);
					setActiveCallTimer(0);
					removeLocalStorage("OTOCallType").then().catch();
					removeLocalStorage("OTOCallContext").then().catch();
					removeLocalStorage("OTORemoteUid").then().catch();
					removeLocalStorage("OTOMuteAudio").then().catch();
					removeLocalStorage("OTOMuteVideo").then().catch();
					removeLocalStorage("OTOSwitchCall").then().catch();
					removeLocalStorage("OTOConnectionState").then().catch();
					removeLocalStorage("RtcEngine").then().catch();
					removeLocalStorage("CallType").then().catch();
					setAllCallContext();
					InCallManager.turnScreenOn();
					InCallManager.stopRingtone();
					InCallManager.stopRingback();
					InCallManager.stop();
					showToast(
						params.firstName + " " + params.lastName + " " + "left the call..."
					);
					if (isFocused) {
						goBack();
					}
				});
			});
			engine?.addListener("UserMuteVideo", async (stats, action) => {
				if (!action) {
					await engine?.setEnableSpeakerphone(true);
				}
				await setLocalStorage("OTOMuteVideo", { ...videoMute, remote: action });
				setVideoMute((prev) => ({ ...prev, remote: action }));
			});
			engine?.addListener("UserMuteAudio", async (stats, action) => {
				await setLocalStorage("OTOMuteAudio", { ...audioMute, remote: action });
				setAudioMute((prev) => ({ ...prev, remote: action }));
			});
			engine?.addListener("ConnectionStateChanged", async (stats, action) => {
				await setLocalStorage("OTOConnectionState", stats);
				setConnectionState(stats);
			});
			engine?.addListener("UserEnableVideo", async (stats, action) => {
				await setLocalStorage("OTOCallType", "video");
				setCallType("video");
				await setLocalStorage("OTOSwitchCall", {
					...switchCall,
					requesting: false,
				});
				setSwitchCall((prev) => ({ ...prev, requesting: false }));
				await engine.setEnableSpeakerphone(true);
				await engine.enableVideo();
				await engine.enableInEarMonitoring(false);
				PushNotification.cancelLocalNotification(8);
				PushNotification.localNotification({
					channelId: "Banjee_Message_Channel",
					foreground: true,
					channelName: "banjee message channel",
					id: 8,
					autoCancel: false,
					title: `Ongoing Video Call`,
					ongoing: true,
					userInteraction: true,
					message: `Call with ${params?.firstName} ${params?.lastName}`,
					action: "ONETOONECALL",
					data: {
						fromSocket: true,
						click_action: "ONETOONECALL",
					},
					userInfo: {
						fromSocket: true,
						click_action: "ONETOONECALL",
					},
				});
				InCallManager.turnScreenOn();
			});
			callDetection(engine);
		},
		[
			callDetection,
			setRemoteUid,
			setVideoMute,
			setAudioMute,
			setCallType,
			setSwitchCall,
			socketEventListen,
			setConnectionState,
			params,
		]
	);

	React.useEffect(() => {
		if (params.fromFixedNotification && _rtcEngine) {
			console.warn("engineeeeee", _rtcEngine);
			_addListeners(_rtcEngine);
			getLocalStorage("OTOCallContext").then((result) => {
				setCallContext(JSON.parse(result));
				getLocalStorage("OTOCallType").then((result) => {
					setCallType(JSON.parse(result));
				});
			});
			getLocalStorage("OTORemoteUid").then((result) => {
				setRemoteUid(parseInt(result));
			});
			getLocalStorage("OTOMuteAudio").then((result) => {
				setAudioMute(JSON.parse(result));
			});
			getLocalStorage("OTOMuteVideo").then((result) => {
				setVideoMute(JSON.parse(result));
			});
			getLocalStorage("OTOSwitchCall").then((result) => {
				setSwitchCall(JSON.parse(result));
			});
			getLocalStorage("OTOConnectionState").then((result) => {
				setConnectionState(parseInt(result));
			});
		}
	}, [params, _rtcEngine, _addListeners]);

	const stopCalling = React.useCallback(
		(engine) => {
			if (remoteUid === false) {
				// if (callingTune) {
				// 	callingTune.stop();
				// 	callingTune.release();
				// 	setCallingTune(false);
				// }
				engine?.leaveChannel().then(() => {
					engine?.destroy().then(() => {
						socket.send(
							JSON.stringify({
								action: "CANCEL_CALL",
								data: {
									senderId: systemUserId,
									sender: {
										firstName: firstName,
										lastName: lastName,
									},
									receiverId: params.userId,
									receiver: {
										firstName: params.firstName,
										lastName: params.lastName,
									},
									roomId: params.roomId,
									callType: params.callType,
								},
							})
						);
						showToast(
							params.firstName + " " + params.lastName + " " + "is not answering..."
						);
						setAllCallContext();
						goBack();
						InCallManager.turnScreenOn();
						InCallManager.stopRingtone();
						InCallManager.stop();
						InCallManager.stopRingback();
					});
				});
			}
		},
		[remoteUid]
	);

	const _initEngine = React.useCallback(
		async (token) => {
			let engine = await RtcEngine.createWithContext(
				new RtcEngineContext("444b62a2786342678d99ace84ace53c5")
			);
			setRtcEngine(engine);
			setMainCallType("OneToOne");

			await setLocalStorage("CallType", "OneToOne");
			if (params?.initiator) {
				Sound.setCategory("Playback");
				var ding = new Sound(
					"https://banjee.s3.eu-central-1.amazonaws.com/root/sound/ringer.mp3",
					null,
					(error) => {
						if (error) {
							console.log("failed to load the sound", error);
							return;
						} else {
							ding.play();
						}
						//console.log("when loaded successfully");
					}
				);
				ding.setVolume(1);
				setRinger(ding);
			}
			_addListeners(engine, ding);
			// setTimeout(() => {
			// 	stopCalling(engine);
			// }, 10000);
			if (Platform.OS === "android") {
				await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
					PermissionsAndroid.PERMISSIONS.CAMERA,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				]);
			}
			if (callType === "audio") {
				await engine.enableAudio();
				await engine.setEnableSpeakerphone(false);
				await engine.enableInEarMonitoring(true);
				InCallManager.turnScreenOff();
			} else {
				await engine.setEnableSpeakerphone(true);
				await engine.enableVideo();
				InCallManager.turnScreenOn();
				activateKeepAwake();
			}
			await engine.startPreview();
			await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
			await engine.setClientRole(ClientRole.Broadcaster);
			await engine?.joinChannel(token, roomId, null, uid);
			// return async () => {
			// 	await engine?.destroy();
			// };
		},
		[uid, callType, roomId, _addListeners, params]
	);

	const getToken = React.useCallback(() => {
		axios
			.get(`https://agora.banjee.org/rtc/${roomId}/publisher/uid/${uid}`)
			.then((res) => {
				// setRtcToken(res.data.rtcToken)

				PushNotification.localNotification({
					channelId: "Banjee_Message_Channel",
					foreground: true,
					channelName: "banjee message channel",
					id: 8,
					autoCancel: false,
					title: `Ongoing ${params?.callType === "audio" ? "Audio" : "Video"} Call`,
					priority: "high",
					ongoing: true,
					userInteraction: true,
					message: `Call with ${params?.firstName} ${params?.lastName}`,
					action: "ONETOONECALL",
					data: {
						fromSocket: true,
						click_action: "ONETOONECALL",
					},
					userInfo: {
						fromSocket: true,
						click_action: "ONETOONECALL",
					},
				});
				_initEngine(res.data.rtcToken);
			})
			.catch((err) => {
				console.error(
					"-----------------> get rtc token error",
					JSON.stringify(err, null, 2)
				);
			});
	}, [uid, roomId]);
	// console.warn("params.initiator", {
	// 	sender: {
	// 		firstName: firstName,
	// 		lastName: lastName,
	// 		mobile: mobile,
	// 	},
	// 	senderId: systemUserId,
	// 	receiver: {
	// 		firstName: params.firstName,
	// 		lastName: params.lastName,
	// 		mobile: params.mobile,
	// 	},
	// 	receiverId: params.userId,
	// 	roomId: params.roomId,
	// 	callType: params.callType,
	// });

	const initiateCallFun = React.useCallback(async () => {
		if (Platform.OS === "android") {
			await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
			]);
		}
		if (params.initiator) {
			socket.send(
				JSON.stringify({
					action: "INITIATE_CALL",
					data: {
						sender: {
							firstName: firstName,
							lastName: lastName,
							mobile: mobile,
						},
						senderId: systemUserId,
						receiver: {
							firstName: params.firstName,
							lastName: params.lastName,
							mobile: params.mobile,
						},
						receiverId: params.userId,
						roomId: params.roomId,
						callType: params.callType,
					},
				})
			);
		}
		// InCallManager.start({
		// 	media: params.callType === "audio" ? "audio" : "other",
		// 	auto: true,
		// 	ringback: "",
		// });
		// callerTone = new Sound(
		// 	"https://banjee.s3.eu-central-1.amazonaws.com/root/sound/phone-ringing.mp3",
		// 	null,
		// 	(error) => {
		// 		if (error) {
		// 			console.log("failed to load the sound", error);
		// 			return;
		// 		} else {
		// 			callerTone.play();
		// 		}
		// 		//console.log("when loaded successfully");
		// 	}
		// );
		// callerTone.setVolume(1);
		// setCallingTune(callerTone);
	}, [params, firstName, lastName, mobile, systemUserId]);

	React.useEffect(() => {
		if (!params?.fromFixedNotification) {
			initiateCallFun();
		}
	}, [initiateCallFun, params]);

	React.useEffect(() => {
		if (!params?.fromFixedNotification) {
			if (params?.initiator) {
				getToken();
			}
			if (params?.fromNotification) {
				SplashScreen.hide();
				PushNotification.cancelLocalNotification(1);
				InCallManager.stopRingtone();
			}
			setLocalStorage("OTOCallContext", {
				callerObj: {
					firstName: params.firstName,
					lastName: params.lastName,
					id: params.userId,
				},
				callType: params.callType,
				roomId: params.roomId,
				systemUserId: systemUserId,
				callerId: params.userId,
				initiator: params.initiator,
				callId: params?.callId ? params?.callId : "",
			})
				.then()
				.catch();
			setLocalStorage("OTOCallType", params.callType).then().catch();
			setLocalStorage("OTOMuteAudio", { local: false, remote: false })
				.then()
				.catch();
			setLocalStorage("OTOMuteVideo", { local: false, remote: false })
				.then()
				.catch();
			setLocalStorage("OTOSwitchCall", { receive: false, requesting: false })
				.then()
				.catch();
			setCallContext({
				callerObj: {
					firstName: params.firstName,
					lastName: params.lastName,
					id: params.userId,
				},
				callType: params.callType,
				roomId: params.roomId,
				systemUserId: systemUserId,
				callerId: params.userId,
				initiator: params.initiator,
				callId: params?.callId ? params?.callId : "",
			});
		}

		// return async () => {
		// 	await _rtcEngine?.destroy();
		// 	setAllCallContext();
		// 	PushNotification.cancelLocalNotification(8);

		// };
	}, [getToken, params]);

	const acceptCallFun = useCallback(() => {
		PushNotification.cancelLocalNotification(1);
		setInitiatorState(true);
		getToken();
		InCallManager.stopRingtone();
	}, [getToken]);

	const acceptVideoRequest = async () => {
		await setLocalStorage("OTOCallType", "video");
		setCallType("video");
		await setLocalStorage("OTOSwitchCall", { ...switchCall, receive: false });
		setSwitchCall((prev) => ({ ...prev, receive: false }));
		await _rtcEngine.enableVideo();
		await _rtcEngine.setEnableSpeakerphone(true);
		await _rtcEngine.enableInEarMonitoring(false);
		InCallManager.turnScreenOn();
	};

	const renderScreen = () => {
		if (initiatorState || params?.fromFixedNotification) {
			if (callTypeContext && (params.initiator || remoteUid)) {
				if (callTypeContext === "audio") {
					return (
						<AudioCallSurface
							ringer={ringer}
							timer={formatTime}
							showCalling={params.initiator}
							callDetector={callDetector}
						/>
					);
				} else {
					return (
						<VideoCallSurface
							ringer={ringer}
							timer={formatTime}
							showCalling={params.initiator}
							callDetector={callDetector}
						/>
					);
				}
			} else return null;
		} else {
			return <IncomingCallScreen acceptCall={acceptCallFun} />;
		}
	};

	return (
		<React.Fragment>
			{renderScreen()}
			{switchCall.receive && (
				<SwitchRequestReceiveModal acceptVideoRequest={acceptVideoRequest} />
			)}
			{switchCall.requesting && <SwitchRequestModal />}
		</React.Fragment>
	);
}
