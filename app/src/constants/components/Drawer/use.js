import React from "react";
import { View } from "react-native";
import { Button } from "native-base";

import Drawer from "./index";

import { useNavigation } from "@react-navigation/native";

export default function DrawerView(props) {
	const navigation = useNavigation();
	const drawer = React.useRef();

	const openDrawer = () => {
		navigation.setOptions({ tabBarStyle: { display: "none" } });
		drawer.current.open();
	};
	const closeDrawer = () => {
		navigation.setOptions({
			tabBarStyle: {
				alignContent: "center",
				height: 70,
				position: "absolute",
				borderRadius: 24,
				marginHorizontal: 20,
			},
		});
		drawer.current.close();
	};
	var controlPanel = <View style={{ flex: 1, backgroundColor: "red" }} />;

	return (
		<Drawer
			ref={drawer}
			content={controlPanel}
			closeDrawer={closeDrawer}
		>
			<Button onPress={openDrawer}>Open</Button>
		</Drawer>
	);
}
