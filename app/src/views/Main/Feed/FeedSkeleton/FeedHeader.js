import { EvilIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import React, { Fragment, useContext } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import GetDistance from "../../../../constants/components/GetDistance";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { convertTime } from "../../../../utils/util-func/convertTime";

export default function FeedHeader({
	item,
	setDeletePostModal,
	setReportModal,
	refReportSheet,
	singlePost,
	handleOpenPostModal,
	handleClosePostModal,
	hanndleSetModalData,
	clearModalData,
}) {
	const { profile, location } = useContext(AppContext);

	const { openPostModal, commentSheetRef } = useContext(MainContext);

	const navigateToSinglePost = () => {
		if (openPostModal) {
		} else {
			handleOpenPostModal();
			hanndleSetModalData(item);
		}
	};

	return (
		<Fragment>
			<TouchableWithoutFeedback>
				<View style={styles.header}>
					<Text
						onPress={navigateToSinglePost}
						numberOfLines={1}
						style={{ fontWeight: "bold", color: color?.black }}
						fontSize={16}
					>
						{item?.author?.firstName} {item?.author?.lastName}
					</Text>

					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						{item?.pageName ? (
							<TouchableWithoutFeedback
							// onPress={() => {
							// 	item.pageName !== "Global-Feeds" &&
							// 		navigate("DetailNeighbourhood", {
							// 			cloudId: item.pageId,
							// 		});
							// }}
							>
								<View style={styles.location}>
									{/* <Ionicons
									name="location-outline"
									size={15}
									color={color.greyText}
								/> */}
									<Text
										style={{ color: color?.subTitle, fontSize: 14 }}
										numberOfLines={1}
									>
										{item.pageName ? item.pageName : item?.locationId}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						) : null}

						<View style={styles.btnView}>
							{/* <MaterialIcons
								name="access-time"
								size={15}
								color={color.greyText}
							/> */}
							<Text
								numberOfLines={1}
								style={[styles.time, { color: color?.subTitle }]}
							>
								{convertTime(item?.createdOn)}
							</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>

			<View
				style={{
					flexDirection: "row",
					position: "absolute",
					right: 0,
					// width: "",
					justifyContent: "flex-end",
					alignItems: "center",
				}}
			>
				{item?.point && !singlePost && (
					<GetDistance
						lat1={location?.location?.latitude}
						lon1={location?.location?.longitude}
						lat2={item?.point?.lat}
						lon2={item?.point?.lon}
					/>
				)}
				<View style={styles.menu}>
					{profile?.systemUserId === item?.authorId ? (
						<AppMenu
							menuColor={color?.black}
							menuContent={[
								{
									icon: "post-outline",
									label: "Delete post",
									onPress: () => {
										setDeletePostModal(item?.id);
									},
								},
							]}
						/>
					) : (
						<AppMenu
							menuColor={color?.black}
							menuContent={[
								{
									icon: "post-outline",
									label: "Report this post",
									onPress: () => {
										refReportSheet?.current?.open(), setReportModal(item?.id);
									},
								},
							]}
						/>
					)}
				</View>

				{singlePost && (
					<EvilIcons
						name="close"
						size={24}
						color={color?.black}
						onPress={() => {
							commentSheetRef?.current?.close();
							handleClosePostModal();
							clearModalData();
						}}
						style={{ padding: 2, zIndex: 999 }}
					/>
				)}
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		height: "100%",
		overflow: "hidden",
		justifyContent: "center",

		// borderBottomWidth: 1,
		// borderBottomColor: "lightgrey",
	},
	location: {
		maxWidth: "50%",
		// Width: "70%",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 20,
	},
	btnView: {
		flexDirection: "row",
		// width: "30%",
		alignItems: "flex-end",
		// borderWidth: 1,
	},
	time: {
		fontSize: 14,
		marginLeft: 2,
	},
	menu: {
		// borderWidth: 1,

		marginRight: -7,
		// position: "absolute",
	},
});
