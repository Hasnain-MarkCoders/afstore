import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../styles.scss";
import API from "../../api/api";
import "./styles.scss";
import TicketFooter from "./TicketFooter";
import { useSelector } from "react-redux";
import TicketList from "./TicketList";
import TicketChat from "./TicketChat";
import TicketUserInfo from "./TicketUserInfo";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TuneIcon from "@mui/icons-material/Tune";
import PupringProperties from "../../components/tabs/pupringProperties";
import useQueryTicketSystem from "../../Hooks/useQueryTicketSystem/useQueryTicketSystem";
import TicketSystemFilter from "../../components/filter/TicketSystemFilter/TicketSystemFilter";


export const TicketsSystem = ({ setShowSideBar }) => {
  const auth = useSelector((state) => state.user);
 const [isPaginationLoading, setIsPaginationLoading]=useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
    _id: [],
    po_number: [],
  });
  const { isLoading, rows, pageInfo } = useQueryTicketSystem(paginationModel, setIsPaginationLoading);
  const [savedItem, setSavedItem] = useState(localStorage.getItem("savedId"));
  const [data, setData] = useState(null);
  const [pupringId, setPupringId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const boolRef = useRef(false);
  const [dropDownTag, setDropDownTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [updatedData, setUpdatedData] = useState(false);
  const [isColorChange, setIsColorChange] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setPaginationModel({
        _id: savedItem?.split(","),
      });
    }, 700);
  }, [savedItem]);

  const handleReset = async () => {
    localStorage.removeItem("savedId");
    setSavedItem([]);
    setPaginationModel({
      _id: [],
      order_status:
        pageInfo.order_status === "all" ? [] : pageInfo.order_status,
      multiple_order_status: [],
      po_number: [],
      first_date: "",
      last_date: "",
      name: [],
      invoiceStatus: [],
      color: [],
      factory_color: [],
      remarks: "",
      admin_remarks: "",
      factory_note: "",
      customer_note: "",
      all_remarks: false,
      all_admin_remarks: false,
      all_factory_note: false,
      all_customer_note: false,
      tag_blue: [],
      tag_red: [],
      all_tag_blue: "",
      all_tag_red: "",
      all_tag:[],
      bool: boolRef.current,
    });
    boolRef.current = !boolRef.current;
  };
  const [displayImages, setDisplayImages] = React.useState(null);
  const [getTags, setGetTags] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/customer/get-tags`);
        setGetTags(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
useEffect(()=>{
  setIsPaginationLoading(true)
  setTimeout(()=>{
    setUpdatedData(e=>!e)
  setIsPaginationLoading(false)

  }, 2000)
 
},[])

  return (
    <>
      <Sidebar />
      <Navbar setShowSideBar={setShowSideBar} />
      <Container maxWidth="100" className="contailer-fluid">
        <div className={`tickets-system ${"active-image"}`}>
          <h2 style={{ marginBottom: filter ? "10px" : 0 }}>Tickets System</h2>
          {filter && (
            <TicketSystemFilter
            setUpdatedData={setUpdatedData}
              getUpdatedData={updatedData}
              shareDoc={false}
              setPaginationModel={setPaginationModel}
              pageInfo={pageInfo}
              setSavedItem={setSavedItem}
            />
          )}
          {data ? (
            <Box sx={{
              mt:filter?"20px":""
            }}>
              {auth.type === "admin" ? (
                <Box
                  sx={{
                    display: "flex",
                    p: "15px",
                    background: "white",
                    borderRadius: "20px",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ ml: "20px" }}>Factory Color</Typography>
                    <PupringProperties
                      factoryColor={true}
                      updatedData={updatedData}
                      setUpdatedData={setUpdatedData}
                      rows={rows}
                      data={data}
                      isLoading={isLoading}
                      pageInfo={pageInfo}
                      setPaginationModel={setPaginationModel}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ ml: "20px" }}>Customer Color</Typography>
                    <PupringProperties
                      customerColor={true}
                      updatedData={updatedData}
                      setUpdatedData={setUpdatedData}
                      rows={rows}
                      data={data}
                      isLoading={isLoading}
                      pageInfo={pageInfo}
                      setPaginationModel={setPaginationModel}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column" , p: "15px",
                background: "white",
                borderRadius: "20px",}}>
                  <Typography sx={{ ml: "20px" }}>Customer Color</Typography>
                  <PupringProperties
                    customerColor={true}
                    updatedData={updatedData}
                   setUpdatedData={setUpdatedData}
                    rows={rows}
                    setIsColorChange={setIsColorChange}
                    data={data}
                    isLoading={isLoading}
                    pageInfo={pageInfo}
                    setPaginationModel={setPaginationModel}
                  />
                </Box>
              )}
            </Box>
          ) : null}
          <div
            className={`ticket-chat ${filter ? "with-filter" : ""} ${
              data ? "with-action-btns" : ""
            }`}
          >
            <div className="ticket-list">
              <div className="ticket-chat-header">
                <h3>Order List</h3>
                <div className="filter-btns">
                  <Button
                    className="btn-primary"
                    disabled={isLoading}
                    title="all tag filter"
                    onClick={() => setUpdatedData((e) => !e)}
                  >
                   {updatedData?" No tag ":" All tag "}
                  </Button>
                  <Button
                    className="btn-primary"
                    title="Reset"
                    onClick={handleReset}
                  >
                    <RestartAltIcon />
                  </Button>
                  <Button
                    className="btn-primary"
                    title="Filter"
                    onClick={() => setFilter((e) => !e)}
                  >
                    <TuneIcon />
                  </Button>
                  
                </div>
              </div>
              <div className="ticket-list-items">

                <TicketList
                isPaginationLoading={isPaginationLoading}
                  pageInfo={pageInfo}
                  setSelectedTag={setSelectedTag}
                  rows={rows}
                  setData={setData}
                  setPupringId={setPupringId}
                  isLoading= {isLoading}
                  setPaginationModel={setPaginationModel}
                  pupringId={pupringId}
                />
              </div>
            </div>
            <div className="ticket-chat-box">
              <div className="ticket-chat-header">
                <h3>{data?.po_id}</h3>
              </div>
             
              <TicketChat
                data={data}
                loading={loading}
                displayImages={displayImages}
              />
              <TicketFooter
                {...{
                  data,
                
                  setDropDownTag,
                  dropDownTag,
                  getTags,
                  displayImages,
                  setDisplayImages,
                  isLoading,
                  setPaginationModel,
                  pageInfo,
                  selectedTag,
                  setSelectedTag,
                }}
                updatedData={updatedData}
                setUpdatedData={setUpdatedData}
              />
            </div>
            <div className="ticket-user-info">
              <div className="ticket-chat-header">
                <h3>Order Info</h3>
              </div>
              <TicketUserInfo data={data} />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};