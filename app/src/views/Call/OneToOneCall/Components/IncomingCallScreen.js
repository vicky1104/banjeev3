import React from "react";
import { ImageBackground, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import CallContext from "../Context";
import CallerInfo from "./CallerInfo";
import { AppContext } from "../../../../Context/AppContext";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../../../constants/components/ShowToast";
import SocketContext from "../../../../Context/Socket";
import InCallManager from "react-native-incall-manager";
import PushNotification from "react-native-push-notification";
import { Text } from "native-base";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import color from "../../../../constants/env/color";

export default function CallActionScreen({ acceptCall }) {
	const { goBack } = useNavigation();

	const { socket } = React.useContext(SocketContext);

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
	const timer = React.useContext(CallContext)?.timer || 0;

	const userFirstName = React.useContext(AppContext)?.profile?.firstName || "";
	const userLastName = React.useContext(AppContext)?.profile?.lastName || "";

	const [profileImageError, setProfileImageError] = React.useState(false);

	const rejectCall = () => {
		socket.send(
			JSON.stringify({
				action: "REJECT_CALL",
				data: {
					sender: {
						firstName: userFirstName,
						lastName: userLastName,
					},
					senderId: systemUserId,
					receiver: {
						firstName: firstName,
						lastName: lastName,
					},
					receiverId: callerId,
					roomId: roomId,
					callType: callType,
				},
			})
		);
		PushNotification.cancelLocalNotification(1);
		goBack();
		InCallManager.stopRingtone();
	};

	React.useEffect(() => {
		if (!initiator) {
			socket &&
				socket.addEventListener("message", ({ data }) => {
					const { action, data: mData } = JSON.parse(data);
					if (action === "MISSED_CALL") {
						showToast(
							"Missed call from" +
								" " +
								mData?.sender?.firstName +
								" " +
								mData?.sender?.lastName
						);
						InCallManager.turnScreenOn();
						InCallManager.stopRingtone();
						InCallManager.stop();
						goBack();
					}
				});
		}
	}, [initiator, socket]);

	return (
		<ImageBackground
			style={{
				flex: 1,
				backgroundColor: "#E0E0E0",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "space-between",
				paddingBottom: "25%",
				backgroundColor: color.primary,
			}}
			blurRadius={1.5}
			resizeMode="cover"
			source={{ uri: listProfileUrl(callerId) }}
			onError={() => setProfileImageError(true)}
		>
			<CallerInfo timer={false} />
			{profileImageError && (
				<Text
					fontSize={100}
					textAlign="center"
					mt={-20}
					color="#FFF"
				>
					{`${firstName ? firstName?.slice(0, 1) || "" : "" || ""}${
						lastName ? lastName.slice(0, 1) || "" : "" || ""
					}`}
				</Text>
			)}
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-around",
					width: "100%",
				}}
			>
				<AppFabButton
					style={{
						backgroundColor: "rgba(247, 40, 40, 1)",
						borderRadius: 50,
						height: 60,
						width: 60,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 10,
					}}
					onPress={rejectCall}
					icon={
						<MaterialIcons
							size={30}
							color="#FFF"
							name="call-end"
						/>
					}
				/>
				<AppFabButton
					style={{
						backgroundColor: "rgba(2, 171, 61, 1)",
						borderRadius: 50,
						height: 60,
						width: 60,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 10,
					}}
					onPress={acceptCall}
					icon={
						<MaterialIcons
							size={30}
							color="#FFF"
							name="call"
						/>
					}
				/>
			</View>
		</ImageBackground>
	);
}
