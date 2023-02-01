import React, { useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import { Text } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import color from "../../../../constants/env/color";
import { emojies } from "../../../../utils/util-func/emojies";
import { commentLike } from "../../../../helper/services/CommentLikes";
import { getBlogCommentReaction } from "../../../../helper/services/Blogs";
import { MainContext } from "../../../../../context/MainContext";

function ReactionSheet() {
	const [data, setData] = React.useState([]);

	const { postId, blogComment, commentSheetRef } = useContext(MainContext);

	useEffect(() => {
		if (blogComment) {
			getBlogCommentReaction(postId)
				.then((res) => {
					setData(res);
				})
				.catch((err) => console.log(err));
		} else {
			commentLike(postId)
				.then((res) => {
					setData(res);
				})
				.catch((err) => console.log(err, "errror"));
		}
	}, [postId, blogComment]);

	return (
		<RBSheet
			customStyles={{
				container: { borderRadius: 10, backgroundColor: color?.gradientWhite },
			}}
			height={400}
			ref={commentSheetRef}
			dragFromTopOnly={true}
			closeOnDragDown={true}
			closeOnPressMask={true}
			draggableIcon
		>
			<ScrollView>
				{data.length > 0 &&
					data.map((ele, i) => (
						<View
							style={styles.container}
							key={i}
						>
							<View style={styles.subContainer}>
								<FastImage
									source={
										ele?.user?.avtarUrl
											? { uri: profileUrl(ele?.user?.avtarUrl) }
											: require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")
									}
									style={styles.img}
								/>
								{emojies(ele?.reactionType, false, 18)}
							</View>

							<View style={styles.name}>
								<Text
									style={{ width: "80%" }}
									numberOfLines={3}
								>
									{ele?.user?.username}
								</Text>
							</View>
						</View>
					))}
			</ScrollView>
		</RBSheet>
	);
}

const styles = StyleSheet.create({
	// bottomsheet: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
	container: {
		zIndex: 1,
		alignItems: "center",
		flexDirection: "row",
	},
	subContainer: {
		height: 40,
		width: 40,
		marginLeft: 10,
		marginRight: 20,
		position: "relative",
		alignItems: "center",
	},
	img: { height: 40, width: 40, borderRadius: 20 },
	name: {
		width: "100%",
		borderBottomWidth: 0.5,
		borderColor: color.grey,
		height: 70,
		justifyContent: "center",
	},
});

export default ReactionSheet;
