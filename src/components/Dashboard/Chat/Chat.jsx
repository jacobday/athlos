import React, { Component } from "react";
import Agent from "./Agent/Agent";
import Client from "./Client/Client";

class Chat extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.user.type === "Support" && <Agent />}
        {this.props.user.type === "Customer" && (
          <Client user={this.props.user} />
        )}
      </React.Fragment>
    );
  }
}

export default Chat;
