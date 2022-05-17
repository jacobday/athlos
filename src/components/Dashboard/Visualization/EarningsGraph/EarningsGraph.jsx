import React, { Component } from "react";
import styles from "./EarningsGraph.module.css";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
} from "victory";

const earningsData = [
  { date: new Date(2022, 0, 1), revenue: 54.78, net: 20.43 },
  { date: new Date(2022, 1, 1), revenue: 129.46, net: 70.94 },
  { date: new Date(2022, 2, 1), revenue: 101.65, net: 33.91 },
  { date: new Date(2022, 3, 1), revenue: 167.11, net: 92.39 },
];

class EarningsGraph extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Earnings Data */}
        <h1 className={styles.title}>Athlos Earnings</h1>

        <VictoryChart
          width={1130}
          height={450}
          padding={80}
          scale={{ x: "time" }}
        >
          <VictoryGroup offset={61}>
            <VictoryBar
              data={earningsData}
              colorScale={"blue"}
              x={"date"}
              y={"revenue"}
              barRatio={0.2}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
            />
            <VictoryBar
              data={earningsData}
              colorScale={"red"}
              x={"date"}
              y={"net"}
              barRatio={0.2}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
            />
          </VictoryGroup>

          <VictoryAxis
            tickValues={0}
            tickFormat={(t) =>
              `${new Date(t).toLocaleString("en-us", { month: "long" })}`
            }
          />
          <VictoryAxis dependentAxis tickFormat={(t) => `$${t}`} />

          <VictoryLine
            data={earningsData}
            style={{ data: { stroke: "green" } }}
            x={"date"}
            y={(datum) => (datum.net / datum.revenue) * 100}
          />

          <VictoryLegend
            x={125}
            y={25}
            title="Legend"
            centerTitle
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Revenue", symbol: { fill: "#0E2B5D" } },
              { name: "Net Income", symbol: { fill: "#EA7354" } },
              { name: "Profit Margin", symbol: { fill: "#377E22" } },
            ]}
          />
        </VictoryChart>
      </React.Fragment>
    );
  }
}

export default EarningsGraph;
