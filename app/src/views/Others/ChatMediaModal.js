import * as ImagePicker from "expo-image-picker";
import { Text } from "native-base";
import React, { useContext } from "react";
import {
	Linking,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { MainContext } from "../../../context/MainContext";
import AppButton from "../../constants/components/ui-component/AppButton";
import OverlayDrawer from "../../constants/components/ui-component/OverlayDrawer";
import usePermission from "../../utils/hooks/usePermission";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import color from "../../constants/env/color";
import { Platform } from "react-native";
import { openAppSetting } from "../../utils/util-func/constantExport";

function ChatMediaModal({
	imageModal,
	showWholeData,
	imageModalHandler,
	videoUriHandler,
	imageUriHandler,
	alertImage,
	base64,
	blog,
	compression,
	ratio,
}) {
	const [display, setDisplay] = React.useState("selectSource");
	const { checkPermission } = usePermission();

	const permissionRequest = async (mediaType) => {
		const per = await checkPermission("CAMERA");

		console.log(per);

		if (per === "granted") {
			getCameraPermission(mediaType);
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

	const getCameraPermission = async (mediaType) => {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions[mediaType],
			// aspect: [4, 3],
			// allowsEditing: true,
			base64: base64,
			quality: compression ? 0.2 : 1,
			allowsMultipleSelection: true,
		});
		imageModalHandler(false);

		if (!result.cancelled) {
			if (alertImage) {
				imageUriHandler((pre) => [
					...pre,
					{
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
				if (result.type === "video") {
					videoUriHandler(
						base64 ? result.base64 : showWholeData ? result : result.uri
					);
				} else {
					imageUriHandler(
						base64 ? result.base64 : showWholeData ? result : result.uri
					);
				}
			}
		}
	};

	const getGallery = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: ratio ? true : false,
			aspect: ratio,
			base64: base64,
			quality: compression ? 0.2 : 1,
		});
		console.log("image picker result------->", result);

		if (!result.cancelled) {
			if (alertImage) {
				imageUriHandler((pre) => [
					...pre,
					{
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
				if (result.type === "video") {
					videoUriHandler(
						base64 ? result.base64 : showWholeData ? result : result.uri
					);
				} else {
					imageUriHandler(
						base64 ? result.base64 : showWholeData ? result : result.uri
					);
				}
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
					alignSelf: "center",
					backgroundColor: color?.gradientWhite,
				}}
				animationDuration={100}
			>
				{(hideModal) => (
					<View style={styles.container}>
						<Text style={[styles.txt, { color: color?.black }]}>
							{display === "selectSource"
								? "Please choose source"
								: "Please choose media type"}
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
									permissionRequest("Images");
								}}
							>
								<View>
									<LinearGradient
										color={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
										style={{
											height: 56,
											width: 56,
											color: "#FFF",
											justifyContent: "center",
											alignItems: "center",
											borderRadius: 5,
										}}
									>
										<FastImage
											source={require("../../../assets/EditDrawerIcon/camera.png")}
											style={styles.imgCamera}
											tintColor="#FFF"
										/>
									</LinearGradient>
									<Text
										style={{
											fontSize: 13,
											color: color?.black,
											marginTop: 15,
											textAlign: "center",
										}}
									>
										Image
									</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback
								onPress={() => {
									// imageModalHandler(false);
									// getCameraPermission();
									permissionRequest("Videos");
								}}
							>
								<View>
									<LinearGradient
										color={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
										colors={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
										style={{
											height: 56,
											width: 56,
											color: "#FFF",
											justifyContent: "center",
											alignItems: "center",
											borderRadius: 5,
										}}
									>
										<FastImage
											source={require("../../../assets/EditDrawerIcon/video.png")}
											style={styles.imgCamera}
											tintColor="#FFF"
										/>
									</LinearGradient>
									<Text
										style={{
											fontSize: 13,
											color: color?.black,
											marginTop: 15,
											textAlign: "center",
										}}
									>
										Video
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>

						<AppButton
							onPress={() => {
								imageModalHandler(false);
							}}
							title={"Cancel"}
							style={{ width: "80%", alignSelf: "center", marginTop: 20 }}
						/>
					</View>
				)}
			</OverlayDrawer>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: { flexDirection: "column" },
	txt: { width: 200, alignSelf: "center", textAlign: "center" },
	imgView: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: 20,
		alignSelf: "center",
	},
	subImgView: {
		flexDirection: "column",
		alignItems: "center",
	},
	subIconView: {
		flexDirection: "column",
		alignItems: "center",
	},
	img: {
		height: 70,
		width: 70,
		borderRadius: 3,
	},
	imgCamera: {
		height: 45,
		// marginBottom: 10,
		width: 45,
		borderRadius: 3,
	},
});

export default ChatMediaModal;
