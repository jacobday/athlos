import React, { Component } from "react";
import styles from "./EditCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;
class EditCard extends Component {
  state = {
    isDeleted: false,
  };

  onDelete = () => {
    let isExecuted = window.confirm(
      "Are you sure you want to delete this booking ?"
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
        url: api_url + "/facilities/delete/" + this.props.uniqFacId,
      })
        .then((res) => {
          console.log("Deleted Successfully");
          this.props.handleRefresh();
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState({ isDeleted: true });
    }
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
    let fadeDelay = { animationDelay: animationDelay + "s" };

    return (
      <React.Fragment>
        {/* Facility Card */}
        {!this.state.isDeleted && (
          <div
            className={[styles.card, styles.loadIn].join(" ")}
            style={fadeDelay}
          >
            {/* Facility Image */}
            <div className={styles.image}>
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
              {/* Delete Button */}
              <button
                className={[styles.button, styles.deleteButton].join(" ")}
                onClick={this.onDelete}
              >
                Delete
              </button>
              {/* Edit Button */}
              {/* <button
              className={[styles.button, styles.editButton].join(" ")}
              onClick={() => this.onClickBook({ facilityID })}
            >
              Edit
            </button> */}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default EditCard;
