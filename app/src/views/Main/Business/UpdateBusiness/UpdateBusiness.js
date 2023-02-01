import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Box, Text } from "native-base";
import React, { useCallback, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	Share,
	StyleSheet,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { findBusinessByID } from "../../../../helper/services/BusinessCategory";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";

const CARD_WIDTH = Dimensions.get("screen").width / 2 - 50;

function UpdateBusiness(props) {
	const { params } = useRoute();
	const [data, setData] = useState();
	const [visible, setVisible] = useState(true);
	const { navigate, setOptions } = useNavigation();

	useFocusEffect(
		useCallback(() => {
			findBusinessByID(params.businessId)
				.then((res) => {
					// console.warn(res);
					setData(res);
					setVisible(false);
				})
				.catch((err) => console.warn(err));
		}, [params])
	);

	function sharePage() {
		try {
			const result = Share.share({
				message: "honest",
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			console.warn(error.message);
		}
	}

	return (
		// <LinearGradient
		// 	style={{ flex: 1 }}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.container}>
						<View
							style={{
								// height: 170,
								width: "95%",
								alignSelf: "center",
								borderBottomWidth: 1,
								borderColor: color.greyText,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Image
									source={{
										uri: cloudinaryFeedUrl(data.logoURL, "image"),
									}}
									style={{
										height: 100,
										width: 100,
										borderRadius: 50,
										marginHorizontal: 10,
										marginTop: 10,
									}}
								/>

								<View style={{ width: "65%", paddingLeft: "2.5%" }}>
									<Text
										color={color?.black}
										fontSize={16}
										fontWeight={"bold"}
										numberOfLines={1}
									>
										{data.name}
									</Text>
									<Text
										numberOfLines={1}
										color={color?.black}
									>
										{data.categoryName}
									</Text>
									<Text
										textAlign={"left"}
										numberOfLines={2}
										color={color?.black}
									>
										{data.address}
									</Text>
								</View>
							</View>

							<View
								style={{
									width: 80,
									alignSelf: "center",
									marginVertical: 10,
								}}
							>
								<AppButton
									title={"Update"}
									onPress={() => {
										navigate("CreateBusiness", { data: data });
									}}
								/>
							</View>
						</View>

						{/* `````````````` ABOUT BUISNESS */}

						<View style={{ marginLeft: 10, marginTop: 10 }}>
							<Text
								fontWeight={"medium"}
								fontSize={16}
								color={color?.black}
							>
								About
							</Text>

							<Text
								style={{
									textAlign: "justify",
									marginRight: 10,
									marginTop: 4,
									color: color?.black,
								}}
							>
								{data.description}
							</Text>
						</View>

						{/* ```````````` PHOTOS */}

						{data?.imageUrls?.length > 0 && (
							<View style={{ marginTop: 15 }}>
								<Text
									fontSize={16}
									fontWeight={"medium"}
									style={{
										marginLeft: 10,
										marginBottom: 10,
										color: color?.black,
									}}
								>
									Photos
								</Text>

								<FlatList
									data={data.imageUrls}
									horizontal
									showsHorizontalScrollIndicator={false}
									keyExtractor={(e) => Math.random()}
									renderItem={({ item, index }) => {
										return (
											<Box
												// key={i}
												style={{
													// height: 200,
													width: CARD_WIDTH,
													borderRadius: 8,
													// marginHorizontal: 10
													marginLeft: 10,
													marginRight: 5,
													overflow: "hidden",
													elevation: 5,
													shadowRadius: 8,
													borderWidth: 1,
													borderColor: color.grey,
													shadowColor: "#470000",
													shadowOffset: { width: 0, height: 1 },
													shadowOpacity: 0.2,
													// paddingLeft: 10,
												}}
											>
												<FastImage
													source={{
														uri: cloudinaryFeedUrl(item, "image"),
													}}
													style={{ height: 200, width: "100%" }}
												/>
											</Box>
										);
									}}
								/>
							</View>
						)}

						{/* `````````````` OFFERS */}

						{/* <View style={{ marginTop: 15 }}>
							<Text
								fontSize={16}
								fontWeight={"medium"}
								style={{
									marginLeft: 10,
									marginBottom: 10,
									color: color?.black,
								}}
							>
								Offers
							</Text>

							<Box
								// key={i}
								style={{
									height: 200,
									width: CARD_WIDTH,
									borderRadius: 8,
									// marginHorizontal: 10
									marginLeft: 10,
									marginRight: 5,
									overflow: "hidden",
									elevation: 2,
									shadowRadius: 8,
									shadowColor: "#470000",
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.2,
									borderColor: "lightgrey",
									// paddingLeft: 10,
								}}
							>
								<ImageBackground
									blurRadius={10}
									source={{
										uri: "https://blog.logrocket.com/wp-content/uploads/2021/09/sharing-content-react-native-using-react-native-share.png ",
									}}
									style={{
										height: "100%",
										width: "100%",
										borderWidth: 1,
										borderColor: "lightgrey",
									}}
								>
									<View
										style={{
											height: "100%",
											width: "100%",
											backgroundColor: "rgba(0,0,0,0.5)",
											alignItems: "center",
											justifyContent: "center",
											paddingHorizontal: 20,
										}}
									>
										<Text
											fontSize={22}
											fontWeight="bold"
											style={{
												color: color?.white,
												textAlign: "center",
												lineHeight: 50,
											}}
										>
											BUY ONE GET ONE FREE
										</Text>
									</View>
								</ImageBackground>
							</Box>
						</View> */}

						{/* ````````````` */}
					</View>
				</ScrollView>
			)}
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { paddingBottom: 80, position: "relative", flex: 1 },
});

export default UpdateBusiness;
