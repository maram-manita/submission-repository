import { useState } from "react";
const BestAnecdote = ({ anecdotes, points }) => {
  const mostPoints = Math.max(...points);
  const indexOfMostPoints = points.indexOf(mostPoints);
  return (
    <div>
      {anecdotes[indexOfMostPoints]} has {mostPoints} upvotes
    </div>
  );
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [highestIndex, setHighestIndex] = useState(0);
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const handleSelected = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomNumber);
  };
  const handlePoints = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    setPoints(newPoints);
  };
  return (
    <div>
      <h1>Anecdote of the Day</h1>
      {anecdotes[selected]}
      <div>
        <button onClick={handleSelected}>next anecdote</button>
        <button onClick={handlePoints}>upvote</button>
      </div>
      <h1>Anecdote with the Most Votes</h1>
      <BestAnecdote points={points} anecdotes={anecdotes} />
    </div>
  );
};

export default App;
