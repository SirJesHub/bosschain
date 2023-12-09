import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const authLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default authLayout;
