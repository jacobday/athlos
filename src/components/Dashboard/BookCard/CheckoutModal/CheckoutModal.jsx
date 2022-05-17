import React, { Component } from "react";
import InputMask from "react-input-mask";
import styles from "./CheckoutModal.module.css";
import "./CheckoutModal.css";
import TimeSlot from "./TimeSlot/TimeSlot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberFormat from "react-number-format";
import Counters from "./Counters/Counters";
import { ExtrasData, GearData, TestPromotionData } from "../../../../data";
import uniqid from "uniqid";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const {
  REACT_APP_LOCAL_URL,
  REACT_APP_PRODUCTION_URL,
  REACT_APP_PAYPAL_CLIENT_ID,
} = process.env;

let startSection = 1;
let userRewardPoints = localStorage.getItem("rewardPoints");

class CheckoutModal extends Component {
  constructor(props) {
    super(props);

    if (this.props.userType === "Employee" || this.props.userType === "Guest") {
      startSection = 0;
    }

    this.state = {
      // Facility Data
      facilityID: this.props.facilityID,
      uniqFacId: this.props.uniqFacId,
      facilityName: this.props.facilityName,
      facilityLocation: this.props.facilityLocation,
      facilitySport: this.props.facilitySport,

      // Reservation Data
      reservedSlot: null,
      reservedGear: [],
      reservedExtras: [],
      reservationSubtotal: 0,
      reservationDiscount: null,
      reservationTax: 0,
      reservationTotal: 0,
      taxRate: 0.07,
      promotionCode: "",
      promotionPercentage: null,
      promotionName: "",
      redeemedPoints: null,

      reservationFirstName: this.props.userFirstName,
      reservationLastName: this.props.userLastName,
      reservationEmail: this.props.userEmail,
      isEmailValid: false,

      // Checkout Modal Properties
      sectionNumber: startSection,
      gearCounters: GearData,
      extrasCounters: ExtrasData,
      isPromotionValid: false,
      isGearSelected: false,
      isExtrasSelected: false,
      isPaid: true,
      isUsingCredit: false,

      // Reserved Data
      reservedSlots: {},
      reservedFacilities: [],
    };

    if (this.props.userType === "Employee" || this.props.userType === "Guest") {
      this.state.reservationFirstName = null;
      this.state.reservationLastName = null;
      this.state.reservationEmail = null;
    }
  }

  onPay = () => {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }
    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/book/add",
      data: {
        facilityID: this.state.uniqFacId,
        firstName: this.state.reservationFirstName,
        lastName: this.state.reservationLastName,
        email: this.state.reservationEmail,
        gear: this.state.reservedGear,
        intime: this.state.reservedSlot,
        outtime: this.state.reservedSlot + 1,
        upgrade: this.state.reservedExtras,
        totalAmount: this.state.reservationTotal,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Booked Successfully");

          // Calculate points (points equivalent to 2% back)
          localStorage.setItem(
            "rewardPoints",
            parseInt(userRewardPoints) -
              this.state.redeemedPoints +
              parseInt(this.state.reservationTotal * 0.2)
          );

          this.props.handleRefresh();
          this.props.onCloseModal();
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't Book");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });
  };

