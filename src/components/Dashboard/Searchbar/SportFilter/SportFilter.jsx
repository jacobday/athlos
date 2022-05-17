import React, { Component } from "react";
import styles from "./SportFilter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SupportedSports } from "../../../../data";
import uniqid from "uniqid";

class SportFilter extends Component {
  state = { showSportFilters: false };

  toggleSportFilters = () => {
    this.setState({ showSportFilters: !this.state.showSportFilters });
  };

  setFilter = (value) => {
    this.setState({ showSportFilters: false });
    this.props.handleSportFilter(value);
  };

  render() {
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
      return (
        <button
          className={this.props.sportFilterValue === sportName ? "active" : ""}
          key={uniqid("", "-filterbutton")}
          onClick={() => this.setFilter(sportName)}
        >
          {sportName}
        </button>
      );
    });

    let filterIcon = SupportedSports.filter((sport) => {
      return sport.sportName === this.props.sportFilterValue;
    }).map(({ sportIcon }) => {
      return sportIcon;
    });

    if (filterIcon.length === 0) {
      filterIcon = "fa-solid fa-filter";
    } else {
      filterIcon = filterIcon[0];
    }

    return (
      <div className={styles.sportFilter}>
        <button onClick={this.toggleSportFilters} title="Filter by Sport">
          <i>
            <FontAwesomeIcon icon={filterIcon} />
          </i>
        </button>
        {this.state.showSportFilters && (
          <div className={styles.sportOptions}>
            <button
              className={styles.close}
              onClick={() => {
                this.setState({ showSportFilters: false });
                this.setFilter("");
              }}
            >
              <i>
                <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
              </i>
            </button>
            {nSportOptions}
          </div>
        )}
      </div>
    );
  }
}

export default SportFilter;
