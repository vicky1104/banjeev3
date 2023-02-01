import axios from "axios";
import { Button, FlatList } from "native-base";
import React from "react";
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import FastImage from "react-native-fast-image";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";

export default function Reaction(props) {
	const {
		drawer: { open, id },
		handleCloseDrawer,
		handleClickReaction,
	} = props;

	const [state, setState] = React.useState({
		fetching_from_server: false,
		serverData: [],
		loading: true,
	});

	const [offset, setOffset] = React.useState(0);

	const getEmoji = React.useCallback(() => {
		const url = `https://api.giphy.com/v1/emoji?api_key=BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8&limit=40&offset=${offset}`;
		console.log("url", url);
		axios
			.get(url)
			.then((res) => {
				setState({
					serverData: [...state.serverData, ...res.data.data],
					loading: false,
				});
				setOffset(offset + 1);
			})
			.catch((err) => console.warn(err));
	}, []);

	React.useEffect(() => {
		getEmoji();
	}, [getEmoji]);

	const renderFooter = () => {
		return (
			<View style={styles.footer}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={loadMoreData}
					style={styles.loadMoreBtn}
				>
					<Text style={styles.btnText}>Loading</Text>
					{state.fetching_from_server ? (
						<ActivityIndicator color="white" style={{ marginLeft: 8 }} />
					) : null}
				</TouchableOpacity>
			</View>
		);
	};

	const loadMoreData = () => {
		const url = `https://api.giphy.com/v1/emoji?api_key=BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8&limit=40&offset=${offset}`;
		console.log("url", url);
		setState((prev) => ({ ...prev, fetching_from_server: true }));
		axios
			.get(url)
			.then((res) => {
				setState({
					serverData: [...state.serverData, ...res.data.data],
					loading: false,
				});
				setOffset(offset + 1);
			})
			.catch((err) => console.warn(err));
	};

	return (
		<>
			<OverlayDrawer
				transparent
				visible={open}
				onClose={handleCloseDrawer}
				closeOnTouchOutside
				animationType="fadeIn"
				containerStyle={{
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					padding: 0,
					height: "100%",
					width: "100%",
				}}
				childrenWrapperStyle={{
					width: 328,
					alignSelf: "center",
					borderRadius: 4,
				}}
				animationDuration={100}
			>
				<FlatList
					style={{ width: "100%", height: 400 }}
					keyExtractor={(item, index) => index}
					data={state.serverData}
					numColumns="4"
					renderItem={({ item, index }) => (
						<TouchableWithoutFeedback
							onPress={() => {
								handleClickReaction(
									item?.images?.preview_gif?.url?.substring(31, 49)
								);
							}}
						>
							<View
								style={{
									height: 65,
									width: 65,
									backgroundColor: "#999",
									marginHorizontal: 5,
								}}
							>
								<FastImage
									source={{ uri: item.images?.preview_gif.url }}
									style={{ height: "100%", width: "100%" }}
								/>
							</View>
						</TouchableWithoutFeedback>
					)}
					onEndReached={loadMoreData}
					onEndReachedThreshold={0.1}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 5,
								width: 5,
							}}
						/>
					)}
					ListFooterComponent={renderFooter}
					//Adding Load More button as footer component
				/>
			</OverlayDrawer>
		</>
	);
}

const styles = StyleSheet.create({});
