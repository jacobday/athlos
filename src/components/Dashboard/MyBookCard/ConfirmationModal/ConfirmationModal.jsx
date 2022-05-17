import React, { Component } from "react";
import styles from "./ConfirmationModal.module.css";
import QRCode from "react-qr-code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberFormat from "react-number-format";
import uniqid from "uniqid";
import MapSection from "./Map/Map";
import ReactStars from "react-rating-stars-component";

class ConfirmationModal extends Component {
  state = {
    sectionNumber: 1,
  };

  setPageNumber(page) {
    this.setState({ sectionNumber: page });
  }

  nextPage() {
    this.setPageNumber(this.state.sectionNumber + 1);
  }

  hashCode(code) {
    var hash = 0,
      i,
      chr;
    if (code.length === 0) return hash;
    for (i = 0; i < code.length; i++) {
      chr = code.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
  }

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

  componentDidMount() {
    if (this.state.sectionNumber === 1) {
      this.createScrollShadow();
    }
  }

  ratingChanged = (newRating) => {
    console.log(newRating);
  };

  componentDidUpdate() {
    if (this.state.sectionNumber === 1) {
      this.createScrollShadow();
    }
  }

  render() {
    const {
      props: {
        facilityName,
        facilityLocation,
        facilitySport,
        facilityInfo,
        totalAmount,
        latitude,
        longitude,
        intime,
        outtime,
        bookingID,
        gear,
        upgrade,
      },
    } = this;

    const location = {
      address: facilityLocation.street,
      lat: latitude,
      lng: longitude,
    };

    let sportImage =
      "images/" +
      facilitySport.toString().toLowerCase().replace(/ /g, "") +
      ".jpg";

    // QR Code Value
    const qrValue = `Facility Name: ${facilityName} \nFacility Location: ${facilityLocation.city}, ${facilityLocation.state} \nTime Slot: ${intime}:00 - ${outtime}:00 \nBooking ID: ${bookingID}`;

    // List of Selected Gear & Extras
    const combinedOptions = gear.concat(upgrade);
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
                {/* Status Bar: Reservation Summary */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.sectionNumber === 1 ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(1)}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-bars-progress" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>Reservation</div>
                    <div className={styles.sectionTitle}>Summary</div>
                  </div>
                </button>
                {/* Status Bar: Check In Information  */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.sectionNumber === 2 ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(2)}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-qrcode" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>Check In</div>
                    <div className={styles.sectionTitle}>Information</div>
                  </div>
                </button>
                {/* Status Bar: Review  */}
                <button
                  className={[
                    styles.statusSection,
                    this.state.sectionNumber === 3 ? "completedSection" : "",
                  ].join(" ")}
                  onClick={() => this.setPageNumber(3)}
                >
                  <div className={styles.sectionIcon}>
                    <FontAwesomeIcon icon="fa-solid fa-star" />
                  </div>
                  <div className={styles.sectionText}>
                    <div className={styles.sectionSelection}>Submit</div>
                    <div className={styles.sectionTitle}>Feedback</div>
                  </div>
                </button>
              </nav>
            </div>

            {/* Reservation Summary */}
            {this.state.sectionNumber === 1 && (
              <React.Fragment>
                <section className={styles.container}>
                  <main className={styles.checkout}>
                    {/* Google Map Integration */}
                    <aside className={styles.mapContainer}>
                      <section className={styles.title}>Directions</section>

                      <section>
                        <MapSection
                          location={location}
                          facilityLocation={facilityLocation}
                          latitude={latitude}
                          longitude={longitude}
                          zoomLevel={17}
                        />
                      </section>
                    </aside>

                    {/* Summary */}
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
                            {facilityLocation.city +
                              ", " +
                              facilityLocation.state}
                          </div>
                          {/* Facility Description */}
                          <div className={styles.description}>
                            <i>
                              <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                            </i>
                            {facilityInfo}
                          </div>
                          {/* Reserved Gear & Extras */}
                          {(gear.length > 0 || upgrade.length > 0) && (
                            <React.Fragment>
                              <div className={styles.reservedOptions}>
                                {optionsList}
                              </div>
                            </React.Fragment>
                          )}
                          {/* Subtotal, Tax, & Total */}
                          <div className={styles.reservedPricing}>
                            {/* <div>
                        Subtotal:
                        <NumberFormat
                          prefix="$"
                          value={this.state.reservationSubtotal.toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </div>
                      <div>
                        Tax:
                        <NumberFormat
                          prefix="$"
                          value={this.state.reservationTax.toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </div> */}
                            <div className={styles.reservationTotal}>
                              Total:
                              <NumberFormat
                                prefix="$"
                                value={totalAmount.toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Cancel Button */}
                      <button
                        onClick={this.props.handleCancelation}
                        className={[styles.button, styles.cancelButton].join(
                          " "
                        )}
                      >
                        <React.Fragment>Cancel</React.Fragment>
                      </button>
                    </aside>
                  </main>
                </section>
              </React.Fragment>
            )}

            {this.state.sectionNumber === 2 && (
              <section className={styles.container}>
                <div className={styles.title}>Check In</div>
                <div className={styles.code}>
                  <QRCode
                    title="Check In Code"
                    value={qrValue}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="L"
                  />
                  <div>
                    Please use the above code to check in for your reservation.
                  </div>
                </div>
              </section>
            )}

            {this.state.sectionNumber === 3 && (
              <section className={styles.container}>
                <div className={styles.title}>Feedback</div>
                <div className={styles.feedback}>
                  <div className={styles.ratings}>
                    <p>Rating:</p>
                    <ReactStars
                      count={5}
                      onChange={this.ratingChanged}
                      size={24}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="#ffd700"
                    />
                  </div>
                  <div className={styles.reviews}>
                    <p>Review:</p>
                    <input
                      type="textarea"
                      id="review"
                      name="review"
                      placeholder=""
                    />
                  </div>
                  <button
                    className={[styles.button, styles.buttonPrimary].join(" ")}
                    onClick={this.props.onCloseModal}
                  >
                    Submit
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ConfirmationModal;
