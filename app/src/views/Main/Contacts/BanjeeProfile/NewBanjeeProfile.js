import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import ReportUser from "../../../../constants/components/Cards/ReportUser";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import color from "../../../../constants/env/color";
import { BlockUser, unBlockUser } from "../../../../helper/services/Service";
import { getUserProfileDataFunc } from "../../../../helper/services/SplashService";
import { unfriend } from "../../../../helper/services/UnfriendService";
import { removeProfileData } from "../../../../redux/store/action/Profile/userPendingConnection";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { Entypo } from "@expo/vector-icons";
import { AppContext } from "../../../../Context/AppContext";
import { CreateRoomService } from "../../../../helper/services/RoomServices";
import { MainContext } from "../../../../../context/MainContext";
import { showToast } from "../../../../constants/components/ShowToast";
import ReportFeed from "../../../../constants/components/Cards/ReportFeed";
import CommentBottomSheet from "../../../../constants/components/FeedComments/CommentBottomSheet";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import { OtherFeedService } from "../../../../helper/services/OtherFeedService";
import RenderTypeExoSkeleton from "../../Feed/NewFeedFlow/RenderTypeExoSkeleton";
import FeedCarousel from "../../Feed/NewFeedFlow/FeedCarousel";
import FeedExoSkeleton from "../../Feed/NewFeedFlow/FeedExoSkeleton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import SinglePost from "../../Feed/SinglePost";
import ProfileSkeleton from "../../../../constants/components/ui-component/Skeleton/ProfileSkeleton";
import FeedView from "../../../../constants/components/FeedView/FeedView";
import ConfirmModal from "../../../Others/ConfirmModal";

