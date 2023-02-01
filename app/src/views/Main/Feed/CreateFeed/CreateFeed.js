import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Progress, Text } from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import {
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
import FastImage from "react-native-fast-image";
import { MainContext } from "../../../../../context/MainContext";
import { showToast } from "../../../../constants/components/ShowToast";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { postFeed } from "../../../../helper/services/PostFeed";
import {
	returnSource,
	uploadToCloudinaryViaAxios,
} from "../../../../utils/util-func/uploadToImage";
import music from "../../../../../assets/ringtones/createPost.wav";
import Sound from "react-native-sound";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import CarousalView from "../../../../constants/components/CarousalView/CarousalView";
import AudioComp from "../../Contacts/ChatComponent/AudioComp";
import { createRef } from "react";
import axios from "axios";
import { getLocalStorage } from "../../../../utils/Cache/TempStorage";
import CircularProgress from "react-native-circular-progress-indicator";
import { useHeaderHeight } from "@react-navigation/elements";
import usePermission from "../../../../utils/hooks/usePermission";
import { openAppSetting } from "../../../../utils/util-func/constantExport";

function CreateFeed(props) {
	const { navigate, goBack, setParams } = useNavigation();
	const { params } = useRoute();
	const { feedData, createFeedData, darkMode } = useContext(MainContext);
	const [apploading, setApploading] = useState(false);
	const [selectedNeighbourhood, setSelectedNeighbourhood] = useState(false);
	const [disable, setDisable] = useState(false);
	const [mediaModal, setMediaModal] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [uploadProgress, setUploadProgress] = useState({
		y: {
			loaded: 0,
			total: 99999,
		},
	});
	const audioRef = useRef().current;
	const audioRefs = useRef([]);
	let headerHeight = useHeaderHeight();

	const { checkPermission } = usePermission();

	useEffect(() => {
		if (params?.selectedNeighbourhood) {
			setSelectedNeighbourhood(params?.selectedNeighbourhood);
		}
	}, [params]);

	useEffect(() => {
		let x = feedData?.uploadContentData
			?.filter((ele, i) => ele?.type === "audio")
			?.map((ref, index) => (audioRefs.current[index] = createRef()));
	}, [feedData]);

	const { location, token } = useContext(AppContext);

	const onMediaFinish = async (result) => {
		if (result) {
			createFeedData((pre) => ({
				...pre,
				uploadContentData:
					pre?.uploadContentData?.length > 0
						? [
								...pre?.uploadContentData,
								{
									type: result?.type,
									uri: result?.fileUri,
									mediaAsset: result?.type === "image" ? "feed_image" : "feed_video",
									id: Math.random(),
								},
						  ]
						: [
								{
									type: result?.type,
									uri: result.fileUri,
									mediaAsset: result?.type === "image" ? "feed_image" : "feed_video",
									id: Math.random(),
								},
						  ],
			}));
		}
	};

	const uploadAudio = async () => {
		let media = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
		if (media?.type !== "cancel") {
			createFeedData((pre) => ({
				...pre,
				uploadContentData:
					pre.uploadContentData?.length > 0
						? [
								...pre.uploadContentData,
								{
									type: "audio",
									uri: media.uri,
									mediaAsset: "feed_audio",
									id: Math.random(),
								},
						  ]
						: [
								{
									type: "audio",
									uri: media.uri,
									mediaAsset: "feed_audio",
									id: Math.random(),
								},
						  ],
			}));
		}
	};

	const xdata = [
		{
			title: "Select Media",
			icon: require("../../../../../assets/EditDrawerIcon/ic_camera.png"),
			// icon: require("../../../../../assets/EditDrawerIcon/icons_gallery.png"),
			onPress: async () => {
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
						console.warn(
							cameraPer == "granted" && audioPer == "granted" && photoPer == "granted"
						);
						return (
							cameraPer == "granted" && audioPer == "granted" && photoPer == "granted"
						);
					},
				});
				let per = await x();
				if (per) {
					setMediaModal({ open: true });
				}
			},
		},
		{
			title: "Upload Audio",
			icon: require("../../../../../assets/EditDrawerIcon/music-file.png"),
			onPress: () => uploadAudio(),
		},
		{
			title: feedData?.locData?.locationName
				? feedData?.locData?.locationName
				: "Tag Location",
			icon: require("../../../../../assets/EditDrawerIcon/ic_location.png"),
			onPress: () => navigate("SearchLocation"),
		},
	];

	const reset_Post = () => {
		setDisable(false);
		createFeedData({ connection: "PUBLIC" });
	};

	const uploadToCloudinary = async () => {
		setDisable(true);
		if (selectedNeighbourhood || params?.groupId) {
			try {
				if (feedData?.uploadContentData?.length > 0 || feedData?.text?.length > 0) {
					if (
						feedData?.uploadContentData?.length <= 5 ||
						feedData?.text?.length > 0
					) {
						if (feedData?.uploadContentData?.length > 0) {
							let val = await Promise.all(
								await feedData?.uploadContentData?.map(async (ele, i) => {
									const d = await uploadToCloudinaryViaAxios(
										returnSource(ele),
										ele.type !== "image" ? "video" : ele.type,
										ele.mediaAsset,
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
									return d;
								})
							);
							if (val && val.length > 0) {
								submitPost(val);
							} else {
								setApploading(false);
							}
						} else {
							submitPost();
						}
					} else {
						showToast("You can upload maximum 5 post ");
						setDisable(false);
					}
				} else {
					setDisable(false);
					showToast("You cannot create empty post...!");
					setApploading(false);
				}

				setApploading(true);
			} catch (err) {
				setDisable(false);
				setApploading(false);
				console.warn(err);
				showToast("size of video is too large");
			}
		} else {
			setDisable(false);
			showToast("Please select where you want to post");
		}
	};

	const renderType = (type) => {
		switch (type) {
			case "feed_image":
				return "image/jpg";

			case "feed_video":
				return "video/mp4";

			case "feed_audio":
				return "audio/mp3";

			default:
				break;
		}
	};

	const playMusic = () => {
		Sound.setCategory("Playback");
		var ding = new Sound(music, (error) => {
			if (error) {
				console.log("failed to load the sound", error);
				return;
			} else {
				ding.play();
			}
		});
		ding.setVolume(1);
	};
	const submitPost = (responseResult) => {
		let payload = {
			point: {
				lon: location?.location?.longitude,
				lat: location?.location?.latitude,
			},

			locationId: feedData?.locData?.ourLoc?.longitude
				? `{longitude:${feedData?.locData?.ourLoc?.longitude} ,latitude:${feedData?.locData?.ourLoc?.latitude}, locationName:${feedData?.locData?.locationName}}`
				: null,
			mediaContent:
				responseResult?.length > 0
					? responseResult?.map((ele, i) => {
							return {
								type: renderType(ele.folder).split("/")[0],
								src: ele.public_id,
								mimeType: renderType(ele.folder),
							};
					  })
					: [],
			text: feedData?.text ? feedData?.text : null,
			pageId: params?.groupId ? params?.groupId : selectedNeighbourhood?.cloudId,
			pageName: params?.groupName
				? params?.groupName
				: selectedNeighbourhood?.name,
			visibility: "PUBLIC",
		};
		postFeed(payload, (res) => {
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
				showToast("Post Uploaded Successfully");
				playMusic();
				if (params?.groupId) {
					navigate("DetailGroup", { cloudId: params?.groupId, feedData: res });
				} else {
					navigate("Feed", { feedData: res });
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const renderTypeOfData = (ele, i) => {
		switch (ele.type) {
			case "audio":
				return (
					<View
						style={{
							marginRight: 10,
							height: 80,
							width: 80,
							borderRadius: 8,
							alignItems: "center",
							justifyContent: "center",
							borderWidth: 1,
							borderColor: color.border,
						}}
					>
						<View
							style={{
								padding: 2,
								borderWidth: 1,
								borderColor: color.black,
								borderRadius: 50,
							}}
						>
							<MaterialCommunityIcons
								name={"play"}
								size={35}
								color={color.black}
							/>
						</View>
					</View>
				);
			case "video":
				return (
					<View>
						<FastImage
							style={styles.postImg}
							source={{ uri: ele.uri }}
						/>
						<AntDesign
							style={{ position: "absolute", top: 25, left: 25 }}
							name={"playcircleo"}
							size={30}
							color={color?.black}
						/>
					</View>
				);
			default:
				return (
					<FastImage
						style={styles.postImg}
						source={{ uri: ele.uri }}
					/>
				);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{disable && feedData?.uploadContentData?.length > 0 && (
				<View
					style={{
						position: "absolute",
						top: 0,
						width: "100%",
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
				<View style={{ width: "95%", alignSelf: "center", paddingBottom: 20 }}>
					{params?.groupName ? (
						<View style={{ alignItems: "center" }}>
							<Text
								mt={2}
								numberOfLines={1}
								fontSize={16}
								fontWeight={"medium"}
								color={color?.black}
							>
								{params?.groupName}
							</Text>
						</View>
					) : (
						<TouchableWithoutFeedback onPress={() => navigate("PostType")}>
							<View
								style={{
									height: 40,
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
									borderWidth: 1,
									borderRadius: 8,
									borderColor: color?.border,
									flexDirection: "row",
									marginTop: 10,
								}}
							>
								<Text
									numberOfLines={1}
									fontSize={16}
									fontWeight={selectedNeighbourhood?.name ? "medium" : "normal"}
									color={!selectedNeighbourhood?.name ? color?.greyText : color?.black}
								>
									{selectedNeighbourhood?.name
										? selectedNeighbourhood?.name
										: "Where you want to post"}
								</Text>

								{!selectedNeighbourhood?.name && (
									<AntDesign
										name="down"
										size={16}
										color={color.greyText}
										style={{ marginLeft: 5 }}
									/>
								)}
							</View>
						</TouchableWithoutFeedback>
					)}

					<View style={{ marginTop: 10 }}>
						<TextInput
							height={156}
							value={feedData?.text}
							onChangeText={(e) =>
								createFeedData((pre) => ({ ...pre, text: e.trimStart() }))
							}
							style={[styles.tb, { borderColor: color?.border, color: color?.black }]}
							placeholderTextColor={color?.greyText}
							placeholder={"Write your feedback title...."}
							multiline={true}
							textAlignVertical={"top"}
						/>
					</View>
					<View
						style={{
							marginTop: 20,
							borderTopColor: color?.border,
							borderTopWidth: 1,
						}}
					>
						{xdata?.map((item, i) => (
							<TouchableWithoutFeedback
								key={i}
								onPress={() => {
									{
										item.onPress(), audioRef?.current?.pause();
									}
								}}
							>
								<View style={[styles.postView, { borderBottomColor: color?.border }]}>
									<Image
										source={item.icon}
										style={[
											styles.smallImg,
											{
												tintColor: color?.black,
											},
										]}
									/>
									<Text
										fontSize={16}
										flexWrap={"wrap"}
										style={{
											width: "90%",
											color: color.primary,
										}}
										onPress={() => item.onPress()}
									>
										{item.title === "Tag Location"
											? params?.locData
												? params?.locData?.formatted_address
												: item.title
											: item.title}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						))}
					</View>

					{/* ```````````````````````````` IMAGES */}

					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
					>
						{feedData?.uploadContentData?.length > 0 && (
							<View style={styles.postImgView}>
								{feedData?.uploadContentData?.map((ele, i) => {
									return (
										<TouchableWithoutFeedback
											key={i}
											onPress={() => {
												setModalVisible(true);
												setCurrentIndex(i);
											}}
										>
											<View style={{ position: "relative" }}>
												{!disable && (
													<View style={styles.mapView}>
														<AppFabButton
															onPress={() => {
																createFeedData((pre) => ({
																	...pre,
																	uploadContentData: [
																		...pre.uploadContentData.filter((el) => el.id !== ele?.id),
																	],
																}));
															}}
															size={15}
															icon={
																<Entypo
																	size={20}
																	name="cross"
																	color="red"
																/>
															}
														/>
													</View>
												)}
												{renderTypeOfData(ele, i)}
											</View>
										</TouchableWithoutFeedback>
									);
								})}
							</View>
						)}
					</ScrollView>

					{/* ``````````````````````````````` SUBMIT BUTTONS */}

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: 24,
							// marginTop: 24,
							width: 256,
							alignSelf: "center",
						}}
					>
						<AppButton
							disabled={disable}
							title={"Post now"}
							onPress={() => {
								uploadToCloudinary(feedData?.uploadContentData);
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
							style={{ width: 120 }}
						/>
						<AppBorderButton
							title={"Reset"}
							onPress={reset_Post}
							width={120}
						/>
					</View>
				</View>
				{/* {apploading && <AppLoading visible={apploading} />} */}
			</ScrollView>

			{mediaModal?.open && (
				<MediaModal
					aspectRatio={{ height: 9, width: 9 }}
					keepAspectRatio={true}
					closeMediaModal={() => setMediaModal(false)}
					open={true}
					onMediaFinish={onMediaFinish}
					video={true}
					base64={false}
					picker={mediaModal.picker}
				/>
			)}

			<CarousalView
				viewFeed={true}
				localUrl={true}
				currentIndex={currentIndex}
				item={feedData?.uploadContentData}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	tb: {
		padding: 15,
		lineHeight: 21,
		borderRadius: 6,
		borderWidth: 1,
	},
	postImgView: {
		height: 100,
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
		flexDirection: "row",
		paddingLeft: "5%",
		marginTop: 24,
	},
	mapView: {
		zIndex: 1,
		position: "absolute",
		right: 7,
		height: 20,
	},
	postImg: {
		marginRight: 10,
		height: 80,
		width: 80,
		borderRadius: 8,
	},
	radio: {
		flexDirection: "row",
		width: "70%",
		justifyContent: "space-between",
	},
	postView: {
		height: 48,
		flexDirection: "row",
		width: "100%",

		borderBottomWidth: 1,
		alignItems: "center",
	},
	smallImg: { height: 24, width: 24, marginRight: 16 },
});

export default CreateFeed;
