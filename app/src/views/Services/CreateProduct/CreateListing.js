import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { Checkbox, Text } from "native-base";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Linking } from "react-native";
import { Platform } from "react-native";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import KeyboardView from "../../../constants/components/KeyboardView";
import MediaModal from "../../../constants/components/MediaComponents/MediaModal";
import { showToast } from "../../../constants/components/ShowToast";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppInput from "../../../constants/components/ui-component/AppInput";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { BusinessCategoryService } from "../../../helper/services/BusinessCategory";
import {
	createClassifiedService,
	updateClassifiedService,
} from "../../../helper/services/Classifieds";
import { listMyNeighbourhood } from "../../../helper/services/ListOurNeighbourhood";
import usePermission from "../../../utils/hooks/usePermission";
import {
	cloudinaryFeedUrl,
	openAppSetting,
} from "../../../utils/util-func/constantExport";
import {
	returnSource,
	uploadToCloudinaryFunc,
} from "../../../utils/util-func/uploadToImage";

function CreateListing(props) {
	const [openPublish, setOpenPublish] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [selectedItem, setSelectedItem] = useState();
	const [openModal, setOpenModal] = useState(false);
	const [category, setCategory] = useState([]);
	const [myNH, setmyNH] = useState([]);
	const [mediaModal, setMediaModal] = useState(false);
	const { goBack } = useNavigation();
	const [visible, setVisible] = useState(false);
	const { params } = useRoute();
	const refRBSheet = useRef();
	const refRBSheet2 = useRef();
	const refRBSheet3 = useRef();
	const { checkPermission } = usePermission();
	const apicall = useCallback(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "BUYANDSELL",
		})
			.then((res) => {
				setCategory(res.content);
			})
			.catch((err) => console.warn(err));

		// listMyNeighbourhood()
		// 	.then((res) => {
		// 		setmyNH(res);
		// 	})
		// 	.catch((err) => console.warn(err));
	}, []);

	const { neighbourhood } = useContext(AppContext);
	useEffect(() => {
		apicall();
	}, [apicall]);

	async function createListings(values) {
		setVisible(true);
		const { id: categoryId, name: categoryName } = JSON.parse(values?.category);

		// const { id: cloudId, name: cloudName } = JSON.parse(values?.publish);

		let newD = { public_id: values.img.uri };

		if (values.img.uri.includes("file:///")) {
			let d = await uploadToCloudinaryFunc(
				returnSource(values.img),
				"image",
				"blog_image"
			);
			newD = await d?.json();
		}

		if (params?.item) {
			updateClassifiedService({
				active: true,
				categoryId: categoryId,
				categoryName: categoryName,
				// cloudId: cloudId,
				// cloudName: cloudName,
				cloudId: neighbourhood?.cloudId,
				cloudName: neighbourhood?.payload?.name,
				currency: "P",
				description: values.description,
				id: params.item.id,
				imageUrl: newD?.public_id,
				name: values.name,
				price: values.price,
				quantity: "",
				sold: true,
				free: values.free,
			})
				.then((res) => {
					goBack();
					showToast("Your product updated successfully.");
				})
				.catch((err) => {
					setVisible(false);
					console.warn(err);
				});
		} else {
			if (newD?.public_id) {
				createClassifiedService({
					categoryId: categoryId,
					categoryName: categoryName,
					cloudId: neighbourhood?.cloudId,
					cloudName: neighbourhood?.payload?.name,
					// cloudId: cloudId,
					// cloudName: cloudName,
					currency: "P",
					description: values.description,
					imageUrl: newD?.public_id,
					name: values.name,
					price: values.price,
					quantity: 1,
					free: values.free,
				})
					.then((res) => {
						setVisible(false);
						goBack();
						showToast("Your product listed successfully.");
					})
					.catch((err) => {
						setVisible(false);
						console.warn(err);
					});
			}
		}
	}

	return (
		<KeyboardView style={{ flex: 1, height: "100%" }}>
			<View
				style={[
					styles.container,
					{ backgroundColor: color?.gradientWhite, flex: 1, height: "100%" },
				]}
			>
				{/* <LinearGradient
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				color={
					darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
				}
			> */}
				{visible ? (
					<AppLoading visible={visible} />
				) : (
					<Formik
						enableReinitialize={true}
						validate={(values) => {
							const { publish, category, name, price, free, description, img } =
								values;

							const errors = {};
							// if (publish.length === 0) {
							// 	errors.publish = "This is require field*";
							// }
							if (category.length === 0) {
								errors.category = "Select Category*";
							}
							if (name.length === 0) {
								errors.name = "This is require field*";
							}
							if (price.length === 0 && !free) {
								errors.price = "Add price*";
							}
							if (description.length === 0) {
								errors.description = "Please add information product*";
							}
							if (img.length === 0) {
								errors.img = "Please add image*";
							}

							return errors;
						}}
						initialValues={
							params?.item
								? {
										// publish: JSON.stringify({
										// 	id: params?.item?.cloudId,
										// 	name: params?.item?.cloudName,
										// }),
										category: JSON.stringify({
											id: params?.item?.categoryId,
											name: params?.item?.categoryName,
										}),
										name: params.item.name,
										price: params.item.price,
										free: params.item.price ? true : false,
										description: params.item.description,

										img: { uri: params.item.imageUrl },
								  }
								: {
										// publish: "",
										category: "",
										name: "",
										price: "",
										free: false,
										description: "",
										img: [],
								  }
						}
						onSubmit={(values) => {
							createListings(values);
						}}
					>
						{({ values, touched, setTouched, setFieldValue, errors, submitForm }) => {
							return (
								<React.Fragment>
									{mediaModal && (
										<MediaModal
											aspectRatio={{ height: 9, width: 9 }}
											keepAspectRatio={true}
											closeMediaModal={() => setMediaModal(false)}
											open={true}
											onMediaFinish={(data) => {
												setFieldValue("img", { uri: data?.fileUri });
											}}
											video={false}
											base64={false}
											picker={true}
											statusbar={true}
										/>
									)}
									{/* <ScrollView
										keyboardDismissMode="on-drag"
										showsVerticalScrollIndicator={false}
									> */}
									<View style={{ flex: 1, height: Dimensions.get("screen").height }}>
										{/* <UploadImage /> */}

										<View
											style={{
												paddingHorizontal: "5%",
												marginTop: 10,
												flex: 1,
												height: "100%",
												zIndex: 99,
											}}
										>
											<View style={{ marginTop: 10, zIndex: 99 }}>
												{/* <DropDownPicker
														open={openPublish}
														value={values.publish}
														items={myNH?.map((ele) => {
															return {
																label: ele.payload.name,
																value: JSON.stringify({
																	id: ele.payload.id,
																	name: ele.payload.name,
																}),
															};
														})}
														arrowIconStyle={{
															tintColor: color?.black,
														}}
														containerStyle={{
															width: "100%",
															height: 40,
															marginBottom: 10,
															zIndex: 1,
														}}
														setOpen={setOpenPublish}
														dropDownContainerStyle={{
															borderWidth: 1,
															borderColor: color?.lightWhite,
															backgroundColor: color?.lightWhite,
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
														showTickIcon={false}
														showArrowIcon={true}
														setValue={(data) => {
															let val = data();
															setFieldValue("publish", val);
														}}
														style={{
															width: "100%",
															marginBottom: 10,
															// borderWidth: 1,
															borderRadius: 8,
															// borderColor: color?.grey,
															backgroundColor: color?.lightWhite,
															borderWidth: 1,
															borderColor: color?.lightWhite,
														}}
														placeholder="Where you want to publish"
													/> */}

												{/* <DropDown
													refRBSheet={refRBSheet}
													data={[
														"Resturant",
														"Parlour",
														"Cake shop",
														"Electrician",
														"Bakery",
													]}
													iosHeight={130}
													placeholder={"Where you want to publish"}
													setSelectedItem={(val) => {
														setFieldValue("publish", val);
													}}
													selectedItem={values.publish}
													openModal={openPublish}
													setOpenModal={setOpenPublish}
												/> */}
											</View>

											<View style={{ marginTop: 10, marginBottom: 10 }}>
												<DropDownPicker
													open={openCategory}
													value={values.category}
													items={category?.map((ele) => {
														return {
															label: ele.name,
															value: JSON.stringify({
																id: ele.id,
																name: ele.name,
															}),
														};
													})}
													arrowIconStyle={{
														tintColor: color?.black,
													}}
													containerStyle={{
														width: "100%",
														height: 40,
														marginBottom: 10,
														zIndex: 1,
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
													setOpen={setOpenCategory}
													dropDownContainerStyle={{
														borderWidth: 1,
														borderColor: color?.lightWhite,
														backgroundColor: color?.lightWhite,
													}}
													showTickIcon={false}
													showArrowIcon={true}
													setValue={(data) => {
														let val = data();
														setFieldValue("category", val);
													}}
													style={{
														width: "100%",
														marginBottom: 10,
														// borderWidth: 1,
														// borderColor: color?.grey,
														borderRadius: 8,
														backgroundColor: color?.lightWhite,
														borderWidth: 1,
														borderColor: color?.lightWhite,
													}}
													placeholder=" Select Category"
												/>

												{/* <DropDown
													refRBSheet={refRBSheet2}
													data={[
														"Resturant",
														"Parlour",
														"Cake shop",
														"Electrician",
														"Bakery",
													]}
													iosHeight={130}
													placeholder={"Select Category"}
													setSelectedItem={(val) => {
														setFieldValue("category", val);
													}}
													selectedItem={values.category}
													openModal={openCategory}
													setOpenModal={setOpenCategory}
												/> */}
											</View>

											<AppInput
												value={values.name}
												onChangeText={(e) => setFieldValue("name", e)}
												onBlur={setTouched}
												style={[
													styles.input,
													{
														borderColor: color?.grey,
														backgroundColor: color?.lightWhite,
														color: color?.black,
													},
												]}
												placeholder="Name"
												placeholderTextColor={color?.grey}
											/>

											{/* `````````````````````````````````` PRICE */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5 }}
													color={color?.black}
												>
													Price
												</Text>
												{errors?.price && touched?.price && (
													<Text style={styles.error}>{errors?.price}</Text>
												)}
											</View>

											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginTop: 10,
												}}
											>
												{/*```````````` `````````````````````` KSH */}

												{!values.free && (
													<View
														style={{
															width: "50%",
															height: 40,
															borderWidth: 1,
															borderRadius: 8,
															flexDirection: "row",
															alignItems: "center",

															borderColor: color?.lightWhite,
															marginRight: 30,
															backgroundColor: color?.gradientWhite,
														}}
													>
														<View
															style={{
																width: "50%",
																borderRightWidth: 1,
																height: 40,
																alignItems: "center",
																justifyContent: "center",
																zIndex: 3,

																borderColor: color?.lightWhite,
															}}
														>
															{/* <View
																style={{
																	marginTop: -10,
																	width: "100%",
																	zIndex: 99,
																	alignItems: "center",
																}}
															>
																<DropDown
																	refRBSheet={refRBSheet3}
																	data={["BWP", "USD"]}
																	iosHeight={130}
																	placeholder={"Price"}
																	setSelectedItem={setSelectedItem}
																	selectedItem={selectedItem}
																	openModal={openModal}
																	setOpenModal={setOpenModal}
																/>
															</View> */}
															<Text
																fontSize={16}
																fontWeight="bold"
																color={color?.black}
															>
																P
															</Text>
														</View>

														<View style={{ width: "50%" }}>
															<TextInput
																value={values.price}
																onBlur={setTouched}
																onChangeText={(e) => setFieldValue("price", e)}
																style={{
																	borderColor: color?.grey,
																	backgroundColor: color?.lightWhite,
																	color: color?.black,
																	fontSize: 20,
																	padding: 5,
																	borderBottomRightRadius: 8,
																	borderTopRightRadius: 8,
																}}
																keyboardType="number-pad"
															/>
														</View>
													</View>
												)}

												{/* `````````````````````` FREE */}

												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
													}}
												>
													<Checkbox
														// value={values.free}
														isChecked={values.free}
														size={"sm"}
														accessibilityLabel={"free"}
														onChange={() => setFieldValue("free", !values.free)}
													/>
													<Text
														style={{ marginLeft: 5 }}
														fontSize={16}
														color={color?.black}
													>
														Free
													</Text>
												</View>
											</View>

											{/* ``````````````````````````````` DESCRIPTION */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													color={color?.black}
													style={{ paddingLeft: 5 }}
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
													// borderWidth: 1,
													borderColor: color?.grey,
													fontSize: 16,
													backgroundColor: color?.lightWhite,
													color: color?.black,
												}}
												value={values.description}
												onBlur={setTouched}
												onChangeText={(text) => setFieldValue("description", text)}
												multiline={true}
												placeholderTextColor={color?.grey}
												numberOfLines={4}
												placeholder="Description"
											/>

											{/* ``````````````````````````````````` IMAGES  */}
											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5 }}
													color={color?.black}
												>
													Product Image
												</Text>
												{errors?.img && touched?.img && (
													<Text style={styles.error}>{errors?.img}</Text>
												)}
											</View>
											<View style={styles.imgView}>
												{values.img?.uri && (
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
															setFieldValue("img", {
																img: { uri: "" },
															});
														}}
														color="black"
													/>
												)}
												{values.img?.uri ? (
													<Image
														source={{
															// uri: values.img?.uri,
															uri: values.img?.uri.includes("file:///")
																? values.img?.uri
																: cloudinaryFeedUrl(values.img.uri, "image"),
														}}
														style={{
															height: "100%",
															width: "100%",
															borderRadius: 8,
														}}
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
										</View>

										{/* ``````````````````````````````SUBMIT */}

										<View
											style={{
												width: 80,
												alignSelf: "center",
												marginVertical: 20,
												borderRadius: 100,
												overflow: "hidden",
											}}
										>
											<AppButton
												disabled={visible}
												title={params?.item ? "Update" : "Create"}
												onPress={submitForm}
											/>
										</View>
									</View>
									{/* </ScrollView> */}
								</React.Fragment>
							);
						}}
					</Formik>
				)}
			</View>
			{/* </LinearGradient> */}
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, height: "100%", width: "100%" },
	input: {
		height: 50,
		width: "100%",
		fontSize: 16,
		borderRadius: 8,
		paddingLeft: 10,
		backgroundColor: "white",
		// borderWidth: 1,
		borderColor: color.grey,
		marginBottom: 5,
		zIndex: -2,
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
	imgView: {
		height: 100,
		width: 100,
		borderStyle: "dashed",
		borderRadius: 8,
		borderColor: "lightgrey",
		borderWidth: 1,
		// alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		padding: 4,
	},
});

export default CreateListing;
