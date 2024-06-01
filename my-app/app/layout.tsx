import React from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import "./globals.css";
import { Open_Sans } from "next/font/google";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { ApolloWrapper } from "@/lib/apollo-wrapper";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="../public/images/favicon.ico" sizes="any" />
      </head>
      <body className={openSans.className}>
        <div className="flex h-full w-full">
          <SideBar />
          <div className="w-full flex flex-col">
            <Header />
            <main className="w-full flex justify-center items-center">
              <ApolloWrapper>{children}</ApolloWrapper>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
