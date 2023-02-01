import {
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import color from "../../../../constants/env/color";

export default function GiphyEmoji({ handleClick, sheetRef }) {
	const scrollViewRef = React.useRef(null);

	const [emojiData, setEmojiData] = React.useState([]);
	const [offset, setOffset] = React.useState(0);

	const getEmoji = React.useCallback(() => {
		const url = `https://api.giphy.com/v1/emoji?api_key=BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8&limit=50&offset=${offset}`;
		axios
			.get(url)
			.then((res) => {
				setEmojiData((prev) => [
					...new Set([
						...prev,
						...res.data.data.map((ele) => ele.images?.preview_gif.url),
					]),
				]);
			})
			.catch((err) => console.warn(err));
	}, [offset]);

	React.useEffect(() => {
		getEmoji();
	}, [getEmoji]);

	return (
		<RBSheet
			customStyles={{
				container: { borderRadius: 10, backgroundColor: color?.gradientWhite },
			}}
			height={450}
			ref={sheetRef}
			dragFromTopOnly={true}
			closeOnDragDown={true}
			closeOnPressMask={true}
			draggableIcon
		>
			<ScrollView
				onScrollEndDrag={() => setOffset((prev) => prev + 1)}
				ref={scrollViewRef}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						justifyContent: "space-around",
						width: "100%",
					}}
				>
					{emojiData &&
						emojiData.length > 0 &&
						emojiData.map((ele, index) => {
							return (
								<TouchableOpacity
									key={index}
									onPress={() => {
										const newData = ele.substring(31, 49);
										handleClick(newData);
										sheetRef?.current?.close();
									}}
								>
									<Image
										source={{ uri: ele }}
										style={{ height: 40, width: 40, margin: 7 }}
									/>
								</TouchableOpacity>
							);
						})}
				</View>
			</ScrollView>
		</RBSheet>
	);
}

const styles = StyleSheet.create({});
