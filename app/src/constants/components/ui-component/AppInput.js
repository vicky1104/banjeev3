import React, { forwardRef } from "react";
import { Keyboard, TextInput } from "react-native";
import color from "../../env/color";

const AppInput = forwardRef((props, ref) => (
	<TextInput
		style={[
			{
				height: 40,
				width: "100%",
				borderRadius: 8,
				padding: 10,
				// borderWidth: 1,
				color: "#FFF",
				backgroundColor: "#403f3f",
			},
			props?.style,
		]}
		// backgroundColor={"white"}

		allowFontScaling={true}
		returnKeyType="done"
		onBlur={() => {
			if (!props?.shouldDismiss) {
				Keyboard.dismiss();
			}
		}}
		placeholderTextColor={color.greyText}
		// style={{ borderColor: "black", borderWidth: 1 }}

		{...props}
		ref={ref}
	/>
));

export default AppInput;
