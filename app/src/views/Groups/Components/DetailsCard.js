import {
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	Dimensions,
} from "react-native";
import React from "react";
import { Button, Text } from "native-base";
import { Octicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import axios from "axios";
import { AppContext } from "../../../Context/AppContext";
import SocketContext from "../../../Context/Socket";
import { showToast } from "../../../constants/components/ShowToast";
import PushNotification from "react-native-push-notification";
import Lottie from "lottie-react-native";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import color from "../../../constants/env/color";

export default function CommunityCard({
	item,
	myGroup,
	handleJoinGroup,
	loadJoin,
}) {
	const { navigate } = useNavigation();
	const screenWidth = Dimensions.get("screen").width;

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";
	const email = React.useContext(AppContext)?.profile?.email || "";

	const socket = React.useContext(SocketContext)?.socket || false;
	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const imageUrl = item?.imageUrl || "";
	const name = item?.name || "";
	const totalMembers = item?.totalMembers || "";
	const categoryName = item?.categoryName || "";
	const groupLive = item?.live || false;
	const cloudId = item?.id || "";
	const cloudType = item?.cloudType || "";
	const chatRoomId = item?.chatRoomId || "";
	const admin = item?.admin || false;
	const memberStatus = item?.memberStatus || 0;

	const handleEditMyGroup = () => {
		navigate("CreateGroup", { item: item });
	};

	const getUid = (mobile) => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	};

	const handleGroupCall = () => {
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			axios
				.get(
					"https://gateway.banjee.org/services/message-broker/api/rooms/findByRoomId/" +
						chatRoomId
				)
				.then((res) => {
					if (admin && !res?.data?.live) {
						socket.send(
							JSON.stringify({
								action: "START_GROUP_CALL",
								data: {
									initiator: {
										firstName: firstName,
										lastName: lastName,
										id: systemUserId,
										mobile: mobile,
										email: email,
										uid: getUid(mobile),
									},
									initiatorId: systemUserId,
									cloudId: cloudId,
									chatRoomId: chatRoomId,
									chatRoomName: name,
									chatRoomImage: imageUrl,
								},
							})
						);
						navigate("GroupCall", {
							cloudId: cloudId,
							initiatorId: systemUserId,
							chatRoomId: chatRoomId,
							chatRoomName: name,
							chatRoomImage: imageUrl,
							userObject: {
								firstName: firstName,
								lastName: lastName,
								id: systemUserId,
								mobile: mobile,
								email: email,
							},
							joinGroup: false,
							adminId: res.data?.createdByUser?.id,
						});
					} else {
						if (!res?.data?.live) {
							showToast(
								"Group is not live. You can join the group call after admin make it live."
							);
						} else {
							PushNotification.cancelLocalNotification(2);
							navigate("GroupCall", {
								cloudId: cloudId,
								chatRoomId: chatRoomId,
								chatRoomName: name,
								chatRoomImage: imageUrl,
								userObject: {
									firstName: firstName,
									lastName: lastName,
									id: systemUserId,
									mobile: mobile,
									email: email,
								},
								joinGroup: true,
								adminId: res.data?.createdByUser?.id,
							});
						}
					}
				})
				.catch((err) => {
					console.error(err);
					showToast(
						"Room is not live. You can join the room after admin make it live."
					);
				});
		}
	};

	const handleGoToChat = () => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: true,
				name: name || "Name",
				roomId: chatRoomId || "",
			},
		});
	};

	return (
		<TouchableWithoutFeedback
			onPress={() => navigate("DetailGroup", { cloudId: cloudId, name })}
		>
			<View
				style={{
					// height: 100,
					alignSelf: "center",
					backgroundColor: color.gradientWhite,
					width: "100%",
					// borderRadius: 12,
					// elevation: 4,
					// shadowOffset: { width: 1, height: 1 },
					// shadowOpacity: 0.9,
					// shadowRadius: 1,
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 5,
					// borderColor: borderColor,
				}}
			>
				<Image
					source={{
						uri: cloudinaryFeedUrl(imageUrl, "newImage"),
					}}
					style={{ height: 80, width: 80, borderRadius: 50 }}
					resizeMode="cover"
				/>
				{groupLive && (
					<View
						style={{
							width: 30,
							backgroundColor: "red",
							position: "absolute",
							bottom: 5,
							left: 30,
							borderRadius: 5,
						}}
					>
						<Text
							textAlign={"center"}
							color={"#FFF"}
							fontSize={12}
						>
							Live
						</Text>
					</View>
				)}
				<View
					style={{
						width: "100%",
						marginLeft: 10,
						borderTopEndRadius: 12,
						borderBottomRightRadius: 12,
						// height: "100%",
						width: screenWidth - 105,
						paddingVertical: 10,
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<View>
						<Text
							numberOfLines={2}
							lineHeight={18}
							fontWeight={500}
							//fontSize={14}
							width="100%"
							color={color.black}
						>
							{name}
						</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginTop: 4,
								width: "100%",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									width:
										totalMembers?.length > 9
											? totalMembers?.length > 99
												? 120
												: 110
											: 105,
								}}
							>
								<Octicons
									name="people"
									size={14}
									color={color.primary}
									//style={{ marginTop: 2 }}
								/>
								<Text
									ml={1}
									numberOfLines={1}
									width={"100%"}
									color={color.black}
									fontSize={12}
								>
									{totalMembers} members
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									width:
										totalMembers?.length > 9
											? totalMembers?.length > 99
												? "38%"
												: "42.5%"
											: "45%",
								}}
							>
								<Octicons
									name="dot"
									size={16}
									color={color.primary}
									style={{ marginTop: 2 }}
								/>
								<Text
									ml={1}
									numberOfLines={1}
									width={"100%"}
									fontSize={12}
									color={color.black}
								>
									{categoryName}
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-end",
							marginTop: 10,
						}}
					>
						<Button
							backgroundColor={"#999"}
							borderRadius={25}
							py={0}
							px={0}
							style={{ height: 30, width: 85 }}
							onPress={() => {
								if (!myGroup && memberStatus === 0) {
									handleJoinGroup(cloudId);
								} else {
									handleGroupCall();
								}
							}}
							disabled={loadJoin || _rtcEngine}
						>
							{loadJoin === cloudId ? (
								<View
									style={{
										height: 30,
										width: 85,
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Lottie
										source={require("../../../../assets/loader/loader.json")}
										autoPlay
										style={{ height: 25 }}
									/>
								</View>
							) : (
								<Text
									color={color?.white}
									fontWeight={700}
									fontSize={12}
								>
									{!myGroup && memberStatus === 0
										? "Join Group"
										: groupLive
										? "Join Live"
										: myGroup
										? "Go Live"
										: "Join Live"}
								</Text>
							)}
						</Button>
						{(myGroup || memberStatus === 1) && (
							<Button
								backgroundColor={"#999"}
								borderRadius={25}
								startIcon={
									myGroup ? (
										<MaterialIcons
											name="edit"
											size={15}
											color={"#000"}
										/>
									) : (
										<MaterialIcons
											name="chat"
											size={15}
											color={"#000"}
										/>
									)
								}
								ml={2}
								py={0}
								px={0}
								style={{ height: 30, width: 80 }}
								onPress={() => {
									if (myGroup) {
										handleEditMyGroup();
									} else {
										handleGoToChat();
									}
								}}
							>
								<Text
									fontWeight={700}
									fontSize={12}
								>
									{myGroup ? "Edit" : "Chat"}
								</Text>
							</Button>
						)}
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({});
