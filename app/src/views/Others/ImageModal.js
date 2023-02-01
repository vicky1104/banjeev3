import * as ImagePicker from "expo-image-picker";
import { Text } from "native-base";
import React from "react";
import { Platform } from "react-native";
import {
	Linking,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import AppButton from "../../constants/components/ui-component/AppButton";
import OverlayDrawer from "../../constants/components/ui-component/OverlayDrawer";
import color from "../../constants/env/color";
import usePermission from "../../utils/hooks/usePermission";
import { openAppSetting } from "../../utils/util-func/constantExport";

function ImageModal({
	imageModal,
	showWholeData,
	imageModalHandler,
	imageUriHandler,
	alertImage,
	base64,
	blog,
	compression,
	ratio,
}) {
	const { checkPermission } = usePermission();
	const permissionRequest = async () => {
		const per = await checkPermission("CAMERA");

		console.log(per);

		if (per === "granted") {
			getCameraPermission();
		} else {
			if (Platform.OS === "android") {
				Linking.openSettings();
			} else {
				openAppSetting(
					"Banjee needs camera permission for capturing pictures and videos"
				);
			}
		}
	};

	const getCameraPermission = async () => {
		let result = await ImagePicker.launchCameraAsync({
			aspect: ratio,
			allowsEditing: ratio ? true : false,
			base64: base64,
			quality: compression ? 0.2 : 1,
		});

		if (!result.cancelled) {
			if (alertImage) {
				imageUriHandler((pre) => [
					...pre,
					{
						imageBase64: result.base64,
						name: result.uri.split("/")[result.uri.split("/").length - 1],
						uri: result.uri,
						type: result.type,
					},
				]);
			} else if (blog) {
				imageUriHandler(
					base64 ? result.base64 : showWholeData ? result : result.uri
				);
			} else {
				imageUriHandler(
					base64 ? result.base64 : showWholeData ? result : result.uri
				);
			}
		}
		imageModalHandler(false);
	};

	const getGallery = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: ratio,
			base64: base64,
			quality: compression ? 0.2 : 1,
		});

		if (!result.cancelled) {
			if (alertImage) {
				imageUriHandler((pre) => ({
					...pre,
					imageContent: {
						...pre.imageContent,
						imageBase64: result.base64,
						name: result.uri.split("/")[result.uri.split("/").length - 1],
						url: result.uri,
					},
				}));
			} else if (blog) {
				imageUriHandler(
					base64 ? result.base64 : showWholeData ? result : result.uri
				);
			} else {
				imageUriHandler(
					base64 ? result.base64 : showWholeData ? result : result.uri
				);
			}
		}
		imageModalHandler(false);
	};
	return (
		<React.Fragment>
			<OverlayDrawer
				transparent
				visible={imageModal}
				onClose={() => {
					imageModalHandler(false);
				}}
				closeOnTouchOutside
				animationType="fadeIn"
				containerStyle={{
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					padding: 0,
					height: "100%",
					width: "100%",
				}}
				childrenWrapperStyle={{
					width: 328,
					height: 269,
					alignSelf: "center",
					backgroundColor: color?.gradientWhite,
				}}
				animationDuration={100}
			>
				{(hideModal) => (
					<View style={styles.container}>
						<Text style={[styles.txt, { color: color?.black }]}>
							Please choose image from the source
						</Text>

						<View style={styles.imgView}>
							<TouchableWithoutFeedback
								onPress={() => {
									// imageModalHandler(false);
									getGallery();
								}}
							>
								<View style={styles.subImgView}>
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_gallary.png")}
										style={styles.img}
									/>
									<Text style={{ fontSize: 13, color: color?.black }}>Gallery</Text>
								</View>
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback
								onPress={() => {
									// imageModalHandler(false);
									// getCameraPermission();
									permissionRequest();
								}}
							>
								<View style={styles.subImgView}>
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_capture.png")}
										style={styles.img}
									/>
									<Text style={{ fontSize: 13, color: color?.black }}>Camera</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View style={{ width: "80%", alignSelf: "center", marginTop: 20 }}>
							<AppButton
								onPress={() => {
									imageModalHandler(false);
								}}
								title={"Cancel"}
							/>
						</View>
					</View>
				)}
			</OverlayDrawer>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: { flexDirection: "column" },
	txt: { width: 150, alignSelf: "center", textAlign: "center" },
	imgView: {
		flexDirection: "row",
		width: "80%",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: 20,
		alignSelf: "center",
	},
	subImgView: {
		flexDirection: "column",
		alignItems: "center",
	},
	img: {
		height: 70,
		width: 70,
		borderRadius: 3,
	},
});

export default ImageModal;
