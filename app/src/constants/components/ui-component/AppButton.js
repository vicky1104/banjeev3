import React from "react";
import color from "../../env/color";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableHighlight,
} from "react-native";
import { Text } from "native-base";

function AppButton({
	title,
	onPress,
	disabled,
	startIcon,
	endIcon,
	color: buttonColor,
	disabledColor,
	titleFontSize = "16",

	...rest
}) {
	const defaultBG = buttonColor
		? buttonColor
		: ["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"];
	const opacityBG = disabledColor
		? disabledColor
		: [`rgba(237, 71, 92, 0.5 )`, `rgba(169, 50, 148, 0.5 )`];

	const [isPress, setIsPress] = React.useState(false);

	const styles = StyleSheet.create({
		gradient: {
			justifyContent: "space-between",
			flexDirection: "row",
			alignItems: "center",
			borderRadius: 4,
			width: "100%",
			height: 40,
			backgroundColor: !isPress ? "lightgrey" : "grey",
			borderWidth: 1,
			borderColor: color?.gradientWhite,
		},
	});

	const handleStyle = () => {
		if (rest?.style && Array.isArray(rest?.style)) {
			let s = {};
			rest?.style?.forEach((ele) => {
				s = { ...s, ...ele };
			});
			return s;
		} else {
			return rest?.style;
		}
	};

	return (
		<TouchableHighlight
			underlayColor={"lightgrey"}
			onHideUnderlay={() => setIsPress(false)}
			onShowUnderlay={() => setIsPress(true)}
			disabled={disabled}
			onPress={disabled ? () => {} : onPress}
			style={{ elevation: disabled ? 0 : 2, borderRadius: 4 }}
			activeOpacity={0.8}
		>
			{/* <LinearGradient
				{...rest}
				style={{ ...styles.gradient, ...handleStyle() }}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				color={disabled ? opacityBG : defaultBG}
			> */}
			<View
				pointerEvents={disabled ? "none" : "auto"}
				{...rest}
				style={[styles.gradient, handleStyle()]}
			>
				<View>{startIcon}</View>

				<View>
					{typeof title === "string" ? (
						<Text
							fontSize={titleFontSize}
							onPress={disabled ? () => {} : onPress}
							style={{ color: color.white }}
						>
							{title}
						</Text>
					) : (
						title
					)}
				</View>

				<View>{endIcon}</View>
			</View>
			{/* </LinearGradient> */}
		</TouchableHighlight>
	);
}

export default AppButton;
