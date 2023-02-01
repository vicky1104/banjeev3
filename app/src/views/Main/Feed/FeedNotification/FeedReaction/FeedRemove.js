import { Text } from "native-base";
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import color from "../../../../../constants/env/color";

function FeedRemove({ item }) {
	const {
		markAsRead,
		contents: { remark },
	} = item;
	return (
		<TouchableWithoutFeedback onPress={() => {}}>
			<View
				style={[
					styles.container,
					{ backgroundColor: markAsRead ? color.white : "#dadaef" },
				]}
			>
				<FastImage
					source={require("../../../../../../assets/logo.png")}
					style={{ height: 40, width: 40, borderRadius: 20 }}
				/>

				<View style={{ flexDirection: "column", marginLeft: 20 }}>
					<Text color={item.markAsRead ? color?.black : color?.white}>
						Your feed has been removed due to{" "}
					</Text>
					<Text
						numberOfLines={1}
						style={{ fontSize: 14 }}
						color={item.markAsRead ? color?.black : color?.white}
					>
						{remark.length > 40 ? `"${remark.slice(0, 40)} ...."` : `"${remark}"`}
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

export default FeedRemove;
