import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../../../../Context/AppContext";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { Text } from "native-base";
import { StackActions, useNavigation } from "@react-navigation/native";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import {
	getLocalStorage,
	removeLocalStorage,
} from "../../../../utils/Cache/TempStorage";
import SocketContext from "../../../../Context/Socket";
import PushNotification from "react-native-push-notification";
import InCallManager from "react-native-incall-manager";

export default function IncomingCallModal() {
	const { navigate, dispatch } = useNavigation();

	const { setIncomingCallModal, setCallType, setActiveCallTimer } =
		React.useContext(AppContext);
	const { setRtcEngine } = React.useContext(CallRtcEngine);

	const socket = React.useContext(SocketContext)?.socket;

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine;

	const userFirstName = React.useContext(AppContext)?.profile?.firstName || "";
	const userLastName = React.useContext(AppContext)?.profile?.lastName || "";
	const systemUserId = React.useContext(AppContext)?.systemUserId || "";

	const open = React.useContext(AppContext)?.incomingCallModal?.open || false;
	const data = React.useContext(AppContext)?.incomingCallModal?.data || {};
	const firstName =
		React.useContext(AppContext)?.incomingCallModal?.data?.sender?.firstName ||
		"";
	const lastName =
		React.useContext(AppContext)?.incomingCallModal?.data?.sender?.lastName || "";
	const callType =
		React.useContext(AppContext)?.incomingCallModal?.data?.callType || "audio";
	const callerId =
		React.useContext(AppContext)?.incomingCallModal?.data?.senderId || "audio";
	const roomId =
		React.useContext(AppContext)?.incomingCallModal?.data?.roomId || "audio";

	const acceptCallFunc = () => {
		console.warn("_rtcEngine ----->", _rtcEngine);
		getLocalStorage();
		_rtcEngine?.destroy().then(() => {
			setRtcEngine(false);
			setCallType(false);
			setActiveCallTimer(0);
			PushNotification.cancelLocalNotification(1);
			PushNotification.cancelLocalNotification(8);
			removeLocalStorage("OTOCallType").then(() => {});
			removeLocalStorage("OTOCallContext").then(() => {});
			removeLocalStorage("OTORemoteUid").then(() => {});
			removeLocalStorage("OTOMuteAudio").then(() => {});
			removeLocalStorage("OTOMuteVideo").then(() => {});
			removeLocalStorage("OTOSwitchCall").then(() => {});
			removeLocalStorage("OTOConnectionState").then(() => {});
			removeLocalStorage("RtcEngine").then().catch();
			removeLocalStorage("CallType").then(() => {});

			setIncomingCallModal({ open: false, data: false });
			dispatch(
				StackActions.replace("OneToOneCall", {
					...data,
					...data.sender,
					senderId: data?.senderId,
					userId: data.senderId,
					initiator: false,
					callAccepted: true,
				})
			);
			// navigate("OneToOneCall", {
			// 	...data,
			// 	...data.sender,
			// 	senderId: data?.senderId,
			// 	userId: data.senderId,
			// 	initiator: false,
			// 	callAccepted: false,
			// });
		});
	};

	const rejectCallFunc = () => {
		setIncomingCallModal({ open: false, data: false });
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
		InCallManager.stopRingtone();
	};

	return (
		// <TouchableWithoutFeedback>
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
						paddingVertical: 30,
					}}
				>
					<Text
						fontSize={16}
						style={{
							textAlign: "center",
						}}
						fontWeight={500}
					>
						{`Incoming ${callType} call from ${firstName} ${lastName}`}
					</Text>
					<Text
						mt={2}
						style={{
							textAlign: "center",
						}}
					>
						Disconnect ongoing call when answer this incoming call.
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-evenly",
							width: "100%",
							marginTop: 30,
						}}
					>
						<AppFabButton
							style={{
								backgroundColor: "rgba(247, 40, 40, 1)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 10,
							}}
							onPress={rejectCallFunc}
							icon={
								<MaterialIcons
									size={26}
									color="#FFF"
									name="call-end"
								/>
							}
						/>
						<AppFabButton
							style={{
								backgroundColor: "rgba(2, 171, 61, 1)",
								borderRadius: 50,
								height: 50,
								width: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 10,
							}}
							onPress={acceptCallFunc}
							icon={
								<MaterialIcons
									size={26}
									color="#FFF"
									name="call"
								/>
							}
						/>
					</View>
				</View>
			</View>
		</View>
		// </TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({});
