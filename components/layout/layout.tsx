import { Fragment } from "react";
import MainHeader from "./main-header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout(props: LayoutProps) {
  return (
    <Fragment>
      <MainHeader></MainHeader>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
