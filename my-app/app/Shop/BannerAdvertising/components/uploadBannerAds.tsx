"use client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useState } from "react";
import { IoImageOutline } from "react-icons/io5";

const LoaderSpiner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const UploadBannerAds = ({
  title,
  localLargeImage,
  setLocalLargeImage,
  localInputField,
  setLocalInputField,
}: any) => {

  const [localLoadingImages, setLocalLoadingImages] = useState<boolean>(false);

  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInputField((prev: any) => ({
      ...prev,
      link: e.target.value,
    }));
  };

  const handleSuccess = (result: any) => {
    const file = result.info;
    if (file) {
      setLocalLargeImage(file.url);
      setLocalInputField((prevField: any) => {
        console.log(prevField);
        return {
          ...prevField,
          images: [file.url],
        };
      });
      setLocalLoadingImages(true);
    }
  };

  return (
    <div className="upload-banner-ads">
      <h1 className="text-3xl font-semibold mb-4">Publicités en Bannière</h1>

      <h4 className="text-lg font-medium text-gray-600 mb-4 list-item">
        {title}
      </h4>

      <div className="w-full mb-4">
        {localLargeImage ? (
          <div className="h-[180px] w-[960px] relative border-2">
            <Image
              src={localLargeImage}
              alt="image de carrousel"
              layout="fill"
              objectFit="cover"
              onLoadingComplete={() => setLocalLoadingImages(false)}
              onError={() => setLocalLoadingImages(false)}
            />
            {localLoadingImages && <LoaderSpiner />}
          </div>
        ) : (
          <div className="uppercase shadow-xl flex-col border-dashed text-sm h-[180px] w-[960px] tracking-wider text-gray-500 border rounded-md border-lightBlack flex items-center justify-center text-center bg-gray-200 transition-colors">
            <span>400px / 952px</span>
            <span>png / jpg / gif</span>
          </div>
        )}
      </div>

      <div className="add-new-carousel-image flex flex-col justify-between mt-4">
        <div className="flex items-center w-full py-2 justify-between mb-2">
          <div className="flex items-center justify-between gap-2">
            <CldUploadWidget uploadPreset="MaisonNg" onSuccess={handleSuccess}>
              {({ open }) => (
                <button
                  type="button"
                  className="uppercase shadow-xl flex-col border-dashed text-sm h-[50px] w-[100px] tracking-wider text-gray-500 border rounded-md border-lightBlack flex items-center justify-center text-center bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => open()}
                >
                  <IoImageOutline />
                </button>
              )}
            </CldUploadWidget>
            <input
              type="text"
              className="outline-none border px-2 py-3 w-[500px]"
              placeholder="Lien vers votre site"
              value={localInputField.link}
              onChange={handleLocalInputChange}
            />
            {localInputField?.images && (
              <div className="relative h-[50px] w-[100px] border overflow-hidden rounded-md cursor-pointer">
                {localLoadingImages && <LoaderSpiner />}
                <Image
                  src={localInputField.images[0]}
                  alt="image téléchargée"
                  layout="fill"
                  className={`${!localLoadingImages ? "visible" : "invisible"}`}
                  objectFit="cover"
                  onLoadingComplete={() => setLocalLoadingImages(false)}
                  onError={() => setLocalLoadingImages(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBannerAds;
