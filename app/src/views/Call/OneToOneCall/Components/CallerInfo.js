import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "native-base";
import CallContext from "../Context";
import { Platform } from "react-native";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import Constants from "expo-constants";

export default function CallerInfo({ timer, callingStatus }) {
	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

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

	console.log("context caller objjjjjjjjjjj", firstName, lastName);

	return (
		<LinearGradient
			colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
			style={{
				height: 220,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				paddingTop: Constants.statusBarHeight + 20,
			}}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
		>
			<Text
				fontSize={22}
				fontWeight={"medium"}
				color="#FFF"
			>
				{`${firstName || ""} ${lastName || ""}`}
			</Text>
			<Text color="#FFF">{`${
				callType === "audio" ? "Audio" : "Video"
			} Call`}</Text>
			{callingStatus && <Text color="#FFF">{callingStatus}</Text>}
			{timer && <Text color="#FFF">{timer}</Text>}
		</LinearGradient>
	);
}
