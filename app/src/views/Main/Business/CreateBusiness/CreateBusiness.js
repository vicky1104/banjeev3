import { Entypo } from "@expo/vector-icons";
import { Formik } from "formik";
import { Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import {
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import color from "../../../../constants/env/color";
import {
	cloudinaryFeedUrl,
	openAppSetting,
} from "../../../../utils/util-func/constantExport";
import SelectBuisnessLocation from "./SelectBuisnessLocation";
import UploadImage from "./UploadImage";

import { useNavigation, useRoute } from "@react-navigation/native";
import KeyboardView from "../../../../constants/components/KeyboardView";
import { showToast } from "../../../../constants/components/ShowToast";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { AppContext } from "../../../../Context/AppContext";
import {
	BusinessCategoryService,
	createBusinessService,
	updateBusinessService,
} from "../../../../helper/services/BusinessCategory";
import { listMyNeighbourhood } from "../../../../helper/services/ListOurNeighbourhood";
import {
	returnSource,
	uploadToCloudinaryFunc,
} from "../../../../utils/util-func/uploadToImage";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import { useScrollToTop } from "@react-navigation/native";
import { Platform } from "react-native";
import usePermission from "../../../../utils/hooks/usePermission";

function CreateBusiness(props) {
	const [open, setOpen] = useState(false);
	const [mediaModal, setMediaModal] = useState(false);
	const [mediaImages, setMediaImages] = useState(false);
	const [myNH, setMyNH] = useState([]);
	const [category, setCategory] = useState([]);
	const [openPublish, setOpenPublish] = useState(false);
	const [visible, setVisible] = useState(false);
	const { goBack, setOptions, navigate } = useNavigation();
	const { params } = useRoute();
	const { location } = useContext(AppContext);
	const { checkPermission } = usePermission();
	useLayoutEffect(
		useCallback(() => {
			setOptions({
				headerTintColor: color?.black,
			});
		}, [])
	);

	const apiCall = useCallback(async () => {
		listMyNeighbourhood()
			.then(async (res) => {
				setMyNH(res);
			})
			.catch((err) => console.warn(err)),
			BusinessCategoryService({
				categoryId: null,
				categoryName: null,
				description: null,
				name: null,
				type: "LOCALBUSINESS",
			})
				.then((res) => {
					setCategory(res.content);
				})
				.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		setOptions({
			headerTitle: params?.data?.id ? "Update Business" : "Create Business",
		});

		apiCall();
	}, [apiCall, params]);

	async function creteBusiness(values) {
		const {
			name,
			location: { latitude, longitude },
			description,
			category,
			address,
			publish,
		} = values;

		const { id: categoryId, name: categoryName } = JSON.parse(category);
		const { id: NHId, name: NHName } = JSON.parse(publish);

		let uploadLogo = async () => {
			setVisible(true);
			if (values?.logo?.uri.includes("file:///")) {
				let d = await uploadToCloudinaryFunc(
					returnSource(values.logo),
					"image",
					"business_images"
				);
				const newD = await d?.json();
				return await newD;
			} else {
				return { ...values.logo, public_id: values.logo.uri };
			}
		};

		Promise.all([
			await uploadLogo(),
			...(await values.img.map(async (ele, i) => {
				if (ele?.uri.includes("file:///")) {
					const d = await uploadToCloudinaryFunc(
						returnSource(ele),
						"image",
						"business_images"
					);
					const newD = await d?.json();
					return await newD;
				} else {
					return { ...ele, public_id: ele.uri };
				}
			})),
		]).then((val) => {
			// console.warn("val", val);
			if (params?.data) {
				let payload = {
					address: address,
					categoryId: categoryId,
					categoryName: categoryName,
					cloudId: NHId,
					cloudName: NHName,
					description: description,
					geoLocation: {
						type: "point",
						coordinates: [latitude, longitude],
					},
					id: params?.data.id,
					logoURL: val?.[0]?.public_id,
					imageUrls: val.slice(1, val.length).map((ele) => ele.public_id),
					name: name,
					sponsored: true,
				};
				setVisible(true);
				updateBusinessService(payload)
					.then((res) => {
						setVisible(false);
						navigate("UpdateBusiness", {
							businessId: res.id,
						});
					})
					.catch((err) => {
						setVisible(false);
						console.error(err);
					});
			} else {
				const payload = {
					name: name,
					description: description,
					logoURL: val?.[0]?.public_id,
					imageUrls: val.slice(1, val.length).map((ele) => ele.public_id),
					businessTiming: "1",
					geoLocation: {
						type: "point",
						coordinates: [latitude, longitude],
					},
					address: address,
					cloudId: NHId,
					cloudName: NHName,
					categoryId: categoryId,
					categoryName: categoryName,
				};
				setVisible(true);
				createBusinessService(payload)
					.then((res) => {
						setVisible(false);
						showToast("Thank you Our team will review and Approve your Business");
						goBack();
					})
					.catch((err) => {
						setVisible(false);
						console.error(err);
					});
			}
		});
	}
	const managePermissions = async (state) => {
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

				if (cameraPer != "granted") {
					openAppSetting("Banjee wants to access camera for sharing pictures");
				}
				if (audioPer != "granted") {
					openAppSetting("Banjee wants to access microphone for recording videos");
				}
				if (photoPer != "granted") {
					openAppSetting(
						"Banjee wants to access photo for sharing save photos and videos"
					);
				}

				return (
					cameraPer == "granted" && audioPer == "granted" && photoPer == "granted"
				);
			},
		});
		let per = await x();
		if (per) {
			setMediaModal(true);
			setMediaImages(state);
		}
	};
	return (
		<KeyboardView>
			{/* <LinearGradient
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				color={
					darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
				}
			> */}
			<AppLoading
				size="large"
				visible={visible}
			/>
			<Formik
				initialValues={
					params?.data
						? {
								logo: { uri: params.data.logoURL },
								publish: JSON.stringify({
									id: params.data.cloudId,
									name: params.data.cloudName,
								}),
								name: params?.data?.name,
								description: params?.data?.description,
								address: params?.data?.address,
								category: JSON.stringify({
									id: params.data.categoryId,
									name: params.data.categoryName,
								}),
								img: params.data.imageUrls.map((ele) => {
									return { uri: ele };
								}),
								location: {
									latitude: params.data.geoLocation.coordinates[0],
									longitude: params.data.geoLocation.coordinates[1],
									latitudeDelta: 0.001,
									longitudeDelta: 0.001,
								},
						  }
						: {
								logo: "",
								publish: "",
								name: "",
								description: "",
								address: "",
								category: "",
								img: [],
								location: {
									...location.location,
									latitudeDelta: 0.001,
									longitudeDelta: 0.001,
								},
						  }
				}
				validate={(values) => {
					const { name, description, address, category, img, location, publish } =
						values;

					let errors = {};
					if (name.length === 0) {
						errors.name = "Please enter name*";
					}

					if (description.length === 0) {
						errors.description = "Please enter the description*";
					}

					if (address.length === 0) {
						errors.address = "Please enter the address*";
					}

					if (category.length === 0) {
						errors.category = "Please select one category*";
					}
					if (publish.length === 0) {
						errors.publish = "Please select your neighbourhood*";
					}

					if (img.length === 0) {
						errors.img = "Please upload at least one image*";
					}
					if (location.length === 0) {
						errors.location = "Please select location*";
					}
					return errors;
				}}
				onSubmit={(values) => {
					creteBusiness(values);
				}}
			>
				{({ values, touched, setTouched, setFieldValue, submitForm, errors }) => {
					// console.warn("values", values);
					return (
						<>
							<Fragment>
								{mediaModal && (
									<MediaModal
										aspectRatio={{ height: 9, width: 9 }}
										keepAspectRatio={true}
										closeMediaModal={() => setMediaModal(false)}
										open={true}
										onMediaFinish={(data) => {
											if (mediaImages) {
												setFieldValue("img", [
													...values.img,
													{ ...data, uri: data?.fileUri },
												]);
											} else {
												setFieldValue("logo", { uri: data?.fileUri });
											}
										}}
										video={false}
										base64={false}
										picker={true}
									/>
								)}
								<View
									style={[styles.container, { backgroundColor: color?.gradientWhite }]}
								>
									<ScrollView
										showsVerticalScrollIndicator={false}
										keyboardDismissMode="on-drag"
									>
										{/* `````````````````````````````````````````````` NAME */}
										{/* <View> */}
										<View style={styles.imgView}>
											{values.logo?.uri && (
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
														setFieldValue("logo", {
															img: { uri: "" },
														});
													}}
													color={color?.black}
												/>
											)}

											{values.logo?.uri ? (
												<Image
													source={{
														// uri: values.img?.uri,
														uri: values.logo?.uri.includes("file:///")
															? values.logo?.uri
															: cloudinaryFeedUrl(values.logo.uri, "image"),
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
													onPress={() => managePermissions(false)}
												/>
											)}
										</View>

										{/* <UploadImage /> */}

										<View style={{ flex: 1, paddingHorizontal: "5%" }}>
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
												placeholderTextColor={"grey"}
												value={values.name}
												style={[
													styles.input,
													{ backgroundColor: color?.lightWhite, color: color?.black },
												]}
												onBlur={setTouched}
												placeholder="Name"
												onChangeText={(text) => setFieldValue("name", text.trimStart())}
											/>

											{/* ``````````````````````````````````````````  NEighbourhood */}

											<View style={[styles.row]}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
												>
													Neighbourhood
												</Text>
												{errors?.publish && touched?.publish && (
													<Text style={styles.error}>{errors?.publish}</Text>
												)}
											</View>

											<DropDownPicker
												textStyle={{ color: color.black }}
												listItemLabelStyle={{ color: "grey" }}
												selectedItemLabelStyle={{ color: color?.black }}
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
												containerStyle={{
													width: "100%",
													height: 40,
													marginBottom: 10,
													zIndex: 99,
												}}
												setOpen={setOpenPublish}
												dropDownContainerStyle={{
													borderWidth: 1,
													borderColor: color.lightWhite,
													zIndex: 999,
													backgroundColor: color?.lightWhite,
												}}
												placeholderStyle={{
													color: "grey",
												}}
												showTickIcon={false}
												showArrowIcon={true}
												setValue={(data) => {
													let val = data();
													// console.warn(val);
													setFieldValue("publish", val);
												}}
												style={{
													width: "100%",
													marginBottom: 10,
													borderWidth: 1,
													borderRadius: 8,
													borderColor: color.lightWhite,
													backgroundColor: color?.lightWhite,
												}}
												placeholder="Select your neighbourhood"
											/>

											{/* ``````````````````````````````````````````  CATEGORY */}

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

											<DropDownPicker
												textStyle={{ color: color.black }}
												listItemLabelStyle={{ color: "grey" }}
												selectedItemLabelStyle={{ color: color?.black }}
												open={open}
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
												containerStyle={{
													width: "100%",
													height: 40,
													marginBottom: 10,
													zIndex: 1,
												}}
												setOpen={setOpen}
												dropDownContainerStyle={{
													borderWidth: 1,
													borderColor: color?.lightWhite,
													backgroundColor: color?.lightWhite,
												}}
												placeholderStyle={{
													color: "grey",
												}}
												showTickIcon={false}
												showArrowIcon={true}
												setValue={(data) => {
													let val = data();
													// console.warn(val);
													setFieldValue("category", val);
												}}
												style={{
													width: "100%",
													marginBottom: 10,
													borderWidth: 1,
													borderRadius: 8,
													borderColor: color?.lightWhite,
													backgroundColor: color?.lightWhite,
												}}
												placeholder="Category"
											/>

											{/* ``````````````````````````````````````````  UPLOAD IMAGE */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
												>
													Upload Images
												</Text>

												{errors?.img && touched?.img && (
													<Text style={styles.error}>{errors?.img}</Text>
												)}
											</View>

											<UploadImage openMediaModal={() => managePermissions(true)} />

											{/* ``````````````````````````````````````````  DESCRIPTION */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
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
													backgroundColor: color?.lightWhite,
													textAlignVertical: "top",
													// borderWidth: 1,
													color: color?.black,
													borderColor: color.grey,

													fontSize: 16,
												}}
												placeholderTextColor="grey"
												value={values.description}
												onBlur={setTouched}
												onChangeText={(text) =>
													setFieldValue("description", text.trimStart())
												}
												multiline={true}
												numberOfLines={4}
												placeholder="Description"
											/>

											{/* ``````````````````````````````````````````  Address */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ color: color?.black, paddingLeft: 5 }}
												>
													Address
												</Text>
												{errors?.address && touched?.address && (
													<Text style={styles.error}>{errors?.address}</Text>
												)}
											</View>

											<TextInput
												style={{
													height: 70,
													width: "100%",
													borderRadius: 8,
													padding: 10,
													color: color?.black,

													backgroundColor: color?.lightWhite,
													textAlignVertical: "top",
													// borderWidth: 1,
													borderColor: color.grey,
												}}
												placeholderTextColor="grey"
												value={values.address}
												onBlur={setTouched}
												onChangeText={(text) => setFieldValue("address", text.trimStart())}
												multiline={true}
												numberOfLines={4}
												placeholder="Address"
											/>
										</View>

										<View style={{ paddingBottom: 20, paddingHorizontal: "5%" }}>
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

											<SelectBuisnessLocation setAddress={() => {}} />

											{!params?.data && (
												<Text
													style={{
														color: color?.black,
														textAlign: "center",
														zIndex: -1,
													}}
												>
													Once you create business, admin will verify your details and
													approve it.
												</Text>
											)}

											<TouchableWithoutFeedback
												onPress={submitForm}
												disabled={visible}
											>
												<View
													style={[styles.txtView, { backgroundColor: color?.lightWhite }]}
												>
													<Text
														style={styles.txt}
														onPress={submitForm}
													>
														{params?.data ? "Update" : "Create"}
													</Text>
												</View>
											</TouchableWithoutFeedback>
										</View>
									</ScrollView>
								</View>
							</Fragment>
						</>
					);
				}}
			</Formik>
			{/* </LinearGradient> */}
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
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

export default CreateBusiness;
