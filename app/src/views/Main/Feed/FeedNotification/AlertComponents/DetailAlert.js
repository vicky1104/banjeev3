import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
	Entypo,
	MaterialIcons,
} from "@expo/vector-icons";
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
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { MainContext } from "../../../../../../context/MainContext";
import ReportFeed from "../../../../../constants/components/Cards/ReportFeed";
import CarousalView from "../../../../../constants/components/CarousalView/CarousalView";
import GetDistance from "../../../../../constants/components/GetDistance";
import AppButton from "../../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import AppMenu from "../../../../../constants/components/ui-component/AppMenu";
import color from "../../../../../constants/env/color";
import { AppContext } from "../../../../../Context/AppContext";

import {
	confirmIncidentService,
	deleteMyAlertService,
	getAlertByID,
} from "../../../../../helper/services/CreateAlertService";
import {
	alertIcons,
	cloudinaryFeedUrl,
	darkMap,
} from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import { shareAlert } from "../../../../Other/ShareApp";
import ConfirmModal from "../../../../Others/ConfirmModal";

function DetailAlert(props) {
	const {
		params: { alertId },
	} = useRoute();

	const { profile, location } = useContext(AppContext);
	const { setIncidentCount } = useContext(MainContext);
	const { setOptions, goBack, navigate } = useNavigation();
	const [data, setData] = useState();
	const [reportModal, setReportModal] = React.useState(false);
	const [visible, setVisible] = useState(true);
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [disableView, setDisableView] = useState(false);
	const iconObj = alertIcons.filter((ele) => data?.eventName === ele.name);
	const refReportModal = useRef();
	const [index, setIndex] = useState(0);
	const c = useRef();
	const mapRef = useRef();
	const distance = useRef().current;
	const alertApiCall = useCallback((id) => {
		getAlertByID(id)
			.then((res) => {
				setIncidentCount((prev) => ({
					...prev,
					[alertId]: res.confirmIncidenceCount,
				}));
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

				setDisableView(false);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		if (alertId) {
			alertApiCall(alertId);
		}
	}, [alertId, alertApiCall]);

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

		// ````````````````````````	LOAD SOUND
	}, [data]);

	function confirmIncident() {
		setDisableView(true);
		confirmIncidentService({
			alertId: alertId,
			userId: data?.createdBy,
		})
			.then((res) => {
				alertApiCall(alertId);
			})
			.catch((err) => {
				setDisableView(false);
				console.warn(err);
			});
	}

	const headerComponnent = useCallback(() => {
		const icon = alertIcons.filter((ele) => data?.eventName === ele.name);
		return (
			<View style={{ width: "100%", height: 300 }}>
				<Carousel
					dotColor={color.primary}
					inactiveDotColor={"grey"}
					layout="default"
					ref={c}
					enableSnap
					enableMomentum={true}
					data={[...data?.mediaArray, "map"]}
					renderItem={({ item: ele }) => {
						if (ele === "map") {
							return (
								<View style={{ overflow: "hidden" }}>
									{data?.location.coordinates.length > 0 && (
										<MapView
											mapType="hybrid"
											// liteMode={true}
											customMapStyle={darkMap}
											showsCompass={false}
											maxZoomLevel={20}
											// initialCamera={{
											// 	center: {
											// 		latitude: data?.location.coordinates[1],
											// 		longitude: data?.location.coordinates[0],
											// 	},

											// 	pitch: 0,
											// 	heading: 0,
											// 	altitude: 0,
											// 	zoom: 15,
											// }}
											initialRegion={{
												latitude: data?.location.coordinates[1],
												longitude: data?.location.coordinates[0],
												latitudeDelta: 0.001,
												longitudeDelta: 0.001,
											}}
											userLocationPriority="low"
											provider={PROVIDER_GOOGLE}
											onRegionChange={() => {}}
											style={{
												height: "100%",
												width: "100%",
												alignSelf: "center",
												overflow: "hidden",
											}}
										>
											<Marker
												coordinate={{
													latitude: data?.location.coordinates[1],
													longitude: data?.location.coordinates[0],
												}}
											>
												<View
													style={{
														alignItems: "center",
														borderWidth: 1,
														padding: 4,
														height: 40,
														width: 40,
														borderRadius: 8,
														backgroundColor: "rgba(0,0,0,0.5)",
													}}
												>
													{icon.map((ele, i) => (
														// <ele.type
														// 	key={i}
														// 	name={ele.icon}
														// 	size={30}
														// 	color={color?.black}
														// />
														<Image
															key={i}
															source={ele.img}
															style={{ height: 24, width: 24, tintColor: color?.black }}
														/>
													))}
												</View>
											</Marker>
										</MapView>
									)}

									<View style={{ position: "absolute", bottom: 30, right: 10 }}>
										<View style={[styles.chip, { backgroundColor: "rgba(0,0,0,0.8)" }]}>
											<View style={{ marginRight: 5 }}>
												<MaterialIcons
													name="directions-run"
													size={12}
													color="red"
												/>
											</View>

											<GetDistance
												ref={distance}
												lat1={location?.location?.latitude}
												lon1={location?.location?.longitude}
												lat2={data?.location?.coordinates[1]}
												lon2={data?.location?.coordinates[0]}
											/>
										</View>
									</View>

									{data?.confirmIncidenceCount > 0 && (
										<View style={{ position: "absolute", bottom: 30, left: 10 }}>
											<View style={[styles.chip, { backgroundColor: color?.white }]}>
												<View style={{ marginRight: 5 }}>
													<Ionicons
														name="ios-people-outline"
														size={12}
														color="white"
													/>
												</View>
												<Text
													fontSize={10}
													style={{ textAlign: "center", color: color?.black }}
													fontWeight={100}
												>
													{`${data?.confirmIncidenceCount} person confirmed`}
												</Text>
											</View>
										</View>
									)}
								</View>
							);
						}
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
							[...data?.mediaArray, "map"].map((ele, i) => {
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
												name={ele === "map" ? "location" : "home"}
												size={20}
												color={color?.black}
											/>
										</View>
									</View>
								);
							})
						}
						dotsLength={data?.mediaArray?.length + 1}
						activeDotIndex={index}
						carouselRef={c}
						renderDots={(activeIndex) =>
							[...data?.mediaArray, "map"].map((ele, ind) => {
								return (
									<View
										style={{ flex: 1, alignItems: "center" }}
										key={ind}
									>
										<TouchableWithoutFeedback
											onPress={() => {
												data?.mediaArray.map((el, i) => {
													if (ele === "map") {
														mapRef.current?.animateToRegion(
															{
																latitude: data?.location.coordinates[1],
																longitude: data?.location.coordinates[0],
																latitudeDelta: 0.01,
																longitudeDelta: 0.01,
															},
															1000
														);
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
												{ele === "map" && (
													<Entypo
														name={"location"}
														size={20}
														color={color?.black}
													/>
												)}
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
		<View
			style={{
				flex: 1,
				backgroundColor: color?.gradientWhite,
			}}
		>
			{visible ? (
				<AppLoading visible={true} />
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
													{item?.anonymous
														? "Anonymous"
														: `${item?.createdByUser.firstName} ${item?.createdByUser.lastName}`}
												</Text>
											</View>

											<View
												style={{
													// flexDirection: "row",
													width: "100%",
													justifyContent: "space-between",
													alignItems: "flex-start",
												}}
											>
												<Text
													color={color?.black}
													opacity={70}
												>
													{item?.metaInfo?.address}
												</Text>
											</View>
										</View>

										<View
											style={{
												width: "20%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{iconObj.map((ele, i) => {
												return (
													<Image
														key={i}
														source={ele.img}
														style={{ height: 24, width: 24, tintColor: color?.black }}
													/>
												);
											})}
											<Text color={color?.black}>{convertTime(item?.createdOn)}</Text>
										</View>
									</View>
								</View>

								{item?.description && (
									<View style={{ marginTop: 20 }}>
										<Text
											fontSize={16}
											color={color?.black}
											fontWeight="medium"
										>
											Description
										</Text>

										<Text
											opacity={70}
											color={color?.black}
											mt={1}
										>
											{item?.description}
										</Text>
									</View>
								)}

								{/* <View>
									{checkAudio && (
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
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										alignSelf: "center",
									}}
								>
									{distance?.value / 1000 <= 2
										? profile?.systemUserId === data?.createdBy
											? null
											: !data?.confirmIncidence && (
													<View
														style={{
															marginTop: 20,
															alignSelf: "center",
															width: 140,
															// borderRadius: 70,
															// overflow: "hidden",
															marginRight: 20,
														}}
													>
														{disableView ? (
															<View
																style={{
																	// backgroundColor: "red",
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
										{/* <AppButton
											titleFontSize="14"
											title={"Get Direction"}
											onPress={navigateToMap}
										/> */}
										<AppButton
											titleFontSize="14"
											title={"Get Location"}
											onPress={() => {
												navigate("TrackDirection", { data });
											}}
										/>
									</View>
								</View>
							</View>
						);
					}}
				/>
			)}

			{/* ````````````````````````````````````  comments */}

			<View
				style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					alignSelf: "center",
					alignItems: "center",
					borderWidth: 1,
					backgroundColor: color?.grey,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "100%",
						justifyContent: "space-between",
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => navigate("AlertComment", { alertId })}
					>
						<View style={styles.comment}>
							<Ionicons
								name="chatbubble-outline"
								color={color.greyText}
								size={20}
							/>

							<Text
								color={color.greyText}
								ml={2}
							>
								{data?.totalComments > 0 && data?.totalComments} Comment
							</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={() => shareAlert(data, "alert")}>
						<View style={styles.share}>
							<MaterialCommunityIcons
								name="share-variant"
								color={color.greyText}
								size={20}
							/>
							<Text
								color={color.greyText}
								ml={2}
							>
								Share
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>

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

			{deleteAlert && (
				<ConfirmModal
					setModalVisible={setDeleteAlert}
					btnLabel={"Delete"}
					message="Delete this alert"
					onPress={() =>
						deleteMyAlertService(data.id)
							.then((res) => goBack())
							.catch((err) => console.warn(err))
					}
					title={"Delete"}
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

			{/* <TrackDirectionModal
				modalVisible={directionModal}
				setModalVisible={setDirectionModal}
				data={data}
			/> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
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
		// borderLeftWidth: 1,
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

export default DetailAlert;
