import Link from "next/link";
import React from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

interface Order {
  id: string;
  customId: string;
  createdAt: string;
  Checkout: {
    userName: string;
    total: number;
  };
  status: string;
}

interface OrderRowProps {
  order: Order;
  formatDate: (timestamp: string) => string;
  translateStatus: (status: string) => string;
  generateInvoice: (order: Order) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  formatDate,
  translateStatus,
  generateInvoice,
}) => (
  <tr key={order.id} className="border-b h-10">
    <td className="text-blue-600">{order.customId}</td>
    <td>{formatDate(order.createdAt)}</td>
    <td>{order.Checkout.userName}</td>
    <td>
      <span
        className={`px-2 py-1 rounded ${
          order.status === "PAYED"
            ? "bg-green-100 text-green-800"
            : order.status === "PROCESSING"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {translateStatus(order.status)}
      </span>
    </td>
    <td>{order.Checkout.total.toFixed(3)} DT</td>
   

    <td className="Edits  py-3  text-sm ">
        <div className="flex  items-center gap-2">
          <Link
            target="_blank"
            href={{
              pathname: "/Products/UpdateProduct",
              // query: { productId: product.id },
            }}
            className="p-2 w-9 flex items-center justify-center hover:opacity-40 transition-opacity shadow-md h-9 rounded-full border-2"
          >
            <FiEdit2 size={18} />
          </Link>
       
          <button
            type="button"
         onClick={() => generateInvoice(order)} title="Imprimer facture"
            className="p-2 w-9 h-9 flex items-center justify-center hover:opacity-40 transition-opacity shadow-md rounded-full border-2"
          >
            <AiOutlinePrinter size={20} />
          </button>
        </div>
      </td>
  </tr>
);

export default OrderRow;
