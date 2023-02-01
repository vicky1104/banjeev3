import { Text } from "native-base";
import React from "react";
import { Dimensions, StyleSheet, View, VirtualizedList } from "react-native";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import {
	myBanjeeService,
	unBlockUser,
} from "../../../../helper/services/Service";
import Block_Banjee_Contacts from "./BlockBanjeeContacts";
import Constants from "expo-constants";

function BlockBanjee() {
	const [data, setData] = React.useState([]);
	const [visible, setVisible] = React.useState(false);
	const [refresh, setRefresh] = React.useState(false);

	const listBlockUsers = React.useCallback(() => {
		setVisible(true);

		myBanjeeService()
			.then((res) => {
				if (res) {
					setRefresh(false);
					setVisible(false);
					setData(res);
				} else {
					setRefresh(false);
					setVisible(false);
				}
			})
			.catch((err) => console.warn(err));
	}, []);

	React.useEffect(() => {
		listBlockUsers();
	}, [listBlockUsers]);

	const btnClick = (user) => {
		unBlockUser(user)
			.then((res) => {
				listBlockUsers();
			})
			.catch((err) => console.warn(err));
	};

	function renderItem({ item }) {
		return (
			<Block_Banjee_Contacts
				item={item}
				onPress={btnClick}
			/>
		);
	}
	return (
		<React.Fragment>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
					<VirtualizedList
						getItemCount={(data) => data?.length}
						getItem={(data, index) => data[index]}
						showsVerticalScrollIndicator={false}
						data={data}
						keyExtractor={(item) => item?.id}
						renderItem={renderItem}
						refreshing={refresh}
						onRefresh={() => {
							setRefresh(true);
							listBlockUsers();
						}}
						removeClippedSubviews={true}
						ListEmptyComponent={() => (
							<View
								style={{
									height: Dimensions.get("screen").height - Constants?.statusBarHeight,
									justifyContent: "center",
									alignSelf: "center",
								}}
							>
								<Text color={color?.black}>You have no blocked banjee contacts.</Text>
							</View>
						)}
						// ItemSeparatorComponent={() => <View style={styles.seperate} />}
					/>
				</View>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	seperate: {
		height: 1,
		width: "82%",
		backgroundColor: "lightgrey",
		position: "absolute",
		right: 0,
		bottom: 0,
	},
});

export default BlockBanjee;
