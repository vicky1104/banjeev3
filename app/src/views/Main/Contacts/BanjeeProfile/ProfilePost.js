import { useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { Dimensions, StyleSheet, View, VirtualizedList } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import color from "../../../../constants/env/color";
import { OtherFeedService } from "../../../../helper/services/OtherFeedService";
import FeedCarousel from "../../Feed/NewFeedFlow/FeedCarousel";
import FeedExoSkeleton from "../../Feed/NewFeedFlow/FeedExoSkeleton";
import RenderTypeExoSkeleton from "../../Feed/NewFeedFlow/RenderTypeExoSkeleton";
const viewabilityConfig = {
	itemVisiblePercentThreshold: 100,
};

export default function ProfilePost({
	setReportModal,
	data,
	setData,
	commentSheetRef,
	refReportSheet,
}) {
	const [page, setPage] = useState(0);
	const [refresh, setRefresh] = useState(false);
	// const [data, setData] = useState([]);
	const mainScrollVideoPlayer = useRef();
	const { profileId } = useRoute().params;
	const { setCommentCount } = useContext(MainContext);

	const otherFeed = React.useCallback(
		() =>
			OtherFeedService({
				author: null,
				authorId: null,
				createdOn: null,
				deleted: null,
				geoLocation: null,
				id: null,
				locationId: null,
				mediaContent: null,
				mediaRootDirectoryId: null,
				otherUserId: profileId,
				page: page,
				pageId: null,
				pageName: null,
				pageSize: 15,
				percentage: 0,
				reactions: null,
				reactionsCount: null,
				recentComments: null,
				text: null,
				totalComments: null,
				totalReactions: null,
				visibility: null,
			})
				.then((res) => {
					setRefresh(false);
					if (res.content && res.content.length > 0) {
						setData((prev) => [...prev, ...res.content]);
					}
				})
				.catch((err) => console.log(err)),
		[profileId, page]
	);
	useEffect(() => {
		otherFeed();
	}, [otherFeed]);

	// function renderItem({ item, index }) {
	// 	return (
	// 		<RenderFeedItem
	// 			refReportSheet={refReportSheet}
	// 			item={item}
	// 			index={index}
	// 			setReportModal={setReportModal}
	// 			commentSheetRef={commentSheetRef}
	// 			// setDeletePostModal={setDeletePostModal}
	// 		/>
	// 	);

	// 	// return (
	// 	// 	<View style={styles.mainView} key={item.id}>
	// 	// 		<View style={styles.grid}>
	// 	// 			<FeedProfile item={item} />
	// 	// 			<View style={styles.header}>
	// 	// 				<FeedHeader
	// 	// 					item={item}
	// 	// 					reportModal={reportModal}
	// 	// 					setReportModal={setReportModal}
	// 	// 				/>
	// 	// 			</View>
	// 	// 		</View>
	// 	// 		<FeedContent item={item} />
	// 	// 		<FeedFooter item={item} />
	// 	// 	</View>
	// 	// );
	// }

	const renderItem = ({ item, index: mIndex }) => {
		return (
			<FeedExoSkeleton
				item={item}
				refReportSheet={refReportSheet}
				setReportModal={setReportModal}
				// setDeletePostModal={setDeletePostModal}
				commentSheetRef={commentSheetRef}
			>
				{item?.mediaContent?.length > 1 ? (
					<FeedCarousel
						item={item}
						isFeed={true}
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: ref?.itemRef,
								};
							}
						}}
					/>
				) : (
					<View
						style={{
							alignItems: "center",
							display: "flex",
							flex: 1,
							overflow: "hidden",
							// height: 350,
						}}
					>
						<RenderTypeExoSkeleton
							item={item?.mediaContent?.[0]}
							id={item?.id}
							ref={(ref) => {
								if (ref?.itemRef) {
									mainScrollVideoPlayer.current = {
										...mainScrollVideoPlayer.current,
										[item?.key]: ref?.itemRef,
									};
								}
							}}
						/>
					</View>
				)}
			</FeedExoSkeleton>
		);
	};
	const _onViewableItemsChanged = useCallback(
		(props) => {
			const changed = props.changed;
			changed.forEach((item) => {
				const cell = mainScrollVideoPlayer?.current?.[item.key];
				if (cell) {
					if (cell?.length > 0) {
						if (!item.isViewable) {
							cell?.forEach((x) => x?.pause());
						}
					} else {
						if (item.isViewable) {
							cell?.play();
						} else {
							cell?.pause();
						}
					}
				}
			});
		},
		[mainScrollVideoPlayer]
	);

	return (
		<Fragment>
			{data?.length === 0 ? (
				<View
					style={{
						height: Dimensions.get("screen").height,
						width: Dimensions.get("screen").width,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text color={color?.black}>User haven't posted any post...!</Text>
				</View>
			) : (
				<VirtualizedList
					data={data}
					// data={data.map((ele) => ({ ...ele, key: Math.random() }))}
					renderItem={renderItem}
					keyExtractor={(data) => data.id}
					getItemCount={(data) => data.length}
					getItem={(data, index) => data[index]}
					showsVerticalScrollIndicator={false}
					onRefresh={() => {
						setCommentCount();
						setPage(0);
						otherFeed();
					}}
					refreshing={refresh}
					onEndReachedThreshold={0.1}
					onEndReached={() => setPage((prev) => prev + 1)}
					removeClippedSubviews={true}
					onViewableItemsChanged={_onViewableItemsChanged}
					initialNumToRender={3}
					maxToRenderPerBatch={3}
					viewabilityConfig={viewabilityConfig}
					windowSize={5}
				/>
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
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
