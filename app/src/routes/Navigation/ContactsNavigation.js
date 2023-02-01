import color from "../../constants/env/color";
import {
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import MainChatScreen from "../../views/Main/Contacts/MainChatScreen";
// import SearchBanjee from "../../views/Main/Contacts/SearchBanjee/SearchBanjee";
// import BanjeeProfile from "../../views/Main/Contacts/BanjeeProfile/BanjeeProfile";
import NewBanjeeProfile from "../../views/Main/Contacts/BanjeeProfile/NewBanjeeProfile";
import SearchBanjee from "../../views/Main/Contacts/SearchBanjee";
const Contacts = [
	{
		name: "BanjeeUserChatScreen",
		component: MainChatScreen,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "SearchBanjee",
		component: SearchBanjee,
		options: {
			headerTitle: "People you may know",
		},
	},
	{
		name: "BanjeeProfile",
		component: NewBanjeeProfile,
		options: {
			headerShown: true,
			headerTitle: "",
		},
	},
];

export default Contacts;
