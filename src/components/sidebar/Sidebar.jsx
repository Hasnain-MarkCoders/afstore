import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import CurrencyYuanIcon from "@mui/icons-material/CurrencyYuan";
import {  useState } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import "./sidebar.scss";
import { logoutAction } from "../../redux/slices/authAction";
import { connect, useSelector } from "react-redux";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import Logo from "../../images/Linton-logo.png";
import Logo from "../../images/logo-transparent.png";

import CommentIcon from '@mui/icons-material/Comment';
import StyleIcon from '@mui/icons-material/Style';
import SettingsIcon from '@mui/icons-material/Settings';
import GetAppIcon from '@mui/icons-material/GetApp';
const Sidebar = ({ logoutAction }) => {
  const urlArray = window.location?.pathname?.split("/");
  const pathname = urlArray[urlArray.length - 1];
  const [storeDropdownMenu, setStoreDropdownMenu] = useState(true);
  const [invoiceDropdownMenu, setInvoiceDropdownMenu] = useState(true);

  const auth = useSelector((state) => state.user);
  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <img src={Logo} alt="" className="logo" />
        </NavLink>
      </div>
      <div className="center">
        <ul>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </NavLink>
          <div
            className={`dropdown ${(pathname === "pupring" || pathname === "raw-orders") ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <li
              className="dropdown-btn"
              onClick={() => setStoreDropdownMenu((e) => !e)}
            >
              <div className="dropdown-name">
                <StoreIcon className="icon" />
                <span>Stores</span>
              </div>
              {storeDropdownMenu ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </li>
            {storeDropdownMenu && (
              <ul className="dropdown-items">
                <NavLink to="/afstore" style={{ textDecoration: "none" }}>
                  <li>
                    <StoreIcon className="icon" />
                    <span>AfStore</span>
                  </li>
                </NavLink>
                {( auth.type === "suadmin") &&
                  <NavLink to="/raw-orders" style={{ textDecoration: "none" }}>
                    <li>
                      <StoreIcon className="icon" />
                      <span>Raw Orders</span>
                    </li>
                  </NavLink>
                }
              </ul>
            )}
          </div>

          {(auth.type === "admin" || auth.type === "suadmin") && (
            <>
             
              <NavLink to="/sku" style={{ textDecoration: "none" }}>
                <li>
                  <CategoryIcon className="icon" />
                  <span>SKU</span>
                </li>
              </NavLink>
               {/* <div
                className={`dropdown ${(pathname === "invoices" || pathname === "invoices-items") ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className="dropdown-btn"
                  onClick={() => setInvoiceDropdownMenu((e) => !e)}
                >
                  <div className="dropdown-name">
                    <StoreIcon className="icon" />
                    <span>Invoice</span>
                  </div>
                  {invoiceDropdownMenu ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </li>
                {invoiceDropdownMenu && (
                  <ul className="dropdown-items">
                    <NavLink to="/invoices" style={{ textDecoration: "none" }}>
                      <li>
                        <StoreIcon className="icon" />
                        <span>Files</span>
                      </li>
                    </NavLink>
                    <NavLink to="/invoices-items" style={{ textDecoration: "none" }}>
                      <li>
                        <StoreIcon className="icon" />
                        <span>Items</span>
                      </li>
                    </NavLink>
                  </ul>
                )}
              </div> */}

              <NavLink to="/exchange-rate" style={{ textDecoration: "none" }}>
                <li>
                  <CurrencyYuanIcon className="icon" />
                  <span>Exchange Rate</span>
                </li>
              </NavLink>
              <NavLink to="/post-service" style={{ textDecoration: "none" }}>
                <li>
                  <LocalShippingIcon className="icon" />
                  <span>Post Service</span>
                </li>
              </NavLink>
            { auth.type === "suadmin" && <NavLink to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <AccountCircleOutlinedIcon className="icon" />
                  <span>Users</span>
                </li>
              </NavLink>}
            </>
          )}
          {(auth.type === "customer" || (auth.type === "admin" || auth.type === "suadmin")) && (
            <NavLink to="/tickets-system" style={{ textDecoration: "none" }}>
              <li>
                <CommentIcon className="icon" />
                <span>Tickets System</span>
              </li>
            </NavLink>
          )}
            {/* {(auth.type === "customer" || (auth.type === "admin" || auth.type === "suadmin")) && (
            <NavLink to="/dynamic-properties" style={{ textDecoration: "none" }}>
              <li>
                <CommentIcon className="icon" />
                <span>Dynamic Properties</span>
              </li>
            </NavLink>
          )} */}
          {(auth.type === "admin" || auth.type === "suadmin") && (
            <>
              <NavLink to="/tags" style={{ textDecoration: "none" }}>
                <li>
                  <StyleIcon className="icon" />
                  <span>Tags</span>
                </li>
              </NavLink>
            </>
          )}
             {/* <>
              <NavLink to="/download-center" style={{ textDecoration: "none" }}>
                <li>
                  <GetAppIcon className="icon" />
                  <span>Download Center</span>
                </li>
              </NavLink>
            </> */}
            {( auth.type === "suadmin") && (
            <>
              <NavLink to="/settings" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsIcon className="icon" />
                  <span>Settings</span>
                </li>
              </NavLink> 
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
const actions = {
  logoutAction,
};
export default connect(null, actions)(Sidebar);
