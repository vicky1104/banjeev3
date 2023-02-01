import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function MutedVideoScreen() {
	return (
		<View
			style={{
				position: "absolute",
				bottom: 150,
				width: "95%",
				height: 100,
				borderRadius: 8,
				left: 10,
				right: 0,
				backgroundColor: "red",
			}}
		>
			<Text>MutedVideoScreen</Text>
		</View>
	);
}

const styles = StyleSheet.create({});
