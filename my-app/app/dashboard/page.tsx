"use client";

import React, { useEffect, useState } from "react";
import { LuPackage2 } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import moment from "moment-timezone";
import { GET_PACKAGES_QUERY } from "../graph/queries";
import { useQuery } from "@apollo/client";
import Stats from "../components/stats";

const DEFAULT_TIMEZONE = "Africa/Tunis"; // Set default timezone to Tunisia

const getStats = (packages: any) => {
  const stats = {
    today: [0, 0],
    lastDay: [0, 0],
    thisWeek: [0, 0],
    thisMonth: [0, 0],
    thisYear: [0, 0],
  };

  packages.forEach((pkg: any) => {
    // Convert the timestamp to a date object
    const packageDate = moment.tz(
      new Date(parseInt(pkg.createdAt)),
      DEFAULT_TIMEZONE
    );
    if (pkg.status === "DELIVERED") {
      if (packageDate.isSame(moment(), "day")) {
        stats.today[0]++;
        stats.today[1] += pkg.Checkout.total;
      } else if (packageDate.isSame(moment().subtract(1, "days"), "day")) {
        stats.lastDay[0]++;
        stats.lastDay[1] += pkg.Checkout.total;
      } else if (packageDate.isSame(moment(), "week")) {
        stats.thisWeek[0]++;
        stats.thisWeek[1] += pkg.Checkout.total;
      } else if (packageDate.isSame(moment(), "month")) {
        stats.thisMonth[0]++;
        stats.thisMonth[1] += pkg.Checkout.total;
      } else if (packageDate.isSame(moment(), "year")) {
        stats.thisYear[0]++;
        stats.thisYear[1] += pkg.Checkout.total;
      }
    }
  });
  return stats;
};

const Dashboard = () => {
  const [packageData, setPackageData] = useState([]);
  const [stats, setStats] = useState({
    today: [0, 0],
    lastDay: [0, 0],
    thisWeek: [0, 0],
    thisMonth: [0, 0],
    thisYear: [0, 0],
  });

  const { loading } = useQuery(GET_PACKAGES_QUERY, {
    onCompleted: (data: any) => {
      setPackageData(data.getAllPackages);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (packageData.length) {
      const calculatedStats = getStats(packageData);
      setStats(calculatedStats);
    }
  }, [packageData]);

  useEffect(() => {
    if (packageData.length) {
      const calculatedStats = getStats(packageData);
      setStats(calculatedStats);
    }
  }, [packageData]);

  return (
    <div className="w-full p-8 relative">
      <Stats />
      <div className="w-full mt-10 border shadow-md rounded-sm">
        <h1 className="font-semibold py-5 px-4 border-b-2 w-full">
          Aperçu de votre tableau de bord
        </h1>
        <div className="flex justify-around mt-8 p-5">
          <div className="border w-[45%] rounded-sm">
            <h1 className="flex items-center justify-center gap-2 p-3 font-bold w-full border-b-2">
              <LuPackage2 size={24} />
              Commandes
            </h1>
            <div className="m-5 border rounded-sm flex flex-col">
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Aujourd’hui</span>
                <span className="font-bold">{stats.today[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Hier</span>
                <span className="font-bold">{stats.lastDay[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Cette semaine</span>
                <span className="font-bold">{stats.thisWeek[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Ce mois-ci</span>
                <span className="font-bold">{stats.thisMonth[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Cette année</span>
                <span className="font-bold">{stats.thisYear[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Total</span>
                <span className="font-bold">{packageData.length}</span>
              </div>
            </div>
          </div>
          <div className="border w-[45%] rounded-sm">
            <h1 className="flex items-center justify-center gap-2 p-3 font-bold w-full border-b-2">
              <MdOutlineAttachMoney size={24} />
              Gains
            </h1>
            <div className="m-5 border rounded-sm flex flex-col">
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Aujourd’hui</span>
                <span className="font-bold">{stats.today[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Hier</span>
                <span className="font-bold">{stats.lastDay[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Cette semaine</span>
                <span className="font-bold">{stats.thisWeek[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Ce mois-ci</span>
                <span className="font-bold">{stats.thisMonth[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Cette année</span>
                <span className="font-bold">{stats.thisYear[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-bold text-gray-600">Total</span>
                <span className="font-bold">
                  {stats.today[1] +
                    stats.lastDay[1] +
                    stats.thisWeek[1] +
                    stats.thisMonth[1] +
                    stats.thisYear[1]}{" "}
                  TND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
