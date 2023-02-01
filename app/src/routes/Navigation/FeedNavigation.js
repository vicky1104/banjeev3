import { Platform } from "react-native";
import color from "../../constants/env/color";
import {
	gradientColor,
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import ListBlogs from "../../views/Main/Blogs/ListBlogs";
import Alert from "../../views/Main/Feed/Alert/Alert";
import EmergencyContact from "../../views/Main/Feed/Alert/EmergencyContact";
import MyAlerts from "../../views/Main/Feed/Alert/MyAlerts/MyAlerts";
import PhoneBook from "../../views/Main/Feed/Alert/PhoneBook/PhoneBook";
import SelectAlertLocation from "../../views/Main/Feed/Alert/SelectAlertLocation";
import SelectNHAlert from "../../views/Main/Feed/Alert/SelectNHAlert";
import ViewAlert from "../../views/Main/Feed/Alert/ViewAlert";
import Comment from "../../views/Main/Feed/Comment/Comment";
import ApplyFilter from "../../views/Main/Feed/CreateFeed/ApplyFilter";
import CreateFeed from "../../views/Main/Feed/CreateFeed/CreateFeed";
import PostType from "../../views/Main/Feed/CreateFeed/PostType";
import SearchLocation from "../../views/Main/Feed/CreateFeed/SearchLocation";
import AlertComment from "../../views/Main/Feed/FeedNotification/AlertComponents/AlertComment";
import DetailAlert from "../../views/Main/Feed/FeedNotification/AlertComponents/DetailAlert";
import DetailEmergencyAlert from "../../views/Main/Feed/FeedNotification/AlertComponents/DetailEmergencyAlert";
import TrackDirection from "../../views/Main/Feed/FeedNotification/AlertComponents/TrackDirection";
import NotificationTab from "../../views/Main/Feed/FeedNotification/NotificationTab";
import ViewBanjeeNotification from "../../views/Main/Feed/FeedNotification/ViewBanjeeNotification";
import ViewBanjeeNotificationNoDetail from "../../views/Main/Feed/FeedNotification/ViewBanjeeNotificationNoDetail";
import ViewLike from "../../views/Main/Feed/Like/ViewLike";
import Announcement from "../../views/Main/Feed/NewFeedFlow/Announcements/Announcement";
import NewNotifications from "../../views/Main/Feed/NewFeedFlow/NewNotifications";
import SinglePost from "../../views/Main/Feed/SinglePost";

const FeedNavigation = [
	{
		name: "Comment",
		component: Comment,
		options: {
			headerTitle: "Comments",
			headerStyle: headerStyle,
		},
	},
	// {
	// 	name: "SinglePost",
	// 	component: SinglePost,
	// 	options: {
	// 		presentation: Platform.OS === "android" ? "modal" : undefined,
	// 		headerShown: false,
	// 		headerTitle: "",
	// 		headerStyle: headerStyle,
	// 	},
	// },
	{
		name: "ViewLike",
		component: ViewLike,
		options: {
			headerTitle: "People who reacted",
			headerStyle: headerStyle,
		},
	},
	{
		name: "FeedNotification",
		component: NotificationTab,
		options: {
			headerTitle: "Notifications",
		},
	},
	{
		name: "CreateFeed",
		component: CreateFeed,
		options: {
			headerTitle: "Post Your Feed",
			headerStyle: headerStyle,
		},
	},
	{
		name: "Blogs",
		component: ListBlogs,
	},
	{
		name: "SearchLocation",
		component: SearchLocation,
		options: {
			headerTitle: "",
			headerTransparent: true,
			// headerTintColor: color.white,
			// headerStyle: headerStyle,
			// headerBackground: () => headerBackground(gradientColor),
		},
	},
	{
		name: "ApplyFilter",
		component: ApplyFilter,
		options: {
			headerShown: false,
		},
	},
	{
		name: "PostType",
		component: PostType,
		options: {
			headerShown: false,
		},
	},
	{
		name: "Alert",
		component: Alert,

		options: {
			headerTitle: "Alert",
			headerStyle: headerStyle,
		},
	},
	{
		name: "ViewAlert",
		component: ViewAlert,

		options: {
			headerTitle: "Alert",
			headerStyle: headerStyle,
		},
	},
	{
		name: "SelectNHAlert",
		component: SelectNHAlert,

		options: {
			headerTitle: "Select Neighbourhood",
			headerStyle: headerStyle,
		},
	},
	{
		name: "DetailAlert",
		component: DetailAlert,

		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "DetailEmergencyAlert",
		component: DetailEmergencyAlert,

		options: {
			headerTitle: "Emergency",
			headerStyle: headerStyle,
		},
	},
	{
		name: "TrackDirection",
		component: TrackDirection,

		options: {
			headerShown: false,
			// headerTitle: "Track Direction",
			// headerStyle: headerStyle,
		},
	},
	{
		name: "EmergencyContact",
		component: EmergencyContact,
		options: {
			headerTitle: "Emergency Contact",
			headerStyle: headerStyle,
		},
	},
	{
		name: "PhoneBook",
		component: PhoneBook,
		options: {
			headerTitle: "Emergency Contact",
			headerStyle: headerStyle,
		},
	},
	{
		name: "MyAlerts",
		component: MyAlerts,
		options: {
			headerTitle: "My Alerts",
			headerStyle: headerStyle,
		},
	},
	{
		name: "SelectAlertLocation",
		component: SelectAlertLocation,
		options: {
			headerTitle: "Select Alert Location",
			headerStyle: headerStyle,
		},
	},
	{
		name: "ViewBanjeeNotification",
		component: ViewBanjeeNotification,
		options: {
			headerTitle: "Banjee Notification",
			headerStyle: headerStyle,
		},
	},
	{
		name: "ViewBanjeeNotificationNoDetail",
		component: ViewBanjeeNotificationNoDetail,
		options: {
			headerTitle: "Banjee Notification",
			headerStyle: headerStyle,
		},
	},
	{
		name: "Announcement",
		component: Announcement,
		options: {
			headerTitle: "Announcement",
			headerStyle: headerStyle,
		},
	},
	{
		name: "AlertComment",
		component: AlertComment,
		options: {
			headerTitle: "Comments",
			headerStyle: headerStyle,
		},
	},
	{
		name: "NewNotifications",
		component: NewNotifications,
		options: {
			headerTitle: "Notifications",
			headerStyle: headerStyle,
		},
	},
];

export default FeedNavigation;
