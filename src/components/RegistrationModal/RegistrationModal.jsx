import React, { useEffect, useState } from "react";
import styles from "./RegistrationModal.module.css";
import "./RegistrationModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleLoginButton } from "..";
import axios from "axios";
const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

const RegistrationModal = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [isValid, setIsValid] = useState(false);
  const email = document.getElementById("signup-form-email");

  const onLogin = (event) => {
    var api_url;
    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    var loginData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/users/login",
      data: { loginData },
    })
      .then((res) => {
        if (res.status === 200) {
          props.handleAuthState(res);
          console.log("Logged In Successfully");
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 404) {
            console.log("EmailID not found");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });
    event.preventDefault();
  };

  const onSignUp = (event) => {
    var api_url;

    if (process.env.NODE_ENV === "production") {
      api_url = REACT_APP_PRODUCTION_URL;
    } else {
      api_url = REACT_APP_LOCAL_URL;
    }

    var newUserData = {
      firstName: event.target.fname.value,
      lastName: event.target.lname.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    axios({
      method: "POST",
      url: api_url + "/users/add",
      data: { newUserData },
    })
      .then((res) => {
        if (res.status === 200) {
          // props.handleAuthState(res);
          window.location.href = "/"; // Redirect to Home
          console.log("User Added to Database");
        }
      })
      .catch(function (err) {
        console.log(err);
        if (err.response) {
          if (err.response.status === 409) {
            isError(email, "Email is already in use.");
            console.log("User Already Exists in Database");
          }
        } else if (err.request) {
          //Response not received from API
          console.log("Error: ", err.request);
        } else {
          //Unexpected Error
          console.log("Error", err.message);
        }
      });
    // event.preventDefault();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const validate = (event) => {
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
        isError(fname, "First Name cannot be blank.");
      } else if (!isName(fname.value.trim())) {
        isError(fname, "First Name is not valid.");
      } else {
        isSuccess(fname);
      }
    }

    if (targetType === "form" || targetName === "lname") {
      if (lname.value.trim() === "") {
        isError(lname, "Last Name cannot be blank.");
      } else if (!isName(lname.value.trim())) {
        isError(lname, "Last Name is not valid.");
      } else {
        isSuccess(lname);
      }
    }

    if (targetType === "form" || targetName === "email") {
      if (email.value.trim() === "") {
        isError(email, "Email cannot be blank.");
      } else if (!isEmail(email.value.trim())) {
        isError(email, "Email is not valid.");
      } else {
        isSuccess(email);
      }
    }

    if (targetType === "form" || targetName === "password") {
      if (password.value.trim() === "") {
        isError(password, "Password cannot be blank.");
      } else if (!isPassword(password)) {
        return;
      } else if (password.value.trim().length < 8) {
        isError(password, "Password must be at least 8 characters.");
      } else {
        isSuccess(password);
      }
    }

    if (targetType === "form" || targetName === "password-repeat") {
      if (password_repeat.value.trim() === "") {
        isError(password_repeat, "Password cannot be blank.");
      } else if (password.value.trim() !== password_repeat.value.trim()) {
        isError(password_repeat, "The passwords do not match.");
      } else {
        isSuccess(password_repeat);
      }
    }
  };

  function isError(input, error) {
    const inputCheck = input.parentElement;
    const displayError = inputCheck.querySelector(".error");

    input.style.boxShadow =
      "0 1px 1px rgba(255, 0, 0, 0.08) inset, 0 0 8px rgba(255, 0, 0, 0.7)";
    displayError.innerText = error;
    setIsValid(false);
  }

  function isSuccess(input) {
    const inputCheck = input.parentElement;
    const displayError = inputCheck.querySelector(".error");

    input.style.boxShadow = "";
    displayError.innerText = "";
    setIsValid(true);
  }

  function isEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function isName(name) {
    const re = /^[a-z ,.'-]+$/i;
    return re.test(String(name).toLowerCase());
  }

  function isPassword(password) {
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
      isError(password, errors);
    }

    return isValid;
  }

  useEffect(() => {
    var modal = document.getElementById("userForm");

    // Hide Modal when clicked out of
    window.onclick = function (event) {
      if (event.target === modal) {
        props.onHideModal();
      }
    };

    // Sign Up Validation
    if (props.isSignUpVisible) {
      const form = document.getElementById("signup-form");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        validate(e);
      });
    }
  });

  return (
    <React.Fragment>
      {/* User Login/Sign Up Form */}
      <div className={styles.modal} id="userForm">
        <div className={styles.modalContent}>
          <div className={styles.modalContainer}>
            <div
              onClick={props.onHideModal}
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
                  props.showModalLogin ? "active" : "",
                ].join(" ")}
                id="login-link"
                onClick={() => props.onShowModal("login")}
              >
                Login
              </button>
              <button
                className={[
                  styles.tablink,
                  props.showModalSignUp ? "active" : "",
                ].join(" ")}
                id="signup-link"
                onClick={() => props.onShowModal("sign-up")}
              >
                Sign Up
              </button>
            </div>
            {/* User Form: Login Form */}
            {props.showModalLogin ? (
              <React.Fragment>
                <div className={styles.tab} id="login">
                  <div className={styles.thirdParty}>
                    {/* Google Sign-In Button */}
                    <GoogleLoginButton
                      handleAuthState={props.handleAuthState}
                    />
                  </div>
                  {/* Email Sign-In */}
                  <form
                    id="login-form"
                    className={styles.slideInRight}
                    onSubmit={(e) => onLogin(e)}
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
                          type={passwordType}
                          placeholder=""
                          name="password"
                        />
                        <button
                          onClick={toggleShowPassword}
                          type="button"
                          className={styles.showPassword}
                        >
                          {!showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye" />
                          )}
                          {showPassword && (
                            <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* <label>
                  <input type="checkbox" checked="checked" name="remember">
                  Remember Me
                </label> */}

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
            {props.showModalSignUp ? (
              <div className={styles.tab} id="sign-up">
                <div className={styles.thirdParty}>
                  {/* Google Sign-In Button */}
                  <GoogleLoginButton handleAuthState={props.handleAuthState} />
                </div>
                {/* Email Sign Up */}
                <form
                  id="signup-form"
                  className={styles.slideInLeft}
                  onSubmit={(e) => {
                    onSignUp(e);
                  }}
                  method="post"
                >
                  <div className={styles.nameContainer}>
                    <div
                      className={[styles.name, styles.inputContainer].join(" ")}
                    >
                      <label htmlFor="fname">First Name</label>
                      <input
                        id="signup-form-fname"
                        type="text"
                        placeholder=""
                        name="fname"
                        onChange={(e) => validate(e)}
                      />

                      <div className="error"></div>
                    </div>

                    <div
                      className={[styles.name, styles.inputContainer].join(" ")}
                    >
                      <label htmlFor="lname">Last Name</label>
                      <input
                        id="signup-form-lname"
                        type="text"
                        placeholder=""
                        name="lname"
                        onChange={(e) => validate(e)}
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
                      onChange={(e) => validate(e)}
                    />

                    <div className="error"></div>
                  </div>

                  <div className={styles.inputContainer}>
                    <label htmlFor="password">Password</label>
                    <div className={styles.passwordContainer}>
                      <input
                        id="signup-form-password"
                        type={passwordType}
                        placeholder=""
                        name="password"
                        onChange={(e) => validate(e)}
                      />
                      <button
                        onClick={toggleShowPassword}
                        type="button"
                        className={styles.showPassword}
                      >
                        {!showPassword && (
                          <FontAwesomeIcon icon="fa-solid fa-eye" />
                        )}
                        {showPassword && (
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
                        type={passwordType}
                        placeholder=""
                        name="password-repeat"
                        onChange={(e) => validate(e)}
                      />
                      <button
                        onClick={toggleShowPassword}
                        type="button"
                        className={styles.showPassword}
                      >
                        {!showPassword && (
                          <FontAwesomeIcon icon="fa-solid fa-eye" />
                        )}
                        {showPassword && (
                          <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                        )}
                      </button>
                      <div className="error"></div>
                    </div>
                  </div>

                  {/* <label>
                <input type="checkbox" checked="checked" name="remember">
                Remember Me
              </label> */}

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
};

export default RegistrationModal;
