import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import jwtDecode from "jwt-decode";
import React, { useContext, useEffect } from "react";
import { Linking } from "react-native";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import MediaModal from "../../../../constants/components/MediaComponents/MediaModal";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { listMyNeighbourhood } from "../../../../helper/services/ListOurNeighbourhood";
import { updateProfile } from "../../../../helper/services/SettingService";
import {
	getLocalStorage,
	setLocalStorage,
	setMyDefaultNeighbourhood,
} from "../../../../utils/Cache/TempStorage";
import usePermission from "../../../../utils/hooks/usePermission";
import {
	listProfileUrl,
	openAppSetting,
	profileUrl,
} from "../../../../utils/util-func/constantExport";

export default function UpdateAvatar({ navigation, route }) {
	const { navigate, dispatch: navDispatch, goBack } = useNavigation();
	const { params } = useRoute();
	const { profile, setUserData, setProfile, setToken } = useContext(AppContext);
	const [done, setDone] = React.useState(false);
	const [visible, setVisible] = React.useState(false);
	const [galleryImg, setGalleryImg] = React.useState();
	const [mediaModal, setMediaModal] = React.useState(false);
	const [userImg, setUserImg] = React.useState(params?.urlImage);
	const { checkPermission } = usePermission();
	const openAvatarGallery = () => {
		return navigate("PickAvatar");
	};

	const openGallery = async () => {
		setUserImg(null);
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			// allowsEditing: true,
			aspect: [4, 4],
			quality: 0.4,
		});
		if (!result.cancelled) {
			setGalleryImg(result);
		}
	};

	async function updateGalleryImage() {
		setVisible(true);
		console.warn({
			uri: galleryImg?.fileUri,
			type: galleryImg?.type,
			mimeType: galleryImg?.mimeType,
			name: galleryImg?.fileName,
		});

		const token = await getLocalStorage("token");

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + JSON.parse(token));
		myHeaders.append("Content-Type", "multipart/form-data");

		var formdata = new FormData();
		formdata.append("directoryId", "root");
		formdata.append("domain", "banjee");
		formdata.append("actionCode", "ACTION_UPLOAD_RESOURCE");
		formdata.append(
			"files",
			{
				uri: galleryImg?.fileUri,
				type: galleryImg?.mimeType,
				mimeType: galleryImg?.mimeType,
				name: galleryImg?.fileName,
			},
			"[PROXY]"
		);

		console.warn(JSON.stringify(formdata));

		var requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		setVisible(true);
		fetch(
			"https://gateway.banjee.org/services/media-service/api/resources/bulk",
			requestOptions
		)
			.then((response) => response.json())
			.then(async (result) => {
				updateUserImage(result.data[0].data.id);
			})
			.catch((error) => {
				setVisible(false);
				console.log("error", error);
			});
	}

	useEffect(() => {
		navigation.setOptions({
			headerTitle: params?.update
				? "Update Profile Picture"
				: "Select profile picture",
		});

		if (params?.urlImage) {
			setUserImg(params?.urlImage);
		}

		return () => {};
	}, [params]);

	const handleLogin = () => {
		axios
			.post(
				"https://gateway.banjee.org/services/system-service/oauth/token",
				`username=${profile?.mobile}&password=${params?.password}&domain=208991&accountType=0&grant_type=password&passwordType=password+`,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
					},
				}
			)
			.then(async (res) => {
				await setLocalStorage("token", res.data.access_token);
				setToken(res.data.access_token);
				const jwtToken = jwtDecode(res.data.access_token);
				setUserData(jwtToken);
				setVisible(false);
				navigate(params?.newScreen);
			})
			.catch((err) => {
				setVisible(false);
				console.warn("Login Error", JSON.stringify(err));
			});
	};

	const navigateTopScreen = async () => {
		if (params?.newScreen) {
			listMyNeighbourhood().then(async (res) => {
				if (res.length > 0) {
					await setMyDefaultNeighbourhood("neighbourhood", res?.[0]);

					// navDispatch(StackActions("Bottom"));
				} else {
					handleLogin();
				}
			});
		} else {
			goBack();
		}
	};

	const updateUserImage = async (imageData) => {
		console.warn("imageData", imageData);
		if (imageData) {
			let res = await Promise.all([
				await setLocalStorage("avtarUrl", imageData),
				await updateProfile({ ...profile, avtarUrl: imageData }),
			]);

			if (res.length > 0) {
				setProfile((pre) => ({ ...pre, avtarUrl: imageData }));

				await setLocalStorage("profile", res?.[1]);
				setVisible(false);
				setDone(true);
				navigateTopScreen();
			}
		}
	};

	const renderFastImage = (uri) => (
		<FastImage
			style={{
				aspectRatio: 1,
				width: "100%",
				alignSelf: "center",
			}}
			source={uri}
		/>
	);

	const renderImage = () => {
		if (userImg) {
			return renderFastImage({ uri: profileUrl(userImg) });
		} else if (galleryImg?.fileUri) {
			return renderFastImage({ uri: galleryImg?.fileUri });
		} else if (profile?.avtarUrl) {
			return renderFastImage({ uri: profileUrl(profile?.avtarUrl) });
		} else {
			return renderFastImage(
				require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")
			);
		}
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
					// &&
					// storagePer == "granted"
				);
			},
		});
		let per = await x();
		if (per) {
			setMediaModal(true);
			setUserImg(null);
		}
	};
	return (
		// <LinearGradient
		// 	style={{ flex: 1 }}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View
			style={{
				flex: 1,
				backgroundColor: color?.gradientWhite,
				height: "100%",
			}}
		>
			{mediaModal && (
				<MediaModal
					aspectRatio={{ height: 9, width: 9 }}
					keepAspectRatio={true}
					closeMediaModal={() => setMediaModal(false)}
					open={true}
					onMediaFinish={(result) => {
						setGalleryImg(result);
					}}
					video={false}
					base64={false}
					picker={false}
				/>
			)}
			{visible && <AppLoading visible={visible} />}
			<View style={styles.container}>
				{/* <Text
					style={{
						textAlign: "center",
						marginTop: 30,
						marginBottom: 30,
						color: color?.black,
					}}
				>
					There are some pre-defined Avatar for you. Please pick your favorite one
					from Gallery
				</Text> */}

				<View
					style={[
						{
							// borderWidth: 1,
							borderColor: color.white,
							// overflow: "hidden",
							position: "relative",
							alignItems: "center",
							justifyContent: "center",
							height: Dimensions.get("screen").width - 70,
							alignSelf: "center",
							aspectRatio: 1,
							marginTop: 20,
						},
						styles.shadow,
					]}
				>
					{(galleryImg?.fileUri || params?.urlImage) && (
						<View style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}>
							<Entypo
								name="circle-with-cross"
								size={40}
								color="red"
								onPress={() => {
									setDone(false);
									setUserImg(null);
									setGalleryImg(null);
								}}
							/>
						</View>
					)}
					{renderImage()}
				</View>

				{/* <Text
					style={{
						marginTop: 20,
						marginBottom: 20,
						alignSelf: "center",
						color: color?.black,
					}}
				>
					{profile?.username}
				</Text> */}

				<View
					style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}
				>
					{/* <AppButton
						onPress={openAvatarGallery}
						width={120}
						style={{ width: 120 }}
						title="Avatar"
					/> */}
					<AppButton
						onPress={managePermissions}
						// width={120}
						style={{ width: 220 }}
						title="Select Picture"
					/>
				</View>

				{!done && (galleryImg?.fileUri || params?.urlImage) && (
					<View style={{ marginTop: 20, width: 220, alignSelf: "center" }}>
						<AppButton
							onPress={() => {
								userImg ? updateUserImage(userImg) : updateGalleryImage();
							}}
							title={"Update Profile Picture"}
						/>
					</View>
				)}
			</View>
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: Dimensions.get("screen").width - 40,
		// width: "60%",
		alignSelf: "center",
	},
	shadow: {
		elevation: 3,
		shadowColor: "grey",
		shadowRadius: 1,
		shadowOpacity: 0.5,
		shadowOffset: {
			height: 1,
			width: 1,
		},
	},
});
