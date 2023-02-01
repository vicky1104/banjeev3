import { LinearGradient } from "expo-linear-gradient";
import React, { Component } from "react";

export default function SenderChatView({ children }) {
	return (
		<LinearGradient
			colors={["#474758", "#474758"]}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={{
				borderColor: "#6B6B80",
				height: "100%",
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
