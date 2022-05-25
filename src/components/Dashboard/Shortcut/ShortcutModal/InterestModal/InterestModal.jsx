import React, { Component } from "react";
import { fetchInterests, SupportedSports } from "../../../../../data";
import styles from "./InterestModal.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

class InterestModal extends Component {
  state = {
    sectionNumber: 1,
    selectedInterests: [],
  };

  setPageNumber(page) {
    this.setState({ sectionNumber: page });
  }

  toggleInterest(e) {
    let selectedInterests = this.state.selectedInterests;
    let targetName = e.target.name;
    let targetChecked = e.target.checked;

    if (targetChecked) {
      selectedInterests.push(targetName);
    } else {
      selectedInterests.splice(targetName);
    }
    this.setState({ selectedInterests });
  }

  async getInterests() {
    const result = await fetchInterests(this.props.userEmail);
    this.setState({ selectedInterests: result });
  }

  onSubmit = () => {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/interests/add",
      data: {
        email: this.props.userEmail,
        interest: this.state.selectedInterests,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Interests Added Sucessfully");
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't add Interests");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });

    this.props.onCloseModal();
  };

  componentDidMount() {
    this.getInterests();
  }

  render() {
    const nInterests = SupportedSports.map(({ sportName }) => {
      return (
        <React.Fragment>
          <section className={styles.interestBox}>
            <input
              className={styles.checkbox}
              type={"checkbox"}
              value={sportName}
              onClick={(e) => this.toggleInterest(e)}
              name={sportName}
              defaultChecked={this.state.selectedInterests.includes(sportName)}
            />
            <label className={styles.sportName} htmlFor={sportName}>
              {sportName}
            </label>
          </section>
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.navigation}>
              <button
                className={styles.close}
                onClick={this.props.onCloseModal}
                title="Close"
              >
                &times;
              </button>
              {/* Status Bar */}
              <nav className={styles.statusBar}>
                {/* Status Bar: Interests Summary */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.sectionNumber === 1 ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(1)}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-bars-progress" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>Interests</div>
                    <div className={styles.sectionTitle}>My Interests</div>
                  </div>
                </button>
                {/* Status Bar: My Profile Information  */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.sectionNumber === 2 ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(2)}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-user" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>Profile</div>
                    <div className={styles.sectionTitle}>My Profile</div>
                  </div>
                </button>
              </nav>
            </div>

            {this.state.sectionNumber === 1 && (
              <div className={styles.interestContainer}>
                <section className={styles.title}>
                  Select Your Interests
                </section>
                <section className={styles.interests}>{nInterests}</section>

                <section>
                  <button
                    onClick={() => this.onSubmit()}
                    className={[styles.button, styles.buttonPrimary].join(" ")}
                  >
                    Submit
                  </button>
                </section>
              </div>
            )}

            {this.state.sectionNumber === 2 && (
              <div className={styles.container}>
                <div className={styles.title}>My Profile Details</div>
                <div className={styles.profile}>
                  <div className={styles.profileIcon}>
                    <img
                      src={this.props.userImage}
                      alt={
                        this.props.userFirstName.charAt(0) +
                        this.props.userLastName.charAt(0)
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "";
                        currentTarget.style.borderWidth = 0;
                      }}
                    ></img>
                  </div>
                  <p>First Name: {this.props.userFirstName}</p>
                  <p>Last Name: {this.props.userLastName}</p>
                  <p>Email ID: {this.props.userEmail}</p>
                  <p>Your Reward Points: {this.props.userRewardPoints}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InterestModal;
