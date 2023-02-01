import React, { useCallback, useMemo, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Dimensions,
	Image,
} from "react-native";
import Video from "react-native-video";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBarBlurBackground } from "./views/StatusBarBlurBackground";
import { useIsForeground } from "./hooks/useIsForeground";
import { useIsFocused } from "@react-navigation/core";
import Constants from "expo-constants";
import FastImage from "react-native-fast-image";
import { Text } from "native-base";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { showToast } from "../../ShowToast";
import AppLoading from "../../ui-component/AppLoading";

export function MediaPage({
	mediaState,
	setMediaState,
	displayCamera,
	displayEditer,
	onMediaFinish,
	closeMediaModal,
	base64,
	statusbar,
}) {
	const {
		media,
		media: { fileUri },
		type,
	} = mediaState;

	const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const isForeground = useIsForeground();

	const isScreenFocused = useIsFocused();

	const isVideoPaused = !isForeground || !isScreenFocused;

	const onMediaLoad = useCallback((event) => {
		// if (isVideoOnLoadEvent(event)) {
		// 	console.log(
		// 		`Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`
		// 	);
		// } else {
		// 	console.log(
		// 		`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`
		// 	);
		// }
	}, []);

	const onMediaLoadEnd = useCallback(() => {
		console.log("media has loaded.");
		setHasMediaLoaded(true);
	}, []);

	const onMediaLoadError = useCallback((error) => {
		console.log(`failed to load media: ${JSON.stringify(error)}`);
	}, []);

	const onSavePressed = useCallback(async () => {
		setLoading(true);
		const fileName = fileUri.split("/")[fileUri?.split("/").length - 1];
		if (type === "photo") {
			Image.getSize(fileUri, async (width, height) => {
				height = parseInt(height);
				width = parseInt(width);
				manipulateAsync(
					fileUri,
					[
						{
							resize: {
								height:
									height > 1800 ? height / 3 : height > 1100 ? height / 1.5 : height,
								width: height > 1800 ? width / 3 : height > 1100 ? width / 1.5 : width,
							},
						},
					],
					{
						compress: 0.8,
					}
				)
					.then(({ uri }) => {
						if (base64) {
							const fileName = uri.split("/")[uri?.split("/").length - 1];
							FileSystem.readAsStringAsync(uri, {
								encoding: FileSystem.EncodingType.Base64,
							})
								.then((base64Data) => {
									onMediaFinish({
										...media,
										type: "image",
										fileUri: uri,
										fileName: fileName,
										base64: base64Data,
									});
									setLoading(false);
									setTimeout(() => {
										closeMediaModal();
									}, 100);
								})
								.catch(() => {
									showToast("Error while converting image");
									setLoading(false);
								});
						} else {
							onMediaFinish({
								...media,
								type: "image",
								fileUri: uri,
								fileName: fileName,
							});
							setLoading(false);
							setTimeout(() => {
								closeMediaModal();
							}, 100);
						}
					})
					.catch((err) => {
						console.error(err);
						showToast("Image save error.");
						setLoading(false);
					});
			});
		} else {
			onMediaFinish({
				...media,
				type: "video",
				fileName: fileName,
			});
			setLoading(false);
			setTimeout(() => {
				closeMediaModal();
			}, 100);
		}
	}, [type]);

	const source = useMemo(() => ({ uri: fileUri }), [fileUri]);

	return (
		<View style={[styles.container]}>
			{loading && <AppLoading visible={loading} />}
			{type === "photo" && (
				<FastImage
					source={source}
					style={{ height: "80%", width: "100%" }}
					resizeMode="contain"
					onLoadEnd={onMediaLoadEnd}
					onLoad={onMediaLoad}
				/>
			)}
			{type === "video" && (
				<Video
					source={source}
					style={{ height: "80%", width: "100%" }}
					paused={isVideoPaused}
					resizeMode="contain"
					posterResizeMode="cover"
					allowsExternalPlayback={false}
					automaticallyWaitsToMinimizeStalling={false}
					disableFocus={true}
					repeat={true}
					useTextureView={false}
					controls={false}
					playWhenInactive={true}
					ignoreSilentSwitch="ignore"
					onReadyForDisplay={onMediaLoadEnd}
					onLoad={onMediaLoad}
					onError={onMediaLoadError}
				/>
			)}

			<TouchableOpacity
				style={[
					styles.closeButton,
					{
						top: statusbar ? 10 : Constants.statusBarHeight + 10,
					},
				]}
				onPress={() => {
					displayCamera();
					setMediaState({
						media: false,
						type: false,
					});
				}}
			>
				<MaterialCommunityIcons
					name="close"
					size={30}
					color="white"
					style={styles.icon}
				/>
			</TouchableOpacity>

			{type === "photo" && (
				<View
					style={[
						styles.manipulationSection,
						{
							top: statusbar ? 10 : Constants.statusBarHeight + 10,
						},
					]}
				>
					<TouchableOpacity
						onPress={() => {
							displayEditer();
						}}
					>
						<MaterialCommunityIcons
							name="crop-rotate"
							size={30}
							color="white"
							style={styles.icon}
						/>
					</TouchableOpacity>
				</View>
			)}

			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-end",
					position: "absolute",
					bottom: 20,
					width: "100%",
					paddingHorizontal: 20,
				}}
			>
				<TouchableOpacity
					style={styles.sendButton}
					onPress={onSavePressed}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text
							mr={1}
							fontSize={16}
							color={"white"}
						>
							Next
						</Text>
						<MaterialCommunityIcons
							name="arrow-right"
							size={20}
							color="white"
							style={styles.icon}
						/>
					</View>
				</TouchableOpacity>
			</View>

			<StatusBarBlurBackground />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000",
		height: Dimensions.get("screen").height,
		width: Dimensions.get("screen").width,
	},
	closeButton: {
		position: "absolute",
		zIndex: 50,
		left: 20,
		width: 40,
		height: 40,
	},
	manipulationSection: {
		zIndex: 50,
		position: "absolute",
		right: 20,
	},
	sendButton: {
		height: 45,
		width: 45,
		backgroundColor: "#000",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	selfDestructiveButton: {
		height: 45,
		backgroundColor: "#000",
		borderRadius: 25,
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	selfDestructiveIcon: {
		textShadowColor: "black",
		textShadowOffset: {
			height: 0,
			width: 0,
		},
		textShadowRadius: 1,
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
