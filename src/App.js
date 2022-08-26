import jwt_decode from "jwt-decode";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { logoutUser, setCurrentUser } from "./actions/authActions";
import { Dashboard, Home } from "./components";
import RegistrationModal from "./components/RegistrationModal/RegistrationModal";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to Home
    window.location.href = "/";
  }
}

class App extends Component {
  constructor(props = mapStateToProps) {
    super();

    this.state = {
      isAuthenticated: props.isAuthenticated,
      user: props.user,
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

  onLogout = () => {
    this.props.logoutUser();
    window.location.href = "/"; // Redirect to Home
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  handleRefresh = () => {
    // this.setState({ userRewardPoints: localStorage.getItem("rewardPoints") });
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
                user={this.state.user}
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
                user={this.state.user}
                userImage={this.state.userImage}
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { logoutUser })(App);
