"use client";

import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) {
      params.append('q', query);
    }
    if (order) {
      params.append('order', order);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [query, order, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFiltreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('====================================');
    console.log(e.target.value);
    console.log('====================================');
    setOrder(e.target.value);
  };

  return (
    <form className="flex w-full gap-3 px-3" onSubmit={(e) => e.preventDefault()}>
      <div className="relative flex w-[80%]">
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="Trouver un produit"
          className="px-10 w-full h-10 rounded-l border-2"
        />
        <button
          type="submit"
          className="absolute left-1 bottom-2 text-gray-700 z-50 cursor-pointer"
        >
          <IoSearch size={24} />
        </button>
      </div>
      <select
        onChange={handleFiltreChange}
        id="pricingType"
        name="pricingType"
        className="w-[20%] h-10 border-2 border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
      >
        <option value="">Filtres de recherche</option>
        <option value="ASC">prix : Asc</option>
        <option value="DESC">prix : Desc</option>
      </select>
    </form>
  );
};

export default SearchBar;
