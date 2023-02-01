import React, { useCallback, useEffect, useState } from "react";
import { Linking, PermissionsAndroid } from "react-native";

import { StyleSheet, View, Text } from "react-native";
import { Camera } from "react-native-vision-camera";
import { CONTENT_SPACING, SAFE_AREA_PADDING } from "./Constants";

export function PermissionsHandler({ permissionsHandler }) {
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

	const requestSavePermission = async () => {
		if (Platform.OS !== "android") return true;

		const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
		// if (permission == null) await Linking.openSettings();
		let hasPermission = await PermissionsAndroid.check(permission);
		if (!hasPermission) {
			const permissionRequestResult = await PermissionsAndroid.request(permission);
			hasPermission = permissionRequestResult === "authorized";
		}
		setCameraPermissionStatus(hasPermission);
	};

	const requestCameraPermission = useCallback(async () => {
		console.log("Requesting camera permission...");
		const permission = await Camera.requestCameraPermission();
		console.log(`Camera permission status: ${permission}`);

		if (permission === "denied") await Linking.openSettings();
		setCameraPermissionStatus(permission);
	}, []);

	useEffect(() => {
		requestMicrophonePermission();
		requestCameraPermission();
		requestSavePermission();
		console.warn(
			cameraPermissionStatus === "authorized" &&
				microphonePermissionStatus === "authorized"
		);
		console.warn(cameraPermissionStatus === "authorized");
		if (
			cameraPermissionStatus === "authorized" &&
			microphonePermissionStatus === "authorized"
		) {
			permissionsHandler();
		}
	}, [
		cameraPermissionStatus,
		microphonePermissionStatus,
		requestMicrophonePermission,
		requestCameraPermission,
		requestSavePermission,
	]);

	return null;
}
