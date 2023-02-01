import color from "../../constants/env/color";
import IOSLocationPermission from "../../constants/ios_permission/IOSLocationPermission";
import {
	gradientColor,
	greyColor,
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import Otp from "../../views/Authurization/Otp";
import ResetPassword from "../../views/Authurization/ResetPassword";
import CreateBusiness from "../../views/Main/Business/CreateBusiness/CreateBusiness";
import ListBusiness from "../../views/Main/Business/ListBusiness";
import UpdateBusiness from "../../views/Main/Business/UpdateBusiness/UpdateBusiness";
import Neighbourhood from "../../views/Main/Neighbourhood/Neighbourhood";
import BlockBanjee from "../../views/Main/Profile/BlockBanjee/BlockBanjee";
import CreateGroup from "../../views/Main/Profile/Form/CreateGroup";
import CreateNeighbourhood from "../../views/Main/Profile/Form/CreateNeighbourhood";
import UpdateUserInfo from "../../views/Main/Profile/UpdateInfo/UpdateUserInfo";
import PickAvatar from "../../views/Main/Profile/UpdateProfile/PickAvatar";
import UpdateAvatar from "../../views/Main/Profile/UpdateProfile/UpdateAvatar";
import UpdateVoice from "../../views/Main/Profile/UpdateVoice/UpdateVoice";
import UpdateName from "../../views/Others/UpdateName";
import Faq from "../../views/Webview/Faq";

export const commonNav = [
	{
		name: "UpdateAvatar",
		component: UpdateAvatar,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "PickAvatar",
		component: PickAvatar,
		options: {
			headerTitle: "Select Avatar",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
	{
		name: "UpdateDetail",
		component: UpdateUserInfo,
		options: {
			headerTitleAlign: "center",
			headerTitle: "Personal Details",
			// headerTintColor: "white",
			headerStyle: headerStyle,
			// headerTransparent: true,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},
	{
		name: "MyCloud",
		component: Neighbourhood,
		options: {
			headerShown: false,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},
	{
		name: "UpdateName",
		component: UpdateName,
		options: {
			headerShown: true,
			headerTitle: "Update Profile",
			// headerBackground: () => headerBackground(gradientColor),
		},
	},
	{
		options: {
			headerTitle: "Otp",
			headerTintColor: color.white,
			headerTransparent: true,
			// headerBackground: () => headerBackground(gradientColor),
			headerStyle: headerStyle,
		},
		name: "Otp",
		component: Otp,
	},
	{
		name: "ResetPassword",
		component: ResetPassword,
		options: {
			headerTitle: "Reset Password",
			// headerStyle: headerStyle,
			headerTintColor: color.black,
			headerTransparent: false,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},
	{
		name: "IOSLocation",
		component: IOSLocationPermission,
		options: {
			headerShown: false,
		},
	},
];

const ProfileNavigation = [
	...commonNav,

	{
		name: "UpdateVoice",
		component: UpdateVoice,
		options: {
			headerTitle: "Voice Recording",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},

	{
		name: "faq",
		component: Faq,
		options: {
			headerTitleAlign: "center",
			headerTintColor: color.white,
			headerStyle: headerStyle,
			headerBackground: () => headerBackground(greyColor),
		},
	},
	{
		name: "Blocked_Banjee_Contacts",
		component: BlockBanjee,
		options: {
			headerTitle: "Block Banjees",
			headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},

	// ````````````````````````````` BUsiness

	{
		name: "ListBusiness",
		component: ListBusiness,
		options: {
			headerTitle: "My Business",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
	{
		name: "CreateBusiness",
		component: CreateBusiness,
		options: {
			headerTitle: "Create Business",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
	{
		name: "UpdateBusiness",
		component: UpdateBusiness,
		options: {
			headerTitle: "Update Business",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
	{
		name: "CreateGroup",
		component: CreateGroup,
		options: {
			headerTitle: "",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
	{
		name: "CreateNeighbourhood",
		component: CreateNeighbourhood,
		options: {
			headerTitle: "",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
			// headerBackground: () => headerBackground(),
		},
	},
];
export default ProfileNavigation;
