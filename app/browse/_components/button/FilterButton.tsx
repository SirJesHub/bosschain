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
  return (
    <button
      className={`${clickedValue === value ? "bg-blue-500 text-sm text-white" : "bg-slate-100 hover:bg-slate-300 text-sm "} ease-in-out mr-5 pl-6 pr-6 pt-3 pb-3 rounded-md duration-700 font-medium`}
      onClick={() => {
        buttonHandler(value);
      }}
    >
      {children}
    </button>
  );
}
