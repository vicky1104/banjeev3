import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, VirtualizedList } from "react-native";
import color from "../../../../../constants/env/color";
import { getFeed } from "../../../../../helper/services/PostFeed";
import RenderFeedItem from "../../../Feed/RenderFeedItem";

function DetailPost({ id, name }) {
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [page, setPage] = useState(0);
	const [hasData, setHasData] = useState(false);

	const getMyFeed = useCallback(() => {
		if (name && id) {
			getFeed({
				author: null,
				authorId: null,
				createdOn: null,
				deleted: null,
				geoLocation: null,
				id: null,
				locationId: null,
				mediaContent: null,
				mediaRootDirectoryId: null,
				otherUserId: null,
				percentage: 0,
				reactions: null,
				page: page,
				pageSize: 5,
				reactionsCount: null,
				recentComments: null,
				text: null,
				totalComments: null,
				totalReactions: null,
				visibility: null,
				pageName: name,
				pageId: id,
				excludeGlobalFeeds: "true",
			})
				.then((res) => {
					if (res && res.length > 0) {
						setRefresh(false);
						setData((prev) => [...prev, ...res]);
						setHasData(true);
					} else {
						setHasData(false);
					}
				})
				.catch((err) => console.warn(err));
		}
	}, [name, id, page]);

	useEffect(() => {
		getMyFeed();
	}, [getMyFeed]);

	function renderItem({ item, index }) {
		return (
			<RenderFeedItem
				item={item}
				index={index}
				setDeletePostModal={() => {}}
				setReportModal={() => {}}
			/>
			// <View style={styles.mainView}>
			// 	<View style={styles.grid}>
			// 		<FeedProfile item={item} />
			// 		<View style={styles.header}>
			// 			<FeedHeader
			// 				item={item}
			// 				setDeletePostModal={() => {}}
			// 				setPostId={() => {}}
			// 			/>
			// 		</View>
			// 	</View>
			// 	<FeedContent item={item} />
			// 	<FeedFooter item={item} />
			// </View>
		);
	}
	return (
		// <LinearGradient
		// 	style={[styles.container, { backgroundColor: color?.gradientWhite }]}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{data.length > 0 && (
				<VirtualizedList
					style={{ zIndex: 999 }}
					data={data}
					alwaysBounceVertical={true}
					bounces={true}
					bouncesZoom={true}
					renderItem={renderItem}
					keyExtractor={(data) => Math.random()}
					getItemCount={(data) => data?.length}
					getItem={(data, index) => data[index]}
					showsVerticalScrollIndicator={false}
					removeClippedSubviews={true}
					initialNumToRender={5}
					onEndReached={() => {
						if (hasData) {
							setPage((prev) => prev + 1);
						}
					}}
					onEndReachedThreshold={0.01}
					scrollEventThrottle={150}
					refreshing={refresh}
					onRefresh={() => {
						if (page === 0) {
							setRefresh(true);
							setData([]);
							// apiCall();
							getMyFeed();
						} else {
							setRefresh(true);
							setData([]);
							getMyFeed();
							// apiCall();
						}
					}}
					ListEmptyComponent={() => {
						return (
							<View
								style={{
									height: Dimensions.get("screen").height - 130,
									width: Dimensions.get("screen").width,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text
									fontSize={16}
									color={color?.black}
								>
									NO post in this neighbourhood..!
								</Text>
							</View>
						);
					}}
				/>
			)}
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	// header: {
	// 	height: 56,
	// 	width: "100%",
	// 	position: "absolute",
	// 	top: 0,
	// 	zIndex: 1,
	// 	backgroundColor: "rgba(0,0,0,0.5)",
	// 	flexDirection: "row",
	// 	alignItems: "center",
	// 	justifyContent: "space-between",
	// },
	// header: {
	// 	flexDirection: "row",
	// 	height: "100%",
	// 	width: "87%",
	// 	borderBottomColor: color.greyText,
	// 	justifyContent: "space-between",
	// 	marginLeft: 20,
	// },

	container: {
		minHeight: Dimensions.get("screen").height - 147,
		width: "100%",
		zIndex: -1,
	},
	iconView: {
		flexDirection: "row",
		justifyContent: "space-between",
		// marginTop: 20,
		width: "70%",
		alignSelf: "center",
	},
	icon: {
		backgroundColor: "#33000000",
		height: 40,
		width: 40,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 0.5,
		borderColor: color.white,
	},
	iconLabel: { color: color.white, fontSize: 14, marginTop: 8 },
	tabView: {
		height: 46,

		// width: "96%",
		alignSelf: "center",
		flexDirection: "row",
		// backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "space-between",
	},
	textView: {
		zIndex: 9999999,
		justifyContent: "center",
		height: "100%",
		width: "48%",
		// borderTopLeftRadius: 10,
		// borderTopRightRadius: 10,
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderTopWidth: 0.5,
	},
	tab: {
		textAlign: "center",
		height: "100%",
		fontSize: 14,
		paddingTop: 15,
	},
	// grid: {
	// 	paddingLeft: "5%",
	// 	width: "100%",
	// 	flexDirection: "row",
	// 	height: 56,
	// 	alignItems: "center",
	// },
	profileHeader: {
		flexDirection: "row",
		height: "100%",
		width: "87%",
		borderBottomColor: color.greyText,
		justifyContent: "space-between",
		marginLeft: 20,
	},
	// mainView: {
	// 	width: "100%",
	// 	alignSelf: "flex-end",
	// 	marginBottom: 17,
	// 	backgroundColor: "white",
	// 	paddingBottom: 15,
	// },

	mainView: {
		width: "100%",
		alignSelf: "flex-end",
		marginBottom: 17,
		backgroundColor: "white",
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
export default DetailPost;
