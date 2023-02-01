import React, { useCallback, useContext, useMemo, useState } from "react";
import {
	StyleSheet,
	View,
	PermissionsAndroid,
	Platform,
	TouchableOpacity,
	Dimensions,
	Image,
} from "react-native";
import Video from "react-native-video";
import IonIcon from "react-native-vector-icons/Ionicons";
import { StatusBarBlurBackground } from "../../../../constants/components/MediaComponents/Camera/views/StatusBarBlurBackground";
import { useIsForeground } from "../../../../constants/components/MediaComponents/Camera/hooks/useIsForeground";
import { useIsFocused } from "@react-navigation/core";
import Constants from "expo-constants";
import {
	useCameraRoll,
	CameraRoll,
} from "@react-native-camera-roll/camera-roll";
import { MainChatContext } from "../MainChatContext";
import { AppContext } from "../../../../Context/AppContext";
import { RNS3 } from "react-native-aws3";
// import { Text } from "native-base";
// import * as FileSystem from "expo-file-system";
import SocketContext from "../../../../Context/Socket";
import FastImage from "react-native-fast-image";
import uuid from "react-native-uuid";
import RNFetchBlob from "rn-fetch-blob";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
// import {
// 	Image as ImageCompressor,
// 	Video as VideoCompressor,
// } from "react-native-compressor";

const requestSavePermission = async () => {
	if (Platform.OS !== "android") return true;

	const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
	if (permission == null) return false;
	let hasPermission = await PermissionsAndroid.check(permission);
	if (!hasPermission) {
		const permissionRequestResult = await PermissionsAndroid.request(permission);
		hasPermission = permissionRequestResult === "granted";
	}
	return hasPermission;
};

const isVideoOnLoadEvent = (event) =>
	"duration" in event && "naturalSize" in event;

