import React from "react";
import { StyleSheet, ImageBackground, Dimensions } from "react-native";
import Bg from "../../../assets/splash.png";

function BackGroundImg({ style, children, image }) {
	return (
		<ImageBackground
			source={image ? image : Bg}
			style={[
				styles.container,
				style,
				{
					width: Dimensions.get("screen").width,
					height: Dimensions.get("screen").height,
				},
			]}
			resizeMode="stretch"
		>
			{children}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: { height: "100%", width: "100%", alignItems: "center" },
});

export default BackGroundImg;
