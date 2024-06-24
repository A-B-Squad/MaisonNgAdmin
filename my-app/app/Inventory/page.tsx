"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import { SEARCH_PRODUCTS_QUERY } from "../graph/queries";
import { UPDATE_PRODUCT_INVENTORY_MUTATION } from "../graph/mutations";
import SearchBar from "../components/SearchBar";
import SmallSpinner from "../components/SmallSpinner";
import Pagination from "../components/Paginations";
import InventoryTable from "./components/InventoryTable";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  reference: string;
  solde: number;
  inventory: number;
  images: string[];
  categories: any[];
}

interface InventoryProps {
  searchParams: {
    q?: string;
    order?: "ASC" | "DESC";
  };
}

const Inventory: React.FC<InventoryProps> = ({ searchParams }) => {
  const { q: query, order } = searchParams;
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 10;
  const numberOfPages = Math.ceil(totalCount / PAGE_SIZE);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const [updateInventory] = useMutation(UPDATE_PRODUCT_INVENTORY_MUTATION);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await searchProducts({
        variables: {
          input: {
            query: query || undefined,
            page,
            pageSize: PAGE_SIZE,
          },
        },
      });

      let fetchedProducts = [
        ...(data?.searchProducts?.results?.products || []),
      ];

      if (order) {
        fetchedProducts.sort((a, b) =>
          order === "ASC" ? a.price - b.price : b.price - a.price
        );
      }

      setProducts(fetchedProducts);
      setTotalCount(data?.searchProducts?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, query, order, searchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToInventory = async (productId: string) => {
    const inputValue = inputRefs.current[productId]?.value;
    if (!inputValue) {
      toast({
        title: "Erreur : Informations manquantes",
        className: "text-white bg-red-600 border-0",
        description: "Veuillez remplir tous les champs obligatoires.",
        duration: 5000,
    });

      return;
    }

    const inventoryToAdd = parseInt(inputValue, 10);

    if (isNaN(inventoryToAdd)) {
      console.error("Invalid inventory value");
      return;
    }

    try {
      await updateInventory({
        variables: {
          productId,
          inventory: inventoryToAdd,
        },
        onCompleted() {
          if (inputRefs.current[productId]) {
            inputRefs.current[productId].value = "";
          }
        },
      });
      await fetchProducts();
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="container w-full pb-5">
        <h1 className="font-bold text-2xl py-5 px-4 w-full">
          Produits{" "}
          <span className="text-gray-600 font-medium text-base">
            ({products.length || 0})
          </span>
        </h1>
        <div className="mt-5 ">
          <SearchBar page="Inventory" />
          {loading ? (
            <div className="flex justify-center ">
              <SmallSpinner />
            </div>
          ) : (
            <InventoryTable
              products={products}
              inputRefs={inputRefs}
              handleAddToInventory={handleAddToInventory}
            />
          )}
          {products.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={numberOfPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
