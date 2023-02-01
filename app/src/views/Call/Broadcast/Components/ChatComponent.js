import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ScrollView, TextField } from "native-base";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import KeyboardView from "../../../../constants/components/KeyboardView";
import color from "../../../../constants/env/color";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import SocketContext from "../../../../Context/Socket";
import BroadcastContext from "../Context";
import { AppContext } from "../../../../Context/AppContext";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";

export default function ChatComponent({ openChat }) {
	const [text, setText] = React.useState();
	const [emojiData, setEmojiData] = React.useState([]);
	const [offset, setOffset] = React.useState(0);
	const emojiSheet = React.useRef(null);
	const scrollViewRef = React.useRef(null);

	const socket = React.useContext(SocketContext)?.socket || false;
	// const { setChat } = React.useContext(BroadcastContext);
	const cloudId = React.useContext(BroadcastContext)?.cloudId || "";
	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const email = React.useContext(AppContext)?.profile?.email || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";

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

	const sendText = () => {
		setText();
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
						content: { src: text, type: "TEXT" },
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
		// 		content: { src: text, type: "TEXT" },
		// 	},
		// ]);
	};

	if (!openChat) return null;

	return (
		<View
			style={{
				position: "relative",
				flexDirection: "row",
				justifyContent: "center",
				height: 45,
				marginHorizontal: 5,
				backgroundColor: color.gradientWhite,
				borderRadius: 25,
			}}
		>
			<AppFabButton
				style={{ position: "absolute", left: 0, top: 0 }}
				onPress={() => {
					emojiSheet?.current?.open();
				}}
				size={22}
				icon={
					<Entypo
						name="emoji-happy"
						size={25}
						color="#FFF"
					/>
				}
			/>
			<TextField
				placeholder="Type here..."
				value={text}
				type="text"
				onChangeText={(e) => setText(e)}
				width="78%"
				borderWidth={0}
				style={{
					flex: 1,
					backgroundColor: color.gradientWhite,
					color: "#FFF",
					borderWidth: 0,
				}}
			/>
			<AppFabButton
				style={{ position: "absolute", right: 5, top: 0 }}
				onPress={sendText}
				size={22}
				icon={
					<MaterialCommunityIcons
						name="send"
						size={25}
						color={color?.primary}
					/>
				}
				disabled={
					text === "" || text === undefined || text === null || !text ? true : false
				}
			/>
			<RBSheet
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
											emojiSheet?.current?.close();
											sendEmojiFun(newData);
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
			</RBSheet>
		</View>
	);
}

const styles = StyleSheet.create({});
