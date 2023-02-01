// SplashScreen.hide();

import { Text } from "native-base";
import React from "react";
import { useEffect } from "react";
import {
	Alert,
	Linking,
	TouchableNativeFeedback,
	TouchableOpacity,
	View,
} from "react-native";
import RNExitApp from "react-native-exit-app";
import SplashScreen from "react-native-splash-screen";
import IOSLocation from "./IOSLocation";

export default function IOSLocationPermission() {
	useEffect(() => {
		SplashScreen.hide();
		return () => {};
	}, []);

	return (
		<View
			style={{
				backgroundColor: "#262024",
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={{ height: 300, width: 300 }}>
				<IOSLocation />
			</View>
			<Text style={{ color: "white", fontWeight: "700", marginVertical: 10 }}>
				Banjee wants to access your location for exploring neighbourhoods and
				services near-by to you
			</Text>
			<Text style={{ color: "white" }}>
				Grant the access of location to the app
			</Text>
			<TouchableOpacity
				onPress={() => {
					Linking.openSettings().then((res) => {
						RNExitApp.exitApp();
					});
				}}
			>
				<View
					style={{
						alignSelf: "center",
						paddingVertical: 20,
						paddingHorizontal: 40,
						borderRadius: 30,
						backgroundColor: "#cbcbcb",
						marginTop: 40,
					}}
				>
					<Text style={{ color: "#262024", fontWeight: "bold" }}>Open Setting</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
