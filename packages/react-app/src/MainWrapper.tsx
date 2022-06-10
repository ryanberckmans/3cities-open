import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  children?: React.ReactNode
};

export const MainWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-violet-500 to-blue-500 text-neutral-700">
      <Header />
      <div className="flex h-[calc(100vh-152px)] flex-col items-center justify-center p-5 pb-20">
        {children}
      </div>
      <Footer />
    </div>
  );
};
