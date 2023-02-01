import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { Radio, Text } from "native-base";
import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { showToast } from "../../../../constants/components/ShowToast";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { getCityService } from "../../../../helper/services/Auth";
import {
	CreateGroupService,
	UpdateGroupService,
} from "../../../../helper/services/CreateGroupService";
import {
	cloudinaryFeedUrl,
	openAppSetting,
} from "../../../../utils/util-func/constantExport";
import {
	returnSource,
	uploadToCloudinaryFunc,
} from "../../../../utils/util-func/uploadToImage";
import {
	BusinessCategoryService,
	createBusinessService,
} from "../../../../helper/services/BusinessCategory";
import RBSheet from "react-native-raw-bottom-sheet";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import { Platform } from "react-native";
import usePermission from "../../../../utils/hooks/usePermission";

function CreateGroup(props) {
	const [open, setOpen] = useState(false);
	const [mediaModal, setMediaModal] = useState(false);
	const [imageUri, setImageUri] = useState();
	const [visible, setVisible] = useState(true);
	const { params } = useRoute();
	const { setOptions, goBack } = useNavigation();
	const [category, setCategory] = useState([]);
	const openCategoryRef = useRef();
	const { checkPermission } = usePermission();
	useEffect(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "ROOMS",
		})
			.then((res) => {
				setCategory(res.content);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
		// getCityService({
		// 	cityId: "6308a522ea0553e25b9d0a1b",
		// })
		// 	.then((res) => {
		// 		setVisible(false), setCityData(res.content);
		// 	})
		// 	.catch((err) => console.warn(err));

		setOptions({
			headerTitle: params?.item ? "Update Community" : "Create Community",
		});
	}, [params]);

	async function submitData(values) {
		const { name, description, category, cloudType } = values;
		console.warn({
			...values,
			category,
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
						showToast("Community Successfully Updated");
						goBack();
					})
					.catch((err) => console.warn(err));
			}
		} else {
			let d = await uploadToCloudinaryFunc(
				returnSource(values.imageUrl),
				"image",
				"blog_image"
			);

			let x = await d.json();

			CreateGroupService({
				name: name,
				bannerImageUrls: [],
				description: description,
				categoryId: category?.id,
				categoryName: category?.name,
				imageUrl: x.public_id,
				cloudType: cloudType,
				// cityId: city.id,
				// countryId: "611a116fa2d3c765b9338dad",
				// lat: location.location.latitude,
				// lon: location.location.longitude,
				// address: location?.address.formatted_address,
			})
				.then((res) => {
					setVisible(false);
					showToast("Community Successfully Created");
					goBack();
				})
				.catch((err) => console.warn(err));
		}
	}
	return (
		<Fragment>
			{visible && <AppLoading visible={visible} />}
			<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
				<Formik
					initialValues={
						params?.item
							? {
									imageUrl: { uri: params?.item?.imageUrl },
									name: params?.item?.name,
									description: params?.item.description,
									// city: "",
									category: {
										id: params.item.categoryId,
										name: params.item.categoryName,
									},
									cloudType: params.item.cloudType,
							  }
							: {
									imageUrl: { uri: null },
									name: "",
									description: "",
									// city: "",
									category: "",
									cloudType: "PRIVATE",
							  }
					}
					enableReinitialize={true}
					onSubmit={(value) => submitData(value)}
					validate={(values) => {
						const { imageUrl, name, description, city, category } = values;
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
						if (category.length === 0) {
							errors.category = "Please select one category*";
						}
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
										aspectRatio={{ height: 9, width: 9 }}
										keepAspectRatio={true}
										compression={true}
										closeMediaModal={() => setMediaModal(false)}
										onMediaFinish={(data) => {
											setFieldValue("imageUrl", { uri: data?.fileUri });
										}}
										video={false}
										open={true}
										picker={true}
										statusbar={true}
									/>
								)}
								<ScrollView
									showsVerticalScrollIndicator={false}
									nestedScrollEnabled={true}
								>
									<View style={{ flex: 1, height: "100%" }}>
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
																	//  &&
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

										<View style={{ flex: 1, paddingHorizontal: "5%" }}>
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
													// keyboardType="numeric"
													returnKeyType="done"
													enablesReturnKeyAutomatically={true}
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

											{/* ------- Catgeory------------ */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
												>
													Category
												</Text>
												{errors?.category && touched?.category && (
													<Text style={styles.error}>{errors?.category}</Text>
												)}
											</View>

											<TouchableWithoutFeedback
												onPress={() => {
													openCategoryRef.current.open();
												}}
											>
												<View
													style={{
														height: 40,
														borderRadius: 8,
														// borderWidth: 1,
														backgroundColor: color?.lightWhite,
														borderColor: color.grey,
														justifyContent: "center",
														paddingLeft: 10,
													}}
												>
													<View
														style={{
															flexDirection: "row",
															alignItems: "center",
															justifyContent: "space-between",
															marginRight: 10,
														}}
													>
														{values?.category.name ? (
															<Text
																fontSize={14}
																color={color?.black}
															>
																{" "}
																{values?.category.name}
															</Text>
														) : (
															<Text
																fontSize={12}
																color={"grey"}
															>
																Select category
															</Text>
														)}
														<AntDesign
															name={"down"}
															size={16}
															color="grey"
														/>
													</View>
												</View>
											</TouchableWithoutFeedback>

											<RBSheet
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
											</RBSheet>

											<View style={{ marginTop: 15 }}>
												<Radio.Group
													value={values.cloudType}
													onChange={(nextValue) => {
														setFieldValue("cloudType", nextValue);
													}}
												>
													<View style={{ flexDirection: "row" }}>
														<Radio
															name="private"
															value="PRIVATE"
															isDisabled={params?.item ? true : false}
														>
															<Text color={color?.black}>Private</Text>
														</Radio>
														<View style={{ marginLeft: 15 }}>
															<Radio
																name="public"
																value="PUBLIC"
																isDisabled={params?.item ? true : false}
															>
																<Text color={color?.black}>Public</Text>
															</Radio>
														</View>
													</View>
												</Radio.Group>
											</View>

											{/* ``````````````````````````````` CITY */}

											<Fragment>
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
										</View>

										<DropDownPicker
											open={openCity}
											value={values.city}
											items={cityData.map((ele) => {
												return {
													label: ele.name,
													value: JSON.stringify({
														id: ele.stateId,
														name: ele.name,
													}),
												};
											})}
											containerStyle={{
												width: "100%",
												height: 40,
												marginBottom: 10,
												zIndex: 999,
											}}
											setOpen={setOpenCity}
											arrowIconStyle={{
												tintColor: color?.black,
											}}
											dropDownContainerStyle={{
												borderWidth: 1,
												borderColor: color?.grey,
												zIndex: 999,
												backgroundColor: color?.gradientWhite,
											}}
											showTickIcon={false}
											showArrowIcon={true}
											setValue={(data) => {
												let val = data();
												console.warn(val);
												setFieldValue("city", val);
											}}
											placeholderStyle={{
												color: color?.grey,
											}}
											listItemLabelStyle={{
												color: color?.subTitle,
											}}
											labelStyle={{
												color: color?.black,
											}}
											selectedItemLabelStyle={{
												color: color?.black,
											}}
											style={{
												width: "100%",
												marginBottom: 10,
												borderWidth: 1,
												borderRadius: 8,
												borderColor: color.grey,
												backgroundColor: color?.gradientWhite,
											}}
											placeholder="Select your city"
										/> */}
												{/* ``````````````` SUBMIT  */}

												<TouchableWithoutFeedback
													onPress={submitForm}
													disabled={visible}
												>
													<View
														style={[styles.txtView, { backgroundColor: color.lightWhite }]}
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
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		// paddingHorizontal: "5%",
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
		color: color.white,
		fontWeight: "400",
		paddingHorizontal: 20,
	},
});

export default CreateGroup;
