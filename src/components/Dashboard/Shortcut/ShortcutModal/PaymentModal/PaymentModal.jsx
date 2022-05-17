import React, { Component } from "react";
import styles from "./PaymentModal.module.css";
import InputMask from "react-input-mask";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}
class PaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentData: [],
      cardIdSelected: "",
    };
  }
  componentDidMount() {
    let payData = [];
    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/payment/getpaymethod",
      data: {
        email: this.props.userEmail,
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          for (let payment of res.data) {
            payData.push(payment);
          }
        }
        this.setState((prevState) => ({
          paymentData: payData,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onUpdatePayment = (e) => {
    var id = this.state.cardIdSelected;
    //console.log(id)
    
    axios({
      method: "PUT",
      url: api_url + "/payment/update/" + id,
      data: {
        userEmail: this.props.userEmail,
        cardHolderName: e.target.cardholder.value,
        cardNumber: e.target.number.value,
        expiration: e.target.exp.value,
        cvv: e.target.csc.value,
        billingLocation: {
          streetAddress: e.target.streetAddress.value,
          streetAddress2: e.target.aptAddress.value,
          country: e.target.country.value,
          city: e.target.city.value,
          state: e.target.state.value,
          zipcode: e.target.zip.value,
        },
      },
    }).then((res) => {
      if (res.status === 200) {
        alert("Payment Details Updated");
      } else {
        console.log("Alert Updating Payment");
      }
    });

    this.props.onCloseModal();
    e.preventDefault(); // Prevent page refresh
  };

  cardSelected = () => {
    var c = document.getElementById("cardSelected");
    if (c.value === "Please Select") {
      document.getElementById("name").value = "";
      document.getElementById("cardnumber").value = "";
      document.getElementById("expirationdate").value = "";
      document.getElementById("streetAddress").value = "";
      document.getElementById("aptAddress").value = "";
      document.getElementById("country").value = "";
      document.getElementById("city").value = "";
      document.getElementById("state").value = "";
      document.getElementById("zip").value = "";
    } else {
      const index = this.state.paymentData.findIndex((object) => {
        return object.cardNumber === c.value;
      });
      document.getElementById("name").value =
        this.state.paymentData[index].cardHolderName;
      document.getElementById("cardnumber").value =
        this.state.paymentData[index].cardNumber;
      document.getElementById("expirationdate").value =
        this.state.paymentData[index].cardExpiry;
      document.getElementById("streetAddress").value =
        this.state.paymentData[index].billingLocation.streetAddress;
      document.getElementById("aptAddress").value =
        this.state.paymentData[index].billingLocation.streetAddress2;
      document.getElementById("country").value =
        this.state.paymentData[index].billingLocation.country;
      document.getElementById("city").value =
        this.state.paymentData[index].billingLocation.city;
      document.getElementById("state").value =
        this.state.paymentData[index].billingLocation.state;
      document.getElementById("zip").value =
        this.state.paymentData[index].billingLocation.zipcode;
      this.setState((prevState) => ({
        cardIdSelected: this.state.paymentData[index]._id,
      }));
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.close}
              onClick={this.props.onCloseModal}
              title="Close"
            >
              &times;
            </button>

            <div className={styles.container}>
              <aside className={styles.payment}>
                <div className={styles.title}>Update your payment details</div>
                <form onSubmit={(e) => this.onUpdatePayment(e)}>
                  <select onChange={this.cardSelected} id="cardSelected">
                    <option value="Please Select">---Please Select ---</option>
                    {this.state.paymentData.map((el) => (
                      <option value={el.cardNumber} key={el.cardNumber}>
                        {el.cardNumber}
                      </option>
                    ))}
                  </select>
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
                  <select name="country" id="country" autoComplete={"country"}>
                    <option value="-">-</option>
                    <option value="United States">United States</option>
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
                  <button
                    className={[styles.button, styles.buttonPrimary].join(" ")}
                  >
                    Submit
                  </button>
                </form>
              </aside>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PaymentModal;
