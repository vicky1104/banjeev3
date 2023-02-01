import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";

function AppLoading({
	visible,
	height = "100%",
	width = "100%",
	marginTop,
	marginBottom,
	size = "large",
	color,
}) {
	return (
		<React.Fragment>
			{visible && (
				<ActivityIndicator
					color={color}
					style={[
						styles.container,
						{
							height: height,
							width: width,
							marginTop: marginTop,
							marginBottom: marginBottom,
						},
					]}
					size={size}
				/>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		zIndex: 9999,
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0)",
	},
});

export default AppLoading;
