import { View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import React, {
	forwardRef,
	useCallback,
	useContext,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import RenderTypeExoSkeleton from "./RenderTypeExoSkeleton";
import color from "../../../../constants/env/color";
import { useNavigation } from "@react-navigation/native";
import { MainContext } from "../../../../../context/MainContext";

function FeedCarouselExoSkeleton({ item, ...rest }, ref) {
	const c = useRef();
	const mainScrollVideoPlayer = useRef();
	const [index, setIndex] = useState(0);
	const { navigate } = useNavigation();
	const { setModalData, setOpenPostModal } = useContext(MainContext);

	useImperativeHandle(
		ref,
		() => ({
			itemRef: mainScrollVideoPlayer,
		}),
		[mainScrollVideoPlayer]
	);

	const navigateFunc = (item) => {
		switch (item?.eventCode) {
			case "NEW_ALERT":
				navigate("DetailAlert", { alertId: item.id });
				break;
			case "ADMIN_NOTIFICATION":
				item?.metaInfo.detail === "true"
					? navigate("ViewBanjeeNotification", {
							id: item?.metaInfo?.templateId,
					  })
					: navigate("ViewBanjeeNotificationNoDetail", {
							id: item.id,
					  });
				break;

			default:
				break;
		}
	};
	const renderCarouselItem = ({ item: ele }) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					if (rest?.isFeed) {
						setOpenPostModal(true);
						setModalData({ feedID: ele?.itemId });
					} else {
						navigateFunc(item);
					}
				}}
			>
				<View
					style={{
						alignItems: "center",
						display: "flex",
						// height: 350,
					}}
				>
					<View
						style={{
							width: "100%",
							height: 350,
							zIndex: 999,
							position: "absolute",
							top: 0,
							right: 0,
						}}
					/>
					<RenderTypeExoSkeleton
						item={ele}
						id={ele?.itemId}
						ref={(ref) => {
							if (ref?.itemRef) {
								mainScrollVideoPlayer.current = {
									...mainScrollVideoPlayer.current,
									[item?.key]: ref?.itemRef,
								};
							}
						}}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<View
			style={{
				width: "100%",
				backgroundColor: color?.white,
				alignSelf: "center",
				flex: 1,
				marginTop: item?.text?.length === 0 ? 10 : 0,
				minHeight: 350,
			}}
		>
			{/* {rest?.dotTypeInstagram ? ( */}
			<View
				style={{
					position: "absolute",
					// top: 5,
					right: 0,
					zIndex: 99,
				}}
			>
				<Pagination
					dotsLength={item.mediaContent.length}
					carouselRef={c}
					renderDots={(e) => (
						<View
							style={{
								backgroundColor: "rgba(255,255,255,0.3)",
								paddingHorizontal: 10,
								paddingVertical: 5,
								borderRadius: 8,
							}}
						>
							<Text style={{ fontSize: 12 }}>
								{e + 1}/{item.mediaContent.length}
							</Text>
						</View>
					)}
					activeDotIndex={index}
				/>
			</View>
			{/* ) : (
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
						dotsLength={item.mediaContent.length}
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
			)} */}
			<Carousel
				enableSnap
				removeClippedSubviews={true}
				dotColor={color.primary}
				inactiveDotColor={"grey"}
				layout="default"
				data={item?.mediaContent.map((ele, i) => ({
					...ele,
					itemId: item?.id,
					key: Math.random(),
				}))}
				ref={c}
				keyExtractor={(ele) => ele.key}
				enableMomentum={true}
				renderItem={renderCarouselItem}
				sliderWidth={Dimensions.get("screen").width - 10}
				itemWidth={Dimensions.get("screen").width - 10}
				onSnapToItem={(index) => setIndex(index)}
				lockScrollWhileSnapping={true} // Prevent the user from swiping again while the carousel is snapping to a position.
				contentContainerCustomStyle={{ backgroundColor: color?.white }}
			/>
		</View>
	);
}

export default FeedCarousel = forwardRef(FeedCarouselExoSkeleton);
