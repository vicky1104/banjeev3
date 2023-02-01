import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
	GiphyContentType,
	GiphyDialog,
	GiphyDialogEvent,
	GiphySDK,
} from "@giphy/react-native-sdk";
import { useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Avatar, Text } from "native-base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	Animated,
	Easing,
	FlatList,
	Image,
	Linking,
	Platform,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { RNS3 } from "react-native-aws3";
import RBSheet from "react-native-raw-bottom-sheet";
import Sound from "react-native-sound";
import { showToast } from "../../../../../constants/components/ShowToast";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import AppInput from "../../../../../constants/components/ui-component/AppInput";
import { AppContext } from "../../../../../Context/AppContext";
import SocketContext from "../../../../../Context/Socket";
import {
	listProfileUrl,
	openAppSetting,
} from "../../../../../utils/util-func/constantExport";
import { MainChatContext } from "../../MainChatContext";
import BottomAudioButton from "./BottomAudioButton";
import voiceChangerArray from "./voiceChangerArray";
import usePermission from "../../../../../utils/hooks/usePermission";
import color from "../../../../../constants/env/color";

GiphySDK.configure({
	apiKey: "BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8", // iOS SDK key
});
export default function BottomView({
	roomId,
	setLoading,
	closeMediaModal,
	openMediaModal,
	media,
	setMedia,
	videoUri,
	setImageUri,
	setVideoUri,
	allMembers,
}) {
	const { setChat, chatUser: receiver } = useContext(MainChatContext);
	const { socket } = useContext(SocketContext);
	const refRBSheet = React.useRef(null);
	const [height, setHeight] = React.useState(50);
	const { profile } = useContext(AppContext);
	const animation = React.useRef(new Animated.Value(0)).current;
	const [mention, setMention] = useState([]);
	const { checkPermission } = usePermission();

	const [recording, setRecording] = React.useState();
	const [recordingURI, setRecordingURI] = React.useState("");
	const [playIcon, setPlayIcon] = React.useState("play");
	const [text, setText] = useState("");
	const [status, setStatus] = React.useState(false);
	const [distMess, setDistMess] = React.useState(false);
	const [audio, setAudio] = React.useState();
	const [bottom, setBottom] = useState(false);
	const [mentionManager, setMentionManager] = useState({});
	const { params } = useRoute();

	const loadSound = useCallback(() => {
		if (recordingURI) {
			Sound.setCategory("Playback");
			var ding = new Sound(recordingURI, null, (error) => {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				}
			});
			ding.setVolume(1);
			setAudio(ding);
		}
	}, [recordingURI]);

	const playPause = () => {
		if (audio?.isPlaying()) {
			audio?.pause();
			setPlayIcon("play");
		} else {
			setPlayIcon("pause");
			audio?.play((success) => {
				if (success) {
					setPlayIcon("play");
				} else {
					setPlayIcon("play");
				}
			});
		}
	};

	const up = useCallback(() => {
		Animated.spring(animation, {
			toValue: 1,
			duration: 1200,
			easing: Easing.bounce,
			useNativeDriver: Platform.OS === "android",
		}).start(() => {
			loadSound();
		});
	}, [animation, loadSound]);

	const down = useCallback(() => {
		Animated.spring(animation, {
			toValue: 0,
			duration: 800,
			easing: Easing.bounce,
			useNativeDriver: Platform.OS === "android",
		}).start();
	}, [animation]);

	const isFocused = useIsFocused();

	useEffect(() => {
		if (recordingURI.length > 0) {
			up();
		} else {
			down();
		}
	}, [recordingURI, up, down]);

	useEffect(() => {
		const handler = (e) => {
			GiphyDialog.hide();
			if (bottom) {
				sendInChat(
					e.media.url.substring(31, 49),
					e.media.url.substring(31, 49),
					"image/gif"
				);
				setBottom(false);
			}
		};
		const listener = GiphyDialog.addListener(
			GiphyDialogEvent.MediaSelected,
			handler
		);
		if (!isFocused) {
			listener.remove();
		}
		return () => {
			listener.remove();
		};
	}, [bottom, isFocused]);

	const sendInChat = async (
		data,
		fileName,
		mimeType,
		selfDestructive,
		audioStatus
	) => {
		// setLoading(true);
		let content;
		let contentType;
		switch (mimeType) {
			case "image/gif":
				content = {
					base64Content: null,
					caption: profile?.systemUserId,
					height: 0,
					length: 0,
					mediaDesignType: 0,
					mimeType,
					src: data,
					sequenceNumber: 0,
					sizeInBytes: 0,
					title: fileName,
					width: 0,
				};
				break;
			case "plain/text":
				content = {
					base64Content: null,
					caption: profile?.systemUserId,
					height: 0,
					length: 0,
					mediaDesignType: 0,
					mimeType,
					src: data,
					sequenceNumber: 0,
					sizeInBytes: 0,
					title: fileName,
					width: 0,
				};
				break;

			default:
				content = {
					base64Content: data,
					caption: profile?.systemUserId,
					height: 0,
					length: 0,
					mediaDesignType: 0,
					mimeType,
					sequenceNumber: 0,
					sizeInBytes: 0,
					title: fileName,
					width: 0,
				};
				break;
		}
		const payloadData = {
			canDownload: false,
			content,
			mension: mentionManager,
			audioStatus: [{ time: 0, meter: 0 }],
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
			// recipient: user,
			// recipientId: user.id ? user.id : user.systemUserId,
		};

		if (mimeType === "plain/text") {
			setChat((pre) => [
				{
					...payloadData,
					key: Math.random(),
					isSender: profile.systemUserId === payloadData.senderId,
					loader: false,
				},
				...pre,
			]);
			socket.send(
				JSON.stringify({ action: "CREATE_CHAT_MESSAGE", data: payloadData })
			);
			setText("");
		} else if (mimeType === "image/gif") {
			const key = Math.random();
			await Image.getSize(
				`http://media1.giphy.com/media/${data}/giphy.gif`,
				(width, height) => {
					height = parseInt(height);
					width = parseInt(width);
					const srcHeight = (220 / width) * height;
					if (srcHeight) {
						setChat((pre) => [
							{
								...payloadData,
								content: { ...payloadData?.content, height: srcHeight },
								key: key,
								isSender: profile.systemUserId === payloadData.senderId,
								loader: false,
							},
							...pre,
						]);
					}
				}
			);
			socket.send(
				JSON.stringify({ action: "CREATE_CHAT_MESSAGE", data: payloadData })
			);
		} else {
			const key = Math.random();
			if (payloadData?.content?.mimeType === "image/jpg") {
				await Image.getSize(`data:image/png;base64,${data}`, (width, height) => {
					height = parseInt(height);
					width = parseInt(width);
					const srcHeight = (220 / width) * height;
					if (srcHeight) {
						setChat((pre) => [
							{
								...payloadData,
								content: { ...payloadData?.content, height: srcHeight },
								key: key,
								isSender: profile.systemUserId === payloadData.senderId,
								loader: true,
							},
							...pre,
						]);
					}
				});
			} else {
				setChat((pre) => [
					{
						...payloadData,
						content: {
							...payloadData?.content,
							src: recordingURI ? recordingURI : false,
						},
						key: key,
						isSender: profile.systemUserId === payloadData.senderId,
					},
					...pre,
				]);
			}
			if (payloadData?.content?.mimeType === "video/mp4") {
				const newS3Payload = {
					uri: media?.media?.file,
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
									base64Content: null,
									src: response.body.postResponse.location,
								},
							};
							socket.send(
								JSON.stringify({
									action: "CREATE_CHAT_MESSAGE",
									data: newPayload,
								})
							);
						} else {
							console.error(response);
						}
					})
					.catch((error) => console.error("s3 catch error", error));
			} else {
				axios
					.post(
						"https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/s3/upload",
						{
							payload: {
								base64: data,
								systemUserId: profile?.systemUserId,
							},
						}
					)
					.then((res) => {
						// console.log("s3 result ----->>>>", res.data.data);
						const newPayload = {
							...payloadData,
							isSender: profile.systemUserId === payloadData.senderId,
							content: {
								...payloadData.content,
								base64Content: null,
								src: res.data.data,
								loader: false,
							},
						};
						console.warn("socket payload -----", newPayload);
						socket.send(
							JSON.stringify({
								action: "CREATE_CHAT_MESSAGE",
								data: newPayload,
							})
						);
					})
					.catch((err) => console.error(err));
			}
		}

		setMentionManager({});
	};
	const sendAudio = async (selfDestructive) => {
		audio.pause();
		const fileName = recordingURI.split("/")[recordingURI.split("/").length - 1];
		let data = await FileSystem.readAsStringAsync(recordingURI, {
			encoding: FileSystem.EncodingType.Base64,
		});
		console.warn(fileName);
		sendInChat(data, fileName, "audio/x-wav", selfDestructive, status);
		setStatus(false);
		setRecordingURI("");
	};
	const sendImage = async (hideModal, selfDestructive) => {
		console.log("media?.media?.file---------data", media?.media?.file);
		const fileName =
			media?.media?.file.split("/")[media?.media?.file.split("/").length - 1];
		let data = await FileSystem.readAsStringAsync(media?.media?.file, {
			encoding: FileSystem.EncodingType.Base64,
		});
		sendInChat(data, fileName, "image/jpg", selfDestructive);
		hideModal();
	};
	const sendVideo = async (hideModal, selfDestructive) => {
		const fileName =
			videoUri.split("/")[media?.media?.file?.split("/").length - 1];
		let data = await FileSystem.readAsStringAsync(videoUri, {
			encoding: FileSystem.EncodingType.Base64,
		});
		sendInChat(data, fileName, "video/mp4", selfDestructive);
		hideModal();
	};

	const renderMembers = ({ item: ele }) => (
		<TouchableWithoutFeedback
			onPress={() => {
				setMentionManager((pre) => ({
					...pre,
					[`${ele?.profile?.firstName} ${ele?.profile?.lastName}`]: ele?.profile?.id,
				}));

				setText((pre) =>
					pre.replace(
						/@[a-z,A-Z]{0,100}$/,
						`@${ele?.profile?.firstName} ${ele?.profile?.lastName}`
					)
				);
				setMention([]);
			}}
		>
			<View
				key={Math.random()}
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					width: "100%",
					paddingHorizontal: 10,
					alignItems: "center",
					paddingVertical: 10,
				}}
			>
				<Avatar
					source={{
						uri: listProfileUrl(ele?.profile?.id),
					}}
				>
					{ele?.profile?.firstName?.[0]}
				</Avatar>
				<Text
					color={color?.black}
					pl={2}
				>
					{ele?.profile?.firstName} {ele?.profile?.lastName}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
	const handleOpenCamera = async () => {
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
			openMediaModal();
		}
	};

	return (
		<View
			style={{
				position: "absolute",
				bottom: 0,
				backgroundColor: color?.white,
				paddingVertical: 10,
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{params?.item?.group && mention.length > 0 && (
				<View style={{ width: "100%", height: 200 }}>
					<FlatList
						data={mention}
						renderItem={renderMembers}
					/>
				</View>
			)}
			{recordingURI.length === 0 ? (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
						alignItems: "center",
						justifyContent: "space-evenly",
						paddingHorizontal: 20,
					}}
				>
					<View
						style={{
							width: "74%",
							height: text ? (height <= 50 ? 50 : height) : 50,
							backgroundColor: color?.gradientWhite,
							// backgroundColor: color?.gradientBlack,
							borderRadius: 32,
							borderWidth: 0.5,
							maxHeight: 100,
							borderColor: color?.primary,
							display: "flex",
							flexDirection: "row",
							paddingLeft: 10,
							paddingRight: 15,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						{!status && (
							<>
								<MaterialCommunityIcons
									name="format-text-variant"
									size={24}
									color={color?.primary}
								/>

								<AppInput
									value={text}
									multiline={true}
									style={{
										// borderRadius: 20,
										height: height,
										maxHeight: 100,
										textAlignVertical: "center",
										// borderWidth: 1,
										minHeight: 50,

										width: "75%",
										color: color?.black,
										display: "flex",
										alignItems: "center",
										paddingBottom: 10,
										paddingLeft: 10,
										paddingRight: 5,
										paddingTop: Platform.OS === "ios" ? 15 : 10,
									}}
									autoCapitalize={"none"}
									maxLength={700}
									placeholder={"Send Message"}
									onChangeText={(e) => {
										if (params?.item?.group && /@[a-z,A-Z]{0,100}$/.test(e)) {
											let x = [...Object.keys(mentionManager), ...e.split("@")].reduce(
												(a, b) => (a !== b ? b : a),
												0
											);
											setMention(
												allMembers?.filter((ele) =>
													new RegExp(x).test(
														`${ele?.profile?.firstName} ${ele?.profile?.lastName}`
													)
												)
											);
										} else {
											setMention([]);
										}
										if (e.length <= 700) {
											setText(e);
										} else {
											showToast("the message is too large to send");
										}
									}}
									onContentSizeChange={(e) => {
										if (text.length === 0) {
											setHeight(40);
										} else {
											setHeight(e.nativeEvent.contentSize.height);
										}
									}}
								/>
							</>
						)}

						{text.length > 0 ? (
							<AppFabButton
								onPress={() => {
									sendInChat(text, text, "plain/text", false, []);
								}}
								size={25}
								icon={
									<MaterialCommunityIcons
										name="send"
										size={25}
										color={color?.primary}
									/>
								}
							/>
						) : (
							<BottomAudioButton
								setRecordingURI={setRecordingURI}
								status={status}
								setStatus={setStatus}
								recording={recording}
								setRecording={setRecording}
							/>
						)}
					</View>
					<View
						style={{
							backgroundColor: color?.gradientWhite,
							borderRadius: 32,
							marginLeft: 15,
							// borderWidth: 0.5,
							// borderColor: "white",
						}}
					>
						<AppFabButton
							onPress={() => {
								setBottom(true);
								GiphyDialog.configure({
									mediaTypeConfig: [
										GiphyContentType.Gif,
										GiphyContentType.Emoji,
										GiphyContentType.Sticker,
										GiphyContentType.Text,
									],
								});
								GiphyDialog.show();
							}}
							size={25}
							icon={
								<MaterialCommunityIcons
									name="file-gif-box"
									size={28}
									color={color?.primary}
								/>
							}
						/>
					</View>
					<View
						style={{
							backgroundColor: color?.gradientWhite,
							borderRadius: 32,
							marginLeft: 15,
						}}
					>
						<AppFabButton
							onPress={handleOpenCamera}
							size={25}
							icon={
								<MaterialCommunityIcons
									name="camera-outline"
									size={25}
									color={color?.primary}
								/>
							}
						/>
					</View>
				</View>
			) : (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flex: 1,
						width: "100%",
						alignItems: "center",
						justifyContent: "space-evenly",
					}}
				>
					<Animated.View
						style={{
							opacity: animation,
							transform: [
								{
									translateY: animation.interpolate({
										inputRange: [0, 1],
										outputRange: [70, 0],
									}),
								},
							],
						}}
					>
						<AppFabButton
							onPress={playPause}
							size={25}
							icon={
								<MaterialCommunityIcons
									name={playIcon}
									size={25}
									color={color?.primary}
								/>
							}
						/>
					</Animated.View>

					<Animated.View
						style={{
							opacity: animation,
							transform: [
								{
									translateY: animation.interpolate({
										inputRange: [0, 1],
										outputRange: [70, 0],
									}),
								},
							],
						}}
					>
						<AppFabButton
							onPress={async () => {
								setRecordingURI("");
								setStatus(false);
							}}
							size={25}
							icon={
								<MaterialCommunityIcons
									name={"delete"}
									size={25}
									color={color?.primary}
								/>
							}
						/>
					</Animated.View>
					<Animated.View
						style={{
							opacity: animation,
							transform: [
								{
									translateY: animation.interpolate({
										inputRange: [0, 0.5, 1],
										outputRange: [10, 60, 0],
									}),
								},
							],
						}}
					>
						<AppFabButton
							onPress={() => {
								setDistMess(false);
								sendAudio(false);
							}}
							size={25}
							icon={
								<MaterialCommunityIcons
									name="send"
									size={25}
									color={color?.primary}
								/>
							}
						/>
					</Animated.View>
					{/* <Animated.View
						style={{
							opacity: animation,
							transform: [
								{
									translateY: animation.interpolate({
										inputRange: [0, 0.5, 1],
										outputRange: [10, 40, 0],
									}),
								},
							],
						}}
					>
						<AppFabButton
							onPress={() => {
								setDistMess(true);
								sendAudio(false);
							}}
							size={25}
							icon={
								<MaterialCommunityIcons
									name="timer-outline"
									size={25}
									color={color?.primary}
								/>
							}
						/>
					</Animated.View> */}
				</View>
			)}
		</View>
	);
}
