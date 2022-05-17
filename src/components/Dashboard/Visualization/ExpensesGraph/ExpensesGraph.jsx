import React, { Component } from "react";
import styles from "./ExpensesGraph.module.css";
import { VictoryPie } from "victory";

const expenseData = [
  { x: 1, y: 50, label: "Salaries" },
  { x: 2, y: 5, label: "Marketing" },
  { x: 3, y: 10, label: "Taxes" },
  { x: 4, y: 15, label: "Integrations, Servers, and Hosting" },
  { x: 5, y: 10, label: "Transportation" },
  { x: 6, y: 10, label: "Other" },
];

class ExpensesGraph extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Earnings Data */}
        <h1 className={styles.title}>Athlos Expenses</h1>

        <VictoryPie
          width={1000}
          height={450}
          data={expenseData}
          colorScale={"qualitative"}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
        />
        {/* <VictoryAxis label={"Item"} tickFormat={(t) => ``} />

          <VictoryAxis
            dependentAxis
            label={"Sales"}
            tickFormat={(t) => `${t}`}
          />
          <VictoryBar
            horizontal
            data={expenseData}
            labels={({ datum }) => `${datum.item}`}
            x="item"
            y="cost"
            barRatio={0.2}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          /> */}
      </React.Fragment>
    );
  }
}

export default ExpensesGraph;
