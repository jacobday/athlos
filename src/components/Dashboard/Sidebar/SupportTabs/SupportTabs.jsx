import React, { Component } from "react";
import styles from "./SupportTabs.module.css";
import { Tab } from "../../..";
import uniqid from "uniqid";
class SupportTabs extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Support Section */}
        <div className={styles.title}>SUPPORT</div>

        <Tab
          key={uniqid("", "-tab")}
          activeTab={this.props.activeTab}
          onClick={this.props.onClick}
          tabLabel="Chat Support"
          icon="fa-solid fa-headset"
        ></Tab>
      </React.Fragment>
    );
  }
}

export default SupportTabs;
