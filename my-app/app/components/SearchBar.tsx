import React from 'react'
import { IoSearch } from 'react-icons/io5'

const SearchBar = () => {
  return (
    <form className="flex w-full gap-3 px-3">
    <div className="relative flex w-[80%]">
      <input
        type="text"
        placeholder="Trouver un produit"
        className=" px-10 w-full h-10 rounded-l border-2  "
      />
      <button
        type="submit"
        className="absolute left-1 bottom-2 text-gray-700 z-50 cursor-pointer"
      >
        <IoSearch  size={24}/>
      </button>
    </div>
    <select
      id="pricingType"
      name="pricingType"
      className="w-[20%] h-10 border-2 border-sky-500  text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
    >
      <option value="All">Filtres de recherche</option>
      <option value="Freemium">Freemium</option>
      <option value="Free">Free</option>
      <option value="Paid">Paid</option>
    </select>
  </form>
  )
}

export default SearchBar