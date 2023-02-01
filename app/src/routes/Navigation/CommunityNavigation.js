import { headerStyle } from "../../constants/navigation/navigation";
import Groups from "../../views/Groups";

import DetailGroup from "../../views/Groups/Components/DetailGroup";

export const CommmunityNavigation = [
	{
		name: "Groups",
		component: Groups,
		options: {
			headerTitle: "Communities",
			headerStyle: headerStyle,
		},
	},
	{
		name: "DetailGroup",
		component: DetailGroup,
		options: {
			headerShown: false,
			headerTransparent: false,
			headerTitle: "",
			// headerTintColor: color.black,
			headerStyle: {
				height: 0, // Specify the height of your custom header
			},
		},
	},
];
