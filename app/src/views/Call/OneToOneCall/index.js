import React from "react";
import { CallContextProvider } from "./Context";
import OneToOneCall from "./OneToOneCall";

export default function Index() {
	return (
		<CallContextProvider>
			<OneToOneCall />
		</CallContextProvider>
	);
}
