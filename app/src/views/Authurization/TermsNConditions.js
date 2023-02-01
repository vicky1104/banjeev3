import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Text } from "native-base";
import color from "../../constants/env/color";
import FastImage from "react-native-fast-image";

function TermsNConditions(props) {
	const {
		params: { url, label },
	} = useRoute();

	return (
		<LinearGradient
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 0.2, y: 1 }}
			colors={["rgba(237, 71, 92, 1 )", "rgba(98, 4, 160, 1 )"]}
		>
			<View style={styles.card}>
				<FastImage
					source={require("../../../assets/logo.png")}
					style={styles.logo}
				/>
				<Text style={{ marginBottom: 10 }}>{label}</Text>
				<WebView source={{ uri: url }} />
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: "center", justifyContent: "center" },
	card: {
		backgroundColor: color.card,
		height: "90%",
		width: "90%",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	logo: {
		height: 80,
		width: 80,
		borderRadius: 40,
		alignSelf: "center",
		marginTop: -45,
		marginBottom: 10,
	},
});

export default TermsNConditions;
