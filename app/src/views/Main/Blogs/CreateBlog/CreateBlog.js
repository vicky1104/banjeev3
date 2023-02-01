import { Entypo, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { Text } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import color from "../../../../constants/env/color";
import KeyboardView from "../../../../constants/components/KeyboardView";
import { showToast } from "../../../../constants/components/ShowToast";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import {
	createBlogApi,
	updateBlogApi,
} from "../../../../helper/services/Blogs";
import { BusinessCategoryService } from "../../../../helper/services/BusinessCategory";
import {
	cloudinaryFeedUrl,
	openAppSetting,
} from "../../../../utils/util-func/constantExport";
import {
	returnSource,
	uploadToCloudinaryFunc,
} from "../../../../utils/util-func/uploadToImage";
import Editor from "./Editor";
import RBSheet from "react-native-raw-bottom-sheet";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import usePermission from "../../../../utils/hooks/usePermission";
import { Linking } from "react-native";

function CreateBlog(props) {
	const [mediaModal, setMediaModal] = useState(false);
	const [mediaBase64, setMediaBase64] = useState(false);
	const [editorImageBase64Data, setEditorImageBase64Data] = useState(false);
	const [loader, setLoader] = useState(false);
	const { params } = useRoute();
	const { goBack, setOptions } = useNavigation();
	const [categoryData, setCategoryData] = useState([]);
	const openCategoryRef = useRef();
	const scrollRef = useRef(null);
	const { checkPermission } = usePermission();
	const apicall = useCallback(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "BLOG",
		})
			.then((res) => {
				setCategoryData(res.content);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		apicall();
		setOptions({
			headerTitle: params?.item?.id ? "Update Blog" : "Create Blog",
		});
	}, [apicall]);

	const createBlog = async (values) => {
		const { id: categoryId, name: categoryname } = values.category;

		setLoader(true);
		let newD = { public_id: values.bannerImageUrl.uri };
		if (values.bannerImageUrl.uri !== params?.item?.bannerImageUrl) {
			let d = await uploadToCloudinaryFunc(
				returnSource(values.bannerImageUrl),
				"image",
				"blog_image"
			);
			newD = await d?.json();
		}

		if (newD?.public_id) {
			if (params?.item) {
				updateBlogApi({
					...params?.item,
					...values,
					categoryId: categoryId,
					categoryName: categoryname,
					bannerImageUrl: newD?.public_id,
					blogType: "BLOG",
				})
					.then((res) => {
						setLoader(false);

						goBack();
						showToast("Blog successfully updated.");
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				createBlogApi({
					title: values.title,
					shortDescription: values.shortDescription,
					description: values.description,
					publishOnFeed: values.publishOnFeed,
					categoryId: categoryId,
					categoryName: categoryname,
					bannerImageUrl: newD?.public_id,
					blogType: "BLOG",
				})
					.then((res) => {
						setLoader(false);
						showToast("Blog Successfully Created");
						goBack();
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	};

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
			scrollRef.current.scrollTo(0);
			setMediaModal(true);

			setMediaBase64(state);
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
			<View
				style={[
					styles.container,
					{ backgroundColor: color?.gradientWhite, height: "100%" },
				]}
			>
				{loader && <AppLoading visible={loader} />}
				{/* ``````````````````````````````` FORM  */}

				<Formik
					initialValues={
						params?.item?.id
							? {
									...params?.item,
									category: {
										id: params?.item?.categoryId,
										name: params?.item?.categoryName,
									},
									bannerImageUrl: {
										uri: params?.item?.bannerImageUrl,
									},
							  }
							: {
									bannerImageUrl: { uri: null },
									title: "",
									shortDescription: "",
									description: "",
									publishOnFeed: false,
									category: "",
							  }
					}
					enableReinitialize={true}
					validate={(values) => {
						const { title, shortDescription, description, category, bannerImageUrl } =
							values;
						const errors = {};
						if (!bannerImageUrl.uri) {
							errors.bannerImageUrl = "Please select image";
						}
						if (title.length === 0) {
							errors.title = "Please enter title*";
						}
						if (description.length === 0) {
							errors.description = "Please write blog content*";
						}
						if (shortDescription.length === 0) {
							errors.shortDescription = "Description is required*";
						}
						if (category.length === 0) {
							errors.category = "Please select category*";
						}

						return errors;
					}}
					onSubmit={(x) => createBlog(x)}
				>
					{({
						errors,
						values: {
							bannerImageUrl,
							category,
							title,
							shortDescription,
							description,
							publishOnFeed,
						},
						submitForm,
						setFieldValue,
						touched,
						setTouched,
					}) => {
						return (
							<React.Fragment>
								{mediaModal && (
									<MediaModal
										aspectRatio={{ height: 3, width: 4 }}
										keepAspectRatio={true}
										compression={true}
										closeMediaModal={() => setMediaModal(false)}
										onMediaFinish={(data) => {
											if (mediaBase64) {
												setEditorImageBase64Data(data?.base64);
											} else {
												setFieldValue("bannerImageUrl", { uri: data?.fileUri });
											}
										}}
										video={false}
										open={true}
										base64={mediaBase64}
										picker={true}
									/>
								)}

								<ScrollView
									keyboardDismissMode="on-drag"
									scrollEnabled={!mediaModal}
									ref={scrollRef}
								>
									<View style={{ flex: 1 }}>
										<View>
											<View style={styles.imgView}>
												{bannerImageUrl?.uri && (
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
															setFieldValue("bannerImageUrl", {
																bannerImageUrl: { uri: "" },
															});
														}}
														color="black"
													/>
												)}

												{bannerImageUrl?.uri ? (
													<Image
														source={{
															uri: bannerImageUrl?.uri.includes("file:///")
																? bannerImageUrl?.uri
																: cloudinaryFeedUrl(bannerImageUrl.uri, "image"),
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
											<Text
												fontSize={16}
												color={color?.black}
												fontWeight="medium"
												alignSelf={"center"}
											>
												Banner Image
											</Text>

											<View style={{ alignSelf: "center", marginTop: 5 }}>
												{errors?.bannerImageUrl && touched?.bannerImageUrl && (
													<Text style={styles.error}>{errors?.bannerImageUrl}</Text>
												)}
											</View>
										</View>

										{/* `````````````````````````````````````````````` TITLE */}

										<View
											style={{
												// height: "100%",
												width: "90%",
												alignSelf: "center",
												paddingBottom: 20,
											}}
										>
											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5, color: color?.black }}
												>
													Category
												</Text>
												{errors?.category && touched?.category && (
													<Text style={styles.error}>{errors?.category}</Text>
												)}
											</View>

											<View>
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
															{category ? (
																<Text
																	fontSize={14}
																	color={color?.black}
																>
																	{" "}
																	{category.name}
																</Text>
															) : (
																<Text
																	fontSize={12}
																	opacity={70}
																	color={color?.black}
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
														{categoryData.map((ele, i) => (
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
																	{category.id === ele.id ? (
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
																			opacity={70}
																		>
																			{ele.name}
																		</Text>
																	)}
																</View>
															</TouchableWithoutFeedback>
														))}
													</ScrollView>
												</RBSheet>
											</View>

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5, color: color?.black }}
												>
													Title
												</Text>
												{errors?.title && touched?.title && (
													<Text style={styles.error}>{errors?.title}</Text>
												)}
											</View>

											<TextInput
												placeholderTextColor={"grey"}
												style={[
													styles.input,
													{
														backgroundColor: color?.lightWhite,
														color: color?.black,
														// color: color?.black,
													},
												]}
												onBlur={setTouched}
												value={title}
												placeholder="Title"
												onChangeText={(text) => setFieldValue("title", text.trimStart())}
											/>

											{/* ```````````````````````````````````````` SHORT DESCRIPTION */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5, color: color?.black }}
												>
													Short Description
												</Text>

												{errors?.shortDescription && touched?.shortDescription && (
													<Text style={styles.error}>{errors?.shortDescription}</Text>
												)}
											</View>

											<TextInput
												placeholderTextColor={"grey"}
												value={shortDescription}
												style={[
													styles.input,
													{
														backgroundColor: color?.lightWhite,
														color: color?.black,
													},
												]}
												onBlur={setTouched}
												placeholder="Short Description"
												onChangeText={(text) =>
													setFieldValue("shortDescription", text.trimStart())
												}
											/>

											{/* ``````````````````````````````````````````  DESCRIPTION */}

											<View style={styles.row}>
												<Text
													fontSize={16}
													fontWeight="medium"
													style={{ paddingLeft: 5, color: color?.black }}
												>
													Content
												</Text>
												{errors?.description && touched?.description && (
													<Text style={styles.error}>{errors?.description}</Text>
												)}
											</View>

											<Editor
												value={description}
												setFieldValue={(value) => {
													setFieldValue("description", value);
												}}
												openMediaModal={() => managePermissions(true)}
												editorImageBase64Data={editorImageBase64Data}
												setEditorImageBase64Data={setEditorImageBase64Data}
											/>

											{/* <View
										fontWeight="medium"
										style={{
											flexDirection: "row",
											marginTop: 20,
											alignItems: "center",
										}}
									>
										<Checkbox
											value={publishOnFeed}
											isChecked={publishOnFeed}
											accessibilityLabel="publishOnFeed"
											onChange={(isChecked) => {
												setFieldValue("publishOnFeed", isChecked);
											}}
										/>
										<Text
											style={{
												fontSize: 16,
												marginLeft: 5,
												color: color?.black,
											}}
										>
											Do you want to post this blog on feed?
										</Text>
									</View> */}

											<TouchableWithoutFeedback
												onPress={submitForm}
												disabled={loader}
											>
												<View
													style={[
														styles.txtView,
														{ backgroundColor: color.gradientBlack, marginBottom: 170 },
													]}
												>
													<Text
														onPress={submitForm}
														style={styles.txt}
													>
														{params?.item?.id ? "Update" : "Create"}
													</Text>
												</View>
											</TouchableWithoutFeedback>
										</View>
									</View>
								</ScrollView>
							</React.Fragment>
						);
					}}
				</Formik>
			</View>
			{/* </LinearGradient> */}
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, height: "100%" },
	imgView: {
		height: 100,
		width: 100,
		borderStyle: "dashed",
		borderRadius: 8,
		borderColor: "lightgrey",
		borderWidth: 1,
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		padding: 4,
	},
	input: {
		height: 40,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		// borderWidth: 1,
		borderColor: color.grey,
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
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 5,
	},
	error: {
		color: "red",
		fontStyle: "italic",
		fontSize: 14,
		marginLeft: 5,
	},
});

export default CreateBlog;
