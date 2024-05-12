import React from "react";
import { useState } from "react";
import FilterButton from "../button/FilterButton";

export default function ButtonFilter({
  filterHandler,
}: {
  filterHandler: Function;
}) {
  const [clickedValue, setClickedValue] = useState("all");
  const buttonHandler = (value: string) => {
    filterHandler(value);
    setClickedValue(value);
  };

  return (
    <div className="w-[48vw] my-3">
      <FilterButton
        buttonHandler={buttonHandler}
        clickedValue={clickedValue}
        value="all"
      >
        All
      </FilterButton>
      <FilterButton
        buttonHandler={buttonHandler}
        clickedValue={clickedValue}
        value="completed"
      >
        Completed
      </FilterButton>
      <FilterButton
        buttonHandler={buttonHandler}
        clickedValue={clickedValue}
        value="in-progress"
      >
        In Progress
      </FilterButton>
      <FilterButton
        buttonHandler={buttonHandler}
        clickedValue={clickedValue}
        value="not-started"
      >
        Not Started
      </FilterButton>
    </div>
  );
}
