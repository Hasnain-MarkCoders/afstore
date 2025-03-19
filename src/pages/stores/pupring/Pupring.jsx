import React, {  useState } from "react";
import NavTabs from "../../../components/tabs/Tabs";
import "./styles.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { Container } from "@mui/material";
import useQueryPupring from "../../../Hooks/useQueryPupring/useQueryPupring";
import PupringFilter from "../../../components/filter/PupringFilter.jsx/PupringFilter";


const Pupring = ({ setShowSideBar }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
    po_number: [],
    po_ids:[]
  });
  const { isLoading, rows, pageInfo } = useQueryPupring(paginationModel);
  return (
    <>
      <Sidebar />
      <Navbar setShowSideBar={setShowSideBar} />
      <Container maxWidth="100" className="contailer-fluid">
        <div className="store">
          <PupringFilter
            shareDocs={true}
            setPaginationModel={setPaginationModel}
            pageInfo={pageInfo}
          />
          <Outlet context={rows} />
          <NavTabs
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
          />
        </div>
      </Container>
    </>
  );
};

export default Pupring;
