import React, { Component } from "react";
import styles from "./AddCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddModal from "./AddModal/AddModal";
import uniqid from "uniqid";

class AddCard extends Component {
  state = {
    showAddModal: false,
  };

  onClickAdd = () => {
    document.querySelector("body").style.overflow = "hidden";
    this.setState({ showAddModal: true });
  };

  closeAddModal = () => {
    document.querySelector("body").style.overflow = "auto";
    this.setState({ showAddModal: false });
  };

  render() {
    const {
      props: { animationDelay },
    } = this;

    let fadeDelay = { animationDelay: animationDelay + "s" };
    let cardTitle =
      "Add " +
      this.props.type.charAt(0).toUpperCase() +
      this.props.type.slice(1);

    return (
      <React.Fragment>
        {/* Add Facility Card */}
        <button
          className={[styles.card, styles.loadIn].join(" ")}
          onClick={this.onClickAdd}
          style={fadeDelay}
          title={cardTitle}
        >
          <i>
            <FontAwesomeIcon icon="fa-solid fa-plus" />
          </i>
        </button>

        {/* Add Modal */}
        {this.state.showAddModal && (
          <AddModal
            key={uniqid("", "-addmodal")}
            type={this.props.type}
            onCloseModal={this.closeAddModal}
            handleRefresh={this.props.handleRefresh}
          />
        )}
      </React.Fragment>
    );
  }
}

export default AddCard;
