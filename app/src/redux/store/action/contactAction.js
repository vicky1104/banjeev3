export const LIST_BANJEE_CONTACT = "LIST_BANJEE_CONTACT";

export const listBanjeeContact = (data) => {
	return {
		type: LIST_BANJEE_CONTACT,
		payload: data,
	};
};
