import React, { useCallback, memo, useRef, useState } from "react";
import {
	FlatList,
	View,
	Dimensions,
	Text,
	StyleSheet,
	Image,
} from "react-native";
import RenderTypeExoSkeleton from "../../../views/Main/Feed/NewFeedFlow/RenderTypeExoSkeleton";
import RenderCarousalView from "../CarousalView/RenderViewComponents/RenderCarousalView";

const { width: windowWidth, height: windowHeight } = Dimensions.get("screen");

const styles = StyleSheet.create({
	slide: {
		height: windowHeight,
		width: windowWidth,
		justifyContent: "center",
		alignItems: "center",
	},
	slideImage: { width: windowWidth * 0.9, height: windowHeight * 0.7 },
	slideTitle: { fontSize: 24 },
	slideSubtitle: { fontSize: 18 },

	pagination: {
		position: "absolute",
		bottom: 8,
		width: "100%",
		justifyContent: "center",
		flexDirection: "row",
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 2,
	},
	paginationDotActive: { backgroundColor: "white" },
	paginationDotInactive: { backgroundColor: "gray" },

	carousel: { height: "100%", width: windowWidth },
});

function Pagination({ index, dataArray, marginLeft }) {
	return (
		<View
			style={styles.pagination}
			pointerEvents="none"
		>
			{dataArray.map((_, i) => {
				return (
					<View
						key={i}
						style={[
							styles.paginationDot,
							index === i ? styles.paginationDotActive : styles.paginationDotInactive,
						]}
					/>
				);
			})}
		</View>
	);
}

export default function Carousel({
	dataArray,
	currentIndex,
	fullScreen,
	marginLeft,
	localUrl,
}) {
	const [index, setIndex] = useState(0);
	const indexRef = useRef(index);
	const carouserItemRef = useRef();

	indexRef.current = index;

	const onScroll = useCallback((event) => {
		const slideSize = event.nativeEvent.layoutMeasurement.width;
		const index = event.nativeEvent.contentOffset.x / slideSize;
		const roundIndex = Math.round(index);
		const distance = Math.abs(roundIndex - index);

		// Prevent one pixel triggering setIndex in the middle
		// of the transition. With this we have to scroll a bit
		// more to trigger the index change.

		const isNoMansLand = 0.4 < distance;

		if (roundIndex !== indexRef.current && !isNoMansLand) {
			setIndex(roundIndex);
		}
	}, []);

	const flatListOptimizationProps = {
		initialScrollIndex: currentIndex ? currentIndex : 0,
		initialNumToRender: currentIndex ? currentIndex : 0,
		maxToRenderPerBatch: 1,
		removeClippedSubviews: true,
		scrollEventThrottle: 16,
		windowSize: 2,
		keyExtractor: useCallback((s) => String(s.src), []),
		getItemLayout: useCallback(
			(_, index) => ({
				index,
				length: windowWidth,
				offset: index * windowWidth,
			}),
			[]
		),
	};

	const renderItem = useCallback(
		({ item: ele }) => {
			return (
				// return (
				<View
					style={{
						alignItems: "center",
						display: "flex",
					}}
				>
					<RenderTypeExoSkeleton
						fullScreen={fullScreen}
						localUrl={localUrl}
						item={ele}
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

	return (
		<>
			<FlatList
				data={dataArray}
				style={[styles.carousel, { marginLeft: marginLeft }]}
				renderItem={renderItem}
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={false}
				bounces={false}
				onScroll={onScroll}
				viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
				onViewableItemsChanged={_onViewableItemsChanged}
				{...flatListOptimizationProps}
			/>

			{dataArray.length > 1 && (
				<Pagination
					index={index}
					dataArray={dataArray}
				></Pagination>
			)}
		</>
	);
}
