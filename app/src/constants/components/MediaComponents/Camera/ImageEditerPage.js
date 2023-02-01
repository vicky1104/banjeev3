import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	Image,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
// import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import FastImage from "react-native-fast-image";
import { CropView } from "react-native-image-crop-tools";
import { useNavigation } from "@react-navigation/native";
// import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// import ImageManipulator from "./imageEditor/ImageManipulator";
// import { ImageManipulator } from "expo-image-crop";
import { Text } from "native-base";

export default function ImageManipulatorComp({
	mediaState,
	setMediaState,
	displayFromEditor,
	aspectRatio,
	keepAspectRatio,
	displayMedia,
}) {
	const fileUri = mediaState?.media?.fileUri;
	console.log(fileUri);
	const [ready, setReady] = useState(false);
	const [image, setImage] = useState(null);

	useEffect(() => {
		setImage(fileUri);
		setReady(true);
	}, [fileUri]);

	// const _rotate90andFlip = async () => {
	// 	const manipResult = await manipulateAsync(image, [
	// 		{
	// 			crop: {
	// 				originX: 1,
	// 				originY: 1,
	// 				width: 500,
	// 				height: 500,
	// 			},
	// 		},
	// 	]);
	// 	console.warn(manipResult.uri);
	// 	setImage(manipResult.uri);
	// };

	const _renderImage = () => (
		<View style={styles.imageContainer}>
			<FastImage
				source={{ uri: image }}
				style={StyleSheet.absoluteFill}
				resizeMode="contain"
			/>
		</View>
	);
	const cropViewRef = useRef();

	const handleSave = () => {
		cropViewRef.current.saveImage(true, 50);
	};

	const handleRotate = () => {
		cropViewRef.current.rotateImage(true);
	};

	if (!image) return null;
	return (
		<View
			style={{
				height: "100%",
				width: "100%",
				flex: 1,
				backgroundColor: "#000",
				justifyContent: "center",
			}}
		>
			<CropView
				sourceUrl={image}
				style={{ height: "82%", width: "100%" }}
				ref={cropViewRef}
				onImageCrop={(res) => {
					setMediaState((prev) => ({
						...prev,
						media: { ...prev.media, ...res, fileUri: `file://${res.uri}` },
					}));
					displayMedia();
				}}
				keepAspectRatio={keepAspectRatio}
				aspectRatio={aspectRatio}
			/>
			<View
				style={{
					width: "100%",
					position: "absolute",
					bottom: 20,
					left: 0,
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={displayFromEditor}
				>
					<Text
						color="#FFF"
						fontWeight={700}
					>
						Cancel
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.rotateIcon}
					onPress={handleRotate}
				>
					<MaterialCommunityIcons
						name="rotate-left"
						size={35}
						color="white"
						style={styles.icon}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.saveButton}
					onPress={handleSave}
				>
					<Text
						color="#FFF"
						fontWeight={700}
					>
						Done
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000",
		height: "100%",
		width: "100%",
	},
	cancelButton: {
		height: 45,
		backgroundColor: "#000",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	saveButton: {
		height: 45,
		backgroundColor: "#000",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	rotateIcon: {
		height: 45,
		width: 45,
		backgroundColor: "#000",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		textShadowColor: "black",
		textShadowOffset: {
			height: 0,
			width: 0,
		},
		textShadowRadius: 1,
	},
});
