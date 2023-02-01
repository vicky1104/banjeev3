import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Image,
	TouchableWithoutFeedback,
	ImageBackground,
} from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";
import * as Animatable from "react-native-animatable";
import color from "../../../../constants/env/color";

function ExploreDrawer({}) {
	const { navigate } = useNavigation();
	const [openExplore, setOpenExplore] = useState(false);
	const exploreArr = [
		{
			img: require("../../../../../assets/EditDrawerIcon/ic_group.png"),
			name: "Communities",
			onPress: () => navigate("Groups"),
		},
		{
			img: require("../../../../../assets/DeleteLater/blog2.png"),
			name: "Blogs",
			onPress: () => {
				navigate("MyBlogs");
			},
		},

		{
			img: require("../../../../../assets/DeleteLater/online-shop1.png"),
			name: "Businesses",
			onPress: () => {
				navigate("BusinessService");
			},
		},
		{
			img: require("../../../../../assets/DeleteLater/trade1.png"),
			name: "Buy/Sell",
			onPress: () => {
				navigate("AllProductList");
			},
		},
		// {
		// 	img: require("../../../../../assets/DeleteLater/group1.png"),
		// 	name: "Announcements",
		// 	onPress: () => navigate("Announcement"),
		// },
		{
			img: require("../../../../../assets/DeleteLater/pay1.png"),
			name: "Pay Bills",
			onPress: () => showToast("Coming soon...!"),
			// onPress: () => navigate("UpdateName"),
		},
	];

	return (
		<>
			<TouchableWithoutFeedback
				onPress={() => {
					setOpenExplore(true);
				}}
			>
				<View style={styles?.explore}>
					<ImageBackground
						source={require("../../../../../assets/widget.png")}
						style={{ width: 25, height: 150 }}
					>
						<View style={styles?.textView}>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								E
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								X
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								P
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								L
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								O
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								R
							</Text>
							<Text
								textAlign={"center"}
								fontSize={12}
								mb={-1}
							>
								E
							</Text>
						</View>
					</ImageBackground>
				</View>
			</TouchableWithoutFeedback>

			<OverlayDrawer
				transparent
				visible={openExplore}
				onClose={() => setOpenExplore(false)}
				closeOnTouchOutside
				animationType="slideInRight"
				animationOutType="slideOutRight"
				containerStyle={styles.container}
				childrenWrapperStyle={styles?.childContainer}
				animationDuration={100}
			>
				{(hideModal) => (
					<>
						{exploreArr.map((ele, index) => (
							<Animatable.View
								key={Math.random()}
								animation={"slideInRight"}
								duration={100}
								delay={5}
							>
								<TouchableWithoutFeedback
									onPress={() => {
										ele.onPress();
										if (ele.name !== "Pay Bills") {
											hideModal();
										}
									}}
								>
									<View
										key={index}
										style={styles?.iconView}
									>
										<Image
											source={ele.img}
											style={styles.img}
										/>
										<Text
											fontSize={12}
											color={color?.black}
										>
											{ele?.name}
										</Text>
									</View>
								</TouchableWithoutFeedback>
							</Animatable.View>
						))}
					</>
				)}
			</OverlayDrawer>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		padding: 0,
		height: Dimensions.get("screen").height,
		width: Dimensions.get("screen").width,
	},
	childContainer: {
		width: "25%",
		borderRadius: 16,
		alignSelf: "flex-end",
		backgroundColor: "#57534e",
		padding: 0,
		justifyContent: "center",
	},
	explore: {
		position: "absolute",
		right: -10,
		top: 150,
		zIndex: 9999,
	},
	textView: {
		flex: 1,
		marginLeft: -8,
		margintop: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	iconView: {
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	img: { height: 40, width: 40, borderRadius: 20 },
});

export default ExploreDrawer;
