import {
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Entypo,
} from "@expo/vector-icons";
import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	Image,
	Linking,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Sound from "react-native-sound";
import { MainContext } from "../../../../../../context/MainContext";
import ReportFeed from "../../../../../constants/components/Cards/ReportFeed";
import CarousalView from "../../../../../constants/components/CarousalView/CarousalView";
import GetDistance from "../../../../../constants/components/GetDistance";
import AppButton from "../../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import AppMenu from "../../../../../constants/components/ui-component/AppMenu";
import DetailAlertSkeleton from "../../../../../constants/components/ui-component/Skeleton/DetailAlertSkeleton";
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
	listProfileUrl,
} from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import { shareAlert } from "../../../../Other/ShareApp";
import ConfirmModal from "../../../../Others/ConfirmModal";

function DetailEmergencyAlert(props) {
	const {
		params: { alertId },
	} = useRoute();

	const { profile, location } = useContext(AppContext);

	const { setIncidentCount, alertId: contextAlertId } = useContext(MainContext);

	const { setOptions, goBack, navigate } = useNavigation();

	const [data, setData] = useState();

	const [audio, setAudio] = useState();
	const [reportModal, setReportModal] = React.useState(false);
	const [visible, setVisible] = useState(true);
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState();
	const [disableView, setDisableView] = useState(false);
	const iconObj = alertIcons.filter((ele) => data?.eventName === ele.name);
	const refReportModal = useRef();
	const [newAlertCount, setNewAlertCount] = useState();
	const distance = useRef().current;

	const alertApiCall = useCallback((id) => {
		getAlertByID(id)
			.then((res) => {
				setIncidentCount((prev) => ({
					...prev,
					[alertId]: res?.confirmIncidenceCount,
				}));
				setDisableView(false);
				setVisible(false);
				setData(res);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		if (alertId) {
			alertApiCall(alertId);
		}
	}, [alertId, alertApiCall]);

	useFocusEffect(
		useCallback(() => {
			setNewAlertCount(contextAlertId?.[alertId] || 0);
		}, [alertId, contextAlertId])
	);

	useEffect(() => {
		setOptions({
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

		if (data?.audioSrc) {
			loadSound();
		}

		return () => {
			if (audio?.isPlaying()) {
				// console.warn("first");
				audio?.pause();
				audio?.release();
			}
		};
	}, [data]);

	const loadSound = () => {
		Sound.setCategory("Playback");

		var ding = new Sound(
			cloudinaryFeedUrl(data?.audioSrc, "audio"),
			null,
			(error) => {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				}
			}
		);

		ding.setVolume(1);
		setAudio(ding);
	};

	async function navigateToMap() {
		const scheme = Platform.select({
			ios: "maps:0,0?q=",
			android: "geo:0,0?q=",
		});
		const latLng = `${data?.location.coordinates[1]},${data?.location.coordinates[0]}`;
		const label = data?.eventName;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}

	// dince in Km

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
			<View style={{ overflow: "hidden" }}>
				{data?.location.coordinates.length > 0 && (
					<MapView
						mapType="hybrid"
						// liteMode={true}
						customMapStyle={darkMap}
						showsCompass={false}
						maxZoomLevel={20}
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
							height: Dimensions.get("screen").height - 400,
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
								}}
							>
								<Entypo
									name="location-pin"
									size={30}
									color="red"
								/>
								<View
									style={{
										backgroundColor: "rgba(0,0,0,0.5)",
										paddingHorizontal: 10,
										borderRadius: 8,
									}}
								>
									<Text
										color={color?.black}
										opacity={80}
									>
										{`${data?.createdByUser.firstName} ${data?.createdByUser.lastName}`}
									</Text>
								</View>
							</View>
						</Marker>
					</MapView>
				)}

				<View style={{ position: "absolute", bottom: 30, right: 10 }}>
					<View
						style={[
							styles.chip,
							{ borderColor: "red", backgroundColor: "rgba(0,0,0,0.5)" },
						]}
					>
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
								fontSize={12}
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
	}, [data]);

	let imgUrl =
		data?.imageUrl?.length > 0
			? data.imageUrl.map((ele) => {
					return { mimeType: "image/jpg", src: ele };
			  })
			: [];

	let videoUrl =
		data?.videoUrl?.length > 0
			? data?.videoUrl.map((ele) => {
					return {
						mimeType: "video/mp4",
						src: ele,
					};
			  })
			: [];

	let mediaArray = imgUrl.concat(videoUrl);

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
				// <DetailAlertSkeleton />
				// <AppLoading visible={true} />
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
									paddingBottom: 50,
									marginTop: -30,
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
														source={ele.img}
														style={{ height: 24, width: 24, tintColor: color?.black }}
													/>
												);
											})}
											<Text color={color?.black}>{convertTime(item?.createdOn)}</Text>
										</View>
									</View>
								</View>

								<Text
									color={color?.black}
									mt={2}
								>
									{`${item?.createdByUser.firstName} ${item?.createdByUser.lastName}`}'s
									picture
								</Text>
								<Image
									source={{ uri: listProfileUrl(data?.createdBy) }}
									style={{ height: 200, width: 150, marginTop: 10 }}
								/>
								{/*```````````````````````````````` Direction btn */}
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										alignSelf: "center",
									}}
								>
									{distance?.value <= 2
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
					{/* <View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<MaterialCommunityIcons
								name={"heart-outline"}
								color={color.greyText}
								size={22}
							/>

							<Text
								color={color.greyText}
								ml={2}
							>
								Like
							</Text>
						</View> */}

					<TouchableWithoutFeedback
						onPress={() => navigate("AlertComment", { alertId })}
					>
						<View
							style={{
								borderRightWidth: 1,
								// borderLeftWidth: 1,
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "row",
								height: Platform.OS === "android" ? 40 : 50,
							}}
						>
							<Ionicons
								name="chatbubble-outline"
								color={color.greyText}
								size={20}
							/>
							<Text
								color={color.greyText}
								ml={2}
							>
								{newAlertCount} Comment
							</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback
						onPress={() => {
							shareAlert(data, "emergency");
						}}
					>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								height: Platform.OS === "android" ? 40 : 50,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
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

			<CarousalView
				currentIndex={currentIndex}
				item={mediaArray}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
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
		right: 55,
		top: 70,
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
});

export default DetailEmergencyAlert;
