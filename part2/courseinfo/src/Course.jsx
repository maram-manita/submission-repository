import React from "react";

const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => (
  <p>
    <b>Number of exercises {sum}</b>
  </p>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part, index) => (
      <Part key={index} part={part} />
    ))}
  </>
);

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={totalExercises} />
    </div>
  );
};

export default Course;
