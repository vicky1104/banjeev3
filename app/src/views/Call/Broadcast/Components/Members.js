import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Avatar, Button, Text } from "native-base";
import React from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Lottie from "lottie-react-native";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import SocketContext from "../../../../Context/Socket";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../utils/util-func/convertTime";
import { AppContext } from "../../../../Context/AppContext";
import BroadcastContext from "../Context";
import color from "../../../../constants/env/color";

export default function Members({ membersRBSheet }) {
	const systemUserId = React.useContext(AppContext)?.profile.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile.firstName || "";
	const lastName = React.useContext(AppContext)?.profile.lastName || "";
	const email = React.useContext(AppContext)?.profile.email || "";
	const mobile = React.useContext(AppContext)?.profile.mobile || "";

	const members = React.useContext(BroadcastContext)?.members || [];
	const { setActionLoading } = React.useContext(BroadcastContext);
	const actionLoading = React.useContext(BroadcastContext)?.actionLoading || [];

	const cloudId = React.useContext(BroadcastContext)?.cloudId || "";
	const hostId = React.useContext(BroadcastContext)?.host?.id || false;
	const isHost = React.useContext(BroadcastContext)?.isHost || false;

	const { socket } = React.useContext(SocketContext);

	const promoteMemberFunction = (ele) => {
		console.warn(ele);
		if (members?.filter((ele) => ele?.role === 1)?.length < 7) {
			setActionLoading((prev) => [...prev, ele?.id]);
			socket.send(
				JSON.stringify({
					action: "SEND_PROMOTE_REQUEST",
					data: {
						cloudId,
						hostId: systemUserId,
						memberId: ele?.id || "",
						memberObj: { firstName, lastName, email, mobile, id: systemUserId },
						actionBy: "ADMIN",
					},
				})
			);
		} else {
			alert("You can promote maximum 3 members.");
		}
	};

	const demoteSocket = (ele, self) => {
		setActionLoading((prev) => [...prev, ele?.id]);
		setTimeout(() => {
			setActionLoading((prev) => prev?.filter((item) => item !== ele?.id));
		}, 2000);
		socket.send(
			JSON.stringify({
				action: "DEMOTE_MEMBER",
				data: {
					cloudId: cloudId,
					memberId: ele?.id,
					actionBy: self ? "MEMBER" : "ADMIN",
				},
			})
		);
		socket &&
			socket.send(
				JSON.stringify({
					action: "BROADCAST_CHAT",
					data: {
						cloudId: cloudId,
						memberId: ele?.id,
						memberObj: ele,
						createdOn: new Date().toISOString(),
						content: { src: "demoted to member", type: "ALERT" },
					},
				})
			);
	};

	const demoteMemberFunction = (ele, self) => {
		Alert.alert(
			"",
			self
				? "Are you sure, you want to remove self as Co-host."
				: `Are you sure, you want to remove ${ele?.firstName} ${ele?.lastName} as Co-host?`,
			[{ text: "Cancel" }, { text: "Yes", onPress: () => demoteSocket(ele, self) }]
		);
	};
	const kickUserFun = (ele) => {
		// console.warn("kikout", ele);

		// setLoading((prev) => [...prev, ele.id]);
		// setTimeout(() => {
		// 	setLoading((prev) => prev !== ele.id);
		// }, 3000);
		socket.send(
			JSON.stringify({
				action: "LEAVE_BROADCAST",
				data: {
					cloudId: cloudId,
					memberId: ele?.id,
					memberObj: ele,
					kick: true,
				},
			})
		);
	};

	const kickUserDialog = (ele) => {
		Alert.alert(
			"",
			`Are you sure, you want to remove ${ele.firstName?.toLowerCase()} ${ele.lastName?.toLowerCase()} from the Live Steam?`,
			[
				{
					text: "Cancel",
				},
				{ text: "Yes, Exit", onPress: () => kickUserFun(ele) },
			]
		);
	};

	// const getUid = React.useCallback((mobile) => {
	// 	if (mobile?.length > 7) {
	// 		let reverseMobile = mobile.split("").reverse();
	// 		let newMobile = reverseMobile.slice(0, 7);
	// 		return parseInt(newMobile.reverse().join(""));
	// 	} else {
	// 		return parseInt(mobile);
	// 	}
	// }, []);
	console.warn("actionLoading", actionLoading);
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
				{members !== undefined &&
					members &&
					members?.length > 0 &&
					members.map((ele, index) => {
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
											width: Dimensions.get("screen").width - 180,
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
										<View style={{ marginLeft: 5, width: "100%" }}>
											<Text
												color={color?.black}
												style={{ width: "100%" }}
												numberOfLines={1}
											>
												{`${ele?.firstName || ""} ${ele?.lastName || ""}${
													ele.id === systemUserId ? " (You)" : ""
												}${
													ele?.role === 0 || ele?.role === "0"
														? " (Admin)"
														: ele?.role === 1 || ele?.role === "1"
														? " (Co-Host)"
														: ""
												}`}
											</Text>
										</View>
									</View>
									{isHost && ele?.id !== systemUserId && (
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Button
												onPress={() => {
													if (ele.isCoHost || ele.role === 1) {
														demoteMemberFunction(ele, false);
													} else {
														promoteMemberFunction(ele);
													}
												}}
												py={1}
												px={2}
												disabled={
													actionLoading?.filter((item) => item === ele?.id)?.length > 0
														? true
														: false
												}
											>
												{actionLoading &&
												actionLoading?.length > 0 &&
												actionLoading?.filter((item) => item === ele?.id)?.length > 0 ? (
													<Lottie
														source={require("../../../../../assets/loader/loader.json")}
														autoPlay
														style={{ height: 20 }}
													/>
												) : ele?.isCoHost || ele?.role === 1 ? (
													"Demote"
												) : (
													"Promote"
												)}
											</Button>
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
										</View>
									)}
									{ele?.role === 1 && ele?.id === systemUserId && (
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Button
												onPress={() => {
													demoteMemberFunction(ele, true);
												}}
												py={1}
												px={2}
												size="sm"
												disabled={
													actionLoading?.filter((item) => item === ele?.id)?.length > 0
														? true
														: false
												}
											>
												{actionLoading &&
												actionLoading?.length > 0 &&
												actionLoading?.filter((item) => item === ele?.id)?.length > 0 ? (
													<Lottie
														source={require("../../../../../assets/loader/loader.json")}
														autoPlay
														style={{ height: 20 }}
													/>
												) : (
													"Back to lobby"
												)}
											</Button>
										</View>
									)}
								</View>
							</View>
						);
					})}
			</ScrollView>
		</RBSheet>
	);
}

const styles = StyleSheet.create({});
