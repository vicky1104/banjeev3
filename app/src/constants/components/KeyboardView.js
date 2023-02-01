import { KeyboardAvoidingView, View } from "react-native";
import color from "../env/color";

let KeyboardView = ({ fromComment, children }) => {
	return Platform.select({
		ios: (
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: color?.gradientWhite }}
				keyboardVerticalOffset={fromComment ? 0 : 100}
				enabled={true}
				behavior={"padding"}
			>
				{children}
			</KeyboardAvoidingView>
		),
		android: (
			<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
				{children}
			</View>
		),
	});
};
export default KeyboardView;
