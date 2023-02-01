import React from "react";
import { CallContextProvider } from "./Context";
import GroupCall from "./GroupCall";

export default function Index() {
	return (
		<CallContextProvider>
			<GroupCall />
		</CallContextProvider>
	);
}
