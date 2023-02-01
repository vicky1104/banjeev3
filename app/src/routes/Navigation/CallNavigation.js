import OneToOneCall from "../../views/Call/OneToOneCall";
import GroupCall from "../../views/Call/GroupCall";
import Broadcast from "../../views/Call/Broadcast";

const callNavigation = [
	{
		options: {
			headerShown: false,
		},
		name: "OneToOneCall",
		component: OneToOneCall,
	},
	{
		options: {
			headerShown: false,
			gestureEnabled: false,
		},
		name: "GroupCall",
		component: GroupCall,
	},
	{
		options: {
			headerShown: false,
			gestureEnabled: false,
		},
		name: "Broadcast",
		component: Broadcast,
	},
];

export default callNavigation;
