"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { COUPONS_QUERY } from "@/app/graph/queries";

import SearchBar from "../components/SearchBar";
import SmallSpinner from "../components/SmallSpinner";
import Pagination from "../components/Paginations";
import CouponsTable from "./components/CouponsTable";
import DeleteModal from "./components/DeleteModal";
import { DELETE_COUPONS_MUTATIONS } from "../graph/mutations";

interface Coupon {
  id: string;
  code: string;
  available: boolean;
  checkout: { id: string; createdAt: string }[];
}

interface InventoryProps {
  searchParams: {
    q?: string;
    order?: "USED" | "UNUSED";
  };
}

const Coupons: React.FC<InventoryProps> = ({ searchParams }) => {
  const { q, order } = searchParams;

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponsToDelete, setCouponsToDelete] = useState<string>("");
  const PAGE_SIZE = 10;

  const [searchCoupons] = useLazyQuery(COUPONS_QUERY);
  const [deleteCouponsMutation] = useMutation(DELETE_COUPONS_MUTATIONS);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await searchCoupons({
        variables: {
          page,
          pageSize: PAGE_SIZE,
        },
      });

      let fetchedCoupons = [...(data?.fetchAllCoupons || [])];
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchCoupons]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    let result = [...coupons];

    // Apply search filter
    if (q) {
      result = result.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(q.toLowerCase()) ||
          coupon.checkout[0]?.id.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Apply order filter
    if (order) {
      result.sort((a, b) =>
        order === "UNUSED"
          ? Number(a.available) - Number(b.available)
          : Number(b.available) - Number(a.available)
      );
    }

    setFilteredCoupons(result);
  }, [coupons, q, order]);

  const handleDeleteCoupons = async () => {
    if (!couponsToDelete) return;
    try {
      await deleteCouponsMutation({
        variables: {
          couponsId: couponsToDelete,
        },
      });
      await fetchCoupons();
      window.location.reload();

      setCouponsToDelete("");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting coupons:", error);
    }
  };

  const totalCount = filteredCoupons.length;
  const numberOfPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="w-full">
      <div className="container w-full pb-5">
        <h1 className="font-bold text-2xl py-5 px-4 w-full">
          Coupons{" "}
          <span className="text-gray-600 font-medium text-base">
            ({totalCount || 0})
          </span>
        </h1>
        <div className="mt-5 ">
          <SearchBar page="Coupons" />
          {loading ? (
            <div className="flex justify-center ">
              <SmallSpinner />
            </div>
          ) : (
            <CouponsTable
              coupons={filteredCoupons.slice(
                (page - 1) * PAGE_SIZE,
                page * PAGE_SIZE
              )}
              onDeleteClick={(coupon: Coupon) => {
                setCouponsToDelete(coupon.id);
                setShowDeleteModal(true);
              }}
              loading={loading}
            />
          )}
          {filteredCoupons.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={numberOfPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
      {showDeleteModal && couponsToDelete && (
        <DeleteModal
          onConfirm={handleDeleteCoupons}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Coupons;
