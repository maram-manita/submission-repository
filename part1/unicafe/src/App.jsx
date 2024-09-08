import { useState } from "react";

const Button = ({ btnHandler, text }) => {
  return <button onClick={btnHandler}>{text}</button>;
};
const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      {text} {value}
    </tr>
  );
};
const Statistics = ({ good, neutral, bad }) => {
  if (good == 0 && bad == 0 && neutral == 0) {
    return <p>no statistics to show</p>;
  } else {
    return (
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={bad + neutral + good} />
          <StatisticsLine
            text="positive"
            value={good / (bad + neutral + good) + "%"}
          />
        </tbody>
      </table>
    );
  }
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button
        btnHandler={() => {
          setGood(good + 1);
        }}
        text="good"
      />
      <Button
        btnHandler={() => {
          setNeutral(neutral + 1);
        }}
        text="neutral"
      />
      <Button
        btnHandler={() => {
          setBad(bad + 1);
        }}
        text="bad"
      />
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
