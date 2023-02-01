import { View, StyleSheet } from "react-native";
import React, { memo, useEffect } from "react";
import FeedProfile from "./FeedSkeleton/FeedProfile";
import FeedHeader from "./FeedSkeleton/FeedHeader";
import FeedContent from "./FeedSkeleton/FeedContent";
import FeedFooter from "./FeedSkeleton/FeedFooter";
import color from "../../../constants/env/color";

function RenderFeedItem({
	item,
	business,
	setReportModal,
	reportModal,
	setDeletePostModal,
	setToggleFeed,
	toggleFeed,
	setFeedPage,
	setFeedData,
	commentSheetRef,
	refReportSheet,
	...props
}) {
	const [increementLike, setIncreementLike] = React.useState(0);
	const [likeOnOurPost, setLikeOnOurPost] = React.useState(false);
	const [defLike, setDefLike] = React.useState(false);

	useEffect(() => {
		setIncreementLike(item.totalReactions);

		return () => {};
	}, [item]);

	return (
		<View
			style={[
				styles.mainView,
				{ backgroundColor: color?.gradientWhite, borderColor: color?.border },
			]}
		>
			<View style={styles.grid}>
				<FeedProfile item={item} />
				<View style={styles.header}>
					<FeedHeader
						refReportSheet={refReportSheet}
						setReportModal={setReportModal}
						item={item}
						setDeletePostModal={setDeletePostModal}
					/>
				</View>
			</View>

			<View style={{ flex: 1 }}>
				<FeedContent item={item} />
			</View>

			<FeedFooter
				commentSheetRef={commentSheetRef}
				setIncreementLike={setIncreementLike}
				increementLike={increementLike}
				defLike={defLike}
				setLikeOnOurPost={setLikeOnOurPost}
				likeOnOurPost={likeOnOurPost}
				item={item}
			/>
		</View>
	);
}
// }

const styles = StyleSheet.create({
	mainView: {
		borderWidth: 1,

		width: "100%",
		alignSelf: "flex-end",
		marginBottom: 17,
		borderRadius: 16,
		// overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 2,
		paddingBottom: 15,
	},
	grid: {
		alignSelf: "center",
		width: "95%",
		flexDirection: "row",
		height: 56,
		alignItems: "center",
	},
	header: {
		flexDirection: "row",
		height: "100%",
		width: "87%",
		borderBottomColor: color.greyText,
		justifyContent: "space-between",
		marginLeft: 10,
	},
});

export default memo(RenderFeedItem);