  onPayCredit = (e) => {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      data: {
        userEmail: this.state.reservationEmail,
        cardHolderName: e.target.cardholder.value,
        cardNumber: e.target.number.value,
        cardExpiry: e.target.exp.value,
        cvv: e.target.csc.value,
        billingLocation: {
          streetAddress: e.target.streetAddress.value,
          streetAddress2: e.target.aptAddress.value,
          country: e.target.country.value,
          city: e.target.city.value,
          state: e.target.state.value,
          zipcode: e.target.zip.value,
        },
        promotionUsed: e.target.promo.value,
        rewardPointsUsed: e.target.rewards.value,
      },
      url: api_url + "/payment/add",
    })
      .then((res) => {
        if (res.status === 409 || res.status === 200) {
          this.props.handleRefresh();
          this.onPay();
          this.props.onCloseModal();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    e.preventDefault();
    // Prevent page refresh
  };

  setPageNumber(page) {
    this.setState({ sectionNumber: page });
  }

  nextPage() {
    this.setPageNumber(this.state.sectionNumber + 1);
  }

  setReservedSlot = (slot) => {
    this.setState({ reservedSlot: slot });
  };

  setReservedGear = () => {
    var reservedGear = [...this.state.reservedGear];
    reservedGear = this.state.gearCounters.filter((c) => c.value > 0);
    this.setState({ reservedGear, isGearSelected: true });
  };

  getReservedGearCount = () => {
    let count = 0;

    for (let index = 0; index < this.state.reservedGear.length; index++) {
      const element = this.state.reservedGear[index];
      count += element.value;
    }
    return count;
  };

  setReservedExtras = () => {
    var reservedExtras = [...this.state.reservedExtras];
    reservedExtras = this.state.extrasCounters.filter((c) => c.value > 0);
    this.setState({ reservedExtras, isExtrasSelected: true });
  };

  getReservedExtrasCount = () => {
    let count = 0;

    for (let index = 0; index < this.state.reservedExtras.length; index++) {
      const element = this.state.reservedExtras[index];
      count += element.value;
    }
    return count;
  };

  incrementGearValue = (counter) => {
    const gearCounters = [...this.state.gearCounters];
    const index = gearCounters.indexOf(counter);

    gearCounters[index] = { ...counter };
    if (gearCounters[index].value < gearCounters[index].maxItems) {
      gearCounters[index].value++;
      this.updateCosts(gearCounters[index].itemPrice);
    }
    this.setState({ gearCounters });
  };

  incrementExtrasValue = (counter) => {
    const extrasCounters = [...this.state.extrasCounters];
    const index = extrasCounters.indexOf(counter);

    extrasCounters[index] = { ...counter };
    if (extrasCounters[index].value < extrasCounters[index].maxItems) {
      extrasCounters[index].value++;
      this.updateCosts(extrasCounters[index].itemPrice);
    }
    this.setState({ extrasCounters });
  };

  decrementGearValue = (counter) => {
    const gearCounters = [...this.state.gearCounters];
    const index = gearCounters.indexOf(counter);

    gearCounters[index] = { ...counter };
    if (gearCounters[index].value > 0) {
      gearCounters[index].value--;
      this.updateCosts(-gearCounters[index].itemPrice);
    }
    this.setState({ gearCounters });
  };

  decrementExtrasValue = (counter) => {
    const extrasCounters = [...this.state.extrasCounters];
    const index = extrasCounters.indexOf(counter);

    extrasCounters[index] = { ...counter };
    if (extrasCounters[index].value > 0) {
      extrasCounters[index].value--;
      this.updateCosts(-extrasCounters[index].itemPrice);
    }
    this.setState({ extrasCounters });
  };

  setStateValue = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "reservationEmail") {
      if (targetValue.trim() === "") {
        this.setState({ isEmailValid: false });
      } else if (this.isEmail(targetValue.trim())) {
        this.setState({ isEmailValid: false });
      } else {
        this.setState({ isEmailValid: true });
      }
    }

    this.setState({ [targetName]: targetValue });
  };

  isEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePromotion = (code) => {
    const codeInput = code.target;
    let codeValue = code.target.value;

    // Promotion objects that match exact codeValue
    let matchObj = TestPromotionData.filter(function (el) {
      return el.promotionCode.toLowerCase() === codeValue.toLowerCase();
    });

    if (codeValue.length > 0) {
      if (matchObj.length > 0) {
        let promotionPercentage = matchObj[0].promotionPercentage;

        this.setState(
          {
            isPromotionValid: true,
            promotionPercentage: promotionPercentage,
            promotionName: matchObj[0].promotionName,
          },
          () => {
            this.updateCosts(0);
          }
        );

        // Correct Code Styling
        codeInput.style.boxShadow = "0 0 8px rgba(0, 255, 0, 0.7)";
        codeInput.style.border = "1px solid green";
        codeInput.style.color = "green";
      } else {
        this.setState(
          { isPromotionValid: false, promotionPercentage: null },
          () => {
            this.updateCosts(0);
          }
        );

        // Incorrect Code Styling
        codeInput.style.boxShadow = "0 0 8px rgba(255, 0, 0, 0.7)";
        codeInput.style.border = "1px solid red";
        codeInput.style.color = "red";
      }
    } else {
      this.setState(
        { isPromotionValid: false, promotionPercentage: null },
        () => {
          this.updateCosts(0);
        }
      );

      // Default Styling
      codeInput.style.boxShadow = "unset";
      codeInput.style.border = "1px solid var(--color-gray)";
      codeInput.style.color = "black";
    }

    this.setState({ promotionCode: codeValue }, () => {
      this.updateCosts(0);
    });
  };

  validatePoints = (points) => {
    const pointInput = points.target;
    let pointValue = points.target.value;

    if (pointValue.length > 0) {
      pointValue = parseInt(pointValue);

      if (!isNaN(pointValue)) {
        if (pointValue < 0 || pointValue > userRewardPoints) {
          // Invalid Styling
          pointInput.style.boxShadow = "0 0 8px rgba(255, 0, 0, 0.7)";
          pointInput.style.border = "1px solid red";
          pointInput.style.color = "red";

          return;
        }
      } else {
        return;
      }
    }

    // Default Styling
    pointInput.style.boxShadow = "unset";
    pointInput.style.border = "1px solid var(--color-gray)";
    pointInput.style.color = "black";

    this.setState({ redeemedPoints: pointValue }, () => {
      this.updateCosts(0);
    });
  };

  updateCosts = (change) => {
    var reservationSubtotal = this.state.reservationSubtotal;
    var reservationTax;
    var reservationTotal;
    var reservationDiscount = 0;
    var rewardPointDiscount = 0;

    // Calculate Subtotal
    reservationSubtotal += change;

    // Calculate Discount
    if (this.state.promotionPercentage) {
      reservationDiscount =
        reservationSubtotal * this.state.promotionPercentage;

      this.setState({ reservationDiscount });
    } else {
      this.setState({ reservationDiscount: null });
    }

    // Calculate Redeemed Points
    if (this.state.redeemedPoints) {
      rewardPointDiscount = this.state.redeemedPoints * 0.1; // 1 reward point = 10 cents
    }

    // Calculate Tax & Total
    reservationTax = parseFloat(
      (
        (reservationSubtotal - (reservationDiscount + rewardPointDiscount)) *
        this.state.taxRate
      ).toFixed(2)
    );
    reservationTotal = parseFloat(
      (
        reservationSubtotal -
        (reservationDiscount + rewardPointDiscount) +
        reservationTax
      ).toFixed(2)
    );

    if (reservationTotal < 0) {
      reservationTotal = 0;
      reservationTax = 0;
    }

    this.setState({
      reservationSubtotal,
      reservationTax,
      reservationTotal,
    });
  };

  // Summary Details Scroll Shadow
  createScrollShadow() {
    const summaryDetails = this.refDetails;
    const content = this.refContent;
    const shadowTop = this.refShadowTop;
    const shadowBottom = this.refShadowBottom;

    // Only show shadow if content is scrollable
    if (content.scrollHeight > summaryDetails.clientHeight) {
      shadowTop.style.display = "block";
      shadowBottom.style.display = "block";
      let contentScrollHeight =
        content.scrollHeight - summaryDetails.offsetHeight;

      content.addEventListener("scroll", function () {
        var currentScroll = this.scrollTop / contentScrollHeight;
        shadowTop.style.opacity = currentScroll;
        shadowBottom.style.opacity = 1 - currentScroll;
      });
    }
  }

  getReservedSlots() {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    axios({
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/book/booked_slots",
    })
      .then((res) => {
        var reservedSlots = {};

        if (res.status === 200 || res.status === 304) {
          for (let temp of res.data) {
            if (reservedSlots[temp.facilityID] === undefined) {
              reservedSlots[temp.facilityID] = [temp.intime];
            } else {
              reservedSlots[temp.facilityID].push(temp.intime);
            }
          }
        }

        this.setState({ reservedSlots });
        // this.setState((prevState) => ({
        //   selectedInterests: interest,
        // }));
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("Couldn't retrieve reserved slots");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });
  }

  componentDidUpdate() {
    if (this.state.sectionNumber === 4) {
      this.createScrollShadow();
    }
  }

  componentDidMount() {
    this.getReservedSlots();
  }

  render() {
    userRewardPoints = localStorage.getItem("rewardPoints"); // tmp

    const {
      props: {
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        reservationPeriodStart,
        reservationPeriodEnd,
      },
    } = this;

    let sportImage =
      "images/" +
      facilitySport.toString().toLowerCase().replace(/ /g, "") +
      ".jpg";

    var nTimeSlots = [];
    var reservationSlotStart = reservationPeriodStart;
    var reservationSlotEnd;
    var key = 0;
    for (
      let index = 0;
      index < reservationPeriodEnd - reservationPeriodStart;
      index++
    ) {
      reservationSlotEnd = reservationSlotStart + 1;

      nTimeSlots.push(
        <TimeSlot
          key={uniqid(key, "-timeslot")}
          reservationID={reservationSlotStart}
          reservationSlotStart={reservationSlotStart}
          reservationSlotEnd={reservationSlotEnd}
          setReservedSlot={this.setReservedSlot}
          reservedSlot={this.state.reservedSlot}
          disabled={
            this.props.facilityID in this.state.reservedSlots &&
            this.state.reservedSlots[this.props.facilityID].includes(
              reservationSlotStart
            )
          }
        />
      );
      reservationSlotStart++;
    }

    // List of Selected Gear & Extras
    const combinedOptions = this.state.reservedGear.concat(
      this.state.reservedExtras
    );
    const optionsList = combinedOptions.map(
      ({ itemName, value, itemPrice }) => {
        return (
          <React.Fragment>
            <div key={uniqid("", "-optionslist")}>
              <div className={styles.itemName}>{itemName}</div>
              <div className={styles.itemCount}>x{value}</div>
              <div className={styles.itemsTotal}>
                <NumberFormat
                  prefix="$"
                  value={(itemPrice * value).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </div>
            </div>
          </React.Fragment>
        );
      }
    );

    return (
      <React.Fragment>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.navigation}>
              <button
                className={styles.close}
                onClick={this.props.onCloseModal}
                title="Close"
              >
                &times;
              </button>
              {/* Status Bar */}
              <nav className={styles.statusBar}>
                {/* Status Bar: Time Selection */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.reservedSlot ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(1)}
                  disabled={this.state.sectionNumber === 0}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-clock" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>
                      {this.state.reservedSlot
                        ? this.state.reservedSlot +
                          ":00 - " +
                          (this.state.reservedSlot + 1) +
                          ":00"
                        : "-"}
                    </div>
                    <div className={styles.sectionTitle}>Time Slot</div>
                  </div>
                </button>
                {/* Status Bar: Gear Selection */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.isGearSelected ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(2)}
                  disabled={this.state.reservedSlot === null}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-baseball-bat-ball" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>
                      {this.state.isGearSelected
                        ? this.state.reservedGear.length > 0
                          ? this.getReservedGearCount()
                          : "None"
                        : "-"}
                    </div>
                    <div className={styles.sectionTitle}>Gear</div>
                  </div>
                </button>
                {/* Status Bar: Extras Selection */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.isExtrasSelected ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(3)}
                  disabled={!this.state.isGearSelected}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>
                      {this.state.isExtrasSelected
                        ? this.state.reservedExtras.length > 0
                          ? this.getReservedExtrasCount()
                          : "None"
                        : "-"}
                    </div>
                    <div className={styles.sectionTitle}>Extras</div>
                  </div>
                </button>
                {/* Status Bar: Sub Total */}
                <button
                  className={[styles.statusSection, styles.subTotal].join(" ")}
                  onClick={() => {
                    this.setPageNumber(4);
                    this.setReservedGear();
                    this.setReservedExtras();
                  }}
                  disabled={!this.state.isExtrasSelected}
                >
                  <div className={styles.sectionTitle}>
                    <div>
                      <NumberFormat
                        prefix="$"
                        value={this.state.reservationSubtotal.toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                    <span>sub total</span>
                  </div>
                </button>
                <div className={styles.statusIndicator}></div>
              </nav>
            </div>

            {/* [Employee] Section 0: Guest Information */}
            {this.state.sectionNumber === 0 && (
              <React.Fragment>
                <section className={styles.container}>
                  <div className={styles.title}>Guest Information</div>
                  <div className={styles.onsiteForm}>
                    <div>
                      <label htmlFor="reservationFirstName">First Name</label>
                      <input
                        type="text"
                        name="reservationFirstName"
                        value={this.state.reservationFirstName}
                        onChange={(e) => this.setStateValue(e)}
                      />
                    </div>
                    <div>
                      <label htmlFor="reservationLastName">Last Name</label>
                      <input
                        type="text"
                        name="reservationLastName"
                        value={this.state.reservationLastName}
                        onChange={(e) => this.setStateValue(e)}
                      />
                    </div>
                    <div>
                      <label htmlFor="reservationLastName">Email</label>
                      <input
                        type="text"
                        name="reservationEmail"
                        value={this.state.reservationEmail}
                        onChange={(e) => this.setStateValue(e)}
                      />
                      {this.state.isEmailValid && (
                        <div className={styles.error}>Enter a valid email.</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      className={[styles.button, styles.buttonPrimary].join(
                        " "
                      )}
                      onClick={() => this.nextPage()}
                      disabled={
                        !(
                          this.state.reservationFirstName &&
                          this.state.reservationLastName &&
                          this.state.reservationEmail &&
                          !this.state.isEmailValid
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                </section>
              </React.Fragment>
            )}

            {/* Section 1: Select Time Slot */}
            {this.state.sectionNumber === 1 && (
              <React.Fragment>
                <section className={styles.container}>
                  <div className={styles.title}>Select A Time Slot</div>

                  <div className={styles.timeSlotContainer}>{nTimeSlots}</div>
                  <div>
                    <button
                      className={[styles.button, styles.buttonPrimary].join(
                        " "
                      )}
                      onClick={() => this.nextPage()}
                      disabled={this.state.reservedSlot === null}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </React.Fragment>
            )}

            {/* Section 2: Select Gear */}
            {this.state.sectionNumber === 2 && (
              <React.Fragment>
                <section className={styles.container}>
                  <div className={styles.title}>Choose Your Gear</div>

                  <div className={styles.gearContainer}>
                    <Counters
                      counters={this.state.gearCounters.filter(
                        (c) => c.sportType === facilitySport
                      )}
                      onIncrement={this.incrementGearValue}
                      onDecrement={this.decrementGearValue}
                    />
                  </div>
                  <div>
                    <button
                      className={[styles.button, styles.buttonPrimary].join(
                        " "
                      )}
                      onClick={() => {
                        this.nextPage();
                        this.setReservedGear();
                      }}
                      disabled={this.state.reservedSlot === null}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </React.Fragment>
            )}

            {/* Section 3: Select Extras  */}
            {this.state.sectionNumber === 3 && (
              <React.Fragment>
                <section className={styles.container}>
                  <div className={styles.title}>Upgrade Your Reservation</div>

                  <div className={styles.gearContainer}>
                    <Counters
                      counters={this.state.extrasCounters}
                      onIncrement={this.incrementExtrasValue}
                      onDecrement={this.decrementExtrasValue}
                    />
                  </div>
                  <div>
                    <button
                      className={[styles.button, styles.buttonPrimary].join(
                        " "
                      )}
                      onClick={() => {
                        this.nextPage();
                        this.setReservedGear();
                        this.setReservedExtras();
                      }}
                      disabled={this.state.reservedSlot === null}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </React.Fragment>
            )}

            {/* Section 4: Checkout */}
            {this.state.sectionNumber === 4 && (
              <React.Fragment>
                <section className={styles.container}>
                  <main className={styles.checkout}>
                    {/* Checkout Payment Information */}
                    <aside className={styles.payment}>
                      <div className={styles.title}>
                        {this.props.userType !== "Employee" && (
                          <React.Fragment>
                            Enter your payment details
                          </React.Fragment>
                        )}
                        {this.props.userType === "Employee" && (
                          <React.Fragment>Guest Payment Method</React.Fragment>
                        )}
                      </div>
                      <form onSubmit={(e) => this.onPayCredit(e)}>
                        {this.props.userType !== "Employee" && (
                          <React.Fragment>
                            <input
                              id="name"
                              type="text"
                              name="cardholder"
                              placeholder="Card Holder Name"
                              autoComplete={"cc-name"}
                            />
                            <InputMask
                              id="cardnumber"
                              name="number"
                              mask={"9999 9999 9999 9999"}
                              type={"text"}
                              placeholder="Card Number"
                              autoComplete={"cc-number"}
                            ></InputMask>
                            <div>
                              <InputMask
                                id="expirationdate"
                                name="exp"
                                mask={"99/99"}
                                type={"text"}
                                placeholder="MM/YY"
                                autoComplete={"cc-exp"}
                              ></InputMask>
                              <InputMask
                                id="securitycode"
                                name="csc"
                                mask={"999"}
                                type={"text"}
                                placeholder="CVV"
                                autoComplete={"cc-csc"}
                              ></InputMask>
                            </div>
                            <input
                              type="text"
                              id="streetAddress"
                              name="streetAddress"
                              placeholder="Street Address"
                              autoComplete={"street-address"}
                            />
                            <input
                              type="text"
                              id="aptAddress"
                              name="aptAddress"
                              placeholder="Apt, unit, suite, etc. (optional)"
                              autoComplete={"address-line2"}
                            />
                            <select
                              name="country"
                              id="country"
                              autoComplete={"country"}
                            >
                              <option value="-">-</option>
                              <option value="United States">
                                United States
                              </option>
                            </select>
                            <div>
                              <input
                                type="text"
                                id="city"
                                name="city"
                                placeholder="City"
                                autoComplete={"address-level2"}
                              />
                              <select
                                name="state"
                                id="state"
                                autoComplete={"address-level1"}
                              >
                                <option value="-">-</option>
                                <option value="IN">IN</option>
                              </select>
                              <input
                                type="text"
                                id="zip"
                                name="zip"
                                placeholder="Zip Code"
                                autoComplete={"postal-code"}
                              />
                            </div>
                          </React.Fragment>
                        )}

                        <div className={styles.discounts}>
                          {/* Reward Points */}
                          {this.props.userType !== "Employee" &&
                            this.props.userType !== "Guest" && (
                              <React.Fragment>
                                {/* Promotion Code */}
                                <section>
                                  <label htmlFor="promo">Promotion Code</label>
                                  <input
                                    type="text"
                                    id="promo"
                                    name="promo"
                                    value={this.state.promotionCode}
                                    onChange={this.validatePromotion}
                                  />
                                </section>
                                <section>
                                  <label htmlFor="rewards">
                                    Reward Points -{" "}
                                    {userRewardPoints -
                                      this.state.redeemedPoints}{" "}
                                    remaining
                                  </label>
                                  <input
                                    type="number"
                                    id="rewards"
                                    name="rewards"
                                    value={this.state.redeemedPoints}
                                    onChange={this.validatePoints}
                                    min={0}
                                    max={userRewardPoints}
                                  />
                                </section>
                              </React.Fragment>
                            )}
                          {/* [Employee] Cash Option */}
                          {this.props.userType === "Employee" && (
                            <section className={styles.cash}>
                              <input type="checkbox" />
                              <div>Paid in cash</div>
                            </section>
                          )}
                        </div>
                        <button className={styles.button} type={"submit"}>
                          Pay with credit
                        </button>
                      </form>
                    </aside>
                    {/* Checkout Summary */}
                    <aside className={styles.summary}>
                      {/* Summary Title */}
                      <div className={styles.title}>Summary</div>
                      {/* Summary Image */}
                      <div className={styles.image}>
                        <img src={sportImage} alt={facilitySport} />
                      </div>
                      {/* Summary Details */}
                      <div
                        className={styles.summaryDetails}
                        ref={(refDetails) => {
                          this.refDetails = refDetails;
                        }}
                      >
                        <div
                          className={styles.summaryContent}
                          ref={(refContent) => {
                            this.refContent = refContent;
                          }}
                        >
                          <div
                            className={styles.shadowTop}
                            ref={(refShadowTop) => {
                              this.refShadowTop = refShadowTop;
                            }}
                          ></div>
                          <div
                            className={styles.shadowBottom}
                            ref={(refShadowBottom) => {
                              this.refShadowBottom = refShadowBottom;
                            }}
                          ></div>
                          {/* Facility Name */}
                          <div className={styles.name}>{facilityName}</div>
                          {/* Facility Location */}
                          <div className={styles.location}>
                            <i>
                              <FontAwesomeIcon icon="fa-solid fa-location-arrow" />
                            </i>
                            {facilityLocation}
                          </div>
                          {/* Facility Description */}
                          <div className={styles.description}>
                            <i>
                              <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                            </i>
                            {facilityInfo}
                          </div>
                          {/* Reserved Gear & Extras */}
                          {(this.state.reservedGear.length > 0 ||
                            this.state.reservedExtras.length > 0) && (
                            <React.Fragment>
                              <div className={styles.reservedOptions}>
                                {optionsList}
                              </div>
                            </React.Fragment>
                          )}
                          {/* Subtotal, Tax, & Total */}
                          <div className={styles.reservedPricing}>
                            <div>
                              Subtotal:
                              <NumberFormat
                                prefix="$"
                                value={this.state.reservationSubtotal.toFixed(
                                  2
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                            {this.state.reservationDiscount > 0 && (
                              <div>
                                {this.state.promotionName + ":"}

                                <NumberFormat
                                  prefix="-$"
                                  value={this.state.reservationDiscount.toFixed(
                                    2
                                  )}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </div>
                            )}
                            {this.state.redeemedPoints > 0 && (
                              <div>
                                {this.state.redeemedPoints + " Points:"}

                                <NumberFormat
                                  prefix="-$"
                                  value={(
                                    this.state.redeemedPoints * 0.1
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </div>
                            )}
                            <div>
                              Tax:
                              <NumberFormat
                                prefix="$"
                                value={this.state.reservationTax.toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                            <div className={styles.reservationTotal}>
                              Total:
                              <NumberFormat
                                prefix="$"
                                value={this.state.reservationTotal.toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Payment Buttons */}
                      {/* {!isAuthenticated && (
                        <button
                          type="button"
                          onClick={() => this.props.onShowModal("login")}
                          className={[styles.button, styles.buttonPrimary].join(
                            " "
                          )}
                        >
                          <React.Fragment>Login</React.Fragment>
                        </button>
                      )} */}

                      {this.props.userType === "Employee" && (
                        <button
                          onClick={this.onPay}
                          className={[styles.button, styles.buttonPrimary].join(
                            " "
                          )}
                        >
                          <React.Fragment>
                            Charge Customer
                            <NumberFormat
                              prefix="$"
                              value={this.state.reservationTotal.toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </React.Fragment>
                        </button>
                      )}

                      {this.props.userType !== "Employee" &&
                        this.state.reservationTotal === 0 && (
                          <button
                            onClick={this.onPay}
                            className={[
                              styles.button,
                              styles.buttonPrimary,
                            ].join(" ")}
                          >
                            <React.Fragment>
                              Pay
                              <NumberFormat
                                prefix="$"
                                value={this.state.reservationTotal.toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </React.Fragment>
                          </button>
                        )}

                      {this.props.userType !== "Employee" &&
                        this.state.reservationTotal > 0 && (
                          <div className={styles.paypal}>
                            <PayPalScriptProvider
                              options={{
                                "client-id": REACT_APP_PAYPAL_CLIENT_ID,
                              }}
                            >
                              <PayPalButtons
                                style={{
                                  color: "blue",
                                  label: "pay",
                                  layout: "horizontal",
                                  tagline: false,
                                  shape: "rect",
                                }}
                                fundingSource="paypal"
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    purchase_units: [
                                      {
                                        amount: {
                                          value: this.state.reservationTotal,
                                        },
                                      },
                                    ],
                                  });
                                }}
                                onApprove={(data, actions) => {
                                  return actions.order
                                    .capture()
                                    .then((details) => {
                                      const name =
                                        details.payer.name.given_name;
                                      this.onPay();
                                      alert(`Transaction completed by ${name}`);
                                    });
                                }}
                              />
                            </PayPalScriptProvider>
                          </div>
                        )}
                    </aside>
                  </main>
                </section>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CheckoutModal;
