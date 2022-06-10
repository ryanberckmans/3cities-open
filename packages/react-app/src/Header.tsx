import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.jpg";
import { WalletButton } from "./WalletButton";

export function Header() {
  return (
    <header className="bg-white p-5 shadow-md">
      <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5">
          <img src={logo} className="mt-1 w-8" alt="3cities" />
          <span className="text-2xl font-extrabold tracking-tight">
            3cities&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          <WalletButton className="rounded-md bg-gradient-to-br from-violet-500 to-blue-500 px-3.5 py-2 text-sm font-medium text-white transition hover:hue-rotate-30 active:scale-95 active:hue-rotate-60" />
        </div>
      </div>
    </header>
  );
}
