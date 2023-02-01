import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React, { memo, useContext } from "react";
import {
	Alert,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { showToast } from "../../../../../constants/components/ShowToast";
import AppMenu from "../../../../../constants/components/ui-component/AppMenu";
import color from "../../../../../constants/env/color";
import { AppContext } from "../../../../../Context/AppContext";
import CallRtcEngine from "../../../../../Context/CallRtcEngine";
import { CreateRoomService } from "../../../../../helper/services/RoomServices";
import { listProfileUrl } from "../../../../../utils/util-func/constantExport";

function DetailMember({
	cloudId,
	item,
	setRemoveMember,
	author,
	makeAdminFunc,
	...props
}) {
	const { navigate } = useNavigation();

	const { profile } = useContext(AppContext);
	const _rtcEngine = useContext(CallRtcEngine)?._rtcEngine;

	const profileObj = {
		avtarUrl: profile?.avatarUrl || "",
		domain: profile?.domain || "",
		email: profile?.email || "",
		firstName: profile?.firstName || "",
		id: profile?.systemUserId || "",
		lastName: profile?.lastName || "",
		locale: profile?.locale || "",
		mcc: profile?.mcc || "",
		mobile: profile?.mobile || "",
		realm: profile?.realm || "",
		ssid: profile?.ssid || "",
		systemUserId: profile?.systemUserId || "",
		timeZoneId: profile?.timeZoneId || "",
		username: profile?.username || profile?.userName || "",
	};

	const roomApiCallAndNavigate = (oppUser, screenName, callType) => {
		console.warn("room api call params", {
			userA: oppUser,
			userB: profileObj,
		});
		CreateRoomService({
			userA: oppUser,
			userB: profileObj,
		})
			.then((res) => {
				console.warn("res", res);
				console.warn("one2one caqll --->>", {
					...oppUser,
					userId: oppUser.id,
					roomId: res.id,
					callType,
					initiator: true,
					fromNotification: false,
				});

				if (_rtcEngine) {
					if (callType) {
						showToast("Can't place a new call while you're already in a call");
					} else {
						navigate(screenName, {
							item: {
								...oppUser,
								userId: oppUser.id,
								roomId: res.id,
								callType,
								initiator: true,
								fromNotification: false,
							},
						});
					}
				} else {
					navigate(
						screenName,
						callType
							? {
									...oppUser,
									userId: oppUser.id,
									roomId: res.id,
									callType,
									initiator: true,
									fromNotification: false,
							  }
							: {
									item: {
										...oppUser,
										userId: oppUser.id,
										roomId: res.id,
										callType,
										initiator: true,
										fromNotification: false,
									},
							  }
					);
				}
			})
			.catch((err) => console.error(err));
	};

	return (
		<View style={{ paddingBottom: 3 }}>
			<View
				style={{
					width: "98%",
					alignSelf: "center",
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: color.gradientWhite,
					borderWidth: 1,
					elevation: 3,
					shadowOffset: { width: 1, height: 1 },
					shadowOpacity: 0.4,
					shadowRadius: 3,
					borderColor: color.border,
					marginTop: 5,
					borderRadius: 10,
				}}
			>
				<View style={{ width: "18%" }}>
					<TouchableWithoutFeedback
						style={{ zIndex: 999999 }}
						onPress={() => {
							item?.userId !== profile?.systemUserId &&
								navigate("BanjeeProfile", { profileId: item?.profile?.id });
						}}
					>
						<View style={styles.imgView}>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								bgColor={color.gradientWhite}
								style={styles.img}
								source={{ uri: listProfileUrl(item?.profile?.id) }}
							>
								{item?.profile?.username?.charAt(0).toUpperCase() || ""}
							</Avatar>
						</View>
					</TouchableWithoutFeedback>
				</View>

				<TouchableWithoutFeedback
					activeOpacity={1}
					onPress={() => {
						item?.userId !== profile?.systemUserId &&
							roomApiCallAndNavigate(item?.profile, "BanjeeUserChatScreen");
					}}
				>
					<View
						style={{
							height: 72,
							width: "82%",
						}}
					>
						<View style={styles.container}>
							<View style={styles.txtView}>
								<Text
									numberOfLines={1}
									color={color?.black}
								>
									{item?.userId === profile?.systemUserId
										? "You"
										: `${item?.profile?.firstName} ${item?.profile?.lastName}`}
								</Text>

								<Text
									numberOfLines={1}
									color={color?.subTitle}
									style={{ fontSize: 14, fontWeight: "300" }}
								>
									{props?.isInContactPage
										? ""
										: item?.role === "ADMIN"
										? "Admin"
										: "Member"}
								</Text>
							</View>

							<View style={styles.icons}>
								{item?.adminIds?.some((ele) => ele === profile.systemUserId) ? (
									item?.role === "MEMBER" ? (
										<AppMenu
											menuColor={color?.black}
											menuContent={[
												{
													icon: "account-remove",
													label: "Remove",
													onPress: () => {
														setRemoveMember({
															cloudId: item?.cloudId,
															userId: item?.userId,
														});
													},
												},
												{
													icon: "alert-circle-outline",
													label: "Make admin",
													onPress: () => {
														Alert.alert("Make admin", "Make group admin.", [
															{
																text: "Assign",
																// onPress: () => console.warn("first"),
																onPress: () => makeAdminFunc(item?.userId, item?.cloudId),
															},
															{ text: "Cancel" },
														]);
													},
												},
											]}
										/>
									) : null
								) : null}

								{/* item?.adminIds?.map((ele) => {
											return ele === item?.userId ? <Text>{item?.userId}</Text> : "TESt";
									  }) */}

								{/* {item?.isAdmin ? (
									item?.userId === profile?.systemUserId ? null : (
										<AppMenu
											menuColor={color?.black}
											menuContent={[
												{
													icon: "account-remove",
													label: "Remove",
													onPress: () => {
														setRemoveMember({
															cloudId: item?.cloudId,
															userId: item?.userId,
														});
													},
												},
												{
													icon: "alert-circle-outline",
													label: "Assign Role",
													onPress: () => {
														Alert.alert("Assign Role", "Make group admin.", [
															{
																text: "Assign",
																// onPress: () => console.warn("first"),
																onPress: () => makeAdminFunc(item?.userId, item?.cloudId),
															},
															{ text: "Cancel" },
														]);
													},
												},
											]}
										/>
									) : null
								) : null}

								{/* item?.adminIds?.map((ele) => {
											return ele === item?.userId ? <Text>{item?.userId}</Text> : "TESt";
									  }) */}

								{/* {item?.isAdmin ? (
									item?.userId === profile?.systemUserId ? null : (
										<AppMenu
											menuColor={color?.black}
											menuContent={[
												{
													icon: "account-remove",
													label: "Remove",
													onPress: () => {
														setRemoveMember({
															cloudId: item?.cloudId,
															userId: item?.userId,
														});
													},
												},
												{
													icon: "alert-circle-outline",
													label: "Assign Role",
													onPress: () => {
														Alert.alert("Assign Role", "Make group admin.", [
															{
																text: "Assign",
																// onPress: () => console.warn("first"),
																onPress: () => makeAdminFunc(item?.userId, item?.cloudId),
															},
															{ text: "Cancel" },
														]);
													},
												},
											]}
										/>

						
									)
								) : item?.userId === profile?.systemUserId ? null : (
									<Fragment>
										<AppFabButton
											size={20}
											icon={
												<Image
													style={{
														height: 20,
														width: 20,
														tintColor: color?.black,
													}}
													source={require("../../../../../../assets/EditDrawerIcon/ic_video_call.png")}
												/>
											}
											onPress={() =>
												roomApiCallAndNavigate(item?.profile, "OneToOneCall", "video")
											}
										/>

										<AppFabButton
											size={20}
											icon={
												<Image
													style={{
														height: 20,
														width: 20,
														tintColor: color?.black,
													}}
													source={require("../../../../../../assets/EditDrawerIcon/ic_call_black.png")}
												/>
											}
											onPress={() =>
												roomApiCallAndNavigate(item?.profile, "OneToOneCall", "audio")
											}
										/>

										<AppFabButton
											size={20}
											icon={
												<Image
													style={{
														height: 20,
														width: 20,
														tintColor: color?.black,
													}}
													source={require("../../../../../../assets/EditDrawerIcon/ic_voice_black.png")}
												/>
											}
											onPress={() =>
												roomApiCallAndNavigate(item?.profile, "BanjeeUserChatScreen")
											}
										/>
									</Fragment>
								)} */}
							</View>
						</View>
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
		shadowColor: color.white,
		shadowOffset: { width: 2, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		zIndex: 99,
	},

	txtView: {
		flexDirection: "column",
		width: "49%",
	},
});

export default memo(DetailMember);
