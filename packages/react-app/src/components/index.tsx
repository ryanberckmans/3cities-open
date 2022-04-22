import * as React from "react";

type Props = {
  children?: React.ReactNode
};

export const Body: React.FC<Props> = ({ children }) => {
  return <div>
    {children}
  </div>;
}

export const Container: React.FC < Props > = ({ children }) => {
  return <div>
    {children}
  </div>;
}

export const Header: React.FC<Props> = ({ children }) => {
  return <header>
    {children}
  </header>;
}
