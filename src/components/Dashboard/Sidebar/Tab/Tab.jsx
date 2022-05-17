import React, { Component } from "react";
import "./Tab.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Tab extends Component {
  onClick = () => {
    const { tabLabel, onClick } = this.props;
    onClick(tabLabel);
  };

  render() {
    const {
      onClick,
      props: { activeTab, tabLabel, icon },
    } = this;

    let className = "sideTabLink";

    if (activeTab === tabLabel) {
      className += " activeTabLink";
    }

    return (
      <button className={className} onClick={onClick}>
        <i>
          <FontAwesomeIcon icon={icon} />
        </i>
        {tabLabel}
      </button>
    );
  }
}

export default Tab;
