/* eslint-disable @next/next/no-img-element */
import React from "react";

const Header = () => {
  return (
    <div className="top-0 left-0 right-0 z-20 bg-white border-b h-16 flex items-center justify-between px-10 font-sans">
      <div className="flex items-center gap-2">
        <img src={"/coffee.svg"} alt="coffee" />
        <p className="font-bold text-xl">Buy Me Coffee</p>
      </div>
      <div>
        <button className="bg-zinc-100 rounded-xl p-3">Log Out</button>
      </div>
    </div>
  );
};

export default Header;
