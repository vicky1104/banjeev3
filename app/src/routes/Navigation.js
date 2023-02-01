import { AuthNavJson } from "./Navigation/AuthNavJson";
import { BlogNavigation } from "./Navigation/BlogNavigation";
import BottomNavigation from "./Navigation/BottomNavigation";
import callNavigation from "./Navigation/CallNavigation";
import { CommmunityNavigation } from "./Navigation/CommunityNavigation";
import Contacts from "./Navigation/ContactsNavigation";
import FeedNavigation from "./Navigation/FeedNavigation";
import { MapNavigation } from "./Navigation/MapNavigation";
import { NeighbourhoodNavigation } from "./Navigation/NeighbourhoodNavigation";
import ProfileNavigation from "./Navigation/ProfileNavigation";
import RoomNavigation from "./Navigation/RoomNavigation";
import ServiceNavigation from "./Navigation/ServiceNavigation";
// import CameraNavigation from "./Navigation/CameraNavigation";

export const NavigationJson = [
	// {
	// 	options: {
	// 		headerShown: false,
	// 	},
	// 	name: "Splash",
	// 	component: Splash,
	// 	animation: "none",
	// },
	{
		options: { headerTitle: "Back", headerShown: false },
		name: "Bottom",
		component: BottomNavigation,
	},
	// ...AuthNavJson,

	...FeedNavigation,
	...RoomNavigation,
	...ProfileNavigation,
	...Contacts,
	...MapNavigation,
	...NeighbourhoodNavigation,
	...ServiceNavigation,
	...BlogNavigation,
	...callNavigation,
	...CommmunityNavigation,
	// ...CameraNavigation,
];
