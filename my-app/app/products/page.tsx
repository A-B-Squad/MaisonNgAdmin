"use client";
import React, { useState } from "react";
import Stats from "../components/stats";
import SearchBar from "../components/searchBar";
import { FiEdit2 } from "react-icons/fi";
import { BiShow } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { SEARCH_PRODUCTS_QUERY } from "../graph/queries";
import { useQuery } from "@apollo/client";
import moment from "moment";

const Products = () => {
  const [products, setProducts] = useState([]);

  const formatDate = (timestamp) => {
    return moment(parseInt(timestamp, 10)).format("DD/MM/YYYY");
  };

  const { loading } = useQuery(SEARCH_PRODUCTS_QUERY, {
    variables: {
      input: {
        query: "",
        pageSize: 5,
        page: 1,
      },
    },
    onCompleted(data) {
      console.log("====================================");
      console.log(data);
      console.log("====================================");
      setProducts(data.searchProducts.results.products);
    },
  });

  return (
    <div className="w-full p-8">
      <Stats />
      <div className="w-full mt-10 border shadow-md rounded-sm">
        <h1 className="font-bold text-2xl py-5 px-4 border-b-2 w-full">
          Produits{" "}
        </h1>
        <div className="mt-5 ">
          <SearchBar />
          {loading ? (
            <div>loading</div>
          ) : (
            <section className="container mx-auto py-6 px-3 font-mono relative">
              <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        <th className="px-4 py-3">Nom</th>
                        <th className="px-4 py-3">Prix</th>
                        <th className="px-4 py-3">Visibilité</th>
                        <th className="px-4 py-3">Date de création</th>
                        <th className="px-4 py-3">Commandes</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {products?.map((product: any) => (
                        <tr className="text-gray-700">
                          <td className="px-4 py-3 border">
                            <div className="flex items-center text-sm">
                              <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                                <img
                                  className="object-cover w-full h-full rounded-full"
                                  src={product.images[0]}
                                  alt=""
                                  loading="lazy"
                                />
                                <div
                                  className="absolute inset-0 rounded-full shadow-inner"
                                  aria-hidden="true"
                                ></div>
                              </div>
                              <div>
                                <p className="font-semibold text-black">
                                  {product.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ms font-semibold border">
                            22
                          </td>
                          <td className="px-4 py-3 text-xs border">
                            <span
                              className={`px-2 py-1 font-semibold leading-tight ${
                                !product.visibility
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }   rounded-sm`}
                            >
                              {!product.visibility ? "Visible" : "Non visible"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm border">{formatDate(product.createdAt)}</td>
                          <td className="px-4 py-3 text-sm border">
                            {product.solde}
                          </td>
                          <td className="px-4 py-3 text-sm border">
                            <div className="flex justify-center items-center gap-2">
                              <button className="p-2 w-10 h-10 rounded-full border-2">
                                <FiEdit2 size={20} />
                              </button>
                              <button className="p-2 w-10 h-10 rounded-full border-2">
                                <BiShow size={22} />
                              </button>
                              <button className="p-2 w-10 h-10 rounded-full border-2">
                                <MdDeleteOutline size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="">
                <button className="text-white p-3 rounded-md bg-mainColorAdminDash">
                  Ajouter un produit +
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
