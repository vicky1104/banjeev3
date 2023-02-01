import { Text } from "native-base";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import color from "../../env/color";

function AppBorderButton({ onPress, width, title, titleFontSize = 16 }) {
	const styles = StyleSheet.create({
		container: {
			height: 40,
			width: width,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: 6,
			borderColor: "grey",
			borderWidth: 1,
			backgroundColor: color?.gradientWhite,
		},
	});

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.container}>
				<Text
					onPress={onPress}
					style={{ color: "#fff" }}
					fontSize={titleFontSize}
				>
					{title}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

export default AppBorderButton;
