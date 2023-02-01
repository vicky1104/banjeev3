import {
	Entypo,
	FontAwesome,
	Feather,
	MaterialIcons,
	FontAwesome5,
	Ionicons,
	AntDesign,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { Alert, Linking } from "react-native";
import RNExitApp from "react-native-exit-app";

export const profileUrl = (id) => {
	// requires avtarUrl
	let url = `https://gateway.banjee.org/services/media-service/iwantcdn/resources/${id}?actionCode=ACTION_DOWNLOAD_RESOURCE`;

	if (id) {
		return url;
	}
};

export const listProfileUrl = (id) => {
	let url =
		"https://gateway.banjee.org/services/media-service/iwantcdn/user/" + id;

	// requires systemUserId
	return url;
};

export const cloudinaryFeedUrl = (src, type, aspect) => {
	if (src && type) {
		switch (type) {
			case "newImage":
				return `https://res.cloudinary.com/banjee/image/upload/v1/${src}.webp`;

			case "thumbImage":
				return `https://res.cloudinary.com/banjee/image/upload/r_50/v1668430374/${src}.webp`;

			case "image":
				return `https://res.cloudinary.com/banjee/image/upload/ar_${
					aspect ? aspect : "1:1"
				},c_pad,f_auto,b_rgb:202124,q_auto:low/v1/${src}.webp`;

			case "video":
				// console.warn(
				// 	`https://res.cloudinary.com/banjee/video/upload/br_64,q_auto/v1/${src}.mp4`
				// );
				return `https://res.cloudinary.com/banjee/video/upload/br_64,q_auto/v1/${src}.mp4`;

			case "alertVideo":
				return `https://res.cloudinary.com/banjee/video/upload/c_scale,h_320/br_64,q_auto/v1/${src}.mp4`;

			case "alertThumbnail":
				return `https://res.cloudinary.com/banjee/video/upload/c_scale,h_180/br_128,q_auto/v1/${src}.webp`;

			case "newsAlert":
				return `https://res.cloudinary.com/banjee/video/upload/b_rgb:202124,c_pad,q_auto,ar_1:1,h_320/${src}.webp`;

			case "newsAlertVideo":
				return `https://res.cloudinary.com/banjee/video/upload/b_rgb:202124,c_pad,q_auto,ar_1:1,h_320/${src}.mp4`;

			case "thumbnail":
				return `https://res.cloudinary.com/banjee/video/upload/br_128,q_auto:low/v1/${src}.webp`;

			case "audio":
				return `https://res.cloudinary.com/banjee/video/upload/br_64,q_auto:low/v1/${src}.mp3`;

			default:
				return `https://res.cloudinary.com/banjee/image/upload/ar_${
					aspect ? aspect : "1:1"
				},c_pad,f_auto,q_auto:low/v1/${src}.webp`;
		}
	}
};

export const checkGender = (gender) => {
	let maleImg = require("../../../assets/EditDrawerIcon/male_placeholder.png");
	let femaleImg = require("../../../assets/EditDrawerIcon/female_placeholder.png");
	let neutralImg = require("../../../assets/EditDrawerIcon/neutral_placeholder.png");
	if (gender === "Male") return maleImg;
	else if (gender === "Female") return femaleImg;
	else return neutralImg;
};

export const GOOGLE_MAP_API_KEY = "AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk";

export const alertIcons = [
	{
		type: MaterialIcons,
		icon: "local-activity",
		img: require("../../../assets/alerticonset/SuspiciusActivity.png"),
		name: "Suspicious Activity",
		comp: () => <MaterialIcons icon="local-activity" />,
	},
	{
		type: MaterialIcons,
		icon: "pets",
		img: require("../../../assets/alerticonset/pawprint.png"),
		name: "Lost / Found Pet",
		comp: () => <MaterialIcons icon="pets" />,
	},
	{
		type: MaterialCommunityIcons,
		icon: "robber",
		img: require("../../../assets/alerticonset/HouseBreak-In.png"),
		name: "House Break-In",
		comp: () => <MaterialIcons icon="robber" />,
	},
	{
		type: AntDesign,
		icon: "car",
		img: require("../../../assets/alerticonset/CarVandalism.png"),
		name: "Car Vandalism",
		comp: () => <MaterialIcons icon="car" />,
	},

	{
		type: Entypo,
		icon: "sound",
		img: require("../../../assets/alerticonset/Theft-Robbery.png"),
		name: "Theft/Robbery",
		comp: () => <MaterialIcons icon="sound" />,
	},

	{
		type: AntDesign,
		icon: "car",
		img: require("../../../assets/alerticonset/Violence-Assault.png"),
		name: "Violence/Assault",
		comp: () => <MaterialIcons icon="car" />,
	},

	{
		type: AntDesign,
		icon: "car",
		img: require("../../../assets/alerticonset/Hit&Run.png"),
		name: "Hit & Run",
		comp: () => <AntDesign icon="car" />,
	},
	{
		type: FontAwesome5,
		icon: "road",
		img: require("../../../assets/alerticonset/PoliceRoadblock.png"),
		name: "Police Roadblock",
		comp: () => <FontAwesome5 icon="road" />,
	},

	{
		type: FontAwesome,
		icon: "fire",
		img: require("../../../assets/alerticonset/fire.png"),
		name: "Fire",
		comp: () => <FontAwesome icon="fire" />,
	},

	{
		type: MaterialCommunityIcons,
		icon: "lightning-bolt",
		img: require("../../../assets/alerticonset/thunder.png"),
		name: "Power Cut",
		comp: () => <MaterialCommunityIcons icon="lightning-bolt" />,
	},
	{
		type: Ionicons,
		icon: "person",
		img: require("../../../assets/alerticonset/SuspiciusPerson.png"),
		name: "Missing Person",
		comp: () => <Ionicons icon="person" />,
	},

	{
		type: MaterialCommunityIcons,
		icon: "Accident",
		img: require("../../../assets/alerticonset/car-collision.png"),
		name: "Road Accident",
		comp: () => <MaterialCommunityIcons icon="lightning-bolt" />,
	},
	{
		type: MaterialCommunityIcons,
		icon: "tow-truck",
		img: require("../../../assets/alerticonset/SuspiciusVehicle.png"),
		name: "Suspicious Vehicle",
		comp: () => <MaterialCommunityIcons icon="tow-truck" />,
	},
	{
		type: MaterialCommunityIcons,
		icon: "tow-truck",
		img: require("../../../assets/alerticonset/news.png"),
		name: "General News",
		comp: () => <MaterialCommunityIcons icon="tow-truck" />,
	},
	{
		type: MaterialCommunityIcons,
		icon: "Other",
		img: require("../../../assets/alerticonset/news.png"),
		name: "Other",
		comp: () => <MaterialCommunityIcons icon="lightning-bolt" />,
	},
];

export const darkMap = [
	{
		elementType: "geometry",
		stylers: [
			{
				color: "#242f3e",
			},
		],
	},
	{
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#746855",
			},
		],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#242f3e",
			},
		],
	},
	{
		featureType: "administrative",
		elementType: "geometry",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "administrative.locality",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#d59563",
			},
		],
	},
	{
		featureType: "poi",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#d59563",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [
			{
				color: "#263c3f",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#6b9a76",
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [
			{
				color: "#38414e",
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#212a37",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#9ca5b3",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [
			{
				color: "#746855",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#1f2835",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#f3d19c",
			},
		],
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "geometry",
		stylers: [
			{
				color: "#2f3948",
			},
		],
	},
	{
		featureType: "transit.station",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#d59563",
			},
		],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#17263c",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#515c6d",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#17263c",
			},
		],
	},
];
export const mapStandardStyle = [
	{
		featureType: "administrative",
		elementType: "geometry",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
];

export const BanjeeProfileId = "61111e42bcc68b2a1fa3432c";

export function haversine_distance(mk1, mk2) {
	var R = 3958.8; // Radius of the Earth in miles
	var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
	var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
	var difflat = rlat2 - rlat1; // Radian difference (latitudes)
	var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

	var d =
		2 *
		R *
		Math.asin(
			Math.sqrt(
				Math.sin(difflat / 2) * Math.sin(difflat / 2) +
					Math.cos(rlat1) *
						Math.cos(rlat2) *
						Math.sin(difflon / 2) *
						Math.sin(difflon / 2)
			)
		);
	return d * 1609.34 >= 1000
		? `${(d * 1.60934).toFixed(2)}Km`
		: `${(d * 1609.34).toFixed(2)}m`;
}

export const travelDistance = async (lat1, lon1, lat2, lon2) => {
	let x = await axios.get(
		`https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&key=${GOOGLE_MAP_API_KEY}`
	);
	return x?.data?.routes?.[0]?.legs?.[0]?.distance || null;
};

export const openAppSetting = (message) => {
	Alert.alert(`Permission required`, message, [
		{
			text: "Cancel",
			onPress: () => {},
		},
		{
			text: "Open Settings",
			onPress: () => {
				Linking.openSettings();
			},
		},
	]);
};
