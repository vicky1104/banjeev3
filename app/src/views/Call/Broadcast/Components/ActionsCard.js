import {
	Entypo,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import SocketContext from "../../../../Context/Socket";

import { AppContext } from "../../../../Context/AppContext";
import BroadcastContext from "../Context";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import { setLocalStorage } from "../../../../utils/Cache/TempStorage";
import color from "../../../../constants/env/color";

function ActionsCard({ showActionbar, isHost, promoted }) {
	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const email = React.useContext(AppContext)?.profile?.email || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";

	const cloudId = React.useContext(BroadcastContext)?.cloudId || "";

	const localAudio = React.useContext(BroadcastContext)?.localAudio;
	const localVideo = React.useContext(BroadcastContext)?.localVideo;

	const { navigate } = useNavigation();

	const { socket } = React.useContext(SocketContext);
	const { setRaiseHand, setEmoji, setLocalAudio, setLocalVideo } =
		React.useContext(BroadcastContext);

	// const raiseHand = React.useContext(BroadcastContext)?.raiseHand || [];
	// const emoji = React.useContext(BroadcastContext)?.emoji || [];
	const feedback = React.useContext(BroadcastContext)?.feedback || [];

	// const refRBSheet = React.useRef(null);
	const emojiSheet = React.useRef(null);
	const scrollViewRef = React.useRef(null);

	const [emojiData, setEmojiData] = React.useState([]);
	const [offset, setOffset] = React.useState(0);

	const muteLocalVideoStreamFun = async (props) => {
		await _rtcEngine?.muteLocalVideoStream(props);
		// await _rtcEngine?.enableLocalVideo(!props);
	};

	const videoMuteUnmuteFun = () => {
		setLocalVideo(!localVideo);
		muteLocalVideoStreamFun(localVideo);
	};

	const muteLocalAudioStreamFun = async (props) => {
		await _rtcEngine?.muteLocalAudioStream(props);
		// await _rtcEngine?.enableLocalAudio(!props);
	};

	const audioMuteUnmuteFun = () => {
		setLocalAudio(!localAudio);
		muteLocalAudioStreamFun(localAudio);
	};

	const raiseHandFun = async () => {
		socket &&
			socket.send(
				JSON.stringify({
					action: "BROADCAST_CHAT",
					data: {
						cloudId: cloudId,
						memberId: systemUserId,
						memberObj: {
							firstName,
							lastName,
							email,
							mobile,
							id: systemUserId,
						},
						createdOn: new Date().toISOString(),
						content: { src: "", type: "RAISE_HAND" },
					},
				})
			);

		// setChat((prev) => [
		// 	...prev,
		// 	{
		// 		cloudId: cloudId,
		// 		memberId: systemUserId,
		// 		memberObj: {
		// 			firstName,
		// 			lastName,
		// 			email,
		// 			mobile,
		// 			id: systemUserId,
		// 		},
		// 		createdOn: new Date().toISOString(),
		// 		content: { src: "", type: "RAISE_HAND" },
		// 	},
		// ]);
	};

	// const voiceChangerFun = async (props) => {
	// 	await _rtcEngine?.setLocalVoiceChanger(AudioVoiceChanger[props]);
	// };

	const flipVideoFun = async () => {
		await _rtcEngine?.switchCamera();
	};

	const getEmoji = React.useCallback(() => {
		const url = `https://api.giphy.com/v1/emoji?api_key=BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8&limit=25&offset=${offset}`;
		axios
			.get(url)
			.then((res) => {
				setEmojiData((prev) => [
					...new Set([
						...prev,
						...res.data.data.map((ele) => ele.images?.preview_gif.url),
					]),
				]);
			})
			.catch((err) => console.warn(err));
	}, [offset]);

	React.useEffect(() => {
		getEmoji();
	}, [getEmoji]);

	const sendEmojiFun = async (data) => {
		console.warn(data);
		socket &&
			socket.send(
				JSON.stringify({
					action: "BROADCAST_CHAT",
					data: {
						cloudId: cloudId,
						memberId: systemUserId,
						memberObj: {
							firstName,
							lastName,
							email,
							mobile,
							id: systemUserId,
						},
						createdOn: new Date().toISOString(),
						content: { src: data, type: "EMOJI" },
					},
				})
			);
		// setChat((prev) => [
		// 	...prev,
		// 	{
		// 		cloudId: cloudId,
		// 		memberId: systemUserId,
		// 		memberObj: {
		// 			firstName,
		// 			lastName,
		// 			email,
		// 			mobile,
		// 			id: systemUserId,
		// 		},
		// 		createdOn: new Date().toISOString(),
		// 		content: { src: data, type: "EMOJI" },
		// 	},
		// ]);
	};

	// React.useEffect(() => {
	// 	socket &&
	// 		socket.addEventListener("message", ({ data }) => {
	// 			const { action, data: mData } = JSON.parse(data);
	// 			switch (action) {
	// 				case "GROUP_CALL_RECEIVE_FEEDBACK":
	// 					console.warn("receive fedback -----", mData);
	// 					if (mData?.content?.type === "raiseHand") {
	// 						setRaiseHand((prev) => [
	// 							...prev,
	// 							{
	// 								id: mData?.userId,
	// 								uid: mData?.userObject?.uid,
	// 								raiseHand: true,
	// 								mobile: mData?.userObject?.mobile,
	// 							},
	// 						]);
	// 						setTimeout(() => {
	// 							setRaiseHand((prev) =>
	// 								prev?.filter((ele) => ele?.id !== mData?.userId)
	// 							);
	// 						}, 4000);
	// 					} else if (mData?.content?.type === "emoji") {
	// 						setEmoji((prev) => [
	// 							...prev,
	// 							{
	// 								id: mData?.userId,
	// 								uid: mData?.userObject?.uid,
	// 								src: mData?.content?.src,
	// 								mobile: mData?.userObject?.mobile,
	// 							},
	// 						]);
	// 						setTimeout(() => {
	// 							setEmoji((prev) => prev?.filter((ele) => ele?.id !== mData?.userId));
	// 						}, 4000);
	// 					}
	// 					setLocalStorage("GroupFeedback", [...feedback, mData])
	// 						.then()
	// 						.catch();
	// 					setChat((prev) => [...prev, { ...mData }]);
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 		});
	// }, [socket, setChat]);

	if (showActionbar && _rtcEngine) {
		return (
			<>
				<View
					style={{
						position: "absolute",
						top: 70,
						borderRadius: 8,
						right: 10,
						zIndex: 2000,
					}}
				>
					<View
						style={{
							height: isHost || promoted ? 180 : 45,
							borderRadius: 10,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "space-evenly",
							backgroundColor: "rgba(0,0,0,0.5)",
							paddingHorizontal: 5,
						}}
					>
						{(isHost || promoted) && (
							<React.Fragment>
								<AppFabButton
									style={{
										backgroundColor: "rgba(255,255,255,0)",
										borderRadius: 50,
										height: 35,
										width: 35,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={videoMuteUnmuteFun}
									icon={
										localVideo ? (
											<MaterialCommunityIcons
												size={25}
												color="#FFF"
												name="video-outline"
											/>
										) : (
											<MaterialCommunityIcons
												size={25}
												color="#FFF"
												name="video-off-outline"
											/>
										)
									}
								/>
								<AppFabButton
									style={{
										backgroundColor: "rgba(255,255,255,0)",
										borderRadius: 50,
										height: 35,
										width: 35,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={audioMuteUnmuteFun}
									icon={
										localAudio ? (
											<MaterialCommunityIcons
												size={25}
												color="#FFF"
												name="microphone"
											/>
										) : (
											<MaterialCommunityIcons
												size={25}
												color="#FFF"
												name="microphone-off"
											/>
										)
									}
								/>

								<AppFabButton
									style={{
										backgroundColor: "rgba(255,255,255,0)",
										borderRadius: 50,
										height: 35,
										width: 35,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									disabled={!localVideo}
									onPress={flipVideoFun}
									icon={
										<MaterialIcons
											size={28}
											color="#FFF"
											name="flip-camera-android"
										/>
									}
								/>
							</React.Fragment>
						)}
						{/* <AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0.1)",
								borderRadius: 50,
								height: 40,
								width: 40,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={() => {
								refRBSheet?.current?.open();
							}}
							icon={
								<Image
									style={{ height: 30, width: 30 }}
									source={require("../../../../../assets/EditDrawerIcon/elements_icons_icons_white_alien.png")}
								/>
							}
						/> */}
						{/* <AppFabButton
						style={{
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 50,
							height: 40,
							width: 40,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() => {
							navigate("SelectBanjee", { addUser: "addUser" });
						}}
						icon={
							<MaterialCommunityIcons
								size={25}
								color="#FFF"
								name="account-plus-outline"
								style={{ transform: [{ scaleX: -1 }] }}
							/>
						}
					/> */}
						{/* <AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0)",
								borderRadius: 50,
								height: 35,
								width: 35,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={() => {
								emojiSheet?.current?.open();
							}}
							icon={
								<Entypo
									name="emoji-happy"
									size={25}
									color="#FFF"
								/>
							}
						/> */}
						<AppFabButton
							style={{
								backgroundColor: "rgba(255,255,255,0)",
								borderRadius: 50,
								height: 35,
								width: 35,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={raiseHandFun}
							icon={
								<MaterialCommunityIcons
									name="hand-back-left"
									size={22}
									color="#FFF"
								/>
							}
						/>
						{/* <View
							style={{
								backgroundColor: "rgba(255,255,255,0)",
								borderRadius: 50,
								height: 35,
								width: 35,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<AppMenu
								menuColor="#FFF"
								iconSize={25}
								menuContent={[
									{
										fontSize: 18,
										iconSize: 25,
										icon: "hand-back-left",
										label: "Raise Hand",
										onPress: () => raiseHandFun(),
									},
								]}
							/>
						</View> */}
					</View>
				</View>
				{/* <RBSheet
					customStyles={{
						container: { borderRadius: 10, backgroundColor: color?.gradientWhite },
					}}
					height={310}
					ref={emojiSheet}
					dragFromTopOnly={true}
					closeOnDragDown={true}
					closeOnPressMask={true}
					draggableIcon
				>
					<ScrollView
						onScrollEndDrag={() => setOffset((prev) => prev + 1)}
						ref={scrollViewRef}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								flexWrap: "wrap",
								width: "100%",
							}}
						>
							{emojiData &&
								emojiData.length > 0 &&
								emojiData.map((ele, index) => {
									return (
										<TouchableOpacity
											key={index}
											onPress={() => {
												const newData = ele.substring(31, 49);
												sendEmojiFun(newData);
												emojiSheet?.current?.close();
											}}
										>
											<Image
												source={{ uri: ele }}
												style={{ height: 60, width: 60, margin: 5 }}
											/>
										</TouchableOpacity>
									);
								})}
						</View>
					</ScrollView>
				</RBSheet> */}
			</>
		);
	} else {
		return null;
	}
}

export default ActionsCard;
