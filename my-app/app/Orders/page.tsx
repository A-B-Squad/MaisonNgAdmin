"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ORDERS_QUERY } from "../graph/queries";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import OrderTable from "./components/OrderTable";
import Pagination from "../components/Paginations";
import SmallSpinner from "../components/SmallSpinner";

const translateStatus = (status: string) => {
  switch (status) {
    case "PROCESSING":
      return "EN TRAITEMENT";
    case "PAYED":
      return "PAYÉ";
    case "DELIVERED":
      return "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON";
    case "PENDING":
      return "EN ATTENTE";
    case "RETURNED":
      return "RETOUR";
    case "EXCHANGED":
      return "ÉCHANGE";
    default:
      return status;
  }
};

const CommandesPage: React.FC = () => {
  const [searchCommande, setSearchCommande] = useState("");
  const [searchProduit, setSearchProduit] = useState("");
  const [filter, setFilter] = useState("Toute");
  const [page, setPage] = useState(1);
  const ordersPerPage = 10;

  const { loading, error, data } = useQuery(ORDERS_QUERY);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleString();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Définir la couleur principale
    const mainColor: [number, number, number] = [32, 41, 57];

    // Ajouter un titre
    doc.setFontSize(18);
    doc.setTextColor(...mainColor);
    doc.text("Liste des Commandes", 14, 22);

    // Ajouter une ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Ajouter un sous-titre avec la date et l'heure
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    doc.setFontSize(12);
    doc.text(`Généré le: ${formattedDate} à ${formattedTime}`, 14, 32);

    // Ajouter le tableau avec des styles personnalisés
    autoTable(doc, {
      startY: 40, // Position de départ du tableau
      head: [["Réf", "Date de création", "Client", "Statut", "Total"]],
      body: data.getAllPackages.map((order: any) => [
        order.customId,
        formatDate(order.createdAt),
        order.Checkout.userName,
        translateStatus(order.status),
        order.Checkout.total,
      ]),
      styles: {
        fontSize: 10, // Taille de police des cellules
        cellPadding: 3, // Padding des cellules
      },
      headStyles: {
        fillColor: mainColor, // Couleur de fond des en-têtes
        textColor: [255, 255, 255], // Couleur du texte des en-têtes
        fontStyle: "bold", // Style de police des en-têtes
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Couleur de fond des lignes alternées
      },
      margin: { top: 40 }, // Marge supérieure du tableau
    });

    // Enregistrer le PDF
    doc.save("commandes.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.getAllPackages.map((order: any) => ({
        Réf: order.customId,
        "Date de création": formatDate(order.createdAt),
        Client: order.Checkout.userName,
        Statut: translateStatus(order.status),
        Total: order.Checkout.total,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commandes");
    XLSX.writeFile(wb, "commandes.xlsx");
  };

  const generateInvoice = (order: any) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Company header
    doc.setFontSize(24);
    doc.text("MAISON NG", 14, 20);

    doc.setFontSize(10);
    doc.text("Sté HORTENSIA SARL", 14, 30);
    doc.text("26, COLONEL GARBOUJI 22", 14, 35);
    doc.text("4051 Sousse, TUNISIE", 14, 40);
    doc.text("M.F : 1719566M/M/P/000", 14, 45);

    // Page number
    doc.text("Page N° 1", 180, 10);

    // FACTURE title
    doc.setFontSize(18);
    doc.text("FACTURE", 14, 60);

    // Invoice details box
    doc.rect(14, 65, 90, 20);
    doc.setFontSize(10);
    doc.text("N° Pièce", 16, 71);
    doc.text("Date", 16, 77);
    doc.text("Référence", 16, 83);

    doc.text(order.customId, 50, 71);
    doc.text(formatDate(order.createdAt), 50, 77);
    doc.text(order.reference || "", 50, 83);

    // Client details box
    doc.rect(120, 65, 75, 20);
    doc.text("Client", 122, 71);
    doc.setFontSize(9);
    doc.text(order.Checkout.userId, 122, 77);
    doc.text(order.Checkout.userName.toUpperCase(), 122, 83);
    doc.text(order.Checkout.address || "", 122, 89);

    // Table for items
    const tableColumns = [
      "Référence",
      "Désignation",
      "Qté",
      "Remise",
      "Montant TTC",
    ];
    const tableData = order.Checkout.products.map((item: any) => [
      item.product.reference,
      item.product.name,
      item.productQuantity,
      item.product.price.toFixed(3),
      "0%",
      (item.productQuantity * item.product.price).toFixed(3),
      "19,00%",
    ]);

    autoTable(doc, {
      startY: 90,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      styles: { fontSize: 8, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 30, halign: "right" },
        6: { cellWidth: 20, halign: "center" },
      },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.line(14, finalY, 195, finalY);

    // doc.text("Total HT", 140, finalY + 7);
    doc.text(order.Checkout.total.toFixed(3), 180, finalY + 7, {
      align: "right",
    });

    const tva = (order.Checkout.total * 0.19).toFixed(3);
    doc.text("TVA", 140, finalY + 14);
    doc.text(tva, 180, finalY + 14, { align: "right" });

    const totalTTC = (
      parseFloat(order.Checkout.total) + parseFloat(tva)
    ).toFixed(3);
    doc.setFont("helvetica", "bold");
    doc.text("Total TTC", 140, finalY + 21);
    doc.text(totalTTC, 180, finalY + 21, { align: "right" });
    // Space for stamp and signature
    doc.rect(120, finalY + 30, 75, 40);
    doc.text("Cachet & Signature", 122, finalY + 35);

    // Save the PDF
    doc.save(`facture_${order.id}.pdf`);
  };
  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = data.getAllPackages.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(data.getAllPackages.length / ordersPerPage);
  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Commandes</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher une commande"
            className="border p-2 rounded flex-grow"
            value={searchCommande}
            onChange={(e) => setSearchCommande(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rechercher un produit"
            className="border p-2 rounded flex-grow"
            value={searchProduit}
            onChange={(e) => setSearchProduit(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Toute</option>
            <option>PROCESSING</option>
            <option>PAYED</option>
            <option>DELIVERED</option>
          </select>
          <button className="bg-pink-600 text-white px-4 py-2 rounded">
            Filtre
          </button>
          <button className="border px-4 py-2 rounded">Clear</button>
        </div>

        {loading ? (
          <div className="flex justify-center ">
            <SmallSpinner />
          </div>
        ) : (
          <OrderTable
            orders={currentOrders}
            formatDate={formatDate}
            translateStatus={translateStatus}
            generateInvoice={generateInvoice}
          />
        )}

        {data.getAllPackages.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded"
          onClick={exportToPDF}
        >
          Exportation PDF
        </button>
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded"
          onClick={exportToExcel}
        >
          Exportation Excel
        </button>
        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          + Ajouter une commande
        </button>
      </div>
    </div>
  );
};

export default CommandesPage;
