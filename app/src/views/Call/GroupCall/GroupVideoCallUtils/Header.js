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
import CallContext from "../Context";
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
	members,
	setShowActionbar,
	callDetector,
}) {
	const { goBack } = useNavigation();

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;
	const { setRtcEngine } = React.useContext(CallRtcEngine);
	const { setCallType, setActiveCallTimer } = React.useContext(AppContext);

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";

	const membersRBSheet = React.useRef(null);
	function removeFromRoom() {
		// RemoveFriendFromGroup({
		// 	chatRoomId: chatRoomId,
		// 	groupId: null,
		// 	// toUserId: "6176b3a771748e095f9a2d2a",
		// });
	}

	const remoteUid = React.useContext(CallContext)?.remoteUid || [];
	const remoteAudio = React.useContext(CallContext)?.remoteAudio || [];
	const remoteVideo = React.useContext(CallContext)?.remoteVideo || [];
	const localAudio = React.useContext(CallContext)?.localAudio;
	const localVideo = React.useContext(CallContext)?.localVideo;
	// const { members } = React.useContext(CallContext);
	const feedback = React.useContext(CallContext)?.feedback || [];
	const callData = React.useContext(CallContext)?.callData || {};

	const cloudId = React.useContext(CallContext)?.callData?.cloudId || "";
	const chatRoomId = React.useContext(CallContext)?.callData?.chatRoomId || "";
	const chatRoomName =
		React.useContext(CallContext)?.callData?.chatRoomName || "";
	const chatRoomImage =
		React.useContext(CallContext)?.callData?.chatRoomImage || "";
	// const userObject = React.useContext(CallContext)?.callData?.userObject || {};
	const adminId = React.useContext(CallContext)?.callData?.adminId || "";

	const { socket } = React.useContext(SocketContext);

	const leaveCall = () => {
		deactivateKeepAwake();
		if (_rtcEngine) {
			_rtcEngine?.leaveChannel().then(() => {
				_rtcEngine?.destroy().then(() => {
					callDetector && callDetector.dispose();
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
		}
	};

	const handleExit = () => [
		Alert.alert("", "Are you sure want to exit group call ?", [
			{
				text: "Cancel",
			},
			{ text: "Yes, Exit", onPress: () => leaveCall() },
		]),
	];

	const handleBack = () => {
		setLocalStorage("GroupRemoteUid", remoteUid).then(() => {
			setLocalStorage("GroupRemoteAudio", remoteAudio).then(() => {
				setLocalStorage("GroupRemoteVideo", remoteVideo).then(() => {
					setLocalStorage("GroupLocalVideo", localVideo).then(() => {
						setLocalStorage("GroupLocalAudio", localAudio).then(() => {
							setLocalStorage("GroupFeedback", feedback).then(() => {
								setLocalStorage("GroupMembers", members).then(() => {
									setLocalStorage("GroupCallData", callData).then(() => {
										goBack();
										setActiveCallTimer(1);
									});
								});
							});
						});
					});
				});
			});
		});
	};

	const iconSize = Platform.OS === "ios" ? 22 : 18;
	const ios = Platform.OS === "ios";
	const isFocused = useIsFocused();
	React.useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", async () => {
			if (isFocused) {
				await setLocalStorage("GroupRemoteUid", remoteUid);
				await setLocalStorage("GroupRemoteAudio", remoteAudio);
				await setLocalStorage("GroupRemoteVideo", remoteVideo);
				await setLocalStorage("GroupLocalAudio", localAudio);
				await setLocalStorage("GroupLocalVideo", localVideo);
				await setLocalStorage("GroupFeedback", feedback);
				await setLocalStorage("GroupMembers", members);
				await setLocalStorage("GroupCallData", callData);
				setActiveCallTimer(1);
				return true;
			}
			return false;
		});
	}, [isFocused]);

	return (
		<View
			style={{
				display: "flex",
				// height: 50,
				// width: "100%",
				width: "95%",
				top: 10,
				alignSelf: "center",
				flexDirection: "row",
				alignItems: "center",
				// paddingHorizontal: 10,
				backgroundColor: "#222",
				paddingVertical: 7,
				borderRadius: 8,
				position: "absolute",
				zIndex: 99,
			}}
		>
			<HeaderBackButton
				labelVisible={false}
				tintColor="#FFF"
				style={{
					marginLeft: Platform.OS === "ios" ? 10 : 5,
				}}
				onPress={handleBack}
			/>
			<Image
				source={{ uri: cloudinaryFeedUrl(chatRoomImage, "image") }}
				style={[styles.profileImg, { marginLeft: -10 }]}
			/>
			<View
				style={{
					// flex: 1,
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginLeft: 5,
					width:
						Dimensions.get("screen").width - (Platform.OS === "ios" ? 118 : 108),
					alignItems: "center",
				}}
			>
				<View
					style={{
						flexDirection: "column",
						alignItems: "flex-start",
						width: ios ? "58%" : "48%",
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
						{remoteUid && remoteUid?.length + 1} Participants
					</Text>
				</View>

				<View style={{ flexDirection: "row" }}>
					{members?.length > 0 && (
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
								onPress={() => {
									setChatView((prev) => !prev);
									setShowActionbar();
								}}
								icon={
									<MaterialCommunityIcons
										name="chat"
										size={iconSize}
										color={"#FFF"}
									/>
								}
							/>
						</>
					)}

					{members?.length > 0 && (
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
							<Members
								membersRBSheet={membersRBSheet}
								showKickBtn={adminId === systemUserId}
							/>
						</>
					)}

					{/* <AppFabButton
					style={{
						backgroundColor: "rgba(255,255,255,0.3)",
						borderRadius: 35,
						height: 35,
						width: 70,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginLeft: members?.length === 0 ? 46 : 10,
					}}
					disabled={!_rtcEngine}
					onPress={leaveCall}
					icon={<Text>Exit</Text>}
				/> */}
					<Button
						borderRadius={12}
						width={50}
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
						Exit
					</Button>
				</View>

				{/* <AppButton
					style={{
						width: 90,
						height: 35,
						borderRadius: 10,
					}}
					titleFontSize={14}
					title={"Leave Call"}
					onPress={_leaveChannel}
				/> */}
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
