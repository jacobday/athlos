import React, { Component } from "react";
import styles from "./ManagementTabs.module.css";
import { Tab } from "../../..";
import uniqid from "uniqid";
class ManagementTabs extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Dashboard Section */}
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Dashboard"
          icon="fa-solid fa-house-user"
        ></Tab>

        {/* Management Section */}
        <div className={styles.title}>MANAGEMENT</div>
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Edit Facilities"
          icon="fa-solid fa-pen-to-square"
        ></Tab>
        {/* <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Edit Equipment"
          icon="fa-solid fa-pen-to-square"
        ></Tab> */}
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Edit Promotions"
          icon="fa-solid fa-receipt"
        ></Tab>
      </React.Fragment>
    );
  }
}

export default ManagementTabs;
