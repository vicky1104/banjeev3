import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { AppContext } from "../../../../../Context/AppContext";
import TextParser from "./TextParser";

function RenderText({ src, chatContent, ...props }) {
	const { profile } = useContext(AppContext);
	const { navigate } = useNavigation();
	function handleUrlPress(url, matchIndex /*: number*/) {
		Linking.openURL(url);
	}

	function handlePhonePress(phoneNumber, matchIndex /*: number*/) {
		if (Platform.OS === "android") {
			phoneNumber = `tel:${phoneNumber}`;
		} else {
			phoneNumber = `telprompt:${phoneNumber}`;
		}
		Linking.openURL(phoneNumber);
	}

	function handleNamePress(name, matchIndex /*: number*/) {
		Alert.alert(`Hello ${name}`);
	}

	function handleEmailPress(email, matchIndex /*: number*/) {
		if (Platform.OS === "android") {
			email = `mailto:${email}`;
		} else {
			email = `mailto:${email}`;
		}
		Linking.openURL(email);
	}

	function renderText(matchingString, matches) {
		// matches => ["[@michel:5455345]", "@michel", "5455345"]
		let pattern = /\[(@[^:]+):([^\]]+)\]/i;
		let match = matchingString.match(pattern);
		return `^^${match[1]}^^`;
	}
	const parser = [
		{
			type: "url",
			style: styles.url,
			onPress: handleUrlPress,
			whatIsType: "URL",
		},
		{
			type: "phone",
			style: styles.phone,
			onPress: handlePhonePress,
		},
		{
			type: "email",
			style: styles.email,
			onPress: handleEmailPress,
		},
		{
			pattern: /@[A-Za-z0-9]{0,100} [A-Za-z0-9]{0,100}/i,
			style: styles.username,
			onPress: (name) => {
				let x = name.split("@")[1];
				let id = chatContent.mension?.[x];
				console.warn(x, id);
				if (id === profile?.systemUserId) {
					navigate("Profile");
				} else if (id) {
					navigate("BanjeeProfile", { profileId: id });
				}
			},
			renderText: (name) => {
				let x = name.split("@")[1];
				let id = chatContent.mension?.[x];
				console.warn(x, id);
				if (id) {
					return name;
				} else {
					return name.split("@")?.[1] ? name.split("@")?.[1] : "";
				}
			},
		},
		{
			pattern: /\[(@[^:]+):([^\]]+)\]/,
			style: styles.username,
			onPress: handleNamePress,
			renderText: renderText,
		},

		{ pattern: /42/, style: styles.magicNumber },
		{ pattern: /#(\w+)/, style: styles.hashTag },
	];
	return (
		<View style={{ maxWidth: 260 }}>
			<TextParser
				selectable={true}
				chatContent={chatContent}
				parse={parser}
				childrenProps={{ allowFontScaling: true }}
			>
				{src}
			</TextParser>
		</View>
	);
}

const styles = StyleSheet.create({
	url: {
		color: "#0645ad",
		maxWidth: 260,
		textDecorationLine: "underline",
	},

	email: {
		maxWidth: 260,
		textDecorationLine: "underline",
	},

	text: {
		maxWidth: 260,
		color: "black",
		fontSize: 15,
	},

	phone: {
		maxWidth: 260,
		color: "blue",
		textDecorationLine: "underline",
	},

	name: {
		maxWidth: 260,
		color: "red",
	},

	username: {
		maxWidth: 260,
		color: "green",
		fontWeight: "bold",
	},

	magicNumber: {
		maxWidth: 260,
		fontSize: 42,
		color: "pink",
	},

	hashTag: {
		maxWidth: 260,
		fontStyle: "italic",
	},
});

export default RenderText;
