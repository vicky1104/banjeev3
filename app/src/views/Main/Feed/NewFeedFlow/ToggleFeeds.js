import { Text } from "native-base";
import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";

function ToggleFeedsItem(
	{ toggleFeed, setPage, setData, setNoMoreData, setToggleFeed },
	ref
) {
	useImperativeHandle(ref, () => null, []);
	const { neighbourhood } = useContext(AppContext);
	return (
		<View style={[styles.container, { backgroundColor: color?.white }]}>
			<TouchableNativeFeedback
				onPress={() => {
					if (neighbourhood) {
						setToggleFeed(false);
						// setData([]);
						// setNoMoreData(true);
						// setPage(0);
					} else {
						showToast("You have to join neighbourhood to show local feeds.");
					}
				}}
			>
				<Text
					color={!toggleFeed ? color?.black : "#ffffff90"}
					fontWeight={!toggleFeed ? "bold" : "300"}
					fontSize={!toggleFeed ? 16 : 14}
				>
					Local Feeds
				</Text>
			</TouchableNativeFeedback>

			<TouchableNativeFeedback
				onPress={() => {
					setToggleFeed(true);
					// setData([]);
					// setNoMoreData(true);
					// setPage(0);
				}}
			>
				<Text
					color={toggleFeed ? color?.black : "#ffffff90"}
					fontWeight={toggleFeed ? "bold" : "300"}
					fontSize={toggleFeed ? 16 : 14}
				>
					Global Feeds
				</Text>
			</TouchableNativeFeedback>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// marginTop: 20,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
		flex: 1,
		width: "100%",
		alignSelf: "center",
		paddingVertical: 15,
		// marginVertical: 10,
		// borderStartColor: "black",
		// borderEndColor: "black",
		// marginBottom: 20,
		// borderWidth: 2,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
		// borderBottomWidth: 0,
		// borderColor: color?.border,
		paddingHorizontal: "2.5%",
		// paddingTop: 30,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		// borderWidth: 1,
	},
});

export default ToggleFeeds = forwardRef(ToggleFeedsItem);
