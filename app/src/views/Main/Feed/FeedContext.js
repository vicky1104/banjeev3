import { createContext } from "react";

export const MainFeedContext = createContext({
	allNeighbourhood: [],
	setAllNeighbourhood: () => {},
	liveGroup: [],
	setLiveGroup: () => {},
	alerts: {},
	setAlerts: () => {},
});
