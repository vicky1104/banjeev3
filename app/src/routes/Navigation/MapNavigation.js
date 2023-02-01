import color from "../../constants/env/color";
import {
	gradientColor,
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import ProfileCards from "../../views/Main/Map/ProfileCards/ProfileCards";

export const MapNavigation = [
	{
		options: {
			headerTitleAlign: "center",
			headerTitle: "Discover!!",
			headerShown: true,
			headerTintColor: color.white,
			headerBackground: () => headerBackground(gradientColor),
			headerStyle: headerStyle,
		},
		name: "ProfileCards",
		component: ProfileCards,
	},
];
