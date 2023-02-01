import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
	useRoute,
	useScrollToTop,
} from "@react-navigation/native";

import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import {
	Alert,
	Platform,
	StatusBar,
	StyleSheet,
	TouchableWithoutFeedback,
	Vibration,
	View,
} from "react-native";
import RNLocation from "react-native-location";

import { Text } from "native-base";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import { walkthroughable, CopilotStep } from "react-native-copilot";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import CircularProgress from "react-native-circular-progress-indicator";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { MainContext } from "../../../../../context/MainContext";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import ReportFeed from "../../../../constants/components/Cards/ReportFeed";
import { AppContext } from "../../../../Context/AppContext";
import { getFeed } from "../../../../helper/services/PostFeed";
import MainHeader from "./MainHeader";
import CommentBottomSheet from "../../../../constants/components/FeedComments/CommentBottomSheet";
import ConfirmModal from "../../../Others/ConfirmModal";
import { deletePost } from "../../../../helper/services/DeletePost";
import { showToast } from "../../../../constants/components/ShowToast";
import { createAlertService } from "../../../../helper/services/CreateAlertService";
import ToggleFeeds from "./ToggleFeeds";
import RenderTypeExoSkeleton from "./RenderTypeExoSkeleton";
import FeedCarousel from "./FeedCarousel";
import FeedExoSkeleton from "./FeedExoSkeleton";
import ExploreDrawer from "./ExploreDrawer";
import color from "../../../../constants/env/color";
import NotificationActionsHandler from "../../../../notification/NotificationActionsHandler";
import SinglePost from "../SinglePost";
import FeedView from "../../../../constants/components/FeedView/FeedView";
import { mapService } from "../../../../helper/services/SettingService";
import { useInfiniteQuery } from "react-query";

const CopilotView = walkthroughable(View);

