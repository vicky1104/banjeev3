import React, {
	Fragment,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Modal, Text } from "native-base";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ViewMoreText from "react-native-view-more-text";
import { MainContext } from "../../../../context/MainContext";
import { showToast } from "../../../constants/components/ShowToast";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { deletePost } from "../../../helper/services/DeletePost";
import { searchFeed } from "../../../helper/services/SearchFeedbyId";
import { sharePost } from "../../Other/ShareApp";
import ConfirmModal from "../../Others/ConfirmModal";
import FeedHeader from "./FeedSkeleton/FeedHeader";
import FeedProfile from "./FeedSkeleton/FeedProfile";
import Reaction from "./Reaction";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import CommentBottomSheet from "../../../constants/components/FeedComments/CommentBottomSheet";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import Constants from "expo-constants";
import { useCallback } from "react";
import RenderTypeExoSkeleton from "./NewFeedFlow/RenderTypeExoSkeleton";
import ReportFeed from "../../../constants/components/Cards/ReportFeed";

const viewabilityConfig = {
	itemVisiblePercentThreshold: 100,
};

function SinglePost() {
	const carouserItemRef = useRef();
	// const { params } = useRoute();
	const { _rtcEngine } = React.useContext(CallRtcEngine);
	const [item, setItem] = useState();
	const [deletePostModal, setDeletePostModal] = useState(false);
	const [reportModal, setReportModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const { navigate } = useNavigation();
	const { profile } = useContext(AppContext);
	const [likeOnOurPost, setLikeOnOurPost] = React.useState(true);
	const [increementLike, setIncreementLike] = React.useState(0);
	const [index, setIndex] = React.useState(0);
	const refReportSheet = useRef();

	const {
		setPostId,
		setBlogComment,
		openPostModal,
		setOpenPostModal,
		modalData,
		setModalData,
	} = useContext(MainContext);

	const commentSheetRef = useRef();
	const c = React.useRef();

	useEffect(() => {
		if (modalData?.feedID) {
			setLoading(true);
			searchFeed(modalData.feedID)
				.then((res) => {
					setLoading(false);
					setItem(res);
				})
				.catch((err) => {
					console.warn(err, "error is");
					if (err.statusCode === -404) {
						showToast("Requested post no longer available");
						setOpenPostModal(false);
						setModalData();
					} else {
						console.warn(err);
					}
				});
		} else {
			setItem(modalData);
		}
	}, [modalData]);

	// useEffect(() => {
	// 	if (params?.newItem) {
	// 		setLoading(false);
	// 		setItem(params.newItem);
	// 	} else if (params.feedId) {
	// 		setLoading(true);
	// searchFeed(params.feedId)
	// 	.then((res) => {
	// 		setLoading(false);
	// 		setItem(res);
	// 	})
	// 	.catch((err) => {
	// 		console.warn(err, "error is");
	// 		if (err.statusCode) {
	// 			showToast("Requested feed no longer available");
	// 			goBack();
	// 		} else {
	// 			console.warn(err);
	// 		}
	// 	});
	// 	}
	// }, [params]);

	let longitude = item?.locationId?.split(":")[1]?.split(",")[0];
	let latitude = item?.locationId?.split(":")[2]?.split(",")[0];
	let locationName = item?.locationId?.split(":")[3]?.split("}")[0];

	async function navigateToMap() {
		const scheme = Platform.select({
			ios: "maps:0,0?q=",
			android: "geo:0,0?q=",
		});
		const latLng = `${latitude},${longitude}`;
		const label = locationName;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}

	const renderItem = ({ item: ele }) => {
		return (
			<View
				style={{
					alignItems: "center",
					display: "flex",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<RenderTypeExoSkeleton
					fullScreen={true}
					item={ele}
					id={ele?.id}
					ref={(ref) => {
						if (ref?.itemRef) {
							carouserItemRef.current = {
								...carouserItemRef.current,
								[ele?.key]: ref?.itemRef,
							};
						}
					}}
				/>
			</View>
		);
	};

	const _onViewableItemsChanged = useCallback(
		(props) => {
			const changed = props.changed;
			changed.forEach((item) => {
				const cell = carouserItemRef?.current?.[item.key];
				if (cell) {
					if (item.isViewable) {
						cell?.play();
					} else {
						cell?.pause();
					}
				}
			});
		},
		[carouserItemRef]
	);

	function renderViewMore(onPress) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.moreText}>
					<MaterialCommunityIcons
						name="chevron-down"
						size={20}
						color={color.greyText}
					/>
					<Text style={{ color: color.greyText }}>Show more</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	function renderViewLess(onPress) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.moreText}>
					<MaterialCommunityIcons
						name="chevron-up"
						size={20}
						color={color.greyText}
					/>
					<Text style={{ color: color.greyText }}>Show less</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	return (
		<View
			style={{
				backgroundColor: color?.gradientWhite,
				height: Dimensions.get("screen").height,
				width: "100%",
			}}
		>
			{loading ? (
				<AppLoading
					visible={loading}
					height={"100%"}
				/>
			) : (
				<Modal
					animationPreset="fade"
					closeOnOverlayClick={false}
					isOpen={openPostModal}
					onClose={() => setOpenPostModal(!openPostModal)}
					size={"full"}
					backdropVisible={true}
				>
					<Modal.Content
						justifyContent={"flex-end"}
						style={styles?.content}
						minH={Dimensions.get("screen").height - Constants.statusBarHeight}
						maxH={Dimensions.get("screen").height - Constants.statusBarHeight}
					>
						<Modal.Header
							padding={0}
							style={{
								height: 70,
								width: "100%",
							}}
						>
							<View style={styles.grid}>
								<FeedProfile
									item={item}
									clearModalData={() => setModalData()}
									handleClosePostModal={() => setOpenPostModal(false)}
								/>
								<View style={styles.header}>
									<FeedHeader
										hanndleSetModalData={(e) => setModalData(e)}
										clearModalData={() => setModalData()}
										handleOpenPostModal={() => setOpenPostModal(true)}
										handleClosePostModal={() => setOpenPostModal(false)}
										refReportSheet={refReportSheet}
										singlePost={true}
										item={item}
										setDeletePostModal={setDeletePostModal}
										setReportModal={setReportModal}
									/>
								</View>
							</View>
						</Modal.Header>

						<View
							style={{
								position: "absolute",
								top: 70,
								zIndex: 99,
								width: "100%",
								flex: 1,
								backgroundColor: "rgba(0,0,0,0.3)",
							}}
						>
							<ScrollView
								style={{
									zIndex: 99,
									maxHeight: Dimensions.get("screen").height - 185,
								}}
							>
								{item?.text?.length > 0 && (
									<ViewMoreText
										numberOfLines={item?.mediaContent?.length === 0 ? undefined : 3}
										renderViewMore={renderViewMore}
										renderViewLess={renderViewLess}
										textStyle={{
											width: "95%",
											alignSelf: "center",
											flex: 1,
											marginVertical: 10,
										}}
									>
										<Text color={color?.black}>{item?.text.trim()}</Text>
									</ViewMoreText>
								)}
							</ScrollView>
						</View>

						<Modal.Body
							alignSelf={"center"}
							padding={0}
							height={Dimensions.get("screen").height - 185}
						>
							<View
								style={{
									height: "100%",
									width: "100%",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{/* {locationName && (
									<TouchableWithoutFeedback onPress={navigateToMap}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												// marginLeft: 5,
												// marginBottom: 5,
											}}
										>
											<EvilIcons
												name="location"
												size={24}
												color={color?.link}
											/>
											<Text
												color={color?.link}
												numberOfLines={1}
												width="90%"
											>
												{locationName}
											</Text>
										</View>
									</TouchableWithoutFeedback>
								)} */}

								{item?.mediaContent?.length > 0 && (
									<View
										style={{
											backgroundColor: color?.gradientWhite,
											width: "100%",
											alignSelf: "center",
											marginTop: item?.text?.length === 0 ? 10 : 0,
											height: "100%",
											marginBottom: 0,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Carousel
											enableSnap
											dotColor={color.primary}
											inactiveDotColor={"grey"}
											layout="default"
											ref={c}
											enableMomentum={true}
											data={item.mediaContent.map((ele) => ({
												...ele,
												key: Math.random(),
											}))}
											keyExtractor={(ele) => ele.key}
											onViewableItemsChanged={_onViewableItemsChanged}
											initialNumToRender={3}
											maxToRenderPerBatch={3}
											viewabilityConfig={viewabilityConfig}
											windowSize={5}
											renderItem={renderItem}
											sliderWidth={Dimensions.get("screen").width}
											itemWidth={Dimensions.get("screen").width}
											onSnapToItem={(index) => setIndex(index)}
										/>
									</View>
								)}
							</View>
						</Modal.Body>

						<Modal.Footer
							style={{ backgroundColor: color?.gradientWhite, marginTop: 0 }}
						>
							<View
								style={{
									// position: "absolute",
									backgroundColor: color?.gradientWhite,
									// bottom: 0,
									height: 40,
									width: "100%",
								}}
							>
								<Fragment>
									<View
										style={{
											position: "absolute",
											bottom: -22,
											right: "40%",
											zIndex: 99,
										}}
									>
										<Pagination
											dotsLength={item?.mediaContent?.length}
											carouselRef={c}
											renderDots={(e) => (
												<View
													style={{
														backgroundColor: "rgba(255,255,255,0.3)",
														paddingHorizontal: 10,
														paddingVertical: 5,
														borderRadius: 8,
													}}
												>
													<Text style={{ fontSize: 12 }}>
														{e + 1}/{item?.mediaContent?.length}
													</Text>
												</View>
											)}
											activeDotIndex={index}
										/>
									</View>
									<View style={styles.footerContainer}>
										<View style={styles.reactionView}>
											<Reaction
												likeOnOurPost={likeOnOurPost}
												setLikeOnOurPost={setLikeOnOurPost}
												nodeType={"FEED"}
												postId={item?.id}
												size={24}
												ourLike={item?.reactions?.filter(
													(ele) => ele.userId === profile?.systemUserId
												)}
												setIncreementLike={setIncreementLike}
											/>

											<Text
												style={[styles.reactionCount, { color: color?.subTitle }]}
												onPress={() => {
													// setOpenPostModal(false);

													navigate("ViewLike", {
														userReaction: item?.reactions,
														blogLikeID: item.id,
														increementLike: increementLike,
													});
												}}
											>
												{increementLike !== 0
													? item?.totalReactions + 1
													: item?.totalReactions}
											</Text>
										</View>

										<View style={styles.commentView}>
											<AppFabButton
												size={16}
												onPress={() => {
													setBlogComment(false),
														setPostId(item.id),
														commentSheetRef?.current?.open();
												}}
												// onPress={() => navigate("Comment", { postId: item?.id })}
												icon={
													<Ionicons
														name="chatbubble-outline"
														color={color?.subTitle}
														size={24}
													/>
												}
											/>

											<Text
												style={{
													marginLeft: 4,
													color: color?.subTitle,
													fontSize: 16,
												}}
											>
												{item?.totalComments}
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
														size={22}
													/>
												}
											/>
										</View>
									</View>
								</Fragment>
							</View>
						</Modal.Footer>

						{deletePostModal && (
							<ConfirmModal
								btnLabel={"Delete"}
								title="Are you sure, you want to delete your post?"
								onPress={() => {
									deletePost(deletePostModal);
									setDeletePostModal(false);
									setOpenPostModal(false);
									setModalData();
									showToast("Post deleted successfully");
								}}
								setModalVisible={setDeletePostModal}
								message={"Delete post"}
							/>
						)}
					</Modal.Content>
				</Modal>
			)}

			<ReportFeed
				refRBSheet={refReportSheet}
				onPress={() => {
					setOpenPostModal(false);
					setItem();
				}}
				reportType={"feed"}
				setModalVisible={setReportModal}
				modalVisible={reportModal}
				feedId={reportModal}
			/>

			<CommentBottomSheet commentSheetRef={commentSheetRef} />
		</View>
	);
}

const styles = StyleSheet.create({
	mainView: {
		height: "100%",
		width: "100%",
		backgroundColor: color?.gradientWhite,
		justifyContent: "center",
		// paddingBottom: 15,
	},
	moreText: {
		flexDirection: "row",
		width: "95%",
		alignSelf: "center",
		marginTop: -7,
		marginBottom: 5,
		alignItems: "center",
	},
	grid: {
		alignSelf: "center",
		width: "100%",
		paddingHorizontal: "2.5%",
		flexDirection: "row",
		height: "100%",
		backgroundColor: color?.gradientWhite,
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
	footerContainer: {
		flexDirection: "row",
		width: "95%",
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
	headerView: {
		position: "absolute",
		top: 0,
		zIndex: 99,
		alignSelf: "center",
		width: "100%",
	},

	content: {
		marginBottom: 0,
		marginTop: "auto",
		// backgroundColor: "red",
		backgroundColor: color?.gradientWhite,
	},
});

export default memo(SinglePost);
