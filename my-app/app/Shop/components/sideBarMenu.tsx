"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const SideBarShopMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const path = usePathname();

  // Define your menu items with titles and corresponding paths
  const menuValue = [
    {
      title: "Publicités en Carrousel",
      link: "/Shop/CarouselAdvertising",
    },
    {
      title: "À côté du Carrousel",
      link: "/Shop/NextToCarouselAdvertising",
    },
    {
      title: "Bannière Accueil",
      link: "/Shop/BannerAdvertising",
    },
    {
      title: "Grande Publicité",
      link: "/Shop/BigAdvertising",
    },
    {
      title: "Publicités Latérales",
      link: "/Shop/SideAdvertising",
    },
    {
      title: "Informations sur l'Entreprise",
      link: "/Shop/CompanyInfo",
    },
  ];

  // Function to determine the active index based on the current path
  const determineActiveIndex = () => {
    const index = menuValue.findIndex((item) => path.startsWith(item.link));
    return index !== -1 ? index : 0; // Default to first item if no match found
  };

  // Set active index on component mount and when path changes
  useEffect(() => {
    setActiveIndex(determineActiveIndex());
  }, [path]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="h-96 w-56 min-w-56 shadow-lg sticky top-36 left-60">
      <ul className="bg-slate-100 w-full h-full rounded-md p-3 divide-y divide-gray-300">
        {menuValue.map((data, index) => (
          <li
            key={index}
            className={`py-1 relative ${
              index === activeIndex ? "before:w-full" : "before:w-0"
            } before:bg-mainColorAdminDash before:h-[1px] before:transition-all before:bottom-0 before:w-0 before:absolute before:left-0 hover:before:w-full hover:before:h-[1px]`}
            onClick={() => handleClick(index)}
          >
            <Link href={data.link}>
              <p
                className={`py-2 cursor-pointer w-full flex h-full transition-all ${
                  index === activeIndex
                    ? "font-semibold border-b "
                    : "hover:font-semibold hover:border-b "
                }`}
              >
                {data.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarShopMenu;
