import { Avatar, Text } from "native-base";
import React, { useContext } from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { MainContext } from "../../../../../context/MainContext";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../utils/util-func/convertTime";
import Reaction from "../Reaction";

function AllComments({
	item,
	setCommentId,
	refRBSheet,
	setReply,
	setDelComment,
}) {
	const [showReaction, setShowReaction] = React.useState(false); //for reaction
	const [selectedReaction, setSelectedReaction] = React.useState();
	const [reaction, setReaction] = React.useState();
	const [imageError, setImageError] = React.useState();
	const { profile } = useContext(AppContext);
	const [increementLike, setIncreementLike] = React.useState(0);
	const { blogComment } = useContext(MainContext);

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
			<View style={{ zIndex: 9999 }}>
				<View style={styles.container}>
					<Avatar
						borderColor={color?.border}
						borderWidth={1}
						onError={({ nativeEvent: { error } }) => {
							setImageError(error);
						}}
						bgColor={color.gradientWhite}
						source={
							imageError
								? require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")
								: {
										uri: listProfileUrl(item?.createdBy),
								  }
						}
						style={styles.img}
					>
						<Text
							color={color?.black}
							style={{ fontSize: 14 }}
						>
							{blogComment
								? item?.author?.firstName?.[0]
								: item?.createdByUser?.firstName?.[0]}
						</Text>
					</Avatar>

					<View style={styles.view}>
						<Text
							color={color?.black}
							style={{ fontSize: 14 }}
						>
							{blogComment
								? `${item?.author?.firstName} ${item?.author?.lastName}`
								: `${item?.createdByUser?.firstName} ${item?.createdByUser?.lastName}`}
						</Text>

						<Text
							color={color?.black}
							style={{ marginTop: 3 }}
							onLongPress={deleteComment}
						>
							{item?.text}
						</Text>

						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text
								color={color?.black}
								style={{ fontSize: 12 }}
								opacity={70}
							>
								{convertTime(item?.createdOn)}
							</Text>

							<Reaction
								reactBlogComment={false}
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
								ourLike={
									blogComment
										? item?.reactions?.filter(
												(ele) => ele.user.id === profile?.systemUserId
										  )
										: item?.reactions?.filter(
												(ele) => ele.userId === profile?.systemUserId
										  )
								}
								setIncreementLike={setIncreementLike}
							/>

							<Text
								onPress={() => {
									refRBSheet?.current?.open();
									setCommentId(item.id);
								}}
								style={{
									color: color.greyText,
									marginLeft: 3,
									fontSize: 14,
									paddingHorizontal: 5,
								}}
							>
								{increementLike !== 0 ? item?.totalReactions + 1 : item?.totalReactions}
							</Text>

							<Text
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
							</Text>
						</View>

						{/*```````````````` COMMENT OF COMMENT ````````````````*/}

						{item?.replies &&
							item?.replies.map((ele, i) => {
								return (
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
												uri: listProfileUrl(ele?.createdBy),
											}}
											style={styles.replyImg}
										/>
										<View>
											<Text
												color={color?.black}
												style={{ fontSize: 12 }}
											>
												{ele?.createdByUser?.firstName} {ele?.createdByUser?.lastName}
											</Text>

											<Text
												color={color?.black}
												style={{ marginTop: 3 }}
											>
												{ele?.text}
											</Text>

											<Text
												color={color?.black}
												style={{ fontSize: 12 }}
												opacity={70}
											>
												{convertTime(ele?.createdOn)}
											</Text>
										</View>
									</View>
								);
							})}
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
		marginRight: 10,
		marginLeft: 16,
	},
	view: {
		width: (Dimensions.get("window").width = "70%"),
		flexDirection: "column",
	},
	replyImg: {
		height: 25,
		width: 25,
		borderRadius: 15,
		marginRight: 10,
	},
});

export default AllComments;
