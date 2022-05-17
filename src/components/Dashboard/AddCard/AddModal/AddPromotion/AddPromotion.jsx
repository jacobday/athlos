import React, { Component } from "react";
import styles from "./AddPromotion.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

let currentDate = new Date()
  .toLocaleDateString("en-GB")
  .split("/")
  .reverse()
  .join("-");

class AddPromotion extends Component {
  state = {
    sectionNumber: 1,
    promotionName: "",
    promotionCode: "",
    promotionStart: currentDate,
    promotionEnd: "",
    promotionPercentage: null,
    promotionInfo: "",
    isError: false,
  };

  setPromotion = (e) => {
    let targetName = e.target.name;
    let targetValue = e.target.value;

    if (targetName === "promotionCode") {
      targetValue = targetValue.replace(/\s/g, "");
    }

    if (
      targetName === "promotionPercentage" &&
      targetValue !== "" &&
      (targetValue < 1 || targetValue > 100)
    ) {
      return;
    }

    this.setState({ [targetName]: targetValue }, this.validateDate);
  };

  validateDate = () => {
    if (
      new Date(this.state.promotionStart) > new Date(this.state.promotionEnd)
    ) {
      this.setState({ isError: true });
    } else {
      this.setState({ isError: false });
    }
  };

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
      url: api_url + "/promotion/add",
      data: {
        promotionName: this.state.promotionName,
        promotionCode: this.state.promotionCode,
        promotionStart: this.state.promotionStart,
        promotionEnd: this.state.promotionEnd,
        promotionPercentage: this.state.promotionPercentage / 100, // Convert to value between 0.0 - 1.0
        promotionInfo: this.state.promotionInfo,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Promotion Added Sucessfully");
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't add Promotion");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });

    this.props.handleRefresh();
    this.props.onCloseModal();
  };

  render() {
    return (
      <React.Fragment>
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
            {/* Status Bar: Promotion Information */}
            <button
              className={[
                styles.statusSection,
                this.state.promotionName &&
                this.state.promotionCode &&
                this.state.promotionStart &&
                this.state.promotionEnd &&
                this.state.promotionPercentage &&
                !this.state.isError
                  ? "completedSection"
                  : "",
              ].join(" ")}
            >
              <div className={styles.sectionIcon}>
                <FontAwesomeIcon icon="fa-solid fa-percent" />
              </div>
              <div className={styles.sectionText}>
                <div className={styles.sectionSelection}>
                  {this.state.promotionName ? this.state.promotionName : "-"}
                </div>
                <div className={styles.sectionTitle}>Promotion Information</div>
              </div>
            </button>
          </nav>
        </div>
        {/* Section 1: Promotion Information */}
        {this.state.sectionNumber === 1 && (
          <React.Fragment>
            <div className={styles.container}>
              <form>
                {/* Promotion Name */}
                <label htmlFor="promotionName">Promotion Name</label>
                <input
                  name="promotionName"
                  type="text"
                  placeholder="10% Off Equipment Rentals"
                  onChange={(e) => this.setPromotion(e)}
                  value={this.state.promotionName}
                  maxLength={50}
                />

                {/* Promotion Code */}
                <label htmlFor="promotionCode">Promotion Code</label>
                <input
                  name="promotionCode"
                  type="text"
                  placeholder="ATHLOS10"
                  onChange={(e) => this.setPromotion(e)}
                  value={this.state.promotionCode}
                  maxLength={25}
                />

                {/* Promotion Duration */}
                <div className={styles.duration}>
                  <section>
                    <label htmlFor="promotionStart">Promotion Start</label>
                    <input
                      name="promotionStart"
                      type="date"
                      onChange={(e) => this.setPromotion(e)}
                      value={this.state.promotionStart}
                      min={currentDate}
                    />
                  </section>

                  <section>
                    <label htmlFor="promotionEnd">Promotion End</label>
                    <input
                      name="promotionEnd"
                      type="date"
                      onChange={(e) => this.setPromotion(e)}
                      value={this.state.promotionEnd}
                      min={this.state.promotionStart}
                    />
                    {this.state.isError && (
                      <div className={styles.error}>
                        Reservation period must end after{" "}
                        {this.state.promotionStart}.
                      </div>
                    )}
                  </section>
                </div>

                {/* Promotion Percentage */}
                <label htmlFor="promotionPercentage">
                  Promotion Percentage
                </label>
                <input
                  name="promotionPercentage"
                  type="number"
                  placeholder="10%"
                  onChange={(e) => this.setPromotion(e)}
                  value={this.state.promotionPercentage}
                  step={5}
                  min={5}
                  max={100}
                />

                {/* Promotion Description */}
                <label htmlFor="promotionInfo">
                  Promotion Description (optional)
                </label>
                <input
                  name="promotionInfo"
                  type="text"
                  placeholder="Enjoy 10% off equipment rentals for the month of April"
                  onChange={(e) => this.setPromotion(e)}
                  value={this.state.promotionInfo}
                  maxLength={150}
                />
              </form>
              <button
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => this.onSubmit()}
                disabled={
                  !(
                    this.state.promotionName &&
                    this.state.promotionCode &&
                    this.state.promotionStart &&
                    this.state.promotionEnd &&
                    this.state.promotionPercentage &&
                    !this.state.isError
                  )
                }
              >
                Submit
              </button>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default AddPromotion;
