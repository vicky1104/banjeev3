import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { MainContext } from "../../../../context/MainContext";
import { useNavigation } from "@react-navigation/native";
import color from "../../../constants/env/color";
import { FloatingAction } from "react-native-floating-action";

function PostModal({ setOpen, open }) {
	const { createFeedData } = useContext(MainContext);
	const { navigate } = useNavigation();

	const actions = [
		{
			color: color.primary,
			text: "Create Post",
			icon: require("../../../../assets/alerticonset/edit.png"),
			name: "CreateFeed",
			position: 1,
		},
		{
			color: color.primary,
			text: "Create alert",
			icon: require("../../../../assets/alerticonset/danger.png"),
			name: "SelectAlertLocation",
			position: 2,
		},
		{
			color: color.primary,
			text: "Create Blog",
			icon: require("../../../../assets/alerticonset/blog.png"),
			name: "CreateBlog",
			position: 3,
		},
	];
	return (
		// <View style={{ zIndex: 1, position: "absolute", bottom: -12, right: -15 }}>
		<FloatingAction
			actionsPaddingTopBottom={5}
			buttonSize={56}
			color={color.primary}
			tintColor="white"
			actions={actions}
			onPressItem={(e) => {
				if (e === "CreateFeed") {
					createFeedData({});
				}
				navigate(e);
			}}
		/>
		// </View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default PostModal;
