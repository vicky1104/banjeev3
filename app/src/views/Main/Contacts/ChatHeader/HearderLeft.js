import React, { useContext, useEffect, useState } from "react";
import {
	Platform,
	SafeAreaView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import {
	cloudinaryFeedUrl,
	listProfileUrl,
	profileUrl,
} from "../../../../utils/util-func/constantExport";
import checkUserStatus from "../ChatComponent/checkUserStatus";
import color from "../../../../constants/env/color";
import SocketContext from "../../../../Context/Socket";
import { HeaderBackButton } from "@react-navigation/elements";

export default function HearderLeft({ item: chatUser }) {
	const { goBack, navigate, replace } = useNavigation();
	const [imOnline, setImOnline] = useState(false);
	const { socket } = useContext(SocketContext);
	useEffect(() => {
		setImOnline(chatUser?.online);
		socket &&
			socket.addEventListener("message", ({ data }) => {
				const { action, data: messageData } = JSON.parse(data);

				switch (action) {
					case "ONLINE":
						if (messageData?.roomId === chatUser?.roomId && !messageData.group) {
							setImOnline(true);
						}
						break;
					case "OFFLINE":
						if (messageData?.roomId === chatUser?.roomId && !messageData.group) {
							setImOnline(new Date(Date.now()).toISOString());
						}
						break;

					default:
						break;
				}
			});
	}, [socket, chatUser]);

	const handleGoBack = () => {
		if (chatUser?.fromNotification) {
			navigate("Contacts", { groupChat: chatUser?.group });
		} else {
			goBack();
		}
	};

	const navigateToNeighburhood = () => {
		if (chatUser.group) {
			if (chatUser.cloudId) {
				replace("DetailGroup", {
					cloudId: chatUser?.cloudId,
					name: chatUser?.name,
				});
			}
		} else {
			// if (chatUser.cloudId) {
			// 	replace("DetailNeighbourhood", { cloudId: chatUser?.cloudId });
			// } else {
			replace("BanjeeProfile", { profileId: chatUser?.id });
			// }
		}
	};

	return (
		<SafeAreaView
			style={{
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<HeaderBackButton
				labelVisible={false}
				onPress={handleGoBack}
				style={{ marginLeft: 10, color: "#fff" }}
				pressColor={"#fff"}
				tintColor={color.black}
			/>
			{/* {Platform.select({
				android: (
					<AppFabButton
						onPress={handleGoBack}
						size={24}
						icon={
							<MaterialCommunityIcons
								size={24}
								name="arrow-left"
								color={color?.black}
							/>
						}
					/>
				),
				ios: (
					<AppFabButton
						onPress={handleGoBack}
						size={24}
						icon={
							<AntDesign
								onPress={handleGoBack}
								size={24}
								name="left"
								color={color?.black}
							/>
						}
					/>
				),
			})} */}
			<TouchableWithoutFeedback onPress={navigateToNeighburhood}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					{!chatUser?.group ? (
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={styles.profileImg}
							source={{
								uri: chatUser?.id
									? listProfileUrl(chatUser?.id)
									: listProfileUrl(chatUser?.userId),
							}}
						>
							{chatUser?.firstName?.charAt(0).toUpperCase() || ""}
						</Avatar>
					) : (
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={styles.profileImg}
							source={{
								uri: chatUser?.imageUrl
									? cloudinaryFeedUrl(chatUser?.imageUrl, "newImage")
									: cloudinaryFeedUrl(chatUser?.roomId, "newImage"),
							}}
						>
							{chatUser?.name?.charAt(0).toUpperCase() || ""}
						</Avatar>
					)}

					<View
						style={{
							flexDirection: "column",
							alignItems: "flex-start",
							marginLeft: 10,
						}}
					>
						{!chatUser?.group ? (
							<>
								<Text
									color={color?.black}
									style={{
										alignSelf: "flex-start",
										width: 135,
									}}
									numberOfLines={1}
								>{`${chatUser?.firstName} ${chatUser?.lastName}`}</Text>

								<Text
									color={imOnline === true ? "lightgreen" : color?.subTitle}
									numberOfLines={1}
									style={{
										fontWeight: "300",
										width: 135,
										marginLeft: imOnline !== true ? -1 : 0,
									}}
									fontSize={10}
								>
									{imOnline === true
										? "Online"
										: checkUserStatus(
												typeof imOnline !== "boolean" ? imOnline : chatUser?.lastSeenOn,
												false
										  )}
								</Text>
							</>
						) : (
							<Text
								color={color?.black}
								style={{ alignSelf: "flex-start" }}
							>{`${chatUser?.name}`}</Text>
						)}
					</View>
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	profileImg: {
		height: Platform.OS === "ios" ? 35 : 40,
		width: Platform.OS === "ios" ? 35 : 40,
		borderRadius: 20,
	},
});

// import {Platform, StyleSheet, View} from "react-native";
// import React from "react";
// import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
// import {MaterialCommunityIcons} from "@expo/vector-icons";
// import {useNavigation} from "@react-navigation/native";
// import {listProfileUrl} from "../../../../utils/util-func/constantExport";
// import {Avatar, Text} from "native-base";
// import color from "../../../../constants/env/color";

// export default function HearderLeft({item}) {
// 	const {firstName, lastName, username, id: userId} = item.profile;
// 	const {goBack} = useNavigation();

// 	return (
// 		<View style={{flexDirection: "row", alignItems: "center"}}>
// 			{Platform.select({
// 				android: (
// 					<AppFabButton
// 						onPress={() => goBack()}
// 						size={24}
// 						icon={<MaterialCommunityIcons size={24} name="arrow-left" />}
// 					/>
// 				),
// 			})}
// 			<Avatar borderColor={color?.border}
// borderWidth={1}
// 				bgColor={color.gradientWhite}
// 				style={styles.profileImg}
// 				source={{uri: listProfileUrl(userId)}}
// 			>
// 				{firstName
// 					? firstName?.charAt(0).toUpperCase()
// 					: username
// 					? username?.charAt(0).toUpperCase()
// 					: "B"}
// 			</Avatar>

// 			<View
// 				style={{
// 					flexDirection: "column",
// 					alignItems: "flex-start",
// 					marginLeft: 20,
// 				}}
// 			>
// 				<Text style={{alignSelf: "flex-start"}}>
// 					{firstName && lastName
// 						? `${firstName} ${lastName}`
// 						: firstName
// 						? firstName
// 						: lastName
// 						? lastName
// 						: username
// 						? username
// 						: ""}
// 				</Text>

// 				<Text numberOfLines={1} style={{fontSize: 14, fontWeight: "300"}}>
// 					Online
// 				</Text>
// 			</View>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	profileImg: {
// 		height: 40,
// 		width: 40,
// 		borderRadius: 20,
// 		marginLeft: Platform.OS === "ios" ? 20 : 0,
// 	},
// });
