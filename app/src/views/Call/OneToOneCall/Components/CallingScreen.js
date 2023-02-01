import React from "react";
import { ImageBackground } from "react-native";
import InCallManager from "react-native-incall-manager";
import SocketContext from "../../../../Context/Socket";
import { AppContext } from "../../../../Context/AppContext";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import CallContext from "../Context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CallerInfo from "./CallerInfo";
import Sound from "react-native-sound";
import CallRtcEngine from "../../../../Context/CallRtcEngine";

export default function CallScreen({ initiator }) {
	const { goBack } = useNavigation();

	const { socket } = React.useContext(SocketContext);

	const { setCallingTune } = React.useContext(CallContext);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const firstName = React.useContext(CallContext)?.callerObj?.firstName || "";
	const lastName = React.useContext(CallContext)?.callerObj?.lastName || "";
	const callerId = React.useContext(CallContext)?.callerId || "";
	const roomId = React.useContext(CallContext)?.roomId || "";
	const callType = React.useContext(CallContext)?.callType || "audio";
	const remoteUid = React.useContext(CallContext)?.remoteUid || false;
	const callId = React.useContext(CallContext)?.callId || "";
	const systemUserId = React.useContext(CallContext)?.systemUserId || "";
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

	const [ringing, setRinging] = React.useState(false);

	useFocusEffect(
		React.useCallback(() => {
			// let callerTone;
			socket &&
				socket.addEventListener("message", ({ data }) => {
					const { action, data: mData } = JSON.parse(data);
					if (action === "CALL_RINGING") {
						// InCallManager.start({
						// 	media: mData?.callType === "audio" ? "audio" : "other",
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
						setRinging(true);
					}
				});
			// return () => {
			// 	console.warn('return calluing', callerTone)
			// 	if (callerTone) {
			// 		callerTone.stop();
			// 		callerTone.release();
			// 	}
			// };
		}, [socket, firstName, lastName])
	);

	return (
		<ImageBackground
			style={{
				flex: 1,
				backgroundColor: "#000",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "space-between",
				opacity: 1,
				paddingBottom: "25%",
			}}
			blurRadius={1.5}
			resizeMode="cover"
			source={{ uri: listProfileUrl(callerId) }}
		>
			<CallerInfo
				callingStatus={ringing ? "Ringing..." : "Calling..."}
				timer={false}
			/>
		</ImageBackground>
	);
}
