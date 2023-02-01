import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
} from "@react-navigation/native";
import axios from "axios";
import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { Dimensions, View, VirtualizedList } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import NotificationSkeleton from "../../../../constants/components/ui-component/Skeleton/NotificationSkeleton";
import color from "../../../../constants/env/color";
import { getLocalStorage } from "../../../../utils/Cache/TempStorage";
import SinglePost from "../SinglePost";
import FeedReactionNotification from "./FeedReaction/FeedReactionNotification";

function NotifyNotification(props) {
	const [loading, setLoading] = React.useState(true);
	const [refreshing, setRefreshing] = React.useState(false);
	const [notificationData, setNotificationData] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [hasData, setHasData] = useState(false);
	const { openPostModal, setOpenPostModal, modalData } = useContext(MainContext);

	const eventName = [
		"NEW_COMMENT",
		"FEED_REACTION",
		"REPLIED",
		"COMMENT_REACTION",
		"ACCEPT_REQUEST",
		"FEED_REMOVED",
		"NEW_BLOG_COMMENT",
		"NEW_ALERT_COMMENT",
		"REACTION_BLOG",
	];

	const callApis = React.useCallback(async () => {
		let token = await getLocalStorage("token");
		axios
			.post(
				"https://gateway.banjee.org/services/message-broker/api/message/delivery/filter",
				{
					payload: {
						all: true,
						eventName: eventName,
						page: page,
						pageSize: 15,
						sortby: "createdOn desc",
					},
				},
				{
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				if (res?.data?.last) setHasData(false), setRefreshing(false);
				else setHasData(true);
				setLoading(false);
				setRefreshing(false);
				setNotificationData((prev) => [...prev, ...res.data.content]);
			})
			.catch((err) => {
				setLoading(false);
				console.error(err);
			});
	}, [page]);

	React.useEffect(() => {
		callApis();
	}, [callApis]);

	function updatePage() {
		if (hasData) {
			setPage((prev) => prev + 1);
		}
	}

	function showNotificationList({ item, index }) {
		return (
			<FeedReactionNotification
				item={item}
				index={index}
			/>
		);
	}

	let focused = useIsFocused();

	useEffect(() => {
		if (modalData && focused) {
			setOpenPostModal(true);
		}
		return () => {
			setOpenPostModal(false);
		};
	}, [modalData, focused]);

	return (
		<>
			<View
				style={{
					height: Dimensions.get("screen").height,
					backgroundColor: color.gradientWhite,
				}}
			>
				{loading && <NotificationSkeleton />}

				<VirtualizedList
					showsVerticalScrollIndicator={false}
					getItemCount={(notificationData) => notificationData?.length}
					getItem={(notificationData, index) => notificationData?.[index]}
					onRefresh={() => {
						setRefreshing(true);
						callApis();
						setNotificationData([]);
						setPage(0);
					}}
					refreshing={refreshing}
					data={notificationData}
					keyExtractor={() => Math.random()}
					renderItem={showNotificationList}
					onEndReachedThreshold={0.1}
					ListEmptyComponent={() => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								height: Dimensions.get("screen").height - 200,
							}}
						>
							<Text color={color.black}>
								{refreshing ? "Please wait while refreshing..." : "No Notifications"}
							</Text>
						</View>
					)}
					onEndReached={() => {
						updatePage();
					}}
				/>
			</View>
			{openPostModal && <SinglePost />}
		</>
	);
}

export default NotifyNotification;
