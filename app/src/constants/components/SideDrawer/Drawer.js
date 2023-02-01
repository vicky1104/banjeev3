import React from "react";
import { View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BusinessService from "../../../views/Services/DetailService/FilterDetailService/BusinessService";

function Drawer(props) {
	function CustomDrawerContent(props) {
		return (
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
				<DrawerItem
					label="Close drawer"
					onPress={() => props.navigation?.closeDrawer()}
				/>
				<DrawerItem
					label="Toggle drawer"
					onPress={() => props.navigation?.toggleDrawer()}
				/>
			</DrawerContentScrollView>
		);
	}
	const Drawer = createDrawerNavigator();

	return (
		<Drawer.Navigator
			useLegacyImplementation
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen
				name="BusinessService"
				component={BusinessService}
			/>
			<Drawer.Screen
				name="BusinessService"
				component={BusinessService}
			/>
			{/* <Drawer.Screen name="Notifications" component={Notifications} /> */}
		</Drawer.Navigator>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default Drawer;
