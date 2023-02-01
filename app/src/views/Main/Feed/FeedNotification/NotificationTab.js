import { useIsFocused, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import * as React from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { MainContext } from "../../../../../context/MainContext";

import color from "../../../../constants/env/color";
import SinglePost from "../SinglePost";

import AlertNotification from "./AlertNotification";
import NotifyNotification from "./NotifyNotification";

export default function NotificationTab() {
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const { openPostModal, setModalData, setOpenPostModal } =
		React.useContext(MainContext);
	const [routes] = React.useState([
		{ key: "first", title: "Alerts" },
		{ key: "second", title: "Notifications" },
	]);

	const focused = useIsFocused();
	React.useEffect(() => {
		if (!focused) {
			setModalData();
			setOpenPostModal();
		}
		return () => {
			setModalData();
			setOpenPostModal();
		};
	}, []);

	const renderScene = ({ route, jumpTo }) => {
		if (route.key === "first" && index === 0) {
			return (
				<View style={{ flex: 1 }}>
					<AlertNotification />
				</View>
			);
		} else if (route.key === "second" && index === 1) {
			return (
				<View style={{ flex: 1 }}>
					<NotifyNotification />
				</View>
			);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TabView
				navigationState={{ index, routes }}
				renderTabBar={(props) => (
					<TabBar
						renderLabel={({ route, focused }) => (
							<Text style={{ color: color?.black, padding: 8, fontWeight: "bold" }}>
								{route.title}
							</Text>
						)}
						style={{ backgroundColor: color?.gradientWhite }}
						indicatorStyle={{ backgroundColor: color?.primary }}
						{...props}
					/>
				)}
				swipeEnabled={false}
				sceneContainerStyle={{ backgroundColor: color?.drawerDarkGrey }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</SafeAreaView>
	);
}
