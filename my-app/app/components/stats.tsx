import React from "react";
import { LuPackage2, LuUsers2 } from "react-icons/lu";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { TbPackages } from "react-icons/tb";

const Stats = () => {
  return (
    <div className="main-cards grid grid-cols-4 gap-5 my-4">
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>PRODUITS</h3>
          <LuPackage2 className="card_icon" />
        </div>
        <h1 className="text-blue-900">300</h1>
      </div>
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>COMMANDES</h3>
          <TbPackages className="card_icon" />
        </div>
        <h1 className="text-blue-900">12</h1>
      </div>
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>CLIENTS</h3>
          <LuUsers2 className="card_icon" />
        </div>
        <h1 className="text-blue-900">33</h1>
      </div>
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>UP SELLS</h3>
          <MdKeyboardDoubleArrowUp className="card_icon" />
        </div>
        <h1 className="text-blue-900">42</h1>
      </div>
    </div>
  );
};

export default Stats;
