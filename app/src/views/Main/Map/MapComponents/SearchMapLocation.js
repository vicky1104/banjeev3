import React, {
	Fragment,
	useRef,
	useCallback,
	useState,
	useEffect,
} from "react";
import {
	View,
	StyleSheet,
	VirtualizedList,
	TouchableWithoutFeedback,
	Dimensions,
	Keyboard,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import RBSheet from "react-native-raw-bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import { Text } from "native-base";
import color from "../../../../constants/env/color";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { useDispatch, useSelector } from "react-redux";
import { setMapData } from "../../../../redux/store/action/mapAction";
import { useNavigation } from "@react-navigation/native";

function SearchMapLocation() {
	const dispatch = useDispatch();
	const {
		userLocation,
		searchData,
		refRBSheet: sheet,
	} = useSelector((state) => state.map);

	const refRBSheet = useRef(null);
	const { navigate } = useNavigation();

	const [suggestionsList, setSuggestionsList] = useState([]);

	const handleChange = (e) => {
		const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBqW8iaz-_qlaTMc1ynbj9f7mpfmbVUcW4&input=${e}&language=en`;
		axios
			.get(url)
			.then((res) => {
				let x = res.data.predictions.map((ele) => ({
					id: ele.place_id,
					title: ele.description,
				}));
				setSuggestionsList(x);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const getCurrentLocation = async () => {
		let locationAsync = await Location.getCurrentPositionAsync({});
		dispatch(
			setMapData({ searchData: { ...userLocation, ...locationAsync.coords } })
		);
		refRBSheet.current.close();
	};

	const getMySearchLocation = useCallback(
		(data) => {
			dispatch(
				setMapData({
					searchData: { ...searchData, ...data },
				})
			);

			navigate("Map");

			refRBSheet.current.close();
		},
		[sheet]
	);

	const locHandler = useCallback((data) => {
		getMySearchLocation({ ...data, open: true });
	}, []);

	useEffect(() => {
		if (sheet.open && refRBSheet.current) {
			refRBSheet.current.open();
		}
	}, [sheet]);

	const navigateLocation = ({ title, id }) => {
		const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=AIzaSyBqW8iaz-_qlaTMc1ynbj9f7mpfmbVUcW4`;
		axios
			.get(url)
			.then((res) => {
				let x = res.data.result.geometry.location;
				let loc = {
					longitude: x.lng,
					latitude: x.lat,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				};
				locHandler({ loc, title });
				setSuggestionsList([]);
			})
			.catch((err) => console.warn(err));
	};
	const renderItem = ({ item }) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					navigateLocation(item);
				}}
			>
				<View style={{ flexDirection: "row", marginTop: 10 }}>
					<EvilIcons
						name="location"
						color={"black"}
						size={20}
						style={{ marginTop: 5 }}
					/>

					<View style={{ marginLeft: 10 }}>
						<Text
							numberOfLines={1}
							style={{ fontWeight: "bold" }}
							onPress={() => {
								Keyboard.dismiss((e) => console.warn(e));
								navigateLocation(item);
							}}
						>
							{item.title.split(",")[0]}
						</Text>

						<Text
							fontSize={16}
							numberOfLines={2}
							onPress={() => {
								navigateLocation(item);
							}}
						>
							{item.title}
						</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<Fragment>
			<RBSheet
				customStyles={{
					container: { borderRadius: 10, padding: 5 },
				}}
				height={500}
				width={"100%"}
				onClose={() => {
					dispatch(setMapData({ refRBSheet: { ...sheet, open: false } }));
				}}
				ref={refRBSheet}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				// keyboardAvoidingViewEnabled={true}
			>
				<View style={styles.container}>
					<Text style={{ fontSize: 18 }}>Select Location</Text>

					<View>
						{/* SEARCH ICON */}

						<MaterialCommunityIcons
							style={styles.icon}
							name={"magnify"}
							size={25}
							color={color.black}
						/>

						<View
							style={{
								position: "absolute",
								marginTop: 10,
								width: "100%",
							}}
						>
							{/* TEXT INPUT */}

							<AppInput
								style={{
									paddingLeft: 45,
									height: 40,
									width: "100%",
									borderRadius: 8,
									padding: 10,
									borderWidth: 1,
									backgroundColor: "white",
								}}
								placeholder={"Search Location"}
								onChangeText={handleChange}
							/>

							<TouchableWithoutFeedback onPress={getCurrentLocation}>
								<View style={styles.grp}>
									<FastImage
										style={styles.img}
										source={require("../../../../../assets/EditDrawerIcon/ic_loc_center.png")}
									/>
									<Text
										onPress={getCurrentLocation}
										style={{ color: color.primary }}
									>
										Use your current location
									</Text>
								</View>
							</TouchableWithoutFeedback>
							<VirtualizedList
								getItemCount={(data) => data.length}
								getItem={(data, index) => data[index]}
								showsVerticalScrollIndicator={false}
								data={suggestionsList}
								renderItem={renderItem}
							/>
						</View>
					</View>
				</View>
			</RBSheet>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		zIndex: 9,
		width: Dimensions.get("window").width,
		alignSelf: "center",
	},
	icon: {
		//    transform: [{ rotate: "90deg" }],
		position: "absolute",
		top: 17,
		zIndex: 1,
		left: 10,
	},
	img: {
		tintColor: color.primary,
		width: 20,
		height: 20,
		marginRight: 10,
	},
	grp: {
		marginTop: 10,
		flexDirection: "row",
		alignItems: "center",
	},
});

export default SearchMapLocation;
