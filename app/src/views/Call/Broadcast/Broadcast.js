import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import React, { useState } from "react";
import {
	PermissionsAndroid,
	Platform,
	View,
	SafeAreaView,
	StatusBar,
	Alert,
	Dimensions,
} from "react-native";
import RtcEngine, {
	ChannelProfile,
	ClientRole,
	RtcEngineContext,
} from "react-native-agora";
import axios from "axios";
import InCallManager from "react-native-incall-manager";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import PushNotification from "react-native-push-notification";
// Context
import SocketContext from "../../../Context/Socket";
import BroadcastContext from "./Context";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { AppContext } from "../../../Context/AppContext";
// Components
import color from "../../../constants/env/color";
// Broadcast Components
// import EventListners from "./Components/EventListners";
import Header from "./Components/Header";
import ActionsCard from "./Components/ActionsCard";
import BroadcastView from "./Components/BroadcastView";
import ChatScreen from "./Components/Chat";
import ChatComponent from "./Components/ChatComponent";
import { useToast } from "native-base";
import KeyboardView from "../../../constants/components/KeyboardView";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
// import Chat from "./Components/Chat";
import Constants from "expo-constants";
import { setLocalStorage } from "../../../utils/Cache/TempStorage";

export default function BroadcastComp() {
	const { goBack } = useNavigation();
	const { socket } = React.useContext(SocketContext);

	const { setRtcEngine } = React.useContext(CallRtcEngine);
	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const {
		setRemotes,
		setConfigContext,
		setHost,
		setMembers,
		setLoading,
		promoted,
	} = React.useContext(BroadcastContext);

	const members = React.useContext(BroadcastContext)?.members || [];
	const loading = React.useContext(BroadcastContext)?.loading || false;

	const { params } = useRoute();
	const Toast = useToast();

	const { setActiveCallTimer, setCallType } = React.useContext(AppContext);

	const cloudId = params?.cloudId || "";
	const name = params?.name || "";
	const imageUri = params?.imageUri || "";
	const memberId = params?.memberId || "";
	const memberObj = params?.memberObj || "";
	const mobile = params?.memberObj?.mobile || "";
	const firstName = params?.memberObj?.firstName || "";
	const lastName = params?.memberObj?.lastName || "";
	const email = params?.memberObj?.email || "";
	const isHost = params?.isHost || false;

	const getUid = React.useCallback(() => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	}, []);

	const uid = getUid();

	const [engine, setEngineState] = useState(null);
	const [showActionbar, setShowActionbar] = useState(true);
	const [chatView, setChatView] = React.useState(false);
	const [openChat, setOpenChat] = React.useState(true);

	let callDetector;

	const _addListeners = React.useCallback((engine) => {
		engine?.addListener("Warning", (warningCode) => {
			console.info("Warning", warningCode);
		});
		engine?.addListener("Error", (errorCode) => {
			// console.info("Error", errorCode);
		});
		engine?.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
			setLoading(false);
			// console.info("JoinChannelSuccess", channel, uid, elapsed);
		});
		engine?.addListener("UserJoined", (uid, elapsed) => {
			if (uid) {
				setRemotes((prev) =>
					prev.filter((ele) => ele?.uid === uid)?.length > 0
						? prev
						: [...prev, { uid: uid, video: true, audio: true }]
				);
			}
		});
		engine.addListener("UserMuteVideo", async (uid, action) => {
			// console.warn("User video", uid, action);
			setRemotes((prev) =>
				prev.map((ele) => {
					if (ele?.uid === uid) {
						return {
							...ele,
							video: !action,
						};
					} else return ele;
				})
			);
		});
		engine.addListener("UserMuteAudio", async (uid, action) => {
			// console.warn("User audio", uid, action);
			setRemotes((prev) =>
				prev.map((ele) => {
					if (ele?.uid === uid) {
						return {
							...ele,
							audio: !action,
						};
					} else return ele;
				})
			);
		});
		engine?.addListener("UserOffline", (uid, reason) => {
			setRemotes((prev) => prev.filter((ele) => ele?.uid !== uid));
		});
		engine?.addListener("LeaveChannel", async (stats, uid) => {
			setRemotes([]);
		});
	}, []);

	const _initEngine = React.useCallback(
		async (token, promote) => {
			const engine = await RtcEngine.createWithContext(
				new RtcEngineContext("444b62a2786342678d99ace84ace53c5")
			);
			setEngineState(engine);
			setRtcEngine(engine);
			setCallType("Broadcast");
			await setLocalStorage("CallType", "Broadcast");
			if (engine) {
				_addListeners(engine);
				await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
				if (Platform.OS === "android") {
					await PermissionsAndroid.requestMultiple([
						PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
						PermissionsAndroid.PERMISSIONS.CAMERA,
						PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					]);
				}
				if (isHost || promote) {
					await engine.setClientRole(ClientRole.Broadcaster);
				} else {
					await engine.setClientRole(ClientRole.Audience);
				}
				await engine.setAudioProfile(1, 8);
				await engine.setVideoEncoderConfiguration({
					dimensions: {
						width: 320,
						height: 240,
					},
					frameRate: 15,
					orientationMode: 2,
				});
				await engine.enableVideo();
				await engine.enableAudio();
				await engine.startPreview();
				await engine.setEnableSpeakerphone(true);
				await engine.joinChannel(token, cloudId, null, uid);
			}
		},
		[isHost, uid, cloudId, _addListeners]
	);

	const getToken = React.useCallback(
		(promote) => {
			axios
				.get(`https://agora.banjee.org/rtc/${cloudId}/${"publisher"}/uid/${uid}/`)
				.then((res) => {
					PushNotification.localNotification({
						channelId: "Banjee_Message_Channel",
						foreground: true,
						channelName: "banjee message channel",
						id: 8,
						autoCancel: false,
						title: `${name}`,
						priority: "default",
						ongoing: true,
						userInteraction: true,
						message: `Ongoing broadcasting`,
						action: "BROADCAST",
						data: {
							fromSocket: true,
							click_action: "BROADCAST",
						},
						userInfo: {
							fromSocket: true,
							click_action: "BROADCAST",
						},
					});
					_initEngine(res.data.rtcToken, promote);
				})
				.catch((err) => {
					console.warn("----------------->", JSON.stringify(err, null, 2));
				});
		},
		[_initEngine, uid, mobile, cloudId, name, isHost]
	);

	React.useEffect(() => {
		setLoading(true);
		activateKeepAwake();
		if (!params.fromFixedNotification) {
			setConfigContext({
				cloudId,
				name,
				imageUri,
				memberId,
				memberObj,
				isHost,
			});
			getToken();
			if (isHost) {
				setHost({ hostId: memberId, ...memberObj });
				setMembers((prev) => [
					...prev,
					{
						...memberObj,
						id: memberId,
					},
				]);
				socket &&
					socket.send(
						JSON.stringify({
							action: "START_BROADCAST",
							data: {
								cloudId,
								name,
								imageUri,
								host: memberObj,
								hostId: memberId,
							},
						})
					);
			} else {
				socket &&
					socket.send(
						JSON.stringify({
							action: "JOIN_BROADCAST",
							data: {
								cloudId,
								memberObj: memberObj,
								memberId: memberId,
								isHost: isHost,
							},
						})
					);
				socket &&
					socket.send(
						JSON.stringify({
							action: "BROADCAST_CHAT",
							data: {
								cloudId: cloudId,
								memberId: memberId,
								memberObj: { ...memberObj, id: memberId },
								createdOn: new Date().toISOString(),
								content: { src: "joined", type: "ALERT" },
							},
						})
					);
			}
		}
	}, [socket, getToken, isHost, imageUri, name, cloudId, memberObj, memberId]);

	// const promoteMember = React.useCallback(() => {
	// 	getToken(true);
	// 	setPromoted(true);
	// }, []);

	// const demoteMember = React.useCallback(() => {
	// 	getToken(false);
	// 	setPromoted(false);
	// }, []);

	return (
		<KeyboardView fromComment={true}>
			{loading && <AppLoading visible={loading} />}
			<View
				style={{ flex: 1, marginTop: Constants.statusBarHeight, width: "100%" }}
			>
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
					{engine && (
						<BroadcastView
							memberObj={memberObj}
							showActionbar={showActionbar}
							handleActionbar={() => setShowActionbar(!showActionbar)}
						/>
					)}
					{engine && (
						<ActionsCard
							showActionbar={showActionbar}
							promoted={promoted}
							isHost={isHost}
						/>
					)}
					{/* <EventListners
					details={params}
					callDetector={callDetector}
					promoteMember={() => {
						getToken(true);
						setPromoted(true);
					}}
					demoteMember={() => {
						getToken(false);
						setPromoted(false);
					}}
				/> */}
					{showActionbar && engine && params && (
						<View
							style={{
								position: "absolute",
								top: 10,
								left: 0,
								width: "100%",
								paddingHorizontal: 10,
								zIndex: 99,
							}}
						>
							<Header
								chatView={chatView}
								setChatView={setChatView}
								members={members}
								setShowActionbar={() => {
									setShowActionbar(true);
								}}
								callDetector={callDetector}
								imageUri={imageUri}
								handleOpenChat={() => setOpenChat(!openChat)}
								openChat={openChat}
							/>
						</View>
					)}
					<View
						style={{
							position: "absolute",
							bottom: 60,
							left: 0,
							width: "100%",
							maxHeight: 180,
						}}
					>
						<ChatScreen openChat={openChat} />
					</View>
					{engine && (
						<View
							style={{
								position: "absolute",
								bottom: Platform.OS === "android" ? 10 : 15,
								left: 0,
								width: "100%",
								paddingHorizontal: 10,
							}}
						>
							<ChatComponent openChat={openChat} />
						</View>
					)}
				</View>
			</View>
		</KeyboardView>
	);
}
