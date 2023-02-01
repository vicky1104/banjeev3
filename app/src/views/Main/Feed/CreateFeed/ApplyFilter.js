import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Fragment, useContext, useRef, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import Filters from "./Filters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MainContext } from "../../../../../context/MainContext";
import { LinearGradient } from "expo-linear-gradient";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import Constants from "expo-constants";

export default ApplyFilter = () => {
	const { createFeedData } = useContext(MainContext);
	const { _rtcEngine } = useContext(CallRtcEngine);

	const {
		params: { img },
	} = useRoute();

	const { goBack } = useNavigation();

	const [editedImage, setEditedImage] = useState();
	const extractedUri = useRef();
	const [selectedFilterIndex, setIndex] = useState(0);

	const onExtractImage = ({ nativeEvent }) => {
		extractedUri.current = nativeEvent.uri;
		setEditedImage(nativeEvent.uri);
	};

	const seeImage = async () => {
		try {
			// await uploadToCloudinaryFunc(
			// 	{
			// 		uri: `file://${editedImage}`,
			// 		type: "image/jpg",
			// 		mimeType: "image/jpg",
			// 		name: "ED35378F-2FA2-4D5F-A63C-A1AE453A4B66.jpg",
			// 	},
			// 	"image",
			// 	"feed_image"
			// );

			createFeedData((pre) => ({
				...pre,
				uploadContentData:
					pre?.uploadContentData?.length > 0
						? [
								...pre?.uploadContentData,
								{ type: "image", uri: editedImage, mediaAsset: "feed_image" },
						  ]
						: [{ type: "image", uri: editedImage, mediaAsset: "feed_image" }],
			}));

			goBack();
		} catch (error) {
			console.warn(error);
		}
	};

	const onSelectFilter = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	const renderFilterComponent = ({ item, index }) => {
		const FilterComponent = item.filterComponent;
		const image = (
			<Fragment>
				<Image
					style={styles.filterSelector}
					source={{
						uri: img.uri,
					}}
					resizeMode={"contain"}
				/>
			</Fragment>
		);

		return (
			<TouchableOpacity onPress={() => onSelectFilter(index)}>
				<Text style={styles.filterTitle}>{item.title}</Text>
				<FilterComponent image={image} />
			</TouchableOpacity>
		);
	};

	const SelectedFilterComponent = Filters[selectedFilterIndex].filterComponent;

	return (
		<View>
			<LinearGradient
				style={{
					width: "100%",
					height: "100%",
					marginTop: Constants.statusBarHeight,
					// justifyContent: "space-between",
					backgroundColor: "white",
				}}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={["#ffffff", "#eeeeff"]}
			>
				<View style={{ height: "82%" }}>
					<SelectedFilterComponent
						accessible={true}
						onExtractImage={onExtractImage}
						extractImageEnabled={true}
						image={
							<Fragment>
								<MaterialCommunityIcons
									style={{
										// position: "absolute",
										zIndex: 1,
										alignSelf: "flex-end",
										// right: 10,
										marginTop: 10,
									}}
									name="arrow-right"
									size={30}
									onPress={seeImage}
									color={"black"}
								/>

								<Image
									style={styles.image}
									source={{
										uri: img.uri,
									}}
									resizeMode={"contain"}
								/>
							</Fragment>
						}
					/>
				</View>
				{/* )} */}
				<View style={{ height: "18%" }}>
					<FlatList
						data={Filters}
						keyExtractor={(item) => item.title}
						horizontal={true}
						renderItem={renderFilterComponent}
					/>
				</View>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 520,
		height: 520,
		// marginTop: 10,
		marginVertical: 10,
		alignSelf: "center",
	},
	filterSelector: {
		width: 100,
		height: 100,
		marginVertical: 5,
	},
	filterTitle: {
		fontSize: 12,
		textAlign: "center",
	},
});
