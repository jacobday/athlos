import React, { Component } from "react";
import styles from "./UserTabs.module.css";
import { Tab } from "../../..";
import uniqid from "uniqid";

class UserTabs extends Component {
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

        {/* Bookings Section */}
        <div className={styles.title}>BOOKINGS</div>
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Book"
          icon="fa-solid fa-bookmark"
        ></Tab>
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="My Bookings"
          icon="fa-solid fa-layer-group"
        ></Tab>

        {/* Account Section */}
        <div className={styles.title}>ACCOUNT</div>
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Notifications"
          icon="fa-solid fa-bell"
        ></Tab>
        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Account"
          icon="fa-solid fa-gears"
        ></Tab>
      </React.Fragment>
    );
  }
}

export default UserTabs;
