import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HStack, VStack } from "native-base";
import React, {
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { View, StyleSheet, VirtualizedList, Platform } from "react-native";
import color from "../../env/color";
import AppLoading from "../ui-component/AppLoading";

function FeedView({
	data,
	ListHeaderComponent,
	stickyHeaderIndices,
	playerRef,
	onRefresh,
	refreshing,
	onEndReached,
	renderItem,
	isFocused,
	mainScrollVideoPlayer,
	ListFooterComponent,
	ListEmptyComponent,
}) {
	// let {
	// 	data,
	// 	ListHeaderComponent,
	// 	stickyHeaderIndices,
	// 	playerRef,
	// 	onRefresh,
	// 	refreshing,
	// 	onEndReached,
	// 	renderItem,
	// 	footerLoader,
	// isFocused
	// } = props;
	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 100,
	});
	const { addListener } = useNavigation();
	// const [blur, setBlur] = useState(false);
	// useEffect(() => {
	// 	addListener("blur", () => setBlur(true));

	// 	return () => {
	// 		setBlur(true);
	// 	};
	// }, []);

	const _onViewableItemsChanged = useCallback(
		(props) => {
			const changed = props.changed;
			changed.forEach((item) => {
				const cell = mainScrollVideoPlayer?.current?.[item.key];

				if (cell) {
					if (cell?.play && cell?.pause) {
						if (item.isViewable) {
							cell?.play();
						} else {
							cell?.pause();
						}
					}
				}
			});
		},
		[mainScrollVideoPlayer, isFocused]
	);
	const getItemCount = (data) => (data?.length > 0 ? data?.length : 0);
	const getItem = (data, index) => data?.[index];
	const keyExtractor = (data) => data?.key;

	return (
		<View style={styles.container}>
			{isFocused && (
				<VirtualizedList
					ListHeaderComponent={ListHeaderComponent}
					stickyHeaderIndices={stickyHeaderIndices}
					scrollsToTop={true}
					ref={playerRef}
					onRefresh={onRefresh}
					refreshing={refreshing}
					showsVerticalScrollIndicator={false}
					getItemCount={getItemCount}
					getItem={getItem}
					data={data.map((ele) => ({ ...ele, key: Math.random() }))}
					keyExtractor={keyExtractor}
					onViewableItemsChanged={_onViewableItemsChanged}
					initialNumToRender={3}
					maxToRenderPerBatch={3}
					viewabilityConfig={viewabilityConfig.current}
					removeClippedSubviews={true}
					windowSize={5}
					onEndReachedThreshold={0.01}
					onEndReached={onEndReached}
					renderItem={(e) => renderItem(e)}
					contentContainerStyle={styles.contentContainerStyle}
					nestedScrollEnabled={true}
					scrollEnabled={true}
					scrollEventThrottle={150}
					ListFooterComponent={ListFooterComponent}
					ListEmptyComponent={ListEmptyComponent}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	contentContainerStyle: {
		padding: 2,
		backgroundColor: color?.white,
		borderWidth: 1,
		borderTopWidth: 0,
	},
});

export default FeedView;

// const listEmptyComp = (
//     <View style={{ flex: 1 }}>
//         <VStack
//             mt={3}
//             w="95%"
//             alignSelf={"center"}
//         >
//             <HStack
//                 mt={2}
//                 alignItems="center"
//                 space={5}
//             >
//                 <VStack>
//                     <Skeleton
//                         width={10}
//                         height={10}
//                         startColor="coolGray.100"
//                         rounded="full"
//                     />
//                 </VStack>
//                 <VStack>
//                     <Skeleton
//                         h="3"
//                         w="100"
//                         rounded="md"
//                     />

//                     <HStack
//                         justifyContent={"space-between"}
//                         mt={2}
//                         w="85%"
//                     >
//                         <Skeleton
//                             h="2"
//                             w="150"
//                             rounded="md"
//                         />
//                         <Skeleton
//                             h="2"
//                             w="20"
//                             rounded="md"
//                         />
//                     </HStack>
//                 </VStack>
//             </HStack>

//             <Skeleton
//                 w={"150"}
//                 mt={2}
//                 h={3}
//                 rounded="md"
//             />

//             <Skeleton
//                 h="320"
//                 w="100%"
//                 alignSelf={"center"}
//                 mt={2}
//             />
//         </VStack>
//         <VStack
//             mt={3}
//             w="95%"
//             alignSelf={"center"}
//         >
//             <HStack
//                 mt={2}
//                 alignItems="center"
//                 space={5}
//             >
//                 <VStack>
//                     <Skeleton
//                         width={10}
//                         height={10}
//                         startColor="coolGray.100"
//                         rounded="full"
//                     />
//                 </VStack>
//                 <VStack>
//                     <Skeleton
//                         h="3"
//                         w="100"
//                         rounded="md"
//                     />

//                     <HStack
//                         justifyContent={"space-between"}
//                         mt={2}
//                         w="85%"
//                     >
//                         <Skeleton
//                             h="2"
//                             w="150"
//                             rounded="md"
//                         />
//                         <Skeleton
//                             h="2"
//                             w="20"
//                             rounded="md"
//                         />
//                     </HStack>
//                 </VStack>
//             </HStack>

//             <Skeleton
//                 w={"150"}
//                 mt={2}
//                 h={3}
//                 rounded="md"
//             />

//             <Skeleton
//                 h="320"
//                 w="100%"
//                 alignSelf={"center"}
//                 mt={2}
//             />
//         </VStack>
//     </View>
// );
