"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { LuPackage2, LuUsers2 } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import {
  GET_ALL_USERS_QUERY,
  GET_PACKAGES_QUERY,
  PRODUCT_QUERY,
} from "../graph/queries";
import SmallSpinner from "./SmallSpinner";

const DEFAULT_TIMEZONE = "Africa/Tunis";

interface Package {
  id: string;
  checkoutId: string;
  status: string;
  createdAt: string;
  Checkout: {
    id: string;
    total: number;
  };
}

interface PackageData {
  getAllPackages: Package[];
}

interface ProductData {
  products: {
    id: string;
  }[];
}

const Stats = () => {
  const { loading: usersLoading, data: usersLength } =
    useQuery(GET_ALL_USERS_QUERY);
  const { loading: productsLoading, data: productLength } =
    useQuery(PRODUCT_QUERY);
  const { loading: packagesLoading, data: packageData } =
    useQuery(GET_PACKAGES_QUERY);

  const getPackagesThisMonth = (packages: Package[]) => {
    const startOfMonth = moment().startOf("month");
    return packages.filter((pkg) =>
      moment
        .tz(parseInt(pkg?.createdAt), DEFAULT_TIMEZONE)
        .isSameOrAfter(startOfMonth),
    );
  };

  const packagesThisMonth = packageData
    ? getPackagesThisMonth(packageData.getAllPackages)
    : [];

  return (
    <div className="main-cards grid grid-cols-3  gap-5 my-4">
      <div className="card flex flex-col justify-around p-4 px-6 gap-3 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>PRODUITS</h3>
          <LuPackage2 className="card_icon" />
        </div>
        <h1 className="text-blue-900">
          {productsLoading ? <SmallSpinner /> : productLength?.products?.length}
        </h1>
      </div>
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>COMMANDES</h3>
          <TbPackages className="card_icon" />
        </div>
        <h1 className="text-blue-900">
          {packagesLoading ? <SmallSpinner /> : packagesThisMonth.length}
        </h1>
      </div>
      <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>CLIENTS</h3>
          <LuUsers2 className="card_icon" />
        </div>
        <h1 className="text-blue-900">
          {usersLoading ? <SmallSpinner /> : usersLength?.fetchAllUsers?.length}
        </h1>
      </div>
      {/* <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
        <div className="card-inner text-lg text-blue-900 flex items-center justify-between">
          <h3>UP SELLS</h3>
          <MdKeyboardDoubleArrowUp className="card_icon" />
        </div>
        <h1 className="text-blue-900">42</h1>
      </div> */}
    </div>
  );
};

export default Stats;
