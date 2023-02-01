import { HeaderBackButton } from "@react-navigation/elements";
import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
	BackHandler,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import color from "../../../../../constants/env/color";
import { myAlertService } from "../../../../../helper/services/CreateAlertService";
import { alertIcons } from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";

function MyAlerts(props) {
	const [myAlerts, setMyAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { navigate, goBack, setOptions } = useNavigation();
	const isFocused = useIsFocused();
	const { params } = useRoute();

	useEffect(() => {
		if (params?.from === "form") {
			console.warn(".............form");
			setOptions({
				headerLeft: () => (
					<HeaderBackButton
						labelVisible={false}
						onPress={() => {
							goBack(), goBack(), goBack();
						}}
						style={{ marginLeft: 10, color: "#000" }}
						pressColor={"#000"}
						tintColor={color?.black}
					/>
				),
			});
			BackHandler.addEventListener("hardwareBackPress", () => {
				if (isFocused) {
					goBack();
					goBack();
					goBack();
					return true;
				}
				return true;
			});
		}

		return () => {
			BackHandler.removeEventListener("hardwareBackPress", () => {
				return true;
			});
		};
	}, [params, isFocused, goBack]);

	useFocusEffect(
		useCallback(() => {
			myAlertService()
				.then((res) => {
					setMyAlerts(res.content);
					setLoading(false);
				})
				.catch((err) => console.warn(err));
		}, [])
	);

	const navigateFunc = (data) => {
		let { id, eventCode } = data;
		switch (eventCode) {
			case "EMERGENCY":
				navigate("DetailEmergencyAlert", { alertId: id });
				break;
			case "NEW_ALERT":
				navigate("DetailAlert", { alertId: id });
				break;
			default:
				break;
		}
	};
	return (
		<View
			style={{ flex: 1, paddingTop: 10, backgroundColor: color?.gradientWhite }}
		>
			{loading && <AppLoading visible={loading} />}

			<VirtualizedList
				data={myAlerts}
				keyExtractor={(data) => data.id}
				getItem={(data, index) => data[index]}
				getItemCount={(data) => data.length}
				renderItem={({ item }) => {
					const iconObj = alertIcons?.filter(
						(ele) => item?.eventName === ele.name
					)[0];

					return (
						<TouchableWithoutFeedback onPress={() => navigateFunc(item)}>
							<View style={styles.container}>
								<View style={styles.row}>
									<View style={{ width: "80%" }}>
										<Text
											fontSize={16}
											fontWeight={"medium"}
											color={color?.black}
										>
											{item?.eventName}
										</Text>

										<View style={styles.address}>
											<Text
												numberOfLines={2}
												color={color?.black}
											>
												{item?.metaInfo?.address}
											</Text>
										</View>
									</View>

									<View style={styles.imgView}>
										<Image
											source={iconObj?.img}
											style={styles.img}
											resizeMode={"cover"}
										/>
										<Text color={color?.black}>{convertTime(item?.createdOn)}</Text>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
		paddingHorizontal: 10,
		width: "95%",
		alignSelf: "center",
		borderRadius: 8,
		backgroundColor: color?.gradientWhite,
		elevation: 5,
		marginBottom: 10,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
	row: { flexDirection: "row", alignItems: "center" },
	address: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	imgView: {
		width: "20%",
		justifyContent: "center",
		alignItems: "center",
	},
	img: { height: 24, width: 24, tintColor: color?.black },
});

export default MyAlerts;
