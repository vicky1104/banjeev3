import { Text } from "native-base";
import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { AppContext } from "../../../../Context/AppContext";
import SocketContext from "../../../../Context/Socket";
import CallContext from "../Context";
import CallRtcEngine from "../../../../Context/CallRtcEngine";

export default function VideoCallRequestModal() {
	const { profile } = React.useContext(AppContext);

	const { setSwitchCall } = React.useContext(CallContext);

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

	const { socket } = React.useContext(SocketContext);

	const cancelVideoCallRequestFun = () => {
		socket.send(
			JSON.stringify({
				action: "CANCEL_VIDEO_CALL_REQUEST",
				data: {
					sender: {
						firstName: profile?.firstName,
						lastName: profile?.lastName,
					},
					senderId: profile?.systemUserId,
					receiver: {
						firstName,
						lastName,
					},
					receiverId: callerId,
					roomId,
					callId,
				},
			})
		);
		setSwitchCall((prev) => ({ ...prev, requesting: false }));
	};

	return (
		<TouchableWithoutFeedback>
			<View
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					zIndex: 9,
					backgroundColor: "rgba(0,0,0,0.7)",
				}}
			>
				<View
					style={{
						display: "flex",
						justifyContent: "center",
						height: "100%",
						width: "100%",
						paddingHorizontal: 20,
					}}
				>
					<View
						style={{
							borderRadius: 12,
							backgroundColor: "#FFF",
							borderWidth: 1,
							borderColor: "#999",
							width: "100%",
							flexDirection: "column",
							alignItems: "center",
							padding: 30,
						}}
					>
						<Text
							fontSize={16}
							style={{
								textAlign: "center",
							}}
							fontWeight={600}
						>
							Switch to video call requesting...
						</Text>
						<AppFabButton
							style={{
								backgroundColor: "rgba(247, 40, 40, 1)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 30,
							}}
							onPress={cancelVideoCallRequestFun}
							icon={
								<MaterialIcons
									size={26}
									color="#FFF"
									name="call-end"
								/>
							}
						/>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}
