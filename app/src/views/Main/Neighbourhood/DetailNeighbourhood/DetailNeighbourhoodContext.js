import React, { createContext, useContext, useState } from "react";

export const DetailNeighbourhoodContext = createContext({
	detail: {},
	business: [],
	products: [],
	posts: [],
	members: [],
	tabs: "Posts",
	leave: false,
	confirmLeave: false,
	joinNH: false,
	setJoinNH: () => {},
	setConfirmLeave: () => {},
	setDetail: () => {},
	setBusiness: () => {},
	setProducts: () => {},
	setPosts: () => {},
	setMembers: () => {},
	setLeave: () => {},
	setTabs: () => {},
});

const DetailNeighbourhoodComp = ({ children }) => {
	const [detail, setDetail] = useState({});
	const [business, setBusiness] = useState([]);
	const [products, setProducts] = useState([]);
	const [posts, setPosts] = useState([]);
	const [members, setMembers] = useState([]);
	const [leave, setLeave] = useState(false);
	const [confirmLeave, setConfirmLeave] = useState(false);
	const [tabs, setTabs] = useState("Posts");
	const [joinNH, setJoinNH] = useState(false);

	return (
		<DetailNeighbourhoodContext.Provider
			value={{
				detail,
				business,
				products,
				posts,
				members,
				leave,
				tabs,
				confirmLeave,
				joinNH,
				setJoinNH,
				setConfirmLeave,
				setDetail,
				setBusiness,
				setProducts,
				setPosts,
				setMembers,
				setLeave,
				setTabs,
			}}
		>
			{children}
		</DetailNeighbourhoodContext.Provider>
	);
};

export default DetailNeighbourhoodComp;
