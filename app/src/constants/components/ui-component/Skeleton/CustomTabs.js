import * as React from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";
import { TabView } from "react-native-tab-view";
import color from "../../../env/color";

export default function CustomTabs(props) {
	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);

	// const renderScene = ({ route, jumpTo }) => {
	// 	if (route.key === "first" && index === 0) {
	// 		return (
	// 			<View style={{ flex: 1 }}>

	// 			</View>
	// 		);
	// 	} else if (route.key === "second" && index === 1) {
	// 		return (
	// 			<View style={{ flex: 1 }}>
	// 				<MyBanjee group={true} />
	// 			</View>
	// 		);
	// 	}
	// };

	const renderScene = ({ route, jumpTo }) =>
		props?.comp.map((ele, i) =>
			route.key === ele.key && i === index ? (
				<View style={{ flex: 1 }}>
					<ele.comp />
				</View>
			) : null
		);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TabView
				navigationState={{ index, routes: props.routes }}
				renderTabBar={(props) => <props.tabs {...props} />}
				sceneContainerStyle={{ backgroundColor: color?.gradientWhite }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</SafeAreaView>
	);
}
