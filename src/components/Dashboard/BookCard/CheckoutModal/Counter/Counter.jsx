import React, { Component } from "react";
import styles from "./Counter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberFormat from "react-number-format";
class Counter extends Component {
  state = {
    itemCount: 0,
  };

  render() {
    const {
      props: { counter },
    } = this;

    return (
      <React.Fragment>
        <section className={styles.counterContainer}>
          <div className={styles.label}>{counter.itemName}</div>
          <div className={styles.counter}>
            <div>{counter.value}</div>
            <div>
              <button
                onClick={() => this.props.onIncrement(this.props.counter)}
              >
                <FontAwesomeIcon icon="fa-solid fa-plus" />
              </button>
              <button
                onClick={() => this.props.onDecrement(this.props.counter)}
              >
                <FontAwesomeIcon icon="fa-solid fa-minus" />
              </button>
            </div>
          </div>
          <div className={styles.price}>
            <NumberFormat
              prefix={"$"}
              value={(counter.itemPrice * counter.value).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Counter;
