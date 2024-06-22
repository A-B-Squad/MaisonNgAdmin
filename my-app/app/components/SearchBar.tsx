"use client";

import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  page: "Categories" | "products";
}

const SearchBar: React.FC<SearchBarProps> = ({ page }) => {
  const [query, setQuery] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) {
      params.append("q", query);
    }
    if (order) {
      params.append("order", order);
    }
    router.push(`/${page}?${params.toString()}`, { scroll: false });
  }, [query, order, router, page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFiltreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
  };

  const getPlaceholder = () => {
    return page === "Categories"
      ? "Rechercher une catégorie"
      : "Trouver un produit";
  };


  return (
    <form
      className="flex w-full gap-3 px-3 mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative flex w-[80%]">
        <input
          onChange={handleInputChange}
          type="text"
          placeholder={getPlaceholder()}
          className="px-10 w-full h-10 rounded-l border-2"
        />
        <button
          type="submit"
          className="absolute left-1 bottom-2 text-gray-700  cursor-pointer"
        >
          <IoSearch size={24} />
        </button>
      </div>
      {page !== "Categories" && (
        <select
          onChange={handleFiltreChange}
          className="w-[20%] h-10 border-2 border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Filtres de recherche</option>
          <option value="ASC">prix : Asc</option>
          <option value="DESC">prix : Desc</option>
        </select>
      )}
    </form>
  );
};

export default SearchBar;
