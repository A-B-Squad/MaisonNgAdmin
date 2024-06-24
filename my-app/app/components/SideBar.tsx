"use client";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { CiHome, CiSettings } from "react-icons/ci";
import { LuPackage2, LuUsers2, LuNewspaper } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { FcAdvertising } from "react-icons/fc";
import Link from "next/link";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // State to manage expanded submenus
  const [expandedMenu, setExpandedMenu] = useState(null);
  const handleSubMenuToggle = (index: number) => {
    if (expandedMenu === index) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(index);
    }
  };

  // Sidebar items with submenus
  const sidebarItems = [
    {
      icon: <CiHome size={24} />,
      text: "Tableau de bord",
      href: "/Dashboard",
      subItems: [],
    },
    {
      icon: <LuPackage2 size={24} />,
      text: "Commandes",
      href: "/packages",
      subItems: [],
    },
    {
      icon: <TbPackages size={24} />,
      text: "Produits",
      href: "/products",
      subItems: [
        { text: "Tous les produits", href: "/Products" },
        { text: "Nouveau produit", href: "/CreateProduct" },
        { text: "Categoriés", href: "/Categories" },
        { text: "Inventaire", href: "/Inventory" },
        { text: "Commentaires", href: "/categories" },
      ],
    },
    {
      icon: <MdKeyboardDoubleArrowUp size={24} />,
      text: "Up Sells",
      href: "/best-sales",
      subItems: [],
    },
    {
      icon: <LuUsers2 size={24} />,
      text: "Gestion",
      href: "#",
      subItems: [
        { text: "Clients", href: "/clients" },
        { text: "Categories", href: "/categories" },
      ],
    },
    {
      icon: <FaRegChartBar size={24} />,
      text: "Statistiques",
      href: "/statistics",
      subItems: [],
    },
    {
      icon: <LuNewspaper size={24} />,
      text: "Factures",
      href: "/invoices",
      subItems: [],
    },
    {
      icon: <FcAdvertising size={24} />,
      text: "Boutique",
      href: "/Shop",
      subItems: [],
    },
    {
      icon: <CiSettings size={24} />,
      text: "Réglages",
      href: "/settings",
      subItems: [],
    },
  ];

  return (
    <div
      className={`sideBar flex h-screen overflow-y-auto sticky top-0 left-0 z-50 bg-mainColorAdminDash  transition-all duration-300 ${
        isExpanded ? "w-64" : " w-[5%]"
      }`}
    >
      <div
        className={` shadow md:h-full flex-col justify-between w-full transition-width duration-300`}
      >
        <div>
          <ul className="mt-4">
            <li className="flex w-full py-4 px-4 justify-between text-white cursor-pointer outline-none items-center transition">
              <button
                className="flex items-center focus:outline-none focus:ring-2 outline-none focus:ring-white"
                onClick={toggleSidebar}
              >
                <IoMenu size={30} />
                {isExpanded && <span className="text-lg ml-2">MaisonNg</span>}
              </button>
            </li>
            {sidebarItems.map((item, index) => (
              <React.Fragment key={index}>
                <li
                  className={` ${
                    expandedMenu === index ? "bg-[#ffffff3d]" : ""
                  } flex w-full py-3 px-4 justify-between text-white  hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition`}
                  onClick={() => handleSubMenuToggle(index)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {item.icon}
                    {isExpanded && (
                      <span className="text-md ml-2">{item.text}</span>
                    )}
                  </Link>
                </li>
                {/* Render subitems if expandedMenu matches current index */}
                {expandedMenu === index && item.subItems.length > 0 && (
                  <ul className="bg-[#ffffff3d]  text-white">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="flex w-full py-2 px-4 justify-between rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition"
                      >
                        <Link
                          href={subItem.href}
                          className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          {subItem.icon}
                          {isExpanded && (
                            <span className="text-sm ml-2">{subItem.text}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
