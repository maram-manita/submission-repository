import { useState } from "react";
const Header = (props) => {
  return <h1>{props.course}</h1>;
};
const Content = (props) => {
  return (
    <>
      {props.parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </>
  );
};
const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};
const Total = (props) => {
  return <p1>number of exercises {props.total}</p1>;
};
const App = () => {
  const [count, setCount] = useState(0);
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };
  const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises} />
      <p>count is {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
    </div>
  );
};

export default App;
