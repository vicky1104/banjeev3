import { Text } from "native-base";
import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";
import color from "../../../../../constants/env/color";
import { AppContext } from "../../../../../Context/AppContext";
import { profileUrl } from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import Reaction from "../../Reaction";

function AlertCommentItem({ item, setDelComment, setCommentId }) {
	const [showReaction, setShowReaction] = React.useState(false); //for reaction
	const [selectedReaction, setSelectedReaction] = React.useState();
	const [reaction, setReaction] = React.useState();
	const [imageError, setImageError] = React.useState();
	const { profile } = useContext(AppContext);
	const [increementLike, setIncreementLike] = React.useState(0);

	function deleteComment() {
		if (profile?.systemUserId === item.createdByUser) {
			setCommentId(item.id);
			setDelComment(true);
		}
		if (profile?.systemUserId === item.createdBy) {
			setCommentId(item.id);
			setDelComment(true);
		}
	}
	return (
		<TouchableWithoutFeedback onLongPress={deleteComment}>
			<View style={{ zIndex: 9 }}>
				<View style={styles.container}>
					<FastImage
						onError={({ nativeEvent: { error } }) => {
							setImageError(error);
						}}
						source={
							imageError
								? require("../../../../../../assets/EditDrawerIcon/neutral_placeholder.png")
								: {
										uri: profileUrl(item?.author?.avtarUrl),
								  }
						}
						style={styles.img}
					/>

					<View style={styles.view}>
						<Text
							style={{ fontSize: 14 }}
							color={color?.black}
						>
							{item?.author?.firstName} {item?.author?.lastName}
						</Text>

						<Text
							style={{ marginTop: 3 }}
							color={color?.black}
							onLongPress={deleteComment}
						>
							{item?.text}
						</Text>

						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text
								style={{ fontSize: 12 }}
								color={color?.black}
							>
								{convertTime(item?.createdOn)}
							</Text>

							<Reaction
								reactBlogComment={true}
								nodeType={"COMMENT"}
								postId={item?.id}
								reaction={reaction}
								setReaction={setReaction}
								selectedReaction={selectedReaction}
								setSelectedReaction={setSelectedReaction}
								showReaction={showReaction}
								setShowReaction={setShowReaction}
								size={16}
								marginLeft={5}
								ourLike={item?.reactions?.filter(
									(ele) => ele.user.id === profile?.systemUserId
								)}
								setIncreementLike={setIncreementLike}
							/>

							<Text
								onPress={() => {
									// setOpen(refRBSheet.current.open());
									setCommentId(item.id);
								}}
								style={{
									color: color.greyText,
									marginLeft: 3,
									fontSize: 14,
									paddingHorizontal: 5,
									color: color?.black,
								}}
							>
								{increementLike !== 0 ? item?.totalReactions + 1 : item?.totalReactions}
							</Text>

							{/* <Text
								onPress={() =>
									setReply({
										replyToCommentId: item?.id,
										feedId: item.feedId ? item.feedId : item.postId,
										text: item.text,
									})
								}
								style={{
									fontSize: 12,
									color: color.greyText,
									marginLeft: 20,
								}}
							>
								Reply
							</Text> */}
						</View>

						{/*```````````````` COMMENT OF COMMENT ````````````````*/}

						{item?.replies &&
							item?.replies.map((ele, i) => (
								<View
									key={i}
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
									}}
								>
									<FastImage
										source={{
											uri: profileUrl(ele?.createdByUser?.avtarUrl),
										}}
										style={{
											height: 25,
											width: 25,
											borderRadius: 15,
											borderWidth: 1,
											borderColor: color?.gradientWhite,
											marginRight: 10,
										}}
									/>
									<View>
										<Text
											style={{ fontSize: 12 }}
											color={color?.black}
										>
											{ele?.createdByUser?.username}
										</Text>

										<Text
											style={{ marginTop: 3 }}
											color={color?.black}
										>
											{ele?.text}
										</Text>

										<Text
											style={{ fontSize: 12 }}
											color={color?.black}
										>
											{convertTime(ele?.createdOn)}
										</Text>
									</View>
								</View>
							))}
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
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

export default AlertCommentItem;
