import { Entypo, Ionicons } from "@expo/vector-icons";
import { Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import {
	Dimensions,
	Keyboard,
	Platform,
	SafeAreaView,
	StyleSheet,
	View,
	VirtualizedList,
} from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import KeyboardView from "../../../../constants/components/KeyboardView";
import { showToast } from "../../../../constants/components/ShowToast";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import {
	createBlogComment,
	getBlogComments,
} from "../../../../helper/services/Blogs";
import {
	listComment,
	postComment,
} from "../../../../helper/services/CommentService";
import {
	deleteAlertAndBlogComment,
	deleteComment,
} from "../../../../helper/services/DeleteComment";
import ConfirmModal from "../../../Others/ConfirmModal";
import AllComments from "./AllComments";

import ReactionSheet from "./ReactionSheet";
import { HeaderBackButton } from "@react-navigation/elements";

function Comment({ commentSheetRef }) {
	const [text, setText] = React.useState("");
	const [commentId, setCommentId] = React.useState(false);
	const [delComment, setDelComment] = React.useState(false);
	const [height, setHeight] = React.useState(0);
	const [data, setData] = React.useState([]);
	const refRBSheet = React.useRef(null);
	const [reply, setReply] = React.useState(false);
	const [load, setLoad] = useState(false);

	const { postId, setCommentCount, blogComment } = useContext(MainContext);
	const [refresh, setRefresh] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(70);

	const [visible, setVisible] = useState(true);

	useEffect(() => {
		getComments();
		return () => {};
	}, [getComments]);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			(e) => {
				setKeyboardHeight(e.endCoordinates.height + 30); // or some other action
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardHeight(70); // or some other action
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	// `````````` params?.blogComment is a boolean comes from ViewBlog Page

	const submitComment = React.useCallback(() => {
		if (text.length > 0) {
			if (blogComment) {
				createBlogComment({
					postType: "BLOG",
					postId: postId,
					text: text,
				})
					.then((res) => {
						setText("");
						getComments();
					})
					.catch((err) => console.log(err));
			} else {
				postComment({
					feedId: postId,
					text: text,
				})
					.then((res) => {
						setText("");
						getComments();
					})
					.catch((err) => console.log(err));
			}
		} else {
			showToast("Type comment");
		}
	}, [text, postId]);

	const getComments = React.useCallback(() => {
		if (blogComment) {
			getBlogComments(postId)
				.then((res) => {
					setLoad(false);
					setRefresh(false);
					setVisible(false);
					if (res) {
						let x = res.map((a) => {
							if (a?.replies?.length > 0) {
								return a?.replies?.length + 1;
							} else {
								return 1;
							}
						});
						setCommentCount(x.reduce((a, b) => a + b, 0));
						setData(res);
					}
				})
				.catch((err) => console.log(err));
		} else {
			listComment(postId)
				.then((res) => {
					// console.log(res);
					setLoad(false);
					setRefresh(false);
					setVisible(false);
					if (res) {
						let x = res.map((a) => {
							if (a?.replies?.length > 0) {
								return a?.replies?.length + 1;
							} else {
								return 1;
							}
						});
						setCommentCount(x.reduce((a, b) => a + b, 0));
						setData(res);
					}
				})
				.catch((err) => console.log(err));
		}
	}, [postId]);

	function replyToComment() {
		if (text.length > 0) {
			if (blogComment) {
				// console.warn(reply, "reply which i get");
				createBlogComment({
					postId: reply.feedId,
					text: text,
					replyToCommentId: reply.replyToCommentId,
				})
					.then((res) => {
						setReply(false);
						setText("");
						getComments();
					})
					.catch((err) => console.warn(err));
			} else {
				postComment({
					feedId: reply.feedId,
					replyToCommentId: reply.replyToCommentId,
					text: text,
				})
					.then((res) => {
						setReply(false);
						setText("");
						getComments();
					})
					.catch((err) => console.warn(err));
			}
		}
	}

	function deleteCommentFx() {
		if (blogComment) {
			deleteAlertAndBlogComment(commentId).then((res) => {
				setDelComment(false);
				getComments();
			});
		} else {
			deleteComment(commentId).then((res) => {
				console.warn("deleted post comment");
				setDelComment(false);
				getComments();
			});
		}
	}

	function renderItem({ item }) {
		return (
			<AllComments
				refRBSheet={refRBSheet}
				item={item}
				commentOfComment={setText}
				setCommentId={setCommentId}
				setReply={setReply}
				setDelComment={setDelComment}
			/>
		);
	}

	function ItemSeparatorComponent() {
		return (
			<View
				style={{
					width: "100%",
					height: 1,
					backgroundColor: color?.border,
				}}
			/>
		);
	}

	const onRefresh = () => {
		setRefresh(true);
		setData([]);
		getComments();
	};

	return (
		<KeyboardView fromComment={true}>
			<View style={{ backgroundColor: color?.gradientWhite }}>
				<SafeAreaView>
					<HeaderBackButton
						labelVisible={Platform.OS === "ios"}
						onPress={() => commentSheetRef.current.close()}
						style={{ marginLeft: 10, color: color?.gradientWhite }}
						pressColor={color?.gradientWhite}
						tintColor={color?.black}
					/>
				</SafeAreaView>
			</View>
			{visible ? (
				<AppLoading visible={true} />
			) : (
				<View
					style={{
						height: "100%",
						width: "100%",
					}}
				>
					{/* <LinearGradient
						style={[styles.container, { zIndex: 99990999 }]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						color={
							darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
						}
					> */}
					<View
						style={[
							styles.container,
							{ zIndex: 99990999, backgroundColor: color?.gradientWhite },
						]}
					>
						<VirtualizedList
							keyboardShouldPersistTaps="never"
							getItemCount={(data) => data?.length}
							getItem={(data, index) => data[index]}
							data={data}
							removeClippedSubviews={true}
							ItemSeparatorComponent={ItemSeparatorComponent}
							keyExtractor={(data) => data.id}
							renderItem={renderItem}
							refreshing={refresh}
							// ListFooterComponent={commentFooter}
							onRefresh={onRefresh}
							contentContainerStyle={{
								paddingBottom: 130,
								zIndex: 99999,
							}}
							ListEmptyComponent={() =>
								!refresh && (
									<View
										style={{
											flex: 1,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text color={color?.black}>Be the first to comment...! </Text>
									</View>
								)
							}
						/>

						{/*  ```````````````````````````` ADD COMMENT */}
						<View
							style={{
								width: (Dimensions.get("window").width = "95%"),
								marginTop: 20,
								alignSelf: "center",
								flex: 1,
								position: "absolute",
								bottom: Platform.OS === "android" ? keyboardHeight : 90,
							}}
						>
							{reply.feedId && (
								<View
									style={{
										backgroundColor: "#84959f",
										position: "relative",
										height: 40,
										marginBottom: 12,
										// borderTopLeftRadius: 8,
										borderTopLeftRadius: 8,
										borderTopRightRadius: 8,
									}}
								>
									<Entypo
										style={{ position: "absolute", top: -8, right: -8, zIndex: 99 }}
										name={"circle-with-cross"}
										size={20}
										onPress={() => setReply(false)}
										color={color?.black}
									/>
									<Text
										color={color?.black}
										style={{ paddingLeft: 8 }}
										numberOfLines={2}
									>
										{reply.text}
									</Text>
								</View>
							)}

							<View
								style={{
									position: "relative",
									maxHeight: 100,
									justifyContent: "center",
								}}
							>
								<AppInput
									value={text}
									multiline={true}
									style={{
										backgroundColor: color?.lightWhite,
										height: height,
										maxHeight: 100,
										minHeight: 40,
										borderRadius: 8,
										paddingLeft: 15,
										color: color?.black,
									}}
									// placeholderTextColor="grey"
									autoFocus={true}
									placeholder={reply.feedId ? "Reply a comment" : "Write a comment "}
									onChangeText={(e) => setText(e.trimStart())}
									onContentSizeChange={(e) =>
										setHeight(e.nativeEvent.contentSize.height)
									}
								/>
								{load ? (
									<View style={{ position: "absolute", right: 20 }}>
										<AppLoading
											size="small"
											visible={load}
										/>
									</View>
								) : (
									<Ionicons
										name="ios-send-sharp"
										size={20}
										style={{ position: "absolute", right: 10 }}
										color={"grey"}
										onPress={() =>
											reply.feedId
												? (setLoad(true), replyToComment())
												: (setLoad(true), submitComment())
										}
									/>
								)}
							</View>
						</View>
					</View>
					{/* </LinearGradient> */}

					{/* ======================= BOTTOM SHEET FOR COMMENT  =====================================   */}

					<ReactionSheet />
				</View>
			)}

			{delComment && (
				<ConfirmModal
					// title={`Are you sure, you want to unfriend ${user?.firstName} ?`}
					setModalVisible={setDelComment}
					btnLabel={"Delete"}
					message={"Delete Comment"}
					onPress={deleteCommentFx}
				/>
			)}
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, position: "relative" },
});

export default Comment;
