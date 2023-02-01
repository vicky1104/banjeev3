import axios from "axios";
import { useFormikContext } from "formik";
import { Text } from "native-base";
import React, {
	Fragment,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { View, StyleSheet } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import color from "../../../../constants/env/color";
import { Entypo } from "@expo/vector-icons";
import {
	darkMap,
	GOOGLE_MAP_API_KEY,
} from "../../../../utils/util-func/constantExport";
import AutocompleteInput from "react-native-autocomplete-input";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";

function SelectBuisnessLocation({ setAddress }) {
	const {
		values: { location },
		setFieldValue,
		setTouched,
	} = useFormikContext();
	const [suggestionsList, setSuggestionsList] = React.useState([]);
	const [myLoc, setMyLoc] = useState({
		latitudeDelta: 0.001,
		longitudeDelta: 0.001,
		...location,
	});

	const [data, setData] = useState();
	const [hideResult, setHideResult] = useState(false);
	const mapRef = useRef().current;
	const autoRef = useRef();
	const [select, setSelect] = useState(false);
	useEffect(() => {
		apiSearchByLocation();
	}, [apiSearchByLocation]);

	const key = GOOGLE_MAP_API_KEY;
	const handleChange = (e) => {
		setHideResult(false);

		const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${e}&language=en`;
		axios
			.get(url)
			.then((res) => {
				let x = res.data.predictions.map((ele) => ({
					id: ele.place_id,
					title: ele.description,
				}));
				setData(e);
				setSelect(true);
				setSuggestionsList(x);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const apiSearchByLocation = useCallback(() => {
		setHideResult(true);
		let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${myLoc?.latitude},${myLoc?.longitude}&key=${key}`;
		axios
			.get(url)
			.then((res) => {
				let x = res.data.results.map((ele) => ({
					id: ele.place_id,
					title: ele.formatted_address,
				}));
				setSelect(false);
				setSuggestionsList([x[0]]);
				setData(x[0]);
				setAddress(x[0].title);
				autoRef.current?.setItem(x[0]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [myLoc]);

	const selectedItem = (item) => {
		if (item?.id) {
			setHideResult(true);
			const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item?.id}&key=${key}`;
			setData(item);
			setAddress(item.title);
			axios
				.get(url)
				.then((res) => {
					let loc = res.data?.result?.geometry?.location;
					setMyLoc((pre) => ({
						...pre,
						latitude: loc?.lat,
						longitude: loc?.lng,
					}));
					mapRef?.animateToCoordinate(
						{
							latitude: loc?.lat,
							longitude: loc?.lng,
						},
						200
					);
					setFieldValue("location", {
						latitude: loc.lat,
						longitude: loc.lng,
						latitudeDelta: 0.001,
						longitudeDelta: 0.001,
					});
				})
				.catch((err) => {
					console.warn(err);
				});
		}
	};

	return (
		<Fragment>
			<AutocompleteInput
				data={suggestionsList}
				renderTextInput={() => (
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<AppInput
							placeholder="Search loaction"
							onChangeText={(txt) => handleChange(txt)}
							style={{ width: "90%", padding: 5, color: color?.black }}
							value={data?.title}
							deboune={600}
						/>

						<AppFabButton
							size={20}
							onPress={() => setData(null)}
							icon={
								<Entypo
									name="cross"
									size={24}
									color="grey"
								/>
							}
						/>
					</View>
				)}
				hideResults={hideResult}
				containerStyle={{
					width: "100%",
					maxHeight: select ? 600 : 40,
					backgroundColor: color?.lightWhite,
				}}
				flatListProps={{
					keyExtractor: (_, idx) => idx,
					renderItem: ({ item }) => (
						<Text
							onPress={() => {
								setSelect(false);
								selectedItem(item);
							}}
							style={{ color: color?.black, padding: 15 }}
						>
							{item?.title}
						</Text>
					),
				}}
			/>

			<View
				style={{
					marginVertical: 10,
					borderWidth: 1,
					borderRadius: 8,
					borderColor: color?.lightWhite,
					overflow: "hidden",
					zIndex: -1,
				}}
			>
				{myLoc?.latitude && myLoc?.longitude && (
					<MapView
						mapType="standard"
						customMapStyle={darkMap}
						provider={PROVIDER_GOOGLE}
						ref={mapRef}
						showsPointsOfInterest={true}
						onPress={(e) => {
							apiSearchByLocation(e.nativeEvent.coordinate);
							setFieldValue("location", e.nativeEvent.coordinate);
							setMyLoc(e.nativeEvent.coordinate);
						}}
						showsCompass={false}
						maxZoomLevel={12}
						initialRegion={{
							latitudeDelta: 0.001,
							longitudeDelta: 0.001,
							...myLoc,
						}}
						userLocationPriority="high"
						region={{
							latitudeDelta: 0.001,
							longitudeDelta: 0.001,
							...myLoc,
						}}
						onRegionChange={() => {}}
						style={{
							zIndex: -1,
							height: 200,
							width: "100%",
							alignSelf: "center",
						}}
					>
						<Marker
							coordinate={{
								latitudeDelta: 0.001,
								longitudeDelta: 0.001,
								...myLoc,
							}}
						>
							<Entypo
								name="location-pin"
								size={30}
								color="red"
							/>
						</Marker>
					</MapView>
				)}
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default memo(SelectBuisnessLocation);
