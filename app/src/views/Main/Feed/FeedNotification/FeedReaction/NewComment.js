import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React from "react";
import { useContext } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { MainContext } from "../../../../../../context/MainContext";
import color from "../../../../../constants/env/color";
import { MarkAsReadNotification } from "../../../../../helper/services/BanjeeNotification";
import {
	BanjeeProfileId,
	profileUrl,
} from "../../../../../utils/util-func/constantExport";
function NewComment({ item }) {
	const {
		contents: {
			payload: {
				text,
				id,
				feedId,
				createdByUser: { avtarUrl, username, firstName, lastName, id: userId },
			},
		},
	} = item;

	const { navigate } = useNavigation();
	const { setModalData, setOpenPostModal } = useContext(MainContext);

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				setOpenPostModal(true);
				setModalData({ feedID: id });
				// navigate("SinglePost", { feedId: feedId });

				MarkAsReadNotification(item.id)
					.then(() => {})
					.catch((err) => console.error(err));
			}}
		>
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
				</TouchableWithoutFeedback>
				<View style={{ flexDirection: "column", marginLeft: 20 }}>
					<Text color={item.markAsRead ? color?.black : "black"}>
						<Text style={{ fontWeight: "bold" }}>{`${firstName} ${lastName} `}</Text>
						commented on your post.
					</Text>
					<Text
						color={item.markAsRead ? color?.black : color?.white}
						numberOfLines={1}
						style={{ fontSize: 14 }}
					>
						{text.length > 40 ? `"${text.slice(0, 40)} ...."` : `"${text}"`}
					</Text>
				</View>
			</View>
		</TouchableWithoutFeedback>
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
		paddingVertical: 5,
		borderWidth: 0.5,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
	},
});

export default NewComment;
