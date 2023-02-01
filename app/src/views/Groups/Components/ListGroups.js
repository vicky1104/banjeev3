import { Radio, Text } from "native-base";
import React from "react";
import {
	Dimensions,
	Image,
	Keyboard,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
	VirtualizedList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
	filterGroupService,
	getMyGroupService,
	groupFindByIdService,
	joinGroupService,
} from "../../../helper/services/Community";
// Environment
import color from "../../../constants/env/color";
// Ui Components
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import DetailsCard from "./DetailsCard";
import { useRoute } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import { BusinessCategoryService } from "../../../helper/services/BusinessCategory";

export default function List({ myGroup }) {
	const categorySheetRef = React.useRef();

	const [data, setData] = React.useState([]);
	const [refresh, setRefresh] = React.useState(false);
	const [noData, setNoData] = React.useState(false);
	const [visible, setVisible] = React.useState(false);
	const [noMoreData, setNoMoreData] = React.useState(false);
	const [loadJoin, setLoadJoin] = React.useState(false);
	const [page, setPage] = React.useState(0);
	const [searchText, setSearchText] = React.useState();
	const [categoryData, setCategoryData] = React.useState([]);
	const [filterCategory, setFilterCategory] = React.useState();
	const [offset, setOffset] = React.useState(0);
	const { params } = useRoute();

	const filterGroupServiceApiCall = React.useCallback(async () => {
		let payload = {
			// page: page,
			// pageSize: 10,
		};
		if (searchText && searchText.length > 0) {
			payload = {
				...payload,
				keywords: searchText,
			};
		}
		if (filterCategory) {
			payload = {
				...payload,
				categoryName: filterCategory?.name || "",
				categoryId: filterCategory?.id || "",
			};
		}
		filterGroupService(payload)
			.then((res) => {
				console.warn(res?.last);
				if (res.content?.length > 0) {
					setData(res.content);
					setNoData(false);
					setRefresh(false);
					setVisible(false);
					setNoMoreData(res?.last);
				} else {
					setVisible(false);
					setRefresh(false);
					setNoData(true);
				}
			})
			.catch((error) => {
				console.error(error);
				setVisible(false);
				setRefresh(false);
				setNoData(true);
			});
	}, [page, filterCategory, searchText]);

	const getMyGroupServiceApiCall = React.useCallback(() => {
		getMyGroupService()
			.then((res) => {
				console.warn("res", res);
				setVisible(false);
				setRefresh(false);
				setNoMoreData(true);
				if (res && res.length > 0) {
					setNoData(false);
					setData(res);
				} else {
					setNoData(true);
				}
			})
			.catch((error) => {
				console.error(error);
				setVisible(false);
				setRefresh(false);
				setNoData(true);
			});
	}, []);

	const getBussinesCategoriesApiCall = React.useCallback(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "ROOMS",
		})
			.then((res) => {
				setCategoryData(res.content);
			})
			.catch((err) => console.warn(err));
	}, []);

	React.useEffect(() => {
		//params will refresh the page

		if (myGroup) {
			getMyGroupServiceApiCall();
		} else {
			filterGroupServiceApiCall(false, false);
		}

		return () => {
			setData([]);
		};
	}, [myGroup, filterGroupServiceApiCall, getMyGroupServiceApiCall, params]);

	React.useEffect(() => {
		setTimeout(() => {
			getBussinesCategoriesApiCall();
		}, 1000);
	}, [getBussinesCategoriesApiCall]);

	const onRefresh = () => {
		if (myGroup) {
			setVisible(true);
			setData([]);
			setRefresh(true);
			getMyGroupServiceApiCall();
		} else {
			setSearchText();
			setFilterCategory(false);
			setVisible(true);
			setPage(0);
			setData([]);
			setRefresh(true);
			filterGroupServiceApiCall();
		}
	};

	const onEndReached = () => {
		if (!myGroup) {
			if (!noMoreData) {
				setPage((prev) => prev + 1);
			}
		}
	};

	const handleSearch = (text) => {
		if (text.length > 0) {
			setSearchText(text);
			// filterGroupServiceApiCall(text, filterCategory);
		} else {
			setSearchText();
			// filterGroupServiceApiCall(false, filterCategory);
		}
	};

	const handleFilterCategory = (data) => {
		categorySheetRef.current.close();
		setNoData(false);
		setFilterCategory(JSON.parse(data));
		setVisible(true);
		setPage(0);
		setData([]);
		// filterGroupServiceApiCall(searchText, JSON.parse(data));
	};

	const handleCancelFilter = () => {
		setFilterCategory(false);
		setNoData(false);
		setVisible(true);
		setPage(0);
		setData([]);
		// filterGroupServiceApiCall(searchText, false);
	};
	const handleCancelSearch = () => {
		Keyboard.dismiss();
		setNoData(false);
		setSearchText();
		setVisible(true);
		setPage(0);
		setData([]);
		// filterGroupServiceApiCall(false, filterCategory);
	};

	const handleJoinGroup = (cloudId) => {
		setLoadJoin(cloudId);
		joinGroupService(cloudId)
			.then((res) => {
				groupFindByIdService(cloudId)
					?.then((res) => {
						setLoadJoin(false);
						setData((prev) =>
							prev.map((ele) => {
								if (ele.id === cloudId) {
									return res;
								} else return ele;
							})
						);
						console.warn("join groupo res", res);
					})
					.catch((err) => {
						console.error(err);
					});
			})
			.catch((err) => {
				console.error(err);
				setLoadJoin(false);
			});
	};

	function renderItem({ item }) {
		return (
			<DetailsCard
				handleJoinGroup={handleJoinGroup}
				item={item}
				loadJoin={loadJoin}
				myGroup={myGroup}
			/>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				position: "relative",
				backgroundColor: color.white,
			}}
		>
			{!myGroup && (
				<View
					style={{
						width: "100%",
						flexDirection: "column",
						position: "relative",
						paddingVertical: 10,
						borderBottomRightRadius: 5,
						borderBottomLeftRadius: 5,
					}}
				>
					<View
						style={{
							width: "86%",
							flexDirection: "row",
							alignItems: "center",
							position: "relative",
						}}
					>
						<TextInput
							value={searchText}
							style={styles.input}
							placeholder="Search Group..."
							onChangeText={handleSearch}
							placeholderTextColor={color.grey}
						/>
						{searchText && searchText?.length > 0 && (
							<AppFabButton
								size={12}
								style={{
									top: 8,
									right: 8,
									backgroundColor: "rgba(0,0,0, 0.5)",
									borderRadius: 50,
									position: "absolute",
									zIndex: 1,
								}}
								icon={
									<MaterialIcons
										name="close"
										size={12}
										color={color?.border}
									/>
								}
								onPress={handleCancelSearch}
							/>
						)}
						<AppFabButton
							size={20}
							style={{
								marginLeft: 10,
								backgroundColor: "rgba(0,0,0, 0.5)",
								borderRadius: 50,
							}}
							icon={
								<MaterialIcons
									name="filter-list"
									size={20}
									color="#FFF"
									style={{ marginTop: 2 }}
								/>
							}
							onPress={() => categorySheetRef.current.open()}
						/>
					</View>

					{filterCategory && (
						<View
							style={{
								width: "100%",
								height: 30,
								marginTop: 8,
								flexDirection: "row",
								// backgroundColor: "red",
							}}
						>
							<View
								style={{
									height: 30,
									borderRadius: 25,
									borderWidth: 1,
									borderColor: color?.grey,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									paddingLeft: 7,
									paddingRight: 35,
								}}
							>
								<Text
									color={color.black}
									fontSize={12}
									noOfLines={1}
									// width={"100%"}
								>
									{filterCategory.name}
								</Text>
								<AppFabButton
									size={14}
									style={{
										backgroundColor: color?.grey,
										borderRadius: 50,
										position: "absolute",
										right: 0,
										top: 0,
									}}
									icon={
										<MaterialIcons
											name="close"
											size={15}
											color={color?.white}
										/>
									}
									onPress={handleCancelFilter}
								/>
							</View>
						</View>
					)}
				</View>
			)}

			<VirtualizedList
				ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
				getItemCount={(data) => (data?.length > 0 ? data?.length : 0)}
				getItem={(data, index) => data[index]}
				showsVerticalScrollIndicator={false}
				data={data}
				keyExtractor={(item) => Math.random()}
				renderItem={renderItem}
				refreshing={refresh}
				onRefresh={onRefresh}
				onEndReachedThreshold={0.01}
				initialNumToRender={10}
				removeClippedSubviews={true}
				scrollEventThrottle={150}
				onEndReached={onEndReached}
				ListFooterComponent={() => <View style={{ height: 2 }} />}
				ListEmptyComponent={() => (
					<View
						style={{
							display: "flex",
							flex: 1,
							height: Dimensions.get("screen").height - 350,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{!noData ? (
							<AppLoading visible={!noData} />
						) : (
							<>
								<Image
									style={{ height: 300, width: 300 }}
									resizeMode="contain"
									source={require("../../../../assets/chatnotfound.png")}
								/>
								<Text style={{ color: color.black, fontWeight: "bold" }}>
									Connect with other neighbourhoods.
								</Text>
							</>
						)}
					</View>
				)}
			/>
			<RBSheet
				customStyles={{
					container: { borderRadius: 10, backgroundColor: color.gradientWhite },
				}}
				height={450}
				ref={categorySheetRef}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				draggableIcon
			>
				<Text
					mb={2}
					textAlign="center"
					fontSize={16}
					fontWeight={700}
					color={color.black}
				>
					Select Category
				</Text>
				<ScrollView onScrollEndDrag={() => setOffset((prev) => prev + 1)}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							width: "100%",
							paddingHorizontal: 20,
							paddingBottom: 10,
						}}
					>
						{categoryData &&
							categoryData?.length > 0 &&
							categoryData.map((ele, i) => {
								return (
									<View
										key={i}
										style={{
											flexDirection: "row",
											width: "50%",
											paddingVertical: 5,
										}}
									>
										<Radio.Group
											name="myRadioGroup"
											value={JSON.stringify(filterCategory)}
											onChange={handleFilterCategory}
										>
											<Radio
												accessibilityLabel={ele.name}
												value={JSON.stringify({ id: ele.id, name: ele.name })}
											/>
										</Radio.Group>
										<Text
											noOfLines={1}
											color={color.black}
											pl={1.5}
											width={"85%"}
											fontWeight={400}
										>
											{ele.name}
										</Text>
									</View>
								);
							})}
					</View>
				</ScrollView>
			</RBSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		fontSize: 14,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		borderColor: color.grey,
		backgroundColor: color.gradientWhite,
		color: color?.black,
		borderWidth: 0.3,
		// borderWidth: 1,
		// borderColor: color.grey,
	},
});
