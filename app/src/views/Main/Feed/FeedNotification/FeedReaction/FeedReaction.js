import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { MarkAsReadNotification } from "../../../../../helper/services/BanjeeNotification";
import {
	BanjeeProfileId,
	profileUrl,
} from "../../../../../utils/util-func/constantExport";

import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import color from "../../../../../constants/env/color";
import { emojies } from "../../../../../utils/util-func/emojies";
import { useContext } from "react";
import { MainContext } from "../../../../../../context/MainContext";

function FeedReaction({ item, index }) {
	const {
		id,
		markAsRead,
		contents: {
			nodeId,
			reactionType,
			user: { avtarUrl, username, firstName, lastName, id: userId },
		},
	} = item;

	const { navigate } = useNavigation();
	const { setModalData, setOpenPostModal } = useContext(MainContext);

	function onClickNavigate() {
		setOpenPostModal(true);
		setModalData({ feedID: nodeId });
		// navigate("SinglePost", { feedId: nodeId });
		MarkAsReadNotification(id);
	}
	return (
		// <Animatable.View
		// 	animation={"zoomIn"}
		// 	duration="500"
		// 	delay={index * 200}
		// >
		<TouchableWithoutFeedback onPress={onClickNavigate}>
			<View
				style={[
					styles.container,
					{
						backgroundColor: item.markAsRead ? color?.gradientWhite : "#dadaef",
						borderColor: color?.border,
					},
				]}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						BanjeeProfileId === userId
							? undefined
							: navigate("BanjeeProfile", { profileId: userId });
					}}
				>
					<View style={styles.subContainer}>
						{/* <FastImage
							source={{ uri: profileUrl(avtarUrl) }}
							style={{ height: 40, width: 40, borderRadius: 20 }}
						/> */}
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={{ height: 40, width: 40, borderRadius: 20 }}
							source={{ uri: profileUrl(avtarUrl) }}
						>
							{firstName?.charAt(0).toUpperCase() || ""}
						</Avatar>
						{emojies(reactionType, false, 18)}
					</View>
				</TouchableWithoutFeedback>
				<Text
					style={{ marginLeft: 20 }}
					color={item.markAsRead ? color?.black : "black"}
				>
					<Text
						style={{ fontWeight: "bold" }}
						onPress={onClickNavigate}
					>
						{`${firstName} ${lastName} `}
					</Text>
					reacted on your post.
				</Text>
			</View>
		</TouchableWithoutFeedback>
		// </Animatable.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
		width: "95%",
		alignSelf: "center",
		borderRadius: 8,
		elevation: 4,
		height: "100%",
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		borderWidth: 0.5,
		paddingVertical: 5,
	},
	subContainer: {
		height: 40,
		width: 40,
		position: "relative",
	},
});

export default FeedReaction;
