import React, { useRef } from "react";
import { BroadcastContextProvider } from "./Context";
import Broadcast from "./Broadcast";
import EventListeners from "./EventListeners";

export default function Index() {
	return (
		<BroadcastContextProvider>
			<Broadcast />
			<EventListeners />
		</BroadcastContextProvider>
	);
}
