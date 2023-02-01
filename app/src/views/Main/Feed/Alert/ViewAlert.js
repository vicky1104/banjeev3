import { Checkbox, Text } from "native-base";
import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
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
import {
	Entypo,
	EvilIcons,
	AntDesign,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { showToast } from "../../../../constants/components/ShowToast";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { createAlertService } from "../../../../helper/services/CreateAlertService";
import {
	alertIcons,
	openAppSetting,
} from "../../../../utils/util-func/constantExport";
import {
	returnSource,
	uploadToCloudinaryViaAxios,
} from "../../../../utils/util-func/uploadToImage";
import RecordAlertAudio from "./AlertComponents/RecordAlertAudio";
import { mapService } from "../../../../helper/services/SettingService";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import BottomAudioButton from "../../Contacts/ChatComponent/BottomView/BottomAudioButton";
import AudioTypes from "../ViewTypes/AudioTypes";
import AudioComp from "../../Contacts/ChatComponent/AudioComp";
import axios from "axios";
import { AppContext } from "../../../../Context/AppContext";
import usePermission from "../../../../utils/hooks/usePermission";
import CircularProgress from "react-native-circular-progress-indicator";
import { useHeaderHeight } from "@react-navigation/elements";

function ViewAlert(props) {
	const { params } = useRoute();
	const { navigate } = useNavigation();
	const audioRef = useRef().current;
	const [otherText, setOtherText] = useState("");
	const [imageUri, setImageUri] = useState([]);
	const [active, setActive] = useState();
	const [selectedNH, setSelectedNH] = useState(null);

	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");

	const [imageModal, setImageModal] = useState(false);
	const [showIdentity, setshowIdentity] = useState(false);
	const [audioUrl, setAudioUrl] = useState("");
	const [loader, setLoader] = useState(false);
	const [disable, setDisable] = useState(false);
	const [micIcon, setMicIcon] = useState("microphone");
	const [alertLoc, setAlertLoc] = useState(null);
	const [cityName, setCityName] = useState("");
	const { token } = useContext(AppContext);
	const [uploadProgress, setUploadProgress] = useState({
		y: {
			loaded: 0,
			total: 99999,
		},
	});
	const { checkPermission } = usePermission();
	const headerHeight = useHeaderHeight();
	// useEffect(() => {
	// 	// getOurLocation();
	// 	listMyNeighbourhood()
	// 		.then((res) => {
	// 			setData(() => res);
	// 		})
	// 		.catch((err) => {
	// 			console.error("listMyAllNeighbourhood", err);
	// 		});
	// }, []);

	useEffect(() => {
		if (params?.alertLocation?.longitude && params?.alertLocation?.latitude) {
			mapService(
				[params.alertLocation.longitude, params.alertLocation.latitude].reverse()
			)
				.then((res) => {
					let x = res.data.results.filter((ele, i) => ele.address_components[i]);
					let y = x.filter(
						(el, i) =>
							el.address_components[i].types[0] === "administrative_area_level_1" &&
							el.address_components[i].types[1] === "political"
					)[0];

					let newY = x.filter(
						(el, i) =>
							el.address_components[i].types[0] === "administrative_area_level_3" &&
							el.address_components[i].types[1] === "political"
					)[0];

					let newCity = y ? y : newY;

					let city = newCity.address_components.filter(
						(ele, i) =>
							ele.types[0] === "administrative_area_level_3" &&
							ele.types[1] === "political"
					)[0].long_name;

					console.warn(city, "citynamee");

					setCityName(city);

					setAlertLoc({
						address: res.data.results[0],
					});
				})
				.catch((err) => {
					console.warn(JSON.stringify(err));
				});
		}
	}, [params]);

	async function createAlert() {
		function localReturnSource() {
			const uri = audioUrl;
			const type = Platform.OS === "web" ? "audio/webm" : "audio/m4a";
			const name = audioUrl.split("/")[audioUrl.split("/").length - 1];

			let x = { uri, type, name, mimeType: type };

			return x;
		}

		let uploadAudio = async () => {
			if (audioUrl) {
				let d = await uploadToCloudinaryViaAxios(
					localReturnSource(),
					"video",
					"alert_preset",
					(res) => {
						setUploadProgress((pre) => ({
							...pre,
							audio: {
								loaded: res?.loaded,
								total: res?.total,
							},
						}));
					}
				);

				return d.public_id;
			}
		};

		let uploadImg = async () => {
			if (imageUri?.length > 0) {
				return imageUri.map(async (ele, i) => {
					if (ele.type === "image") {
						console.warn(ele.type, "type in image  ..");
						let d = await uploadToCloudinaryViaAxios(
							returnSource(ele),
							ele.type,
							"alert_preset",
							(res) => {
								setUploadProgress((pre) => ({
									...pre,
									[i]: {
										loaded: res?.loaded,
										total: res?.total,
									},
								}));
							}
						);
						return d.public_id;
					}
				});
			}
		};

		let uploadVideo = async () => {
			if (imageUri?.length > 0) {
				return imageUri.map(async (ele, i) => {
					if (ele.type === "video") {
						console.warn(ele.type, "type in video  ..");

						let d = await uploadToCloudinaryViaAxios(
							returnSource(ele),
							ele.type,
							"alert_preset",
							(res) => {
								setUploadProgress((pre) => ({
									...pre,
									[i]: {
										loaded: res?.loaded,
										total: res?.total,
									},
								}));
							}
						);
						console.warn(d, "dddddddddddd");
						return d.public_id;
					}
				});
			}
		};

		if (micIcon === "microphone") {
			setDisable(true);

			if (category && description.length > 0) {
				setLoader(true);

				async function img() {
					if (imageUri.length > 0) {
						let x = await Promise.all(await uploadImg());
						return x?.filter((ele) => ele);
					} else {
						[];
					}
				}

				async function video() {
					if (imageUri.length > 0) {
						let y = await Promise.all(await uploadVideo());
						return y?.filter((ele) => ele);
					} else {
						[];
					}
				}

				if (category === "Other" && otherText?.length === 0) {
					setLoader(false);
					setDisable(false);
					showToast("Please enter title");
				} else {
					let payload = {
						anonymous: showIdentity,
						audioSrc: await uploadAudio(),
						cityName: cityName,
						// cloudIds: [],
						// cloudIds: [selectedNH?.cloudId],
						description: description,
						eventCode: "NEW_ALERT",
						eventName: category === "Other" ? otherText : category,
						imageUrl: (await img()) ? await img() : [],
						videoUrl: (await video()) ? await video() : [],
						location: {
							coordinates: [
								params.alertLocation.longitude,
								params.alertLocation.latitude,
							],
							// coordinates: [location.longitude, location.latitude],
							type: "Point",
						},
						metaInfo: {
							address: alertLoc?.address?.formatted_address,
						},
						sendTo: "TO_NEARBY",
					};
					createAlertService(payload, (res) => {
						setUploadProgress((pre) => ({
							...pre,
							["y"]: {
								loaded: res?.loaded,
								total: res?.total,
							},
						}));
					})
						.then((res) => {
							setDisable(false);
							navigate("MyAlerts", { from: "form" });
							showToast("Alert created");
							setLoader(false);
							// goBack();
							setSelectedNH();
							setCategory();
							setshowIdentity();
							setDescription();
						})
						.catch((err) => {
							console.error(err);
							setDisable(false);
							setLoader(false);
							Alert.alert("Alert", err.message, [{ text: "Ok" }]);
						});
				}
			} else {
				setDisable(false);
				showToast("Add description and category.");
			}
		} else {
			showToast("Complete recording first..!");
		}
	}

	const onMediaFinish = (data) => {
		setImageUri((prev) => [
			...prev,
			{ ...data, uri: data.fileUri, id: Math.random() },
		]);
	};

	const managePermissions = async () => {
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
				// if (storagePer != "granted") {
				// 	openAppSetting(
				// 		"Banjee wants to access storage for store photos and videos"
				// 	);
				// }
				return (
					cameraPer == "granted" && audioPer == "granted" && photoPer == "granted"
					//  &&
					// storagePer == "granted"
				);
			},
		});
		let per = await x();
		if (per) {
			setImageModal(true);
		}
	};

	return (
		// <Formik initialValues={{ identity: false, description: '', audio: '' }}>
		// 	{({ values }) => {
		// 		return (
		<>
			{imageModal && (
				<View style={{ height: "100%", width: "100%" }}>
					<MediaModal
						video={true}
						openMediaModal={managePermissions}
						closeMediaModal={() => setImageModal(false)}
						open={imageModal}
						onMediaFinish={onMediaFinish}
						compression={true}
					/>
				</View>
			)}

			<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
				{/* {loader && <AppLoading visible={loader} />} */}
				{disable && (audioUrl.length > 0 || imageUri.length > 0) && (
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: Dimensions.get("screen").width,
							opacity: 0.9,
							zIndex: 9999,
							backgroundColor: "#000",
							height: Dimensions.get("screen").height - headerHeight,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CircularProgress
							value={Object.values(uploadProgress)
								.map((ele) => ele.loaded)
								.reduce((a, b) => a + b, 0)}
							radius={120}
							title={"Uploading..."}
							titleColor={"white"}
							titleStyle={{
								marginTop: -70,
							}}
							progressValueColor={"#ecf0f100"}
							activeStrokeColor={"rgb(251, 207, 232)"}
							activeStrokeSecondaryColor={"rgb(129, 140, 248)"}
							maxValue={Object.values(uploadProgress)
								.map((ele) => ele.total)
								.reduce((a, b) => a + b, 0)}
						/>
					</View>
				)}
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.iconView}>
						{alertIcons.map((ele, i) => {
							return (
								<TouchableWithoutFeedback
									key={i}
									onPress={() => {
										setActive(i), setCategory(ele.name);
									}}
								>
									<View
										style={[
											styles.icon,
											{
												backgroundColor: active === i ? color.white : color.grey,
												elevation: active === i ? 4 : 1,
											},
										]}
									>
										<Image
											source={ele.img}
											style={{
												height: 24,
												width: 24,
												tintColor: active === i ? color?.black : "black",
											}}
											resizeMode={"cover"}
										/>

										<Text
											color={active === i ? color?.black : "black"}
											fontSize={12}
											textAlign={"center"}
											numberOfLines={2}
										>
											{ele.name}
										</Text>
									</View>
								</TouchableWithoutFeedback>
							);
						})}
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginVertical: 10,
						}}
					>
						<Text
							fontSize={16}
							mr={4}
							color={color?.black}
						>
							Post anonymously
						</Text>
						<Checkbox
							size={"sm"}
							accessibilityLabel={"identity"}
							onChange={() => setshowIdentity(!showIdentity)}
						/>
					</View>

					{category === "Other" && (
						<View>
							<Text
								fontSize={16}
								fontWeight="medium"
								color={color?.black}
								mb={3}
							>
								Title
							</Text>

							<AppInput
								placeholderTextColor="grey"
								autoComplete="off"
								onChangeText={(e) => {
									setOtherText(e);
								}}
								placeholder="Title"
							/>
						</View>
					)}

					<View style={{ marginVertical: 10 }}>
						<Text
							fontSize={16}
							fontWeight="medium"
							color={color?.black}
						>
							Description
						</Text>

						<TextInput
							style={styles.input}
							onChangeText={(e) => setDescription(e)}
							multiline={true}
							numberOfLines={4}
							placeholder="Please write description about event"
							placeholderTextColor={color?.grey}
						/>

						{/* <RecordAlertAudio
							micIcon={micIcon}
							setMicIcon={setMicIcon}
							setAudioUrl={setAudioUrl}
							audioUrl={audioUrl}
						/> */}
						<View
							style={{
								display: "flex",
								marginVertical: 20,
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "row",
								width: Dimensions.get("screen").width,
							}}
						>
							{audioUrl.length > 0 ? (
								<AudioComp
									ref={audioRef}
									messId={null}
									status={null}
									isSender={true}
									chatContent={null}
									src={audioUrl}
									base64Content={null}
									selfDestructive={{
										selfDestructive: false,
										destructiveAgeInSeconds: 0,
									}}
								/>
							) : (
								<View
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										width: "95%",
									}}
								>
									<View
										style={{
											borderColor: color.border,
											borderWidth: 1,
											paddingHorizontal: 20,
											paddingVertical: 15,
											borderRadius: 50,
										}}
									>
										<BottomAudioButton
											setStatus={(e) => {}}
											setRecordingURI={(w) => {
												console.warn(w);
												setAudioUrl(w);
											}}
											recording={audioUrl}
											setRecording={(re) => {
												console.warn(re);
											}}
										/>
									</View>
								</View>
							)}
							{audioUrl.length > 0 && (
								<MaterialCommunityIcons
									name="delete"
									style={{ marginTop: 10, marginLeft: 30 }}
									size={25}
									color="white"
									onPress={() => {
										audioRef?.pause();
										setAudioUrl("");
									}}
								/>
							)}
						</View>
						{selectedNH?.name && (
							<View
								style={{
									display: "flex",
									marginTop: 10,
									flexDirection: "row",
									alignItems: "center",
									flexWrap: "wrap",
									position: "relative",
								}}
							>
								<Text
									key={Math.random()}
									style={{
										paddingVertical: 5,
										paddingLeft: 20,
										paddingRight: 40,
										borderWidth: 1,
										color: color?.black,
										borderRadius: 20,
										borderColor: color?.primary,
										margin: 5,
									}}
								>
									{selectedNH?.name}
								</Text>

								<EvilIcons
									name="close"
									size={24}
									color={color?.black}
									style={{ marginLeft: -40 }}
									onPress={() => setSelectedNH()}
								/>
							</View>
						)}

						<Fragment>
							<TouchableWithoutFeedback onPress={managePermissions}>
								<Text
									color={color?.black}
									mt={5}
								>
									Upload Media
									{imageUri.length > 5 && (
										<Text
											fontSize={12}
											fontStyle={"italic"}
										>
											( you can upload 5 images only. )
										</Text>
									)}
								</Text>
							</TouchableWithoutFeedback>

							<View
								style={{
									flexDirection: "row",
									width: "100%",
									marginVertical: 10,
									// alignSelf: "center",
									// justifyContent: "space-between",
								}}
							>
								{/* ```````````````````````````````````` Image */}

								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{imageUri &&
										imageUri.length > 0 &&
										imageUri?.map((ele, i) => (
											<View
												style={styles.imgView}
												key={i}
											>
												<Image
													source={{ uri: ele.uri }}
													style={{ height: "100%", width: "100%", borderRadius: 8 }}
												/>

												<Entypo
													name="circle-with-cross"
													size={28}
													style={{
														color: "red",
														position: "absolute",
														right: -10,
														top: -10,
														zIndex: 1,
													}}
													onPress={() =>
														setImageUri((prev) => prev.filter((el) => el.id !== ele.id))
													}
												/>

												{ele.type === "video" && (
													<AntDesign
														name="playcircleo"
														size={28}
														style={{
															color: "black",
															position: "absolute",
															right: 25,
															top: 25,
															zIndex: 1,
														}}
													/>
												)}
											</View>
										))}

									{imageUri.length < 5 && (
										<View style={styles.emptyView}>
											<Entypo
												name="plus"
												size={35}
												color={color?.black}
												onPress={managePermissions}
											/>
										</View>
									)}
								</ScrollView>
								{/* ```````````````````````````````````` Video */}

								{/* <View style={styles.imgView}>
							{videoUri ? (
								<Fragment>
									<Image
										source={require("../../../../../assets/EditDrawerIcon/mp4.png")}
										style={{ height: "100%", width: "100%" }}
									/>

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
										onPress={() => setVideoUri(null)}
									/>
								</Fragment>
							) : (
								<Fragment>
									<Entypo
										name="plus"
										size={35}
										color={color?.black}
										// onPress={() => setImageModal(true)}
										// onPress={() => rbsheet.current.open()}
										onPress={() => uploadVideo()}
									/>
									<Text color={color?.black}>Video</Text>
								</Fragment>
							)}
						</View> */}
							</View>
						</Fragment>

						{/* {selectedNH?.cloudId ? ( */}
						<View style={{ alignSelf: "center", width: 120, marginVertical: 10 }}>
							<AppButton
								disabled={disable}
								title={"Create Alert"}
								onPress={() => {
									// console.warn(category.length > 0, category);
									createAlert();
									// navigate('SelectNHAlert');
								}}
							/>
						</View>

						{/* ) : (
						<View style={{ alignSelf: "center", width: 200, marginVertical: 10 }}>
							<AppButton
								title={"Select Neighbourhood"}
								onPress={() => {
									refRBSheet?.current?.open(); // navigate('SelectNHAlert');
								}}
							/>
						</View>
					)} */}

						{/* <NeighbourhoodModal
						selectedNH={selectedNH}
						setSelectedNH={setSelectedNH}
						refRBSheet={refRBSheet}
						data={data}
					/> */}

						{/* ```````````````` select option audio or video */}

						{/* <RBSheet
						customStyles={{
							container: {
								borderRadius: 10,
								backgroundColor: color.drawerGrey,
							},
						}}
						height={200}
						ref={rbsheet}
						dragFromTopOnly={true}
						closeOnDragDown={true}
						closeOnPressMask={true}
						draggableIcon
					>
						<View
							style={{
								width: "70%",
								justifyContent: "space-between",
								flexDirection: "row",
								alignItems: "center",
								alignSelf: "center",
								paddingTop: 10,
							}}
						>
							<TouchableWithoutFeedback onPress={uploadVideo}>
								<View style={{ alignItems: "center" }}>
									<Image
										source={require("../../../../../assets/video.png")}
										style={{ height: 100, width: 100 }}
									/>
									<Text
										mt={3}
										fontSize={16}
										color={color.white}
									>
										Video
									</Text>
								</View>
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback
								onPress={() => {
									setImageModal(true);
									rbsheet.current.close();
								}}
							>
								<View style={{ alignItems: "center" }}>
									<Image
										source={require("../../../../../assets/camera.png")}
										style={{ height: 100, width: 100 }}
									/>

									<Text
										mt={3}
										fontSize={16}
										color={color.white}
									>
										Image
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</RBSheet> */}
					</View>
				</ScrollView>
			</View>
		</>
	);
	// }}
	// </Formik>
	// );
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: "2.5%" },
	iconView: {
		width: "100%",
		alignItems: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 10,
		justifyContent: "center",
	},
	icon: {
		height: Dimensions.get("screen").height / 10 - 2,
		// height: 80,
		width: 80,
		width: Dimensions.get("screen").height / 10 - 5,
		borderWidth: 1,
		borderColor: "lightgrey",
		shadowColor: "grey",
		shadowOffset: { height: 1, width: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 8,

		borderRadius: 10,
		margin: 5,
		alignItems: "center",
		justifyContent: "space-around",
		overflow: "hidden",
	},
	emptyView: {
		height: 80,
		width: 80,
		borderRadius: 8,
		marginRight: 20,
		borderColor: "lightgrey",
		borderWidth: 1,
		borderStyle: "dashed",
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		// overflow: "hidden",
	},
	input: {
		height: 70,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		backgroundColor: color?.lightWhite,
		textAlignVertical: "top",
		// borderWidth: 1,
		borderColor: color.border,
		marginTop: 10,
		color: color.black,
	},
	imgView: {
		height: 80,
		width: 80,
		borderRadius: 8,
		marginRight: 20,
		// borderColor: "lightgrey",
		// borderWidth: 1,
		// borderStyle: "dashed",
		// alignSelf: "center",
		// justifyContent: "center",
		// alignItems: "center",
		marginTop: 10,
		// overflow: "hidden",
	},
});

export default ViewAlert;
