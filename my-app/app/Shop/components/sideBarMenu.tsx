"use client";
import Link from "next/link";
import React, { useState } from "react";

const SideBarShopMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0); // State to keep track of active menu item

  const menuValue = [
    {
      title: "Carousel Ads",
      link: "/Shop/CarouselAdvertising", // Add the actual link here
    },
    {
      title: "À côté de Carousel",
      link: "/Shop/NextToCarouselAdvertising", // Add the actual link here
    },
    {
      title: "Home Banner",
      link: "/Shop/BannerAdvertising", // Add the actual link here
    },
    {
      title: "grand publicite",
      link: "/Shop/BigAdvertising", // Add the actual link here
    },
    {
      title: "Home Banner",
      link: "/Shop/BannerAdvertising", // Add the actual link here
    },
    {
      title: "Side Ads",
      link: "/Shop/SideAdvertising", // Add the actual link here
    },
    {
      title: "Company information",
      link: "#", // Add the actual link here
    },
  ];

  const handleClick = (index: React.SetStateAction<number>) => {
    setActiveIndex(index); // Update the active index when a menu item is clicked
  };

  return (
    <div className="h-96 w-56 min-w-56 shadow-lg sticky top-0 left-0">
      <ul className="bg-gray-200 w-full h-full  rounded-md p-3 divide-y divide-gray-300">
        {menuValue.map((data, index) => (
          <li key={index} className="py-1" onClick={() => handleClick(index)}>
            <Link
              className={`py-2 cursor-pointer w-full flex h-full transition-all ${
                index === activeIndex ? "font-semibold border-b " : "hover:font-semibold hover:border-b "
              }`}
              href={data.link}
            >
              {data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarShopMenu;
