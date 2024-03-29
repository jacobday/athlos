import React, { Component } from "react";
import styles from "./Dashboard.module.css";
import { BookCard, Sidebar, PromotionCard } from "..";
import NavProfile from "../NavProfile/NavProfile";
import Shortcut from "./Shortcut/Shortcut";
import EditCard from "./EditCard/EditCard";
import AddCard from "./AddCard/AddCard";
import Searchbar from "./Searchbar/Searchbar";
import ErrorCard from "./ErrorCard/ErrorCard";
import uniqid from "uniqid";
import Visualization from "./Visualization/Visualization";
import MyBookCard from "./MyBookCard/MyBookCard";
import Chat from "./Chat/Chat";
import { fetchFacilities, fetchMyBookings, fetchPromotions } from "../../data";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Set default tab by user type
    let defaultTab = "Book";
    if (props.user.type === "Customer" || props.user.type === "Manager") {
      defaultTab = "Dashboard";
    } else if (props.user.type === "Support") {
      defaultTab = "Chat Support";
    }

    this.state = {
      activeTab: defaultTab,
      searchValue: "",
      sportFilterValue: "",
      facilityData: [],
      myBookData: [],
      promotionData: [],
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  };

  onResetSearch = () => {
    this.setState({ searchValue: "", sportFilterValue: "" });
  };

  handleSearchValue = (value) => {
    this.setState({ searchValue: value });
  };

  handleSportFilter = (value) => {
    this.setState({ sportFilterValue: value });
  };

  handleRefresh = () => {
    this.getMyBookings();
    this.getFacilities();
    this.getPromotions();

    this.props.handleRefresh();
  };

  componentDidMount() {
    document.body.style.backgroundColor = "var(--color-tertiary)";

    this.getFacilities();
    this.getMyBookings();
    this.getPromotions();
  }

  async getFacilities() {
    const result = await fetchFacilities();
    this.setState({ facilityData: result });
  }

  async getMyBookings() {
    const result = await fetchMyBookings(this.props.user.email);
    this.setState({ myBookData: result });
  }

  async getPromotions() {
    const result = await fetchPromotions();
    this.setState({ promotionData: result });
  }

  render() {
    // [Guest/Customer/Employee] Generates n BookCard components from Database (filtered by facilityLocation & facilityName)
    const nBookCards = this.state.facilityData
      .filter((facility) => {
        return (
          (facility.facilityLocation
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase()) ||
            facility.facilityName
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())) &&
          facility.facilitySport
            .toLowerCase()
            .includes(this.state.sportFilterValue.toLowerCase())
        );
      })
      .map(
        ({
          id,
          uniqFacId,
          facilityName,
          facilityLocation,
          facilitySport,
          facilityInfo,
          availableNow,
          reservationPeriodStart,
          reservationPeriodEnd,
        }) => {
          return (
            <React.Fragment>
              <BookCard
                key={uniqid(id, "-bookcard")}
                facilityID={uniqFacId}
                uniqFacId={uniqFacId}
                facilityName={facilityName}
                facilityLocation={facilityLocation}
                facilitySport={facilitySport}
                facilityInfo={facilityInfo}
                availableNow={availableNow}
                reservationPeriodStart={reservationPeriodStart}
                reservationPeriodEnd={reservationPeriodEnd}
                isAuthenticated={this.props.isAuthenticated}
                onShowModal={this.props.onShowModal}
                user={this.props.user}
                handleRefresh={this.handleRefresh}
              />
            </React.Fragment>
          );
        }
      );

    // [Manager] Generates n EditCard components from Database (filtered by facilityLocation & facilityName)
    const nEditCards = this.state.facilityData
      .filter((facility) => {
        return (
          (facility.facilityLocation
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase()) ||
            facility.facilityName
              .toLowerCase()
              .includes(this.state.searchValue.toLowerCase())) &&
          facility.facilitySport
            .toLowerCase()
            .includes(this.state.sportFilterValue.toLowerCase())
        );
      })
      .map(
        ({
          id,
          uniqFacId,
          facilityName,
          facilityLocation,
          facilitySport,
          facilityInfo,
          availableNow,
          reservationPeriodStart,
          reservationPeriodEnd,
        }) => {
          return (
            <React.Fragment>
              <EditCard
                key={uniqid(id, "-editcard")}
                facilityID={id}
                uniqFacId={uniqFacId}
                facilityName={facilityName}
                facilityLocation={facilityLocation}
                facilitySport={facilitySport}
                facilityInfo={facilityInfo}
                availableNow={availableNow}
                reservationPeriodStart={reservationPeriodStart}
                reservationPeriodEnd={reservationPeriodEnd}
                isAuthenticated={this.props.isAuthenticated}
                onShowModal={this.props.onShowModal}
                handleRefresh={this.handleRefresh}
              />
            </React.Fragment>
          );
        }
      );

    // [Customer] Generates n PromotionCard components from Database
    const nPromotionCards = this.state.promotionData.map(
      ({
        id,
        promotionName,
        promotionCode,
        promotionStart,
        promotionEnd,
        promotionPercentage,
        promotionInfo,
      }) => {
        return (
          <React.Fragment>
            <PromotionCard
              key={uniqid(id, "-promotioncard")}
              promotionID={id}
              promotionName={promotionName}
              promotionCode={promotionCode}
              promotionStart={promotionStart}
              promotionEnd={promotionEnd}
              promotionPercentage={promotionPercentage}
              promotionInfo={promotionInfo}
              user={this.props.user}
              handleRefresh={this.handleRefresh}
            />
          </React.Fragment>
        );
      }
    );

    // [Customer] Generates n MyBookCards components from Database
    const nMyBookCards = this.state.myBookData.map(
      ({
        id,
        uniqBookingId,
        gear,
        upgrade,
        intime,
        outtime,
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        totalAmount,
        latitude,
        longitude,
      }) => {
        return (
          <React.Fragment>
            <MyBookCard
              key={uniqid("", "-mybookcard")}
              facilityID={id}
              uniqBookingId={uniqBookingId}
              gear={gear}
              upgrade={upgrade}
              intime={intime}
              outtime={outtime}
              facilityName={facilityName}
              facilityLocation={facilityLocation}
              facilitySport={facilitySport}
              facilityInfo={facilityInfo}
              totalAmount={totalAmount}
              latitude={latitude}
              longitude={longitude}
              handleRefresh={this.handleRefresh}
            />
          </React.Fragment>
        );
      }
    );

    return (
      <React.Fragment>
        {/* Top Navigation Bar */}
        <header className={styles.topnav}>
          <div className={styles.container}>
            <div className={styles.navigation}>
              {/* Navigation: Search Bar [Middle] */}
              <div className={styles.menu}>
                {this.props.user.type !== "Support" && (
                  <div className={styles.search}>
                    <Searchbar
                      user={this.props.user}
                      onClickTabItem={this.onClickTabItem}
                      onResetSearch={this.onResetSearch}
                      handleSearchValue={this.handleSearchValue}
                      handleSportFilter={this.handleSportFilter}
                      sportFilterValue={this.state.sportFilterValue}
                      facilityData={this.state.facilityData}
                    />
                  </div>
                )}
              </div>

              {/* Navigation: User Login/Sign Up Buttons [Right] */}
              <NavProfile
                key={uniqid("", "-navprofile")}
                isAuthenticated={this.props.isAuthenticated}
                user={this.props.user}
                onShowModal={this.props.onShowModal}
                onLogout={this.props.onLogout}
              />
            </div>
          </div>
        </header>

        {/* Side Navigation Bar */}
        <Sidebar
          key={uniqid("", "-sidebar")}
          user={this.props.user}
          activeTab={this.state.activeTab}
          onClick={this.onClickTabItem}
        />

        {/* Tab Content */}
        <div className={styles.tabContainer}>
          {/* [Customer/Manager] Dashboard Content */}
          {this.state.activeTab === "Dashboard" && (
            <React.Fragment>
              {/* Data Visualization */}
              {(this.props.user.type === "Manager" ||
                this.props.user.type === "Customer") && (
                <section className={styles.dataVisualContainer}>
                  {this.props.user.type === "Manager" && (
                    <Visualization user={this.props.user} />
                  )}

                  {this.props.user.type === "Customer" && (
                    <section className={styles.promoContainer}>
                      <img
                        className={styles.promoImage}
                        src="images/shoes.jpg"
                        alt=""
                      />
                    </section>
                  )}
                </section>
              )}

              {/* [Customer] Shortcuts */}
              {this.props.user.type === "Customer" && (
                <div className={styles.shortcutContainer}>
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="Book"
                    behavior={"switchTab"}
                    title="Book"
                    description="Book A Facility"
                    icon="fa-solid fa-bookmark"
                    iconClass="icon iconBlue"
                    onClick={this.onClickTabItem}
                  />
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="My Bookings"
                    behavior={"switchTab"}
                    title="Bookings"
                    description="My Bookings"
                    icon="fa-solid fa-layer-group"
                    iconClass="icon iconPurple"
                    onClick={this.onClickTabItem}
                  />
                  <Shortcut
                    key={uniqid("", "-shortcut")}
                    shortcutTo="Notifications"
                    behavior={"switchTab"}
                    title="Notifications"
                    description="My Notifications"
                    icon="fa-solid fa-bell"
                    iconClass="icon iconOrange"
                    onClick={this.onClickTabItem}
                  />
                </div>
              )}
            </React.Fragment>
          )}
          {/* [Guest/Customer/Employee] Book Content */}
          {this.state.activeTab === "Book" && (
            <div className={styles.bookContainer}>
              {nBookCards && nBookCards}
              {nBookCards.length === 0 && (
                <ErrorCard
                  key={uniqid("", "-errorcard")}
                  onClickTabItem={this.onClickTabItem}
                  handleRefresh={this.handleRefresh}
                />
              )}
            </div>
          )}

          {/* [Guest] My Bookings Content */}
          {this.state.activeTab === "My Bookings" && (
            <div className={styles.bookContainer}>{nMyBookCards}</div>
          )}

          {/* [Customer] Notifications */}
          {this.state.activeTab === "Notifications" && (
            <div className={styles.bookContainer}>{nPromotionCards}</div>
          )}

          {/* [Customer] Account */}
          {this.state.activeTab === "Account" && (
            <React.Fragment>
              <section className={styles.settingsImageContainer}>
                <Visualization user={this.props.user} />
              </section>
              {/* Interest Shortcut */}
              <div className={styles.shortcutContainer}>
                <Shortcut
                  key={uniqid("", "-shortcut")}
                  shortcutTo="interests"
                  behavior={"showModal"}
                  title="Profile"
                  description="View Profile"
                  icon="fa-solid fa-user"
                  iconClass="icon iconOrange"
                  onClick={this.onClickTabItem}
                  user={this.props.user}
                />
                {/* Payment Shortcut */}
                <Shortcut
                  key={uniqid("", "-shortcut")}
                  shortcutTo="payments"
                  behavior={"showModal"}
                  title="Payments"
                  description="Update Payment"
                  user={this.props.user}
                  icon="fa-solid fa-credit-card"
                  iconClass="icon iconGreen"
                  onClick={this.onClickTabItem}
                />
              </div>
            </React.Fragment>
          )}

          {/* [Manager] Edit Bookings */}
          {this.state.activeTab === "Edit Facilities" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"facility"}
                handleRefresh={this.handleRefresh}
              />
              {nEditCards && nEditCards}
              {nEditCards.length === 0 && (
                <ErrorCard
                  key={uniqid("", "-errorcard")}
                  onClickTabItem={this.onClickTabItem}
                />
              )}
            </div>
          )}

          {/* [Manager] Edit Equipment */}
          {this.state.activeTab === "Edit Equipment" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"equipment"}
                handleRefresh={this.handleRefresh}
              />
            </div>
          )}

          {/* [Manager] Edit Promotions */}
          {this.state.activeTab === "Edit Promotions" && (
            <div className={styles.bookContainer}>
              <AddCard
                key={uniqid("", "-addcard")}
                type={"promotion"}
                handleRefresh={this.handleRefresh}
              />
              {nPromotionCards}
            </div>
          )}

          {/* Support Chat */}
          {/* <Chat
            user={this.props.user}
          /> */}
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
