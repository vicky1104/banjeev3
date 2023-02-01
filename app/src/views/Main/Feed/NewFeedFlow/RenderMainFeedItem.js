import { Text } from "native-base";
import React from "react";
import { View, StyleSheet } from "react-native";
import color from "../../../../constants/env/color";
import RenderFeedItem from "../RenderFeedItem";
import MainHeader from "./MainHeader";
import ToggleFeeds from "./ToggleFeeds";

function RenderMainFeedItem({
	item,
	setFeedData,
	toggleFeed,
	setToggleFeed,
	setFeedPage,
	setReportModal,
	setDeletePostModal,
	commentSheetRef,
	refReportSheet,
}) {
	switch (item.type) {
		case "header":
			return <MainHeader />;

		case "switch":
			return (
				<ToggleFeeds
					toggleFeed={toggleFeed}
					setFeedData={setFeedData}
					setFeedPage={setFeedPage}
					setToggleFeed={setToggleFeed}
				/>
			);

		case "neighbourhood-posts":
		case "global-posts":
			return (
				<RenderFeedItem
					item={item}
					refReportSheet={refReportSheet}
					setReportModal={setReportModal}
					setDeletePostModal={setDeletePostModal}
					commentSheetRef={commentSheetRef}
				/>
			);
		case "groupHeader":
			return (
				<View
					style={{
						justifyContent: "center",
						// alignItems: "center",
						paddingLeft: "2.5%",
						paddingVertical: 10,
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: color?.border,
						marginBottom: 10,
						backgroundColor: color?.gradientWhite,
					}}
				>
					<Text
						color={color?.black}
						fontWeight={"bold"}
						fontSize={18}
					>
						Posts
					</Text>
				</View>
			);
		case undefined:
			return (
				<RenderFeedItem
					item={item}
					refReportSheet={refReportSheet}
					setReportModal={setReportModal}
					setDeletePostModal={setDeletePostModal}
					commentSheetRef={commentSheetRef}
				/>
			);

		case "empty":
			return (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text color={color?.black}> There is no post yet!</Text>
				</View>
			);
		default:
			return null;
	}
}

const styles = StyleSheet.create({
	container: {},
});

export default RenderMainFeedItem;
