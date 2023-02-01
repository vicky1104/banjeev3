import {
	StackActions,
	useFocusEffect,
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";

import { Text } from "native-base";

import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

import { BackHandler, Dimensions, VirtualizedList } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import { StyleSheet, View } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { DetailNeighbourhoodService as detailNeighbourhoodService } from "../../../../helper/services/DetailNeighbourhoodService";
import {
	joinNeighbourhoodService,
	leaveNeighbourhoodService,
} from "../../../../helper/services/ListOurNeighbourhood";
import { getFeed } from "../../../../helper/services/PostFeed";
import ConfirmModal from "../../../Others/ConfirmModal";
import RenderFeedItem from "../../Feed/RenderFeedItem";
import DetailNeighbourhoodHeader from "./DetailNeighbourhoodHeader";
import BuisnessNearBy from "../../../Services/BuisnessNearBy";
import { filterClassifiedService } from "../../../../helper/services/Classifieds";
import { FilterService as businessFilterService } from "../../../../helper/services/BusinessCategory";
import { DetailNeighbourhoodContext } from "./DetailNeighbourhoodContext";
import SellProductList from "../../../Services/SellProduct/SellProductList";
import { showToast } from "../../../../constants/components/ShowToast";
import CommentBottomSheet from "../../../../constants/components/FeedComments/CommentBottomSheet";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { shareNeighbourhood } from "../../../Other/ShareApp";
import ReportFeed from "../../../../constants/components/Cards/ReportFeed";
import {
	removeLocalStorage,
	setMyDefaultNeighbourhood,
} from "../../../../utils/Cache/TempStorage";
import { AppContext } from "../../../../Context/AppContext";
import color from "../../../../constants/env/color";
import FeedExoSkeleton from "../../Feed/NewFeedFlow/FeedExoSkeleton";
import FeedCarousel from "../../Feed/NewFeedFlow/FeedCarousel";
import RenderTypeExoSkeleton from "../../Feed/NewFeedFlow/RenderTypeExoSkeleton";
import FeedView from "../../../../constants/components/FeedView/FeedView";
import SwitchNeighbourhood from "../SwitchNeighbourhood";
import SinglePost from "../../Feed/SinglePost";

function DetailNeighbourhood(props) {
	const { params } = useRoute();
	const { setOptions, dispatch } = useNavigation();
	const { setCommentCount, openPostModal, setOpenPostModal, setModalData } =
		useContext(MainContext);
	const { setNeighbourhood, neighbourhood } = useContext(AppContext);
	const {
		setDetail,
		setBusiness,
		setProducts,
		setPosts,
		setLeave,
		setConfirmLeave,
		setJoinNH,
		joinNH,
		confirmLeave,
		detail,
		posts,
		products,
		business,
	} = useContext(DetailNeighbourhoodContext);
	const focused = useIsFocused();
	const { goBack } = useNavigation();
	const mainScrollVideoPlayer = useRef();
	const [pPage, setpPage] = useState(0);
	const [loader, setLoader] = useState(false);
	const [visible, setVisible] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [hasData, setHasData] = useState(true);
	const [productloader, setProductLoader] = useState(true);
	const [businessloader, setBusinessLoader] = useState(true);
	const [neighbourhoodReport, setNeighbourhoodReport] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [toBeJoinNH, setTobeJoinNH] = useState();
	const commentSheetRef = useRef();

	const mainApiCall = useCallback(async () => {
		setBusinessApi(),
			setProductsApi(),
			await Promise.all([await setDetailApi(), await setPostApi()]);
		setRefresh(false);
	}, [setDetailApi, setBusinessApi, setProductsApi, setPostApi]);

	const setDetailApi = useCallback(async () => {
		let res = await detailNeighbourhoodService(params.cloudId);
		if (res) {
			setDetail(res);
		}
	}, [params]);

	const setBusinessApi = useCallback(() => {
		businessFilterService({
			approved: true,
			cloudId: params?.cloudId,
			page: 0,
			pageSize: 5,
		})
			.then((businessRes) => {
				console.warn(businessRes.content.length, "business length");
				setBusiness(businessRes);
				setBusinessLoader(false);
			})
			.catch((err) => console.warn(err));
	}, [params, setBusinessLoader]);

	const setProductsApi = useCallback(() => {
		filterClassifiedService({
			categoryId: "",
			cloudId: params?.cloudId,
			deleted: "",
			domain: "",
			fields: "",
			inactive: "",
			page: 0,
			pageSize: 5,
			sortBy: "",
			userId: "",
		})
			.then((productRes) => {
				console.warn(productRes.content.length, "product length");
				setProducts(productRes);
				setProductLoader(false);
			})
			.catch((err) => console.warn(err));

		// }
	}, [params, setProductLoader]);

	const setPostApi = useCallback(async () => {
		setLoader(true);
		const res = await getFeed({
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
			page: pPage,
			pageSize: 5,
			reactionsCount: null,
			recentComments: null,
			text: null,
			totalComments: null,
			totalReactions: null,
			visibility: null,
			pageName: params?.cloudName,
			pageId: params?.cloudId,
			excludeGlobalFeeds: "true",
		});
		if (res?.content?.length > 0) {
			setHasData(true);
			setLoader(false);
			setPosts((pre) => [...pre, ...res?.content]);
		} else {
			setHasData(false);
			setLoader(false);
		}
	}, [pPage, params]);

	useEffect(() => {
		mainApiCall();

		return () => {
			setOpenPostModal();
			setModalData();
			setCommentCount(null);
		};
	}, [mainApiCall, params]);

	useFocusEffect(
		useCallback(() => {
			if (params?.deepLinking) {
				BackHandler.addEventListener("hardwareBackPress", () => {
					dispatch(StackActions.replace("Bottom"));
					return true;
				});
				return () => {
					BackHandler.removeEventListener("hardwareBackPress", () => {
						return true;
					});
				};
			}
		}, [params])
	);

	useLayoutEffect(() => {
		setOptions({
			headerTitle: params?.cloudName || detail?.name,
			headerTintColor: color?.black,
			headerRight: () => (
				<AppFabButton
					style={{ marginRight: 10 }}
					onPress={() => shareNeighbourhood(detail)}
					size={18}
					icon={
						<Entypo
							name="share"
							size={20}
							color={color?.black}
						/>
					}
				/>
			),
			headerLeft: () => (
				<AppFabButton
					style={{ marginRight: 10 }}
					onPress={() => {
						if (neighbourhood) {
							dispatch(StackActions.replace("Bottom"));
						} else {
							dispatch(StackActions.pop());
						}
					}}
					size={18}
					icon={
						<MaterialCommunityIcons
							name="arrow-left"
							size={25}
							color={color?.black}
						/>
					}
				/>
			),
		});
	}, [color, params, detail]);

	function leaveNH() {
		leaveNeighbourhoodService(params.cloudId)
			.then(async (res) => {
				setLeave(true);
				showToast(`You left ${res?.payload?.name}...!`);
				setConfirmLeave(false);
				setDetailApi();
				await removeLocalStorage("neighbourhood");
				setNeighbourhood(null);
			})
			.catch((err) => console.warn(err));
	}

	useEffect(() => {
		if (joinNH) {
			setVisible(true);
			setTobeJoinNH({ name: params.cloudName, id: params.cloudId });
			joinNeighbourhoodService(params?.cloudId)
				.then(async (res) => {
					await setMyDefaultNeighbourhood("neighbourhood", res);
					setNeighbourhood(res);
					setVisible(false);
					showToast(`Sucessfully joined ${res.payload.name}`);
					setDetailApi();
				})
				.catch((err) => {
					setVisible(false);
					setOpenModal(true);
				});
		}
	}, [joinNH, params]);

	const renderItem = useCallback(
		({ item, index: mIndex }) => {
			if (mIndex === 0) {
				return (
					<View
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: null,
								};
							}
						}}
						style={{
							marginBottom: 10,
							height: 50,
							padding: 5,
							justifyContent: "center",

							backgroundColor: color?.gradientWhite,
						}}
					>
						<Text
							color={color?.black}
							fontWeight={"bold"}
							fontSize={16}
						>
							Posts
						</Text>
					</View>
				);
			} else {
				return (
					<FeedExoSkeleton
						item={item}
						commentSheetRef={commentSheetRef}
					>
						{item?.mediaContent?.length > 1 ? (
							<FeedCarousel
								isFeed={true}
								item={item}
								ref={(ref) => {
									if (ref?.itemRef) {
										mainScrollVideoPlayer.current = {
											...mainScrollVideoPlayer.current,
											[item?.key]: null,
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
		},
		[mainScrollVideoPlayer, commentSheetRef]
	);
	useEffect(() => {
		if (pPage > 0) {
			setPostApi();
		}
	}, [pPage, setPostApi]);

	const headerComponent = useCallback(() => {
		return (
			<>
				<DetailNeighbourhoodHeader
					data={detail}
					setDetailApi={setDetailApi}
					setNeighbourhoodReport={setNeighbourhoodReport}
				/>

				<BuisnessNearBy
					data={business}
					loader={businessloader}
				/>
				<SellProductList
					NHCloudId={params?.cloudId}
					data={products}
					loader={productloader}
				/>
			</>
		);
	}, [detail, businessloader, params, productloader, products]);

	const listEmptyComponent = useCallback(() => {
		return (
			<View
				style={{
					height: Dimensions.get("screen").height - 150,
					width: Dimensions.get("screen").width,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "red",
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
	}, []);

	const listFooterComponent = useCallback(
		() => (
			<>
				<AppLoading visible={loader} />
				<View style={{ height: 50 }} />
			</>
		),
		[loader]
	);

	const _onEndReached = () => {
		if (hasData) {
			setpPage((prev) => prev + 1);
		}
	};

	const _onRefresh = () => {
		setCommentCount();
		if (pPage === 0) {
			setRefresh(true);
			mainApiCall();
			setPosts([]);
		} else {
			setpPage(0);
			setPosts([]);
			setRefresh(true);
			mainApiCall();
		}
	};
	return (
		<Fragment>
			{visible && <AppLoading visible={visible} />}
			<View style={{ height: "100%", width: "100%" }}>
				<FeedView
					data={[
						{ type: "post", key: Math.random() },
						...posts.map((ele) => ({ ...ele, key: Math.random() })),
					]}
					renderItem={(e) => renderItem(e)}
					stickyHeaderIndices={[1]}
					ListHeaderComponent={headerComponent}
					onEndReached={_onEndReached}
					refreshing={refresh}
					onRefresh={_onRefresh}
					ListFooterComponent={listFooterComponent}
					ListEmptyComponent={listEmptyComponent}
					isFocused={focused}
					mainScrollVideoPlayer={mainScrollVideoPlayer}
				/>

				{/* {focused && (
					<VirtualizedList
						style={{ zIndex: 999 }}
						data={[
							{ type: "post", key: Math.random() },
							...posts.map((ele) => ({ ...ele, key: Math.random() })),
						]}
						renderItem={renderItem}
						keyExtractor={(data) => data.key}
						getItemCount={(data) => data?.length}
						getItem={(data, index) => data[index]}
						showsVerticalScrollIndicator={false}
						stickyHeaderIndices={[1]}
						ListHeaderComponent={headerComponent}
						onEndReached={_onEndReached}
						onViewableItemsChanged={_onViewableItemsChanged}
						initialNumToRender={3}
						maxToRenderPerBatch={3}
						viewabilityConfig={viewabilityConfig}
						removeClippedSubviews={true}
						windowSize={5}
						onEndReachedThreshold={0.1}
						scrollEventThrottle={150}
						refreshing={refresh}
						onRefresh={_onRefresh}
						ListFooterComponent={listFooterComponent}
						ListEmptyComponent={listEmptyComponent}
					/>
				)} */}

				{confirmLeave && (
					<ConfirmModal
						setModalVisible={() => {
							setConfirmLeave(false);
						}}
						btnLabel={"Leave neighbourhood"}
						message={"Are you sure,\n you want to leave neighbourhood"}
						onPress={() => leaveNH()}
					/>
				)}
				{neighbourhoodReport && (
					<ReportFeed
						onPress={() => {
							goBack();
						}}
						reportType={"neighbourhood"}
						setModalVisible={setNeighbourhoodReport}
						feedId={neighbourhoodReport}
					/>
				)}
				{/* {removeMember && (
					<ConfirmModal
						setModalVisible={() => {
							setRemoveMember(false);
						}}
						btnLabel={"Remove"}
						message={"Are you sure,\n you want to remove member"}
						onPress={removeMemberFunc}
					/>
				)} */}
				<CommentBottomSheet commentSheetRef={commentSheetRef} />
				{openPostModal && focused && <SinglePost />}
			</View>
			<SwitchNeighbourhood
				setJoinNH={setJoinNH}
				openModal={openModal}
				setOpenModal={setOpenModal}
				toBeJoinNH={toBeJoinNH}
			/>
		</Fragment>
	);
}
const styles = StyleSheet.create({
	contentContainerStyle: {
		padding: 16,
		backgroundColor: "#F3F4F9",
	},
	header: {
		alignItems: "center",
		backgroundColor: "#F3F4F9",

		paddingVertical: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
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
});

export default DetailNeighbourhood;

// `````````````````````````````` old code

// <View
// 	style={{
// 		flex: 1,
// 		backgroundColor: color?.gradientWhite,
// 	}}
// >
// 	<LinearGradient
// 		style={[{ backgroundColor: color?.gradientWhite }]}
// 		start={{ x: 0, y: 0 }}
// 		end={{ x: 1, y: 1 }}
// 		color={
// 			darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
// 		}
// 	>
// 		{members && (
// 			<VirtualizedList
// 				style={{ zIndex: 999 }}
// 				data={feedData}
// 				alwaysBounceVertical={true}
// 				bounces={true}
// 				ListHeaderComponent={NehHeader}
// 				bouncesZoom={true}
// 				renderItem={renderItem}
// 				keyExtractor={(data) => Math.random()}
// 				getItemCount={(data) => data?.length}
// 				getItem={(data, index) => data[index]}
// 				showsVerticalScrollIndicator={false}
// 				removeClippedSubviews={true}
// 				initialNumToRender={5}
// 				onEndReached={() => {
// 					if (hasData) {
// 						setPage((prev) => prev + 1);
// 					}
// 				}}
// 				onEndReachedThreshold={0.1}
// 				scrollEventThrottle={150}
// 				refreshing={refresh}
// 				onRefresh={() => {
// 					if (page === 0) {
// 						setRefresh(true);
// 						setData([]);
// 						CallApis();
// 					} else {
// 						setPage(0);
// 						setRefresh(true);
// 						setData([]);
// 						CallApis();
// 					}
// 				}}
// 				ListFooterComponent={() => <View style={{ height: 90 }} />}
// 				ListEmptyComponent={() => {
// 					return (
// 						<View
// 							style={{
// 								height: Dimensions.get("screen").height - 150,
// 								width: Dimensions.get("screen").width,
// 								alignItems: "center",
// 								justifyContent: "center",
// 							}}
// 						>
// 							<Text
// 								fontSize={16}
// 								color={color?.black}
// 							>
// 								NO post in this neighbourhood..!
// 							</Text>
// 						</View>
// 					);
// 				}}
// 			/>
// 		)}

// 		{post && (
// 			<View style={{ minHeight: Dimensions.get("screen").height - 147 }}>
// 				<VirtualizedList
// 					data={membersData}
// 					keyExtractor={(data) => Math.random()}
// 					renderItem={({ item }) => (
// 						<DetailMember
// 							admin={data.admin}
// 							author={data.createdBy}
// 							item={item}
// 							removeMember={removeMember}
// 							setRemoveMember={setRemoveMember}
// 						/>
// 					)}
// 					ListHeaderComponent={NehHeader}
// 					refreshing={refresh}
// 					onRefresh={() => {
// 						if (page === 0) {
// 							setRefresh(true);
// 							setMembersData([]);
// 							CallApis();
// 						} else {
// 							setMemberPage(0);
// 							setRefresh(true);
// 							setMembersData([]);
// 							CallApis();
// 						}
// 					}}
// 					onEndReachedThreshold={0.1}
// 					onEndReached={() => {
// 						if (hasMemberData) {
// 							setMemberPage((prev) => prev + 1);
// 						}
// 					}}
// 					getItemCount={(data) => data.length}
// 					getItem={(data, index) => data[index]}
// 					showsVerticalScrollIndicator={false}
// 					ListFooterComponent={() => <View style={{ height: 90 }} />}
// 				/>
// 			</View>
// 		)}
// 	</LinearGradient>

// 	<DetailNeighbourhoodTabs
// 		setMembers={setMembers}
// 		setPost={setPost}
// 		members={members}
// 		post={post}
// 	/>

// {confirmLeave && (
// 	<ConfirmModal
// 		setModalVisible={() => {
// 		}}
// 		btnLabel={"Leave neighbourhood"}
// 		message={"Are you sure,\n you want to leave neighbourhood"}
// 		onPress={() => leaveNH()}
// 	/>
// )}

// 	{removeMember && (
// 		<ConfirmModal
// 			setModalVisible={() => {
// 				setRemoveMember(false);
// 			}}
// 			btnLabel={"Remove"}
// 			message={"Are you sure,\n you want to remove member"}
// 			onPress={removeMemberFunc}
// 		/>
// 	)}
// 	{loader && <AppLoading visible={loader} />}
// </View>
