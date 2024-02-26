import React from "react";

export default function filterButton({
  buttonHandler,
  children,
  value,
  clickedValue,
}: {
  buttonHandler: Function;
  children: string;
  value: any;
  clickedValue: string;
}) {
  console.log("value:", value, "clickedValue:", clickedValue);
  return (
    <button
      className={`${clickedValue === value ? "bg-orange-500 text-base" : "bg-slate-100 hover:bg-slate-300 text-sm "} ease-in-out mr-5 pl-5 pr-5 pt-2 pb-2 rounded-3xl duration-700`}
      onClick={() => {
        buttonHandler(value);
      }}
    >
      {children}
    </button>
  );
}
