import { LinearGradient } from "expo-linear-gradient";

import color from "../../constants/env/color";
import React from "react";
const gradientColor = ["#ED475C", "#A93294"];
const greyColor = [color.drawerGrey, color.drawerDarkGrey];

const headerStyle = {
	shadowColor: "grey",
	elevation: 10,
	shadowOffset: { width: 1, height: 1 },
	shadowOpacity: 0.4,
	shadowRadius: 3,
};

const headerBackground = (color) => (
	<LinearGradient
		colors={color}
		style={{ flex: 1 }}
		start={{ x: 1, y: 0 }}
		end={{ x: 0, y: 0 }}
	/>
);

export { gradientColor, greyColor, headerStyle, headerBackground };