export function MediaPage({
	closeMediaModal,
	mediaState,
	setMediaState,
	setDisplay,
	roomId,
}) {
	const {
		media,
		media: { fileUri },
		type,
	} = mediaState;

	const { profile } = useContext(AppContext);

	const socket = useContext(SocketContext).socket;

	const { setChat, chatUser: receiver } = useContext(MainChatContext);

	const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
	const [selfDestructive, setSelfDestructive] = useState(false);
	const [visible, setVisible] = useState(false);

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

	const sendInChat = async (fileUri, fileName, mimeType, audioStatus) => {
		console.warn("sendin chat");
		const uniqueId = uuid?.v4();
		const payloadData = {
			canDownload: false,
			content: {
				base64Content: null,
				src: fileUri,
				caption: uniqueId,
				height: 0,
				length: 0,
				mediaDesignType: 0,
				mimeType,
				sequenceNumber: 0,
				sizeInBytes: 0,
				title: fileName,
				width: 0,
			},
			audioStatus,
			destructiveAgeInSeconds: selfDestructive
				? audioStatus?.length > 0
					? audioStatus[audioStatus?.length - 1]?.time
					: 0
				: null,
			expired: false,
			expiryAgeInHours: 24,
			group: receiver?.group,
			groupName: receiver?.name,
			roomId,
			secret: false,
			selfDestructive: selfDestructive ? selfDestructive : false,
			sender: {
				age: 0,
				avtarImageUrl: profile?.avtarUrl,
				domain: "banjee",
				email: profile?.email,
				firstName: profile?.firstName,
				lastName: profile?.lastName,
				id: profile?.systemUserId,
				mobile: profile?.mobile,
				username: profile?.username,
			},
			senderId: profile?.systemUserId,
			receiver,
			receiverId: receiver.id ? receiver.id : receiver.systemUserId,
			recipientId: receiver.id ? receiver.id : receiver.systemUserId,
			recipient: receiver,
		};
		const key = Math.random();
		setChat((pre) => [
			{
				...payloadData,
				key: key,
				isSender: true,
				loader: false,
			},
			...pre,
		]);
		setVisible(false);
		// if (type === "photo") {
		// 	axios
		// 		.post(
		// 			"https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/s3/upload",
		// 			{
		// 				payload: {
		// 					base64: data,
		// 					systemUserId: profile?.systemUserId,
		// 				},
		// 			}
		// 		)
		// 		.then((res) => {
		// 			const newPayload = {
		// 				...payloadData,
		// 				isSender: profile.systemUserId === payloadData.senderId,
		// 				content: {
		// 					...payloadData.content,
		// 					base64Content: null,
		// 					src: res.data.data,
		// 				},
		// 			};
		// 			socket.send(
		// 				JSON.stringify({
		// 					action: "CREATE_CHAT_MESSAGE",
		// 					data: newPayload,
		// 				})
		// 			);
		// 		})
		// 		.catch((err) => console.error(err));
		// } else {
		const newS3Payload = {
			uri: fileUri,
			name: fileName,
			type: mimeType,
		};
		const options = {
			keyPrefix: `root/user-media/${profile.systemUserId}/`,
			bucket: "banjee",
			region: "eu-central-1",
			accessKeyId: "AKIAXSMSHJMTUQAPQEKO",
			accessKey: "AKIAXSMSHJMTUQAPQEKO",
			secretAccessKey: "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",
			secretKey: "LRjhu1pqGw9D6AHkExYzpWf4oJDTbOWLP6aacyP5",
			successActionStatus: 201,
			ACL: "public-read-write",
		};
		RNS3.put(newS3Payload, options)
			.then((response) => {
				if (response.status === 201) {
					const newPayload = {
						...payloadData,
						isSender: profile.systemUserId === payloadData.senderId,
						content: {
							...payloadData.content,
							src: response.body.postResponse.location,
						},
					};

					socket.send(
						JSON.stringify({
							action: "CREATE_CHAT_MESSAGE",
							data: newPayload,
						})
					);
					RNFetchBlob.config({
						// add this option that makes response data to be stored as a file,
						// this is much more performant.
						fileCache: true,
						path:
							RNFetchBlob.fs.dirs.CacheDir +
							`/BANJEE_${uniqueId}.${mimeType?.split("/")?.[1]}`,
					})
						.fetch("GET", response.body.postResponse.location, {})
						.then(async (res) => {
							// the temp file path

							console.log("The file saved to ", res.path());
							const blobPath = res.path();
							if (blobPath) {
								const config =
									mimeType?.split("/")?.[0] === "image"
										? {
												type: "photo",
												album: "Banjee Images",
										  }
										: {
												type: "video",
												album: "Banjee Videos",
										  };
								const saveResult = await CameraRoll.save(`file://${blobPath}`, config);
								console.warn("saveResult", saveResult);
							}
						});
				} else {
					console.error("s3 response", response);
				}
			})
			.catch((error) => console.error("s3 catch error", error));
		closeMediaModal();
		// }
	};

	const sendImage = async () => {
		setVisible(true);
		const fileName = fileUri.split("/")[fileUri.split("/").length - 1];
		console.warn("media", media);
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
					sendInChat(uri, fileName, "image/jpg");
				})
				.catch(() => alert("Image sent error"));
		});
		// ImageCompressor.compress(
		// 	fileUri,
		// 	{
		// 		compressionMethod: "auto",
		// 		input: "uri",
		// 		quality: 0.8,
		// 		output: "jpg",
		// 		returnableOutputType: "uri",
		// 	},
		// 	(progress) => {
		// 		// if (backgroundMode) {
		// 		console.log("Compression Progress: ", progress);
		// 		// } else {
		// 		// setCompressingProgress(progress);
		// 		// }
		// 	}
		// )
		// 	.then((result) => {
		// 		console.warn("result ------>>>>>", result);
		// 		if (result) {
		// 			let newFileUri;
		// 			if (result?.includes("file:///")) {
		// 				newFileUri = result;
		// 			} else if (result?.includes("file://")) {
		// 				let a = result?.split("file://")?.[1];
		// 				newFileUri = `file:///${a}`;
		// 			} else {
		// 				newFileUri = `file://${result}`;
		// 			}
		// sendInChat(newFileUri?.uri, fileName, "image/jpg");
		// 	}
		// })
		// .catch((err) => console.error(err));
	};

	const sendVideo = async () => {
		const fileName = fileUri.split("/")[fileUri?.split("/").length - 1];
		// VideoCompressor.compress(
		// 	fileUri,
		// 	{
		// 		compressionMethod: "auto",
		// 	},
		// 	(progress) => {
		// 		// if (backgroundMode) {
		// 		console.log("Compression Progress: ", progress);
		// 		// } else {
		// 		// setCompressingProgress(progress);
		// 		// }
		// 	}
		// )
		// 	.then((result) => {
		// 		console.warn("result ------>>>>>", result);
		// 		if (result) {
		// 			let newFileUri;
		// 			if (result?.includes("file:")) {
		// 				let a = result?.split("file://")?.[1];
		// 				console.warn("aaaaaaaaaaaa", a);
		// 				newFileUri = `file:///${a}`;
		// 			} else {
		// 				newFileUri = `file://${result}`;
		// 			}
		sendInChat(fileUri, fileName, "video/mp4");
		// 	}
		// })
		// .catch((err) => console.error(err));
	};

	// const [photos, getPhotos, save] = useCameraRoll();

	const onSavePressed = useCallback(async () => {
		console.warn("..................", type);
		// try {
		if (type === "photo") {
			sendImage();
		} else {
			sendVideo();
		}

		// console.log("Save media", fileUri, type);
		// const hasPermission = await requestSavePermission();
		// if (!hasPermission) {
		// 	Alert.alert(
		// 		"Permission denied!",
		// 		"Vision Camera does not have permission to save the media to your camera roll."
		// 	);
		// 	return;
		// }
		// CameraRoll.save(fileUri, {
		// 	type: type,
		// 	album: `Banjee ${type === "photo" ? "Images" : "Videos"}`,
		// })
		// 	.then((res) => {
		// 		setSavingState("saved");
		// 		goBack();
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
		// } catch (e) {
		// 	const message = e instanceof Error ? e.message : JSON.stringify(e);
		// 	setSavingState("none");
		// 	console.error(e);
		// 	Alert.alert(
		// 		"Failed to send!",
		// 		`An unexpected error occured while trying to save your ${type}. ${message}`
		// 	);
		// }
	}, [type]);

	const source = useMemo(() => ({ uri: fileUri }), [fileUri]);

	const screenStyle = useMemo(
		() => ({ opacity: hasMediaLoaded ? 1 : 0 }),
		[hasMediaLoaded]
	);

	return (
		<View style={[styles.container]}>
			{visible && <AppLoading visible={visible} />}
			{type === "photo" && (
				<FastImage
					source={source}
					// style={StyleSheet.absoluteFill}
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
				style={styles.closeButton}
				onPress={() => {
					setDisplay("CAMERA");
					setMediaState({
						media: false,
						type: false,
					});
				}}
			>
				<IonIcon
					name="close"
					size={35}
					color="white"
					style={styles.icon}
				/>
			</TouchableOpacity>

			{type === "photo" && (
				<View style={styles.manipulationSection}>
					<TouchableOpacity
						onPress={() => {
							setDisplay("EDIT_IMAGE");
						}}
					>
						<IonIcon
							name="crop"
							size={35}
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
				{/* <TouchableOpacity
					style={styles.selfDestructiveButton}
					onPress={() => setSelfDestructive(!selfDestructive)}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						{selfDestructive ? (
							<IonIcon
								name="checkmark-circle"
								size={30}
								color="white"
								style={styles.selfDestructiveIcon}
							/>
						) : (
							<IonIcon
								name="timer"
								size={30}
								color="white"
								style={styles.selfDestructiveIcon}
							/>
						)}
						<Text
							color="#FFF"
							fontWeight={700}
							ml={1}
						>
							Self Destructive
						</Text>
					</View>
				</TouchableOpacity> */}

				<TouchableOpacity
					style={styles.sendButton}
					onPress={onSavePressed}
				>
					<IonIcon
						name="send"
						size={25}
						color="white"
						style={styles.icon}
					/>
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
		top: 10 + Constants.statusBarHeight,
		left: 20,
		width: 40,
		height: 40,
	},
	manipulationSection: {
		zIndex: 50,
		position: "absolute",
		top: 10 + Constants.statusBarHeight,
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
