import React, { Component } from "react";
import styles from "./Home.module.css";
import "./Home.css";
import { NavProfile } from "..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShadowVisible: false,
    };
  }

  componentDidMount() {
    document.body.style.backgroundColor = "white";
    window.addEventListener("scroll", this.scrollAnimation);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollAnimation);
  }

  scrollAnimation = () => {
    let scrollPosition = window.scrollY;

    if (scrollPosition >= 50) {
      this.setState((prevState) => ({ isShadowVisible: true }));
    } else {
      this.setState((prevState) => ({ isShadowVisible: false }));
    }
  };

  render() {
    return (
      <>
        {/* Top Navigation Bar */}
        <header
          className={[
            styles.topnav,
            this.state.isShadowVisible ? "topnavOverlay" : "",
          ].join(" ")}
        >
          <div className={styles.container}>
            <div className={styles.navigation}>
              {/* Navigation: Athlos Branding [Left] */}
              <div className={styles.logo}>
                <Link to={"/"}>Athlos</Link>
              </div>

              {/* Navigation: Nav Links [Middle] */}
              <div className={styles.menu}>
                <ul className={styles.menuItem}>
                  <li>
                    <Link to={"/dashboard"}>Dashboard</Link>
                  </li>
                </ul>
              </div>

              {/* Navigation: User Login/Sign Up Buttons [Right] */}
              <NavProfile
                isAuthenticated={this.props.isAuthenticated}
                userFirstName={this.props.userFirstName}
                userLastName={this.props.userLastName}
                userType={this.props.userType}
                onShowModal={this.props.onShowModal}
                onLogout={this.props.onLogout}
                userRewardPoints={this.props.userRewardPoints}
              />
            </div>
          </div>
        </header>

        {/* Introduction Section */}
        <section className={[styles.intro, styles.container].join(" ")}>
          {/* Introduction: Text [Left] */}
          <div className={styles.text}>
            <div className={styles.title}>The #1 Sports Booking Platform</div>
            <div className={[styles.description, styles.fadeIn].join(" ")}>
              Athlos is the easiest way to reserve sports <br />
              facilities on campus.
            </div>
            {!this.props.isAuthenticated && (
              <button
                className={[styles.button, styles.buttonPrimary].join(" ")}
                onClick={() => this.props.onShowModal("sign-up")}
              >
                Sign Up Free
              </button>
            )}
          </div>

          {/* Introduction: Image [Right] */}
          <div className={styles.image}>
            <img src="images/runner.jpeg" alt="Runner Illustration" />
          </div>
        </section>

        {/* Information Section */}
        <section className={styles.info}>
          <div>
            <div className={styles.icon}>
              <FontAwesomeIcon icon="fa-solid fa-heart-pulse" />
              <img src="images/blob.svg" alt="Icon background" />
            </div>
            <div className={styles.title}>Train</div>
            <div className={styles.desc}>
              Hire personal trainers to up your game.
            </div>
          </div>
          <div>
            <div className={styles.icon}>
              <FontAwesomeIcon icon="fa-solid fa-person-walking" />
              <img src="images/blob.svg" alt="Icon background" />
            </div>
            <div className={styles.title}>Play</div>
            <div className={styles.desc}>
              Reserve your favorite sports facility for all your friends.
            </div>
          </div>
          <div>
            <div className={styles.icon}>
              <FontAwesomeIcon icon="fa-solid fa-stopwatch-20" />
              <img src="images/blob.svg" alt="Icon background" />
            </div>
            <div className={styles.title}>Compete</div>
            <div className={styles.desc}>
              Enlist game officials to oversee your next match.
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            &copy; 2022 Athlos
            {/* <section>
              <div className={styles.footerlogo}>
                <a href="/">Athlos</a>
              </div>
              <div>The #1 Sports Booking Platform</div>
            </section> */}
          </div>
        </footer>
      </>
    );
  }
}

export default Home;
