import AsyncStorage from "@react-native-async-storage/async-storage";

const setLocalStorage = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(error);
	}
};

const getLocalStorage = async (key) => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		console.warn(error);
	}
};

const removeLocalStorage = async (key) => {
	try {
		return await AsyncStorage.removeItem(key);
	} catch (error) {
		console.warn(error);
	}
};

const setProfileLocation = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(error);
	}
};

const getProfileLoaction = async (key) => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		console.warn(error);
	}
};

const removeProfileLocation = async (key) => {
	try {
		return await AsyncStorage.removeItem(key);
	} catch (error) {
		console.warn(error);
	}
};

const setMyDefaultNeighbourhood = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(error);
	}
};

const getMyDefaultNeighbourhood = async (key) => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		console.warn(error);
	}
};

const removeMyDefaultNeighbourhood = async (key) => {
	try {
		return await AsyncStorage.removeItem(key);
	} catch (error) {
		console.warn(error);
	}
};

export {
	setLocalStorage,
	getLocalStorage,
	removeLocalStorage,
	setProfileLocation,
	getProfileLoaction,
	removeProfileLocation,
	setMyDefaultNeighbourhood,
	getMyDefaultNeighbourhood,
	removeMyDefaultNeighbourhood,
};
