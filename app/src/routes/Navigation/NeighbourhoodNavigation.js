import color from "../../constants/env/color";
import {
	gradientColor,
	headerBackground,
	headerStyle,
} from "../../constants/navigation/navigation";
import DetailNeighbourhood from "../../views/Main/Neighbourhood/DetailNeighbourhood/DetailNeighbourhood";
import DetailNeighbourhoodComp from "../../views/Main/Neighbourhood/DetailNeighbourhood/DetailNeighbourhoodContext";
import NeighbourhoodMemberList from "../../views/Main/Neighbourhood/DetailNeighbourhood/Members/NeighbourhoodMemberList";
import SearchBanjeeForNeighbourhood from "../../views/Main/Neighbourhood/DetailNeighbourhood/SearchBanjeeForNeighbourhood";
import FilterNeighbourhood from "../../views/Main/Neighbourhood/FilterNeighbourhoods/FilterNeighbourhood";
import MyNeighbourhood from "../../views/Main/Neighbourhood/MyNeighbourhood/MyNeighbourhoodList";
import Neighbourhood from "../../views/Main/Neighbourhood/Neighbourhood";
import BusinessService from "../../views/Services/DetailService/FilterDetailService/BusinessService";
import FilterBusiness from "../../views/Services/DetailService/FilterDetailService/FilterBusiness";
import FilterProduct from "../../views/Services/SellProduct/FilterProduct";

const DNeighbour = () => (
	<DetailNeighbourhoodComp>
		<DetailNeighbourhood />
	</DetailNeighbourhoodComp>
);

export const NeighbourhoodNavigation = [
	{
		name: "DetailNeighbourhood",
		component: DNeighbour,
		options: {
			// headerTitleAlign: "center",
			headerTitle: "",
			// headerTintColor: color.white,
			// headerBackground: () => headerBackground(gradientColor),
			headerStyle: headerStyle,
		},
	},
	{
		name: "Neighbourhood",
		component: Neighbourhood,
		options: {
			headerShown: false,
			headerTitleAlign: "center",
			headerTitle: "",
			// headerTintColor: color.white,
			headerStyle: headerStyle,
		},
	},
	{
		name: "MyNeighbourhood",
		component: MyNeighbourhood,
		options: {
			headerShown: true,
			headerTitle: "My Neighbourhood",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "BusinessService",
		component: BusinessService,
		options: {
			headerShown: true,
			headerTitle: "Explore",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "FilterBusiness",
		component: FilterBusiness,
		options: {
			headerShown: true,
			headerTitle: "Filter",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "NeighbourhoodMember",
		component: NeighbourhoodMemberList,
		options: {
			headerShown: true,
		},
	},
	{
		name: "FilterProduct",
		component: FilterProduct,
		options: {
			headerShown: true,
			headerTitle: "Filter",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "SearchBanjeeForNeighbourhood",
		component: SearchBanjeeForNeighbourhood,
		options: {
			headerShown: true,
			headerTitle: "Add members",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
	{
		name: "FilterNeighbourhood",
		component: FilterNeighbourhood,
		options: {
			headerShown: true,
			headerTitle: "Neighbourhood Watch",
			// headerTintColor: color.black,
			headerStyle: headerStyle,
		},
	},
];
