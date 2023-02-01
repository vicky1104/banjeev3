import { useIsFocused } from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { MainContext } from "../../../../../context/MainContext";
import CommentBottomSheet from "../../../../constants/components/FeedComments/CommentBottomSheet";
import FeedView from "../../../../constants/components/FeedView/FeedView";
import { showToast } from "../../../../constants/components/ShowToast";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { deletePost } from "../../../../helper/services/DeletePost";
import { MyPostFeed } from "../../../../helper/services/MyPostService";
import ConfirmModal from "../../../Others/ConfirmModal";
import FeedExoSkeleton from "../../Feed/NewFeedFlow/FeedExoSkeleton";
import RenderTypeExoSkeleton from "../../Feed/NewFeedFlow/RenderTypeExoSkeleton";
import SinglePost from "../../Feed/SinglePost";
import NeighbourhoodCard from "./NeighbourhoodCard";
import ProfileCard from "./ProfileCard";

export default function NewProfile() {
	const [deletePostModal, setDeletePostModal] = useState(false);
	const { setCommentCount, openPostModal } = useContext(MainContext);
	const mainScrollVideoPlayer = useRef();
	const commentSheetRef = useRef();

	const {
		isLoading,
		refetch,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		"myfeed",
		async ({ pageParam = 0 }) => {
			const payload = {
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
				page: pageParam,
				pageId: null,
				pageName: null,
				pageSize: 5,
				percentage: 0,
				reactions: null,
				reactionsCount: null,
				recentComments: null,
				text: null,
				totalComments: null,
				totalReactions: null,
				visibility: null,
			};

			let x = await MyPostFeed(payload);
			return x;
		},
		{
			getNextPageParam: (_lastPage, pages) => {
				if (pages?.[pages?.length - 1]?.last === false) {
					return pages?.[pages?.length - 1]?.number + 1;
				} else {
					return undefined;
				}
			},
		}
	);

	const renderHeader = useCallback(
		() => (
			<View style={{ marginBottom: 10 }}>
				<ProfileCard />
				<NeighbourhoodCard />
			</View>
		),
		[]
	);

	const renderItem = ({ item, index: mIndex }) => {
		if (mIndex === 0) {
			return (
				<Text
					ref={(ref) => {
						if (ref?.itemRef) {
							mainScrollVideoPlayer.current = {
								...mainScrollVideoPlayer.current,
								[item?.key]: ref,
							};
						}
					}}
					fontWeight={"bold"}
					fontSize={16}
					paddingLeft={"2.5%"}
					color={color?.black}
					style={{
						color: color?.black,
						paddingVertical: 10,
						borderBottomWidth: 1,
						borderColor: color?.gradientWhite,
						backgroundColor: color?.gradientWhite,
						zIndex: -1,
						marginBottom: 10,
					}}
				>
					Activity
				</Text>
			);
		} else {
			return (
				<FeedExoSkeleton
					item={item}
					// refReportSheet={refReportSheet}
					// setReportModal={setReportModal}
					setDeletePostModal={setDeletePostModal}
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
		}
	};

	const onRefresh = () => {
		setCommentCount();
		refetch();
	};

	const onEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};
	const isFocused = useIsFocused();
	return (
		<Fragment>
			<View style={styles.container}>
				<FeedView
					data={[
						{ type: "activity", key: Math.random() },
						...(data?.pages.length > 0
							? data?.pages
									?.map((ele) => ele.content)
									?.flat()
									.map((ele) => ({ ...ele, key: Math.random() }))
							: []),
					]}
					onRefresh={onRefresh}
					renderItem={(e) => renderItem(e)}
					onEndReached={onEndReached}
					ListFooterComponent={() => <View style={{ height: isLoading ? 0 : 90 }} />}
					refreshing={isLoading}
					isFocused={isFocused}
					mainScrollVideoPlayer={mainScrollVideoPlayer}
					stickyHeaderIndices={[1]}
					ListHeaderComponent={renderHeader}
					ListEmptyComponent={() => {
						if (data.pages.flat().length > 0) {
							return (
								<View style={{ alignItems: "center", flex: 1 }}>
									<Text color={color?.black}>You haven't created any post yet...!</Text>
								</View>
							);
						}
					}}
				/>
			</View>

			{deletePostModal && (
				<ConfirmModal
					btnLabel={"Delete"}
					title="Are you sure, you want to delete your post?"
					onPress={() => {
						deletePost(deletePostModal)
							.then(() => {
								refetch();
								// setData(data.filter((ele) => ele.id !== deletePostModal));
								showToast("Post Deleted Successfully ");
							})
							.catch((err) => console.warn(err));

						setDeletePostModal(false);
					}}
					setModalVisible={setDeletePostModal}
					message={"Delete post"}
				/>
			)}
			<CommentBottomSheet commentSheetRef={commentSheetRef} />
			{openPostModal && <SinglePost />}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		zIndex: -1,
		backgroundColor: "#07080D", // paddingBottom: 69,
	},
	filterView: {
		height: 34,
		position: "absolute",
		bottom: 100,
		flexDirection: "row",
		width: 256,
		alignSelf: "center",
		justifyContent: "space-between",
	},
	subView: {
		width: 120,
		borderWidth: 1,
		borderColor: "#666e7b",
		backgroundColor: "rgba(0,0,0,0.5)",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
	},
	filterView: {
		height: 34,
		position: "absolute",
		bottom: 20,
		flexDirection: "row",
		width: 256,
		alignSelf: "center",
		alignItems: "center",
		zIndex: 9,
		justifyContent: "center",
	},
	subView: {
		width: 120,
		borderWidth: 1,
		borderColor: "#666e7b",
		backgroundColor: "rgba(0,0,0,0.5)",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
		zIndex: 99,
	},
	moreText: {
		flexDirection: "row",
		width: "95%",
		alignSelf: "center",
		marginLeft: 20,
		alignItems: "center",
	},
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
