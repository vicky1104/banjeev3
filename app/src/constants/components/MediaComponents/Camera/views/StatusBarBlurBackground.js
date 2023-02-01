import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const FALLBACK_COLOR = "rgba(140, 140, 140, 0.3)";

const StatusBarBlurBackgroundImpl = ({ style, ...props }) => {
	if (Platform.OS !== "ios") return null;

	return (
		<View
			style={[styles.statusBarBackground, style]}
			blurAmount={25}
			blurType="light"
			reducedTransparencyFallbackColor={FALLBACK_COLOR}
			{...props}
		/>
	);
};

export const StatusBarBlurBackground = React.memo(StatusBarBlurBackgroundImpl);

const styles = StyleSheet.create({
	statusBarBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 100,
	},
});
