import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./normalize.css";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

// FontAwesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightFromBracket,
  faBarcode,
  faBarsProgress,
  faBaseball,
  faBaseballBatBall,
  faBasketball,
  faBell,
  faBookmark,
  faBowlingBall,
  faBuilding,
  faCalendarCheck,
  faCircleInfo,
  faCircleXmark,
  faClock,
  faCompactDisc,
  faCreditCard,
  faEye,
  faEyeSlash,
  faFilter,
  faFootball,
  faFutbol,
  faGears,
  faHeadset,
  faHeart,
  faHeartPulse,
  faHouseUser,
  faKey,
  faLayerGroup,
  faLocationArrow,
  faMedal,
  faMicrophone,
  faMinus,
  faPenToSquare,
  faPercent,
  faPersonWalking,
  faPlus,
  faQrcode,
  faReceipt,
  faRotateRight,
  faStar,
  faStopwatch20,
  faTableTennisPaddleBall,
  faUser,
  faVolleyball,
} from "@fortawesome/free-solid-svg-icons";
import { Provider } from "react-redux";

library.add(
  faFilter,
  faHouseUser,
  faBookmark,
  faLayerGroup,
  faBell,
  faGears,
  faPenToSquare,
  faReceipt,
  faHeadset,
  faLocationArrow,
  faEye,
  faEyeSlash,
  faArrowRightFromBracket,
  faUser,
  faClock,
  faBaseballBatBall,
  faPlus,
  faMinus,
  faCircleInfo,
  faBuilding,
  faFutbol,
  faBasketball,
  faVolleyball,
  faTableTennisPaddleBall,
  faCircleXmark,
  faRotateRight,
  faCompactDisc,
  faFootball,
  faBaseball,
  faBowlingBall,
  faPercent,
  faCalendarCheck,
  faBarcode,
  faMedal,
  faKey,
  faCreditCard,
  faHeart,
  faQrcode,
  faBarsProgress,
  faPersonWalking,
  faHeartPulse,
  faStopwatch20,
  faStar,
  faMicrophone
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
