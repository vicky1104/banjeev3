import { LinearGradient } from "expo-linear-gradient";
import color from "../../constants/env/color";
import {
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import CreateBlog from "../../views/Main/Blogs/CreateBlog/CreateBlog";
import ViewBlog from "../../views/Main/Blogs/CreateBlog/ViewBlog";
import ListBlogs from "../../views/Main/Blogs/ListBlogs";

export const BlogNavigation = [
	{
		name: "CreateBlog",
		component: CreateBlog,
		options: {
			headerShown: true,
			headerTitle: "Create Blog",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "ViewBlog",
		component: ViewBlog,
		options: {
			headerTransparent: true,
			headerShown: true,
			headerTitle: "",
			// headerTintColor: color.white,
			headerStyle: headerStyle,
			headerBackground: () => (
				<LinearGradient
					colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
					style={{ flex: 1 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				/>
			),
		},
	},
	{
		name: "MyBlogs",
		component: ListBlogs,
		options: {
			headerShown: true,
			headerTitle: "Blog",
			headerStyle: headerStyle,
		},
	},
];
