import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import Reaction from "../Reaction";

import { MainContext } from "../../../../../context/MainContext";
import { AppContext } from "../../../../Context/AppContext";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import { sharePost } from "../../../Other/ShareApp";
import { useEffect } from "react";
import color from "../../../../constants/env/color";

export default function FeedFooter({
	item,
	increementLike,
	setIncreementLike,
	defLike,
	commentSheetRef,
	likeOnOurPost,
	setLikeOnOurPost,
}) {
	const { navigate } = useNavigation();
	const { profile } = useContext(AppContext);
	// const commentSheetRef = useRef();
	const { setPostId, commentCount, postId, setBlogComment } =
		useContext(MainContext);

	const [latestcount, setLatestCount] = useState(commentCount);

	useEffect(() => {
		if (latestcount !== commentCount && item.id === postId) {
			console.warn("increeement comment count............	");
			setLatestCount(commentCount);
		}
	}, [commentCount, latestcount, item, postId]);

	return (
		<Fragment>
			<View style={styles.container}>
				<View style={styles.reactionView}>
					<Reaction
						nodeType={"FEED"}
						postId={item?.id}
						size={18}
						ourLike={item?.reactions?.filter(
							(ele) => ele.userId === profile?.systemUserId
						)}
						setIncreementLike={setIncreementLike}
						defLike={defLike}
						reaction={item?.totalReactions}
						setLikeOnOurPost={setLikeOnOurPost}
						likeOnOurPost={likeOnOurPost}
					/>

					<Text
						style={[styles.reactionCount, { color: color?.subTitle }]}
						onPress={() =>
							navigate("ViewLike", {
								blogLikeID: item.id,
							})
						}
					>
						{increementLike}
					</Text>
				</View>

				<View style={styles.commentView}>
					<AppFabButton
						size={16}
						onPress={() => {
							setBlogComment(false);
							setPostId(item.id);
							commentSheetRef?.current?.open();
						}}
						// onPress={() => navigate("Comment", { postId: item?.id })}
						icon={
							<Ionicons
								name="chatbubble-outline"
								color={color?.subTitle}
								size={18}
							/>
						}
					/>

					<Text style={{ color: color?.subTitle, fontSize: 12 }}>
						{latestcount ? latestcount : item?.totalComments}
					</Text>
				</View>

				<View style={{ position: "absolute", right: 0 }}>
					<AppFabButton
						onPress={() => {
							sharePost(
								item?.mediaContent.length > 0 &&
									cloudinaryFeedUrl(
										item?.mediaContent[0]?.src,
										item?.mediaContent[0]?.mimeType?.split("/")[0]
									),
								item?.mediaContent[0]?.mimeType?.split("/")[0],
								item?.text,
								item?.id,
								item?.mediaContent[0]?.src
							);
						}}
						size={16}
						icon={
							<MaterialCommunityIcons
								name="share-variant"
								color={color?.subTitle}
								size={18}
							/>
						}
					/>
				</View>
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginTop: 10,
		width: "95%",
		// paddingLeft: 10,
		alignSelf: "center",
	},
	reactionView: {
		alignItems: "center",
		flexDirection: "row",
	},
	reactionCount: { fontSize: 12, paddingLeft: 10 },
	commentView: {
		alignItems: "center",
		flexDirection: "row",
		marginLeft: 20,
	},
});
