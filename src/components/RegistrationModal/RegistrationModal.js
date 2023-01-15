import React, { Component } from "react";
import styles from "./RegistrationModal.module.css";
import "./RegistrationModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleLoginButton } from "..";
import { connect } from "react-redux";
import { registerUser, loginUser } from "../../actions/authActions";

class RegistrationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      passwordType: "password",
      isValid: false,
      email: "",
    };
  }

  onLogin = (event) => {
    var loginData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    this.props.loginUser(loginData);
    event.preventDefault();
  };

  onSignUp = (event) => {
    var newUserData = {
      firstName: event.target.fname.value,
      lastName: event.target.lname.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    this.props.registerUser(newUserData, this.props.history);
    event.preventDefault();
  };

  toggleShowPassword = () => {
    let showPassword = !this.state.showPassword;
    let passwordType =
      this.state.passwordType === "password" ? "text" : "password";

    this.setState({ showPassword, passwordType });
  };

  validate = (event) => {
    const fname = document.getElementById("signup-form-fname");
    const lname = document.getElementById("signup-form-lname");
    const password = document.getElementById("signup-form-password");
    const password_repeat = document.getElementById(
      "signup-form-password-repeat"
    );

    const targetName = event.target.name;
    const targetType = event.target.localName;

    if (targetType === "form" || targetName === "fname") {
      if (fname.value.trim() === "") {
        this.isError(fname, "First Name cannot be blank.");
      } else if (!this.isName(fname.value.trim())) {
        this.isError(fname, "First Name is not valid.");
      } else {
        this.isSuccess(fname);
      }
    }

    if (targetType === "form" || targetName === "lname") {
      if (lname.value.trim() === "") {
        this.isError(lname, "Last Name cannot be blank.");
      } else if (!this.isName(lname.value.trim())) {
        this.isError(lname, "Last Name is not valid.");
      } else {
        this.isSuccess(lname);
      }
    }

    if (targetType === "form" || targetName === "email") {
      if (this.state.email.value.trim() === "") {
        this.isError(this.state.email, "Email cannot be blank.");
      } else if (!this.isEmail(this.state.email.value.trim())) {
        this.isError(this.state.email, "Email is not valid.");
      } else {
        this.isSuccess(this.state.email);
      }
    }

    if (targetType === "form" || targetName === "password") {
      if (password.value.trim() === "") {
        this.isError(password, "Password cannot be blank.");
      } else if (!this.isPassword(password)) {
        return;
      } else if (password.value.trim().length < 8) {
        this.isError(password, "Password must be at least 8 characters.");
      } else {
        this.isSuccess(password);
      }
    }

    if (targetType === "form" || targetName === "password-repeat") {
      if (password_repeat.value.trim() === "") {
        this.isError(password_repeat, "Password cannot be blank.");
      } else if (password.value.trim() !== password_repeat.value.trim()) {
        this.isError(password_repeat, "The passwords do not match.");
      } else {
        this.isSuccess(password_repeat);
      }
    }
  };

  isError = (input, error) => {
    const inputCheck = input.parentElement;
    const displayError = inputCheck.querySelector(".error");

    input.style.boxShadow =
      "0 1px 1px rgba(255, 0, 0, 0.08) inset, 0 0 8px rgba(255, 0, 0, 0.7)";
    displayError.innerText = error;

    this.setState({ isValid: false });
  };

  isSuccess = (input) => {
    const inputCheck = input.parentElement;
    const displayError = inputCheck.querySelector(".error");

    input.style.boxShadow = "";
    displayError.innerText = "";

    this.setState({ isValid: true });
  };

  isEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  isName = (name) => {
    const re = /^[a-z ,.'-]+$/i;
    return re.test(String(name).toLowerCase());
  };

  isPassword = (password) => {
    const passwordVal = password.value.trim();
    let isValid = true;

    const uppercase = /(?=.*[A-Z])/;
    const lowercase = /(?=.*[a-z])/;
    const digit = /(?=.*\d)/;

    let errors = "Password must contain:";

    if (!uppercase.test(passwordVal)) {
      errors += "\n  - One Uppercase";
      isValid = false;
    }
    if (!lowercase.test(passwordVal)) {
      errors += "\n  - One Lowercase";
      isValid = false;
    }
    if (!digit.test(passwordVal)) {
      errors += "\n  - One Number";
      isValid = false;
    }

    if (!isValid) {
      this.isError(password, errors);
    }

    return isValid;
  };

  componentDidMount() {
    var modal = document.getElementById("userForm");
    let self = this;

    // Hide Modal when clicked out of
    window.onclick = function (event) {
      if (event.target === modal) {
        self.props.onHideModal();
      }
    };

    // Sign Up Validation
    if (this.props.isSignUpVisible) {
      const form = document.getElementById("signup-form");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.validate(e);
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* User Login/Sign Up Form */}
        <div className={styles.modal} id="userForm">
          <div className={styles.modalContent}>
            <div className={styles.modalContainer}>
              <div
                onClick={this.props.onHideModal}
                className={styles.close}
                title="Close"
              >
                &times;
              </div>
              <div className={styles.tablinkContainer}>
                {/* User Form: Tab Links */}
                <button
                  className={[
                    styles.tablink,
                    this.props.showModalLogin ? "active" : "",
                  ].join(" ")}
                  id="login-link"
                  onClick={() => this.props.onShowModal("login")}
                >
                  Login
                </button>
                <button
                  className={[
                    styles.tablink,
                    this.props.showModalSignUp ? "active" : "",
                  ].join(" ")}
                  id="signup-link"
                  onClick={() => this.props.onShowModal("sign-up")}
                >
                  Sign Up
                </button>
              </div>
              {/* User Form: Login Form */}
              {this.props.showModalLogin ? (
                <React.Fragment>
                  <div className={styles.tab} id="login">
                    <div className={styles.thirdParty}>
                      {/* Google Sign-In Button */}
                      <GoogleLoginButton />
                    </div>
                    {/* Email Sign-In */}
                    <form
                      id="login-form"
                      className={styles.slideInRight}
                      onSubmit={(e) => this.onLogin(e)}
                      method="post"
                    >
                      <div className={styles.inputContainer}>
                        <label htmlFor="email">Email</label>
                        <input
                          id="login-form-email"
                          type="text"
                          placeholder=""
                          name="email"
                        />
                      </div>

                      <div className={styles.inputContainer}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordContainer}>
                          <input
                            id="login-form-password"
                            type={this.state.passwordType}
                            placeholder=""
                            name="password"
                          />
                          <button
                            onClick={this.state.toggleShowPassword}
                            type="button"
                            className={styles.showPassword}
                          >
                            {!this.state.showPassword && (
                              <FontAwesomeIcon icon="fa-solid fa-eye" />
                            )}
                            {this.state.showPassword && (
                              <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={[
                          styles.button,
                          styles.buttonPrimary,
                          styles.buttonSubmit,
                        ].join(" ")}
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </React.Fragment>
              ) : null}
              {/* User Form: Sign Up Form */}
              {this.props.showModalSignUp ? (
                <div className={styles.tab} id="sign-up">
                  <div className={styles.thirdParty}>
                    {/* Google Sign-In Button */}
                    <GoogleLoginButton />
                  </div>
                  {/* Email Sign Up */}
                  <form
                    id="signup-form"
                    className={styles.slideInLeft}
                    onSubmit={(e) => {
                      this.onSignUp(e);
                    }}
                    method="post"
                  >
                    <div className={styles.nameContainer}>
                      <div
                        className={[styles.name, styles.inputContainer].join(
                          " "
                        )}
                      >
                        <label htmlFor="fname">First Name</label>
                        <input
                          id="signup-form-fname"
                          type="text"
                          placeholder=""
                          name="fname"
                          onChange={(e) => this.validate(e)}
                        />

                        <div className="error"></div>
                      </div>

                      <div
                        className={[styles.name, styles.inputContainer].join(
                          " "
                        )}
                      >
                        <label htmlFor="lname">Last Name</label>
                        <input
                          id="signup-form-lname"
                          type="text"
                          placeholder=""
                          name="lname"
                          onChange={(e) => this.validate(e)}
                        />

                        <div className="error"></div>
                      </div>
                    </div>

                    <div className={styles.inputContainer}>
                      <label htmlFor="email">Email</label>
                      <input
                        id="signup-form-email"
                        type="text"
                        placeholder=""
                        name="email"
                        onChange={(e) => this.validate(e)}
                      />

                      <div className="error"></div>
                    </div>

                    <div className={styles.inputContainer}>
                      <label htmlFor="password">Password</label>
                      <div className={styles.passwordContainer}>
                        <input
                          id="signup-form-password"
                          type={this.state.passwordType}
                          placeholder=""
                          name="password"
                          onChange={(e) => this.validate(e)}
                        />
                        <button
                          onClick={this.toggleShowPassword}
                          type="button"
                          className={styles.showPassword}
                        >
                          {!this.state.showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye" />
                          )}
                          {this.state.showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                          )}
                        </button>
                        <div className="error"></div>
                      </div>
                    </div>

                    <div className={styles.inputContainer}>
                      <label htmlFor="password-repeat">Repeat Password</label>
                      <div className={styles.passwordContainer}>
                        <input
                          id="signup-form-password-repeat"
                          type={this.state.passwordType}
                          placeholder=""
                          name="password-repeat"
                          onChange={(e) => this.validate(e)}
                        />
                        <button
                          onClick={this.state.toggleShowPassword}
                          type="button"
                          className={styles.showPassword}
                        >
                          {!this.state.showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye" />
                          )}
                          {this.state.showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                          )}
                        </button>
                        <div className="error"></div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={[
                        styles.button,
                        styles.buttonPrimary,
                        styles.buttonSubmit,
                      ].join(" ")}
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser, loginUser })(
  RegistrationModal
);
