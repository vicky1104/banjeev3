import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation, useRoute } from "@react-navigation/native";
import color from "../../../../constants/env/color";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import { Avatar, Text } from "native-base";
import SelectImage from "../RoomComponents/SelectImage";
import RoomTitle from "../RoomComponents/RoomTitle";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import { AppContext } from "../../../../Context/AppContext";
import { MainContext } from "../../../../../context/MainContext";

function CreateRoom(props) {
	const { profile } = useContext(AppContext);

	const {
		room: {
			categoryName,
			categoryId,
			subCategoryId,
			groupName,
			communityType,
			connectedUserLength,
			imageContent,
			connectedUsers,
			editRoom,
			audioTitle,
			...room
		},
		setRoom: setRoomData,
	} = useContext(MainContext);

	const { setOptions, navigate } = useNavigation();
	const { params } = useRoute();

	const [openGroupModal, setOpenGroupModal] = React.useState(false);

	const [imageModal, setImageModal] = React.useState(false); //Select Image

	const [activeBtn, setActiveBtn] = React.useState(true);

	const [audioUri] = React.useState(
		room?.content?.src ? room?.content?.src : audioTitle
	);
	React.useEffect(() => {
		return setOptions({
			headerTitle: () => (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View
						style={{
							elevation: 1,
							borderRadius: 20,
							marginRight: 10,
							shadowOffset: { width: 1, height: 1 },
							shadowOpacity: 0.4,
							shadowRadius: 3,
						}}
					>
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={styles.profile}
							source={{ uri: profileUrl(profile?.avtarUrl) }}
						>
							{profile?.username?.charAt(0).toUpperCase() || ""}
						</Avatar>
					</View>
					<Text>{editRoom ? "Update Room" : "Create Room"}</Text>
				</View>
			),
		});
	}, [editRoom]);
	React.useEffect(() => {
		// if (params?.audio) {
		// 	setAudioUri(params?.audio);
		// }

		setActiveBtn(
			groupName?.length > 0 && communityType && categoryId && subCategoryId
			//&&  imageContent.name
		);
	}, [
		groupName,
		categoryName,
		communityType,
		params,
		subCategoryId,
		categoryId,
		imageContent,
		audioTitle,
		audioUri,
	]);

	const xData = [
		{
			title: categoryName ? categoryName : "Category",
			subTitle: categoryName ? "Change Category" : "Select Category",
			img: require("../../../../../assets/EditDrawerIcon/ic_category.png"),
			onPress: () => navigate("Category"),
		},
		{
			title: groupName ? groupName : "Casual Chanting",
			subTitle: groupName ? "Change Title" : "Select Title",
			img: require("../../../../../assets/EditDrawerIcon/ic_add_plus.png"),
			onPress: () => setOpenGroupModal(true),
		},
		{
			title: "Add Voice Intro about the topic",
			subTitle: (room?.content?.src ? room?.content?.src : audioTitle)
				? "Change Voice Intro"
				: "Select Intro",
			img: require("../../../../../assets/EditDrawerIcon/ic_mic.png"),
			onPress: () => navigate("RecordVoice"),
		},
	];
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				{openGroupModal && (
					<RoomTitle
						openGroupModal={openGroupModal}
						setOpenGroupModal={setOpenGroupModal}
					/>
				)}

				{xData.map((ele, i) => (
					<TouchableWithoutFeedback
						key={i}
						onPress={() => ele.onPress()}
					>
						<View style={styles.mapView}>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 0.2, y: 1 }}
								color={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
								colors={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
								style={styles.gradient}
							>
								<FastImage
									source={ele.img}
									style={{ height: 24, width: 24 }}
								/>
							</LinearGradient>

							<Text style={styles.title}>{ele.title}</Text>

							<View style={styles.subTitleView}>
								<Text
									style={[
										styles.subTitle,

										{
											color:
												i === 0 && categoryName
													? color.gradient
													: "grey" && i === 1 && groupName
													? color.gradient
													: i === 2 && (room?.content?.src ? room?.content?.src : audioTitle)
													? color.gradient
													: "grey",
										},
									]}
								>
									{ele.subTitle}
								</Text>

								<MaterialCommunityIcons
									name="greater-than"
									color={
										i === 0 && categoryName
											? color.gradient
											: "grey" && i === 1 && groupName
											? color.gradient
											: i === 2 && audioUri
											? color.gradient
											: "grey"
									}
									size={8}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				))}

				<Text style={styles.txt1}>
					Add an Image, which can be a face of your Room
				</Text>

				<SelectImage
					imageModal={imageModal}
					setImageModal={setImageModal}
				/>

				<FastImage
					source={require("../../../../../assets/EditDrawerIcon/shadow.png")}
					style={{ height: 10, width: 90, marginTop: 4 }}
				/>

				<Text style={{ marginTop: 24, fontSize: 14 }}>
					Is your Room Public or Private?
				</Text>

				<View style={styles.roomView}>
					<TouchableWithoutFeedback
						onPress={() => {
							setRoomData((pre) => ({ ...pre, communityType: "close" }));
						}}
					>
						<View
							style={[
								styles.room,
								{
									backgroundColor: communityType === "close" ? color.white : "#d9dde2",
								},
							]}
						>
							<View
								style={[
									styles.radio,
									{
										backgroundColor: communityType === "close" ? color.black : "#bebebe",
									},
								]}
							/>

							<FastImage
								source={require("../../../../../assets/EditDrawerIcon/close_group.png")}
								style={{ height: 72, width: 72 }}
							/>

							<Text style={{ fontSize: 14, marginTop: 8 }}>Closed Room</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback
						onPress={() => {
							setRoomData((pre) => ({ ...pre, communityType: "public" }));
						}}
					>
						<View
							style={[
								styles.room,
								{
									backgroundColor: communityType === "public" ? color.white : "#d9dde2",
								},
							]}
						>
							<View
								style={[
									styles.radio,
									{
										backgroundColor: communityType === "public" ? color.black : "#bebebe",
									},
								]}
							/>
							<FastImage
								source={require("../../../../../assets/EditDrawerIcon/public_group.png")}
								style={{ height: 72, width: 72 }}
							/>
							<Text style={{ fontSize: 14, marginTop: 8 }}>Public Room</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>

				<Text style={styles.txt2}>
					Please select either of one to proceed further
				</Text>

				{connectedUsers.length > 0 && (
					<Text style={styles.txt2}>{connectedUsers.length} user selected.</Text>
				)}

				{connectedUsers.length > 0 ? (
					connectedUserLength ? (
						<AppButton
							disabled={!activeBtn}
							style={{ marginTop: 24, marginBottom: 34, width: 230 }}
							title={!editRoom ? "Select Banjee Contacts" : "Update Banjee Contacts"}
							onPress={() =>
								navigate("SelectBanjee", {
									subCategoryItem: categoryName,
									previousData: room,
								})
							}
						/>
					) : (
						<AppButton
							disabled={!activeBtn}
							style={{ marginTop: 24, marginBottom: 34, width: 230 }}
							title={!editRoom ? "Create Room" : "Update Room"}
							onPress={() => navigate("FilterCreateRoom")}
						/>
					)
				) : (
					<AppButton
						disabled={!activeBtn}
						style={{ marginTop: 24, marginBottom: 34, width: 230 }}
						title={"Select Banjee Contacts"}
						onPress={() =>
							navigate("SelectBanjee", {
								subCategoryItem: categoryName,
								previousData: room,
							})
						}
					/>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { height: "100%", width: "100%", alignItems: "center" },
	profile: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
	mapView: {
		width: "100%",
		flexDirection: "row",
		paddingLeft: 30,
		height: 60,
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: color.seperate,
	},
	gradient: {
		height: 40,
		width: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 14,
		marginLeft: 15,
		width: "50%",
	},
	subTitleView: {
		flexDirection: "row",
		position: "absolute",
		right: 0,
		alignItems: "center",
		width: "30%",
	},
	subTitle: {
		// color: color.gradient,
		fontSize: 12,
		marginRight: 10,
		flexWrap: "wrap",
	},
	txt1: {
		marginTop: 24,
		width: "50%",
		textAlign: "center",
		fontSize: 14,
	},
	gradient2: {
		height: 40,
		width: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		right: -10,
	},
	roomView: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 24,
	},
	room: {
		height: 130,
		width: 130,
		borderWidth: 1,
		borderColor: "#979797",
		borderRadius: 6,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	radio: {
		height: 18,
		width: 18,
		position: "absolute",
		top: 5,
		left: 5,
		borderRadius: 50,
		borderColor: "#868686",
		borderWidth: 1,
	},
	txt2: { marginTop: 24, width: "60%", textAlign: "center" },
});

export default CreateRoom;
