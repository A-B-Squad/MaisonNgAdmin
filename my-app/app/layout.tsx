import React from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { ApolloWrapper } from "@/lib/apollo-wrapper";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["cyrillic"],
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
        <div className=" flex w-full">
          <SideBar />
          <div className="h-full w-full">
            <Header />
            <div className="w-full h-full flex flex-col relative ">
              <main className=" flex justify-center items-center w-full">
                <ApolloWrapper>{children}</ApolloWrapper>
                <Toaster />
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
