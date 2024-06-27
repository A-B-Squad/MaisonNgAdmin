"use client";
import React, { useEffect, useState } from "react";
import ChoiceCategory from "./Components/UpdateCategory";
import UpdateBrand from "./Components/UpdateBrand";
import UpdateInventory from "./Components/UpdateInventory";
import UpdateDescription from "./Components/UpdateDescription";
import UpdatePrice from "./Components/UpdatePrice";
import UpdateAttribute from "./Components/UpdateAttributes";
import UpdateImage from "./Components/UploadImages";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PRODUCT_MUTATIONS } from "../../graph/mutations";
import UpdateReference from "./Components/UpdateReference";
import UpdateColors from "./Components/UpdateColors";
import { useToast } from "@/components/ui/use-toast";
import { PRODUCT_BY_ID_QUERY } from "../../graph/queries";
import Load from "./Load";

interface Attribute {
  name: string;
  value: string;
}

const UpdateProduct = ({ searchParams }: any) => {
  const { toast } = useToast();
  const productId = searchParams.productId;
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "", value: "" },
  ]);
  const [discountType, setDiscountType] = useState<"percentage" | "manual">(
    "percentage",
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [manualDiscountPrice, setManualDiscountPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [dateOfStartDiscount, setDateOfStartDiscount] = useState<Date | null>(
    null,
  );
  const [dateOfEndDiscount, setDateOfEndDiscount] = useState<Date | null>(null);
  const [selectedDiscountId, setSelectedDicountId] = useState<string | null>(
    null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<boolean>(true);
  const [discountedPrice, setDiscountedPrice] = useState<string>("0.00");

  const [selectedIds, setSelectedIds] = useState({
    categoryId: "",
    subcategoryId: "",
    subSubcategoryId: "",
  });
  const [brand, setBrand] = useState<string | null>(null);
  const [updateProductMutation] = useMutation(UPDATE_PRODUCT_MUTATIONS);

  const {
    data: productDataById,
    loading,
    error,
  } = useQuery(PRODUCT_BY_ID_QUERY, {
    variables: { productByIdId: productId },
  });

  useEffect(() => {
    if (!loading && !error && productDataById) {
      const product = productDataById.productById;
      setTitle(product.name);
      setDescription(product.description);
      setStock(product.inventory);
      setReference(product.reference);
      setUploadedImages(product.images);
      setOriginalPrice(product.price);
      setVisibility(product.isVisible);
      setSelectedColor(product.Colors?.id);
      setBrand(product.Brand?.id);
      setAttributes(
        product.attributes.map((attr: { name: any; value: any }) => ({
          name: attr.name,
          value: attr.value,
        })),
      );

      if (product.categories.length > 0) {
        const category = product.categories[0];
        setSelectedIds({
          categoryId: category.id,
          subcategoryId:
            category.subcategories.length > 0
              ? category.subcategories[0].id
              : "",
          subSubcategoryId:
            category.subcategories.length > 0 &&
            category.subcategories[0].subcategories.length > 0
              ? category.subcategories[0].subcategories[0].id
              : "",
        });
      }

      if (product.productDiscounts && product.productDiscounts.length > 0) {
        const discount = product.productDiscounts[0];

        if (discount.discountId) {
          setDiscountType("percentage");
          setSelectedDicountId(discount.discountId);
        } else {
          setDiscountType("manual");
          setManualDiscountPrice(product.price - discount.newPrice);
        }
      }
    }
  }, [productDataById, loading, error]);

  const handleUpdateProduct = () => {
    if (
      !title ||
      !description ||
      !uploadedImages.length ||
      !selectedIds.categoryId
    ) {
      toast({
        title: "Erreur de mise à jour",
        className: "text-white bg-red-600 border-0",
        description: "Veuillez remplir tous les champs obligatoires.",
        duration: 5000,
      });
      return;
    }

    const discount = {
      dateOfEnd: dateOfEndDiscount,
      dateOfStart: dateOfStartDiscount,
      discountId: selectedDiscountId,
      newPrice: manualDiscountPrice,
    };

    const hasDiscount = manualDiscountPrice || selectedDiscountId;
    console.log(discount);

    if (!!hasDiscount) {
      console.log(hasDiscount);
      if (!discount.dateOfStart || !discount.dateOfEnd) {
        toast({
          title: "Erreur de mise à jour",
          className: "text-white bg-red-600 border-0",
          description:
            "Veuillez remplir les dates de début et de fin de remise.",
          duration: 5000,
        });
        return;
      }
      if (discountType === "manual" && !manualDiscountPrice) {
        toast({
          title: "Erreur de mise à jour",
          className: "text-white bg-red-600 border-0",
          description: "Veuillez fournir un prix de remise manuel.",
          duration: 5000,
        });
        return;
      }
      if (discountType === "percentage" && !selectedDiscountId) {
        toast({
          title: "Erreur de mise à jour",
          className: "text-white bg-red-600 border-0",
          description: "Veuillez sélectionner un type de remise.",
          duration: 5000,
        });
        return;
      }
    }

    if (!originalPrice && !hasDiscount) {
      toast({
        title: "Erreur de mise à jour",
        className: "text-white bg-red-600 border-0",
        description: "Veuillez fournir un prix ou une remise.",
        duration: 5000,
      });
      return;
    }

    const productData = {
      productId: productId,
      input: {
        attributeInputs: attributes.filter(
          (attr) => attr.name.trim() !== "" && attr.value.trim() !== "",
        ),
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

    updateProductMutation({
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
        window.close();
        toast({
          title: "Produit mis à jour",
          className: "text-white bg-mainColorAdminDash border-0",
          description: "Le produit a été mis à jour avec succès.",
          duration: 5000,
        });
      },
    });
  };

  if (loading)
    return (
      <div className="h-dvh relative overflow-hidden border bg-[#ffffffc2] rounded-md flex items-center justify-center w-full">
        <Load />
      </div>
    );
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container mx-auto py-10 bg-slate-100 w-full">
      <h1 className="text-2xl font-bold mb-6">Mettre à jour un produit</h1>
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
            <UpdateDescription
              description={description}
              setDescription={setDescription}
            />
          </div>

          <UpdatePrice
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
            discountType={discountType}
            setDiscountType={setDiscountType}
          />

          <UpdateImage
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />

          <UpdateAttribute
            attributes={attributes}
            setAttributes={setAttributes}
          />
        </div>

        <div className="moreDetails w-1/4 flex flex-col gap-3">
          <div className="visibility bg-white rounded-md shadow-md p-3">
            <label className="block border-b py-2 w-full text-gray-700 font-semibold tracking-wider">
              Visibilité
            </label>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 font-semibold">Visible</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mainColorAdminDash rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mainColorAdminDash"></div>
              </label>
            </div>
          </div>

          <ChoiceCategory
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <UpdateBrand setBrand={setBrand} selectedBrandId={brand} />
          <UpdateInventory stock={stock} setStock={setStock} />
          <UpdateColors
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
          <UpdateReference reference={reference} setReference={setReference} />
        </div>
      </div>
      <div className="w-full my-5 py-2">
        <button
          onClick={handleUpdateProduct}
          className="py-2 w-full flex items-center justify-center gap-3 rounded-lg text-center bg-mainColorAdminDash text-white"
        >
          <span className="font-semibold text-lg">Mettre à jour</span>
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
