import React, { useCallback, useState } from "react";
import { Linking } from "react-native";

import { StyleSheet, View, Text } from "react-native";
import { Camera } from "react-native-vision-camera";
import { CONTENT_SPACING, SAFE_AREA_PADDING } from "./Constants";

export function PermissionsPage() {
	const [cameraPermissionStatus, setCameraPermissionStatus] =
		useState("not-determined");
	const [microphonePermissionStatus, setMicrophonePermissionStatus] =
		useState("not-determined");

	const requestMicrophonePermission = useCallback(async () => {
		console.log("Requesting microphone permission...");
		const permission = await Camera.requestMicrophonePermission();
		console.log(`Microphone permission status: ${permission}`);

		if (permission === "denied") await Linking.openSettings();
		setMicrophonePermissionStatus(permission);
	}, []);

	const requestCameraPermission = useCallback(async () => {
		console.log("Requesting camera permission...");
		const permission = await Camera.requestCameraPermission();
		console.log(`Camera permission status: ${permission}`);

		if (permission === "denied") await Linking.openSettings();
		setCameraPermissionStatus(permission);
	}, []);

	// useEffect(() => {
	//   if (cameraPermissionStatus === 'authorized' && microphonePermissionStatus === 'authorized') {

	//   }
	// }, [cameraPermissionStatus, microphonePermissionStatus]);

	return (
		<View style={styles.container}>
			<Text style={styles.welcome}>Welcome to Vision Camera.</Text>
			<View style={styles.permissionsContainer}>
				{cameraPermissionStatus !== "authorized" && (
					<Text style={styles.permissionText}>
						Vision Camera needs <Text style={styles.bold}>Camera permission</Text>.{" "}
						<Text
							style={styles.hyperlink}
							onPress={requestCameraPermission}
						>
							Grant
						</Text>
					</Text>
				)}
				{microphonePermissionStatus !== "authorized" && (
					<Text style={styles.permissionText}>
						Vision Camera needs <Text style={styles.bold}>Microphone permission</Text>
						.{" "}
						<Text
							style={styles.hyperlink}
							onPress={requestMicrophonePermission}
						>
							Grant
						</Text>
					</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	welcome: {
		fontSize: 38,
		fontWeight: "bold",
		maxWidth: "80%",
	},
	banner: {
		position: "absolute",
		opacity: 0.4,
		bottom: 0,
		left: 0,
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		...SAFE_AREA_PADDING,
	},
	permissionsContainer: {
		marginTop: CONTENT_SPACING * 2,
	},
	permissionText: {
		fontSize: 17,
	},
	hyperlink: {
		color: "#007aff",
		fontWeight: "bold",
	},
	bold: {
		fontWeight: "bold",
	},
});
