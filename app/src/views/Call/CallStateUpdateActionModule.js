var CallStateUpdateActionModule = {
	callStateUpdated(state, incomingNumber) {
		this.callback && this.callback(state, incomingNumber);
	},
};

export default CallStateUpdateActionModule;
