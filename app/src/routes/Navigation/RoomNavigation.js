import color from "../../constants/env/color";
import {
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import Category from "../../views/Main/Room/CreateRoom/Category";

import CreateRoom from "../../views/Main/Room/CreateRoom/CreateRoom";
import FilterCreateRoom from "../../views/Main/Room/CreateRoom/FilterCreateRoom";
import RecordVoice from "../../views/Main/Room/CreateRoom/RecordVoice/RecordVoice";
import SelectBanjee from "../../views/Main/Room/CreateRoom/SelectBanjee";

const RoomNavigation = [
	{
		name: "CreateRoom",
		component: CreateRoom,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "Category",
		component: Category,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "RecordVoice",
		component: RecordVoice,
		options: {
			headerShown: false,
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "SelectBanjee",
		component: SelectBanjee,
		options: {
			headerTitle: "Select Banjee",
			headerStyle: headerStyle,
		},
	},
	{
		name: "FilterCreateRoom",
		component: FilterCreateRoom,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
];
export default RoomNavigation;
