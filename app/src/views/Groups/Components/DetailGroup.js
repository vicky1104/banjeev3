import {
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import React, { useRef } from "react";
import { useContext } from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	VirtualizedList,
	Alert,
	SafeAreaView,
	LayoutAnimation,
} from "react-native";
import ViewMoreText from "react-native-view-more-text";
import Lottie from "lottie-react-native";
import { MainContext } from "../../../../context/MainContext";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import {
	Entypo,
	Foundation,
	MaterialIcons,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import PushNotification from "react-native-push-notification";
import axios from "axios";
import { showToast } from "../../../constants/components/ShowToast";
import SocketContext from "../../../Context/Socket";
import { useState } from "react";
import { HStack, Skeleton, Text, VStack } from "native-base";
import { useEffect } from "react";
import {
	groupFindByIdService,
	joinGroupService,
	leaveGroupService,
} from "../../../helper/services/Community";
import { useCallback } from "react";
import { useLayoutEffect } from "react";
import { Fragment } from "react";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import { getFeed } from "../../../helper/services/PostFeed";
import RenderMainFeedItem from "../../Main/Feed/NewFeedFlow/RenderMainFeedItem";
import ConfirmModal from "../../Others/ConfirmModal";
import CommentBottomSheet from "../../../constants/components/FeedComments/CommentBottomSheet";
import { shareGroup } from "../../Other/ShareApp";
import AppMenu from "../../../constants/components/ui-component/AppMenu";
import ReportFeed from "../../../constants/components/Cards/ReportFeed";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { deletePost } from "../../../helper/services/DeletePost";
import FeedExoSkeleton from "../../Main/Feed/NewFeedFlow/FeedExoSkeleton";
import FeedCarousel from "../../Main/Feed/NewFeedFlow/FeedCarousel";
import RenderTypeExoSkeleton from "../../Main/Feed/NewFeedFlow/RenderTypeExoSkeleton";
import FeedView from "../../../constants/components/FeedView/FeedView";
import SinglePost from "../../Main/Feed/SinglePost";

const viewabilityConfig = {
	itemVisiblePercentThreshold: 100,
};
function DetailGroup(props) {
	const { params } = useRoute();

	const refReportSheet = useRef();
	const mainScrollVideoPlayer = useRef();
	const { createFeedData, setCommentCount, openPostModal, setModalData } =
		useContext(MainContext);
	const { socket } = useContext(SocketContext);
	const [visible, setVisible] = useState(true);
	const [footerVisible, setFooterVisible] = useState(true);
	const _rtcEngine = useContext(CallRtcEngine)?._rtcEngine;

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = React.useContext(AppContext)?.profile?.firstName || "";
	const lastName = React.useContext(AppContext)?.profile?.lastName || "";
	const mobile = React.useContext(AppContext)?.profile?.mobile || "";
	const email = React.useContext(AppContext)?.profile?.email || "";

	const { navigate, setOptions, goBack, setParams, isFocused } = useNavigation();

	const [data, setData] = useState({});
	const [page, setPage] = useState(0);
	const [feedData, setFeedData] = useState([
		{ type: "groupHeader", key: Math.random() },
	]);
	const [reportModal, setReportModal] = useState(false);

	const [noMoreData, setNoMoreData] = useState(true);
	const [loadJoin, setLoadJoin] = useState(false);
	const [deletePostModal, setDeletePostModal] = useState(false);
	const [refreshingData, setRefreshingData] = useState(false);
	const [loading, setLoading] = useState(false);

	const [confirmLeave, setConfirmLeave] = useState(false);
	const [groupReportModal, setGroupReportModal] = useState(false);

	const commentSheetRef = useRef();
	const focused = useIsFocused();

	const imageUrl = data?.imageUrl || "";
	const name = data?.name || "";
	const totalMembers = data?.totalMembers || "";
	const categoryName = data?.categoryName || "";
	const callLive = data?.live || false;
	const cloudId = data?.id || "";
	const chatRoomId = data?.chatRoomId || "";
	const admin = data?.admin || false;
	const memberStatus = data?.memberStatus || 0;

	const getGroupApiCall = useCallback(() => {
		groupFindByIdService(params?.cloudId)
			.then((res) => {
				setLoadJoin(false);
				setData(res);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, [params]);

	const groupFeed = useCallback(() => {
		console.warn("apicalledddd");
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
			pageId: params?.cloudId,
			pageName: params?.name,
			percentage: 0,
			reactions: null,
			page: page,
			pageSize: 10,
			reactionsCount: null,
			recentComments: null,
			text: null,
			totalComments: null,
			totalReactions: null,
			visibility: null,
			excludeGlobalFeeds: true,
		})
			.then((res) => {
				setLoading(false);
				setRefreshingData(false);

				setNoMoreData(res.last);

				if (res?.content?.length > 0) {
					setFeedData((prev) => [...prev, ...res.content]);
				}
				setFooterVisible(false);
			})
			.catch((err) => console.warn(err));
	}, [params, page]);

	useEffect(() => {
		if (params?.feedData) {
			console.warn("feeddataaaaaa");
			// setPage(0);
			// setFeedData([{ type: "groupHeader", key: Math.random }]);
			// groupFeed();
			setFeedData((prev) => [
				prev[0],
				params?.feedData,
				...prev.slice(1, prev.length - 1),
			]);
		}
		return () => {
			if (params?.feedData) {
				setParams({ feedData: null });
			}
		};
	}, [params]);

	useEffect(() => {
		getGroupApiCall();

		return () => {
			setCommentCount(null);
		};
	}, []);

	useEffect(() => {
		groupFeed();
	}, [groupFeed]);

	useLayoutEffect(() => {
		setOptions({
			headerShown: true,
			headerStyle: {
				elevation: 10,
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: 0,
				shadowRadius: 0,
				backgroundColor: color?.gradientWhite,
			},
			headerTintColor: color?.black,
			headerRight: () => {
				return (
					data.cloudType === "PUBLIC" && (
						<MaterialCommunityIcons
							onPress={() => {
								shareGroup(data.id);
							}}
							style={{ marginRight: 20 }}
							name="share-variant"
							color={color?.black}
							size={18}
						/>
					)
				);
			},
		});
	}, [data]);

	const getUid = (mobile) => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	};

	const handleGroup = () => {
		setLoadJoin(true);
		if (memberStatus === 0) {
			joinGroupService(cloudId)
				.then((res) => {
					getGroupApiCall();
				})
				.catch((err) => {
					console.error(err);
					setLoadJoin(false);
				});
		} else {
			leaveGroupService(cloudId)
				.then((res) => {
					setLoadJoin(false);
					navigate("Groups", { reloadPage: true });
				})
				.catch((err) => {
					console.error(err);
					setLoadJoin(false);
				});
		}
	};

	const handleGroupCall = () => {
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			axios
				.get(
					"https://gateway.banjee.org/services/message-broker/api/rooms/findByRoomId/" +
						chatRoomId
				)
				.then((res) => {
					if (admin && !res?.data?.live) {
						socket.send(
							JSON.stringify({
								action: "START_GROUP_CALL",
								data: {
									initiator: {
										firstName: firstName,
										lastName: lastName,
										id: systemUserId,
										mobile: mobile,
										email: email,
										uid: getUid(mobile),
									},
									initiatorId: systemUserId,
									cloudId: cloudId,
									chatRoomId: chatRoomId,
									chatRoomName: name,
									chatRoomImage: imageUrl,
								},
							})
						);
						navigate("GroupCall", {
							cloudId: cloudId,
							initiatorId: systemUserId,
							chatRoomId: chatRoomId,
							chatRoomName: name,
							chatRoomImage: imageUrl,
							userObject: {
								firstName: firstName,
								lastName: lastName,
								id: systemUserId,
								mobile: mobile,
								email: email,
							},
							joinGroup: false,
							adminId: res.data?.createdByUser?.id,
						});
					} else {
						if (!res?.data?.live) {
							showToast(
								"Room is not live. You can join the room after admin make it live."
							);
						} else {
							PushNotification.cancelLocalNotification(2);
							navigate("GroupCall", {
								cloudId: cloudId,
								chatRoomId: chatRoomId,
								chatRoomName: name,
								chatRoomImage: imageUrl,
								userObject: {
									firstName: firstName,
									lastName: lastName,
									id: systemUserId,
									mobile: mobile,
									email: email,
								},
								joinGroup: true,
								adminId: res.data?.createdByUser?.id,
							});
						}
					}
				})
				.catch((err) => {
					console.error(err);
					showToast(
						"Room is not live. You can join the room after admin make it live."
					);
				});
		}
	};
	const handleGoToChat = () => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: true,
				name: name || "Name",
				roomId: chatRoomId || "",
			},
		});
	};

	function renderViewMore(onPress) {
		return (
			<Text
				onPress={onPress}
				style={{ color: color?.black }}
				opacity={70}
			>
				Show more
			</Text>
		);
	}

	function renderViewLess(onPress) {
		return (
			<Text
				onPress={onPress}
				style={{ color: color?.black }}
				opacity={70}
			>
				Show less
			</Text>
		);
	}

	const onRefresh = () => {
		// setNoMoreData(false);
		setFeedData([{ type: "groupHeader", ket: Math.random }]);
		setPage(0);
		// groupFeed();
	};

	const onEndReached = () => {
		if (!noMoreData) {
			setLoading(true);
			setFooterVisible(true);
			setPage((pre) => pre + 1);
		}
	};

	// console.warn("delete modal", deletePostModal);
	// const renderItem = useCallback(
	// 	({ item, index }) => (
	// 		<RenderMainFeedItem
	// 			item={item}
	// 			index={index}
	// 			setReportModal={setReportModal}
	// 			reportModal={reportModal}
	// 			setDeletePostModal={setDeletePostModal}
	// 			commentSheetRef={commentSheetRef}
	// 		/>
	// 	),
	// 	[reportModal]
	// );

	const renderItem = ({ item, index: mIndex }) => {
		if (mIndex === 0) {
			return (
				<View
					ref={(ref) => {
						if (ref?.itemRef) {
							mainScrollVideoPlayer.current = {
								...mainScrollVideoPlayer.current,
								[item?.key]: ref?.itemRef,
							};
						}
					}}
					style={{
						justifyContent: "center",
						// alignItems: "center",
						paddingLeft: "2.5%",
						paddingVertical: 10,
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: color?.border,
						marginBottom: 10,
						backgroundColor: color?.gradientWhite,
					}}
				>
					<Text
						color={color?.black}
						fontWeight={"bold"}
						fontSize={18}
					>
						Posts
					</Text>
				</View>
			);
		} else {
			return (
				<FeedExoSkeleton
					item={item}
					refReportSheet={refReportSheet}
					setReportModal={setReportModal}
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

	const listEmptyComp = () => {
		if (page === 0 && data.length === 0) {
			return (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						height: 400,
						justifyContent: "center",
					}}
				>
					<Text
						color={color?.black}
						fontWeight="medium"
					>
						No post in this group
					</Text>
				</View>
			);
		}
		// else if (loading) {
		// 	return (
		// 		<>
		// 			<VStack
		// 				mt={3}
		// 				w="95%"
		// 				alignSelf={"center"}
		// 			>
		// 				<HStack
		// 					mt={2}
		// 					alignItems="center"
		// 					space={5}
		// 				>
		// 					<VStack>
		// 						<Skeleton
		// 							width={10}
		// 							height={10}
		// 							startColor="coolGray.100"
		// 							rounded="full"
		// 						/>
		// 					</VStack>
		// 					<VStack>
		// 						<Skeleton
		// 							h="3"
		// 							w="100"
		// 							rounded="md"
		// 						/>

		// 						<HStack
		// 							justifyContent={"space-between"}
		// 							mt={2}
		// 							w="85%"
		// 						>
		// 							<Skeleton
		// 								h="2"
		// 								w="150"
		// 								rounded="md"
		// 							/>
		// 							<Skeleton
		// 								h="2"
		// 								w="20"
		// 								rounded="md"
		// 							/>
		// 						</HStack>
		// 					</VStack>
		// 				</HStack>

		// 				<Skeleton
		// 					w={"150"}
		// 					mt={2}
		// 					h={3}
		// 					rounded="md"
		// 				/>

		// 				<Skeleton
		// 					h="320"
		// 					w="100%"
		// 					alignSelf={"center"}
		// 					mt={2}
		// 				/>
		// 			</VStack>
		// 			<VStack
		// 				mt={3}
		// 				w="95%"
		// 				alignSelf={"center"}
		// 			>
		// 				<HStack
		// 					mt={2}
		// 					alignItems="center"
		// 					space={5}
		// 				>
		// 					<VStack>
		// 						<Skeleton
		// 							width={10}
		// 							height={10}
		// 							startColor="coolGray.100"
		// 							rounded="full"
		// 						/>
		// 					</VStack>
		// 					<VStack>
		// 						<Skeleton
		// 							h="3"
		// 							w="100"
		// 							rounded="md"
		// 						/>

		// 						<HStack
		// 							justifyContent={"space-between"}
		// 							mt={2}
		// 							w="85%"
		// 						>
		// 							<Skeleton
		// 								h="2"
		// 								w="150"
		// 								rounded="md"
		// 							/>
		// 							<Skeleton
		// 								h="2"
		// 								w="20"
		// 								rounded="md"
		// 							/>
		// 						</HStack>
		// 					</VStack>
		// 				</HStack>

		// 				<Skeleton
		// 					w={"150"}
		// 					mt={2}
		// 					h={3}
		// 					rounded="md"
		// 				/>

		// 				<Skeleton
		// 					h="320"
		// 					w="100%"
		// 					alignSelf={"center"}
		// 					mt={2}
		// 				/>
		// 			</VStack>
		// 		</>
		// 	);
		// }
	};

	const headerComponent = useCallback(() => {
		return (
			<View
				pointerEvents={loadJoin ? "none" : "auto"}
				style={{
					// height: "100%",
					// marginTop: Constants.statusBarHeight,
					width: "100%",
					flex: 1,
					alignSelf: "center",
					// justifyContent: "center",
				}}
			>
				<View
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderBottomRightRadius: 32,
						borderBottomLeftRadius: 32,
						backgroundColor: color?.gradientWhite,
						// backgroundColor: color.primary,
						marginBottom: 10,
					}}
				>
					<Image
						source={{ uri: cloudinaryFeedUrl(imageUrl, "newImage") }}
						style={{
							height: 100,
							width: 100,
							borderRadius: 50,
							// marginTop: 40,
							marginBottom: 15,
						}}
					/>
					<Text
						fontSize={24}
						color={color?.black}
						fontWeight="medium"
						numberOfLines={1}
						mb={1}
					>
						{data?.name}
					</Text>

					<View style={{ width: "90%", marginHorizontal: 10 }}>
						{data?.description?.length > 0 && (
							<ViewMoreText
								numberOfLines={3}
								renderViewMore={renderViewMore}
								renderViewLess={renderViewLess}
								textStyle={{
									opacity: 70,
									textAlign: "center",
									color: color?.black,
									fontSize: 14,
									// width: "80%",
								}}
							>
								{data?.description.trim()}
							</ViewMoreText>
						)}
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 10,
						}}
					>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								margin: 10,
								width: 80,
							}}
						>
							<View
								style={{
									opacity: 0.4,
									backgroundColor: "cyan",
									position: "absolute",
									width: "100%",
									height: "100%",
									borderRadius: 16,
								}}
							/>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginHorizontal: 20,
									marginTop: 10,
								}}
							>
								<Foundation
									name="clipboard-notes"
									size={24}
									color={color?.white}
								/>
								<Text
									color={color?.white}
									ml={1}
								>
									{data.totalPosts}
								</Text>
							</View>
							<Text style={{ marginBottom: 10 }}>Posts</Text>
						</View>

						<TouchableWithoutFeedback
							onPress={() => {
								navigate("NeighbourhoodMember", {
									cloudId: data?.id,
									cloudName: data?.name,
								});
							}}
						>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									margin: 10,
									width: 80,
								}}
							>
								<View
									style={{
										opacity: 0.4,
										backgroundColor: "salmon",
										position: "absolute",
										width: "100%",
										height: "100%",
										borderRadius: 16,
									}}
								/>
								<View
									style={{
										flexDirection: "row",
										marginHorizontal: 20,
										marginTop: 10,
										alignItems: "center",
									}}
								>
									<Ionicons
										name="people"
										size={24}
										color={color?.white}
									/>
									<Text
										color={color?.white}
										ml={1}
									>
										{data.totalMembers}
									</Text>
								</View>
								<Text style={{ marginBottom: 10 }}>Members</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>

					<View style={{ position: "absolute", right: 0 }}>
						<AppMenu
							style={{ borderWidth: 1 }}
							menuColor={color.black}
							menuContent={
								admin
									? [
											{
												icon: "exit-to-app",
												label: "Leave Group",
												onPress: () => {
													Alert.alert("Leave Group", "Are you sure want to leave group ?", [
														{
															text: "Cancel",
														},
														{
															text: "Yes, Leave",
															onPress: () =>
																leaveGroupService(data.id)
																	.then((res) => {
																		goBack();
																	})
																	.catch((err) => {
																		showToast(
																			"You cannot leave group without assign other admin"
																		);
																		console.warn(err);
																	}),
														},
													]);
												},
											},
									  ]
									: [
											{
												icon: "account-minus",
												label: "Report Community",
												onPress: () => {
													setGroupReportModal(data.id);
												},
											},
									  ]
							}
						/>
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 10,
					}}
				>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							alignItems: "center",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						{data?.memberStatus >= 1 && (
							<TouchableWithoutFeedback
								// disabled={loadJoin}
								onPress={handleGoToChat}
							>
								<View style={{ paddingHorizontal: 5, width: "33.33%" }}>
									<View
										style={{
											height: 40,
											width: "100%",
											borderRadius: 8,
											backgroundColor: color.primary,
											alignItems: "center",
											justifyContent: "center",
											flexDirection: "row",
											elevation: 5,
											shadowOffset: { width: 1, height: 1 },
											shadowOpacity: 0.4,
											shadowRadius: 3,
										}}
									>
										<Entypo
											name="chat"
											size={20}
											color={color?.white}
										/>
										<Text
											color={color?.white}
											ml={2}
										>
											Chat
										</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
						)}

						<Fragment>
							{data?.memberStatus === 1 ? (
								<TouchableWithoutFeedback
									onPress={handleGroupCall}
									// disabled={loadJoin}
								>
									<View style={{ paddingHorizontal: 5, width: "33.33%" }}>
										<View style={styles?.btn}>
											<Text color={"black"}>
												{!admin ? "Join Live" : callLive ? "Join Live" : "Go Live"}
											</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>
							) : null}
						</Fragment>

						{!data?.admin && (
							<TouchableWithoutFeedback
								// disabled={loadJoin}
								onPress={() =>
									data?.memberStatus === 0 ? handleGroup() : setConfirmLeave(true)
								}
							>
								<View style={{ paddingHorizontal: 5, width: "33.33%" }}>
									<View style={styles.btn}>
										{loadJoin ? (
											<View
												style={{
													height: 30,
													width: 80,
													flexDirection: "row",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Lottie
													source={require("../../../../assets/loader/loader.json")}
													autoPlay
													style={{ height: 25 }}
												/>
											</View>
										) : (
											<Text color={"black"}>
												{data?.memberStatus === 0 ? "Join" : "Leave"}
											</Text>
										)}
									</View>
								</View>
							</TouchableWithoutFeedback>
						)}

						{admin && (
							<TouchableWithoutFeedback
								onPress={() => {
									navigate("SearchBanjeeForNeighbourhood", {
										cloudId: params.cloudId,
									});
								}}
							>
								<View style={{ paddingHorizontal: 5, width: "33.33%" }}>
									<View
										style={{
											height: 40,
											width: "100%",
											borderRadius: 8,
											backgroundColor: color.primary,
											alignItems: "center",
											justifyContent: "center",
											elevation: 5,
											shadowOffset: { width: 1, height: 1 },
											shadowOpacity: 0.4,
											shadowRadius: 3,
										}}
									>
										<Text color={color?.white}>Add Member</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
				</View>
			</View>
		);
	}, [data]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{visible ? (
				<AppLoading visible={true} />
			) : (
				<Fragment>
					{/* <LinearGradient
						style={{ flex: 1 }}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						color={
							darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
						}
					> */}
					<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
						<FeedView
							data={feedData?.map((ele) => ({ ...ele, key: Math.random() }))}
							ListHeaderComponent={headerComponent}
							stickyHeaderIndices={[1]}
							onRefresh={onRefresh}
							refreshing={refreshingData}
							renderItem={(e) => renderItem(e)}
							onEndReached={onEndReached}
							isFocused={focused}
							ListEmptyComponent={listEmptyComp}
							mainScrollVideoPlayer={mainScrollVideoPlayer}
							ListFooterComponent={() => (
								<Fragment>
									{footerVisible && (
										<View
											style={{
												flex: 1,
												height: 40,
												// paddingBottom: 30,
											}}
										>
											<AppLoading
												style={{ marginRight: 15 }}
												visible={true}
												size="small"
											/>
										</View>
									)}
								</Fragment>
							)}
						/>
						{listEmptyComp()}
						{data?.memberStatus != 0 && (
							<AppFabButton
								size={28}
								onPress={() => {
									createFeedData([]),
										navigate("CreateFeed", { groupId: cloudId, groupName: name });
								}}
								style={{
									position: "absolute",
									bottom: 30,
									right: 30,
									alignItems: "center",
									borderRadius: 50,
									backgroundColor: color?.gradientWhite,
									justifyContent: "center",

									elevation: 3,
									shadowColor: color.shadow,
									shadowOffset: { width: 1, height: 1 },
									shadowOpacity: 0.4,
									shadowRadius: 3,
								}}
								icon={
									<MaterialIcons
										name={"add"}
										size={30}
										color={color?.black}
									/>
								}
							/>
						)}
					</View>
					{/* </LinearGradient> */}

					{/* <RBSheet
						customStyles={{
							container: {
								borderRadius: 10,
								backgroundColor: color.drawerGrey,
							},
						}}
						// height={420}
						height={Dimensions.get("screen").height}
						ref={commentSheetRef}
						dragFromTopOnly={true}
						closeOnDragDown={true}
						closeOnPressMask={true}
						draggableIcon
					>
						<Comment />
					</RBSheet> */}
					<CommentBottomSheet commentSheetRef={commentSheetRef} />

					{openPostModal && focused && <SinglePost />}

					{confirmLeave && (
						<ConfirmModal
							setModalVisible={() => {
								setConfirmLeave(false);
							}}
							btnLabel={"Leave "}
							message={"Are you sure,\n you want to Leave group"}
							onPress={handleGroup}
						/>
					)}

					{deletePostModal && (
						<ConfirmModal
							btnLabel={"Delete"}
							title="Are you sure, you want to delete your post?"
							onPress={() => {
								deletePost(deletePostModal)
									.then(() => {
										setFeedData(feedData.filter((ele) => ele.id !== deletePostModal));
										showToast("Post Deleted Successfully ");
									})
									.catch((err) => console.warn(err));

								setDeletePostModal(false);
							}}
							setModalVisible={setDeletePostModal}
							message={"Delete post"}
						/>
					)}
					{groupReportModal && (
						<ReportFeed
							onPress={() => {}}
							reportType={"group"}
							setModalVisible={setGroupReportModal}
							modalVisible={groupReportModal}
							feedId={groupReportModal}
						/>
					)}
				</Fragment>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {},
	btn: {
		height: 40,
		width: "100%",
		borderRadius: 8,
		backgroundColor: color.lightGrey,
		alignItems: "center",
		justifyContent: "center",
		elevation: 5,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
});

export default DetailGroup;
