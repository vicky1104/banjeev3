import {
	Linking,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useState } from "react";
import { Text } from "native-base";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import color from "../../../../constants/env/color";
import ViewMoreText from "react-native-view-more-text";
import FeedHeader from "../FeedSkeleton/FeedHeader";
import FeedFooter from "../FeedSkeleton/FeedFooter";
import FeedProfile from "../FeedSkeleton/FeedProfile";
import { MainContext } from "../../../../../context/MainContext";

export default function FeedExoSkeleton({
	item,
	setReportModal,
	refReportSheet,
	setDeletePostModal,
	commentSheetRef,
	screenName,
	...rest
}) {
	const [increementLike, setIncreementLike] = useState(item?.totalReactions);
	const [likeOnOurPost, setLikeOnOurPost] = React.useState(true);

	const [defLike, setDefLike] = useState(false);
	let longitude = item?.locationId?.split(":")[1]?.split(",")[0];
	let latitude = item?.locationId?.split(":")[2]?.split(",")[0];
	let locationName = item?.locationId?.split(":")[3]?.split("}")[0];

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

	const { setOpenPostModal, setModalData } = React.useContext(MainContext);

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
			// entering={FadeInDown}
			// exiting={FadeOutUp}
			// layout={Layout.springify()}
			style={[
				styles.mainView,
				{ backgroundColor: color?.gradientWhite, borderColor: color?.border },
			]}
		>
			<View style={styles.grid}>
				<FeedProfile
					item={item}
					name={screenName}
					clearModalData={() => setModalData()}
					handleClosePostModal={() => setOpenPostModal(false)}
				/>
				<View style={styles.header}>
					<FeedHeader
						hanndleSetModalData={(e) => setModalData(e)}
						clearModalData={() => setModalData()}
						handleOpenPostModal={() => setOpenPostModal(true)}
						handleClosePostModal={() => setOpenPostModal(false)}
						setReportModal={setReportModal}
						refReportSheet={refReportSheet}
						item={item}
						setDeletePostModal={setDeletePostModal}
					/>
				</View>
			</View>

			<View style={{ flex: 1 }}>
				<View
					style={{
						marginBottom: 20,
						zIndex: 9999,
					}}
				>
					{item?.text?.length > 0 && (
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
							<Text color={color?.black}>{item?.text.trim()}</Text>
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
				</View>
			</View>
			{rest.children}
			<FeedFooter
				commentSheetRef={commentSheetRef}
				setIncreementLike={setIncreementLike}
				increementLike={increementLike}
				defLike={defLike}
				item={item}
				setLikeOnOurPost={setLikeOnOurPost}
				likeOnOurPost={likeOnOurPost}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	mainView: {
		borderWidth: 1,

		width: "100%",
		alignSelf: "flex-end",
		marginBottom: 17,
		borderRadius: 16,
		// overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 2,
		paddingBottom: 15,
	},
	grid: {
		alignSelf: "center",
		width: "95%",
		flexDirection: "row",
		height: 56,
		alignItems: "center",
	},
	header: {
		flexDirection: "row",
		height: "100%",
		width: "87%",
		borderBottomColor: color.greyText,
		justifyContent: "space-between",
		marginLeft: 10,
	},
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
