import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import React, { Fragment, useContext } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Text } from "native-base";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import { shareRoom } from "../../../Other/ShareApp";
import { MainContext } from "../../../../../context/MainContext";

export default function RoomElement({
	item,
	userRoom,
	setId,
	otherUser,
	setDeleteModal,
}) {
	const { navigate } = useNavigation();

	const navigateToRoomCall = () => {
		navigate("RoomVideoCall", { room: item });
	};

	const { icons, playAudio } = usePlayPauseAudio();

	const { setRoom: setRoomData } = useContext(MainContext);

	return (
		<React.Fragment>
			{/* <View style={styles.container}> */}
			<Box
				borderWidth="1"
				borderColor="#D0D0D0"
				shadow="3"
				rounded="8"
				style={styles.container}
			>
				<View style={styles.subContainer}>
					{item?.live && (
						<FastImage
							source={require("../../../../../assets/EditDrawerIcon/live.png")}
							style={[
								styles.img,
								{ position: "absolute", zIndex: 9, top: 8, left: 8 },
							]}
						/>
					)}
					<FastImage
						source={
							item?.imageContent?.src
								? { uri: profileUrl(item?.imageContent?.src) }
								: require("../../../../../assets/EditDrawerIcon/ic_group.png")
						}
						style={styles.img}
					/>

					{userRoom && !otherUser && (
						<View
							style={{
								position: "absolute",
								right: 0,
								transform: [{ rotate: "90deg" }],
								marginTop: 15,
								zIndex: 99,
							}}
						>
							<AppMenu
								iconSize={20}
								menuColor={"black"}
								menuContent={[
									{
										icon: "delete",
										label: "Delete",
										onPress: () => {
											setId(item.id);
											setDeleteModal(true);
										},
									},
									{
										icon: "square-edit-outline",
										label: "Edit",
										onPress: () => {
											setRoomData((pre) => ({
												...pre,
												...item,
												editRoom: true,
												connectedUserLength: true,
											}));

											navigate("CreateRoom", { editRoomItem: item });
										},
									},
								]}
							/>
						</View>
					)}

					<View style={styles.view}>
						<View
							style={{
								alignItems: "center",
								justifyContent: "space-between",
								flexDirection: "row",
								marginTop: 24,
							}}
						>
							<Text numberOfLines={2} style={{ fontSize: 18, width: "100%" }}>
								{item?.groupName}
							</Text>
						</View>

						{/* buttons */}

						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<FastImage
								source={require("../../../../../assets/EditDrawerIcon/category.png")}
								style={{
									width: 24,
									height: 24,
									marginRight: 5,
									tintColor: "#656565",
								}}
							/>

							<Text
								style={{
									color: "#656565",
									fontWeight: "bold",
									width: "90%",
								}}
								numberOfLines={1}
							>
								{item.categoryName},{item?.subCategoryName}
							</Text>
						</View>

						<View style={styles.subIconView}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									// marginTop: 8,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<View
										style={{
											borderWidth: 1,
											height: 23,
											width: 23,
											borderRadius: 12,
											alignItems: "center",
											justifyContent: "center",
											borderColor: "#656565",
										}}
									>
										<MaterialCommunityIcons
											name={icons}
											color={"#656565"}
											size={20}
											onPress={() => playAudio()}
										/>
									</View>
									<Text
										style={{
											color: "#656565",
											marginLeft: 5,
											marginRight: 15,
										}}
									>
										Intro
									</Text>
								</View>

								<FastImage
									source={require("../../../../../assets/EditDrawerIcon/ic_community_group.png")}
									style={{
										width: 20,
										height: 20,
										tintColor: "#656565",
										marginRight: 5,
									}}
								/>

								<Text style={{ color: "#656565" }}>
									{item?.connectedUsers?.length} Members
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* `````````````````````````````` bottom bar */}

				<View style={styles.btnGrp}>
					{otherUser ? (
						<AppBorderButton
							title="Join"
							width={80}
							style={{ width: 80 }}
							onPress={navigateToRoomCall}
						/>
					) : userRoom ? (
						<AppButton
							title="Enter Room"
							style={{ width: 100, paddingHorizontal: 10 }}
							onPress={navigateToRoomCall}
						/>
					) : (
						<React.Fragment>
							<AppBorderButton
								title="Join"
								width={80}
								style={{ width: 80 }}
								onPress={navigateToRoomCall}
							/>
							{/* <AppButton
								title="share"
								width={80}
								style={{ width: 80 }}
								onPress={() => shareRoom(item.chatroomId)}
							/> */}
						</React.Fragment>
					)}
					{/* userRoom comes from room component */}

					{userRoom && !otherUser && (
						<AppBorderButton
							title="Share"
							width={80}
							style={{ width: 80 }}
							onPress={() => shareRoom(item.chatroomId)}
						/>
					)}
				</View>
			</Box>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
		marginHorizontal: 10,

		backgroundColor: "white",
	},
	subContainer: {
		display: "flex",
		flexDirection: "row",
		padding: 8,
	},
	img: {
		// borderColor: color.primary,
		height: 95,
		width: 95,
		borderRadius: 50,
		marginTop: 24,
	},
	view: {
		display: "flex",
		justifyContent: "space-between",
		marginLeft: 10,
		width: "70%",
		height: 110,
	},
	btnGrp: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "50%",
		marginLeft: 110,
		marginBottom: 12,
	},
	grpView: { flexDirection: "row", marginTop: 20 },
});
