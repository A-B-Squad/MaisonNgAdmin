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

const UploadNextToCarouselAds = ({
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
        return {
          ...prevField,
          images: [file.url],
        };
      });
      setLocalLoadingImages(true);
    }
  };

  return (
    <div className="upload-NextToCarouselAds">
      <h1 className="text-3xl font-semibold mb-4">
        Publicités a coter de carousel
      </h1>

      <h4 className="text-lg font-medium text-gray-600 mb-4 list-item">
        {title}
        <span className="text-gray-200">: 230px / 390px</span>
      </h4>

      <div className="w-full mb-4 flex justify-center">
        {localLargeImage ? (
          <div className="w-[20rem] h-64 relative  border-2">
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
          <div className="uppercase shadow-xl flex-col border-dashed text-sm w-[20rem] h-64 tracking-wider text-gray-500 border rounded-md border-lightBlack flex items-center justify-center text-center bg-gray-200 transition-colors">
            <span>230px / 390px</span>
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
              <div className="relative w-[20rem] h-64 border overflow-hidden rounded-md cursor-pointer">
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

export default UploadNextToCarouselAds;
