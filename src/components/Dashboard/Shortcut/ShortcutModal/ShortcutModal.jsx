import React, { Component } from "react";
import InterestModal from "./InterestModal/InterestModal";
import PaymentModal from "./PaymentModal/PaymentModal";

class ShortcutModal extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.shortcutTo === "interests" && (
          <React.Fragment>
            <InterestModal
              onCloseModal={this.props.onCloseModal}
              user={this.props.user}
            />
          </React.Fragment>
        )}

        {this.props.shortcutTo === "payments" && (
          <React.Fragment>
            <PaymentModal
              onCloseModal={this.props.onCloseModal}
              user={this.props.user}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ShortcutModal;
