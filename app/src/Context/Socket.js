import React, {createContext, useState} from "react";

const SocketContext = createContext({
	socket: false,
	setSocket: () => {},
});
export default SocketContext;

export function SocketContextProvider({children}) {
	const {socket} = React.useContext(SocketContext);
	const [socketState, setSocketState] = useState(socket);

	const socketStateHandler = React.useCallback((data) => {
		setSocketState(data);
	}, []);

	return (
		<SocketContext.Provider
			value={{
				socket: socketState,
				setSocket: socketStateHandler,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}

// import React from "react";
// import io from "socket.io-client";

// export const socket = io.connect("wss://message.banjee.org/", {
//   transports: ["websocket"],
//   origins: "*",
//   forceNew: true,
//   reconnection: true,
//   reconnectionDelay: 200,
//   reconnectionDelayMax: 500,
//   reconnectionAttempts: Infinity,
//   pingInterval: 1000 * 60 * 5,
//   pingTimeout: 1000 * 60 * 3,
// });
// export const SocketContext = React.createContext();