function Main() {
	/**
	 *
	 * Decleration of Context and use of it
	 */

	const {
		setItems,
		createFeedData,
		setCommentCount,
		toggleFeed,
		setToggleFeed,
		openPostModal,
		setModalData,
	} = useContext(MainContext);
	const { neighbourhood, location } = useContext(AppContext);
	/**
	 *
	 * Decleration of state
	 */
	const [reportModal, setReportModal] = useState(false);
	const [deletePostModal, setDeletePostModal] = useState(false);
	const [time, setTime] = useState(0);
	const [disable, setDisable] = useState(false);
	/**
	 *
	 * Uses of refs
	 */
	const scrollToTop = useRef(null);
	const refReportSheet = useRef();
	const mainScrollVideoPlayer = useRef();
	const commentSheetRef = useRef();
	const timer = useRef();
	/**
	 *
	 * Uses of hooks
	 */
	useScrollToTop(scrollToTop);
	const { setOptions, navigate, setParams, addListener } = useNavigation();
	const { params, name } = useRoute();
	const isFocused = useIsFocused();
	const headerHeight = useHeaderHeight();
	const {
		isLoading,
		refetch,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		["feed", toggleFeed, neighbourhood],
		async ({ pageParam = 0 }) => {
			let x = await getFeed({
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
				pageId: !toggleFeed
					? neighbourhood?.payload?.id
					: "62401d53e3a009309544d3e8",
				pageName: !toggleFeed ? neighbourhood?.payload?.name : "Global-Feeds",
				percentage: 0,
				reactions: null,
				page: pageParam,
				pageSize: 10,
				reactionsCount: null,
				recentComments: null,
				text: null,
				totalComments: null,
				totalReactions: null,
				visibility: null,
				excludeGlobalFeeds: !toggleFeed ? "true" : null,
			});
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
	useLayoutEffect(() => {
		setItems([
			{
				name: "Feed",
				iconType: Feather,
				iconName: "edit",
				iconSize: 22,
				title: "Post",
				onPress: () => {
					createFeedData([]), navigate("CreateFeed");
				},
			},

			{
				name: "Alerts",
				iconType: Feather,
				iconName: "alert-triangle",
				iconSize: 22,
				title: "Alert",
				onPress: () => navigate("SelectAlertLocation"),
			},
			{
				name: "Create Group",
				iconType: AntDesign,
				iconName: "addusergroup",
				iconSize: 25,
				title: "Community",
				onPress: () => navigate("CreateGroup"),
			},
		]);

		setOptions({
			headerStyle: {
				backgroundColor: color?.gradientWhite,
			},
			headerRight: () => (
				<CopilotStep
					text="Click to send&nbsp;an EMERGENCY alert to nearby neighbors"
					order={1}
					name="panic"
				>
					<CopilotView
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<View
							style={{
								height: Platform.select({
									android: headerHeight - Constants.statusBarHeight - 5,
									ios: 60,
								}),
								width: 165,
								backgroundColor: "grey",
								borderTopLeftRadius: 25,
								borderBottomLeftRadius: 25,
								alignItems: "center",
								justifyContent: "space-between",
								flexDirection: "row",
								// overflow: "hidden",
							}}
						>
							<TouchableWithoutFeedback
								delayPressIn={0}
								disabled={disable}
								onPressIn={() => {
									btnPressIn();
								}}
								onPressOut={() => {
									btnPressOut();
								}}
							>
								<View
									style={{
										height: Platform.select({
											android: headerHeight - Constants.statusBarHeight - 5,
											ios: 60,
										}),
										width: Platform.select({
											android: headerHeight - Constants.statusBarHeight - 5,
											ios: 60,
										}),
										backgroundColor: "red",
										borderRadius: headerHeight - Constants.statusBarHeight - 5 / 2,
										alignItems: "center",
										justifyContent: "center",
										elevation: 5,
										marginLeft: -10,
									}}
								>
									<Text fontWeight={"bold"}>Panic</Text>
								</View>
							</TouchableWithoutFeedback>
							<Text
								ml={1}
								fontSize={12}
								numberOfLines={2}
								width="32%"
								textAlign={"center"}
							>
								Press for 3 second
							</Text>

							<AppFabButton
								onPress={() => navigate("FeedNotification")}
								size={20}
								icon={
									<React.Fragment>
										<MaterialCommunityIcons
											name="bell-outline"
											size={25}
											color={"white"}
										/>
									</React.Fragment>
								}
							/>
						</View>
					</CopilotView>
				</CopilotStep>
			),

			headerLeft: () => (
				<Fragment>
					<View
						style={{
							width: 130,
							justifyContent: "center",
							height: "100%",
							marginLeft: 6,
							height: Platform.select({
								android: headerHeight - Constants.statusBarHeight - 5,
								ios: 150,
							}),
						}}
					>
						<FastImage
							source={require("../../../../../assets/EditDrawerIcon/logo.png")}
							style={{ width: 130, height: 50 }}
							resizeMode="contain"
						/>
					</View>
				</Fragment>
			),
		});
	}, [disable, headerHeight, Constants, location]);

	useEffect(() => {
		try {
			load();
			return () => {
				if (params?.feedData) {
					setParams({ feedData: null });
				}
			};
			async function load() {
				if (params?.feedData) {
					await refetch();
				}
			}
		} catch (err) {
			console.warn("second", err);
		}
	}, [params]);

	useEffect(() => {
		setToggleFeed(neighbourhood !== "loading" && !neighbourhood);
	}, [neighbourhood]);

	// const files = useReciveData();

	useEffect(() => {
		// console.warn(files, "filess");
		if (time > 3) {
			Vibration.cancel();
			clearInterval(timer.current);
			setTime(0);

			RNLocation.getLatestLocation({ timeout: 2000 })
				.then((pos) => {
					const { longitude, latitude } = pos;
					mapService([latitude, longitude])
						.then((address) => {
							createAlertService({
								anonymous: false,
								videoUrl: [],
								imageUrl: [],
								eventCode: "EMERGENCY",
								eventName: "EMERGENCY",
								location: {
									coordinates: [longitude, latitude],
									type: "Point",
								},
								metaInfo: { address: address.data.results[0]?.formatted_address },
								sendTo: "NEAR_BY_AND_EMERGENCY",
							})
								.then((res) => {
									setDisable(true);
									Alert.alert(
										"Help is on the way",
										"Nearby people and your emergency contact have been notified of your emergency",
										[{ text: "Ok" }]
									);
									setTimeout(() => {
										setDisable(false);
									}, 2000);
								})
								.catch((err) => {
									Alert.alert("Alert", err.message, [{ text: "Ok" }]);
									console.warn(err);
								});
						})
						.catch((err) => {
							console.warn(JSON.stringify(err));
						});
				})
				.catch((err) => console.warn(err));
		}
	}, [time]);

	/**
	 *
	 * Main api call for all operations
	 */

	function btnPressIn(params) {
		Vibration.vibrate(4 * 1000);
		if (time <= 3) {
			timer.current = setInterval(() => {
				setTime((prev) => prev + 1);
			}, 1000);
		}
	}

	function btnPressOut() {
		console.warn("pressout called...");
		Vibration.cancel();

		if (time > 0 || time <= 3) {
			console.warn("timer..called");

			// showToast("Hold button for 3 Second to send alerts to notify nearby people");
		}
		setTime(0);
		clearInterval(timer.current);
	}
	/**
	 *
	 * Virtualized List Functions and components are declare and used below
	 */

	const onRefresh = async () => {
		await refetch();
	};

	const onEndReached = async () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};
	const renderItem = ({ item, index: mIndex }) => {
		if (mIndex === 0) {
			return (
				<ToggleFeeds
					ref={(ref) => {
						mainScrollVideoPlayer.current = {
							...mainScrollVideoPlayer.current,
							[item?.key]: ref,
						};
					}}
					toggleFeed={toggleFeed}
					setData={async () => {
						await refetch();
					}}
					setToggleFeed={setToggleFeed}
				/>
			);
		} else if (item?.type !== "empty") {
			return (
				<FeedExoSkeleton
					item={item}
					screenName={name}
					refReportSheet={refReportSheet}
					setReportModal={setReportModal}
					setDeletePostModal={setDeletePostModal}
					commentSheetRef={commentSheetRef}
				>
					{item?.mediaContent?.length > 1 ? (
						<FeedCarousel
							// dotTypeInstagram={true}
							isFeed={true}
							item={item}
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
	const mainHeaderFunc = (
		<MainHeader
			refresh={isLoading}
			data={data}
		/>
	);

	if (isFocused) {
		return (
			<Fragment>
				<NotificationActionsHandler />
				<StatusBar
					translucent={true}
					backgroundColor={"transparent"}
				/>
				{time > 0 && (
					<View style={styles.timerBg}>
						<CircularProgress
							value={time <= 3 ? time : 3}
							radius={120}
							duration={time > 0 ? 1000 : 0}
							progressValueColor={"#ecf0f1"}
							maxValue={3}
							title={"Emergency"}
							titleColor={"white"}
							titleStyle={{ fontWeight: "bold" }}
						/>
					</View>
				)}

				<ExploreDrawer />

				<FeedView
					data={[
						{ type: "switch", key: Math.random() },
						...(data?.pages?.length > 0
							? toggleFeed
								? data.pages
										.map((ele) => ele.content)
										.flat()
										.filter((ele) => ele.type !== "neighbourhood-posts")
								: data.pages
										.map((ele) => ele.content)
										.flat()
										.filter((ele) => ele.type !== "global-posts")
							: [{ type: "empty", key: Math.random() }]),
					]}
					ListHeaderComponent={mainHeaderFunc}
					stickyHeaderIndices={[1]}
					playerRef={scrollToTop}
					onRefresh={onRefresh}
					refreshing={isLoading}
					renderItem={(e) => renderItem(e)}
					footerLoader={isLoading}
					onEndReached={onEndReached}
					isFocused={isFocused}
					mainScrollVideoPlayer={mainScrollVideoPlayer}
					ListFooterComponent={() => (
						<Fragment>
							{isFetchingNextPage && (
								<View
									style={{
										flex: 1,
										height: 100,
										paddingBottom: 30,
									}}
								>
									<AppLoading
										style={{ marginRight: 15 }}
										visible={true}
										size="small"
									/>
								</View>
							)}
							<View style={{ height: isFetchingNextPage ? 90 : 85 }} />
						</Fragment>
					)}
				/>

				{reportModal && (
					<ReportFeed
						refRBSheet={refReportSheet}
						onPress={async () => {
							await refetch();
						}}
						reportType={"feed"}
						setModalVisible={setReportModal}
						modalVisible={reportModal}
						feedId={reportModal}
					/>
				)}

				{deletePostModal && (
					<ConfirmModal
						btnLabel={"Delete"}
						title="Are you sure, You want to delete your post?"
						onPress={() => {
							deletePost(deletePostModal)
								.then(async () => {
									await refetch();
									showToast("Post deleted successfully");
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
	} else {
		return (
			<View
				style={{
					flex: 1,
					marginTop: Constants.statusBarHeight,
				}}
			>
				<StatusBar
					translucent={true}
					backgroundColor={"transparent"}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerMain: {
		height: "100%",
		width: "100%",
		zIndex: -1,
	},
	container: { flex: 1 },
	contentContainerStyle: {
		padding: 2,
		backgroundColor: color?.white,
		borderWidth: 1,
		borderTopWidth: 0,
	},
	header: {
		alignItems: "center",
		backgroundColor: "white",
		paddingVertical: 20,
	},
	panelHandle: {
		width: 40,
		height: 2,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 4,
	},
	item: {
		padding: 20,
		justifyContent: "center",
		backgroundColor: "white",
		alignItems: "center",
		marginVertical: 10,
	},
	timerBg: {
		zIndex: 2,
		height: "100%",
		width: "100%",
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
	},
});
export default Main;
