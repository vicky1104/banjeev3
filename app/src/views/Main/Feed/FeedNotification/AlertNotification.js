import { useIsFocused } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, VirtualizedList } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import FeedView from "../../../../constants/components/FeedView/FeedView";
import AlertItemSkeleton from "../../../../constants/components/ui-component/Skeleton/AlertItemSkeleton";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { userALertLocationUpdateAlert } from "../../../../helper/services/SettingService";
import AlertNotificationItems from "./AlertComponents/AlertNotificationItems";
import AdminNotificaton from "./FeedReaction/AdminNotificaton";

function AlertNotification({ forAnnouncement }) {
	const [loading, setLoading] = React.useState(true);
	const [alertData, setAlertData] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const { setAlertId } = useContext(MainContext);
	const [refresh, setRefresh] = useState(false);
	const { location } = useContext(AppContext);
	const [hasData, setHasData] = useState(true);
	const mainScrollVideoPlayer = useRef();

	const allAlertNotification = React.useCallback(async () => {
		userALertLocationUpdateAlert({
			// distance: 10,
			page,

			eventCode: ["NEW_ALERT", "ADMIN_NOTIFICATION", "EMERGENCY"],
			pageSize: 10,
			point: {
				lat: location?.location?.latitude,
				lon: location?.location?.longitude,
			},
		})
			.then((res) => {
				setLoading(false);
				setRefresh(false);
				if (res?.last) {
					setHasData(true);
				} else {
					setHasData(false);
				}
				if (res.content.length > 0) {
					// console.warn(
					// 	res.content.map((ele) => ele.videoUrl),
					// 	"videp"
					// );
					// console.warn(
					// 	res.content.map((ele) => ele.imageUrl),
					// 	"image"
					// );

					let a = res.content.map((ele) => ({
						...ele,
						mediaArray: [
							...ele?.videoUrl?.map((i) => ({ mimeType: "video/mp4", src: i })).flat(),
							...ele?.imageUrl?.map((i) => ({ mimeType: "image/jpg", src: i })).flat(),
						],
					}));

					let y = a.map((ele) => {
						if (ele?.audioSrc) {
							return {
								...ele,
								mediaArray: [
									...ele.mediaArray,
									{ mimeType: "audio/mp3", src: ele.audioSrc },
								],
							};
						} else {
							return ele;
						}
					});

					setAlertData((prev) => [...prev, ...y]);
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [page, location]);

	const callApis = React.useCallback(async () => {
		await allAlertNotification();
	}, [allAlertNotification]);

	React.useEffect(() => {
		callApis();
		return () => {
			setAlertId(null);
		};
	}, [callApis]);

	function updatePage() {
		setPage((prev) => prev + 1);
	}

	function showAlertList({ item, index }) {
		switch (item.eventCode) {
			case "NEW_ALERT":
				return (
					<AlertNotificationItems
						showShare={true}
						showAddress={true}
						itemData={item}
						index={index}
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: ref?.itemRef?.[item?.key],
								};
							}
						}}
					/>
				);
			case "EMERGENCY":
				return (
					<AlertNotificationItems
						showShare={true}
						showAddress={true}
						itemData={item}
						emergency={true}
						index={index}
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: ref?.itemRef?.[item?.key],
								};
							}
						}}
					/>
				);
			case "ADMIN_NOTIFICATION":
				return (
					<AdminNotificaton
						item={item}
						index={index}
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: ref?.itemRef?.[item?.key],
								};
							}
						}}
					/>
				);

			default:
				break;
		}
	}

	const focused = useIsFocused();

	return (
		<View style={{ flex: 1, paddingTop: 10, backgroundColor: "black" }}>
			{loading ? (
				<AlertItemSkeleton />
			) : (
				<>
					<FeedView
						onRefresh={() => {
							if (page === 0) {
								setRefresh(true);
								setAlertData([]);
								callApis();
							} else {
								setRefresh(true);
								setAlertData([]);
								setPage(0);
							}
						}}
						refreshing={refresh}
						data={alertData.map((ele) => ({ ...ele, key: Math.random() }))}
						ListEmptyComponent={() => (
							<View
								style={{
									height: "100%",
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text color={color?.black}>
									{refresh ? " Please wait while refreshing...!" : "No Alerts...!"}
								</Text>
							</View>
						)}
						ListFooterComponent={() => (
							<View style={{ paddingBottom: forAnnouncement ? 85 : 20 }} />
						)}
						renderItem={(e) => showAlertList(e)}
						onEndReachedThreshold={0.1}
						onEndReached={() => {
							if (!hasData) {
								updatePage();
							}
						}}
						isFocused={focused}
						mainScrollVideoPlayer={mainScrollVideoPlayer}
					/>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 56,
		width: "100%",
	},
	subContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 0.5,
		borderColor: "black",
		height: "100%",
		width: "100%",
	},
	img: {
		height: 40,
		width: 40,
		borderRadius: 20,
		marginLeft: 10,
	},

	txt: { fontSize: 14, color: color.greyText, marginLeft: 20 },
});

export default AlertNotification;
