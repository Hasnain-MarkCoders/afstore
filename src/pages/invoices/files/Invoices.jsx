import React, {  useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { Container } from "@mui/material";
import InvoiceTable from './InvoiceTable';
import useQueryInvoices from "../../../Hooks/useQueryInvoices/useQueryInvoices";

export const Invoices = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })

  const { isLoading, rows, pageInfo } = useQueryInvoices(paginationModel);



  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="invoice">
        <h2 className="page-title">Invoices Files</h2>
        <InvoiceTable rows={rows} isLoading={isLoading} pageInfo={pageInfo} setPaginationModel={setPaginationModel}/>
      </div>
    </Container></>
  );
};
