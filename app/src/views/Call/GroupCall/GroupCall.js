import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
	PermissionsAndroid,
	Platform,
	View,
	SafeAreaView,
	StatusBar,
} from "react-native";
import RtcEngine, {
	ChannelProfile,
	ClientRole,
	RtcEngineContext,
} from "react-native-agora";
import axios from "axios";
import SocketContext from "../../../Context/Socket";
import InCallManager from "react-native-incall-manager";
// Components
import Header from "./GroupVideoCallUtils/Header";
import ActionsCard from "./GroupVideoCallUtils/ActionsCard";
import VideoCallScreen from "./GroupVideoCallUtils/VideoCallScreen";
import FeedbackScreen from "./GroupVideoCallUtils/FeedbackScreen";
import { AppContext } from "../../../Context/AppContext";
import CallContext from "./Context";
import PushNotification from "react-native-push-notification";
import { useHeaderHeight } from "@react-navigation/elements";
import EventListners from "./GroupVideoCallUtils/EventListners";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import {
	getLocalStorage,
	removeLocalStorage,
	setLocalStorage,
} from "../../../utils/Cache/TempStorage";
import CallDetectorManager from "../CallDetection";
import color from "../../../constants/env/color";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import Constants from "expo-constants";

export default function RoomVideoCall() {
	const { setOptions, goBack } = useNavigation();
	const { socket } = React.useContext(SocketContext);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;
	const { setRtcEngine } = React.useContext(CallRtcEngine);

	const {
		setRemoteUid,
		setRemoteVideo,
		setRemoteAudio,
		setRemoteAudioVolume,
		setLocalAudio,
		setLocalVideo,
		setMembers,
		setFeedback,
		setEmoji,
		setRaiseHand,
		setCallData,
	} = React.useContext(CallContext);

	const remoteUid = React.useContext(CallContext)?.remoteUid || [];
	const remoteAudio = React.useContext(CallContext)?.remoteAudio || [];
	const remoteVideo = React.useContext(CallContext)?.remoteVideo || [];
	const members = React.useContext(CallContext)?.members || [];

	const { params } = useRoute();

	const { setCallType, setActiveCallTimer } = React.useContext(AppContext);

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || false;
	const cloudId = params?.cloudId || "";
	const chatRoomId = params?.chatRoomId || "";
	const chatRoomImage = params?.chatRoomImage || "";
	const chatRoomName = params?.chatRoomName || "";
	const userObject = params?.userObject || {};
	const joinGroupNew = params?.joinGroup || false;
	const adminId = params?.adminId || "";

	const getUid = React.useCallback(() => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	}, [mobile]);

	const uid = getUid();

	const [engine, setEngineState] = useState(null);
	const [showActionbar, setShowActionbar] = useState(true);
	const [state, setState] = React.useState({
		chatRoomId: chatRoomId,
		isJoined: false,
		remoteUid: [],
		switchCamera: true,
		switchRender: true,
	});
	const [chatView, setChatView] = React.useState(false);

	let callDetector;

	const callDetection = React.useCallback((_rtcEngine) => {
		callDetector = new CallDetectorManager(
			(event, phoneNumber) => {
				if (event === "Disconnected") {
					console.warn("Disconnected ------------------------>>>>>>>>>");
				} else if (event === "Connected" && _rtcEngine) {
					_rtcEngine?.leaveChannel().then(() => {
						_rtcEngine?.destroy().then(() => {
							setRtcEngine(false);
							setCallType(false);
							setActiveCallTimer(0);
							removeLocalStorage("GroupCallData").then(() => {
								removeLocalStorage("GroupRemoteUid").then(() => {
									removeLocalStorage("GroupRemoteVideo").then(() => {
										removeLocalStorage("GroupRemoteAudio").then(() => {
											removeLocalStorage("GroupLocalVideo").then(() => {
												removeLocalStorage("GroupLocalAudio").then(() => {
													removeLocalStorage("GroupMembers").then(() => {
														removeLocalStorage("GroupFeedback").then(() => {
															removeLocalStorage("RtcEngine").then().catch();
															removeLocalStorage("CallType").then().catch();
															InCallManager.stop();
															PushNotification.cancelLocalNotification(8);
															socket.send(
																JSON.stringify({
																	action: "LEAVE_GROUP_CALL",
																	data: {
																		cloudId: cloudId,
																		chatRoomId: chatRoomId,
																		userId: systemUserId,
																		userObject: {
																			firstName: firstName,
																			lastName: lastName,
																		},
																	},
																})
															);
															goBack();
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				} else if (event === "Incoming") {
					console.warn("Incoming ------------------------>>>>>>>>>");
				} else if (event === "Dialing") {
					console.warn("Dialing ------------------------>>>>>>>>>");
				} else if (event === "Offhook" && _rtcEngine) {
					_rtcEngine?.leaveChannel().then(() => {
						_rtcEngine?.destroy().then(() => {
							setRtcEngine(false);
							setCallType(false);
							setActiveCallTimer(0);
							removeLocalStorage("GroupCallData").then(() => {
								removeLocalStorage("GroupRemoteUid").then(() => {
									removeLocalStorage("GroupRemoteVideo").then(() => {
										removeLocalStorage("GroupRemoteAudio").then(() => {
											removeLocalStorage("GroupLocalVideo").then(() => {
												removeLocalStorage("GroupLocalAudio").then(() => {
													removeLocalStorage("GroupMembers").then(() => {
														removeLocalStorage("GroupFeedback").then(() => {
															removeLocalStorage("RtcEngine").then().catch();
															removeLocalStorage("CallType").then().catch();
															InCallManager.stop();
															PushNotification.cancelLocalNotification(8);
															socket.send(
																JSON.stringify({
																	action: "LEAVE_GROUP_CALL",
																	data: {
																		cloudId: cloudId,
																		chatRoomId: chatRoomId,
																		userId: systemUserId,
																		userObject: {
																			firstName: firstName,
																			lastName: lastName,
																		},
																	},
																})
															);
															goBack();
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				} else if (event === "Missed") {
					console.warn("Missed ------------------------>>>>>>>>>");
				}
			},
			true,
			() => {
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
		(engine) => {
			engine?.addListener("Warning", (warningCode) => {
				console.info("Warning", warningCode);
			});
			engine?.addListener("Error", (errorCode) => {
				console.info("Error", errorCode);
			});
			engine?.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
				console.info("JoinChannelSuccess", channel, uid, elapsed);
				setState((prev) => ({ ...prev, isJoined: true }));
			});
			engine?.addListener("UserJoined", (uid, elapsed) => {
				console.info("UserJoined", uid, elapsed);
				if (uid) {
					getLocalStorage("GroupRemoteUid").then(async (res) => {
						const parseRes = JSON.parse(res);
						const newRes = [...parseRes, uid];
						await setLocalStorage("GroupRemoteUid", newRes);
					});
					setRemoteUid((prev) => [...prev, uid]);
				}
			});

			engine.addListener("UserMuteVideo", async (stats, action) => {
				if (action) {
					// await setLocalStorage("GroupRemoteVideo", [...remoteVideo, stats]);
					setRemoteVideo((prev) => [...prev, stats]);
				} else {
					// const newRVideos = remoteVideo?.filter((ele) => ele !== stats);
					// await setLocalStorage("GroupRemoteVideo", newRVideos);
					setRemoteVideo((prev) => prev.filter((ele) => ele !== stats));
				}
			});
			engine.addListener("UserMuteAudio", async (stats, action) => {
				if (action) {
					// await setLocalStorage("GroupRemoteAudio", [...remoteAudio, stats]);
					setRemoteAudio((prev) => [...prev, stats]);
				} else {
					// const newRAudios = remoteAudio?.filter((ele) => ele !== stats);
					// await setLocalStorage("GroupRemoteAudio", newRAudios);
					setRemoteAudio((prev) => prev.filter((ele) => ele !== stats));
				}
			});
			engine.addListener("AudioVolumeIndication", async (stats, action) => {
				// console.log("AudioVolumeIndication ------------", stats, action);
				setRemoteAudioVolume(stats);
			});
			engine?.addListener("UserOffline", (uid, reason) => {
				getLocalStorage("GroupRemoteUid").then(async (res) => {
					const parseRes = res && JSON.parse(res);
					const newRes = parseRes?.filter((ele) => ele !== uid);
					await setLocalStorage("GroupRemoteUid", newRes);
				});
				setRemoteUid((prev) => prev.filter((ele) => ele !== uid));
			});
			engine?.addListener("LeaveChannel", async (stats, uid) => {
				setRemoteUid([]);
				await setLocalStorage("GroupRemoteUid", []);
				// setState((prev) => ({ ...prev, isJoined: false, remoteUid: [] }));
			});
			callDetection(engine);
		},
		[callDetection]
	);

	React.useState(() => {
		// setRemoteUid, setRemoteVideo, setRemoteAudio, setMembers, setFeedback, setEmoji, setRaiseHand

		if (params.fromFixedNotification) {
			_addListeners(_rtcEngine);
			setEngineState(_rtcEngine);
			getLocalStorage("GroupCallData").then((result) => {
				console.warn("GroupCallData----", result);
				setCallData(JSON.parse(result));
			});
			getLocalStorage("GroupRemoteUid").then((result) => {
				console.warn("GroupRemoteUid----", result);
				setRemoteUid(JSON.parse(result));
			});
			getLocalStorage("GroupRemoteVideo").then((result) => {
				console.warn("GroupRemoteVideo----", result);
				setRemoteVideo(JSON.parse(result));
			});
			getLocalStorage("GroupRemoteAudio").then((result) => {
				console.warn("GroupRemoteAudio----", result);
				setRemoteAudio(JSON.parse(result));
			});
			getLocalStorage("GroupLocalVideo").then((result) => {
				console.warn("GroupLocalVideo----", result);
				setLocalVideo(JSON.parse(result));
			});
			getLocalStorage("GroupLocalAudio").then((result) => {
				console.warn("GroupLocalAudio----", result);
				setLocalAudio(JSON.parse(result));
			});
			getLocalStorage("GroupMembers").then((result) => {
				console.warn("GroupMembers----", result);
				setMembers(JSON.parse(result));
			});
			getLocalStorage("GroupFeedback").then((result) => {
				console.warn("GroupFeedback----", result);
				setFeedback(JSON.parse(result));
			});
		}
	}, [params, _rtcEngine, _addListeners]);

	const _initEngine = React.useCallback(
		async (token) => {
			const engine = await RtcEngine.createWithContext(
				new RtcEngineContext("444b62a2786342678d99ace84ace53c5")
			);
			setEngineState(engine);
			setRtcEngine(engine);
			setCallType("Group");
			await setLocalStorage("CallType", "GroupCall");
			if (engine) {
				_addListeners(engine);
				if (Platform.OS === "android") {
					await PermissionsAndroid.requestMultiple([
						PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
						PermissionsAndroid.PERMISSIONS.CAMERA,
						PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					]);
				}
				await engine.setVideoEncoderConfiguration({
					dimensions: {
						width: 320,
						height: 240,
					},
					//bitrate: 300,
					frameRate: 15,
					orientationMode: 2,
				});
				await engine.setEnableSpeakerphone(true);
				await engine.enableVideo();
				await engine.enableAudio();
				await engine.startPreview();
				await engine.enableAudioVolumeIndication(500, 3, true);
				await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
				await engine.setClientRole(ClientRole.Broadcaster);
				await engine?.joinChannel(token, chatRoomId, null, uid);
			}
			// return async () => {
			// 	await engine?.destroy();
			// };
		},
		[uid, chatRoomId, _addListeners]
	);

	const getToken = React.useCallback(() => {
		axios
			.get(`https://agora.banjee.org/rtc/${chatRoomId}/publisher/uid/${uid}/`)
			.then((res) => {
				PushNotification.localNotification({
					channelId: "Banjee_Message_Channel",
					foreground: true,
					channelName: "banjee message channel",
					id: 8,
					autoCancel: false,
					title: `${chatRoomName}`,
					priority: "high",
					ongoing: true,
					userInteraction: true,
					message: `Ongoing group call`,
					action: "GROUPCALL",
					data: {
						fromSocket: true,
						click_action: "GROUPCALL",
					},
					userInfo: {
						fromSocket: true,
						click_action: "GROUPCALL",
					},
				});
				_initEngine(res.data.rtcToken);
			})
			.catch((err) => {
				console.warn("----------------->", JSON.stringify(err, null, 2));
			});
	}, [_initEngine, uid, chatRoomId]);

	React.useEffect(() => {
		activateKeepAwake();
		if (!params.fromFixedNotification) {
			setCallData({
				cloudId,
				chatRoomId,
				chatRoomImage,
				chatRoomName,
				userObject,
				joinGroupNew,
				adminId,
			});
			getToken();
			InCallManager.turnScreenOn();
			if (joinGroupNew) {
				socket &&
					socket.send(
						JSON.stringify({
							action: "JOIN_GROUP_CALL",
							data: {
								cloudId: cloudId,
								chatRoomId: chatRoomId,
								chatRoomName: chatRoomName,
								chatRoomImage: chatRoomImage,
								userObject: userObject,
							},
						})
					);
			}
		}

		return () => {
			InCallManager.stop();
			// 	socket.send(
			// 		JSON.stringify({
			// 			action: "LEAVE_GROUP_CALL",
			// 			data: {
			// 				cloudId: cloudId,
			// 				chatRoomId: chatRoomId,
			// 				userId: systemUserId,
			// 				userObject: {
			// 					firstName: firstName,
			// 					lastName: lastName,
			// 				},
			// 			},
			// 		})
			// 	);
			// 	PushNotification.cancelLocalNotification(8);
		};
	}, [getToken, joinGroupNew, socket]);

	const h = useHeaderHeight();

	return (
		<View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
			{/* <StatusBar
				translucent={false}
				animated={true}
				backgroundColor={color.white}
			/> */}
			<View
				style={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "flex-start",
					width: "100%",
					backgroundColor: color.gradientWhite,
					position: "relative",
				}}
			>
				{showActionbar && (
					<Header
						chatView={chatView}
						setChatView={setChatView}
						members={members}
						setShowActionbar={() => {
							setShowActionbar(true);
						}}
						callDetector={callDetector}
					/>
				)}
				{chatView ? (
					<FeedbackScreen systemUserId={systemUserId} />
				) : (
					<VideoCallScreen
						userObject={userObject}
						handleActionbar={() => setShowActionbar(!showActionbar)}
					/>
				)}
				{/* <MutedVideoScreen /> */}
				<ActionsCard
					userObject={{
						firstName,
						lastName,
						mobile,
						uid,
					}}
					engine={engine}
					chatRoomId={chatRoomId}
					showActionbar={showActionbar}
				/>
				<EventListners
					engine={engine}
					details={{
						chatRoomId: chatRoomId,
						chatRoomName: chatRoomName,
						cloudId: cloudId,
						chatRoomImage: chatRoomImage,
						firstName,
						lastName,
						systemUserId,
					}}
					callDetector={callDetector}
				/>
			</View>
		</View>
	);
	// } else {
	// 	return <AppLoading visible={!state.isJoined} />;
	// }
}

// const _switchCamera = () => {
// 	_engine
// 		?.switchCamera()
// 		.then(() => {
// 			setState((prev) => ({...prev, switchCamera: !prev.switchCamera}));
// 		})
// 		.catch((err) => {
// 			console.warn("switchCamera", err);
// 		});
// };

// const _switchRender = () => {
// 	const {switchRender, remoteUid} = state;
// 	setState((prev) => ({
// 		...prev,
// 		switchRender: !switchRender,
// 		remoteUid: remoteUid.reverse(),
// 	}));
// };

// React.useEffect(() => {
// 	socket.on("VIDEO_MUTE", (result) => {
// 		// setGroupActionState((prev) => ({
// 		// 	...prev,
// 		// 	[getUserUid(result.initiator.mobile)]: {
// 		// 		...prev[getUserUid(result.initiator.mobile)],
// 		// 		video: true,
// 		// 		avtarImageUrl: result.initiator.avtarImageUrl,
// 		// 		name: result?.initiator?.firstName
// 		// 			? result?.initiator?.firstName
// 		// 			: result?.initiator?.username
// 		// 			? result?.initiator?.username
// 		// 			: "",
// 		// 		userObj: result,
// 		// 	},
// 		// }));
// 	});
// 	socket.on("VIDEO_UNMUTE", (result) => {
// 		// setGroupActionState((prev) => ({
// 		// 	...prev,
// 		// 	[getUserUid(result.initiator.mobile)]: {
// 		// 		...prev[getUserUid(result.initiator.mobile)],
// 		// 		video: false,
// 		// 		avtarImageUrl: result.initiator.avtarImageUrl,
// 		// 		name: result?.initiator?.firstName
// 		// 			? result?.initiator?.firstName
// 		// 			: result?.initiator?.username
// 		// 			? result?.initiator?.username
// 		// 			: "",
// 		// 		userObj: result,
// 		// 	},
// 		// }));
// 	});
// 	socket.on("MUTE", (result) => {
// 		// setGroupActionState((prev) => ({
// 		// 	...prev,
// 		// 	[getUserUid(result.initiator.mobile)]: {
// 		// 		...prev[getUserUid(result.initiator.mobile)],
// 		// 		audio: true,
// 		// 		avtarImageUrl: result.initiator.avtarImageUrl,
// 		// 		name: result?.initiator?.firstName
// 		// 			? result?.initiator?.firstName
// 		// 			: result?.initiator?.username
// 		// 			? result?.initiator?.username
// 		// 			: "",
// 		// 		userObj: result,
// 		// 	},
// 		// }));
// 	});
// 	socket.on("UNMUTE", (result) => {
// 		// setGroupActionState((prev) => ({
// 		// 	...prev,
// 		// 	[getUserUid(result.initiator.mobile)]: {
// 		// 		...prev[getUserUid(result.initiator.mobile)],
// 		// 		audio: false,
// 		// 		avtarImageUrl: result.initiator.avtarImageUrl,
// 		// 		name: result?.initiator?.firstName
// 		// 			? result?.initiator?.firstName
// 		// 			: result?.initiator?.username
// 		// 			? result?.initiator?.username
// 		// 			: "",
// 		// 		userObj: result,
// 		// 	},
// 		// }));
// 	});
// 	socket.on("RAISE_HAND", (result) => {
// 		// setRaisHandTimer(true);
// 		// setGroupActionState((prev) => ({
// 		// 	...prev,
// 		// 	[getUserUid(result.initiator.mobile)]: {
// 		// 		...prev[getUserUid(result.initiator.mobile)],
// 		// 		avtarImageUrl: result.initiator.avtarImageUrl,
// 		// 		name: result?.initiator?.firstName
// 		// 			? result?.initiator?.firstName
// 		// 			: result?.initiator?.username
// 		// 			? result?.initiator?.username
// 		// 			: "",
// 		// 		raiseHand: true,
// 		// 		userObj: result,
// 		// 	},
// 		// }));
// 		// setTimeout(() => {
// 		// 	setRaisHandTimer(false);
// 		// }, 5000);
// 	});
// 	socket.on("CHAT_MESSAGE", (result) => {
// 		// if (
// 		// 	result.content.mimeType === "image/gif" &&
// 		// 	result.roomId === room?.chatRoomId
// 		// ) {
// 		// 	setEmojiTimer(true);
// 		// 	setGroupActionState((prev) => ({
// 		// 		...prev,
// 		// 		[getUserUid(result.sender.mobile)]: {
// 		// 			...prev[getUserUid(result.sender.mobile)],
// 		// 			emoji: result.content.src,
// 		// 			userObj: result,
// 		// 		},
// 		// 	}));
// 		// 	setTimeout(() => {
// 		// 		setEmojiTimer(false);
// 		// 	}, 5000);
// 		// 	setFeedbackData((prev) => [
// 		// 		...prev,
// 		// 		{
// 		// 			userId: result.sender.id,
// 		// 			createdOn: result.createdOn,
// 		// 			userName: result?.sender?.firstName
// 		// 				? result?.sender?.firstName
// 		// 				: result?.sender?.username,
// 		// 			avtarImageUrl: result?.sender?.avtarImageUrl,
// 		// 			content: result?.content,
// 		// 		},
// 		// 	]);
// 		// }
// 	});
// }, []);
