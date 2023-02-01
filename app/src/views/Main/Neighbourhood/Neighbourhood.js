import { Entypo, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, Modal, Text } from "native-base";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { copilot, CopilotStep, walkthroughable } from "react-native-copilot";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Carousel from "react-native-snap-carousel";
import SplashScreen from "react-native-splash-screen";
import CopilotToolTip from "../../../constants/components/copilotConfig";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { listAllNeighbourhood } from "../../../helper/services/ListOurNeighbourhood";
import {
	getLocalStorage,
	setLocalStorage,
} from "../../../utils/Cache/TempStorage";
import { darkMap } from "../../../utils/util-func/constantExport";
import SearchLocationInputComp from "../Feed/CreateFeed/SearchLocationInputComp";
import NeighbourhoodItem from "./NeighbourhoodItem";
import Constants from "expo-constants";

const CopilotView = walkthroughable(View);
function Neighbourhood(props) {
	const { location, neighbourhood } = useContext(AppContext);
	const [loading, setLoading] = React.useState(false);
	const { setOptions, goBack, navigate } = useNavigation();
	const [page, setPage] = useState(0);
	const mapRef = useRef(null);
	const carosuelRef = useRef(null);
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [firstModal, setFirstModal] = useState(false);
	const [searchByNeighbourhood, setSearchByNeighbourhood] = useState(true);
	const [last, setLast] = useState(false);
	const [text, setText] = useState("");
	const controllerRef = useRef();

	const getNeighbourhoodList = useCallback(
		(latitude, longitude) => {
			setLoading(true);

			let payload = {};
			if (text.length > 0) {
				payload = {
					online: true,
					text,
				};
			} else {
				payload = {
					online: true,
					lat: latitude,
					lon: longitude,
					//radius: 5,
					text,
					page,
					pageSize: 10,
				};
			}
			listAllNeighbourhood(payload)
				.then((res) => {
					setLast(res?.last);
					if (res?.content?.length > 0) {
						setLoading(false);
						setShowModal(false);
						mapRef.current.animateToRegion(
							{
								latitude: res?.content?.[0]?.geoLocation.coordinates[1],
								longitude: res?.content?.[0]?.geoLocation.coordinates[0],
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							},
							3000
						);
					} else if (page === 0 && !neighbourhood?.id) {
						setTimeout(() => {
							setShowModal(true);
						}, 2000);
					} else {
						setLoading(false);
					}
					setData((pre) => [
						...pre,
						...res.content.map((ele) => ({ ...ele, key: Math.random() })),
					]);
					SplashScreen.hide();
				})
				.catch((err) => console.warn(err));
		},
		[page, text, neighbourhood]
	);

	const apiCall = useCallback(
		(latitude, longitude) => {
			mapRef.current.animateToRegion(
				{
					latitude,
					longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				},
				3000
			);
			getNeighbourhoodList(latitude, longitude);
		},
		[getNeighbourhoodList]
	);

	const getMyModal = useCallback(() => {
		getLocalStorage("firstModal").then(async (res) => {
			if (!JSON.parse(res)) {
				setFirstModal(true);
				await setLocalStorage("firstModal", true);
			} else {
				setFirstModal(false);
			}
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			getLocalStorage("walkThrough2").then((res) => {
				if (!JSON.parse(res)) {
					if (props?.start) {
						props?.start();
					}
				} else {
					getMyModal();
				}
			});

			setOptions({
				headerTransparent: true,
				headerShown: false,
			});
		}, [getMyModal])
	);

	useEffect(() => {
		if (location?.location) {
			apiCall(location?.location?.latitude, location?.location?.longitude);
		}
	}, [apiCall, location]);

	const renderItem = ({ item, index }) => {
		if (index === 0) {
			return (
				<CopilotStep
					order={5}
					text={"Neighbourhoods"}
					name="search by location Neighbourhoods"
				>
					<CopilotView>
						<NeighbourhoodItem
							currentIndex={carosuelRef?.current?.currentIndex}
							index={index}
							item={item}
						/>
					</CopilotView>
				</CopilotStep>
			);
		} else {
			return (
				<NeighbourhoodItem
					currentIndex={carosuelRef?.current?.currentIndex}
					index={index}
					item={item}
				/>
			);
		}
	};

	const renderModal = () => (
		<Modal
			isOpen={showModal}
			onClose={setShowModal}
			closeOnOverlayClick={true}
			overlayVisible
		>
			<Modal.Content
				maxWidth="400px"
				minHeight={200}
				maxHeight={200}
				backgroundColor="#202124"
			>
				<Modal.Header
					borderBottomColor={"transparent"}
					backgroundColor="#202124"
				>
					<Text color={"#fff"}>Request Neighbourhood</Text>
				</Modal.Header>
				<Modal.Body>
					<Text color={"#ffffff90"}>There this no nearby neighbourhood found</Text>
				</Modal.Body>
				<Modal.Footer
					borderTopColor={"transparent"}
					backgroundColor="#202124"
				>
					<Button.Group space={2}>
						<Button
							onPress={() => {
								setShowModal(false);
								navigate("CreateNeighbourhood");
							}}
						>
							Create Neighbourhood
						</Button>
					</Button.Group>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);

	const renderFirstModalModal = () => (
		<Modal
			isOpen={firstModal}
			onClose={() => {
				setLocalStorage("firstModal", true).then((res) => {
					setFirstModal(false);
				});
			}}
			closeOnOverlayClick={true}
			overlayVisible
			backgroundColor={"#00000080"}
		>
			<Modal.Content
				maxWidth="400px"
				minHeight={250}
				maxHeight={350}
				backgroundColor="#202124"
			>
				<Modal.Header
					borderBottomColor={"transparent"}
					backgroundColor="#202124"
				>
					<Text color={"#fff"}>Select Your Neighborhood</Text>
				</Modal.Header>
				<Modal.Body>
					<Text color={"#ffffff90"}>
						To set you up, Banjee requires you to search for the neighborhood you
						belong to. Please select or search for your neighborhood and get started
						NOW!
					</Text>
				</Modal.Body>
				<Modal.Footer
					borderTopColor={"transparent"}
					backgroundColor="#202124"
				>
					<Button
						style={{ width: "100%" }}
						onPress={() => {
							setLocalStorage("firstModal", true).then((res) => {
								setFirstModal(false);
							});
						}}
					>
						Continue
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
	const handleChange = (e) => {
		controllerRef.current.open();
		setText(e);
	};

	const selectedItem = (item) => {
		controllerRef.current.setInputText(item?.name);
	};
	console.warn(carosuelRef?.current?.currentIndex);
	return (
		<>
			{showModal && renderModal()}
			{renderFirstModalModal()}
			<View
				style={{
					position: "absolute",
					top: Constants.statusBarHeight,
					left: 0,
					zIndex: 9999,
					width: Dimensions.get("screen").width,
				}}
			>
				<View
					style={{
						// marginTop: 30,
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
						flex: 1,
						// height: 75,
						width: Dimensions.get("screen").width,
					}}
				>
					<MaterialIcons
						name="arrow-back"
						size={24}
						onPress={() => goBack()}
						color={color?.black}
					/>

					{searchByNeighbourhood ? (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
							<CopilotStep
								order={1}
								text={"Search neighbourhood by name"}
								name="search"
							>
								<CopilotView style={{ width: "70%" }}>
									<AutocompleteDropdown
										containerStyle={{
											zIndex: 12,
											width: "100%",
											borderWidth: 1,
											flexDirection: "row",
											alignItems: "center",
											alignSelf: "center",
											borderRadius: 50,
											elevation: 3,
											shadowOffset: { width: 1, height: 1 },
											shadowOpacity: 0.4,
											shadowRadius: 3,
											borderColor: color?.border,
											backgroundColor: color?.gradientWhite,
										}}
										inputHeight={45}
										inputContainerStyle={{
											backgroundColor: color?.gradientWhite,
											borderRadius: 50,
										}}
										textInputProps={{
											placeholderTextColor: color?.black,
											placeholder: "Search neighbourhood",
											autoCorrect: false,
											autoCapitalize: "none",
											style: {
												color: color?.black,
											},
										}}
										debounce={600}
										onFocus={() => setData([])}
										direction={"down"}
										dataSet={data}
										rightButtonsContainerStyle={{
											color: "black",
											backgroundColor: "transparent",
										}}
										controller={(controller) => {
											controllerRef.current = controller;
										}}
										onChangeText={handleChange}
										onClear={() => {
											setText("");
											setData([]);
										}}
										loading={loading}
										useFilter={false}
										closeOnBlur={true}
										showChevron={false}
										renderItem={(item, text) => (
											<View style={{}}>
												<Text
													style={{ color: "black", padding: 15 }}
													onPress={() => selectedItem(item)}
												>
													{item.name}
												</Text>
											</View>
										)}
									/>
								</CopilotView>
							</CopilotStep>
							<CopilotStep
								order={2}
								text={"Search location"}
								name="search2"
							>
								<CopilotView>
									<TouchableWithoutFeedback
										onPress={() => {
											setSearchByNeighbourhood(false);
										}}
									>
										<View
											style={[
												{
													borderWidth: 1,

													elevation: 3,
													shadowOffset: { width: 1, height: 1 },
													shadowOpacity: 0.4,
													shadowRadius: 3,
													borderColor: color?.border,
													backgroundColor: color?.gradientWhite,
													padding: 10,
													borderRadius: 25,
												},
												{
													padding: 10,
													borderRadius: 25,
												},
											]}
										>
											<FontAwesome5
												onPress={() => {
													setSearchByNeighbourhood(false);
												}}
												name="search-location"
												size={24}
												color="white"
											/>
										</View>
									</TouchableWithoutFeedback>
								</CopilotView>
							</CopilotStep>
						</View>
					) : (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
							<TouchableWithoutFeedback
								onPress={() => {
									setSearchByNeighbourhood(true);
								}}
							>
								<View
									style={[
										{
											borderWidth: 1,

											elevation: 3,
											shadowOffset: { width: 1, height: 1 },
											shadowOpacity: 0.4,
											shadowRadius: 3,
											borderColor: color?.border,
											backgroundColor: color?.gradientWhite,
											padding: 10,
											borderRadius: 25,
										},
										{
											padding: 10,
											borderRadius: 25,
										},
									]}
								>
									<MaterialIcons
										onPress={() => {
											setSearchByNeighbourhood(true);
										}}
										name="home"
										size={24}
										color="white"
									/>
								</View>
							</TouchableWithoutFeedback>

							<SearchLocationInputComp
								containerStyle={{
									zIndex: 12,
									width: "70%",
									borderWidth: 1,
									flexDirection: "row",
									alignItems: "center",
									alignSelf: "center",
									borderRadius: 50,
									elevation: 3,
									shadowOffset: { width: 1, height: 1 },
									shadowOpacity: 0.4,
									shadowRadius: 3,
									borderColor: color?.border,
									backgroundColor: color?.gradientWhite,
								}}
								inputHeight={45}
								inputContainerStyle={{
									backgroundColor: color?.gradientWhite,
									borderRadius: 50,
								}}
								textInputProps={{
									placeholderTextColor: color?.black,
									placeholder: "Search by location",
									autoCorrect: false,
									autoCapitalize: "none",
									style: {
										color: color?.black,
									},
								}}
								getData={(data) => {
									setPage(0);
									if (data?.geometry?.location) {
										const { lat, lng } = data.geometry.location;
										setData([]);
										apiCall(lat, lng);
									} else {
										setData([]);
										apiCall(location?.location?.latitude, location?.location?.longitude);
									}
								}}
							/>
						</View>
					)}
					<CopilotStep
						order={3}
						text={"Search neighbourhood by current location"}
						name="search bt location"
					>
						<CopilotView>
							<View
								style={{
									elevation: 3,
									shadowOffset: { width: 1, height: 1 },
									shadowOpacity: 0.4,
									shadowRadius: 3,
									borderColor: color?.border,
									backgroundColor: color?.gradientWhite,
									padding: 10,
									borderRadius: 25,
								}}
							>
								<MaterialIcons
									name="gps-fixed"
									size={24}
									onPress={() => {
										setData([]);
										setText("");
										apiCall(location?.location?.latitude, location?.location?.longitude);
									}}
									color={color?.black}
								/>
							</View>
						</CopilotView>
					</CopilotStep>
				</View>

				<CopilotStep
					order={4}
					text={"Click to create new neighbourhood"}
					name={"Click to create new neighbourhood"}
				>
					<CopilotView
						style={{
							position: "absolute",
							right: 10,
							top: 80,
						}}
					>
						<View
							style={{
								backgroundColor: color?.gradientWhite,
								borderWidth: 1,
								elevation: 3,
								shadowOffset: { width: 1, height: 1 },
								shadowOpacity: 0.4,
								shadowRadius: 3,
								borderColor: color?.border,
								width: 47,
								padding: 10,
								borderRadius: 25,
								alignSelf: "center",
							}}
						>
							<MaterialIcons
								name="add"
								size={24}
								onPress={() => {
									navigate("CreateNeighbourhood");
								}}
								color={color?.black}
							/>
						</View>
						<Text
							color={color?.black}
							fontSize={12}
							textAlign="center"
						>
							Create
						</Text>
						<Text
							fontSize={12}
							color={color?.black}
						>
							Neighbourhood
						</Text>
					</CopilotView>
				</CopilotStep>
			</View>

			<MapView
				customMapStyle={darkMap}
				// mapType="standard"
				// liteMode={true}
				ref={mapRef}
				showsCompass={false}
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				userInterfaceStyle={"dark"}
				// showsUserLocation={true}
				maxZoomLevel={20}
				userLocationPriority="low"
				onRegionChange={() => {}}
			>
				<Marker
					coordinate={{
						...location?.location,
						latitudeDelta: 0.001,
						longitudeDelta: 0.001,
					}}
				>
					<Entypo
						name="location-pin"
						size={30}
						color="red"
						style={{
							width: 100,
							height: 100,
							position: "absolute",
							top: 5,
							left: 5,
						}}
					/>
				</Marker>
				{data.map((ele, i) => {
					return (
						<Marker
							key={i}
							coordinate={{
								latitude: ele?.geoLocation.coordinates[1],
								longitude: ele?.geoLocation.coordinates[0],
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}}
							style={{ alignItems: "center", justifyContent: "center" }}
						>
							<Entypo
								name="home"
								size={30}
								color="lightgreen"
							/>
							<Text
								textAlign={"center"}
								color={color?.black}
							>
								{ele?.name}
							</Text>
						</Marker>
					);
				})}
			</MapView>

			{/* ````````````````````````` carousal */}

			<View style={{ position: "absolute", bottom: 30, left: 0 }}>
				<Carousel
					onSnapToItem={(item) => {
						// setMyLoc({
						// 	latitude: data?.[item].geoLocation.coordinates[1],
						// 	longitude: data?.[item].geoLocation.coordinates[0],
						// 	latitudeDelta: 0.001,
						// 	longitudeDelta: 0.001,
						// });

						mapRef.current.animateToRegion(
							{
								latitude: data?.[item].geoLocation.coordinates[1],
								longitude: data?.[item].geoLocation.coordinates[0],
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							},
							3000
						);
					}}
					onEndReached={() => {
						if (!last) {
							setPage((pre) => pre + 1);
						}
					}}
					onEndReachedThreshold={0.01}
					layout="default"
					keyExtractor={(data) => data.key}
					ref={carosuelRef}
					data={data}
					horizontal={true}
					enableSnap={true}
					enableMomentum={true}
					renderItem={renderItem}
					sliderWidth={Dimensions.get("screen").width}
					itemWidth={Dimensions.get("screen").width - 150}
				/>
			</View>
			{data?.length > 0 && (
				<View
					style={{
						position: "absolute",
						bottom: 2,
						backgroundColor: color?.gradientWhite,
						width: "100%",
						alignSelf: "center",
						borderRadius: 8,
						paddingHorizontal: 20,
						paddingVertical: 10,
						alignItems: "center",
					}}
				>
					<Text color={color?.black}>NearBy Neighbourhoods</Text>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	next: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4CAF50",
		height: 40,
		width: 70,
		zIndex: 9,
		position: "absolute",
		top: 40,
		right: 10,
		justifyContent: "center",
		borderRadius: 10,
	},
	map: {
		width: "100%",
		height: "100%",
		position: "absolute",
		top: 0,
		left: 0,
	},
});

export default copilot(CopilotToolTip)(Neighbourhood);
