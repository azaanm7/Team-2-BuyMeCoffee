/* eslint-disable @next/next/no-img-element */
import React from "react";

const Header = () => {
  return (
    <div className="text-black w-screen flex justify-between items-center px-10 p-5 font-sans">
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
