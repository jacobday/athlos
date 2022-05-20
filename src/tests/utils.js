import axios from "axios";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

export var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

export const fetchFacilities = async () => {
  try {
    return await axios.get(`${api_url}/facilities`);
  } catch (e) {
    return [];
  }
};

export const fetchPromotions = async () => {
  try {
    return await axios.get(`${api_url}/promotion/promos`);
  } catch (e) {
    return [];
  }
};
