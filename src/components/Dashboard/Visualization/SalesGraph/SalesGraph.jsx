import React, { Component } from "react";
import styles from "./SalesGraph.module.css";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory";

const salesData = [
  { item: "Training Cones", sales: 294 },
  { item: "Bowling Shoes", sales: 190 },
  { item: "Basketball", sales: 74 },
  { item: "Soccer Cleats", sales: 57 },
  { item: "Volleyball", sales: 32 },
  { item: "Frisbee", sales: 19 },
];

class SalesGraph extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Earnings Data */}
        <h1 className={styles.title}>Athlos Gear Sales</h1>
        <VictoryChart
          width={1000}
          height={450}
          padding={90}
          theme={VictoryTheme.material}
        >
          <VictoryAxis label={"Item"} tickFormat={(t) => ``} />

          <VictoryAxis
            dependentAxis
            label={"Sales"}
            tickFormat={(t) => `${t}`}
          />
          <VictoryBar
            horizontal
            data={salesData}
            labels={({ datum }) => `${datum.item}`}
            x="item"
            y="sales"
            barRatio={0.2}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          />
        </VictoryChart>
      </React.Fragment>
    );
  }
}

export default SalesGraph;
