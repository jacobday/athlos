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
import axios from "axios";
import Visualization from "./Visualization/Visualization";
import MyBookCard from "./MyBookCard/MyBookCard";
import Chat from "./Chat/Chat";
import { fetchFacilities } from "../../data/data";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Set default tab by user type
    let defaultTab = "Book";
    if (props.userType === "Customer" || props.userType === "Manager") {
      defaultTab = "Dashboard";
    } else if (props.userType === "Support") {
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

  getMyBookings() {
    var tempBookData = [];

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/book/userbookings",
      data: {
        email: this.props.userEmail,
      },
    }).then((res) => {
      if (res.status === 200 || res.status === 304) {
        let counter = 1;
        for (let temp of res.data) {
          const bookData = {
            id: counter,
            uniqBookingId: temp._id,
            gear: temp.gear,
            upgrade: temp.upgrade,
            intime: temp.intime,
            outtime: temp.outtime,
            facilityLocation: temp.facility_info.facilityLocation,
            latitude: temp.facility_info.latitude,
            longitude: temp.facility_info.longitude,
            facilitySport: temp.facility_info.facilitySports,
            facilityName: temp.facility_info.facilityName,
            facilityInfo: temp.facility_info.facilityInformation,
            totalAmount: temp.totalAmount,
          };
          counter = counter + 1;
          tempBookData.push(bookData);
        }
      }
      this.setState((prevState) => ({
        myBookData: tempBookData,
      }));
    });
  }

  getPromotions() {
    var tempPromoData = [];

    axios({
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/promotion/promos",
    }).then((res) => {
      if (res.status === 200 || res.status === 304) {
        for (let temp of res.data) {
          const promoData = {
            id: temp._id,
            promotionCode: temp.promotionCode,
            promotionEnd: temp.promotionEnd,
            promotionInfo: temp.promotionInfo,
            promotionName: temp.promotionName,
            promotionPercentage: temp.promotionPercentage,
            promotionStart: temp.promotionStart,
          };

          tempPromoData.push(promoData);
        }
      }
      this.setState((prevState) => ({
        promotionData: tempPromoData,
      }));
    });
  }

  render() {
    var i = 0;
    var animationDelay = 0;

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
          if (i >= 3) {
            animationDelay += 0.05;
            i = 0;
          }
          i += 1;

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
                animationDelay={animationDelay}
                reservationPeriodStart={reservationPeriodStart}
                reservationPeriodEnd={reservationPeriodEnd}
                isAuthenticated={this.props.isAuthenticated}
                onShowModal={this.props.onShowModal}
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                userEmail={this.props.userEmail}
                userType={this.props.userType}
                userRewardPoints={this.props.userRewardPoints}
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
          if (i >= 3) {
            animationDelay += 0.05;
            i = 0;
          }
          i += 1;

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
                animationDelay={animationDelay}
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
        if (i >= 3) {
          animationDelay += 0.05;
          i = 0;
        }
        i += 1;

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
              animationDelay={animationDelay}
              userType={this.props.userType}
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
        if (i >= 3) {
          animationDelay += 0.05;
          i = 0;
        }
        i += 1;

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
              userFirstName={this.props.userFirstName}
              userLastName={this.props.userLastName}
              userEmail={this.props.userEmail}
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
                {this.props.userType !== "Support" && (
                  <div className={styles.search}>
                    <Searchbar
                      userType={this.props.userType}
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
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                userType={this.props.userType}
                onShowModal={this.props.onShowModal}
                onLogout={this.props.onLogout}
                userRewardPoints={this.props.userRewardPoints}
              />
            </div>
          </div>
        </header>

        {/* Side Navigation Bar */}
        <Sidebar
          key={uniqid("", "-sidebar")}
          userType={this.props.userType}
          activeTab={this.state.activeTab}
          onClick={this.onClickTabItem}
        />

        {/* Tab Content */}
        <div className={styles.tabContainer}>
          {/* [Customer/Manager] Dashboard Content */}
          {this.state.activeTab === "Dashboard" && (
            <React.Fragment>
              {/* Data Visualization */}
              {(this.props.userType === "Manager" ||
                this.props.userType === "Customer") && (
                <section className={styles.dataVisualContainer}>
                  {this.props.userType === "Manager" && (
                    <Visualization
                      userType={this.props.userType}
                      userEmail={this.props.userEmail}
                    />
                  )}

                  {this.props.userType === "Customer" && (
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
              {this.props.userType === "Customer" && (
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
                  userType={this.props.userType}
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
                <Visualization
                  userType={this.props.userType}
                  userEmail={this.props.userEmail}
                />
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
                  userEmail={this.props.userEmail}
                  userFirstName={this.props.userFirstName}
                  userLastName={this.props.userLastName}
                  userRewardPoints={this.props.userRewardPoints}
                  userImage={this.props.userImage}
                />
                {/* Payment Shortcut */}
                <Shortcut
                  key={uniqid("", "-shortcut")}
                  shortcutTo="payments"
                  behavior={"showModal"}
                  title="Payments"
                  description="Update Payment"
                  userEmail={this.props.userEmail}
                  icon="fa-solid fa-credit-card"
                  iconClass="icon iconGreen"
                  onClick={this.onClickTabItem}
                  userImage={this.props.userImage}
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
                animationDelay={animationDelay}
                handleRefresh={this.handleRefresh}
              />
              {nEditCards && nEditCards}
              {nEditCards.length === 0 && (
                <ErrorCard
                  key={uniqid("", "-errorcard")}
                  userType={this.props.userType}
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
                animationDelay={animationDelay}
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
                animationDelay={animationDelay}
                handleRefresh={this.handleRefresh}
              />
              {nPromotionCards}
            </div>
          )}

          {/* Support Chat */}
          <Chat
            userFirstName={this.props.userFirstName}
            userLastName={this.props.userLastName}
            userType={this.props.userType}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
