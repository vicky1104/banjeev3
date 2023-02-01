import React, { Fragment, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	Dimensions,
	TouchableWithoutFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import color from "../../../../constants/env/color";
import {
	cloudinaryFeedUrl,
	darkMap,
} from "../../../../utils/util-func/constantExport";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FastImage from "react-native-fast-image";

function DetailNHTopHeader({ data }) {
	const [index, setIndex] = useState(0);
	const mapRef = useRef();
	const c = useRef();

	return (
		<View style={{ width: "100%", height: 300 }}>
			<Carousel
				dotColor={color.primary}
				inactiveDotColor={"grey"}
				layout="default"
				ref={c}
				enableSnap
				enableMomentum={true}
				data={["map", "image"]}
				renderItem={({ item }) => {
					if (item === "map") {
						return (
							<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
								<MapView
									customMapStyle={darkMap}
									userInterfaceStyle={"dark"}
									maxZoomLevel={20}
									initialRegion={{
										latitude: data?.geoLocation?.coordinates[1],
										longitude: data?.geoLocation?.coordinates[0],
										latitudeDelta: 0.001,
										longitudeDelta: 0.001,
									}}
									style={{
										height: "100%",
										width: Dimensions.get("screen").width,
										alignSelf: "center",
									}}
									ref={mapRef}
									provider={PROVIDER_GOOGLE}
								>
									{data?.geoLocation?.coordinates?.[0] &&
										data?.geoLocation?.coordinates?.[1] && (
											<Marker
												coordinate={{
													latitude: data?.geoLocation?.coordinates[1],
													longitude: data?.geoLocation?.coordinates[0],
													latitudeDelta: 0.01,
													longitudeDelta: 0.01,
												}}
											>
												<Entypo
													name="home"
													size={30}
													color="red"
												/>
											</Marker>
										)}
								</MapView>
							</View>
						);
					}
					if (item === "image") {
						return (
							<FastImage
								source={{ uri: cloudinaryFeedUrl(data?.imageUrl, "image", "16:9") }}
								style={{ height: 300, width: Dimensions.get("screen").width }}
								resizeMode="cover"
							/>
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
						["map", "image"].map((ele, i) => (
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
										opacity: activeIndex === i ? 1 : 0.5,
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
						))
					}
					dotsLength={2}
					activeDotIndex={index}
					carouselRef={c}
					renderDots={(activeIndex) =>
						["map", "image"].map((ele, i) => (
							<View
								style={{ flex: 1, alignItems: "center" }}
								key={i}
							>
								<TouchableWithoutFeedback
									onPress={() => {
										if (ele === "map") {
											mapRef.current?.animateToRegion(
												{
													latitude: data?.geoLocation?.coordinates[1],
													longitude: data?.geoLocation?.coordinates[0],
													latitudeDelta: 0.01,
													longitudeDelta: 0.01,
												},
												1000
											);
											c.current.snapToPrev(true, () => {});
										}
										if (ele === "image") {
											c.current.snapToNext(true, () => {});
										}
									}}
								>
									<View
										style={{
											alignItems: "center",
											justifyContent: "center",
											borderWidth: 1,
											borderColor: color?.border,
											backgroundColor: color?.white,
											opacity: activeIndex === i ? 1 : 0.5,
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
								</TouchableWithoutFeedback>
							</View>
						))
					}
					activeOpacity={1}
					// animatedDuration={200}
					animatedFriction={2}
					tappableDots={true}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default DetailNHTopHeader;
