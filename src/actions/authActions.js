import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER } from "./types";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;
var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  console.log(userData);
  axios
    .post(`${api_url}/users/add`, userData)
    .then((res) => {
      window.location.href = "/"; // Redirect to Home
      console.log("User Added to Database");
    })
    .catch((err) => console.log(err));
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post(`${api_url}/users/login`, userData)
    .then((res) => {
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      window.location.href = "/dashboard";
      console.log("Successfully Logged In");
    })
    .catch((err) => console.log(err));
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
