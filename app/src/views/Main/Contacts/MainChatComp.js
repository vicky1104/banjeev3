import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import {
	Image,
	Linking,
	Platform,
	StyleSheet,
	View,
	VirtualizedList,
} from "react-native";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import { chatHistory } from "../../../helper/services/ChatService";
import BottomView from "./ChatComponent/BottomView/BottomView";
import ChatFragment from "./ChatComponent/ChatFragment";
import HeaderRight from "./ChatHeader/HeaderRight";
import HearderLeft from "./ChatHeader/HearderLeft";
// import ReportUser from "../../../Screens/Home/Cards/ReportUser";
import Lottie from "lottie-react-native";
import { AppContext } from "../../../Context/AppContext";
import KeyboardView from "../../../constants/components/KeyboardView";
import SocketContext from "../../../Context/Socket";
import { MainChatContext } from "./MainChatContext";
import { NeighbourhoodMemberListService } from "../../../helper/services/ListNeighbourhoodMember";
import MediaModal from "./MediaComponents";
import color from "../../../constants/env/color";
import { openAppSetting } from "../../../utils/util-func/constantExport";
import usePermission from "../../../utils/hooks/usePermission";
import ConfirmModal from "../../Others/ConfirmModal";
import { BlockUser } from "../../../helper/services/Service";
import { showToast } from "../../../constants/components/ShowToast";

