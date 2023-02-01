import * as ImagePicker from "expo-image-picker";
import React, { useContext } from "react";
import {
	BackHandler,
	Keyboard,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MediaPage } from "./MediaPage";
import { CameraPage } from "../../../../constants/components/MediaComponents/Camera/CameraPage";
import ImageEditerPage from "../../../../constants/components/MediaComponents/Camera/ImageEditerPage";
import usePermission from "../../../../utils/hooks/usePermission";

export default function MediaModal({
	compression,
	mediaModal,
	closeMediaModal,
	roomId,
}) {
	const [display, setDisplay] = React.useState("CAMERA");

	const [mediaState, setMediaState] = React.useState({
		media: false,
		type: false,
	});

	const { setOptions } = useNavigation();

	const getGallery = async () => {
		setDisplay("");
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: false,
			quality: compression ? 0.2 : 1,
		});

		console.log("image picker result------->", result);

		if (!result.cancelled) {
			setDisplay("MEDIA");
			setMediaState((prev) => ({
				...prev,
				media: {
					...result,
					fileUri: result?.uri,
					captured: false,
				},
				type: result?.type === "image" ? "photo" : "video",
			}));
		} else {
			setDisplay("CAMERA");
		}
	};

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
	// 		Linking.openSettings();
	// 	}
	// }, []);

	useFocusEffect(
		React.useCallback(
			() => {
				Keyboard.dismiss();
				// handlePermission();
				BackHandler.addEventListener("hardwareBackPress", async () => {
					if (mediaModal) {
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
					setOptions({ tabBarStyle: { display: "none" }, headerShown: true });
				};
			},
			[
				// handlePermission
			]
		)
	);

	return (
		<React.Fragment>
			<TouchableWithoutFeedback>
				<View
					style={{
						position: "absolute",
						height: "100%",
						width: "100%",
						zIndex: 99999,
						backgroundColor: "#000",
					}}
				>
					{display === "CAMERA" ? (
						<CameraPage
							closeMediaModal={closeMediaModal}
							setMediaState={setMediaState}
							getGallery={getGallery}
							video={true}
							displayCameraMedia={() => setDisplay("MEDIA")}
						/>
					) : display === "MEDIA" ? (
						<MediaPage
							closeMediaModal={closeMediaModal}
							setDisplay={setDisplay}
							mediaState={mediaState}
							setMediaState={setMediaState}
							roomId={roomId}
						/>
					) : display === "EDIT_IMAGE" ? (
						<ImageEditerPage
							keepAspectRatio={false}
							displayMedia={() => setDisplay("MEDIA")}
							mediaState={mediaState}
							setMediaState={setMediaState}
							displayFromEditor={() => setDisplay("MEDIA")}
						/>
					) : null}
				</View>
			</TouchableWithoutFeedback>
		</React.Fragment>
	);
}
