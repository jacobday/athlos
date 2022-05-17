import React, { Component } from "react";
import styles from "./AddModal.module.css";
import "./AddModal.css";
import AddFacility from "./AddFacility/AddFacility";
import AddPromotion from "./AddPromotion/AddPromotion";
import uniqid from "uniqid";
import AddEquipment from "./AddEquipment/AddEquipment";

class AddModal extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* Add Facility Interface */}
            {this.props.type === "facility" && (
              <AddFacility
                key={uniqid("", "-addfacility")}
                onCloseModal={this.props.onCloseModal}
                handleRefresh={this.props.handleRefresh}
              />
            )}
            {/* Add Promotion Interface */}
            {this.props.type === "promotion" && (
              <AddPromotion
                key={uniqid("", "-addpromotion")}
                onCloseModal={this.props.onCloseModal}
                handleRefresh={this.props.handleRefresh}
              />
            )}
            {/* Add Equipment Interface */}
            {this.props.type === "equipment" && (
              <AddEquipment
                key={uniqid("", "-addequipment")}
                onCloseModal={this.props.onCloseModal}
                handleRefresh={this.props.handleRefresh}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddModal;
