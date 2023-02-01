import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { default as React, Fragment, useEffect } from "react";
import {
	Alert,
	Button,
	Image,
	Linking,
	LogBox,
	NativeModules,
	Platform,
	StatusBar,
	Text,
	useColorScheme,
	View,
} from "react-native";
// import SubContext from "./app/context/SubContext";
import AppContextComponent from "./app/src/Context/AppContext";
// import { SocketContextProvider } from "./app/src/Context/Socket";
import FirebaseNotification from "./app/src/notification/FirebaseNotification";
import SocketNotification from "./app/src/notification/SocketNotification";
import NavigationView from "./app/src/routes/NavigationView";
import SocketHandler from "./app/src/Socket/SocketHandler";
import { useNetInfo } from "@react-native-community/netinfo";
// import SplashScreen from "react-native-splash-screen";
// import { CallRtcEngineProvider } from "./app/src/Context/CallRtcEngine";
// import color from "./app/src/constants/env/color";
// import RNExitApp from "react-native-exit-app";
// import { removeLocalStorage } from "./app/src/utils/Cache/TempStorage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
// import InAppUpdate from "./app/src/constants/InAppUpdate";

LogBox.ignoreLogs([
	"Task orphaned",
	"Unexpected HTTP code Response",
	"Failed to load",
	"ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);

// const queryClient = new QueryClient();
const App = (props) => {
	const { isConnected } = useNetInfo();
	const scheme = useColorScheme();
	// useEffect(() => {
	// 	// NativeModules.InAppUpdate.checkUpdate();
	// 	if (Platform.OS === "android") {
	// 		InAppUpdate.checkUpdate();
	// 	}
	// 	removeLocalStorage("RtcEngine").then().catch();
	// 	if (isConnected === false) {
	// 		SplashScreen.hide();
	// 	}
	// 	if (Text.defaultProps == null) Text.defaultProps = {};
	// 	Text.defaultProps.allowFontScaling = false;
	// }, [isConnected]);

	// PushNotification.channelExists("Banjee_Message_Channel", (exist) => {
	// 	if (!exist) {
	// 		PushNotification.createChannel(
	// 			{
	// 				channelId: "Banjee_Message_Channel",
	// 				channelName: "banjee message channel",
	// 				channelDescription: "A banjee app notification channel",
	// 				importance: Importance.DEFAULT,
	// 				playSound: true,
	// 				vibrate: true,
	// 			},
	// 			(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
	// 		);
	// 	}
	// });

	return (
		<Fragment>
			{/* {isConnected && (
				<Fragment>
					<StatusBar
						animated={true}
						backgroundColor={"black"}
						barStyle={"light-content"}
					/>
					<QueryClientProvider client={queryClient}>
						<SocketContextProvider>
							<CallRtcEngineProvider> */}
			<NavigationContainer theme={scheme === "dark" ? DarkTheme : DarkTheme}>
				<NativeBaseProvider>
					<AppContextComponent>
						<SocketHandler />
						<SocketNotification />
						<FirebaseNotification />
						{/* <NotificationActionsHandler /> */}
						<SubContext>
							<NavigationView />
						</SubContext>
					</AppContextComponent>
				</NativeBaseProvider>
			</NavigationContainer>
			{/* </CallRtcEngineProvider>
						</SocketContextProvider>
					</QueryClientProvider>
				</Fragment>
			)} */}

			{isConnected === false && (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: color.gradientWhite,
					}}
				>
					<Image
						resizeMode="contain"
						source={require("./app/assets/EditDrawerIcon/wifi.png")}
						style={{
							// height: "50%",
							width: "50%",
							tintColor: color?.black,
						}}
					/>
					<Text style={{ fontSize: 16, color: color?.black, marginBottom: 30 }}>
						Ooops...! No internet connection..!
					</Text>

					<Button
						color={color.gradientBlack}
						title={"Exit app"}
						onPress={() => {
							RNExitApp.exitApp();
						}}
					/>
				</View>
			)}
		</Fragment>
	);
};

export default App;
