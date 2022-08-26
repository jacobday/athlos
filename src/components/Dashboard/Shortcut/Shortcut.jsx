import React, { Component } from "react";
import styles from "./Shortcut.module.css";
import "./Shortcut.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShortcutModal from "./ShortcutModal/ShortcutModal";

class Shortcut extends Component {
  state = {
    showModal: false,
  };
  onClick = () => {
    const { shortcutTo, onClick } = this.props;
    if (this.props.behavior === "switchTab") {
      onClick(shortcutTo);
    } else if (this.props.behavior === "showModal") {
      document.querySelector("body").style.overflow = "hidden";
      this.setState({ showModal: true });
    }
  };

  onCloseModal = () => {
    document.querySelector("body").style.overflow = "auto";
    this.setState({ showModal: false });
  };

  render() {
    const {
      onClick,
      props: { icon, iconClass, title, description, userEmail },
    } = this;

    return (
      <React.Fragment>
        <div className={styles.shortcutContainer}>
          <button className={styles.button} onClick={onClick}>
            <div className={styles.text}>
              <div className={styles.title}>{title}</div>
              <div className={styles.subtitle}>{description}</div>
            </div>
            <div className={iconClass}>
              <i>
                <FontAwesomeIcon icon={icon} />
              </i>
            </div>
          </button>
        </div>
        {this.state.showModal && (
          <ShortcutModal
            shortcutTo={this.props.shortcutTo}
            onCloseModal={this.onCloseModal}
            userEmail={userEmail}
            user={this.props.user}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Shortcut;
