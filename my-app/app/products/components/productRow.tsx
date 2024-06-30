import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import { BiShow } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import moment from "moment";
import prepRoute from "@/app/Helpers/_prepRoute";

interface ProductRowProps {
  product: any;
  onDeleteClick: (product: { id: string; name: string }) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onDeleteClick }) => {
  const formatDate = (timestamp: string) => {
    return moment(parseInt(timestamp, 10)).format("DD/MM/YYYY");
  };

  return (
    <tr className="text-gray-700">
      <td className="Image px-4 py-3 border">
        <div className="flex items-center text-sm">
          <div className="relative w-12 h-12 mr-3 rounded-full md:block">
            <Image
              className=" w-full h-full rounded-full"
              src={
                product.images[0] ||
                "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
              }
              layout="fill"
              objectFit="contain"

              alt=""
              loading="lazy"
            />
            <div
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            ></div>
          </div>
          <div>
            <p className="font-semibold text-black">{product.name}</p>
          </div>
        </div>
      </td>
      <td className="Price text-center px-4 py-3 text-ms font-semibold border">
        {product.price.toFixed(3)}
      </td>
      <td className="Discount px-4 text-center py-3 text-ms font-semibold border">
        {product.productDiscounts.length > 0
          ? product.productDiscounts[0].newPrice.toFixed(3) + "TND"
          : "_________"}
      </td>
      <td className="Discount px-4 text-center py-3 text-ms font-semibold border">
        {product.productDiscounts.length > 0
          ? formatDate(product.productDiscounts[0].dateOfEnd)
          : "_________"}
      </td>
      <td className="visibility text-center px-4 py-3 text-sm border">
        <span
          className={`px-2 py-1 font-semibold leading-tight ${
            !product.visibility
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          } rounded-sm`}
        >
          {!product.visibility ? "Visible" : "Non visible"}
        </span>
      </td>
      <td className="createdAt text-center px-4 py-3 text-sm border">
        {formatDate(product.createdAt)}
      </td>
      <td className="Inventory text-center px-4 py-3 text-sm border">
        {product.solde}
      </td>
      <td className="Edits px-4 py-3 text-sm border">
        <div className="flex justify-center items-center gap-2">
          <Link
            target="_blank"
            href={{
              pathname: "/Products/UpdateProduct",
              query: { productId: product.id },
            }}
            className="p-2 w-10 hover:opacity-40 transition-opacity shadow-md h-10 rounded-full border-2"
          >
            <FiEdit2 size={20} />
          </Link>
          <Link
            target="_blank"
            href={{
              pathname: `http://localhost:3000/products/tunisie/${prepRoute(
                product.name
              )}`,
              query: {
                productId: product.id,
                collection: [
                  product.categories[0]?.name,
                  product.categories[0]?.id,
                  product.categories[0]?.subcategories[0]?.name,
                  product.categories[1]?.subcategories[0]?.id,
                  product.categories[0]?.subcategories[0]?.subcategories[1]
                    ?.name,
                  product.categories[0]?.subcategories[0]?.subcategories[1]?.id,
                  product.name,
                ],
              },
            }}
            className="p-2 w-10 hover:opacity-40 transition-opacity shadow-md h-10 rounded-full border-2"
          >
            <BiShow size={22} />
          </Link>
          <button
            type="button"
            onClick={() =>
              onDeleteClick({ id: product.id, name: product.name })
            }
            className="p-2 w-10 h-10 hover:opacity-40 transition-opacity shadow-md rounded-full border-2"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
