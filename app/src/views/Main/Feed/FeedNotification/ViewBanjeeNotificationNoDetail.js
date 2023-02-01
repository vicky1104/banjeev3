import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	VirtualizedList,
	TouchableWithoutFeedback,
	Image,
	Dimensions,
	Linking,
	Platform,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { getAlertByID } from "../../../../helper/services/CreateAlertService";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import CarousalView from "../../../../constants/components/CarousalView/CarousalView";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import ReportFeed from "../../../../constants/components/Cards/ReportFeed";

function ViewBanjeeNotificationNoDetail(props) {
	const { params } = useRoute();
	const [data, setData] = useState();
	const [visible, setVisible] = useState(true);
	const { profile } = useContext(AppContext);
	const c = useRef();
	const [index, setIndex] = useState(0);
	const [reportModal, setReportModal] = React.useState(false);

	const { setOptions } = useNavigation();

	const [modalVisible, setModalVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [disableView, setDisableView] = useState(false);
	const refReportModal = useRef();

	useEffect(() => {
		apiCall();
	}, [apiCall]);

	const apiCall = useCallback(() => {
		if (params?.id) {
			getAlertByID(params.id)
				.then((res) => {
					let img = res.imageUrl.map((ele) => ({ src: ele, mimeType: "image/jpg" }));
					let video = res.videoUrl.map((ele) => ({
						src: ele,
						mimeType: "video/mp4",
					}));

					let mediaArray = video?.concat(img);

					if (res?.audioSrc) {
						let a = [{ src: res?.audioSrc, mimeType: "audio/mp3" }];
						let b = mediaArray.concat(a);
						setData({ ...res, mediaArray: b });
					} else {
						setData({ ...res, mediaArray });
					}

					setVisible(false);
				})
				.catch((err) => console.error(err));
		}
	}, [params]);

	useEffect(() => {
		setOptions({
			headerTitle: data?.eventName,
			headerRight: () => {
				return (
					<View style={styles.menu}>
						{profile?.systemUserId === data?.createdBy ? (
							<AppMenu
								menuColor={color.black}
								menuContent={[
									{
										icon: "alert-circle-outline",
										label: "Delete alert",
										onPress: () => {
											setDeleteAlert(data?.id);
										},
									},
								]}
							/>
						) : (
							<AppMenu
								menuColor={color?.black}
								menuContent={[
									{
										icon: "alert-circle-outline",
										label: "Report this alert",
										onPress: () => {
											refReportModal?.current?.open();
											setReportModal(data?.id);
										},
									},
								]}
							/>
						)}
					</View>
				);
			},
		});
	}, [data]);

	const headerComponnent = useCallback(() => {
		return (
			<View style={{ width: "100%", height: 300 }}>
				<Carousel
					dotColor={color.primary}
					inactiveDotColor={"grey"}
					layout="default"
					ref={c}
					enableSnap
					enableMomentum={true}
					data={data?.mediaArray}
					renderItem={({ item: ele }) => {
						if (ele.mimeType === "image/jpg") {
							return (
								<TouchableWithoutFeedback
									onPress={() => {
										setModalVisible(true), setCurrentIndex(c.current.currentIndex);
									}}
								>
									<Image
										source={{ uri: cloudinaryFeedUrl(ele.src, "image") }}
										style={{ height: 300, width: Dimensions.get("screen").width }}
										resizeMode="cover"
									/>
								</TouchableWithoutFeedback>
							);
						}
						if (ele.mimeType === "video/mp4") {
							return (
								<TouchableWithoutFeedback
									onPress={() => {
										setModalVisible(true), setCurrentIndex(c.current.currentIndex);
									}}
								>
									<View style={{ flex: 1 }}>
										<AntDesign
											name="playcircleo"
											size={50}
											style={styles.videoIcon}
										/>
										<Image
											source={{ uri: cloudinaryFeedUrl(ele.src, "alertThumbnail") }}
											style={{ height: 300, width: Dimensions.get("screen").width }}
											resizeMode="cover"
										/>
									</View>
								</TouchableWithoutFeedback>
							);
						}
						if (ele.mimeType === "audio/mp3") {
							return (
								<TouchableWithoutFeedback
									onPress={() => {
										setModalVisible(true), setCurrentIndex(c.current.currentIndex);
									}}
								>
									<View
										style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
									>
										<AntDesign
											name="playcircleo"
											size={150}
											style={{ color: color?.black, marginBottom: 50 }}
										/>
										{/* <Image
											source={{ uri: cloudinaryFeedUrl(ele.src, "alertThumbnail") }}
											style={{ height: 300, width: Dimensions.get("screen").width }}
											resizeMode="cover"
										/> */}
									</View>
								</TouchableWithoutFeedback>
							);
						}
					}}
					sliderWidth={Dimensions.get("screen").width}
					itemWidth={Dimensions.get("screen").width}
					onSnapToItem={(index) => setIndex(index)}
				/>

				<View
					style={{
						// backgroundColor: "red",
						position: "absolute",
						bottom: 0,
						width: "50%",
						alignSelf: "center",
					}}
				>
					<Pagination
						dotElement={<Fragment />}
						inactiveDotElement={() =>
							data?.mediaArray.map((ele, i) => {
								return (
									<View
										style={{ flex: 1, alignItems: "center" }}
										key={i}
									>
										<View
											style={{
												alignItems: "center",
												justifyContent: "center",
												borderWidth: 1,
												borderColor: color?.border,
												backgroundColor: color?.white,
												opacity: c?.current?.currentIndex !== i ? 1 : 0.5,
												borderRadius: 8,
												height: 40,
												width: 40,
											}}
										>
											<Entypo
												name={"home"}
												size={20}
												color={color?.black}
											/>
										</View>
									</View>
								);
							})
						}
						dotsLength={data?.mediaArray?.length}
						activeDotIndex={index}
						carouselRef={c}
						renderDots={(activeIndex) =>
							data?.mediaArray.map((ele, ind) => {
								return (
									<View
										style={{ flex: 1, alignItems: "center" }}
										key={ind}
									>
										<TouchableWithoutFeedback
											onPress={() => {
												data?.mediaArray.map((el, i) => {
													if (el.mimeType === "image/jpg") {
														c.current.snapToItem(
															ind,
															true,
															() => {
																true;
															},
															false,
															false
														);
													}
													if (el.mimeType === "video/mp4") {
														c.current.snapToItem(ind, true, () => {}, false, false);
													}
													if (el.mimeType === "audio/mp3") {
														c.current.snapToItem(ind, true, () => {}, false, false);
													}
												});
											}}
										>
											<View
												style={{
													alignItems: "center",
													justifyContent: "center",
													borderWidth: 1,
													borderColor: color?.border,
													backgroundColor: color?.white,
													opacity: c?.current?.currentIndex === ind ? 1 : 0.5,
													borderRadius: 8,
													height: 40,
													width: 40,
												}}
											>
												{ele?.mimeType === "image/jpg" && (
													<Entypo
														name={"image"}
														size={20}
														color={color?.black}
													/>
												)}
												{ele?.mimeType === "video/mp4" && (
													<Entypo
														name={"video"}
														size={20}
														color={color?.black}
													/>
												)}
												{ele?.mimeType === "audio/mp3" && (
													<Entypo
														name={"mic"}
														size={20}
														color={color?.black}
													/>
												)}
											</View>
										</TouchableWithoutFeedback>
									</View>
								);
							})
						}
						activeOpacity={1}
						animatedFriction={2}
						tappableDots={true}
					/>
				</View>
			</View>
		);
	}, [data]);

	return (
		<View style={{ backgroundColor: color?.gradientWhite, flex: 1 }}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<VirtualizedList
					keyExtractor={(data) => Math.random()}
					ListHeaderComponent={headerComponnent}
					data={[data]}
					getItem={(data, index) => data?.[index]}
					getItemCount={(data) => data?.length}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						return (
							<View
								pointerEvents={disableView ? "none" : "auto"}
								style={{
									flex: 1,
									paddingHorizontal: "2.5%",
									borderTopLeftRadius: 20,
									borderTopRightRadius: 20,
									borderWidth: 1,
									borderBottomWidth: 0,
									borderColor: color.border,
									paddingBottom: 50,
									marginTop: -20,
									backgroundColor: color?.gradientWhite,
								}}
							>
								<View
									style={{
										// height: 200,
										width: "100%",
										alignSelf: "center",
										paddingTop: 20,
									}}
								>
									<View style={styles.row}>
										<View style={{ width: "80%" }}>
											<Text
												fontSize={16}
												color={color?.black}
												fontWeight={"medium"}
											>
												{item?.eventName}
											</Text>
											<View style={styles.row}>
												<Ionicons
													name="person"
													size={16}
													color="grey"
												/>
												<Text
													ml={2}
													color={color?.black}
													opacity={80}
												>
													{`${item?.createdByUser.firstName} ${item?.createdByUser.lastName}`}
												</Text>
											</View>
										</View>
									</View>
								</View>

								{item?.description && (
									<View style={{ marginTop: 10 }}>
										{/* <Text
											fontSize={16}
											color={color?.black}
											fontWeight="medium"
										>
											DESCRIPTION
										</Text> */}

										<Text
											fontSize={16}
											fontWeight="medium"
											// opacity={70}
											color={color?.black}
											mt={1}
										>
											{item?.description}
										</Text>
									</View>
								)}

								{/* <View>
									{item?.audioSrc && (
										// <AudioComp
										// 	ref={audioRef}
										// 	messId={null}
										// 	status={null}
										// 	isSender={true}
										// 	chatContent={null}
										// 	src={cloudinaryFeedUrl(item?.audioSrc, "audio")}
										// 	base64Content={null}
										// 	selfDestructive={{
										// 		selfDestructive: false,
										// 		destructiveAgeInSeconds: 0,
										// 	}}
										// />
										<View style={{ marginTop: 20 }}>
											<Text
												fontSize={16}
												color={color?.black}
												fontWeight="medium"
											>
												Voice Note
											</Text>
											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<AppFabButton
													size={20}
													onPress={() => {
														playPause();
													}}
													icon={
														<AntDesign
															name={icon}
															size={26}
															color={color?.black}
														/>
													}
												/>
												<Text color={color?.black}>{reverseTimefunc()}</Text>
											</View>
										</View>
									)}
								</View> */}

								{/*```````````````````````````````` Direction btn */}

								{/* <View
									style={{
										flexDirection: "row",
										alignItems: "center",
										alignSelf: "center",
									}}
								>
									{distance <= 2000
										? profile?.systemUserId === data?.createdBy
											? null
											: !data?.confirmIncidence && (
													<View
														style={{
															marginTop: 20,
															alignSelf: "center",
															width: 140,
															marginRight: 20,
														}}
													>
														{disableView ? (
															<View
																style={{
																	width: "100%",
																	height: 40,
																	borderWidth: 1,
																	borderColor: color?.border,
																	borderRadius: 8,
																	// marginTop: 10,
																	zIndex: 9999,
																}}
															>
																<AppLoading
																	visible={true}
																	size={20}
																/>
															</View>
														) : (
															<AppButton
																titleFontSize="14"
																title={"Confirm Incident"}
																onPress={confirmIncident}
															/>
														)}
													</View>
											  )
										: null}

									<View
										style={{
											marginTop: 20,
											alignSelf: "center",
											width: 110,
											// borderRadius: 55,
											// overflow: "hidden",
										}}
									>
										<AppButton
											titleFontSize="14"
											title={"Get Direction"}
											onPress={navigateToMap}
										/>
									</View>
								</View> */}
							</View>
						);
					}}
				/>
			)}

			{modalVisible && (
				<CarousalView
					fullScreen={true}
					currentIndex={currentIndex}
					item={data?.mediaArray}
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				/>
			)}
			{reportModal && (
				<ReportFeed
					refRBSheet={refReportModal}
					onPress={() => {}}
					setModalVisible={setReportModal}
					modalVisible={reportModal}
					feedId={reportModal}
					reportType="alert"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row", alignItems: "center" },
	chip: {
		borderWidth: 1,
		borderRadius: 24,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginBottom: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	videoIcon: {
		color: "black",
		position: "absolute",
		right: Dimensions.get("screen").width / 2 - 20,
		top: "35%",
		zIndex: 1,
	},
	imgHeight: {
		height: 180,
		width: 140,
		borderRadius: 8,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "grey",
	},
	imgView: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		marginTop: 10,
	},
	comment: {
		borderRightWidth: 1,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		height: Platform.OS === "android" ? 40 : 50,
	},
	share: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: Platform.OS === "android" ? 40 : 50,
		flexDirection: "row",
		alignItems: "center",
	},
});

export default ViewBanjeeNotificationNoDetail;
