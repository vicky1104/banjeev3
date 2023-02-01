import {
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	Alert,
	Image,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import {
	deleteChat,
	updateChat,
} from "../../../../helper/services/ChatService";
import AudioComp from "./AudioComp";
import checkUserStatus from "./checkUserStatus";
import ImageComp from "./ImageComp";
import VideoComp from "./VideoComp";
import {
	GiphyContentType,
	GiphyDialog,
	GiphyDialogEvent,
	GiphySDK,
} from "@giphy/react-native-sdk";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import RenderText from "./TextComponent/RenderText";
GiphySDK.configure({
	apiKey: "BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8", // iOS SDK key
});
export default function RenderMedia({ chatContent, setLoading, messId }) {
	const { replace } = useNavigation();
	const emojiSheetRef = React.useRef(null);
	const { profile } = React.useContext(AppContext);
	const {
		isSender,
		content,
		createdOn,
		id,
		group,
		messageSeen,
		selfDestructive,
		audioStatus,
		destructiveAgeInSeconds,
		sender,
	} = chatContent;

	const [renderMedia, setRenderMedia] = useState(false);
	const isFocused = useIsFocused();

	const renderContent = () => {
		const { mimeType, src, base64Content } = content;

		const mimeHandler = mimeType?.split("/");
		const type = mimeHandler?.[0];

		switch (type) {
			case "plain":
				return (
					<>
						{isSender ? (
							<View
								style={{
									borderColor: "#007A60",
									backgroundColor: "#ffffff90",
									borderRadius: 10,
									paddingVertical: 5,
									paddingHorizontal: 8,
									maxWidth: 260,
									flexWrap: "wrap",
									display: "flex",
								}}
							>
								<RenderText
									src={src}
									chatContent={chatContent}
								/>
							</View>
						) : (
							<View style={{ maxWidth: 260 }}>
								<View
									style={{
										borderColor: "#6B6B80",
										backgroundColor: "#504040",
										borderRadius: 10,
										paddingVertical: 5,
										paddingHorizontal: 8,
										maxWidth: 260,
										flexWrap: "wrap",
										display: "flex",
									}}
								>
									<RenderText
										src={src}
										chatContent={chatContent}
									/>
								</View>
							</View>
						)}
					</>
				);
			case "image":
				return (
					<ImageComp
						src={src}
						chatContent={chatContent}
						isSender={isSender}
						mimeHandler={mimeHandler}
					/>
				);

			case "video":
				return (
					<VideoComp
						src={src}
						chatContent={chatContent}
						isSender={isSender}
						mimeHandler={mimeHandler}
					/>
				);
			case "audio":
				return (
					<AudioComp
						// messId={messId}
						src={src}
						base64Content={base64Content}
						chatContent={chatContent}
						status={audioStatus}
						isSender={isSender}
						selfDestructive={{
							selfDestructive: selfDestructive,
							destructiveAgeInSeconds: destructiveAgeInSeconds,
						}}
					/>
				);
			case "document":
				return <Text>This is for document</Text>;
			case "location":
				return <Text>This is for location</Text>;
			default:
				return null;
		}
	};

	const deleteChatFun = (id) => {
		setLoading(true);
		deleteChat(id)
			.then((res) => {
				// console.log(id);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	useEffect(() => {
		const handler = (e) => {
			GiphyDialog.hide();
			if (renderMedia) {
				updateChat({
					...chatContent,
					reactionId: e.media.url.substring(31, 49),
					reactionChar: 0,
				})
					.then((res) => {
						setRenderMedia(false);
					})
					.catch((err) => console.log(err));
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
	}, [renderMedia, isFocused]);

	const onLongPress = (event) => {
		if (event.nativeEvent.state === State.ACTIVE && isSender) {
			Alert.alert("", "Delete message ?", [
				{
					text: "Cancel",
				},
				{ text: "Delete", onPress: () => deleteChatFun(id) },
			]);
		}
	};

	const navigateToNeighburhood = () => {
		replace("BanjeeProfile", { profileId: sender?.id });
	};

	return (
		<View style={{ marginTop: 7 }}>
			{group && !isSender && (
				<View
					style={{
						backgroundColor: color.gradientWhite,
						paddingHorizontal: 3,
						borderTopLeftRadius: 5,
						borderTopRightRadius: 5,
						paddingBottom: 2,
					}}
				>
					<Text
						numberOfLines={1}
						color={color.black}
						style={{ width: "100%" }}
						fontSize={10}
					>
						{`${chatContent?.sender?.firstName} ${chatContent?.sender?.lastName}`}
					</Text>
				</View>
			)}
			<View style={{ paddingBottom: 0, flexDirection: "row" }}>
				{group && !isSender && (
					<TouchableWithoutFeedback onPress={navigateToNeighburhood}>
						<View
							style={{
								// justifyContent: "flex-end",
								paddingRight: 5,
							}}
						>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								bgColor={color.gradientWhite}
								style={styles.profileImg}
								source={{
									uri: profileUrl(
										!isSender ? chatContent?.sender?.avtarImageUrl : profile.avtarUrl
									),
								}}
							>
								<Text
									fontSize={12}
									// style={{ color: "#FFF" }}
								>
									{chatContent?.sender?.firstName?.charAt(0).toUpperCase() || ""}
								</Text>
							</Avatar>
						</View>
					</TouchableWithoutFeedback>
				)}
				<LongPressGestureHandler
					onHandlerStateChange={(e) => {
						onLongPress(e);
					}}
					minDurationMs={500}
				>
					<View style={{}}>
						<View
							style={{
								display: "flex",
								width: isSender || !group ? "100%" : "94%",
								flexDirection: !isSender ? "row-reverse" : "row",
								alignItems: "center",
								justifyContent: "flex-end",
								backgroundColor: color.gradientWhite,
							}}
						>
							{!isSender && !group && (
								<AppFabButton
									onPress={() => {
										setRenderMedia(true);
										GiphyDialog.configure({
											mediaTypeConfig: [GiphyContentType.Emoji],
										});
										GiphyDialog.show();
									}}
									size={20}
									icon={
										<Image
											style={{
												height: 20,
												width: 20,
												tintColor: color?.gradientBlack,
											}}
											source={require("../../../../../assets/EditDrawerIcon/reaction.png")}
										/>
									}
								/>
							)}
							{isSender && content?.src && (
								<>
									{messageSeen ? (
										<FastImage
											style={{
												height: 20,
												width: 20,
												marginRight: 5,
											}}
											source={require("../../../../../assets/EditDrawerIcon/tickDoublePink.png")}
										/>
									) : (
										<FastImage
											style={{
												height: 15,
												width: 15,
												marginRight: 5,
											}}
											source={require("../../../../../assets/EditDrawerIcon/tickSinglePink.png")}
										/>
									)}
								</>
							)}
							{chatContent?.reactionId && (
								<FastImage
									source={{
										uri: `https://media2.giphy.com/media/${chatContent?.reactionId}/giphy-preview.gif?cid=67e264e816a07f883c96444d0e4e78abd0472e0feb1a55cc&rid=giphy-preview.gif&ct=s`,
									}}
									style={{
										height: 30,
										width: 30,
										marginLeft: isSender ? 0 : 5,
										marginRight: isSender ? 5 : 0,
									}}
								/>
							)}
							{content && renderContent()}
						</View>
					</View>
				</LongPressGestureHandler>
			</View>
			<View>
				{content?.src ? (
					isSender ? (
						<Text
							fontSize={10}
							style={{
								textAlign: "right",
								color: color?.gradientBlack,
							}}
						>
							{checkUserStatus(createdOn, false)}
						</Text>
					) : (
						<Text
							fontSize={10}
							style={{
								color: color?.gradientBlack,
							}}
						>
							{checkUserStatus(createdOn, false)}
						</Text>
					)
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	profileImg: {
		height: 20,
		width: 20,
		borderRadius: 20,
	},
});
