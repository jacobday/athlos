import React, { Component } from "react";
import styles from "./Searchbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import uniqid from "uniqid";
import SportFilter from "./SportFilter/SportFilter";
import Dictaphone from "./Dictaphone/Dictaphone";

class Searchbar extends Component {
  state = {
    showOptions: false,
    searchValue: "",
  };

  // Open "Book" tab when user types in search bar
  onSearchChange = (e) => {
    let searchValue = e.target.value;

    if (this.props.userType === "Manager") {
      this.props.onClickTabItem("Edit Facilities");
    } else {
      this.props.onClickTabItem("Book");
    }

    this.props.handleSearchValue(searchValue);
    this.setState({ searchValue: searchValue });
  };

  setSearchValue = (value) => {
    if (this.props.userType === "Manager") {
      this.props.onClickTabItem("Edit Facilities");
    } else {
      this.props.onClickTabItem("Book");
    }

    this.props.handleSearchValue(value);
    this.setState({ searchValue: value, showOptions: false });
  };

  onResetSearch = () => {
    this.setState({ showOptions: false, searchValue: "" });
    this.props.onResetSearch();
  };

  render() {
    // Location Autocomplete Buttons
    const nOptions = [
      // Get Unique Locations
      ...new Set(
        this.props.facilityData.map(({ facilityLocation }) => {
          return facilityLocation;
        })
      ),
    ]
      // Filter Locations by searchValue
      .filter((uniqueLocation) =>
        uniqueLocation
          .toLowerCase()
          .includes(this.state.searchValue.toLowerCase())
      )
      // Map Locations to Buttons
      .map((facilityLocation) => {
        return (
          <button
            key={uniqid("", "-searchoption")}
            onClick={() => this.setSearchValue(facilityLocation)}
            className={styles.listOptions}
          >
            {facilityLocation}
          </button>
        );
      });

    return (
      <React.Fragment>
        <div className={styles.search}>
          <div>
            <input
              value={this.state.searchValue}
              onFocus={() => this.setState({ showOptions: true })}
              id="searchBar"
              type="search"
              placeholder="Search Bookings..."
              onChange={(e) => this.onSearchChange(e)}
            />
            <button
              className={styles.clear}
              onClick={this.onResetSearch}
              title="Reset Search"
            >
              <FontAwesomeIcon icon={"fa-solid fa-circle-xmark"} />
            </button>
            <div className={styles.voiceSearch}>
              <Dictaphone setSearchValue={this.setSearchValue} />
            </div>
          </div>

          {/* Autocomplete Options */}
          {this.state.showOptions && (
            <main className={styles.searchDropdown}>
              <section className={styles.searchOptions}>{nOptions}</section>
              <section className={styles.filterOptions}>
                <SportFilter
                  key={uniqid("", "-sportfilter")}
                  handleSportFilter={this.props.handleSportFilter}
                  sportFilterValue={this.props.sportFilterValue}
                />
              </section>
            </main>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Searchbar;
