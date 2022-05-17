import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Dashboard, RegistrationModal } from "./components";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}
class App extends Component {
  constructor() {
    super();

    let userData = this.getUser();

    this.state = {
      isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
      user: userData,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      userEmail: userData.email,
      userType: userData.userType,
      userImage: userData.profilePicture,
      userRewardPoints: localStorage.getItem("rewardPoints"),
      showModal: false,
      showModalLogin: false,
      showModalSignUp: false,
    };
  }

  showModal = (tab) => {
    if (tab === "login") {
      this.setState({
        showModal: true,
        showModalLogin: true,
        showModalSignUp: false,
      });
    } else if (tab === "sign-up") {
      this.setState({
        showModal: true,
        showModalLogin: false,
        showModalSignUp: true,
      });
    }
  };

  handleAuthState = (res) => {
    localStorage.setItem("rewardPoints", 100); // tmp

    this.setState({
      isAuthenticated: true,
      userFirstName: res.data.firstName,
      userLastName: res.data.lastName,
      userEmail: res.data.email,
      userType: res.data.type,
      userImage: res.data.profilePicture,
      userRewardPoints: localStorage.getItem("rewardPoints"),
      showModal: false,
    });
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("user", JSON.stringify(res.data));

    window.location.href = "/dashboard"; // Redirect to Dashboard
  };

  onLogout = () => {
    axios({
      method: "GET",
      url: api_url + "/users/logout",
    }).then((res) => {
      if (res.status === 200) {
        console.log("Logged Out");

        this.setState({
          isAuthenticated: false,
          userFirstName: "",
          userLastName: "",
          userType: "Guest",
        });
      }
    });

    window.location.href = "/"; // Redirect to Home
    localStorage.clear();
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  getUser = () => {
    let user = {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "",
      userType: "Guest", // Implemented Options: "Guest", "Customer", "Manager", "Employee", "Support"
    };

    var storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      user = storedUser;
    }

    return user;
  };

  handleRefresh = () => {
    this.setState({ userRewardPoints: localStorage.getItem("rewardPoints") });
  };

  render() {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={this.state.isAuthenticated}
                userFirstName={this.state.userFirstName}
                userLastName={this.state.userLastName}
                userRewardPoints={this.state.userRewardPoints}
                userType={this.state.userType}
                onShowModal={this.showModal}
                onLogout={this.onLogout}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isAuthenticated={this.state.isAuthenticated}
                userFirstName={this.state.userFirstName}
                userLastName={this.state.userLastName}
                userEmail={this.state.userEmail}
                userType={this.state.userType}
                userImage={this.state.userImage}
                userRewardPoints={this.state.userRewardPoints}
                onShowModal={this.showModal}
                onLogout={this.onLogout}
                handleRefresh={this.handleRefresh}
              />
            }
          />
        </Routes>
        {this.state.showModal && (
          <RegistrationModal
            isSignUpVisible={this.state.showModalSignUp}
            handleAuthState={this.handleAuthState}
            onShowModal={this.showModal}
            onHideModal={this.hideModal}
            showModalLogin={this.state.showModalLogin}
            showModalSignUp={this.state.showModalSignUp}
          ></RegistrationModal>
        )}
      </Router>
    );
  }
}

export default App;
