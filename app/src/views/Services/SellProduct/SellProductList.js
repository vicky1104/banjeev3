import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ImageBackground,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import ProductSkeleton from "../../../constants/components/ui-component/Skeleton/ProductSkeleton";
import color from "../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";

function SellProductList({ data, loader, NHCloudId }) {
	const { navigate } = useNavigation();

	return (
		<Fragment>
			{loader ? (
				<ProductSkeleton name={"For sell nearby"} />
			) : (
				<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
					<View
						style={{
							flexDirection: "row",
							width: "95%",
							alignSelf: "center",
							justifyContent: "space-between",
							alignItems: "center",
							marginVertical: 10,
						}}
					>
						{data?.content?.length > 0 && (
							<Fragment>
								<Text
									fontWeight={"medium"}
									color={color?.black}
									fontSize="16"
								>
									For sell nearby
								</Text>

								<Text
									color={color?.black}
									fontWeight={"medium"}
									onPress={() => navigate("AllProductList")}
									style={{
										// backgroundColor: "lightgrey",
										paddingHorizontal: 10,
										paddingVertical: 5,
										borderRadius: 48,
									}}
								>
									View all
								</Text>
							</Fragment>
						)}
					</View>

					<FlatList
						horizontal
						showsHorizontalScrollIndicator={false}
						data={data?.content}
						keyExtractor={() => Math.random()}
						renderItem={({ item }) => {
							return (
								<TouchableWithoutFeedback
									onPress={() =>
										navigate("ViewProductInDetail", { productId: item.id, NHCloudId })
									}
								>
									<View style={{ paddingBottom: 5, marginBottom: 20 }}>
										<View
											style={{
												// height: 250,
												width: 140,
												borderWidth: 1,
												marginLeft: 10,
												borderColor: color?.border,
												backgroundColor: color?.gradientwhite,
												overflow: "hidden",
												borderRadius: 8,
												elevation: 3,
												shadowOffset: { width: 1, height: 1 },
												shadowOpacity: 0.4,
												shadowRadius: 3,
											}}
										>
											<View style={{ height: 130, width: "100%" }}>
												<Image
													source={{
														uri: cloudinaryFeedUrl(item.imageUrl, "image"),
													}}
													style={{ width: "100%", height: "100%" }}
												/>
											</View>

											<View
												style={{
													// height: "50%",
													width: "100%",
													paddingHorizontal: 5,
													paddingVertical: 3,
													backgroundColor: color?.gradientWhite,
												}}
											>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<Text
														fontSize={16}
														color={color?.black}
													>
														{item.price} <Text fontWeight={"medium"}>{item.currency}</Text>
													</Text>
												</View>
												<Text
													fontSize={13}
													numberOfLines={2}
													color={color?.black}
												>
													{item.name}
												</Text>

												{/* <Text
											// fontSize={12}
											style={{ color: color.greyText }}
											numberOfLines={3}
										>
											{item.description}
										</Text> */}
											</View>
										</View>
									</View>
								</TouchableWithoutFeedback>
							);
						}}
						ListEmptyComponent={() => (
							<View
								style={{
									overflow: "hidden",
									height: 200,
									width: Dimensions.get("screen").width,
									paddingHorizontal: "2%",
									marginBottom: 20,
									alignSelf: "center",
								}}
							>
								<ImageBackground
									resizeMode="stretch"
									source={require("../../../../assets/EditDrawerIcon/classifiedBG.png")}
									style={{
										height: 200,
										width: "100%",
										alignItems: "center",

										borderRadius: 8,

										borderWidth: 1,
										borderColor: "lightgrey",
										overflow: "hidden",
									}}
								>
									<View
										// key={i}
										style={{
											height: 200,
											width: "100%",
											alignItems: "center",
											shadowColor: "#470000",
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: 0.2,
											shadowRadius: 8,
											overflow: "hidden",
											backgroundColor: "rgba(0,0,0,0.5)",
											padding: 5,
											justifyContent: "space-around",
										}}
									>
										<Text
											fontSize={20}
											color={color?.white}
											fontWeight="medium"
										>
											Banjee classifieds
										</Text>

										<Text
											fontSize={16}
											color={color?.white}
											textAlign={"center"}
										>
											Want to sell old products to your neighbors ?
										</Text>

										<TouchableWithoutFeedback onPress={() => navigate("CreateListing")}>
											<View
												style={{
													paddingHorizontal: 10,
													paddingVertical: 5,
													// width: "30%",
													alignSelf: "center",
													borderWidth: 1,
													borderColor: color?.white,
													borderRadius: 8,
													alignItems: "center",
													elevation: 5,
													shadowOffset: { width: 1, height: 1 },
													shadowOpacity: 0.4,
													shadowRadius: 3,
													backgroundColor: color.primary,
												}}
											>
												<Text
													fontSize={16}
													color={color?.white}
												>
													List your product
												</Text>
											</View>
										</TouchableWithoutFeedback>
									</View>
								</ImageBackground>
							</View>
						)}
					/>
				</View>
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		// paddingBottom: 20,
		// marginBottom: 20,
		// marginTop: 0,
	},
	imgBg: {
		height: 200,
		width: "100%",
		alignItems: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "lightgrey",
		overflow: "hidden",
	},
});

export default SellProductList;
