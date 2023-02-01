import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { Text } from "native-base";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
	Alert,
	Dimensions,
	Image,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { UpdateGroupService } from "../../../../helper/services/CreateGroupService";
import {
	cloudinaryFeedUrl,
	openAppSetting,
} from "../../../../utils/util-func/constantExport";
import {
	returnSource,
	uploadToCloudinaryFunc,
} from "../../../../utils/util-func/uploadToImage";
import SelectBuisnessLocation from "../../Business/CreateBusiness/SelectBuisnessLocation";
import { createNeighbourhoodService } from "../../../../helper/services/ListOurNeighbourhood";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import usePermission from "../../../../utils/hooks/usePermission";

function CreateNeighbourhood(props) {
	const [mediaModal, setMediaModal] = useState(false);
	const [visible, setVisible] = useState(false);
	const { params } = useRoute();
	const { setOptions, goBack } = useNavigation();
	const { location } = useContext(AppContext);
	const [address, setAddress] = useState();
	const { checkPermission } = usePermission();
	useEffect(() => {
		// getCityService({ cityId: "6308a522ea0553e25b9d0a1b" })
		// 	.then((res) => {
		// 		setCityData(res.content);
		// 		setVisible(false);
		// 	})
		// 	.catch((err) => console.warn(err));

		setOptions({
			headerTitle: params?.item ? "Update Neighbourhood" : "Create Neighbourhood",
		});
	}, [params]);

	async function submitData(values) {
		const { name, description, category, cloudType, city, location } = values;

		console.warn({
			...values,
			category,
			address,
		});

		setVisible(true);

		if (params?.item) {
			let newImageUrl;
			if (values.imageUrl?.uri.includes("file:///")) {
				let d = await uploadToCloudinaryFunc(
					returnSource(values.imageUrl),
					"image",
					"blog_image"
				);
				let x = await d.json();
				newImageUrl = x.public_id;
			} else {
				newImageUrl = values.imageUrl?.uri;
			}

			if (newImageUrl) {
				console.warn("UpdateGroupService Payload ------->", {
					name: name,
					bannerImageUrls: [],
					description: description,
					categoryId: category?.id,
					categoryName: category?.name,
					imageUrl: newImageUrl,
					cloudType: cloudType,
					id: params.item.id,
				});
				UpdateGroupService({
					name: name,
					bannerImageUrls: [],
					description: description,
					categoryId: category?.id,
					categoryName: category?.name,
					imageUrl: newImageUrl,
					cloudType: cloudType,
					id: params.item.id,
				})
					.then((res) => {
						console.warn("Updated Group res-----------", res);
						setVisible(false);
						Alert.alert(
							"Submitted",
							"Request submited successfully,You will recive a notification once approved.",
							[{ text: "OK", onPress: () => goBack() }]
						);
					})
					.catch((err) => console.warn(err));
			}
		} else {
			let { id: cityId, name: cityName } = city;
			let d = await uploadToCloudinaryFunc(
				returnSource(values.imageUrl),
				"image",
				"blog_image"
			);

			let x = await d.json();

			createNeighbourhoodService({
				name: name,
				approvalType: "BY_ADMIN",
				bannerImageUrls: [],
				cityId: cityId,
				countryId: "611a116fa2d3c765b9338dad",
				lat: location.latitude,
				lon: location.longitude,
				description: description,
				imageUrl: x.public_id,
				address: address,
			})
				.then((res) => {
					console.warn(res);
					setVisible(false);
					alert(
						"Neighbourhood request submited successfully,You will recive a notification once approved"
					);
					// showToast("Neighbourhood request submited successfully,you will be notify once admin will approve.");
					goBack();
				})
				.catch((err) => console.warn(err));
		}
	}

	return (
		<Fragment>
			{visible && <AppLoading visible={visible} />}
			<Formik
				initialValues={
					params?.item
						? {
								imageUrl: { uri: params?.item?.imageUrl },
								name: params?.item?.name,
								description: params?.item.description,
								location: {
									latitude: params.data.geoLocation.coordinates[0],
									longitude: params.data.geoLocation.coordinates[1],
									latitudeDelta: 0.001,
									longitudeDelta: 0.001,
								},
								city: JSON.stringify({}), //for dropdown
						  }
						: {
								location: {
									...location.location,
									latitudeDelta: 0.001,
									longitudeDelta: 0.001,
								},
								imageUrl: { uri: null },
								name: "",
								description: "",
								city: "",
						  }
				}
				enableReinitialize={true}
				onSubmit={(value) => submitData(value)}
				validate={(values) => {
					const { imageUrl, name, description, city, category, location } = values;
					const errors = {};

					if (!imageUrl.uri) {
						errors.imageUrl = "Please select image";
					}

					if (name.length === 0) {
						errors.name = "*Enter name";
					}
					if (description.length === 0) {
						errors.description = "*Enter description";
					}
					if (location.length === 0) {
						errors.location = "Please enter the address*";
					}
					// if (category.length === 0) {
					// 	errors.category = "Please select one category*";
					// }
					// if (city.length === 0) {
					// 	errors.city = "*Select City";
					// }
					return errors;
				}}
			>
				{({ values, errors, setFieldValue, setTouched, touched, submitForm }) => {
					return (
						<>
							{mediaModal && (
								<MediaModal
									aspectRatio={{ height: 3, width: 4 }}
									keepAspectRatio={true}
									closeMediaModal={() => setMediaModal(false)}
									open={mediaModal}
									onMediaFinish={(data) => {
										setFieldValue("imageUrl", { uri: data?.fileUri });
									}}
									video={false}
									base64={false}
									picker={false}
									statusbar={true}
								/>
							)}
							<ScrollView
								showsVerticalScrollIndicator={false}
								nestedScrollEnabled={true}
							>
								<View
									style={[styles.container, { backgroundColor: color?.gradientWhite }]}
								>
									<View style={styles.imgView}>
										{values.imageUrl?.uri && (
											<Entypo
												name="circle-with-cross"
												size={32}
												style={{
													color: "red",
													position: "absolute",
													right: -10,
													top: -10,
													zIndex: 1,
												}}
												onPress={() => {
													setFieldValue("imageUrl", {
														img: { uri: "" },
													});
												}}
												color={color?.black}
											/>
										)}

										{values.imageUrl?.uri ? (
											<Image
												source={{
													// uri: values.img?.uri,
													uri: values.imageUrl?.uri.includes("file:///")
														? values.imageUrl?.uri
														: cloudinaryFeedUrl(values.imageUrl.uri, "newImage"),
												}}
												style={{
													height: "100%",
													width: "100%",
													borderRadius: 8,
												}}
												resizeMode="contain"
											/>
										) : (
											<Entypo
												name="plus"
												size={35}
												color={color?.black}
												onPress={async () => {
													let x = Platform.select({
														android: async () => {
															const cameraPer = await checkPermission("CAMERA");
															const audioPer = await checkPermission("AUDIO");
															const storagePer = await checkPermission("STORAGE");
															if (
																cameraPer === "granted" &&
																audioPer === "granted" &&
																storagePer === "granted"
															) {
																return true;
															} else {
																Linking.openSettings();
																return false;
															}
														},
														ios: async () => {
															const cameraPer = await checkPermission("CAMERA");
															const audioPer = await checkPermission("AUDIO");
															const photoPer = await checkPermission("PHOTO");
															// const storagePer = await checkPermission("STORAGE");
															if (cameraPer != "granted") {
																openAppSetting(
																	"Banjee wants to access camera for sharing pictures"
																);
															}
															if (audioPer != "granted") {
																openAppSetting(
																	"Banjee wants to access microphone for recording videos"
																);
															}
															if (photoPer != "granted") {
																openAppSetting(
																	"Banjee wants to access photo for sharing save photos and videos"
																);
															}
															// if (storagePer != "granted") {
															// 	openAppSetting(
															// 		"Banjee wants to access storage for store photos and videos"
															// 	);
															// }
															return (
																cameraPer == "granted" &&
																audioPer == "granted" &&
																photoPer == "granted"
																// &&
																// storagePer == "granted"
															);
														},
													});
													let per = await x();
													if (per) {
														setMediaModal(true);
													}
												}}
											/>
										)}
									</View>

									<View style={{ alignSelf: "center", marginTop: 5 }}>
										{errors?.imageUrl && touched?.imageUrl && (
											<Text style={styles.error}>{errors?.imageUrl}</Text>
										)}
									</View>

									<View
										style={{
											flex: 1,
											paddingHorizontal: "5%",
										}}
									>
										{/* ``````````````````````````  NAME */}

										<Fragment>
											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
												>
													Name
												</Text>
												{errors?.name && touched?.name && (
													<Text style={styles.error}>{errors?.name}</Text>
												)}
											</View>

											<TextInput
												value={values.name}
												style={[
													styles.input,
													{
														borderColor: color?.grey,
														color: color?.black,
														backgroundColor: color?.lightWhite,
													},
												]}
												onBlur={setTouched}
												placeholder="Name"
												onChangeText={(text) => setFieldValue("name", text.trimStart())}
												placeholderTextColor={color?.grey}
											/>
										</Fragment>

										{/* ``````````````````````````````````````````  DESCRIPTION */}

										<Fragment>
											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{
														color: color?.black,
														paddingLeft: 5,
													}}
												>
													Description
												</Text>

												{errors?.description && touched?.description && (
													<Text style={styles.error}>{errors?.description}</Text>
												)}
											</View>

											<TextInput
												style={{
													height: 150,
													width: "100%",
													borderRadius: 8,
													padding: 10,
													textAlignVertical: "top",

													color: color?.black,
													fontSize: 16,
													borderColor: color?.grey,
													backgroundColor: color?.lightWhite,
												}}
												value={values.description}
												onBlur={setTouched}
												onChangeText={(text) =>
													setFieldValue("description", text.trimStart())
												}
												multiline={true}
												numberOfLines={4}
												placeholder="Description"
												placeholderTextColor={color?.grey}
											/>
										</Fragment>

										{/* ----------------- CITY------------ */}

										{/* <View style={styles.row}>
											<Text
												fontSize={16}
												fontWeight="medium"
												style={{ color: color?.black, paddingLeft: 5 }}
											>
												Select City
											</Text>

											{errors?.city && touched?.city && (
												<Text style={styles.error}>{errors?.city}</Text>
											)}
										</View> */}

										{/* {cityData?.length > 0 && (
											<DropDownPicker
												containerStyle={{
													width: "100%",
													height: 40,
													marginBottom: 10,
													zIndex: 999,
												}}
												setOpen={setOpenCity}
												arrowIconStyle={{ tintColor: color?.black }}
												items={cityData?.map((ele) => {
													return {
														label: ele.name,
														value: JSON.stringify({
															id: ele.stateId,
															name: ele.name,
														}),
													};
												})}
												dropDownContainerStyle={{
													borderWidth: 1,
													borderColor: color?.lightWhite,
													zIndex: 999,
													backgroundColor: color?.lightWhite,
												}}
												setValue={(data) => {
													let val = data();
													setFieldValue("city", val);
												}}
												style={{
													width: "100%",
													marginBottom: 10,
													borderRadius: 8,
													borderWidth: 1,
													borderColor: color?.lightWhite,
													backgroundColor: color?.lightWhite,
												}}
												open={openCity}
												value={values.city}
												showTickIcon={false}
												showArrowIcon={true}
												placeholderStyle={{ color: "grey" }}
												listItemLabelStyle={{ color: "grey" }}
												labelStyle={{ color: color?.black }}
												selectedItemLabelStyle={{ color: color?.black }}
												placeholder="Select your city"
											/>
										)} */}

										<View style={styles.row}>
											<Text
												fontSize={16}
												fontWeight="medium"
												style={{ color: color?.black, paddingLeft: 5 }}
											>
												Location
											</Text>

											{errors?.location && touched?.location && (
												<Text style={styles.error}>{errors?.location}</Text>
											)}
										</View>

										{/* <RBSheet
										customStyles={{
											container: {
												borderRadius: 10,
												backgroundColor: color.gradientWhite,
											},
										}}
										// height={420}
										height={470}
										ref={openCategoryRef}
										dragFromTopOnly={true}
										closeOnDragDown={true}
										closeOnPressMask={true}
										draggableIcon
									>
										<ScrollView
											showsVerticalScrollIndicator={false}
											style={{ zIndex: 1 }}
										>
											{category.map((ele, i) => (
												<TouchableWithoutFeedback
													key={i}
													onPress={() => {
														setFieldValue("category", { id: ele.id, name: ele.name }),
															openCategoryRef.current.close();
													}}
												>
													<View
														style={{
															marginVertical: 5,
															paddingLeft: 20,
															paddingVertical: 10,
															borderColor: color?.border,
															borderBottomWidth: 1,
														}}
													>
														{values?.category.id === ele.id ? (
															<View
																style={{
																	flexDirection: "row",
																	alignItems: "center",
																	width: "95%",
																	justifyContent: "space-between",
																}}
															>
																<Text
																	color={color.primary}
																	numberOfLines={1}
																	fontSize={16}
																>
																	{ele.name}
																</Text>
																<AntDesign
																	name="check"
																	size={24}
																	color={color?.primary}
																/>
															</View>
														) : (
															<Text
																fontSize={16}
																color={color?.black}
																numberOfLines={1}
															>
																{ele.name}
															</Text>
														)}
													</View>
												</TouchableWithoutFeedback>
											))}
										</ScrollView>
									</RBSheet> */}

										{/* ``````````````````````````````` CITY */}

										<SelectBuisnessLocation setAddress={setAddress} />

										<Fragment>
											{/* ``````````````` SUBMIT  */}

											<TouchableWithoutFeedback
												onPress={submitForm}
												disabled={visible}
											>
												<View
													style={[
														styles.txtView,
														{ backgroundColor: color.white, marginBottom: 20 },
													]}
												>
													<Text
														style={styles.txt}
														onPress={submitForm}
													>
														{params?.item ? "Update" : "Create"}
													</Text>
												</View>
											</TouchableWithoutFeedback>
										</Fragment>
									</View>
								</View>
							</ScrollView>
						</>
					);
				}}
			</Formik>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		// height: "100%",
		// width: "100%",
		flex: 1,
		height: Dimensions.get("screen").height,
	},
	imgView: {
		height: 100,
		width: 100,
		borderRadius: 8,
		borderColor: "lightgrey",
		borderWidth: 1,
		borderStyle: "dashed",
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	input: {
		height: 50,
		fontSize: 16,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		// borderWidth: 1,
		borderColor: color.grey,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 5,
		zIndex: -1,
	},
	error: {
		color: "red",
		fontStyle: "italic",
		fontSize: 14,
		marginLeft: 5,
	},
	txtView: {
		height: 40,
		alignSelf: "center",
		alignItems: "center",

		borderRadius: 20,
		marginTop: 10,
		justifyContent: "center",
		elevation: 5,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
	txt: {
		textAlign: "center",
		fontSize: 16,
		color: color.black,
		fontWeight: "400",
		paddingHorizontal: 20,
	},
});

export default CreateNeighbourhood;
