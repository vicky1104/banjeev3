import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import * as React from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import MyBanjee from "./Contacts";
import Constants from "expo-constants";
import color from "../../../constants/env/color";

export default function ContactsTab() {
	const { params } = useRoute();
	const { setOptions } = useNavigation();
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "first", title: "CONTACTS" },
		// { key: "second", title: "GROUP" },
	]);

	const renderScene = ({ route, jumpTo }) => {
		if (route.key === "first" && index === 0) {
			return (
				<View style={{ flex: 1 }}>
					<MyBanjee group={false} />
				</View>
			);
		}
		// else if (route.key === "second" && index === 1) {
		// 	return (
		// 		<View style={{ flex: 1 }}>
		// 			<MyBanjee group={true} />
		// 		</View>
		// 	);
		// }
	};

	React.useEffect(() => {
		setOptions({
			headerShown: false,
		});
		if (params?.groupChat) {
			setIndex(1);
		} else {
			setIndex(0);
		}
	}, [params]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				marginTop: Constants.statusBarHeight,
			}}
		>
			<TabView
				navigationState={{ index, routes }}
				renderTabBar={(props) => (
					<TabBar
						renderLabel={({ route, focused }) => (
							<Text style={{ color: color?.black, padding: 8, fontWeight: "bold" }}>
								{route.title}
							</Text>
						)}
						style={{ backgroundColor: color?.white }}
						indicatorStyle={{ backgroundColor: color?.primary }}
						{...props}
					/>
				)}
				sceneContainerStyle={{ backgroundColor: color.gradientWhite }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</SafeAreaView>
	);
}
