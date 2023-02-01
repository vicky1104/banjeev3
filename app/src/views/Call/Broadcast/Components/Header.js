import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, Text } from "native-base";
import React from "react";
import {
	Alert,
	BackHandler,
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import PushNotification from "react-native-push-notification";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import SocketContext from "../../../../Context/Socket";
import InCallManager from "react-native-incall-manager";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import Members from "./Members";
import BroadcastContext from "../Context";
import { AppContext } from "../../../../Context/AppContext";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import { HeaderBackButton } from "@react-navigation/elements";
import {
	removeLocalStorage,
	setLocalStorage,
} from "../../../../utils/Cache/TempStorage";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

function Header({
	chatView,
	setChatView,
	setShowActionbar,
	callDetector,
	imageUri,
	openChat,
	handleOpenChat,
}) {
	const { goBack } = useNavigation();

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;
	const { setRtcEngine } = React.useContext(CallRtcEngine);
	const { setCallType, setActiveCallTimer } = React.useContext(AppContext);

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";
	const email = React.useContext(AppContext)?.profile?.email || "";

	const membersRBSheet = React.useRef(null);
	function removeFromRoom() {
		// RemoveFriendFromGroup({
		// 	chatRoomId: chatRoomId,
		// 	groupId: null,
		// 	// toUserId: "6176b3a771748e095f9a2d2a",
		// });
	}

	const remoteUid = React.useContext(BroadcastContext)?.remotes || [];
	const remoteAudio = React.useContext(BroadcastContext)?.remoteAudio || [];
	const remoteVideo = React.useContext(BroadcastContext)?.remoteVideo || [];
	const localAudio = React.useContext(BroadcastContext)?.localAudio;
	const localVideo = React.useContext(BroadcastContext)?.localVideo;
	const members = React.useContext(BroadcastContext)?.members || [];
	const feedback = React.useContext(BroadcastContext)?.feedback || [];
	const callData = React.useContext(BroadcastContext)?.callData || {};

	const cloudId = React.useContext(BroadcastContext)?.cloudId || "";
	const chatRoomId =
		React.useContext(BroadcastContext)?.callData?.chatRoomId || "";
	const chatRoomName = React.useContext(BroadcastContext)?.name || "";
	const chatRoomImage = React.useContext(BroadcastContext)?.imageUri || "";
	// const userObject = React.useContext(BroadcastContext)?.callData?.userObject || {};
	const isHost = React.useContext(BroadcastContext)?.isHost || "";

	const { socket } = React.useContext(SocketContext);

	const leaveCall = () => {
		deactivateKeepAwake();
		if (_rtcEngine) {
			_rtcEngine?.leaveChannel().then(() => {
				_rtcEngine?.destroy().then(() => {
					callDetector && callDetector.dispose();
					setRtcEngine(false);
					setCallType(false);
					removeLocalStorage("CallType").then().catch();
					setActiveCallTimer(0);
				});
			});

			InCallManager.stop();
			PushNotification.cancelLocalNotification(8);
			socket.send(
				JSON.stringify({
					action: `${isHost ? "FINISH_BROADCAST" : "LEAVE_BROADCAST"}`,
					data: {
						cloudId: cloudId,
						memberId: systemUserId,
						memberObj: {
							firstName: firstName,
							lastName: lastName,
							mobile: mobile,
							email: email,
						},
					},
				})
			);
			if (!isHost) {
				socket &&
					socket.send(
						JSON.stringify({
							action: "BROADCAST_CHAT",
							data: {
								cloudId: cloudId,
								memberId: systemUserId,
								memberObj: {
									id: systemUserId,
									firstName: firstName,
									lastName: lastName,
									mobile: mobile,
									email: email,
								},
								createdOn: new Date().toISOString(),
								content: { src: "left", type: "ALERT" },
							},
						})
					);
			}
			goBack();
		}
	};

	const handleExit = () => [
		Alert.alert(
			"",
			isHost
				? "Are you sure want to finish broadcast ?"
				: "Are you sure want to exit broadcast ?",
			[
				{
					text: "Cancel",
				},
				{ text: "Yes", onPress: () => leaveCall() },
			]
		),
	];

	// const handleBack = () => {
	// 	setLocalStorage("GroupRemoteUid", remoteUid).then(() => {
	// 		setLocalStorage("GroupRemoteAudio", remoteAudio).then(() => {
	// 			setLocalStorage("GroupRemoteVideo", remoteVideo).then(() => {
	// 				setLocalStorage("GroupLocalVideo", localVideo).then(() => {
	// 					setLocalStorage("GroupLocalAudio", localAudio).then(() => {
	// 						setLocalStorage("GroupFeedback", feedback).then(() => {
	// 							setLocalStorage("GroupMembers", members).then(() => {
	// 								setLocalStorage("GroupCallData", callData).then(() => {
	// 									goBack();
	// 									setActiveCallTimer(1);
	// 								});
	// 							});
	// 						});
	// 					});
	// 				});
	// 			});
	// 		});
	// 	});
	// };

	const iconSize = Platform.OS === "ios" ? 22 : 18;
	const ios = Platform.OS === "ios";
	const isFocused = useIsFocused();
	React.useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", async () => {
			if (isFocused) {
				// await setLocalStorage("GroupRemoteUid", remoteUid);
				// await setLocalStorage("GroupRemoteAudio", remoteAudio);
				// await setLocalStorage("GroupRemoteVideo", remoteVideo);
				// await setLocalStorage("GroupLocalAudio", localAudio);
				// await setLocalStorage("GroupLocalVideo", localVideo);
				// await setLocalStorage("GroupFeedback", feedback);
				// await setLocalStorage("GroupMembers", members);
				// await setLocalStorage("GroupCallData", callData);
				handleExit();
				return true;
			}
			return false;
		});
	}, [isFocused]);

	return (
		<View
			style={{
				width: "100%",
				alignSelf: "center",
				flexDirection: "row",
				alignItems: "center",
				backgroundColor: "#222",
				paddingVertical: 5,
				borderRadius: 8,
				position: "relative",
				paddingHorizontal: 10,
			}}
		>
			<Image
				source={{ uri: cloudinaryFeedUrl(imageUri, "image") }}
				style={styles.profileImg}
			/>
			<View
				style={{
					flexDirection: "column",
					alignItems: "flex-start",
					marginLeft: 7,
					width: Dimensions.get("screen").width - 225,
				}}
			>
				<Text
					numberOfLines={1}
					style={{
						alignSelf: "flex-start",
						fontWeight: "bold",
						color: "#FFF",
						width: "100%",
					}}
				>
					{chatRoomName}
				</Text>

				<Text
					numberOfLines={1}
					mt={-1}
					style={{ fontWeight: "300", color: "#FFF" }}
				>
					{members && members?.length} Participants
				</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
				}}
			>
				{members && members?.length > 0 && (
					<>
						<AppFabButton
							size={18}
							style={{
								borderRadius: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: chatView ? "#444" : "transparent",
							}}
							onPress={handleOpenChat}
							icon={
								<MaterialCommunityIcons
									name={openChat ? "chat-remove" : "chat"}
									size={iconSize}
									color={"#FFF"}
								/>
							}
						/>
					</>
				)}

				{members && members?.length > 0 && (
					<>
						<AppFabButton
							size={18}
							style={{
								borderRadius: 50,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginLeft: 2,
							}}
							onPress={() => membersRBSheet?.current?.open()}
							icon={
								<Ionicons
									name="people"
									size={iconSize}
									color={"#FFF"}
								/>
							}
						/>
						<Members membersRBSheet={membersRBSheet} />
					</>
				)}
				<Button
					borderRadius={12}
					width={60}
					size="sm"
					isFocusVisible={true}
					style={{
						backgroundColor: "#333",
						marginLeft: 2,
						// marginLeft: members?.length === 0 ? 46 : 10,
					}}
					onPress={handleExit}
					color="#FFF"
				>
					{isHost ? "Finish" : "Exit"}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	profileImg: {
		height: 40,
		width: 40,
		borderRadius: 20,
		borderColor: color.primary,
		borderWidth: 1,
	},
});

export default Header;
