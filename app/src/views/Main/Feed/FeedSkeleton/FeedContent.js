import React from "react";
import {
	Dimensions,
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Platform,
	Linking,
} from "react-native";
import ContentViewer from "../ContentViewer";
import Carousel, { Pagination } from "react-native-snap-carousel";
import color from "../../../../constants/env/color";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import ViewMoreText from "react-native-view-more-text";
import { Text } from "native-base";

function FeedContent({ item: feedData }) {
	const [index, setIndex] = React.useState(0);
	const c = React.useRef();
	const renderItem = ({ item }) => (
		<ContentViewer
			{...item}
			id={feedData.id}
		/>
	);
	let longitude = feedData?.locationId?.split(":")[1]?.split(",")[0];
	let latitude = feedData?.locationId?.split(":")[2]?.split(",")[0];
	let locationName = feedData?.locationId?.split(":")[3]?.split("}")[0];

	async function navigateToMap() {
		const scheme = Platform.select({
			ios: "maps:0,0?q=",
			android: "geo:0,0?q=",
		});
		const latLng = `${latitude},${longitude}`;
		const label = locationName;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}

	function renderViewMore(onPress) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.moreText}>
					<MaterialCommunityIcons
						name="chevron-down"
						size={20}
						color={color.greyText}
					/>
					<Text style={{ color: color.greyText }}>Show more</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	function renderViewLess(onPress) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.moreText}>
					<MaterialCommunityIcons
						name="chevron-up"
						size={20}
						color={color.greyText}
					/>
					<Text style={{ color: color.greyText }}>Show less</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	return (
		<View
			style={{
				marginBottom: 20,
				zIndex: 9999,
			}}
		>
			{feedData?.text?.length > 0 && (
				<ViewMoreText
					numberOfLines={3}
					renderViewMore={renderViewMore}
					renderViewLess={renderViewLess}
					textStyle={{
						width: "95%",
						alignSelf: "center",
						marginTop: 10,
						marginBottom: 10,
					}}
				>
					<Text color={color?.black}>{feedData?.text.trim()}</Text>
				</ViewMoreText>
			)}

			{locationName && (
				<TouchableWithoutFeedback onPress={navigateToMap}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginLeft: 5,
							marginBottom: 5,
						}}
					>
						<EvilIcons
							name="location"
							size={24}
							color={color?.link}
						/>
						<Text
							color={color?.link}
							numberOfLines={1}
							width="90%"
						>
							{locationName}
						</Text>
					</View>
				</TouchableWithoutFeedback>
			)}

			{feedData?.mediaContent?.length > 0 && (
				<View
					style={{
						width: "100%",
						backgroundColor: color?.white,
						alignSelf: "center",
						marginTop: feedData?.text?.length === 0 ? 10 : 0,
						minHeight: 350,
					}}
				>
					<Carousel
						enableSnap
						removeClippedSubviews={true}
						dotColor={color.primary}
						inactiveDotColor={"grey"}
						layout="default"
						ref={c}
						data={feedData.mediaContent}
						enableMomentum={true}
						renderItem={renderItem}
						sliderWidth={Dimensions.get("screen").width - 10}
						itemWidth={Dimensions.get("screen").width - 10}
						onSnapToItem={(index) => setIndex(index)}
						lockScrollWhileSnapping={true} // Prevent the user from swiping again while the carousel is snapping to a position.
						contentContainerCustomStyle={{ backgroundColor: color?.white }}
					/>
					<View
						style={{
							// backgroundColor: "red",
							// position: "absolute",
							// bottom: 0,
							width: "10%",
							alignSelf: "center",
							height: 1,
						}}
					>
						<Pagination
							dotsLength={feedData.mediaContent.length}
							activeDotIndex={index}
							carouselRef={c}
							dotStyle={{
								width: 8,
								height: 8,
								borderRadius: 4,
								// backgroundColor: color.primary,
								backgroundColor: "rgba(0, 0, 0, 0.92)",
							}}
							activeOpacity={1}
							inactiveDotOpacity={0.4}
							inactiveDotScale={0.6}
							tappableDots={true}
						/>
					</View>
				</View>
			)}
		</View>
	);
}
export default FeedContent;

const styles = StyleSheet.create({
	moreText: {
		flexDirection: "row",
		width: "95%",
		alignSelf: "center",
		// marginLeft: 20,
		alignItems: "center",
		marginTop: -7,
		marginBottom: 5,
	},
});
