import React, { Component } from "react";
import styles from "./AddEquipment.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SupportedSports } from "../../../../../data";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

class AddEquipment extends Component {
  state = {
    sectionNumber: 1,
    itemName: "",
    itemCategory: "",
    itemPrice: null,
    maxItems: null,
  };

  setEquipment = (e) => {
    let targetName = e.target.name;
    let targetValue = e.target.value;

    if (targetName === "itemCategory" && targetValue === "-") {
      return;
    }

    if (
      targetName === "itemPrice" &&
      targetValue !== "" &&
      (targetValue < 1 || targetValue > 100)
    ) {
      return;
    }

    if (
      targetName === "maxItems" &&
      targetValue !== "" &&
      (targetValue < 1 || targetValue > 50)
    ) {
      return;
    }

    this.setState({ [targetName]: targetValue });
  };

  onSubmit = () => {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    var newEquipmentData = {
      itemName: this.state.itemName,
      itemCategory: this.state.itemCategory,
      itemPrice: this.state.itemPrice,
      maxItems: this.state.maxItems,
    };

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/promotions/add",
      data: { newEquipmentData },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Equipment Added Sucessfully");
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't add Equipment");
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
    // Map supported sports to category options
    const nSportOptions = SupportedSports.sort(function (a, b) {
      var sportA = a.sportName.toLowerCase(),
        sportB = b.sportName.toLowerCase();
      if (sportA < sportB) {
        return -1;
      }
      if (sportB > sportA) {
        return 1;
      }
      return 0;
    }).map(({ sportName }) => {
      return <option>{sportName}</option>;
    });

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
            {/* Status Bar: Item Information */}
            <button
              className={[
                styles.statusSection,
                this.state.itemName &&
                this.state.itemCategory &&
                this.state.itemPrice &&
                this.state.maxItems
                  ? "completedSection"
                  : "",
              ].join(" ")}
            >
              <div className={styles.sectionIcon}>
                <FontAwesomeIcon icon="fa-solid fa-medal" />
              </div>
              <div className={styles.sectionText}>
                <div className={styles.sectionSelection}>
                  {this.state.itemName ? this.state.itemName : "-"}
                </div>
                <div className={styles.sectionTitle}>Equipment Information</div>
              </div>
            </button>
          </nav>
        </div>
        {/* Section 1: Equipment Information */}
        {this.state.sectionNumber === 1 && (
          <React.Fragment>
            <div className={styles.container}>
              <form>
                {/* Item Name */}
                <label htmlFor="itemName">Item Name</label>
                <input
                  name="itemName"
                  type="text"
                  placeholder="Soccer Ball"
                  onChange={(e) => this.setEquipment(e)}
                  value={this.state.itemName}
                  maxLength={50}
                />

                {/* Item Category */}
                <label htmlFor="itemCategory">Item Category</label>
                <select
                  name="itemCategory"
                  type="text"
                  placeholder="Soccer"
                  onChange={(e) => this.setEquipment(e)}
                  value={this.state.itemCategory}
                >
                  <option>-</option>
                  {nSportOptions}
                </select>

                {/* Item Price */}
                <label htmlFor="itemPrice">Item Price</label>
                <input
                  name="itemPrice"
                  type="number"
                  placeholder="$1.75"
                  onChange={(e) => this.setEquipment(e)}
                  value={this.state.itemPrice}
                  min={1}
                  max={100}
                  step={0.01}
                />

                {/* Max Items */}
                <label htmlFor="maxItems">Max Items per Reservation</label>
                <input
                  name="maxItems"
                  type="number"
                  placeholder="5"
                  onChange={(e) => this.setEquipment(e)}
                  value={this.state.maxItems}
                  min={1}
                  max={50}
                  step={1}
                />
              </form>
              <button
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => this.onSubmit()}
                disabled={
                  !(
                    this.state.itemName &&
                    this.state.itemCategory &&
                    this.state.itemPrice &&
                    this.state.maxItems
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

export default AddEquipment;
