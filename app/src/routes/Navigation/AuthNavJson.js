import color from "../../constants/env/color";
import Otp from "../../views/Authurization/Otp";
import TermsNConditions from "../../views/Authurization/TermsNConditions";
import Login from "../../views/Authurization/Login";
import SignIn from "../../views/Authurization/SignIn";

import {
	// gradientColor,
	// headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import Details from "../../views/Authurization/Details";
import { commonNav } from "./ProfileNavigation";

export const AuthNavJson = [
	{
		options: {
			// headerTintColor: color.white,
			headerTitle: "",
			headerTransparent: true,
			headerStyle: headerStyle,
			headerLeft: () => {},
		},
		name: "SignIn",
		component: SignIn,
	},
	{
		options: {
			headerTitle: "Password",
			headerTintColor: color.white,
			headerTransparent: true,
			headerStyle: headerStyle,
		},
		name: "Login",
		component: Login,
	},

	{
		options: {
			headerShown: false,
			headerTitle: "",
			headerTintColor: color.white,

			// headerBackground: () => headerBackground(gradientColor),
			headerStyle: headerStyle,
		},
		name: "termsAndConditions",
		component: TermsNConditions,
	},
	{
		name: "Detail",
		component: Details,
		options: {
			headerTitleAlign: "center",
			headerTitle: "New User Personal Details",
			headerTintColor: color.black,
			headerTransparent: false,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},

	...commonNav,
];
