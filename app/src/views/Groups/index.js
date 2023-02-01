import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useLayoutEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { MainContext } from "../../../context/MainContext";
import ListGroups from "./Components/ListGroups";
import { AntDesign } from "@expo/vector-icons";
import color from "../../constants/env/color";

export default function Groups() {
	const layout = useWindowDimensions();
	const { items, setItems } = React.useContext(MainContext);
	const { navigate } = useNavigation();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "all", title: "All Groups" },
		{ key: "my", title: "My Groups" },
	]);

	const { setOptions } = useNavigation();

	const renderScene = ({ route, jumpTo }) => {
		if (route.key === "all" && index === 0) {
			return (
				<View style={{ flex: 1 }}>
					<ListGroups myGroup={false} />
				</View>
			);
		} else if (route.key === "my" && index === 1) {
			return (
				<View style={{ flex: 1 }}>
					<ListGroups myGroup={true} />
				</View>
			);
		}
	};

	useFocusEffect(
		useCallback(() => {
			setOptions({
				headerShown: true,
			});
			// setItems([
			// 	{
			// 		name: "Create Group",
			// 		iconType: AntDesign,
			// 		iconName: "addusergroup",
			// 		iconSize: 22,
			// 		title: "Create Community",
			// 		onPress: () => navigate("CreateGroup"),
			// 	},
			// ]);
		}, [])
	);
	useLayoutEffect(() => {
		setOptions({
			headerShown: true,
		});
	}, []);

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<TabView
				navigationState={{ index, routes }}
				renderTabBar={(props) => (
					<TabBar
						renderLabel={({ route, focused }) => (
							<Text style={{ color: color.black, padding: 8, fontWeight: "bold" }}>
								{route.title}
							</Text>
						)}
						style={{
							backgroundColor: color.white,
						}}
						indicatorStyle={{ backgroundColor: color.primary }}
						{...props}
					/>
				)}
				sceneContainerStyle={{
					backgroundColor: color.gradientWhite,
				}}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</View>
	);
}
