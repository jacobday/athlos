import React, { Component } from "react";
import styles from "./MyBookCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;
class MyBookCard extends Component {
  state = {
    isDeleted: false,
    showModal: false,
  };

  onDelete = () => {
    let isExecuted = window.confirm(
      "Are you sure you want to cancel this booking ?"
    );
    if (isExecuted) {
      var api_url;
      if (process.env.NODE_ENV === "production") {
        api_url = REACT_APP_PRODUCTION_URL;
      } else {
        api_url = REACT_APP_LOCAL_URL;
      }

      axios({
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": api_url,
        },
        url: api_url + "/book/delete/" + this.props.uniqBookingId,
      })
        .then((res) => {
          console.log("Deleted Successfully");
          window.alert(`Refund requested for $${this.props.totalAmount}`);
          // Refresh My Bookings Data
          this.props.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState({ isDeleted: true });
    }
  };

  onOpenModal = () => {
    document.querySelector("body").style.overflow = "hidden";
    this.setState({ showModal: true });
  };

  onCloseModal = () => {
    document.querySelector("body").style.overflow = "auto";
    this.setState({ showModal: false });
  };

  render() {
    const {
      props: {
        uniqBookingId,
        gear,
        upgrade,
        intime,
        outtime,
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        totalAmount,
        latitude,
        longitude,
        animationDelay,
      },
    } = this;

    let facilityLabel = facilityName;
    const maxLabelLength = 35;
    if (facilityLabel.length > maxLabelLength) {
      facilityLabel = facilityLabel.substring(0, maxLabelLength) + "...";
    }

    let sportImage =
      "images/" +
      facilitySport.toString().toLowerCase().replace(/ /g, "") +
      ".jpg";

    return (
      <React.Fragment>
        {/* My Bookings Card */}
        {!this.state.isDeleted && (
          <div
            className={[styles.card, styles.loadIn].join(" ")}
          >
            <div className={styles.image}>
              <img src={sportImage} alt={facilitySport} />
            </div>
            <div className={styles.content}>
              <div title={facilityName} className={styles.title}>
                {facilityLabel}
              </div>
              <div className={styles.time}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-clock" />
                </i>
                Time Slot:{" "}
                <span>
                  {intime}:00 - {outtime}:00
                </span>
              </div>
              <div className={styles.location}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-location-arrow" />
                </i>
                {facilityLocation.city + ", " + facilityLocation.state}
              </div>
              <div className={styles.description}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                </i>
                {facilityInfo}
              </div>

              {/* Cancel Button */}
              <button
                className={[styles.button, styles.cancelButton].join(" ")}
                onClick={this.onDelete}
              >
                Cancel
              </button>

              {/* View Button */}
              <button
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => this.onOpenModal()}
              >
                View
              </button>
            </div>
          </div>
        )}
        {this.state.showModal && (
          <ConfirmationModal
            bookingID={uniqBookingId}
            onCloseModal={this.onCloseModal}
            facilityName={facilityName}
            facilityLocation={facilityLocation}
            facilitySport={facilitySport}
            facilityInfo={facilityInfo}
            totalAmount={totalAmount}
            latitude={latitude}
            longitude={longitude}
            gear={gear}
            upgrade={upgrade}
            intime={intime}
            outtime={outtime}
            handleCancelation={this.onDelete}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MyBookCard;
