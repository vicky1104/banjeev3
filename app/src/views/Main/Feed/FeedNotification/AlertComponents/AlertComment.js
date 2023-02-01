import { useRoute } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	Dimensions,
	Keyboard,
	Platform,
	StyleSheet,
	View,
	VirtualizedList,
} from "react-native";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import color from "../../../../../constants/env/color";
import {
	createBlogComment,
	getBlogComments,
} from "../../../../../helper/services/Blogs";
import AlertCommentItem from "./AlertCommentItem";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "../../../../../constants/components/ui-component/AppInput";
import ConfirmModal from "../../../../Others/ConfirmModal";
import { deleteAlertAndBlogComment } from "../../../../../helper/services/DeleteComment";
import { showToast } from "../../../../../constants/components/ShowToast";
import { MainContext } from "../../../../../../context/MainContext";

function AlertComment({}) {
	const {
		params: { alertId },
	} = useRoute();

	const [text, setText] = useState("");
	const [commentId, setCommentId] = useState();
	const [delComment, setDelComment] = useState(false);
	const [commentData, setCommentData] = useState([]);
	const [visible, setVisible] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(20);
	const { setAlertId } = useContext(MainContext);

	const getAllComments = useCallback(
		() =>
			getBlogComments(alertId)
				.then((res) => {
					// setAlertIds((prev) => [
					// 	...prev.map(
					// 		(ele) => console.warn(ele)

					// 		// ele?.id === res.postId ? { ...ele, commentCount: res?.length } : ele
					// 	),
					// ]);

					// var foundIndex = alertIds.findIndex((x) => x.id == res.postId);

					// console.warn(alertIds[foundIndex]);

					setAlertId((pre) => ({ ...pre, [alertId]: res?.length }));
					setCommentData(res);
					setVisible(false);
					setRefresh(false);
				})
				.catch((err) => console.warn(err, "get comments error")),
		[alertId]
	);
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) =>
			setKeyboardHeight(e.endCoordinates.height + 20)
		);
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
			setKeyboardHeight(20)
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	function createAlertComment() {
		createBlogComment({
			postType: "ALERT",
			postId: alertId,
			text: text,
		})
			.then((res) => getAllComments())
			.catch((er) => console.warn(er));
	}

	useEffect(() => {
		getAllComments();
	}, [getAllComments]);

	return (
		<>
			{visible ? (
				<AppLoading visible={true} />
			) : (
				<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
					<VirtualizedList
						keyExtractor={(data) => Math.random()}
						// ListHeaderComponent={headerComponnent}
						onRefresh={() => {
							setRefresh(true);
							setCommentData([]);
							getAllComments();
						}}
						refreshing={refresh}
						data={commentData}
						getItem={(data, index) => data?.[index]}
						getItemCount={(data) => data?.length}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={() => <View style={{ paddingBottom: 40 }} />}
						renderItem={({ item }) => {
							return (
								<AlertCommentItem
									item={item}
									setCommentId={setCommentId}
									setDelComment={setDelComment}
								/>
							);
						}}
					/>
					<View
						style={{
							position: "absolute",
							bottom: 0,
							width: "100%",
							alignSelf: "center",
							alignItems: "center",
							backgroundColor: color?.gradientWhite,
							// bottom: 20,
						}}
					>
						{text.length > 0 && (
							<View
								style={{
									borderRadius: 50,
									height: 25,
									width: 25,
									alignItems: "center",
									justifyContent: "center",
									borderColor: "black",
									position: "absolute",
									right: 10,
									zIndex: 99,
									top: 7,
								}}
							>
								<Ionicons
									name="ios-send-sharp"
									size={20}
									color={color.grey}
									onPress={() => {
										setText("");
										createAlertComment();
									}}
								/>
							</View>
						)}

						<AppInput
							style={{
								height: 40,
								width: "100%",
								borderRadius: 8,
								padding: 10,
								color: color?.black,
								borderColor: color.lightGrey,
								backgroundColor: color?.lightWhite,
								// marginBottom: 20,
								marginBottom: Platform.OS === "ios" ? keyboardHeight : 20,
							}}
							autoFocus={true}
							value={text}
							onChangeText={(e) => {
								setText(e);
							}}
							placeholder={"Tap to comment..."}
						/>
					</View>

					{delComment && (
						<ConfirmModal
							// title={`Are you sure, you want to unfriend ${user?.firstName} ?`}
							setModalVisible={setDelComment}
							btnLabel={"Delete"}
							message={"Delete Comment"}
							onPress={() => {
								deleteAlertAndBlogComment(commentId).then((res) => {
									setCommentData(commentData.filter((ele) => ele.id !== commentId));
									setDelComment(false);
									showToast("Comment deleted...!");
									// getComments();
								});
							}}
						/>
					)}
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingTop: 5,
		paddingBottom: 15,
	},
	img: {
		height: 40,
		width: 40,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "white",
		marginRight: 10,
		marginLeft: 16,
	},
	view: {
		width: (Dimensions.get("window").width = "70%"),
		flexDirection: "column",
	},
});

export default AlertComment;
