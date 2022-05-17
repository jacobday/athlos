import React, { Component } from "react";
import styles from "./Visualization.module.css";
import EarningsGraph from "./EarningsGraph/EarningsGraph";
import FavoriteSportsGraph from "./FavoriteSportsGraph/FavoriteSportsGraph";
import SalesGraph from "./SalesGraph/SalesGraph";
import ExpensesGraph from "./ExpensesGraph/ExpensesGraph";

class Visualization extends Component {
  render() {
    return (
      <React.Fragment>
        <section className={styles.container}>
          {/* [Manager] Earnings Graph */}
          {this.props.userType === "Manager" && <EarningsGraph />}

          {/* [Manager] Sales Graph */}
          {this.props.userType === "Manager" && <SalesGraph />}

          {/* [Manager] Expenses Graph */}
          {this.props.userType === "Manager" && <ExpensesGraph />}

          {/* [Customer] Favorite Sports Graph */}
          {this.props.userType === "Customer" && (
            <FavoriteSportsGraph userEmail={this.props.userEmail} />
          )}
        </section>

        {this.props.userType === "Customer" && (
          <React.Fragment></React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Visualization;
