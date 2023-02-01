import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect } from "react";
import NeighbourhoodSVG from "../../../assets/NeighbourhoodSVG";
import AlertSVG from "../../../assets/AlertSVG";
import ChatSVG from "../../../assets/ChatSVG";
import GroupSVG from "../../../assets/GroupSVG";
import SecureSVG from "../../../assets/SecureSVG";
import AppIntroSlider from "react-native-app-intro-slider";
import { setLocalStorage } from "../Cache/TempStorage";
import SplashScreen from "react-native-splash-screen";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import Lottie from "lottie-react-native";

const slides = [
	{
		key: 1,
		title: "Neighbourhood",
		text:
			"Welcome to Banjee \nCommunities are now safer, transparent, and more connected with Banjee.",
		image: () => (
			<Lottie
				source={require("../../../assets/Animations/AppIntroAnimation/neighbourhood.json")}
				autoPlay
				style={{
					marginHorizontal: Platform.OS === "android" ? 32 : 0,
				}}
			/>
		),
		backgroundColor: "#262024",
	},
	{
		key: 2,
		title: "Alert",
		text:
			"Banjee keeps you aware of what is happening around you via the Alerts feature",
		image: () => (
			<Lottie
				source={require("../../../assets/Animations/AppIntroAnimation/alert.json")}
				autoPlay
			/>
		),
		backgroundColor: "#262024",
	},
	{
		key: 3,
		title: "Chat",
		text:
			"Talk to your neighbors and friends via free voice & video calls on Banjee",
		image: () => (
			<Lottie
				source={require("../../../assets/Animations/AppIntroAnimation/chat.json")}
				autoPlay
			/>
		),
		backgroundColor: "#262024",
	},
	{
		key: 4,
		title: "Group",
		text:
			"Get closer to your neighbors and friends by having groups in your community with Banjee.",
		image: () => (
			<Lottie
				source={require("../../../assets/Animations/AppIntroAnimation/group.json")}
				autoPlay
			/>
		),
		backgroundColor: "#262024",
	},
	{
		key: 5,
		title: "Secure",
		text: "Banjee keeps your information, and messages safe from hacker attacks.",
		image: () => (
			<Lottie
				source={require("../../../assets/Animations/AppIntroAnimation/secure.json")}
				autoPlay
				style={{
					marginHorizontal: 32,
				}}
			/>
		),
		backgroundColor: "#262024",
	},
];

export default function AppIntro(props) {
	useEffect(() => {
		SplashScreen.hide();
	}, []);

	const _renderItem = ({ item }) => {
		return (
			<View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
				<Text style={styles.title}>{item.title}</Text>
				<item.image />
				<Text style={styles.text}>{item.text}</Text>
			</View>
		);
	};
	const _onDone = () => {
		setLocalStorage("appIntro", true)
			.then((res) => {
				props?.cb();
			})
			.catch((err) => {
				console.warn(err);
			});
	};
	return (
		<AppIntroSlider
			renderItem={_renderItem}
			data={slides}
			onDone={_onDone}
		/>
	);
}

const styles = StyleSheet.create({
	slide: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-around",
		backgroundColor: "blue",
	},
	image: {
		width: 320,
		height: 320,
		marginVertical: 32,
	},
	text: {
		color: "rgba(255, 255, 255, 0.8)",
		textAlign: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
		fontWeight: "bold",
		fontSize: 16,
	},
	title: {
		fontSize: 26,
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});
