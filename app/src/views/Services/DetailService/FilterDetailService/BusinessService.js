import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import GetDistance from "../../../../constants/components/GetDistance";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { FilterService } from "../../../../helper/services/BusinessCategory";
import { getMyDefaultNeighbourhood } from "../../../../utils/Cache/TempStorage";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import FilterBusiness from "./FilterBusiness";

const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;
// const CARD_WIDTH = Dimensions.get("screen").width / 2 - 50;

function BusinessService(props) {
	const { navigate } = useNavigation();
	const { location } = useContext(AppContext);
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(true);
	const [message, setMessage] = useState(null);
	const refRBSheet = useRef();
	const [filterData, setFilterData] = useState();

	useFocusEffect(
		useCallback(async () => {
			await getMyDefaultNeighbourhood("neighbourhood").then((res) => {
				let x = JSON.parse(res);

				if (x?.cloudId) {
					FilterService({
						approved: true,
						cloudId: x?.cloudId,
						categoryId: filterData?.id,
					})
						.then((res) => {
							setData(res.content), setVisible(false);
						})
						.catch((err) => console.warn(err));
				} else {
					setVisible(false);
					setMessage("Join Neighbourhood to explore Business inside.");
				}
			});
		}, [filterData])
	);

	const emptyComp = () => (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				height: Dimensions.get("screen").height - 200,
				width: Dimensions.get("screen").width,
			}}
		>
			<Text
				fontSize={16}
				color={color?.black}
			>
				No business found/here{" "}
				<Text fontWeight={"medium"}>
					{filterData?.name && `in ${filterData?.name}`}
				</Text>
				...!
			</Text>
		</View>
	);
	const renderItem = ({ item }) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => navigate("DetailService", { businessId: item?.id })}
			>
				<View
					style={{
						borderWidth: 1,
						borderColor: color.border,
						flexDirection: "row",
						alignItems: "center",
						width: Dimensions.get("screen").width - 10,
						alignSelf: "center",
						borderRadius: 16,
						overflow: "hidden",
					}}
				>
					<View style={{ width: "30%" }}>
						<Image
							style={{ width: "100%", height: 140 }}
							source={{
								uri: cloudinaryFeedUrl(item.logoURL, "image"),
							}}
						/>
					</View>

					<View
						style={{
							width: "70%",
							alignItems: "flex-start",
							height: "100%",
							padding: 10,
						}}
					>
						<Text
							color={color?.black}
							fontSize={14}
							style={{ textAlign: "center" }}
							fontWeight="medium"
							numberOfLines={1}
						>
							{item.name}
						</Text>

						<Text
							style={{
								textAlign: "center",
								color: color.black,
							}}
							opacity={70}
							// fontSize={12}
							numberOfLines={1}
						>
							{item.categoryName}
						</Text>

						<Text
							style={{
								color: color.black,
								marginTop: 5,
							}}
							opacity={70}
							// fontSize={12}
							numberOfLines={2}
						>
							{item.address.trim()}
						</Text>

						<View
							style={{
								alignSelf: "flex-end",
								position: "absolute",
								bottom: 10,
								right: 10,
							}}
						>
							<GetDistance
								lat1={location?.location?.latitude}
								lon1={location?.location?.longitude}
								lat2={item?.location?.coordinates[1]}
								lon2={item?.location?.coordinates[0]}
							/>
						</View>
					</View>
				</View>
				{/* <View style={styles.card}>
					<Image
						source={{
							uri: cloudinaryFeedUrl(item?.logoURL, "image"),
						}}
						style={styles.img}
					/>
					<View style={styles.textView}>
						<Text
							style={styles.name}
							numberOfLines={1}
						>
							{item?.name}
						</Text>
						<Text
							style={styles.subName}
							numberOfLines={1}
						>
							{item?.categoryName}
						</Text>
					</View>
				</View> */}
			</TouchableWithoutFeedback>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			{/* ````````````````````` FILTER */}

			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<Fragment>
					{message ? (
						<View style={styles.messageView}>
							<Text
								fontSize={16}
								color={"white"}
								textAlign="center"
							>
								{message}
							</Text>
						</View>
					) : (
						<>
							<View style={styles.view}>
								{filterData?.name ? (
									<View style={styles.chip}>
										<Text color={color?.black}>{filterData?.name}</Text>
										<Entypo
											name="cross"
											size={20}
											color={color.black}
											style={{ marginLeft: 5 }}
											onPress={() => setFilterData()}
										/>
									</View>
								) : (
									<View />
								)}

								<TouchableWithoutFeedback onPress={() => refRBSheet?.current?.open()}>
									<View style={styles.row}>
										<MaterialCommunityIcons
											name="filter-outline"
											size={24}
											color={color?.black}
										/>
										<Text
											fontSize={16}
											fontWeight="medium"
											color={color?.black}
										>
											Filter
										</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>

							<View style={styles?.nodata}>
								<VirtualizedList
									data={data}
									getItem={(data, index) => data[index]}
									getItemCount={(data) => data.length}
									keyExtractor={(data) => data.id}
									renderItem={renderItem}
									ListEmptyComponent={emptyComp}
								/>
							</View>

							<FilterBusiness
								refRBSheet={refRBSheet}
								setFilterData={setFilterData}
								filterData={filterData}
							/>
						</>
					)}
				</Fragment>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	view: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
	},
	img: {
		height: 100,
		width: "100%",
	},
	name: {
		fontSize: 14,
		textAlign: "center",
		color: color?.black,
		fontWeight: "normal",
	},
	subName: {
		fontSize: 12,
		marginTop: -10,
		textAlign: "center",
		color: color.greyText,
	},
	messageView: {
		height: Dimensions.get("screen").height - 150,
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		width: CARD_WIDTH,
		borderWidth: 1,
		marginVertical: 5,
		borderRadius: 8,
		borderColor: color?.border,
		overflow: "hidden",
		backgroundColor: color?.white,
	},
	textView: {
		borderTopWidth: 1,
		borderColor: color?.border,
		backgroundColor: color?.white,
		height: 60,
		justifyContent: "space-evenly",
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginLeft: 10,
		borderWidth: 1,
		borderColor: color.border,
		borderRadius: 20,
	},
	nodata: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "95%",
		alignSelf: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingRight: 20,
		paddingVertical: 10,
	},
});

export default BusinessService;
