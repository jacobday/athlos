import React, { Component } from "react";
import styles from "./PromotionCard.module.css";
import "./PromotionCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

class PromotionCard extends Component {
  state = {
    showCheckoutModal: false,
    buttonLabel: "Copy Code",
    isDeleted: false,
  };

  onDelete = () => {
    let isExecuted = window.confirm(
      "Are you sure you want to delete this promotion?"
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
        url: api_url + "/promotion/delete/" + this.props.promotionID,
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
        promotionName,
        promotionCode,
        promotionStart,
        promotionEnd,
        promotionInfo,
        animationDelay,
      },
    } = this;

    // Promotion Name
    let promotionLabel = promotionName;
    const maxLabelLength = 35;
    if (promotionLabel.length > maxLabelLength) {
      promotionLabel = promotionLabel.substring(0, maxLabelLength) + "...";
    }

    // Promotion Image Colors
    const colors = [
      "Blue",
      "Purple",
      "Brown",
      "Maroon",
      "Pine",
      "Grey",
      "Auburn",
    ];
    const random = Math.floor(Math.random() * colors.length);
    const randomColor = "promo" + colors[random];

 

    return (
      <React.Fragment>
        <div className={[styles.card, styles.loadIn].join(" ")}>
          <div className={[styles.image, randomColor].join(" ")}>
            <img src="images/promotion.svg" alt="Promotion" />
          </div>
          <div className={styles.content}>
            <div title={promotionName} className={styles.title}>
              {promotionLabel}
            </div>
            <div className={styles.date}>
              <i>
                <FontAwesomeIcon icon="fa-solid fa-calendar-check" />
              </i>
              <span>{promotionStart.slice(5).split("-").join("/")}</span>{" "}
              &ndash; <span>{promotionEnd.slice(5).split("-").join("/")}</span>
            </div>
            <div className={styles.code}>
              <i>
                <FontAwesomeIcon icon="fa-solid fa-barcode" />
              </i>
              Code: <span>{promotionCode}</span>
            </div>
            {promotionInfo && (
              <div className={styles.description}>
                <i>
                  <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                </i>
                {promotionInfo}
              </div>
            )}
            {/* Delete Button */}
            {this.props.user.type === "Manager" && (
              <button
                className={[styles.button, styles.deleteButton].join(" ")}
                onClick={this.onDelete}
              >
                Delete
              </button>
            )}
            {this.props.user.type === "Customer" && (
              <button
                title={promotionCode}
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => {
                  this.setState({ buttonLabel: "Copied" });
                  navigator.clipboard.writeText(promotionCode);
                }}
              >
                {this.state.buttonLabel}
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PromotionCard;
