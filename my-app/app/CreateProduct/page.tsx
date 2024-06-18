"use client";
import React, { useState } from "react";
import ChoiceCategory from "./Components/ChoiceCategory";
import ChoiceBrand from "./Components/ChoiceBrand";
import AddStock from "./Components/AddStock";
import AddDescription from "./Components/AddDescription";
import AddPrice from "./Components/AddPrice";
import AddAttribute from "./Components/AddAttributes";
import UploadImage from "./Components/UploadImages";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT_MUTATIONS } from "../graph/mutations";
import AddReference from "./Components/AddRef";
import ChoiseColors from "./Components/ChoiseColors";
import { useToast } from "@/components/ui/use-toast";

interface Attribute {
  name: string;
  value: string;
}

const CreateProduct = () => {
  const { toast } = useToast();

  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "", value: "" },
  ]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [manualDiscountPrice, setManualDiscountPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [dateOfStartDiscount, setDateOfStartDiscount] = useState<Date | null>(
    null
  );
  const [dateOfEndDiscount, setDateOfEndDiscount] = useState<Date | null>(null);
  const [selectedDiscountId, setSelectedDicountId] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<boolean>(true);

  const [selectedIds, setSelectedIds] = useState({
    categoryId: "",
    subcategoryId: "",
    subSubcategoryId: "",
  });
  const [brand, setBrand] = useState<string | null >(null);
  const [createProductMutation] = useMutation(CREATE_PRODUCT_MUTATIONS);

  const handleSubmit = () => {
    const discount = {
      dateOfEnd: dateOfEndDiscount,
      dateOfStart: dateOfStartDiscount,
      discountId: selectedDiscountId,
      newPrice:  manualDiscountPrice,
    };

    const hasDiscount =
      discount.dateOfEnd && discount.dateOfStart && discount.newPrice;

    const productData = {
      input: {
        attributeInputs: attributes,
        brandId: brand,
        categories: [
          selectedIds.categoryId,
          selectedIds.subcategoryId,
          selectedIds.subSubcategoryId,
        ].filter(Boolean),
        description,
        name: title,
        images: uploadedImages,
        inventory: stock,
        isVisible: visibility,
        price: originalPrice,
        colorsId: selectedColor,
        reference,
        ...(hasDiscount && { discount: [discount] }),
      },
    };

    console.log(productData);

    createProductMutation({
      variables: productData,
      onCompleted() {
        // Reset all inputs
        setAttributes([{ name: "", value: "" }]);
        setUploadedImages([]);
        setTitle("");
        setDescription("");
        setStock(0);
        setReference("");
        setDiscountPercentage(0);
        setManualDiscountPrice(0);
        setOriginalPrice(0);
        setDateOfStartDiscount(null);
        setDateOfEndDiscount(null);
        setSelectedDicountId(null);
        setSelectedColor(null);
        setVisibility(true);
        setSelectedIds({
          categoryId: "",
          subcategoryId: "",
          subSubcategoryId: "",
        });
        setBrand("");

        // Show success toast
        toast({
          title: "Produit créé",
          description: "Le produit a été créé avec succès.",
          duration: 5000,
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-10 bg-slate-100 w-full">
      <h1 className="text-2xl font-bold mb-6">Créer un produit</h1>
      <div className="details flex w-full gap-5">
        <div className="baseDetails w-3/4 flex flex-col gap-3">
          <div className="p-3 rounded-md shadow-lg bg-white">
            <div className="title mb-4">
              <label className="text-lg font-bold mb-4">Titre</label>
              <input
                type="text"
                placeholder="Nom"
                className="w-full p-2 focus:border-black focus:shadow-md border placeholder:text-gray-200 transition-all outline-none border-gray-300 rounded mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <AddDescription
              description={description}
              setDescription={setDescription}
            />
          </div>

          <AddPrice
            discountPercentage={discountPercentage}
            setDiscountPercentage={setDiscountPercentage}
            manualDiscountPrice={manualDiscountPrice}
            setManualDiscountPrice={setManualDiscountPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            dateOfEndDiscount={dateOfEndDiscount}
            setDateOfEndDiscount={setDateOfEndDiscount}
            dateOfStartDiscount={dateOfStartDiscount}
            setDateOfStartDiscount={setDateOfStartDiscount}
            selectedDiscountId={selectedDiscountId}
            setSelectedDicountId={setSelectedDicountId}
          />

          <UploadImage
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />

          <AddAttribute attributes={attributes} setAttributes={setAttributes} />
        </div>

        <div className="moreDetails w-1/4 flex flex-col gap-3">
          <div className="visibility bg-white rounded-md shadow-md p-3">
            <label className="block border-b py-2 w-full text-gray-700 font-semibold tracking-wider">
              Visibilité
            </label>
            <div className="flex w-full gap-2 py-3 my-2 px-1 cursor-pointer border-slate-200 rounded-md border justify-start">
              <input
                type="checkbox"
                className="checkbox-custom relative border-gray-300 w-5 h-5 appearance-none bg-white border rounded-md cursor-pointer checked:bg-mainColorAdminDash"
                checked={visibility}
                onChange={(e) => setVisibility(e.target.checked)}
              />
              <label className="text-sm">Boutique en ligne</label>
            </div>
          </div>

          <ChoiceCategory
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />

          <AddStock stock={stock} setStock={setStock} />
          <AddReference reference={reference} setReference={setReference} />
          <ChoiseColors
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
          <ChoiceBrand brand={brand} setBrand={setBrand} />
        </div>
      </div>
      <button
        type="button"
        className="w-full py-3 mt-6 hover:opacity-90 transition-all bg-mainColorAdminDash text-white rounded-md shadow-sm hover:bg-mainColorAdminDash-dark"
        onClick={handleSubmit}
      >
        Créer le produit
      </button>
    </div>
  );
};

export default CreateProduct;
