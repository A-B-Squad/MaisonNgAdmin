import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@apollo/client";
import { DISCOUNT_PERCENTAGE_QUERY } from "@/app/graph/queries";

const AddPrice = ({
  discountPercentage,
  setDiscountPercentage,
  manualDiscountPrice,
  setManualDiscountPrice,
  originalPrice,
  setOriginalPrice,
  dateOfEndDiscount,
  setDateOfEndDiscount,
  dateOfStartDiscount,
  setDateOfStartDiscount,
  setSelectedDicountId,
}: any) => {
  const [discountType, setDiscountType] = useState<"percentage" | "manual">(
    "percentage"
  );
  const [discountedPrice, setDiscountedPrice] = useState<string>("0.00");
  const { data, loading, error } = useQuery(DISCOUNT_PERCENTAGE_QUERY);

  const handleOriginalPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    setOriginalPrice(price);
    if (discountType === "percentage") {
      calculateDiscountedPrice(price, discountPercentage);
    } else {
      calculateManualDiscountedPrice(price, manualDiscountPrice);
    }
  };

  const handleDiscountPercentageChange = (value: string) => {
    const percentage = parseInt(value) || 0;
    setDiscountPercentage(percentage);
    
    // Find the corresponding discount option and get its ID
    const selectedOption = discountOptions.find((option: { percentage: number; }) => option.percentage === percentage);
    if (selectedOption) {
      setSelectedDicountId(selectedOption.id);
    } else {
      setSelectedDicountId("");
    }
    calculateDiscountedPrice(originalPrice, percentage);
  };

  const handleManualDiscountPriceChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const discountPrice = parseFloat(e.target.value) || 0;
    setManualDiscountPrice(discountPrice);
    setSelectedDicountId(""); 
    calculateManualDiscountedPrice(originalPrice, discountPrice);
  };

  const handleDiscountTypeChange = (value: string) => {
    const type = value as "percentage" | "manual";
    setDiscountType(type);
    if (type === "percentage") {
      calculateDiscountedPrice(originalPrice, discountPercentage);
    } else {
      calculateManualDiscountedPrice(originalPrice, manualDiscountPrice);
    }
  };

  const calculateDiscountedPrice = (price: number, percentage: number) => {
    const discount = (price * percentage) / 100;
    const finalPrice = price - discount;
    setManualDiscountPrice(finalPrice)

    setDiscountedPrice(finalPrice.toFixed(2));
  };

  const calculateManualDiscountedPrice = (
    price: number,
    discountPrice: number
  ) => {
    const finalPrice = price - discountPrice;
    setManualDiscountPrice(finalPrice)
    setDiscountedPrice(finalPrice.toFixed(2));
  };

  const formatDate = (date: Date | null): string => {
    return date ? format(date, "yyyy-MM-dd HH:mm:ss.SSS") : "";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading discount percentages</p>;

  const discountOptions = data?.DiscountsPercentage || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full my-3 mx-auto">
      <h1 className="text-lg font-bold mb-4">Tarification</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prix
        </label>
        <input
          type="number"
          value={originalPrice}
          onChange={handleOriginalPriceChange}
          min="0"
          step="0.01"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="discount mb-4">
        <label className="block text-gray-700">Type de remise</label>
        <Select value={discountType} onValueChange={handleDiscountTypeChange}>
          <SelectTrigger className="w-full p-2 border border-gray-300 rounded mt-1">
            <SelectValue placeholder="Sélectionner le type de remise" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types de remise</SelectLabel>
              <SelectItem value="percentage">Pourcentage</SelectItem>
              <SelectItem value="manual">Valeur</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {discountType === "percentage" && (
          <div className="mt-4">
            <label className="block text-gray-700">
              Valeur de la remise (%)
            </label>
            <Select
              value={discountPercentage}
              onValueChange={handleDiscountPercentageChange}
            >
              <SelectTrigger className="w-full p-2 border border-gray-300 rounded mt-1">
                <SelectValue placeholder="Sélectionner la valeur de la remise" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Valeurs de la remise</SelectLabel>
                  {discountOptions.map((option: any) => (
                    <SelectItem key={option.id} value={option.percentage}>
                      {option.percentage}%
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {discountType === "manual" && (
          <div className="mt-4">
            <label className="block text-gray-700">
              Valeur de la remise (Direct)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={handleManualDiscountPriceChange}
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Date de début</label>
        <DatePicker
          selected={dateOfStartDiscount}
          onChange={(date) => setDateOfStartDiscount(date)}
          dateFormat="dd/MM/yyyy HH:mm:ss.SSS"
          showTimeInput
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Date de fin</label>
        <DatePicker
          selected={dateOfEndDiscount}
          onChange={(date) => setDateOfEndDiscount(date)}
          dateFormat="dd/MM/yyyy HH:mm:ss.SSS"
          showTimeInput
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prix après remise
        </label>
        <input
          type="text"
          value={discountedPrice}
          readOnly
          className="w-full outline-none p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  );
};

export default AddPrice;
