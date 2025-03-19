import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Container } from "@mui/material";
import ExchangeRateGrid from "../../components/ExchangeRateGrid/ExchangeRateGrid";

export const ExchangeRate = ({ setShowSideBar }) => {
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="invoice">
        <h2 className="page-title">Exchange Rate</h2>
        <ExchangeRateGrid />
      </div>
    </Container></>
  );
};
