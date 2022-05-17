import React, { Component } from "react";
import styles from "./FavoriteSportsGraph.module.css";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory";
import axios from "axios";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

class FavoriteSportsGraph extends Component {
  state = { myBookData: [] };

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  getMyBookings() {
    var tempBookData = [];

    axios({
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": api_url,
      },
      url: api_url + "/book/userbookings",
      data: {
        email: this.props.userEmail,
      },
    }).then((res) => {
      if (res.status === 200 || res.status === 304) {
        let counter = 1;
        for (let temp of res.data) {
          const bookData = {
            id: counter,
            uniqBookingId: temp._id,
            gear: temp.gear,
            upgrade: temp.upgrade,
            intime: temp.intime,
            outtime: temp.outtime,
            facilityLocation: temp.facility_info.facilityLocation,
            latitude: temp.facility_info.latitude,
            longitude: temp.facility_info.longitude,
            facilitySport: temp.facility_info.facilitySports,
            facilityName: temp.facility_info.facilityName,
            facilityInfo: temp.facility_info.facilityInformation,
          };
          counter = counter + 1;
          tempBookData.push(bookData);
        }
      }

      this.setState((prevState) => ({
        myBookData: tempBookData,
      }));
    });
  }

  findOcc(arr, key) {
    let arr2 = [];

    arr.forEach((x) => {
      if (
        arr2.some((val) => {
          return val[key] === x[key];
        })
      ) {
        arr2.forEach((k) => {
          if (k[key] === x[key]) {
            k["totalBookings"]++;
          }
        });
      } else {
        let a = {};
        a[key] = x[key];
        a["totalBookings"] = 1;
        arr2.push(a);
      }
    });

    return arr2;
  }

  componentDidMount() {
    this.getMyBookings();
  }

  render() {
    let favoritesData = this.findOcc(this.state.myBookData, "facilitySport");

    return (
      <React.Fragment>
        {/* Earnings Data */}
        <h1 className={styles.title}>Your Favorite Sports</h1>
        <VictoryChart
          width={1000}
          height={450}
          padding={90}
          theme={VictoryTheme.material}
        >
          <VictoryAxis label={"Sport"} tickFormat={(t) => ``} />
          <VictoryAxis
            dependentAxis
            label={"# of Bookings"}
            tickFormat={(t) => `${t}`}
          />
          <VictoryBar
            horizontal
            data={favoritesData}
            labels={({ datum }) => `${datum.facilitySport}`}
            x="facilitySport"
            y="totalBookings"
            alignment={"start"}
            barRatio={0.2}
            barWidth={10}
            // animate={{
            //   duration: 2000,
            //   onLoad: { duration: 1000 },
            // }}
          />
        </VictoryChart>
      </React.Fragment>
    );
  }
}

export default FavoriteSportsGraph;
