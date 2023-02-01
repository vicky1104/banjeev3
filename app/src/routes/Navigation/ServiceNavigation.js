import color from "../../constants/env/color";
import {
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import CreateListing from "../../views/Services/CreateProduct/CreateListing";
import DetailService from "../../views/Services/DetailService/DetailService";
import ViewProductInDetail from "../../views/Services/SellProduct/ViewProduct/AllProduct/ViewProductInDetail";
import AllProductList from "../../views/Services/SellProduct/ViewProduct/AllProductList";

export default ServiceNavigation = [
	{
		name: "DetailService",
		component: DetailService,
		options: {
			headerTitle: "",
			headerStyle: headerStyle,
		},
	},
	{
		name: "AllProductList",
		component: AllProductList,
		options: {
			headerTitle: "For Sell",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "CreateListing",
		component: CreateListing,
		options: {
			headerTitle: "Create Listing",
			headerStyle: headerStyle,
		},
	},

	{
		name: "ViewProductInDetail",
		component: ViewProductInDetail,
		options: {
			headerTitle: "For Sell	",
			headerStyle: headerStyle,
		},
	},
];
