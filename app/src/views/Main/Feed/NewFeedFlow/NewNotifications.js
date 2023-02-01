import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ScrollView,
	Dimensions,
} from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import color from "../../../../constants/env/color";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import AlertNotification from "../FeedNotification/AlertNotification";
import { Text } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import {
	getAllCitiesServices,
	userALertLocationUpdateAlert,
} from "../../../../helper/services/SettingService";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import AlertNotificationItems from "../FeedNotification/AlertComponents/AlertNotificationItems";
import AdminNotificaton from "../FeedNotification/FeedReaction/AdminNotificaton";
import { AppContext } from "../../../../Context/AppContext";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";

function NewNotifications(props) {
	const [selectedCity, setSelectedCity] = useState(false);
	const sheetRef = useRef();
	const [city, setCity] = useState([]);

	const [loading, setLoading] = React.useState(false);
	const [filterAlertData, setFilterAlertData] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const { setAlertId } = useContext(MainContext);
	const [refresh, setRefresh] = useState(false);
	const { location } = useContext(AppContext);
	const [hasData, setHasData] = useState(true);
	const [activeIndex, setActiveIndex] = useState();

	useEffect(() => {
		getAllCitiesServices()
			.then((res) => {
				setCity(res);
			})
			.catch((err) => console.warn(err));
	}, []);

	const filterAlertNotification = React.useCallback(async () => {
		// setLoading(true);
		userALertLocationUpdateAlert({
			// distance: 10,
			page,
			cityId: selectedCity.id,
			eventCode: ["NEW_ALERT", "ADMIN_NOTIFICATION", "EMERGENCY"],
			pageSize: 10,
			point: {
				lat: location?.location?.latitude,
				lon: location?.location?.longitude,
			},
		})
			.then((res) => {
				// console.warn("res", res.data);
				setLoading(false);
				setRefresh(false);

				if (res.content.length > 0) {
					setHasData(true);

					let a = res.content.map((ele) => ({
						...ele,
						mediaArray: [
							...ele?.videoUrl?.map((i) => ({ mimeType: "video/mp4", src: i })).flat(),

							...ele?.imageUrl?.map((i) => ({ mimeType: "image/jpg", src: i })).flat(),
						],
					}));

					setFilterAlertData((prev) => [...prev, ...a]);
				} else {
					setHasData(false);
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [page, location, selectedCity]);

	const callApis = React.useCallback(async () => {
		if (selectedCity?.id) {
			filterAlertNotification();
		}
	}, [filterAlertNotification, selectedCity]);

	React.useEffect(() => {
		callApis();
		return () => {
			setAlertId(null);
		};
	}, [callApis]);

	function updatePage() {
		setPage((prev) => prev + 1);
	}

	function showAlertList({ item }) {
		switch (item.eventCode) {
			case "NEW_ALERT":
				return (
					<AlertNotificationItems
						showShare={true}
						showAddress={true}
						itemData={item}
					/>
				);
			case "EMERGENCY":
				return (
					<AlertNotificationItems
						showShare={true}
						showAddress={true}
						itemData={item}
					/>
				);
			case "ADMIN_NOTIFICATION":
				return <AdminNotificaton item={item} />;

			default:
				break;
		}
	}

	const crossBtn = () => {
		setSelectedCity(null), setPage(0), setFilterAlertData([]);
	};
	const onRefresh = () => {
		setFilterAlertData([]);
		setRefresh(true);
		setPage(0);
	};
	const emptyComp = () => (
		<View style={styles.emptyComp}>
			<Text color={color?.black}>
				{refresh
					? " Please wait while refreshing...!"
					: `There is no alerts in ${selectedCity?.name}.`}
			</Text>
		</View>
	);

	return (
		<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
			<View style={{ paddingHorizontal: "2.5%", marginTop: 20 }}>
				<TouchableWithoutFeedback
					onPress={() => {
						// sheetRef.current.open();
					}}
				>
					<View
						style={{
							height: 40,
							borderRadius: 8,
							backgroundColor: color?.lightWhite,
							borderColor: color.grey,
							justifyContent: "center",
							paddingLeft: 10,
						}}
					>
						<View style={styles.text}>
							{selectedCity ? (
								<Text
									fontSize={14}
									color={color?.black}
								>
									{selectedCity.name}
								</Text>
							) : (
								<Text
									fontSize={12}
									opacity={70}
									color={color?.black}
								>
									Global
								</Text>
							)}
							<AntDesign
								name={"down"}
								size={16}
								color="grey"
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</View>

			<RBSheet
				customStyles={{
					container: { borderRadius: 10, backgroundColor: color?.gradientWhite },
				}}
				height={520}
				ref={sheetRef}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				draggableIcon
			>
				<View style={{ flex: 1 }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ flexDirection: "column" }}>
							<Text
								color={color?.black}
								textAlign="center"
								fontSize={18}
							>
								Select City
							</Text>

							{city?.length > 0 &&
								city.map((ele, i) => {
									return (
										<Fragment key={i}>
											<TouchableWithoutFeedback
												onPress={() => {
													setActiveIndex(i);
													setPage(0);
													setFilterAlertData([]);
													setSelectedCity({ name: ele.cityName, id: ele.id });
													sheetRef.current.close();
												}}
											>
												<View
													style={{
														height: 50,
														paddingLeft: 20,
														marginHorizontal: 10,
														borderColor: color?.border,
														borderWidth: 1,
														borderRadius: 8,
														backgroundColor:
															activeIndex === i ? color?.lightWhite : "transparent",
														marginVertical: 10,
														justifyContent: "center",
													}}
												>
													<Text
														fontSize={16}
														color={color?.black}
													>
														{ele.cityName}
													</Text>

													{activeIndex === i && (
														<Entypo
															name="check"
															size={24}
															color={color?.black}
															style={{ position: "absolute", right: 20 }}
														/>
													)}
												</View>
											</TouchableWithoutFeedback>
										</Fragment>
									);
								})}
						</View>
					</ScrollView>
				</View>
			</RBSheet>

			{selectedCity?.id && (
				<View style={styles.chipView}>
					<View style={[styles.chip, { borderColor: color?.border }]}>
						<Text color={color?.black}>{selectedCity?.name}</Text>
						<AppFabButton
							size={12}
							style={{
								backgroundColor: color?.grey,
								borderRadius: 50,
								marginLeft: 10,
							}}
							icon={
								<MaterialIcons
									name="close"
									size={15}
									color={color?.black}
								/>
							}
							onPress={crossBtn}
						/>
					</View>
				</View>
			)}

			<View
				style={{ flex: 1, paddingTop: 10, backgroundColor: color?.gradientWhite }}
			>
				{loading && <AppLoading visible={loading} />}

				{/* {selectedCity?.id ? (
					<VirtualizedList
						showsVerticalScrollIndicator={false}
						getItemCount={(alertData) => alertData?.length}
						getItem={(alertData, index) => alertData[index]}
						onRefresh={onRefresh}
						refreshing={refresh}
						data={filterAlertData}
						ListEmptyComponent={emptyComp}
						keyExtractor={() => Math.random()}
						renderItem={showAlertList}
						onEndReachedThreshold={0.1}
						onEndReached={() => {
							if (hasData) {
								updatePage();
							}
						}}
					/>
				) : ( */}
				<AlertNotification forAnnouncement={true} />
				{/* )} */}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	emptyComp: {
		height: Dimensions.get("screen").height - 300,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	chipView: {
		marginLeft: 10,
		flexWrap: "wrap",
	},
	chip: {
		borderRadius: 18,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		marginVertical: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	text: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginRight: 10,
	},
});

export default NewNotifications;
