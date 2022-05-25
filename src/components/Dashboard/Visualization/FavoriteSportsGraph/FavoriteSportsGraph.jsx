import React, { Component } from "react";
import styles from "./FavoriteSportsGraph.module.css";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { fetchMyBookings } from "../../../../data";

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

  async getMyBookings() {
    const result = await fetchMyBookings(this.props.userEmail);
    this.setState({ myBookData: result });
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
