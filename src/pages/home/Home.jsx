import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import "./home.scss";
import {  Container } from "@mui/material";
import RecentOrdersTable from "./recentOrdersTable";
import { useSelector } from "react-redux";
import RejectedOrdersTable from "./rejectedOrdersTable";
import { useEffect, useState } from "react";
import API from "../../api/api";
import HoldOrdersTable from "./holdOrdersTable";
import Alert from '@mui/material/Alert';
import { Collapse, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const timeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const formattedTime = dateTime.toLocaleTimeString(undefined, timeFormatOptions);

  const formatted = `${formattedDate} ${formattedTime}`;
  return formatted;
};

const Home = ({ setShowSideBar }) => {
  const [isError, setError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const auth = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/factory/accept-alarm");
        setError(response.data.isAlarm);
        if (response.data.isAlarm) {
          setOpenAlert(true);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
    {(isError && (auth.type === "admin" || auth.type === "factory")) && (
          <Collapse in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpenAlert(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
              sx={{ mb: 2 }}
              className="alert"
            >
              More than 50 orders unaccepted by factory
            </Alert>
          </Collapse>
        )}
      <div className="home">
       
        {(auth.type === "admin" ||auth.type === "suadmin") && <>
          <div className="widgets">
            <Widget type="user" />
            <Widget type="order" />
            <Widget type="sku" />
          
          </div>
        </>
        }
        <div className="listContainer">
          { (auth.type === "customer" || auth.type === "admin" || auth.type === "suadmin") &&
            <>
              <div className="listRow">
                <h3 className="listTitle">Hold Orders</h3>
                <HoldOrdersTable />
              </div>
              <div className="listRow">
                <h3 className="listTitle">Rejected Orders</h3>
                <RejectedOrdersTable />
              </div>
            </>}
          <div className="listRow">
            <h3 className="listTitle">Recent Orders</h3>
            <RecentOrdersTable />
          </div>
        </div>
        
      </div>
    </Container></>
  );
};

export default Home;
