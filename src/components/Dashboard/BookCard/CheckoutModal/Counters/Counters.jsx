import React, { Component } from "react";
import Counter from "../Counter/Counter";
import uniqid from "uniqid";

class Counters extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.counters.map((counters) => (
          <Counter
            key={uniqid("", "-counter")}
            onIncrement={this.props.onIncrement}
            onDecrement={this.props.onDecrement}
            counter={counters}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default Counters;