export default function MainChatScreenComp() {
	const { setOptions, addListener, goBack } = useNavigation();
	const {
		chat: userChat,
		setChatUser,
		setChat: setUserChat,
		audios,
	} = useContext(MainChatContext);
	const isFocused = useIsFocused();
	const { params } = useRoute();
	const { socket } = React.useContext(SocketContext);
	const systemUserId = useContext(AppContext)?.profile?.systemUserId || false;
	const setUnreadMessage = useContext(AppContext)?.setUnreadMessage;
	const { checkPermission } = usePermission();
	const [reportModal, setReportModal] = React.useState(false);

	const [page, setPage] = React.useState(0);
	const [endLoader, setEndLoader] = React.useState(false);

	const [loading, setLoading] = React.useState(true);
	const [allMembers, setAllMembers] = useState(null);
	const [mediaModal, setMediaModal] = React.useState(false);
	const [media, setMedia] = React.useState(false);

	const [blockModal, setBlockModal] = React.useState(false);
	const [unfriendModal, setUnfriendModal] = React.useState(false);

	const [last, setLast] = useState(false);

	const getAllMembers = useCallback(() => {
		NeighbourhoodMemberListService({
			cloudId: params?.item?.cloudId,
		})
			.then((res) => {
				setAllMembers(res?.content);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [params]);

	const chatWaliHistory = React.useCallback(() => {
		if (systemUserId) {
			setLoading(true);
			chatHistory({
				page,
				pageSize: 15,
				roomId: params?.item?.roomId,
				sortBy: "createdOn desc",
			})
				.then((res) => {
					getAllMembers();
					setEndLoader(false);
					setLast(res.last);
					res.content?.map((data) => {
						if (data?.group) {
							if (
								data?.seenBy?.filter((i) => i.userId !== systemUserId)?.length > 0 &&
								data?.sender?.id !== systemUserId
							) {
								socket &&
									socket.send(
										JSON.stringify({
											action: "CREATE_MESSAGE_SIGNAL",
											data: {
												type: "SEEN",
												user: data?.receiver,
												userId: systemUserId,
												messageId: data.id,
												id: data.id,
											},
										})
									);
							}
						} else {
							if (!data?.messageSeen && data?.sender?.id !== systemUserId) {
								socket &&
									socket.send(
										JSON.stringify({
											action: "CREATE_MESSAGE_SIGNAL",
											data: {
												type: "SEEN",
												user: data?.receiver,
												userId: systemUserId,
												messageId: data.id,
												id: data.id,
											},
										})
									);
							}
						}
					});
					setUserChat((prev) => [
						...prev,
						...res.content.map((ele) => {
							return {
								...ele,
								key: Math.random(),
								isSender: systemUserId === ele?.senderId,
							};
						}),
					]);
					setLoading(false);
				})
				.catch((err) => {
					console.warn(err);
					setLoading(false);
				});
		}
	}, [params, page, systemUserId, getAllMembers]);

	useFocusEffect(
		useCallback(() => {
			setChatUser(params?.item);
		}, [params])
	);

	React.useEffect(() => {
		setOptions({
			headerLeft: () => <HearderLeft item={params?.item} />,
			headerRight: () => (
				<HeaderRight
					chatUser={params?.item}
					setReportModal={setReportModal}
					setBlockModal={setBlockModal}
					setUnfriendModal={setUnfriendModal}
				/>
			),
		});
		chatWaliHistory();
		setUnreadMessage(false);
		// return () => {
		// 	if (!isFocused) {
		// 		setUserChat([]);
		// 	}
		// };
	}, [chatWaliHistory]);

	const blockUser = () => {
		BlockUser(params?.item?.id)
			.then(() => {
				showToast(
					`${params?.item?.firstName} ${params?.item?.lastName} Blocked Successfully.`
				);
				goBack();
			})
			.catch((err) => console.warn(err));
	};
	const onChatMessageReceive = React.useCallback(
		async (data) => {
			console.warn("data of socket listen ------------>", data);
			if (data?.roomId === params?.item?.roomId) {
				setLoading(false);
				if (
					data?.content?.mimeType === "image/jpg" ||
					data?.content?.mimeType === "image/gif"
				) {
					const imageSource =
						data?.content?.mimeType === "image/gif"
							? `http://media1.giphy.com/media/${data?.content?.src}/giphy.gif`
							: data?.content?.src;

					await Image.getSize(imageSource, (width, height) => {
						const srcHeight = (220 / width) * height;
						setUserChat((prev) => [
							{
								...data,
								content: {
									...data?.content,
									height: srcHeight ? srcHeight : 220,
								},
								loader: data.content.mimeType.split("/")[0] === "audio" ? false : null,
								key: Math.random(),
								isSender: systemUserId === data?.sender?.id,
							},
							...prev,
						]);
					});
				} else if (data?.content.mimeType?.split("/")?.[0] === "video") {
					setUserChat((prev) => [
						{
							...data,
							content: { ...data?.content },
							loader: false,
							key: Math.random(),
							isSender: systemUserId === data?.sender?.id,
						},
						...prev,
					]);
				} else {
					setUserChat((prev) => [
						{
							...data,
							content: data?.content,
							loader: false,
							key: Math.random(),
							isSender: systemUserId === data?.sender?.id,
						},
						...prev,
					]);
				}

				if (systemUserId !== data.sender?.id) {
					socket.send(
						JSON.stringify({
							action: "CREATE_MESSAGE_SIGNAL",
							data: {
								type: "SEEN",
								user: data?.receiver,
								userId: systemUserId,
								messageId: data.id,
								id: data.id,
							},
						})
					);
				}
			}
		},
		[socket, systemUserId, params, params.item?.roomId]
	);

	const onChatMessageReactionReceive = React.useCallback((data) => {
		if (data?.roomId === params?.item?.roomId) {
			setLoading(false);
			setUserChat((prev) =>
				prev.map((ele) => {
					if (ele?.id === data?.id) {
						return {
							...data,
							key: Math.random(),
							isSender: systemUserId === data?.sender?.id,
						};
					} else return ele;
				})
			);
		}
	}, []);

	const onChatMessageDelete = React.useCallback((data) => {
		setLoading(false);
		setUserChat((prev) => prev.filter((ele) => ele.id !== data.id));
	}, []);

	const onChatMessageDistructiveReceiver = React.useCallback((data) => {
		setUserChat((prev) => prev.filter((ele) => ele.id !== data.id));
	}, []);

	const onChatMessageSeen = React.useCallback((data) => {
		setUserChat((prev) =>
			prev.map((ele) => {
				if (ele.id === data?.id || ele.id === data?.messageId) {
					return {
						...ele,
						messageSeen: true,
					};
				} else return ele;
			})
		);
	}, []);

	const socketListener = React.useCallback(
		({ data }) => {
			const { action, data: messageData } = JSON.parse(data);
			switch (action) {
				case "CHAT_MESSAGE":
				case "GROUP_CHAT_MESSAGE":
					onChatMessageReceive(messageData);
					break;
				case "CHAT_MESSAGE_DELETED":
					onChatMessageDelete(messageData);
					break;
				case "CHAT_MESSAGE_SEEN":
					onChatMessageSeen(messageData);
					break;
				case "REACTION_MESSAGE":
					onChatMessageReactionReceive(messageData);
					break;
				case "DESTRUCTIVE_MESSAGE":
					onChatMessageDistructiveReceiver(messageData);
					break;
				default:
					break;
			}
		},
		[
			onChatMessageReceive,
			onChatMessageDelete,
			onChatMessageSeen,
			onChatMessageReactionReceive,
			onChatMessageDistructiveReceiver,
		]
	);

	React.useEffect(() => {
		socket && socket.addEventListener("message", socketListener);
		return () => {
			if (!isFocused) {
				socket.removeEventListener("message", socketListener);
			}
		};
	}, [socket, isFocused, socketListener]);

	function renderItem({ item }) {
		return (
			<ChatFragment
				setLoading={setLoading}
				chatContent={item}
			/>
		);
	}
	if (systemUserId) {
		return (
			<KeyboardView>
				<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
					{endLoader && Platform.OS !== "ios" && (
						<View
							style={{
								height: 20,
								width: "100%",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Lottie
								source={require("../../../../assets/loader/loader.json")}
								autoPlay
								style={{ height: 25 }}
							/>
						</View>
					)}

					{mediaModal && (
						<MediaModal
							compression={true}
							mediaModal={mediaModal}
							item={params?.item}
							roomId={params?.item?.roomId}
							closeMediaModal={() => {
								setMediaModal(false);
							}}
							openMediaModal={async () => {
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
											openAppSetting(
												"Banjee wants to access microphone for recording videos"
											);
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
											cameraPer == "granted" &&
											audioPer == "granted" &&
											photoPer == "granted"
											// &&
											// storagePer == "granted"
										);
									},
								});
								let per = await x();
								if (per) {
									setMediaModal(true);
								}
							}}
							setMedia={setMedia}
						/>
					)}
					<View
						style={{
							paddingBottom: 75,
							height: "100%",
						}}
					>
						<VirtualizedList
							getItemCount={(userChat) => userChat.length}
							getItem={(data, index) => data[index]}
							showsVerticalScrollIndicator={false}
							data={userChat}
							scrollEnabled={true}
							initialNumToRender={10}
							keyExtractor={(item) => item.key}
							onEndReached={() => {
								if (!last) {
									setEndLoader(true);
									setPage((p) => p + 1);
								}
							}}
							onEndReachedThreshold={0.01}
							scrollEventThrottle={150}
							inverted
							removeClippedSubviews={true}
							renderItem={renderItem}
							ListFooterComponent={() => <AppLoading visible={loading} />}
						/>
					</View>
					<BottomView
						allMembers={allMembers}
						setLoading={setLoading}
						roomId={params?.item?.roomId}
						closeMediaModal={() => {
							setMediaModal(false);
						}}
						openMediaModal={() => {
							setMediaModal(true);
						}}
						media={media}
						setMedia={setMedia}
					/>
				</View>
				{blockModal && (
					<ConfirmModal
						title={`Are you sure, you want to block ${params?.item?.firstName} ${params?.item?.lastName}?`}
						setModalVisible={setBlockModal}
						btnLabel={"Block"}
						message={"Block User"}
						onPress={blockUser}
					/>
				)}
			</KeyboardView>
		);
	} else return null;
}

const styles = StyleSheet.create({
	container: { position: "relative", flex: 1 },
});
