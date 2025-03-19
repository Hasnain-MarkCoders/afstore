import { Container } from "@mui/material";
import Chart from "../../components/chart/Chart";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

const ViewExchangeRate = ({setShowSideBar}) => {
  return (<>
  <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              {/* <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              /> */}
              <div className="details">
                <h1 className="itemTitle">Invoice #001</h1>
                <div className="detailItem">
                  <span className="itemKey">Order Date:</span>
                  <span className="itemValue">23 May 2023</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Order Id</span>
                  <span className="itemValue">123456789</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">SKU:</span>
                  <span className="itemValue">Sterling Silver</span>
                </div>
              </div>
            </div>
          </div>
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              {/* <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              /> */}
              <div className="details">
                <h1 className="itemTitle">Cost Detail</h1>
                <div className="detailItem">
                  <span className="itemKey">Manufacturing Price</span>
                  <span className="itemValue">12000</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Final Price</span>
                  <span className="itemValue">15000</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Profit</span>
                  <span className="itemValue">3000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              {/* <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              /> */}
              <div className="details">
                <h1 className="itemTitle">Customer Detail</h1>
                <div className="detailItem">
                  <span className="itemKey">Address</span>
                  <span className="itemValue">123 Apartment 1 NYC</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Contact</span>
                  <span className="itemValue">+1 234 567 89</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email</span>
                  <span className="itemValue">info@customer.com</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div> */}
        </div>
        {/* <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List/>
        </div> */}
    </Container></>
  );
};

export default ViewExchangeRate;
