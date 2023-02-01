import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Avatar, Text } from "native-base";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Lottie from "lottie-react-native";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import SocketContext from "../../../../Context/Socket";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../utils/util-func/convertTime";
import { AppContext } from "../../../../Context/AppContext";
import CallContext from "../Context";
import color from "../../../../constants/env/color";

export default function Members({ membersRBSheet, showKickBtn }) {
	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";

	const remoteAudio = React.useContext(CallContext)?.remoteAudio || [];
	const remoteVideo = React.useContext(CallContext)?.remoteVideo || [];
	const members = React.useContext(CallContext)?.members || [];

	const cloudId = React.useContext(CallContext)?.callData?.cloudId || "";
	const chatRoomId = React.useContext(CallContext)?.callData?.chatRoomId || "";
	const chatRoomImage =
		React.useContext(CallContext)?.callData?.chatRoomImage || "";
	const chatRoomName =
		React.useContext(CallContext)?.callData?.chatRoomName || "";

	const { socket } = React.useContext(SocketContext);

	const [loading, setLoading] = React.useState([]);

	const kickUserFun = (ele) => {
		console.warn("kikout", ele);

		setLoading((prev) => [...prev, ele.id]);
		setTimeout(() => {
			setLoading((prev) => prev !== ele.id);
		}, 3000);
		socket.send(
			JSON.stringify({
				action: "REMOVE_USER_GROUP_CALL",
				data: {
					chatRoomId: chatRoomId,
					chatRoomName: chatRoomName,
					cloudId: cloudId,
					chatRoomImage: chatRoomImage,
					senderId: systemUserId,
					receiverId: ele?.id,
				},
			})
		);
	};

	const kickUserDialog = (ele) => {
		Alert.alert(
			"",
			`Are you sure want to remove ${ele.firstName?.toLowerCase()} ${ele.lastName?.toLowerCase()} from call ?`,
			[
				{
					text: "Cancel",
				},
				{ text: "Yes, Exit", onPress: () => kickUserFun(ele) },
			]
		);
	};

	const getUid = React.useCallback((mobile) => {
		if (mobile?.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	}, []);

	return (
		<RBSheet
			customStyles={{
				container: { borderRadius: 10, backgroundColor: color?.gradientWhite },
			}}
			height={400}
			ref={membersRBSheet}
			dragFromTopOnly={true}
			closeOnDragDown={true}
			closeOnPressMask={true}
			draggableIcon
		>
			<ScrollView
				style={{
					width: "100%",
				}}
			>
				{members &&
					members?.length > 0 &&
					members.map((ele, index) => {
						if (ele.id !== systemUserId) {
							return (
								<View
									key={index}
									style={{
										width: "100%",
										paddingVertical: 10,
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										justifyContent: "center",
										borderBottomWidth: 1,
										borderBottomColor: color?.border,
										paddingHorizontal: 10,
									}}
								>
									<View
										style={{
											width: "100%",
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Avatar
												borderColor={color?.border}
												borderWidth={1}
												bgColor={color?.primary}
												style={{
													height: 30,
													width: 30,
													borderRadius: 50,
												}}
												source={{ uri: listProfileUrl(ele?.id || "") }}
											>
												{ele?.firstName?.charAt(0)?.toUpperCase() || ""}
											</Avatar>
											<View style={{ marginHorizontal: 10 }}>
												<Text
													color={color?.black}
													fontSize={15}
												>
													{ele?.firstName || ""} {ele?.lastName || ""}
												</Text>
												<Text
													color={color?.black}
													fontSize={10}
												>
													{convertTime(ele.joinedOn)}
												</Text>
											</View>
										</View>
										{loading?.length > 0 && loading?.includes(ele.id) ? (
											<View
												style={{
													height: 30,
													width: "30%",
													flexDirection: "row",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Lottie
													source={require("../../../../../assets/loader/loader.json")}
													autoPlay
													style={{ height: 25 }}
												/>
											</View>
										) : (
											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<AppFabButton
													style={{
														backgroundColor: "rgba(255,255,255,0.1)",
														borderRadius: 50,
														height: 35,
														width: 35,
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
													disabled={true}
													icon={
														remoteVideo?.filter((item) => item === getUid(ele?.mobile))
															?.length > 0 ? (
															<MaterialCommunityIcons
																size={22}
																color={color?.black}
																name="video-off-outline"
															/>
														) : (
															<MaterialCommunityIcons
																size={22}
																color={color?.black}
																name="video-outline"
															/>
														)
													}
												/>
												<AppFabButton
													style={{
														backgroundColor: "rgba(255,255,255,0.1)",
														borderRadius: 50,
														height: 35,
														width: 35,
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														marginLeft: 7,
													}}
													disabled={true}
													icon={
														remoteAudio?.filter((item) => item === getUid(ele?.mobile))
															?.length > 0 ? (
															<MaterialCommunityIcons
																size={22}
																color={color?.black}
																name="microphone-off"
															/>
														) : (
															<MaterialCommunityIcons
																size={22}
																color={color?.black}
																name="microphone"
															/>
														)
													}
												/>
												{showKickBtn && (
													<AppFabButton
														style={{
															backgroundColor: "rgba(243, 32, 19,1)",
															borderRadius: 50,
															height: 35,
															width: 35,
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
															marginLeft: 7,
														}}
														onPress={() => kickUserDialog(ele)}
														icon={
															<MaterialIcons
																size={22}
																color={color?.black}
																name="exit-to-app"
															/>
														}
													/>
												)}
											</View>
										)}
									</View>
								</View>
							);
						} else return null;
					})}
			</ScrollView>
		</RBSheet>
	);
}

const styles = StyleSheet.create({});
