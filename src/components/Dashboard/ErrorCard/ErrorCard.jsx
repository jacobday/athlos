import React, { Component } from "react";
import styles from "./ErrorCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ErrorCard extends Component {
  onClick = () => {
    this.props.handleRefresh();
  };

  render() {
    return (
      <React.Fragment>
        <button
          className={[styles.card, styles.loadIn].join(" ")}
          onClick={this.onClick}
          title={"Reload"}
        >
          <i>
            <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
          </i>
        </button>
      </React.Fragment>
    );
  }
}

export default ErrorCard;
