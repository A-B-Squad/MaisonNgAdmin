"use client";
import { ADVERTISSMENT_QUERY } from "@/app/graph/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import UploadSideAds from "../components/uploadSideAds";

const SideOfConatct = ({ setInputField, inputField }: any) => {
  const [localLargeImage, setLocalLargeImage] = useState<string>("");

  const { data: topOfLessThen20Ads, loading: loadingTopOfLessThen20Ads } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
    });

  useEffect(() => {
    if (topOfLessThen20Ads?.advertismentByPosition) {
      const ad = topOfLessThen20Ads.advertismentByPosition[0];
      if (ad) {
        setInputField({
          images: [ad.images[0]] || "",
          link: ad.link || "",
          position: "clinetContactSideAds",
        });
        setLocalLargeImage(ad.images[0] || "");
      }
    }
  }, [topOfLessThen20Ads]);

  return (
    <div className="clinetContactSideAds ">
      <UploadSideAds
        localInputField={inputField}
        setLocalInputField={setInputField}
        setLocalLargeImage={setLocalLargeImage}
        localLargeImage={localLargeImage}
        title={"De Page Pour Nous Contacter"}
      />
    </div>
  );
};

export default SideOfConatct;
