import React, { Component } from "react";
import styles from "./NavProfile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NavProfile extends Component {
  state = {
    showOptions: false,
  };

  toggleOptions = () => {
    this.setState({ showOptions: !this.state.showOptions });
  };

  render() {
    return (
      <React.Fragment>
        {/* Navigation: User Login/Sign Up Buttons [Right] */}
        {!this.props.isAuthenticated && (
          <div className={styles.login}>
            <button
              className={styles.button}
              onClick={() => this.props.onShowModal("login")}
            >
              Login
            </button>
            <button
              className={[styles.button, styles.buttonPrimary].join(" ")}
              onClick={() => this.props.onShowModal("sign-up")}
            >
              Sign Up
            </button>
          </div>
        )}
        {this.props.isAuthenticated && (
          <button
            className={[styles.login, styles.profile].join(" ")}
            onClick={this.toggleOptions}
          >
            <div className={styles.profileName}>
              <span>{this.props.user.firstName}</span>
              <span>{this.props.user.lastName}</span>
            </div>
            <div className={styles.profileIcon}>
              <span>
                {this.props.user.firstName.charAt(0) +
                  this.props.user.lastName.charAt(0)}
              </span>
            </div>

            {this.state.showOptions && (
              <div className={styles.profileOptions}>
                {this.props.user.type === "Customer" && (
                  <button className={[styles.button, styles.border].join(" ")}>
                    {this.props.user.rewardPoints} Reward Points
                  </button>
                )}
                <button className={styles.button} onClick={this.props.onLogout}>
                  <i>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
                  </i>
                  Logout
                </button>
              </div>
            )}
          </button>
        )}
      </React.Fragment>
    );
  }
}

export default NavProfile;
