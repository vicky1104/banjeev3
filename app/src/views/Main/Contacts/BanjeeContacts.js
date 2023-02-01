import { useNavigation } from "@react-navigation/native";
import { Badge, Button, Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import {
	Image,
	Linking,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { showToast } from "../../../constants/components/ShowToast";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import SocketContext from "../../../Context/Socket";
import BanjeeContactProfile from "./BanjeeContactProfile";
import checkUserStatus from "./ChatComponent/checkUserStatus";
import usePermission from "../../../utils/hooks/usePermission";
import axios from "axios";
import PushNotification from "react-native-push-notification";
function BanjeeContacts(props) {
	const { item } = props;
	// console.warn("item", item);
	const { navigate } = useNavigation();
	const { userUnreadMsg, setUserUnreadMsg } = useContext(AppContext);
	const { socket } = useContext(SocketContext);
	const [imOnline, setImOnline] = useState(false);
	const _rtcEngine = useContext(CallRtcEngine)?._rtcEngine || false;

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";
	const email = React.useContext(AppContext)?.profile?.email || "";

	const makeCallFunc = (callType) => {
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			navigate("OneToOneCall", {
				...{ ...item, online: item?.online || imOnline === true },

				callType,
				initiator: true,
			});
		}
	};

	useEffect(() => {
		socket &&
			socket.addEventListener("message", ({ data }) => {
				const { action, data: messageData } = JSON.parse(data);

				switch (action) {
					case "ONLINE":
						if (messageData?.roomId === item?.roomId && !messageData.group) {
							setImOnline(true);
						}
						break;
					case "OFFLINE":
						if (messageData?.roomId === item?.roomId && !messageData.group) {
							setImOnline(new Date(Date.now()).toISOString());
						}
						break;
					default:
						break;
				}
			});
	}, [socket, item]);

	const goToChatScreen = async () => {
		if (userUnreadMsg?.[item?.roomId]) {
			setUserUnreadMsg((pre) => ({
				...pre,
				[item?.roomId]: [],
			}));
		}
		navigate("BanjeeUserChatScreen", {
			item: { ...item, online: item?.online || imOnline === true },
		});
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
		console.warn("itemmmm", item);
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			axios
				.get(
					"https://gateway.banjee.org/services/message-broker/api/rooms/findByRoomId/" +
						item?.roomId
				)
				.then((res) => {
					console.warn("res?.data?.live--------->", res?.data?.live);
					if (item?.admin && !res?.data?.live) {
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
									cloudId: item?.cloudId,
									chatRoomId: item?.roomId,
									chatRoomName: item?.name,
									chatRoomImage: item?.imageUrl,
								},
							})
						);
						navigate("GroupCall", {
							cloudId: item?.cloudId,
							initiatorId: systemUserId,
							chatRoomId: item?.roomId,
							chatRoomName: item?.name,
							chatRoomImage: item?.imageUrl,
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
								cloudId: item?.cloudId,
								chatRoomId: item?.roomId,
								chatRoomName: item?.name,
								chatRoomImage: item?.imageUrl,
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

	return (
		<View style={{ paddingBottom: 1, padding: 0 }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: color?.gradientWhite,
					// elevation: 3,
					// shadowOffset: { width: 1, height: 1 },
					// shadowOpacity: 0.4,
					// shadowRadius: 3,
				}}
			>
				{!item?.group && (
					<>
						{(userUnreadMsg?.[item?.roomId]
							? userUnreadMsg?.[item?.roomId]?.length
							: 0) +
							item?.unreadMessageCount >
							0 && (
							<Badge // bg="red.400"
								zIndex={100}
								height={19}
								width={19}
								p={0}
								colorScheme="danger"
								rounded="full"
								variant="solid"
								position={"absolute"}
								top={2}
								left={1}
								_text={{
									fontSize: 10,
								}}
							>
								{(userUnreadMsg?.[item?.roomId]
									? userUnreadMsg?.[item?.roomId]?.length
									: 0) +
									item?.unreadMessageCount <
								9
									? (userUnreadMsg?.[item?.roomId]
											? userUnreadMsg?.[item?.roomId]?.length
											: 0) + item?.unreadMessageCount
									: "9+"}
							</Badge>
						)}
					</>
				)}
				<BanjeeContactProfile
					item={{ ...item, online: item?.online || imOnline === true }}
				/>

				<TouchableWithoutFeedback
					activeOpacity={1}
					onPress={goToChatScreen}
				>
					<View
						style={{
							height: 62,
							width: "82%",
						}}
					>
						<View style={styles.container}>
							<View style={styles.txtView}>
								{item?.group ? (
									<Text
										color={color?.black}
										numberOfLines={1}
										onPress={goToChatScreen}
									>
										{item?.name}
									</Text>
								) : (
									<Text
										color={color?.black}
										numberOfLines={1}
										onPress={goToChatScreen}
									>
										{`${item?.firstName} ${item?.lastName}`}
									</Text>
								)}

								{!item?.group && (
									<Text
										fontSize={12}
										numberOfLines={1}
										style={{
											fontWeight: "300",
											color: color?.subTitle,
										}}
										onPress={goToChatScreen}
									>
										{item?.online || imOnline === true
											? "Online"
											: checkUserStatus(
													typeof imOnline !== "boolean" ? imOnline : item?.lastSeenOn,
													true
											  )}
									</Text>
								)}
							</View>

							{!item?.group ? (
								<View style={styles.icons}>
									<AppFabButton
										onPress={() => makeCallFunc("video")}
										size={20}
										icon={
											<Image
												style={{ height: 20, width: 20, tintColor: color?.black }}
												source={require("../../../../assets/EditDrawerIcon/ic_video_call.png")}
											/>
										}
									/>

									<AppFabButton
										// onPress={() =>
										//   navigate("MakeVideoCall", { ...item, callType: "Voice" })
										// }
										onPress={() => makeCallFunc("audio")}
										size={20}
										icon={
											<Image
												style={{ height: 20, width: 20, tintColor: color?.black }}
												source={require("../../../../assets/EditDrawerIcon/ic_call_black.png")}
											/>
										}
									/>
								</View>
							) : (
								(item?.live || item?.admin) && (
									<View style={[styles.icons, { right: 5 }]}>
										<Button
											height={30}
											px={3}
											py={0}
											backgroundColor={color.gradientBlack}
											borderRadius={5}
											onPress={handleGroupCall}
											disabled={_rtcEngine}
										>
											{item?.admin
												? item?.live
													? "Join Live"
													: "Go Live"
												: item?.live && "Join Live"}
										</Button>
									</View>
								)
							)}
						</View>

						{/*````````````````````` ITEM SEPERATOR */}

						{/* <View style={styles.border} /> */}
					</View>
				</TouchableWithoutFeedback>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		zIndex: -2,
	},
	img: {
		// borderColor: color.primary,
		// borderWidth: 1,
		height: "100%",
		width: "100%",
		borderRadius: 20,
	},
	icons: {
		position: "absolute",
		right: 0,
		justifyContent: "space-between",
		flexDirection: "row",
	},
	status: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: color.activeGreen,
		position: "absolute",
		bottom: 0,
		left: "10%",
		zIndex: 1,
	},
	imgView: {
		position: "relative",
		elevation: 10,
		height: 40,
		width: 40,
		borderRadius: 20,
		marginLeft: 16,
		shadowColor: color.black,
		shadowOffset: { width: 2, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		zIndex: 99,
	},
	border: {
		height: 1,
		position: "absolute",
		right: 0,
		bottom: 0,
		width: "100%",
		borderBottomColor: "lightgrey",
		borderBottomWidth: 1,
	},
	txtView: {
		flexDirection: "column",
		width: "49%",
	},
});

export default BanjeeContacts;
