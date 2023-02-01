import React from "react";
import { NativeModules, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
	Entypo,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";

import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import InCallManager from "react-native-incall-manager";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import CallContext from "../Context";
import { AppContext } from "../../../../Context/AppContext";
import SocketContext from "../../../../Context/Socket";
import PushNotification from "react-native-push-notification";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import { removeLocalStorage } from "../../../../utils/Cache/TempStorage";

const NativeCallDetector = NativeModules.CallDetectionManager;
const NativeCallDetectorAndroid = NativeModules.CallDetectionManagerAndroid;

export default function Actionbar({
	videoOnOffBtn,
	muteUnmuteBtn,
	speakerOnOffBtn,
	flipCameraBtn,
	switchToVideoBtn,
	videoSpeakerOnOffBtn,
	callDetector,
	ringer,
}) {
	const { goBack } = useNavigation();

	const { socket } = React.useContext(SocketContext);

	const { setVideoMute, setAudioMute, setSwitchCall, setAllCallContext } =
		React.useContext(CallContext);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine;
	const { setRtcEngine } = React.useContext(CallRtcEngine);

	const firstName = React.useContext(CallContext)?.callerObj?.firstName || "";
	const lastName = React.useContext(CallContext)?.callerObj?.lastName || "";
	const callerId = React.useContext(CallContext)?.callerId || "";
	const roomId = React.useContext(CallContext)?.roomId || "";
	const callType = React.useContext(CallContext)?.callType || "audio";
	const remoteUid = React.useContext(CallContext)?.remoteUid || false;
	const callId = React.useContext(CallContext)?.callId || "";
	const systemUserId = React.useContext(CallContext)?.systemUserId || "";
	const initiator = React.useContext(CallContext)?.initiator || "";
	const videoMute = React.useContext(CallContext)?.videoMute || {
		remote: false,
		local: false,
	};
	const audioMute = React.useContext(CallContext)?.audioMute || {
		remote: false,
		local: false,
	};
	const switchCall = React.useContext(CallContext)?.switchCall || {
		receive: false,
		requesting: false,
	};
	const connectionState = React.useContext(CallContext)?.connectionState || 3;
	const callingTune = React.useContext(CallContext)?.callingTune || false;
	const timer = React.useContext(CallContext)?.timer || 0;

	const userFirstName = React.useContext(AppContext)?.profile?.firstName || "";
	const userLastName = React.useContext(AppContext)?.profile?.lastName || "";
	const { setCallType: setMainCallType, setActiveCallTimer } =
		React.useContext(AppContext);

	const [actions, setActions] = React.useState({
		speaker: false,
		mute: false,
		video: false,
		camera: "front",
		videoSpeaker: true,
	});

	const muteLocalAudioStreamFun = async (props) => {
		await _rtcEngine?.muteLocalAudioStream(!props);
		await _rtcEngine?.enableLocalAudio(props);
	};
	const speakerStreamFun = async (props) => {
		await _rtcEngine?.setEnableSpeakerphone(!props);
	};
	const muteLocalVideoStreamFun = async (props) => {
		await _rtcEngine?.muteLocalVideoStream(!props);
		await _rtcEngine?.enableLocalVideo(props);
	};
	const muteUnmuteFun = () => {
		setActions((prev) => ({ ...prev, mute: !actions.mute }));
		setAudioMute((prev) => ({ ...prev, local: !prev.local }));
		muteLocalAudioStreamFun(actions.mute);
	};
	const speakerOnOffFun = () => {
		setActions((prev) => ({ ...prev, speaker: !actions.speaker }));
		speakerStreamFun(actions.speaker);
	};
	const videoSpeakerOnOffFun = () => {
		setActions((prev) => ({ ...prev, videoSpeaker: !actions.videoSpeaker }));
		speakerStreamFun(actions.videoSpeaker);
	};
	const videoMuteUnmuteFun = () => {
		if (actions.video) {
			videoSpeakerOnOffFun();
		}
		setActions((prev) => ({
			...prev,
			video: !actions.video,
		}));
		setVideoMute((prev) => ({ ...prev, local: !prev.local }));
		muteLocalVideoStreamFun(actions.video);
	};
	const switchCameraFun = () => {
		_rtcEngine
			?.switchCamera()
			.then(() => {
				setActions((prev) => ({ ...prev, camera: !prev.camera }));
			})
			.catch((err) => {
				console.warn("switchCamera", err);
			});
	};

	const switchToVideoCall = () => {
		socket.send(
			JSON.stringify({
				action: "REQUEST_VIDEO_CALL",
				data: {
					sender: {
						firstName: userFirstName,
						lastName: userLastName,
					},
					senderId: systemUserId,
					receiver: {
						firstName,
						lastName,
					},
					receiverId: callerId,
					roomId: roomId,
					callId: callId,
				},
			})
		);
		setSwitchCall((prev) => ({ ...prev, requesting: true }));
	};

	const leaveCall = () => {
		ringer && ringer?.stop();
		if (!remoteUid) {
			socket.send(
				JSON.stringify({
					action: "CANCEL_CALL",
					data: {
						senderId: systemUserId,
						sender: {
							firstName: userFirstName,
							lastName: userLastName,
						},
						receiverId: callerId,
						receiver: {
							firstName: firstName,
							lastName: lastName,
						},
						roomId: roomId,
						callType: callType,
						callId: callId,
					},
				})
			);
		}
		deactivateKeepAwake();
		_rtcEngine?.leaveChannel().then(() => {
			_rtcEngine?.destroy().then(() => {
				callDetector && callDetector.dispose();
				PushNotification.cancelLocalNotification(8);
				setMainCallType(false);
				setRtcEngine(false);
				goBack();
				setActiveCallTimer(0);
				setAllCallContext();
				InCallManager.turnScreenOn();
				InCallManager.stopRingtone();
				InCallManager.stopRingback();
				InCallManager.stop();
				removeLocalStorage("OTOCallType").then().catch();
				removeLocalStorage("OTOCallContext").then().catch();
				removeLocalStorage("OTORemoteUid").then().catch();
				removeLocalStorage("OTOMuteAudio").then().catch();
				removeLocalStorage("OTOMuteVideo").then().catch();
				removeLocalStorage("OTOSwitchCall").then().catch();
				removeLocalStorage("OTOConnectionState").then().catch();
				removeLocalStorage("RtcEngine").then().catch();
				removeLocalStorage("CallType").then().catch();
			});
		});
	};

	return (
		<React.Fragment>
			<View
				style={{
					paddingHorizontal: 20,
					width: "100%",
				}}
			>
				<View
					style={{
						backgroundColor: "rgba(0,0,0, 0.55)",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingVertical: 15,
						paddingHorizontal: 20,
						borderRadius: 15,
					}}
				>
					{videoOnOffBtn && videoOnOffBtn.view && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							disabled={videoOnOffBtn?.disabled}
							onPress={videoMuteUnmuteFun}
							icon={
								actions.video ? (
									<MaterialCommunityIcons
										size={28}
										color={
											videoOnOffBtn.disabled
												? "rgba(255,255,255,0.5)"
												: "rgba(255,255,255,1)"
										}
										name="video-off-outline"
									/>
								) : (
									<MaterialCommunityIcons
										size={28}
										color={
											videoOnOffBtn.disabled
												? "rgba(255,255,255,0.5)"
												: "rgba(255,255,255,1)"
										}
										name="video-outline"
									/>
								)
							}
						/>
					)}
					{muteUnmuteBtn && muteUnmuteBtn?.view && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							disabled={muteUnmuteBtn?.disabled}
							onPress={muteUnmuteFun}
							icon={
								actions.mute ? (
									<MaterialCommunityIcons
										size={28}
										color={
											muteUnmuteBtn.disabled
												? "rgba(255,255,255,0.5)"
												: "rgba(255,255,255,1)"
										}
										name="microphone-off"
									/>
								) : (
									<MaterialCommunityIcons
										size={28}
										color={
											muteUnmuteBtn.disabled
												? "rgba(255,255,255,0.5)"
												: "rgba(255,255,255,1)"
										}
										name="microphone"
									/>
								)
							}
						/>
					)}
					{flipCameraBtn && !videoMute.local && !videoMute.remote && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={switchCameraFun}
							icon={
								<MaterialIcons
									size={28}
									color="#FFF"
									name="flip-camera-android"
								/>
							}
						/>
					)}
					{speakerOnOffBtn && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={speakerOnOffFun}
							icon={
								actions.speaker ? (
									<Entypo
										name="sound"
										size={28}
										color="#FFF"
									/>
								) : (
									<Entypo
										name="sound-mute"
										size={28}
										color="#FFF"
									/>
								)
							}
						/>
					)}
					{videoSpeakerOnOffBtn && videoMute.local && videoMute.remote && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={videoSpeakerOnOffFun}
							icon={
								actions.videoSpeaker ? (
									<Entypo
										name="sound"
										size={28}
										color="#FFF"
									/>
								) : (
									<Entypo
										name="sound-mute"
										size={28}
										color="#FFF"
									/>
								)
							}
						/>
					)}
					{switchToVideoBtn && switchToVideoBtn?.view && (
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.25)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							disabled={switchToVideoBtn?.disabled}
							onPress={switchToVideoCall}
							icon={
								<MaterialCommunityIcons
									size={28}
									color={
										switchToVideoBtn.disabled
											? "rgba(255,255,255,0.5)"
											: "rgba(255,255,255,1)"
									}
									name="video-outline"
								/>
							}
						/>
					)}
					<AppFabButton
						style={{
							backgroundColor: "rgba(252, 50, 51,1)",
							borderRadius: 50,
							height: 50,
							width: 50,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={leaveCall}
						icon={
							<MaterialIcons
								size={28}
								color="#FFF"
								name="call-end"
							/>
						}
					/>
				</View>
			</View>
		</React.Fragment>
	);
}
