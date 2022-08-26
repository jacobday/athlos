import React, { Component } from "react";
import styles from "./Sidebar.module.css";
import UserTabs from "./UserTabs/UserTabs";
import ManagementTabs from "./ManagementTabs/ManagementTabs";
import GuestTabs from "./GuestTabs/GuestTabs";
import EmployeeTabs from "./EmployeeTabs/EmployeeTabs";
import SupportTabs from "./SupportTabs/SupportTabs";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles.sidebar}>
          {/* Athlos Branding */}
          <div className={styles.logo}>
            <Link to={"/"}>Athlos</Link>
          </div>

          {/* Guest View Tabs */}
          {this.props.user.type === "Guest" && (
            <GuestTabs
              activeTab={this.props.activeTab}
              onClick={this.props.onClick}
            />
          )}

          {/* Customer View Tabs */}
          {this.props.user.type === "Customer" && (
            <UserTabs
              activeTab={this.props.activeTab}
              onClick={this.props.onClick}
            />
          )}

          {/* Manager View Tabs */}
          {this.props.user.type === "Manager" && (
            <ManagementTabs
              activeTab={this.props.activeTab}
              onClick={this.props.onClick}
            />
          )}

          {/* On-Site Employee View Tabs */}
          {this.props.user.type === "Employee" && (
            <EmployeeTabs
              activeTab={this.props.activeTab}
              onClick={this.props.onClick}
            />
          )}

          {/* Customer Support View Tabs */}
          {this.props.user.type === "Support" && (
            <SupportTabs
              activeTab={this.props.activeTab}
              onClick={this.props.onClick}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Sidebar;
