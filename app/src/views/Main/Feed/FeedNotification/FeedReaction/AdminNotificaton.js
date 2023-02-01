import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import color from "../../../../../constants/env/color";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import RenderTypeExoSkeleton from "../../NewFeedFlow/RenderTypeExoSkeleton";
import FeedCarousel from "../../NewFeedFlow/FeedCarousel";

function AdminNotificaton({ item }, ref) {
	const {
		eventName,
		metaInfo: { detail, templateId },
	} = item;
	const { navigate } = useNavigation();
	const carouserItemRef = useRef();

	useImperativeHandle(
		ref,
		() => ({
			itemRef: carouserItemRef.current,
		}),
		[carouserItemRef]
	);

	const navigateFunc = () => {
		detail === "true"
			? navigate("ViewBanjeeNotification", {
					id: templateId,
			  })
			: navigate("ViewBanjeeNotificationNoDetail", {
					id: item.id,
			  });
	};

	return (
		<View
			style={{
				marginHorizontal: "1%",
				paddingHorizontal: "1.5%",
				borderColor: color?.border,
				marginBottom: 15,
				paddingVertical: 10,
				borderRadius: 8,
				overflow: "hidden",
				backgroundColor: color?.gradientWhite,
			}}
		>
			<TouchableWithoutFeedback onPress={navigateFunc}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: "row-reverse",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text
								fontSize={12}
								color={color?.black}
								opacity={70}
							>
								{convertTime(item?.createdOn)}
							</Text>
						</View>

						<Text
							fontSize={16}
							fontWeight={"medium"}
							color={color?.black}
							numberOfLines={2}
							width="84%"
							textAlign={"left"}
							alignSelf="flex-start"
							px={0.5}
						>
							{eventName.trimStart()}
						</Text>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons
							name="person"
							size={16}
							color="grey"
						/>
						<Text
							ml={2}
							color={color?.black}
							opacity={80}
						>
							{item?.createdByUser?.firstName}
						</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>

			{item?.mediaArray?.length > 1 ? (
				<View
					style={{
						flex: 1,
						overflow: "hidden",
						alignItems: "center",
						marginVertical: 5,
					}}
				>
					<FeedCarousel
						item={{ ...item, mediaContent: item?.mediaArray }}
						// dotTypeInstagram={true}
					/>
				</View>
			) : (
				<View
					style={{
						marginVertical: 5,
						alignItems: "center",
						display: "flex",
						flex: 1,
						overflow: "hidden",
						// height: 350,
					}}
				>
					<RenderTypeExoSkeleton
						item={item?.mediaArray?.[0]}
						id={item?.id}
						ref={(ref) => {
							if (ref?.itemRef) {
								carouserItemRef.current = {
									...carouserItemRef.current,
									[item?.key]: ref?.itemRef,
								};
							}
						}}
					/>
				</View>
			)}

			<TouchableWithoutFeedback onPress={navigateFunc}>
				<View style={{ flex: 1 }}>
					<Text
						color={color?.black}
						numberOfLines={2}
						opacity={80}
					>
						{item?.description}
					</Text>

					{/* <View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginTop: 10,
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons
							name="chatbubble-outline"
							color={"grey"}
							size={20}
						/>
						<Text
							fontSize={10}
							ml={2}
							color={color?.black}
							opacity={70}
						>
							COMMENT
						</Text>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback
					onPress={() => {
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<MaterialCommunityIcons
							name="share-variant"
							color={"grey"}
							size={18}
						/>
						<Text
							mx={2}
							color={color?.black}
							opacity={70}
							fontSize={10}
						>
							SHARE
						</Text>
					</View>
				</TouchableWithoutFeedback>
			</View> */}
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
		width: "95%",
		alignSelf: "center",
		borderRadius: 8,
		elevation: 4,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		// height: "100%",
		flex: 1,
		borderWidth: 0.5,
		paddingVertical: 5,
	},
});

export default AdminNotification = forwardRef(AdminNotificaton);
