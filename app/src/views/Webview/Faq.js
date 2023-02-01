import * as React from "react";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import AppLoading from "../../constants/components/ui-component/AppLoading";

export default function Faq() {
	const { setOptions } = useNavigation();

	const {
		params: { url, label },
	} = useRoute();

	React.useEffect(
		() =>
			setOptions({
				headerTitle: label,
			}),
		[label]
	);

	return (
		<WebView
			startInLoadingState
			renderLoading={() => <AppLoading visible={true} />}
			style={{ flex: 1 }}
			source={{ uri: url }}
		/>
	);
}
