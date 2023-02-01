import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import color from "../../../../../constants/env/color";
import { MarkAsReadNotification } from "../../../../../helper/services/BanjeeNotification";
import { profileUrl } from "../../../../../utils/util-func/constantExport";

function BlogCommentNotification({ item }) {
	const {
		id,
		markAsRead,
		contents: {
			postId,
			author: { firstName, lastName, avtarUrl, userName },
		},
	} = item;
	const { navigate } = useNavigation();

	const onClickNavigate = () => {
		navigate("ViewBlog", { id: postId });
		MarkAsReadNotification(id).then((res) => {});
	};

	return (
		<TouchableWithoutFeedback onPress={onClickNavigate}>
			<View
				style={[
					styles.container,
					{
						backgroundColor: item?.markAsRead ? color?.gradientWhite : "#dadaef",
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
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={{ height: 40, width: 40, borderRadius: 20 }}
							source={{ uri: profileUrl(avtarUrl) }}
						>
							{firstName?.charAt(0).toUpperCase() || userName?.charAt(0).toUpperCase()}
						</Avatar>
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
					commented on blog.
				</Text>
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
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		height: "100%",
		borderWidth: 0.5,
		paddingVertical: 5,
	},
	subContainer: {
		height: 40,
		width: 40,
		position: "relative",
	},
});

export default BlogCommentNotification;
