"use client";
import React, { useCallback, useEffect, useState } from "react";
import Stats from "../components/stats";
import { FiEdit2 } from "react-icons/fi";
import { BiShow } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { SEARCH_PRODUCTS_QUERY } from "../graph/queries";
import { useLazyQuery, useMutation } from "@apollo/client";

import moment from "moment";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";
import Image from "next/image";
import prepRoute from "../Helpers/_prepRoute";
import Link from "next/link";
import { DELETE_PRODUCT_MUTATIONS } from "../graph/mutations";
import SearchBar from "../components/SearchBar";

const Products = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q");
  const order = searchParams?.get("order");

  console.log("====================================");
  console.log("query: ", query, " order: ", order);
  console.log("====================================");
  const [products, setProducts] = useState<any>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const numberOfPages = Math.ceil(totalCount / pageSize);

  // Define the deleteProduct mutation once
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT_MUTATIONS);

  const formatDate = (timestamp: any) => {
    return moment(parseInt(timestamp, 10)).format("DD/MM/YYYY");
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation({
        variables: {
          productId: productId,
        },
      });
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await searchProducts({
        variables: {
          input: {
            query: query || undefined,
            page,
            pageSize,
          },
        },
      });

      const fetchedProducts = [
        ...(data?.searchProducts?.results?.products || []),
      ];
      if (order === "ASC") {
        fetchedProducts.sort((a, b) => a.price - b.price);
      } else if (order === "DESC") {
        fetchedProducts.sort((a, b) => b.price - a.price);
      }

      setProducts(fetchedProducts);
      setTotalCount(data?.searchProducts?.totalCount || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  }, [page, pageSize, query, order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 6;
    const pages: React.ReactNode[] = [];
    const startPage = Math.max(
      1,
      Math.min(
        page - Math.floor(maxPagesToShow / 2),
        numberOfPages - maxPagesToShow + 1
      )
    );

    for (
      let i = startPage;
      i < startPage + maxPagesToShow && i <= numberOfPages;
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer text-mainColorAdminDash border border-mainColorAdminDash hover:bg-mainColorAdminDash hover:text-white ${
            page === i
              ? "bg-mainColorAdminDash text-white"
              : "bg-white text-mainColorAdminDash"
          }`}
        >
          {i}
        </button>
      );
    }

    if (numberOfPages > maxPagesToShow) {
      pages.push(
        <span
          key="more-pages"
          className="flex items-center justify-center px-3 h-8 text-mainColorAdminDash border border-mainColorAdminDash"
        >
          ...
        </span>
      );
    }

    return pages;
  };

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
            <Loading />
          ) : (
            <section className="container mx-auto py-6 px-3 font-mono relative">
              {showDeleteAlert && (
                <div className="absolute w-full h-full bg-lightBlack flex justify-center items-center">
                  <div className="w-4/5 bg-white rounded-md border p-4">
                    <p>Voulez-vous vraiment supprimer ce produit ?</p>
                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        className="px-4 py-2 rounded-md bg-gray-300"
                        onClick={() => setShowDeleteAlert(false)}
                      >
                        Annuler
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-red-500 text-white"
                        onClick={() => {
                          if (productIdToDelete) {
                            handleDeleteProduct(productIdToDelete);
                            setShowDeleteAlert(false);
                            setProductIdToDelete(null);
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-md font-semibold tracking-wide text-center text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        <th className="px-4 py-3">Nom</th>
                        <th className="px-4 py-3">Prix</th>
                        <th className="px-4 py-3">Promotion</th>
                        <th className="px-4 py-3">Promo Fini</th>
                        <th className="px-4 py-3">Visibilité</th>
                        <th className="px-4 py-3">Date de création</th>
                        <th className="px-4 py-3">Commandes</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {products?.map((product: any) => (
                        <tr className="text-gray-700" key={product.id}>
                          <td className="Image px-4 py-3 border">
                            <div className="flex items-center text-sm">
                              <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                                <Image
                                  className="object-cover w-full h-full rounded-full"
                                  src={product.images[0]}
                                  layout="fill"
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
                          <td className="Price text-center px-4 py-3 text-ms font-semibold border">
                            {product.price.toFixed(3)}
                          </td>
                          <td className="Discount px-4 text-center py-3 text-ms font-semibold border">
                            {product?.productDiscounts.length > 0
                              ? product.productDiscounts[0].newPrice.toFixed(
                                  3
                                ) + "TND"
                              : "_________"}
                          </td>
                          <td className="Discount px-4 text-center py-3 text-ms font-semibold border">
                            {product?.productDiscounts.length > 0
                              ? formatDate(
                                  product.productDiscounts[0]?.dateOfEnd
                                )
                              : "_________"}
                          </td>
                          <td className="visibility text-center px-4 py-3 text-sm border">
                            <span
                              className={`px-2 py-1  font-semibold leading-tight ${
                                !product.visibility
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }   rounded-sm`}
                            >
                              {!product.visibility ? "Visible" : "Non visible"}
                            </span>
                          </td>
                          <td className="createdAt text-center px-4 py-3 text-sm border">
                            {formatDate(product.createdAt)}
                          </td>
                          <td className="Inventory text-center px-4 py-3 text-sm border">
                            {product.solde}
                          </td>
                          <td className="Edits px-4 py-3 text-sm border">
                            <div className="flex justify-center items-center gap-2">
                              <button className="p-2 w-10 h-10 rounded-full border-2">
                                <FiEdit2 size={20} />
                              </button>
                              <Link
                                target="_blank"
                                href={{
                                  pathname: `http://localhost:3000/products/tunisie/${prepRoute(
                                    product.name
                                  )}`,
                                  query: {
                                    productId: product?.id,
                                    collection: [
                                      product?.categories[0]?.name,
                                      product?.categories[0]?.id,
                                      product?.categories[0]?.subcategories[0]
                                        ?.name,
                                      product?.categories[1]?.subcategories[0]
                                        ?.id,
                                      product?.categories[0]?.subcategories[0]
                                        ?.subcategories[1]?.name,
                                      product?.categories[0]?.subcategories[0]
                                        ?.subcategories[1]?.id,
                                      product?.name,
                                    ],
                                  },
                                }}
                                className="p-2 w-10 h-10 rounded-full border-2"
                              >
                                <BiShow size={22} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setProductIdToDelete(product.id);
                                  setShowDeleteAlert(true);
                                }}
                                className="p-2 w-10 h-10 rounded-full border-2"
                              >
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
              <div className="pagination flex justify-between">
                {products.length > 0 && (
                  <div className="Page pagination justify-self-start h-32">
                    <ul className="inline-flex -space-x-px text-sm">
                      <li>
                        <button
                          onClick={handlePrevPage}
                          disabled={page === 1}
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-mainColorAdminDash bg-white border border-mainColorAdminDash rounded-s-lg  ${
                            page !== 1 &&
                            "hover:bg-mainColorAdminDash hover:text-white"
                          } `}
                        >
                          Previous
                        </button>
                      </li>
                      {renderPageNumbers()}
                      <li>
                        <button
                          onClick={handleNextPage}
                          disabled={page === Math.ceil(totalCount / pageSize)}
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-mainColorAdminDash bg-white border border-mainColorAdminDash rounded-e-lg  ${
                            page !== Math.ceil(totalCount / pageSize) &&
                            "hover:bg-mainColorAdminDash hover:text-white"
                          } `}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                <Link href={"/CreateProduct"} className="text-white h-12 p-3 rounded-md bg-mainColorAdminDash">
                  Ajouter un produit +
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
