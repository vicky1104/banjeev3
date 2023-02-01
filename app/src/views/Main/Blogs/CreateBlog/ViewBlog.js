import {
	Entypo,
	Feather,
	FontAwesome5,
	AntDesign,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import color from "../../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";

import HTMLView from "react-native-htmlview";
import { MainContext } from "../../../../../context/MainContext";
import { showToast } from "../../../../constants/components/ShowToast";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { AppContext } from "../../../../Context/AppContext";
import {
	createBlogLike,
	deleteBlogApi,
	getBlogApi,
} from "../../../../helper/services/Blogs";
import { convertTime } from "../../../../utils/util-func/convertTime";
import { shareBlog } from "../../../Other/ShareApp";
import ConfirmModal from "../../../Others/ConfirmModal";
import CommentBottomSheet from "../../../../constants/components/FeedComments/CommentBottomSheet";
import Sound from "react-native-sound";
import ringtone from "../../../../../assets/ringtones/reaction.mp3";

function ViewBlog(props) {
	const {
		params: { id },
	} = useRoute();

	const { navigate, goBack, setOptions } = useNavigation();
	const { profile } = useContext(AppContext);
	const { setPostId, setBlogComment, commentCount, setCommentCount } =
		useContext(MainContext);

	const [increementLike, setIncreementLike] = React.useState(0);
	const [loader, setLoader] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [item, setItem] = useState({});
	const [like, setLike] = useState(false);

	const commentSheetRef = useRef();
	const deleleBlog = () => {
		deleteBlogApi(item?.id)
			.then((res) => {
				showToast("Blog Successfully Deleted");
				navigate("MyBlogs", { deletedBlogId: item.id });
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		setLoader(true);
		getBlogApi(id)
			.then((res) => {
				setItem(res);
				setLoader(false);
			})
			.catch((err) => console.error(err));

		return () => {
			setCommentCount(null);
			setPostId(null);
			setItem({});
		};
	}, []);

	useEffect(() => {
		setOptions({
			headerTintColor: color?.white,
			headerRight: () => (
				<AppFabButton
					onPress={() => shareBlog(id, item)}
					size={18}
					icon={
						<Entypo
							name="share"
							size={20}
							color={color?.white}
						/>
					}
				/>
			),
		});
	}, [color, item, id]);

	function likeFunc() {
		createBlogLike({
			postId: id,
			postType: "BLOG",
			reactionType: "LIKE",
		})
			.then((res) => {
				Sound.setCategory("Playback");
				var ding = new Sound(ringtone, (error) => {
					if (error) {
						console.log("failed to load the sound", error);
						return;
					} else {
						ding.play();
					}
					//console.log("when loaded successfully");
				});
				ding.setVolume(1);
				setIncreementLike(1);
				setLike(true);
			})
			.catch((err) => console.warn(err));
	}

	let y = item?.reactions?.filter(
		(ele) => ele.user.id === profile?.systemUserId
	);

	let checkLike = like || y?.length > 0;

	return (
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{loader && (
				<View
					style={{
						height: "100%",
						width: "100%",
						backgroundColor: color?.gradientWhite,
					}}
				>
					<AppLoading visible={loader} />
				</View>
			)}
			<ScrollView>
				<Image
					source={{
						uri: cloudinaryFeedUrl(item?.bannerImageUrl, "image"),
					}}
					resizeMode="cover"
					style={{
						aspectRatio: 16 / 9,
						zIndex: 0,
					}}
				/>
				<View
					style={{
						// height: 310,
						borderColor: color.grey,
						overflow: "hidden",
						borderBottomWidth: 1,
						marginHorizontal: "2.5%",
						paddingVertical: 15,
					}}
				>
					<View style={{ marginTop: 10 }}>
						<Text
							fontSize={24}
							fontWeight={"bold"}
							textAlign="left"
							color={color?.black}
						>
							{item?.title}
						</Text>

						<View
							style={{
								paddingBottom: 10,
								paddingTop: 10,
								display: "flex",
								flexDirection: "row",
								width: "100%",
								justifyContent: "space-between",
							}}
						>
							<Text color={color?.black}>
								<FontAwesome5
									name="clock"
									size={13}
									color={color?.black}
								/>
								<View style={{ width: 5 }} />
								{convertTime(item?.createdOn)}
							</Text>

							{profile?.systemUserId !== item?.authorId && (
								<Text
									fontSize={13}
									alignSelf="flex-end"
									color={color?.black}
								>
									written by <Text fontWeight={"medium"}>{item?.authorName}</Text>
								</Text>
							)}

							{profile?.systemUserId === item?.authorId && (
								<View
									style={{
										zIndex: 1,
										display: "flex",
										flexDirection: "row",
									}}
								>
									<Feather
										name="edit-3"
										size={20}
										color={color?.black}
										onPress={() => navigate("CreateBlog", { item })}
									/>
									<View style={{ width: 10 }} />

									<MaterialIcons
										name="delete-outline"
										style={{ color: "red" }}
										size={20}
										color={color?.black}
										onPress={() => {
											setConfirmDelete(true);
										}}
									/>
								</View>
							)}
						</View>
					</View>
				</View>

				<View style={{ paddingHorizontal: "2.5%", marginTop: 15 }}>
					<Text
						color={color?.black}
						fontWeight={"medium"}
						fontSize={16}
						style={{ marginVertical: 10 }}
					>
						{item?.shortDescription}
					</Text>
					<HTMLView
						TextComponent={(props) => {
							return <Text color={color?.black}>{props.children}</Text>;
						}}
						value={item?.description}
						style={{ color: color?.black, paddingBottom: 20 }}
					/>
				</View>
			</ScrollView>

			<View
				style={{ paddingTop: 10, marginBottom: Platform.OS === "ios" ? 15 : 5 }}
			>
				<View style={styles.bottomcontainer}>
					<View style={styles.reactionView}>
						{checkLike ? (
							<AntDesign
								name={"like1"}
								style={{
									padding: 5,
									marginRight: -5,
								}}
								color={color.primary}
								size={24}
							/>
						) : (
							<AntDesign
								name={"like2"}
								style={{
									padding: 5,
									marginRight: -5,
								}}
								onPress={() => {
									likeFunc();
								}}
								color={color.subTitle}
								size={24}
							/>
						)}

						<Text
							style={[styles.reactionCount, { color: color.subTitle }]}
							onPress={() =>
								navigate("ViewLike", {
									fromBlog: true,
									userReaction: item?.reactions,
									increementLike: increementLike,
									blogLikeID: id,
									setIncreementLike: setIncreementLike,
								})
							}
						>
							{item?.totalReactions + increementLike}
						</Text>
					</View>

					<View style={styles.commentView}>
						<AppFabButton
							size={16}
							onPress={() => {
								setPostId(id), setBlogComment(true), commentSheetRef?.current?.open();
							}}
							icon={
								<Ionicons
									name="chatbubble-outline"
									color={color.subTitle}
									size={22}
								/>
							}
						/>

						<Text style={{ color: color.subTitle, fontSize: 16 }}>
							{commentCount ? commentCount : item?.totalComments}
						</Text>
					</View>
				</View>
			</View>

			<CommentBottomSheet commentSheetRef={commentSheetRef} />

			{confirmDelete && (
				<ConfirmModal
					setModalVisible={() => {
						setConfirmDelete(false);
					}}
					btnLabel={"Delete"}
					message={"Are you sure,\n you want to delete this blog?"}
					onPress={deleleBlog}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	bottomcontainer: {
		flexDirection: "row",
		marginTop: -10,
		width: "95%",
		// paddingLeft: 10,
		alignSelf: "center",
	},
	reactionView: {
		alignItems: "center",
		flexDirection: "row",
	},
	reactionCount: { fontSize: 16, paddingLeft: 10 },
	commentView: {
		alignItems: "center",
		flexDirection: "row",
		marginLeft: 20,
	},
});

export default ViewBlog;
