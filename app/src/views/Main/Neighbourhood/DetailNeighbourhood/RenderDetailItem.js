import React, { memo, useContext } from "react";
import BuisnessNearBy from "../../../Services/BuisnessNearBy";
import SellProductList from "../../../Services/SellProduct/SellProductList";
import RenderFeedItem from "../../Feed/RenderFeedItem";
import { DetailNeighbourhoodContext } from "./DetailNeighbourhoodContext";
import DetailNeighbourhoodHeader from "./DetailNeighbourhoodHeader";
import DetailNeighbourhoodTabs from "./DetailNeighbourhoodTabs";
import DetailMembers from "./Members/DetailMembers";
const RenderDetailItem = ({ item, index, productloader }) => {
	const { setTabs, tabs } = useContext(DetailNeighbourhoodContext);

	switch (item.type) {
		case "detail":
			return <DetailNeighbourhoodHeader data={{ ...item.detail }} />;
		case "business":
			return (
				<BuisnessNearBy
					data={item.business}
					productloader={productloader}
				/>
			);
		case "product":
			return <SellProductList data={item.products} />;

		case "tabs":
			return (
				<DetailNeighbourhoodTabs
					setTabs={setTabs}
					tabs={tabs}
				/>
			);
		case "posts":
			return <RenderFeedItem item={item} />;
		case "members":
			return <DetailMembers item={item} />;
		default:
			return null;
	}
};

export default memo(RenderDetailItem);
