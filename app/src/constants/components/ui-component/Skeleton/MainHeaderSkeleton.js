import { Skeleton, Text } from "native-base";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../../env/color";

function MainHeaderSkeleton(props) {
	return (
		<View style={styles.emptyComponent}>
			<View style={styles.row}>
				<View style={styles.common}>
					<Skeleton
						h={165}
						borderRadius="md"
						width={"95%"}
					/>

					<Skeleton
						h={4}
						borderRadius="lg"
						lines={1}
						width="80%"
						my={4}
					/>
					<View
						style={[{ justifyContent: "space-between", width: "95%" }, styles.row]}
					>
						<Skeleton.Text
							h={2}
							lines={1}
							w={"40%"}
						/>
						<Skeleton.Text
							lines={1}
							h={2}
							w={"40%"}
						/>
					</View>
				</View>

				<View style={styles.common}>
					<View style={styles.loadingWeather}>
						<Text
							color={color?.black}
							opacity={50}
						>
							Loading...
						</Text>
					</View>
					<Skeleton
						h={150}
						borderRadius="md"
						width={"95%"}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	emptyComponent: {
		height: 270,

		backgroundColor: "rgba(255,255,255,0.1)",
		marginBottom: 20,
		borderWidth: 1,
		padding: 5,
		borderRadius: 16,
		borderColor: "#ffffff90",
		width: Dimensions.get("screen").width - 10,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	common: { flex: 1, marginLeft: 5 },
	loadingWeather: {
		height: 65,
		marginBottom: 10,
		width: "95%",
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderColor: color?.border,
	},
});

export default MainHeaderSkeleton;
