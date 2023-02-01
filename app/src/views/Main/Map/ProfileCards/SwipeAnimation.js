import React, {
	Fragment,
	useEffect,
	useRef,
	useCallback,
	useState,
} from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import UserCard from "./UserCard";
import NoLoactionFound from "../MapComponents/NoLoactionFound";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import BottomCard from "./BottomCard";
import color from "../../../../constants/env/color";
import { removeProfileLocation } from "../../../../utils/Cache/TempStorage";
// import { getAllUser } from "../../../../helper/services/WelcomeService";
import { useSelector } from "react-redux";
import Carousel from "react-native-snap-carousel";
import { Text } from "native-base";

export default function SwipeAnimation() {
	const {
		searchData: {
			open,
			loc: { latitude: userLatitude, longitude: userLongitude },
		},
	} = useSelector((state) => state.map);

	const [index, setIndex] = useState(0);
	const [visible, setVisible] = React.useState(true);

	const { addListener } = useNavigation();

	const [data, setData] = React.useState([]);

	const getAllBanjeeUsers = useCallback(async () => {
		setVisible(true);
		let locationAsync = await Location.getCurrentPositionAsync({});
		const { longitude, latitude } = locationAsync.coords;

		let point = {
			lat: 0,
			lon: 0,
		};
		if (open) {
			point = {
				lat: userLatitude,
				lon: userLongitude,
			};
		} else {
			point = {
				lon: longitude,
				lat: latitude,
			};
		}
		// getAllUser({
		//   cards: true,
		//   distance: "50",
		//   point,
		//   page: 0,
		//   pageSize: 20,
		// })
		//   .then((res) => {
		//     setVisible(false);
		//     setData([...res.content, "last"]);
		//   })
		//   .catch((err) => console.log("SwipeAnimation ", err));
	}, [userLatitude, userLongitude]);

	useEffect(() => {
		addListener("focus", async () => {
			getAllBanjeeUsers();
		});
		return async () => await removeProfileLocation("location");
	}, [getAllBanjeeUsers]);

	const c = useRef();
	const nextEle = () => {
		c.current.snapToNext(true, () => {
			console.log("hwttttt");
		});
	};
	const renderUsers = ({ item }) => {
		if (item === "last") {
			return null;
		} else {
			return (
				<Fragment>
					<UserCard item={item} />
					<BottomCard
						next={nextEle}
						item={item}
					/>
				</Fragment>
			);
		}
	};
	return (
		<View style={{ flex: 1 }}>
			{/* <View style={{ height: 60 }}></View> */}
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<Fragment>
					{data.length === 0 || data[index] === "last" ? (
						<NoLoactionFound />
					) : (
						<Fragment>
							<View style={{ backfaceVisibility: "visible" }}>
								{data?.[index]?.locationName && (
									<View
										style={{
											flexDirection: "row",
											justifyContent: "center",
											alignItems: "center",
											width: "80%",
											alignSelf: "center",
										}}
									>
										<Text
											style={{ color: color.white }}
											numberOfLines={1}
										>
											{data?.[index]?.locationName}
										</Text>

										<EvilIcons
											name="location"
											color={"white"}
											size={20}
										/>
									</View>
								)}
							</View>
							<Carousel
								onSnapToItem={(index) => {
									setIndex(index);
								}}
								dotColor={color.primary}
								inactiveDotColor={"grey"}
								enableMomentum={true}
								layout="tinder"
								ref={c}
								data={data}
								renderItem={renderUsers}
								sliderWidth={Dimensions.get("screen").width}
								itemWidth={Dimensions.get("screen").width}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	img: {
		marginTop: (Dimensions.get("window").marginTop = "7%"),
		height: (Dimensions.get("window").height = "70%"),
		width: (Dimensions.get("window").width = "85%"),
		flex: 1,
		borderRadius: 5,
		borderColor: color.white,
		borderWidth: 5,
		alignSelf: "center",
		marginBottom: "-10%",
	},
	textGradient: {
		height: (Dimensions.get("window").height = "6%"),
		position: "absolute",
		width: (Dimensions.get("window").width = "90%"),
		alignSelf: "center",
	},
});
