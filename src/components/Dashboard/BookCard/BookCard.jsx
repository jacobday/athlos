import React, { Component } from "react";
import styles from "./BookCard.module.css";
import "./BookCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckoutModal } from "../..";
import uniqid from "uniqid";

class BookCard extends Component {
  state = {
    showCheckoutModal: false,
  };

  onClickBook = () => {
    document.querySelector("body").style.overflow = "hidden";
    this.setState({ showCheckoutModal: true });
  };

  closeCheckoutModal = () => {
    document.querySelector("body").style.overflow = "auto";
    this.setState({ showCheckoutModal: false });
  };

  render() {
    const {
      props: {
        facilityID,
        uniqFacId,
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        availableNow,
        animationDelay,
        reservationPeriodStart,
        reservationPeriodEnd,
        isAuthenticated,
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
    let fadeDelay = { animationDelay: animationDelay + "s" };

    return (
      <React.Fragment>
        <div
          className={[styles.card, styles.loadIn].join(" ")}
          style={fadeDelay}
        >
          <div className={styles.image}>
            {availableNow && (
              <div className={[styles.available, styles.fadeIn].join(" ")}>
                Available Now
              </div>
            )}
            <img src={sportImage} alt={facilitySport} />
          </div>
          <div className={styles.content}>
            <div title={facilityName} className={styles.title}>
              {facilityLabel}
            </div>
            <div className={styles.location}>
              <i>
                <FontAwesomeIcon icon="fa-solid fa-location-arrow" />
              </i>
              {facilityLocation}
            </div>
            <div className={styles.description}>
              <i>
                <FontAwesomeIcon icon="fa-solid fa-circle-info" />
              </i>
              {facilityInfo}
            </div>
            <button
              className={[styles.button, styles.buttonPrimary].join(" ")}
              onClick={() => this.onClickBook({ facilityID })}
            >
              Book
            </button>
          </div>
        </div>

        {this.state.showCheckoutModal && (
          <CheckoutModal
            key={uniqid("", "-checkoutmodal")}
            facilityID={facilityID}
            uniqFacId={uniqFacId}
            facilityName={facilityName}
            facilityLocation={facilityLocation}
            facilitySport={facilitySport}
            facilityInfo={facilityInfo}
            availableNow={availableNow}
            onCloseModal={this.closeCheckoutModal}
            reservationPeriodStart={reservationPeriodStart}
            reservationPeriodEnd={reservationPeriodEnd}
            isAuthenticated={isAuthenticated}
            onShowModal={this.props.onShowModal}
            userFirstName={this.props.userFirstName}
            userLastName={this.props.userLastName}
            userEmail={this.props.userEmail}
            userType={this.props.userType}
            userRewardPoints={this.props.userRewardPoints}
            handleRefresh={this.props.handleRefresh}
          />
        )}
      </React.Fragment>
    );
  }
}

export default BookCard;
