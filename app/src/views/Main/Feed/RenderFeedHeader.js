import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Avatar, Switch, Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Image,
	ScrollView,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import PushNotification from "react-native-push-notification";
import { showToast } from "../../../constants/components/ShowToast";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { listMyNeighbourhood } from "../../../helper/services/ListOurNeighbourhood";
import { listProfileUrl } from "../../../utils/util-func/constantExport";
import { MainFeedContext } from "./FeedContext";
import MyNHElement from "./MyNHElement";

export default function RenderFeedHeader({
	setFeedData,
	toggleFeed,
	setToggleFeed,
	setFeedPage,
}) {
	const { navigate } = useNavigation();
	const {
		allNeighbourhood,
		setAllNeighbourhood,
		liveGroup: groupCallData,
	} = useContext(MainFeedContext);
	const _rtcEngine = useContext(CallRtcEngine)?._rtcEngine;

	const [myNeighbourhood, setMyNeighbourhood] = useState([]);
	const refRBSheet = useRef();
	const { setNeighbourhood, neighbourhood, location, profile } =
		useContext(AppContext);
	const [page, setPage] = useState(0);
	const [noMoreData, setNoMoreData] = useState(false);
	const [visible, setVisible] = useState(false);

	const listMyAllNeighbourhood = useCallback(
		() =>
			listMyNeighbourhood()
				.then((res) => {
					setMyNeighbourhood(res);
				})
				.catch((err) => {
					console.error("listMyAllNeighbourhood", err);
				}),
		[]
	);

	useEffect(() => {
		listMyAllNeighbourhood();
	}, [listMyAllNeighbourhood]);

	const joinGroupCall = (data) => {
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			axios
				.get(
					"https://gateway.banjee.org/services/message-broker/api/rooms/findByRoomId/" +
						data?.id
				)
				.then((res) => {
					if (res?.data?.live) {
						PushNotification.cancelLocalNotification(2);
						navigate("GroupCall", {
							cloudId: data.cloudId || "",
							chatRoomId: data?.id,
							chatRoomName: data?.name || "",
							chatRoomImage: data?.imageUrl || "",
							userObject: {
								firstName: profile?.firstName,
								lastName: profile?.lastName,
								id: profile?.systemUserId,
								mobile: profile?.mobile,
								email: profile?.email,
								// uid: getUid(mobile),
							},
							joinGroup: true,
							adminId: res.data?.createdByUser?.id,
						});
					} else {
						showToast(
							"Room is not live. You can join the room after admin make it live."
						);
					}
				})
				.catch((err) => console.error(err));
		}
	};

	const getItemCount = (data) => (data?.length > 0 ? data?.length : 0);
	const keyExtractor = (data) => data?.id;
	const getItem = (data, index) => data?.[index];

	const onEndReached = () => {
		if (!noMoreData) {
			setPage((pre) => pre + 1);
		} else {
			if (page > 0) {
				showToast("you have reached at the end of the post ");
			}
		}
	};

	const footer = () => (
		<View
			style={{
				width: 40,
				marginTop: 60,
			}}
		>
			<AppLoading visible={visible} />
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			{myNeighbourhood.length > 0 && (
				<View
					style={{
						// height: 200,
						backgroundColor: color?.gradientWhite,
						borderBottomWidth: 1,
						paddingBottom: 10,
						borderColor: color?.border,
					}}
				>
					<Text
						fontSize={14}
						fontWeight={"bold"}
						style={{
							color: color?.black,
							marginVertical: 10,
							paddingLeft: "2.5%",
						}}
					>
						Neighbourhood
					</Text>

					<VirtualizedList
						data={myNeighbourhood}
						horizontal
						getItem={getItem}
						onEndReachedThreshold={0.01}
						scrollEventThrottle={150}
						onEndReached={onEndReached}
						getItemCount={getItemCount}
						showsHorizontalScrollIndicator={false}
						keyExtractor={keyExtractor}
						ListFooterComponent={footer}
						renderItem={({ item }) => <MyNHElement item={item} />}
					/>
				</View>
			)}

			{/* ============================================================ */}
			<View
				style={{
					// height: 200,
					backgroundColor: color?.gradientWhite,
					borderBottomWidth: 1,
					paddingBottom: 10,
					borderColor: color?.border,
				}}
			>
				<Text
					fontSize={14}
					// fontStyle="italic"
					fontWeight={"bold"}
					style={{
						color: color?.black,
						marginVertical: 10,
						paddingLeft: "2.5%",
					}}
				>
					Explore
				</Text>

				<VirtualizedList
					data={[
						{
							img: require("../../../../assets/DeleteLater/blog2.png"),
							name: "Blog",
							onPress: () => {
								navigate("MyBlogs");
							},
						},
						{
							img: require("../../../../assets/DeleteLater/group1.png"),
							name: "Community",
						},
						{
							img: require("../../../../assets/DeleteLater/online-shop1.png"),
							name: "Business",
							onPress: () => {
								navigate("BusinessService");
							},
						},
						{
							img: require("../../../../assets/DeleteLater/trade1.png"),
							name: "Buy/Sell",
							onPress: () => {
								navigate("AllProductList");
							},
						},
						{
							img: require("../../../../assets/DeleteLater/pay1.png"),
							name: "Pay Bill",
						},
					]}
					horizontal
					getItem={getItem}
					onEndReachedThreshold={0.01}
					scrollEventThrottle={150}
					getItemCount={getItemCount}
					showsHorizontalScrollIndicator={false}
					keyExtractor={keyExtractor}
					ListFooterComponent={() => <View style={{ marginRight: 10 }} />}
					renderItem={({ item }) => (
						<TouchableWithoutFeedback onPress={item.onPress}>
							<View style={{ paddingBottom: 3 }}>
								<View
									style={{
										padding: 10,
										borderWidth: 1,
										borderColor: color?.border,
										borderRadius: 8,
										marginLeft: 10,
										elevation: 3,
										backgroundColor: color?.gradientWhite,
										alignItems: "center",
										width: 100,
										height: 100,
									}}
								>
									<Image
										source={item.img}
										style={{ height: 50, width: 50, borderRadius: 8, zIndex: 99 }}
									/>
									<Text
										mt={2}
										fontWeight="medium"
										color={color?.black}
										numberOfLines={1}
									>
										{item?.name}
									</Text>
								</View>
							</View>
						</TouchableWithoutFeedback>
					)}
				/>
			</View>

			{/* ============================================================ */}

			<View>
				{groupCallData?.length > 0 && (
					<View style={{ marginVertical: 10 }}>
						{groupCallData.some((ele) => ele.live) ? (
							<Text
								fontWeight={"bold"}
								color={color?.black}
								ml={3}
								mb={2}
							>
								Live Now
							</Text>
						) : null}

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
						>
							{groupCallData?.map((ele) => {
								return (
									<Fragment key={Math.random()}>
										{ele.live && (
											<View style={{ paddingBottom: 5 }}>
												<View
													style={{
														height: 60,
														flexDirection: "row",
														alignItems: "center",
														marginLeft: 10,
														borderRadius: 10,
														width: 350,
														justifyContent: "space-between",
														paddingHorizontal: 10,
														backgroundColor: color?.gradientWhite,
														elevation: 5,
														shadowOffset: { width: 1, height: 1 },
														shadowOpacity: 0.4,
														shadowRadius: 3,
													}}
												>
													<Avatar
														borderColor={color?.border}
														borderWidth={1}
														bgColor={color.gradientWhite}
														style={{ height: 40, width: 40, borderRadius: 20 }}
														source={{ uri: listProfileUrl(ele?.imageUrl) }}
													>
														{ele?.name?.charAt(0)?.toUpperCase() || ""}
													</Avatar>
													<View
														style={{
															// alignItems: "center",
															// justifyContent: "center",
															width: 200,
															marginHorizontal: 10,

															// justifyContent: "center",
														}}
													>
														<Text
															color={color?.black}
															textAlign="left"
															// fontSize={16}
															numberOfLines={2}
														>
															{ele.name}
														</Text>
													</View>

													<TouchableWithoutFeedback
														onPress={() => {
															joinGroupCall(ele);
														}}
													>
														<View
															style={{
																zIndex: 1,
																width: 60,
																alignItems: "center",
																justifyContent: "center",
																backgroundColor: "#D2001A",
																borderRadius: 5,
															}}
														>
															<Text
																color={"white"}
																style={{
																	paddingHorizontal: 10,
																	paddingVertical: 5,
																}}
															>
																Join
															</Text>
														</View>
													</TouchableWithoutFeedback>
												</View>
											</View>
										)}
									</Fragment>
								);
							})}
						</ScrollView>
					</View>
				)}
			</View>

			{/* ============================================================ */}
			<View
				style={{
					backgroundColor: color?.gradientWhite,
					marginVertical: 10,
					paddingHorizontal: "2.5%",
					paddingVertical: 10,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Text
					color={color?.black}
					fontWeight={"bold"}
				>
					Global Feeds
				</Text>

				<Switch
					accessibilityLabel="active"
					size={"lg"}
					offThumbColor={color.grey}
					onThumbColor={color.primary}
					value={toggleFeed}
					onTrackColor={color.gradient}
					onValueChange={(e) => {
						setFeedPage(0);
						setFeedData([]);
						setToggleFeed(e);
					}}
				/>
			</View>
		</View>
	);
}
