import { LinearGradient } from "expo-linear-gradient";
import { Text } from "native-base";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import color from "../../../../constants/env/color";

function DetailNeighbourhoodTabs({ setTabs, tabs }) {
	return (
		<View
			style={{
				borderRadius: 100,
				height: 50,
				width: "100%",
				// position: "absolute",
				marginBottom: 30,
				alignSelf: "center",
			}}
		>
			<LinearGradient
				style={{
					justifyContent: "center",
					height: 50,
					width: "100%",
					alignItems: "center",
					borderRadius: 8,
				}}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				colors={["#ED475C", "#A93294"]}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "98%",
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							setTabs("Posts");
						}}
					>
						<View
							style={{
								height: 40,
								width: "50%",
								borderRadius: 8,
								backgroundColor: tabs === "Posts" ? color?.white : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								color={tabs === "Posts" ? color.primary : color?.white}
								fontWeight={"bold"}
							>
								Posts
							</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback
						onPress={() => {
							setTabs("Members");
						}}
					>
						<View
							style={{
								height: 40,
								width: "50%",
								borderRadius: 8,
								backgroundColor: tabs === "Members" ? color?.white : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								color={tabs === "Members" ? color.primary : color?.white}
								fontWeight={"bold"}
							>
								Members
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default DetailNeighbourhoodTabs;