function NewBanjeeProfile() {
	const { params } = useRoute();
	const [userReportModal, setUserReportModal] = React.useState(false);
	const [userBlockModal, setUserBlockModal] = React.useState(false);
	const [reportModal, setReportModal] = useState(false);
	const [data, setData] = useState([]);
	const [ourProfile, setOurProfile] = React.useState(null);
	const [blockModal, setBlockModal] = React.useState(false);
	const [unfriendModal, setUnfriendModal] = React.useState(false);
	const [acceptFrndReq, setAcceptFrndReq] = React.useState(false);
	const [rejectFrndReq, setRejectFrndReq] = React.useState(false);
	const [noData, setNoData] = React.useState(false);
	const [visible, setVisible] = React.useState(true);
	const [page, setPage] = useState(0);
	const [refresh, setRefresh] = useState(false);
	const mainScrollVideoPlayer = useRef();
	const { profileId } = useRoute().params;
	const [emptyData, setEmptyData] = useState(false);
	const commentSheetRef = useRef();

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine;
	const { userData, profile } = React.useContext(AppContext);
	const [disableTouch, setDisableTouch] = useState("auto");
	const refReportSheet = useRef();
	const { setCommentCount, openPostModal } = React.useContext(MainContext);

	const apiCall = useCallback(() => {
		setDisableTouch("none");
		getUserProfileDataFunc(params?.profileId)
			.then((res) => {
				setVisible(false);
				if (res === null) {
					showToast("User not found");
					goBack();
				} else {
					setDisableTouch("auto");
					setOurProfile(res);
					setOptions({
						headerTitle: res?.firstName + "'s Profile",
					});
					otherFeed();
				}
			})
			.catch((err) => {
				console.log(err);
				showToast("User not found");
				goBack();
			});
		return () => {
			setCommentCount(null);
			removeProfileData({});
			setOurProfile(null);
		};
	}, [params, otherFeed]);

	useFocusEffect(apiCall);

	const unBlockUserFunc = () => {
		unBlockUser(ourProfile?.systemUserId)
			.then((res) => {
				apiCall();
			})
			.catch((err) => console.warn(err));
	};

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
					if (page === 0 && res.empty) {
						setEmptyData(true);
					}
					if (res.content && res.content.length > 0) {
						if (res?.last) {
							console.warn("setting last response");
							setNoData(true);
						}
						setEmptyData(false);
						setData((prev) => [
							...prev,
							...res.content.map((ele) => ({ ...ele, key: Math.random() })),
						]);
					}
				})
				.catch((err) => console.log(err)),
		[profileId, page]
	);

	const { navigate, goBack, setOptions } = useNavigation();

	const blockUser = () => {
		BlockUser(ourProfile?.systemUserId)
			.then(() => {
				showToast(
					`${ourProfile?.firstName} ${ourProfile?.lastName} Successfully  blocked.`
				);

				apiCall();
				// navigate("BanjeeProfile", params?.profileId);
			})
			.catch((err) => console.warn(err));
	};
	const unfriendUser = () => {
		unfriend(ourProfile?.systemUserId)
			.then(() => {
				goBack();
				friendList();
			})
			.catch((err) => console.log(err));
	};

	const acceptFriendRequest = () => {
		// acceptRequest(connectionId)
		// 	.then(() => {
		// 		dispatch(
		// 			getProfile({
		// 				connectionId: undefined,
		// 				showReqestedFriend: false,
		// 				profileId: params?.profileId,
		// 			})
		// 		),
		// 			navigate("BanjeeProfile");
		// 	})
		// 	.catch((err) => console.warn(err));
	};

	const rejectFriendRequest = () => {
		// rejectRequest(connectionId)
		// 	.then(() => {
		// 		dispatch(
		// 			showToast({
		// 				open: true,
		// 				description: ourProfile?.name + " reported",
		// 			})
		// 		),
		// 			goBack();
		// 		// apiCall();
		// 	})
		// 	.catch((err) => console.warn(err));
	};

	const handleClickAction = (screenName, callType) => {
		CreateRoomService({
			userA: {
				avtarImageUrl: ourProfile?.avtarUrl,
				domain: ourProfile?.domain,
				email: ourProfile?.email,
				externalReferenceId: ourProfile?.systemUserId,
				firstName: ourProfile?.firstName,
				id: ourProfile?.systemUserId,
				lastName: ourProfile?.lastName,
				mcc: ourProfile?.mcc,
				mobile: ourProfile?.mobile,
				profileImageUrl: ourProfile?.avtarUrl,
				userName: ourProfile?.username,
				userType: 0,
			},
			userB: {
				avtarImageUrl: userData?.avtarUrl ? userData?.avtarUrl : profile?.avtarUrl,
				domain: userData?.domain ? userData?.domain : "",
				email: userData?.email ? userData?.email : profile?.email,
				externalReferenceId: userData?.externalReferenceId,
				firstName: userData?.firstName ? userData?.firstName : profile.firstName,
				id: profile?.systemUserId,
				lastName: userData?.lastName ? userData?.lastName : profile?.lastName,
				mcc: userData?.mcc,
				mobile: userData?.mobile,
				profileImageUrl: profile?.avtarUrl,
				userName: userData?.userName ? userData?.userName : profile?.usename,
				userType: 0,
			},
		}).then((res) => {
			if (_rtcEngine) {
				if (callType) {
					showToast("Can't place a new call while you're already in a call");
				} else {
					navigate(screenName, {
						item: {
							...ourProfile,
							roomId: res?.id,
							userId: ourProfile?.systemUserId,
							roomId: res.id,
							callType,
							initiator: true,
							fromBanjeeProfile: true,
						},
					});
				}
			} else {
				navigate(
					screenName,
					callType
						? {
								...ourProfile,
								roomId: res?.id,
								userId: ourProfile?.systemUserId,
								roomId: res.id,
								callType,
								initiator: true,
						  }
						: {
								item: {
									...ourProfile,
									roomId: res?.id,
									userId: ourProfile?.systemUserId,
									roomId: res.id,
									callType,
									initiator: true,
									fromBanjeeProfile: true,
								},
						  }
				);
			}
		});
	};

	const Profile = () => (
		// <LinearGradient
		// 			style={{
		// 				width: "95%",
		// 				alignSelf: "center",
		// 				height: 180,
		// 				alignItems: "center",
		// 				justifyContent: "center",
		// 				marginTop: 10,
		// backgroundColor:"#07080D",
		// 				padding: 1,
		// 				borderRadius: 12,
		// 			}}
		// 			start={{ x: 0, y: 0 }}
		// 			end={{ x: 1, y: 1 }}
		// 			color={["rgba(237, 69, 100, 0.9 )", "rgba(169, 50, 148, 0.9 )"]}
		// 		>

		<View
			style={{
				width: "95%",
				alignSelf: "center",
				height: 180,
				alignItems: "center",
				justifyContent: "center",
				marginVertical: 10,
				backgroundColor: "#07080D",
				padding: 1,
				borderRadius: 12,
			}}
		>
			<View
				style={{
					width: "100%",
					height: "100%",
					borderRadius: 12,
					opacity: 1,
					backgroundColor: color?.gradientWhite,
				}}
			>
				<View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
					<View
						style={{
							flexDirection: "row",
							width: "100%",
							alignItems: "center",
						}}
					>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								padding: 16,
								width: "30%",
							}}
						>
							<Image
								loadingIndicatorSource={require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")}
								onError={({ nativeEvent: { error } }) => {
									console.warn(error, "image is not there, errorrrrrrrrrrr");
									// setImageError(error);
								}}
								source={{
									uri: listProfileUrl(params?.profileId),
								}}
								style={{
									width: 100,
									height: 100,
									borderRadius: 50,
									borderColor: "#565E6C",
									borderWidth: 1,
								}}
							/>
						</View>

						<View
							style={{
								display: "flex",
								marginLeft: 30,
								// padding: 16,
							}}
						>
							<Text
								fontWeight={"extrabold"}
								fontSize={20}
								color={color?.black}
								numberOfLines={1}
							>
								{ourProfile?.firstName} {ourProfile?.lastName}
							</Text>

							<Text
								fontSize={14}
								color={color?.black}
								opacity={80}
								mb={1}
							>
								@{ourProfile?.username}
							</Text>
							<Text
								opacity={70}
								fontSize={12}
								color={color?.black}
							>
								{new Date().getFullYear() - ourProfile?.birthDate.split("-")[0]},{" "}
								{ourProfile?.gender}
							</Text>
						</View>
					</View>

					<View style={{ width: "100%" }}>
						<View
							style={{
								display: "flex",
								flex: 1,
								alignItems: "flex-end",
								width: "100%",
							}}
						>
							<LinearGradient
								style={{
									marginTop: -10,
									width: "50%",
									height: 45,
									alignItems: "center",
									// backgroundColor: "#DEE1E6FF",
									display: "flex",
									flexDirection: "row",
									paddingLeft: 10,
									justifyContent: "space-evenly",
									// paddingVertical: 5,
									borderBottomStartRadius: 20,
									borderTopStartRadius: 20,
									overflow: "hidden",
								}}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								colors={["rgba(237, 69, 100, 0.9)", "rgba(169, 50, 148, 0.9 )"]}
							>
								{ourProfile?.blocked ? (
									<TouchableWithoutFeedback
										onPress={() => {
											unBlockUserFunc();
										}}
									>
										<View style={{ flex: 1, alignItems: "center" }}>
											<Text color={color?.black}>Blocked</Text>
										</View>
									</TouchableWithoutFeedback>
								) : (
									<>
										<AppFabButton
											size={20}
											onPress={() => {
												handleClickAction("OneToOneCall", "audio");
											}}
											icon={
												<Feather
													name="phone-call"
													size={22}
													color="white"
												/>
											}
										/>
										<AppFabButton
											size={20}
											onPress={() => {
												handleClickAction("OneToOneCall", "video");
											}}
											icon={
												<Octicons
													name="device-camera-video"
													size={22}
													color="white"
												/>
											}
										/>
										<AppFabButton
											size={20}
											icon={
												<Ionicons
													name="chatbubble-outline"
													size={22}
													color="white"
												/>
											}
											onPress={() => {
												handleClickAction("BanjeeUserChatScreen");
											}}
										/>
										<View style={{ width: 20 }}>
											<AppMenu
												style={{ borderWidth: 1 }}
												menuColor={color.black}
												menuContent={[
													{
														icon: "account-cancel",
														label: "Block",
														onPress: () => {
															Alert.alert(
																"Block User",
																`Are you sure want to block ${ourProfile?.firstName} ${ourProfile?.lastName} ?`,
																[
																	{
																		text: "Cancel",
																	},
																	{
																		text: "Block",
																		onPress: blockUser,
																	},
																]
															);
														},
													},
													{
														icon: "account-minus",
														label: "Report",
														onPress: () => {
															setUserReportModal(true);
														},
													},
													// {
													// 	icon: "block-helper",
													// 	label: "Block",
													// 	onPress: () => {
													// 		setBlockModal(true);
													// 	},
													// },
												]}
											/>
										</View>
									</>
								)}
								{/* </View> */}
							</LinearGradient>
						</View>
					</View>
				</View>

				<View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "row",
						width: "37%",
					}}
				>
					<Text
						style={{
							textAlign: "left",
							flexWrap: "wrap",
						}}
						fontSize={16}
						color={color?.black}
					>
						{`Since`}
					</Text>
					<Entypo
						name="dot-single"
						size={16}
						color={color?.black}
					/>
					<Text
						style={{
							textAlign: "left",
							flexWrap: "wrap",
						}}
						fontSize={15}
						color={color?.black}
					>
						{`${ourProfile?.createdOn?.split("-")[0]}`}{" "}
					</Text>
				</View>
			</View>
		</View>
		// </LinearGradient>
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
		}
	};

	const focused = useIsFocused();

	return (
		<View
			pointerEvents={disableTouch}
			style={{ flex: 1, backgroundColor: "#07080D" }}
		>
			{/* <LinearGradient
				style={{ flex: 1 }}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				color={
					darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
				}
			> */}
			{visible ? (
				<ProfileSkeleton />
			) : (
				<>
					{disableTouch === "none" && <AppLoading visible={true} />}
					<FeedView
						data={[{ type: "activity", key: Math.random() }, ...data]}
						isFocused={focused}
						mainScrollVideoPlayer={mainScrollVideoPlayer}
						stickyHeaderIndices={[1]}
						renderItem={(e) => renderItem(e)}
						ListHeaderComponent={() => <Profile />}
						ListEmptyComponent={() => <AppLoading visible={true} />}
						refreshing={refresh}
						onEndReachedThreshold={0.1}
						onEndReached={() => {
							if (!noData) {
								console.warn("endreached");
								setPage((prev) => prev + 1);
							}
						}}
						onRefresh={() => {
							if (page === 0) {
								setData([]);
								setCommentCount();
								otherFeed();
							} else {
								setCommentCount();
								setData([]);
								setPage(0);
							}
							// otherFeed();
						}}
					/>
				</>
				// <VirtualizedList
				// 	data={[{ type: "activity", key: Math.random() }, ...data]}
				// 	// data={data.map((ele) => ({ ...ele, key: Math.random() }))}
				// 	renderItem={renderItem}
				// 	keyExtractor={(data) => data.key}
				// 	getItemCount={(data) => data?.length}
				// 	ListHeaderComponent={() => <Profile />}
				// 	stickyHeaderIndices={[1]}
				// 	getItem={(data, index) => data[index]}
				// 	ListEmptyComponent={() => <AppLoading visible={true} />}
				// 	showsVerticalScrollIndicator={false}
				// onRefresh={() => {
				// 	setCommentCount();
				// 	setPage(0);
				// 	otherFeed();
				// }}
				// refreshing={refresh}
				// onEndReachedThreshold={0.1}
				// onEndReached={() => setPage((prev) => prev + 1)}
				// 	removeClippedSubviews={true}
				// 	onViewableItemsChanged={_onViewableItemsChanged}
				// 	initialNumToRender={3}
				// 	maxToRenderPerBatch={3}
				// 	viewabilityConfig={viewabilityConfig}
				// 	windowSize={5}
				// />
			)}
			{emptyData && ourProfile?.firstName && (
				<View style={{ alignItems: "center", flex: 1 }}>
					<Text
						color={color?.black}
					>{`${ourProfile?.firstName} ${ourProfile?.lastName} haven't posted any post yet...!`}</Text>
				</View>
			)}
			{/* ```````````` confirm block modal ````````````` */}

			{unfriendModal && (
				<ConfirmModal
					title={`Are you sure, you want to unfriend ${ourProfile?.username} ?`}
					setModalVisible={setUnfriendModal}
					btnLabel={"Unfriend"}
					message={"Unfriend User"}
					onPress={unfriendUser}
				/>
			)}

			{blockModal && (
				<ConfirmModal
					title={`Are you sure, you want to block ${ourProfile?.username} ?`}
					setModalVisible={setBlockModal}
					btnLabel={"Block"}
					message={"Block User"}
					onPress={blockUser}
				/>
			)}

			{acceptFrndReq && (
				<ConfirmModal
					title={`You have accepted ${ourProfile?.username}'s Banjee request. Now you can send voice message or call directly.`}
					setModalVisible={setAcceptFrndReq}
					btnLabel={"Accept"}
					message={"Accept friend request"}
					onPress={acceptFriendRequest}
				/>
			)}
			{rejectFrndReq && (
				<ConfirmModal
					title={`You have opted for rejection of ${ourProfile?.username}'s Banjee request.`}
					setModalVisible={setRejectFrndReq}
					btnLabel={"Reject"}
					message={"Reject request"}
					onPress={rejectFriendRequest}
				/>
			)}
			{/* </LinearGradient> */}

			{userReportModal && (
				<ReportUser
					setModalVisible={setUserReportModal}
					reportType="feed"
					feedId={ourProfile?.systemUserId}
				/>
			)}

			{reportModal && (
				<ReportFeed
					refRBSheet={refReportSheet}
					onPress={() => setData(data.filter((ele) => ele.id !== reportModal))}
					reportType={"feed"}
					setModalVisible={setReportModal}
					modalVisible={reportModal}
					feedId={reportModal}
				/>
			)}

			<CommentBottomSheet commentSheetRef={commentSheetRef} />
			{openPostModal && <SinglePost />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		backgroundColor: "#fff",
		flex: 1,
	},
	header: {
		height: 56,
		width: "100%",
		position: "absolute",
		top: 0,
		zIndex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	gradient: {
		height: 208,
		width: "90%",
		alignSelf: "center",
		marginTop: -50,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		position: "relative",
	},

	tabView: {
		height: 46,
		// marginTop: -46,
		// width: "96%",
		alignSelf: "center",
		flexDirection: "row",
		// backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "space-between",
	},
	textView: {
		zIndex: 1,
		justifyContent: "center",
		height: "100%",
		width: "32%",
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

export default NewBanjeeProfile;
