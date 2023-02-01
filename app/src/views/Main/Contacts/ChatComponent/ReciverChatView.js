import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export default function ReciverChatView({ children }) {
	return (
		<LinearGradient
			colors={["#007A60", "#019CAE"]}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={{
				borderColor: "#007A60",
				width: "70%",
				backgroundColor: "grey",
				borderRadius: 16,
				padding: 10,
			}}
		>
			{children}
		</LinearGradient>
	);
}
