import React, {useState } from "react";
import { Container } from "@mui/material";
import InvoiceItemsTable from './InvoiceItemsTable';
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import useQueryInvoicesItems from "../../../Hooks/useQueryInvoicesItems/useQueryInvoicesItems";
export const InvoicesItems = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })
  const { isLoading, rows, pageInfo } = useQueryInvoicesItems(paginationModel);
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="invoice">
        <h2 className="page-title">Invoices Items</h2>
        {/* <DataGridDemo /> */}
        <InvoiceItemsTable rows={rows} isLoading={isLoading} pageInfo={pageInfo} setPaginationModel={setPaginationModel}/>
      </div>
    </Container></>
  );
};
