import { Modal, Text } from "native-base";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../env/color";
import Constants from "expo-constants";
import { EvilIcons } from "@expo/vector-icons";
// import Carousel from "../FlatlistSwiper/FlatListSwiper";
import { MainContext } from "../../../../context/MainContext";
import Carousel, { Pagination } from "react-native-snap-carousel";
import RenderTypeExoSkeleton from "../../../views/Main/Feed/NewFeedFlow/RenderTypeExoSkeleton";

function CarousalView({
	localUrl,
	item,
	viewFeed,
	modalVisible,
	setModalVisible,
	currentIndex,
	fullScreen,
}) {
	const viewabilityConfig = {
		itemVisiblePercentThreshold: 100,
	};
	const carouserItemRef = useRef();
	const c = useRef();
	const [index, setIndex] = React.useState(0);
	const { createFeedData, feedData } = useContext(MainContext);
	const [data, setData] = useState([]);

	useEffect(() => {
		if (modalVisible) {
			c?.current?.snapToItem(currentIndex);
		}
	}, [currentIndex, c]);

	useEffect(() => {
		let itemData = item?.map((ele, i) => {
			switch (ele.type) {
				case "audio":
					return {
						...ele,
						key: i,
						mimeType: "audio/mp3",
						src: ele?.uri,
					};
				case "image":
					return {
						...ele,
						key: i,
						mimeType: "image/jpg",
						src: ele?.uri,
					};
				case "video":
					return {
						...ele,
						key: i,
						mimeType: "video/mp4",
						src: ele?.uri,
					};

				default:
					return { ...item, key: i };
			}
		});

		setData(itemData);

		// if (feedData.uploadContentData.length < 1) {
		// 	setModalVisible(false);
		// }
	}, [item]);

	function removeFeed(ele) {
		if (feedData.uploadContentData.length < 1) {
			createFeedData((pre) => ({
				...pre,
				uploadContentData: [
					...pre.uploadContentData.filter((el) => el.id !== ele?.id),
				],
			}));
		} else {
			createFeedData((pre) => ({
				...pre,
				uploadContentData: [
					...pre.uploadContentData.filter((el) => el.id !== ele?.id),
				],
			}));
			setModalVisible(false);
		}
	}
	const _onViewableItemsChanged = useCallback(
		(props) => {
			const changed = props.changed;
			changed.forEach((item) => {
				const cell = carouserItemRef?.current?.[item.key];
				if (cell) {
					if (item.isViewable) {
						cell?.play();
					} else {
						cell?.pause();
					}
				}
			});
		},
		[carouserItemRef]
	);

	const renderItem = useCallback(
		({ item: ele }) => {
			return (
				// return (
				<View
					style={{
						alignItems: "center",
						display: "flex",
						height: "100%",
						justifyContent: "center",
					}}
				>
					<RenderTypeExoSkeleton
						ratio={true}
						fullScreen={fullScreen}
						localUrl={localUrl}
						item={ele}
						modalVisible={modalVisible}
						id={ele?.id}
						ref={(ref) => {
							if (ref?.itemRef) {
								carouserItemRef.current = {
									...carouserItemRef.current,
									[ele?.key]: ref?.itemRef,
								};
							}
						}}
					/>
				</View>
			);

			// 	<View style={{ width: windowWidth }}>
			// 		<RenderCarousalView
			// 			item={item}
			// 			fullScreenRatio={fullScreenRatio}
			// 			feedView={feedView}
			// 		/>
			// 	</View>
			// );
		},
		[fullScreen, localUrl]
	);

	return (
		<Modal
			// animationPreset="slide"
			closeOnOverlayClick={false}
			isOpen={modalVisible}
			onClose={() => setModalVisible(!modalVisible)}
			size={"full"}
			backdropVisible={true}
		>
			<Modal.Content
				justifyContent={"flex-end"}
				style={styles?.content}
				minH={Dimensions.get("screen").height - Constants.statusBarHeight}
				maxH={Dimensions.get("screen").height - Constants.statusBarHeight}
			>
				<Modal.Header style={styles.header}>
					{viewFeed &&
						item?.map((ele, i) => {
							return (
								<View
									style={{ position: "relative" }}
									key={i}
								>
									<View style={styles.mapView}>
										<Text
											color={color.black}
											onPress={() => {
												c?.current?.snapToItem(0, true, () => {}, false, false);

												removeFeed(ele);
											}}
										>
											Remove
										</Text>
									</View>
								</View>
							);
						})}

					<EvilIcons
						name="close"
						size={24}
						color={color?.black}
						onPress={() => {
							setModalVisible(!modalVisible);
						}}
						style={{ alignSelf: "flex-end", padding: 5 }}
					/>
				</Modal.Header>

				<Modal.Body flex={1}>
					<View
						style={{
							flex: 1,
							marginLeft: -15,
							height:
								Dimensions.get("screen").height - Constants.statusBarHeight - 100,
							width: "100%",
						}}
					>
						<Carousel
							enableSnap
							dotColor={color.primary}
							inactiveDotColor={"grey"}
							layout="default"
							ref={c}
							// initialScrollIndex={currentIndex}
							enableMomentum={true}
							data={
								localUrl
									? data?.map((ele, i) => ({ ...ele, key: i }))
									: item.map((ele, i) => ({ ...ele, key: i }))
							}
							keyExtractor={(ele) => ele.key}
							onViewableItemsChanged={_onViewableItemsChanged}
							initialNumToRender={3}
							maxToRenderPerBatch={3}
							viewabilityConfig={viewabilityConfig}
							windowSize={5}
							renderItem={renderItem}
							removeClippedSubviews={true}
							sliderWidth={Dimensions.get("screen").width}
							itemWidth={Dimensions.get("screen").width}
							onSnapToItem={(index) => setIndex(index)}
						/>

						{/* <View
							style={{
								position: "absolute",
								top: 20,
								width: "100%",
							}}
						>
							<Pagination
								dotsLength={localUrl ? data?.length : item?.length}
								activeDotIndex={index}
								carouselRef={c}
								dotStyle={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: "rgba(255, 255, 255, 0.92)",
								}}
								key={Math.random()}
								activeOpacity={1}
								animatedDuration={200}
								animatedFriction={2}
								inactiveDotOpacity={0.4}
								inactiveDotScale={0.6}
								tappableDots={true}
							/>
						</View> */}

						{/* <Carousel
							fullScreen={fullScreen}
							localUrl={localUrl}
							marginLeft={-15}
							dataArray={localUrl ? itemData : item}
							currentIndex={currentIndex}
						/> */}
					</View>
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("screen").height,
		width: Dimensions.get("screen").width,
		position: "absolute",
	},
	content: {
		marginBottom: 0,
		marginTop: "auto",
		backgroundColor: color?.gradientWhite,
	},
	header: {
		backgroundColor: color?.gradientWhite,
		borderBottomWidth: 0,
		height: "auto",
	},
	mapView: {
		zIndex: 1,
		position: "absolute",
		left: 7,
		height: 20,
	},
});

export default CarousalView;
