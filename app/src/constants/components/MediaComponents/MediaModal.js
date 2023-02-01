import * as ImagePicker from "expo-image-picker";
import React, { useContext } from "react";
import {
	BackHandler,
	Dimensions,
	Keyboard,
	Linking,
	Platform,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { CameraPage } from "./Camera/CameraPage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MediaPage } from "./Camera/MediaPage";
import ImageEditerPage from "./Camera/ImageEditerPage";

export default function MediaModal({
	compression,
	open,
	closeMediaModal,
	onMediaFinish,
	video,
	aspectRatio,
	keepAspectRatio,
	base64,
	picker,
	statusbar,
}) {
	const [display, setDisplay] = React.useState(picker ? "" : "CAMERA");
	const [fromCamera, setFromCamera] = React.useState(false);
	const [mediaState, setMediaState] = React.useState({
		media: false,
		type: false,
	});

	const { setOptions } = useNavigation();

	const displayCamera = () => {
		setDisplay("CAMERA");
	};
	const displayCameraMedia = () => {
		if (keepAspectRatio && !video) {
			setFromCamera(true);
			setDisplay("EDITER");
		} else {
			setDisplay("MEDIA");
		}
	};
	const displayMedia = () => {
		setFromCamera(false);
		setDisplay("MEDIA");
	};
	const displayFromEditor = () => {
		if (fromCamera) {
			setDisplay("CAMERA");
		} else {
			setDisplay("MEDIA");
		}
	};
	const displayEditer = () => {
		setDisplay("EDITER");
	};

	const getGallery = React.useCallback(async () => {
		setDisplay("");
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: video
				? ImagePicker.MediaTypeOptions.All
				: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			// quality: 1,
		});

		if (!result.cancelled) {
			displayCameraMedia();
			const mimeType = `${result.type}/${
				result.uri.split(".")[result.uri.split(".").length - 1]
			}`;
			setMediaState((prev) => ({
				...prev,
				media: {
					...result,
					fileUri: result?.uri,
					mimeType: mimeType,
					captured: false,
				},
				type: result?.type === "image" ? "photo" : "video",
			}));
		} else {
			if (picker) {
				closeMediaModal();
			} else {
				displayCamera();
			}
		}
	}, [picker]);

	// const handlePermission = React.useCallback(async () => {
	// 	const cameraPer = await checkPermission("CAMERA");
	// 	const audioPer = await checkPermission("AUDIO");
	// 	const mediaPer = await checkPermission("MEDIA");
	// 	const writeStoragePer = await checkPermission("WRITE_STORAGE");
	// 	const storagePer = await checkPermission("STORAGE");

	// 	if (
	// 		cameraPer === "granted" &&
	// 		audioPer === "granted" &&
	// 		mediaPer === "granted" &&
	// 		storagePer === "granted"
	// 	) {
	// 		if (Platform.OS === "android" && writeStoragePer !== "granted") {
	// 			closeMediaModal();
	// 			Linking.openSettings();
	// 		} else {
	// 			setPermissions(true);
	// 		}
	// 	} else {
	// 		closeMediaModal();

	// 	}
	// }, []);

	useFocusEffect(
		React.useCallback(() => {
			Keyboard.dismiss();
			// handlePermission();
			if (picker) {
				getGallery();
			}
			BackHandler.addEventListener("hardwareBackPress", async () => {
				if (open) {
					if (display === "CAMERA") {
						closeMediaModal();
					} else if (display === "MEDIA") {
						setDisplay("CAMERA");
					} else if (display === "EDITER") {
						if (fromCamera) {
							if (picker) {
								closeMediaModal();
							} else {
								setDisplay("CAMERA");
							}
						} else {
							setDisplay("MEDIA");
						}
					}
					return true;
				}
				return false;
			});
			setOptions({ tabBarStyle: { display: "none" }, headerShown: false });
			return () => {
				setOptions({ tabBarStyle: { display: "block" }, headerShown: true });
			};
		}, [
			// handlePermission,
			picker,
		])
	);

	return (
		<React.Fragment>
			<TouchableWithoutFeedback>
				<View
					style={{
						position: "absolute",
						top: 0,
						flex: 1,
						// left: 0,
						height: "100%",
						width: "100%",
						zIndex: 999999,
						backgroundColor: "#000",
					}}
				>
					{display === "CAMERA" ? (
						<CameraPage
							closeMediaModal={closeMediaModal}
							setMediaState={setMediaState}
							getGallery={getGallery}
							video={video}
							displayCameraMedia={displayCameraMedia}
							statusbar={statusbar}
						/>
					) : display === "MEDIA" ? (
						<MediaPage
							closeMediaModal={closeMediaModal}
							mediaState={mediaState}
							base64={base64}
							setMediaState={setMediaState}
							onMediaFinish={onMediaFinish}
							displayCamera={displayCamera}
							displayEditer={displayEditer}
							statusbar={statusbar}
						/>
					) : display === "EDITER" ? (
						<ImageEditerPage
							mediaState={mediaState}
							displayFromEditor={displayFromEditor}
							setMediaState={setMediaState}
							aspectRatio={aspectRatio}
							keepAspectRatio={keepAspectRatio}
							fromCamera={fromCamera}
							displayMedia={displayMedia}
						/>
					) : null}
				</View>
			</TouchableWithoutFeedback>
		</React.Fragment>
	);
}
