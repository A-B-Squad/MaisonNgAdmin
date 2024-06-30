"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import SmallSpinner from "../components/SmallSpinner";
import Pagination from "../components/Paginations";
import ProductTable from "./components/productTable";
import DeleteModal from "./components/DeleteModal";
import useProducts from "./hooks/UseProducts";
import { DELETE_PRODUCT_MUTATIONS } from "../graph/mutations";

const PAGE_SIZE = 10;

interface ProductsProps {
  searchParams: {
    q?: string;
    order?: "ASC" | "DESC";
  };
}

const Products = ({ searchParams }: any) => {
  const { q, order } = searchParams;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { products, totalCount, loading, page, setPage, fetchProducts } =
    useProducts(q, order, PAGE_SIZE);

  const [deleteProductMutation] = useMutation(DELETE_PRODUCT_MUTATIONS);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation({
        variables: {
          productId: productToDelete.id,
        },
      });
      await fetchProducts();
      setProductToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="container w-full border shadow-md rounded-sm pb-6">
        <h1 className="font-bold text-2xl py-5 px-4 border-b-2 w-full">
          Produits{" "}
          <span className="text-gray-600 font-medium text-base">
            ({products.length || 0})
          </span>
        </h1>
        <div className="mt-5">
          <SearchBar page="Products" />
          {loading ? (
            <div className="flex justify-center py-10">
              <SmallSpinner />
            </div>
          ) : (
            <ProductTable
              products={products}
              onDeleteClick={(product) => {
                setProductToDelete(product);
                setShowDeleteModal(true);
              }}
            />
          )}
          <div className="pagination flex justify-between items-center">
            {products.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalCount / PAGE_SIZE)}
                onPageChange={setPage}
              />
            )}
            <Link
              href="Products/CreateProduct"
              className="text-white py-2 hover:opacity-85 transition-opacity px-8 rounded-md shadow-md bg-mainColorAdminDash"
            >
              Ajouter un produit +
            </Link>
          </div>
        </div>
      </div>
      {showDeleteModal && productToDelete && (
        <DeleteModal
          productName={productToDelete.name}
          onConfirm={handleDeleteProduct}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Products;
