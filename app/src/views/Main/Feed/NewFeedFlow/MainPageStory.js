import { Text } from "native-base";
import React, { useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useInfiniteQuery, useQuery } from "react-query";
import { AppContext } from "../../../../Context/AppContext";
import { userALertLocationUpdateAlert } from "../../../../helper/services/SettingService";
import AlertNotificationItems from "../FeedNotification/AlertComponents/AlertNotificationItems";

function MainPageStory() {
	const c = useRef();
	const { location } = useContext(AppContext);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(
			["mainPage", location?.location?.latitude, location?.location?.longitude],
			async ({ pageParam = 0 }) => {
				let res = await userALertLocationUpdateAlert({
					distance: 10,
					page: pageParam,
					pageSize: 5,
					eventCode: ["NEW_ALERT", "EMERGENCY"],
					point: {
						lat: location.location.latitude,
						lon: location.location.longitude,
					},
				});
				return res;
			},
			{
				getNextPageParam: (_lastPage, pages) => {
					if (pages?.[pages?.length - 1]?.last === false) {
						return pages?.[pages?.length - 1]?.number + 1;
					} else {
						return undefined;
					}
				},
			}
		);

	const onEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	return (
		<>
			{data?.pages?.map((ele) => ele.content).flat()?.length > 0 && (
				<Text
					fontSize={16}
					color={"white"}
					fontWeight="medium"
					ml={2}
					mt={2}
				>
					Nearby Alerts
				</Text>
			)}

			<View style={styles.carousalView}>
				{data?.pages?.map((ele) => ele.content).flat()?.length > 0 && (
					<Carousel
						windowSize={10}
						layout={"default"}
						ref={c}
						enableMomentum={true}
						data={data?.pages?.map((ele) => ele.content).flat()}
						onEndReachedThreshold={0.01}
						onEndReached={onEndReached}
						renderItem={({ item }) => {
							switch (item.eventCode) {
								case "EMERGENCY":
									return (
										<AlertNotificationItems
											itemData={item}
											emergency={true}
										/>
									);

								case "NEW_ALERT":
									return (
										<AlertNotificationItems
											showAddress={true}
											itemData={item}
										/>
									);
							}
						}}
						sliderWidth={Dimensions.get("screen").width}
						itemWidth={Dimensions.get("screen").width - 12}
					/>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, marginTop: 3 },
	carousalView: {
		// position: "absolute",
		// bottom: 90,
		alignSelf: "center",
		width: "95%",
		// paddingHorizontal: 10,
		overflow: "hidden",
		alignItems: "center",
		marginBottom: -20,
		marginTop: 20,
		// borderWidth: 1,
	},
});

export default MainPageStory;

// `````````````````````````` stories

{
	/* <TouchableWithoutFeedback
							onPress={() => navigate("DetailAlert", { alertId: item.id })}
						>
							<View style={{ alignItems: "center" }}>
								<View
									style={{
										height: 70,
										width: 70,
										borderRadius: 35,
										borderWidth: 1,
										// borderColor: color?.primary,
										borderColor: "white",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Image
										source={iconObj[0]?.img}
										style={{ tintColor: "white", height: 30, width: 30 }}
										resizeMode={"cover"}
									/>
								</View>
								<Text
									textAlign={"center"}
									fontSize={12}
									numberOfLines={2}
									width={"60%"}
									color={"white"}
								>
									{item.eventName}
								</Text>
							</View>
						</TouchableWithoutFeedback> */
}
