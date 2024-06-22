"use client";
import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useMutation, useQuery } from "@apollo/client";
import { CATEGORY_QUERY } from "../graph/queries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import SmallSpinner from "../components/SmallSpinner";
import { CREATE_CATEGORY_MUSTATIONS } from "../graph/mutations";

interface Category {
  id: string;
  name: string;
  smallImage: string;
  subcategories: Category[];
}

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
    description: "",
    smallImage: "",
  });

  const [uploadingImage, setUploadingImage] = useState<Boolean>(false);

  const { data: allCategories } = useQuery(CATEGORY_QUERY);
  const [createCategory] = useMutation(CREATE_CATEGORY_MUSTATIONS);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCategory({
      variables: {
        bigImage: "",
        description: "",
        name: "",
        parentId: "",
        smallImage: "",
      },
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (result: any) => {
    setFormData({
      ...formData,
      smallImage: result.info.secure_url,
    });
    setUploadingImage(true);
  };

  const renderCategoryOptions = (categories: Category[] | undefined) => {
    return (
      <>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded h-12 outline-none mt-1">
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Catégories</SelectLabel>
            {categories?.map((cat) => (
              <React.Fragment key={cat.id}>
                <SelectItem
                  value={cat.id}
                  className="flex items-center font-bold tracking-wide cursor-pointer"
                >
                  <img
                    src={
                      cat.smallImage ||
                      "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
                    }
                    alt={
                      cat.name ||
                      "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
                    }
                    width={300}
                    height={300}
                    className="inline-block h-10 w-10 mr-2"
                  />
                  {cat.name}
                </SelectItem>
                {cat.subcategories && (
                  <SelectGroup className="ml-10">
                    {cat.subcategories.map((subcat) => (
                      <SelectItem
                        key={subcat.id}
                        value={subcat.id}
                        className="flex items-center font-semibold cursor-pointer"
                      >
                        <img
                          src={
                            subcat.smallImage ||
                            "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
                          }
                          alt={
                            subcat.name ||
                            "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
                          }
                          className="inline-block h-10 w-10 mr-2"
                        />
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </React.Fragment>
            ))}
          </SelectGroup>
        </SelectContent>
      </>
    );
  };


  return (
    <div className="container mx-auto py-10 h-full bg-white w-full">
      <h1 className="text-2xl font-bold mb-6">Créer une catégorie</h1>
      <form onSubmit={handleSubmit} className="space-y-6 h-full">
        <div className="flex gap-3 w-full">
          <div className="inputs flex flex-col gap-5 bg-white w-full shadow-sm border rounded-md p-3 h-full">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <label htmlFor="name" className="text-lg font-bold mb-4">
                  Nom
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border-gray-300 rounded-md outline-none border"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="parentCategory"
                className="text-lg font-bold mb-4"
              >
                Catégorie Parentale
              </label>
              <Select
                value={formData.parentCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentCategory: value })
                }
              >
                {renderCategoryOptions(allCategories?.categories)}
              </Select>
            </div>

            <div>
              <label htmlFor="description" className="text-lg font-bold mb-4">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full py-2 px-3 border-gray-300 rounded-md outline-none border"
              />
            </div>


            <div className="Image*300 border shadow-sm bg-white w-4/12 p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700">
              Taille de la vignette de la catégorie (1320 x 120)
            </label>
            <CldUploadWidget
              uploadPreset="MaisonNg"
              onSuccess={handleImageUpload}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className="mt-1 flex cursor-pointer justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <p className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        Choisissez le fichier à télécharger
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CldUploadWidget>
            {formData.smallImage && (
              <div className="w-[120px] h-[120px] border flex items-center justify-center">
                {uploadingImage && <SmallSpinner />}

                <Image
                  src={formData.smallImage}
                  alt={formData.name}
                  width={120}
                  height={120}
                  onLoadingComplete={() => setUploadingImage(false)}
                  className="border mt-3"
                />
              </div>
            )}
          </div>
          </div>

          <div className="Image*300 border shadow-sm bg-white w-4/12 p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700">
              Taille de la vignette de la catégorie (120 x 120)
            </label>
            <CldUploadWidget
              uploadPreset="MaisonNg"
              onSuccess={handleImageUpload}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className="mt-1 flex cursor-pointer justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <p className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        Choisissez le fichier à télécharger
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CldUploadWidget>
            {formData.smallImage && (
              <div className="w-[120px] h-[120px] border flex items-center justify-center">
                {uploadingImage && <SmallSpinner />}

                <Image
                  src={formData.smallImage}
                  alt={formData.name}
                  width={120}
                  height={120}
                  onLoadingComplete={() => setUploadingImage(false)}
                  className="border mt-3"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainColorAdminDash hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Créer la catégorie
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
