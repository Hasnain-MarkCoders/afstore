import React, { useState } from "react";
import { Container } from "@mui/material";
import RawOrdersTable from "./RawOrdersTable";
import "./styles.scss";
import '../../styles.scss'
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import useQueryRawOrders from "../../../Hooks/useQueryRawOrders/useQueryRawOrders";
const RawOrders = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 5
  })

  const { isLoading, rows, pageInfo } = useQueryRawOrders(paginationModel);

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="raw-orders">
        <RawOrdersTable rows={rows} isLoading={isLoading} pageInfo={pageInfo} setPaginationModel={setPaginationModel} />
      </div>
    </Container>
  </>
  );
};

export default RawOrders;