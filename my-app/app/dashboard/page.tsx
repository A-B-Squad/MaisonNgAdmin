"use client";

import React, { useEffect, useState } from "react";
import { LuPackage2 } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
// import { useQuery } from "@apollo/client";
import moment from "moment-timezone";

const DEFAULT_TIMEZONE = 'Africa/Tunis'; // Set default timezone to Tunisia


const getStats = (packages:any) => {
  const stats = {
    today: [0, 0],
    lastDay: [0, 0],
    thisWeek: [0, 0],
    thisMonth: [0, 0],
    thisYear: [0, 0],
  };

  packages.forEach((pkg:any) => {
    // Convert the timestamp to a date object
    const packageDate = moment.tz(new Date(parseInt(pkg.createdAt)), DEFAULT_TIMEZONE);
    console.log("Package Date:", packageDate.format("YYYY-MM-DD HH:mm:ss"));

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

  console.log("Stats:", stats);
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

  const fetchPackages = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetAllPackages {
            getAllPackages {
              id
              checkoutId
              status
              createdAt
              Checkout {
                id
                total
              }
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data) {
      setPackageData(result.data.getAllPackages);
    } else {
      console.error(result.errors);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);



  useEffect(() => {
    if (packageData.length) {
      const calculatedStats = getStats(packageData);
      setStats(calculatedStats);
    }
  }, [packageData]);



  return (
    <div className="w-full p-8">
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
