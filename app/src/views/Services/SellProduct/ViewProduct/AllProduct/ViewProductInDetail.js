import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import color from "../../../../../constants/env/color";
import { AppContext } from "../../../../../Context/AppContext";
import {
	filterClassifiedService,
	findProductService,
} from "../../../../../helper/services/Classifieds";
import {
	BanjeeProfileId,
	cloudinaryFeedUrl,
	profileUrl,
} from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";
const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;

function ViewProductInDetail(props) {
	const { navigate } = useNavigation();
	const [visible, setVisible] = useState(true);
	const [data, setData] = useState();
	const {
		params: { productId, NHCloudId },
	} = useRoute();

	// const [productID,setProductID]=useState()

	const [moreData, setMoreData] = useState([]);

	const { profile } = useContext(AppContext);

	useEffect(() => {
		setVisible(true);
		findProductService(productId)
			.then((res) => {
				setData(res),
					filterClassifiedService({
						categoryId: "",
						cloudId: NHCloudId,
						deleted: "",
						domain: "",
						fields: "",
						inactive: "",
						page: 0,
						pageSize: 10,
						sortBy: "",
						userId: res.postedBy.id,
					})
						.then((response) => {
							setMoreData(response.content);
							setVisible(false);
						})
						.catch((err) => console.warn(err));
			})
			.catch((err) => console.warn(err));
	}, [productId, NHCloudId]);

	return (
		// <LinearGradient
		// 	style={styles.container}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={["#ffffff", "#eeeeff"]}
		// >
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<Fragment>
						<Image
							source={{
								uri: cloudinaryFeedUrl(data.imageUrl, "image"),
							}}
							style={{ height: 300, backgroundColor: color?.white }}
						/>
						<View style={{ paddingHorizontal: "2.5%" }}>
							{/* `````````````````` PRICE */}

							<View style={styles.price}>
								<Text
									fontSize={18}
									color={color?.black}
								>
									{data.price}{" "}
									<Text
										fontWeight={"medium"}
										color={color?.black}
									>
										{data.currency}
									</Text>
								</Text>
								<Text
									fontSize={12}
									style={{ color: color.greyText }}
								>
									{convertTime(data.createdOn)}
								</Text>
							</View>

							<Text
								fontWeight={"medium"}
								fontSize={16}
								style={{ marginTop: 10, color: color?.black }}
							>
								{data.name}
							</Text>

							<Text
								fontWeight={"bold"}
								color={color?.black}
							>
								About
							</Text>
							<Text
								fontSize={14}
								fontWeight={"normal"}
								color={color?.black}
								opacity={70}
							>
								{data.description}
							</Text>

							<View
								style={{
									borderBottomWidth: 1,
									marginTop: 10,
									borderColor: color?.gradientBlack,
								}}
							/>
							<TouchableWithoutFeedback
								onPress={() => {
									switch (true) {
										case profile?.systemUserId === data.postedBy.id:
											navigate("Profile");
											break;

										case BanjeeProfileId === data.postedBy.id:
											return null;

										default:
											navigate("BanjeeProfile", {
												profileId: data.postedBy.id,
											});
											break;
									}
								}}
							>
								<View
									style={[
										styles.postBy,
										{
											borderColor: color?.gradientBlack,
											backgroundColor: color?.gradientWhite,
										},
									]}
								>
									<Text
										fontSize={16}
										fontWeight="bold"
										color={color?.black}
									>
										Posted By
									</Text>

									<View style={styles.profile}>
										<Image
											source={{
												uri: profileUrl(data.postedBy.avtarUrl),
											}}
											style={{ height: 50, width: 50, borderRadius: 25 }}
										/>
										<View style={{ marginLeft: 10 }}>
											<Text
												fontSize={14}
												fontWeight="medium"
												color={color?.black}
											>
												{profile?.systemUserId === data.postedBy.id ? (
													"You"
												) : (
													<Text color={color?.black}>
														{data.postedBy.firstName} {data.postedBy.lastName}
													</Text>
												)}
											</Text>
											<Text
												fontSize={12}
												color={color?.black}
												opacity={70}
											>
												{data.cloudName}
											</Text>
										</View>
									</View>
								</View>
							</TouchableWithoutFeedback>

							{/* ````````````````````` MORE PRODUCT */}
							{moreData.length > 1 && (
								<Fragment>
									<Text
										fontWeight="medium"
										fontSize={16}
										color={color?.black}
									>
										More Product
									</Text>

									<View style={styles.moreProduct}>
										{moreData.map((item, i) => {
											return (
												productId !== item.id && (
													<TouchableWithoutFeedback
														key={i}
														onPress={() =>
															navigate("ViewProductInDetail", {
																productId: item.id,
															})
														}
													>
														<View
															style={[
																styles.card,
																{
																	borderColor: color?.gradientBlack,
																	backgroundColor: color?.gradientWhite,
																},
															]}
														>
															<View style={{ height: "60%", width: "100%" }}>
																<Image
																	source={{
																		uri: cloudinaryFeedUrl(item.imageUrl, "image"),
																	}}
																	style={{ width: "100%", height: "100%" }}
																/>
															</View>

															<View
																style={{
																	height: "40%",
																	width: "100%",
																	paddingHorizontal: 5,
																	paddingVertical: 3,
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
																		{item.price}{" "}
																		<Text fontWeight={"medium"}>{item.currency}</Text>
																	</Text>
																	<Text
																		fontSize={12}
																		style={{ color: color.greyText }}
																	>
																		{convertTime(item.createdOn)}
																	</Text>
																</View>
																<Text
																	// fontSize={12}
																	style={{ color: color.greyText }}
																	numberOfLines={3}
																>
																	{item.description}
																</Text>
															</View>
														</View>
													</TouchableWithoutFeedback>
												)
											);
										})}
									</View>
								</Fragment>
							)}
						</View>
					</Fragment>
				</ScrollView>
			)}
			{/* </LinearGradient> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	price: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	postBy: {
		borderWidth: 1,

		borderRadius: 8,

		marginVertical: 10,
		paddingHorizontal: 10,
		paddingBottom: 10,
		paddingTop: 5,
	},
	profile: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 5,
	},
	moreProduct: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		// paddingVertical: 10,
		width: "100%",
		alignSelf: "center",
		paddingBottom: 20,
	},
	card: {
		height: 250,
		width: CARD_WIDTH,
		borderWidth: 1,
		marginTop: 10,
		overflow: "hidden",
		borderRadius: 8,
		elevation: 3,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
});

export default ViewProductInDetail;
