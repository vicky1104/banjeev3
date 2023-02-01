import React, { useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Text } from "native-base";
import axios from "axios";
import { GOOGLE_MAP_API_KEY } from "../../../../utils/util-func/constantExport";
import color from "../../../../constants/env/color";

function SearchLocationInputComp(props) {
	const [loading, setLoading] = React.useState(false);
	const [suggestionsList, setSuggestionsList] = React.useState(null);
	const controllerRef = useRef();
	const handleChange = (e) => {
		controllerRef.current.open();
		setLoading(true);
		const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAP_API_KEY}&input=${e}&language=en`;
		axios
			.get(url)
			.then((res) => {
				let x = res.data.predictions.map((ele) => ({
					id: ele.place_id,
					title: ele.description,
				}));
				// console.log("--------------", x);
				setLoading(false);
				setSuggestionsList(x);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const selectedItem = (item) => {
		controllerRef.current.setInputText(item?.title);
		const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.id}&key=${GOOGLE_MAP_API_KEY}`;

		axios
			.get(url)
			.then((res) => {
				props?.getData(res.data.result);
				controllerRef.current.close();
				Keyboard.dismiss();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<AutocompleteDropdown
			inputContainerStyle={{ backgroundColor: color?.lightWhite }}
			containerStyle={{
				// display: "flex",

				// width: Dimensions.get("screen").width - 70,

				alignItems: "flex-start",
				backgroundColor: "transparent",
				marginLeft: 10,
			}}
			direction={"down"}
			dataSet={suggestionsList}
			rightButtonsContainerStyle={{
				color: "black",
				backgroundColor: "transparent",
			}}
			controller={(controller) => {
				controllerRef.current = controller;
			}}
			onChangeText={handleChange}
			onClear={props?.getData}
			loading={loading}
			useFilter={false} // prevent rerender twice
			inputHeight={40}
			closeOnBlur={true}
			showChevron={false}
			renderItem={(item, text) => (
				<View style={{}}>
					<Text
						style={{ color: "black", padding: 15 }}
						onPress={() => selectedItem(item)}
					>
						{item.title}
					</Text>
				</View>
			)}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: 70,

		zIndex: 0,
	},
});

export default SearchLocationInputComp;
