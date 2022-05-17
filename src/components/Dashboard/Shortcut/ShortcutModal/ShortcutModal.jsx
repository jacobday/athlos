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
              userEmail={this.props.userEmail}
              userFirstName={this.props.userFirstName}
              userLastName={this.props.userLastName}
              userRewardPoints={this.props.userRewardPoints}
              userImage={this.props.userImage}
            />
          </React.Fragment>
        )}

        {this.props.shortcutTo === "payments" && (
          <React.Fragment>
            <PaymentModal
              onCloseModal={this.props.onCloseModal}
              userEmail={this.props.userEmail}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ShortcutModal;
