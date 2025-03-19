import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Container from "@mui/material/Container";
import API from "../../../api/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles.scss";
import { localeDateAndTime } from "../../../Utils/Utils";

const RawOrdersViewList = ({ setShowSideBar }) => {

  // view details
  const { orderId } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    API.get('/suadmin/orders', {
      params: {
        order_id: orderId
      }
    })
      .then((response) => {
        setData(response?.data?.orders);
      })
      .catch((error) => {
      });
  }, []);

  const formattedDate = (date) => {
    const newDate = new Date(date);
    const formate = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return formate;
  }


  const dateReplacer = (keysToFormat) => {
    return (key, value) => {
      if (keysToFormat.includes(key) && typeof value === 'string') {
        return localeDateAndTime(value);
      }
      return value;
    };
  };
  
  // React component to display the formatted JSON
  const DetailItem = ({ data }) => {
    // Define the keys that need date formatting
    const keysToFormat = ['date', 'consent_updated_at', 'updated_at'];
  
    // Use JSON.stringify with the replacer function
    const formattedJson = data
      ? JSON.stringify(data, dateReplacer(keysToFormat), 2)
      : 'No data available';
  
    return (
      <div className="detailItem">
        <span>
          <pre className="itemValue">{formattedJson}</pre>
        </span>
      </div>
    );
  };
  
 
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="add-category" style={{ marginBottom: "15px" }} >
        <h2 className="page-title"><Link to={"/raw-orders"} >Raw Orders</Link> / View</h2>
      </div>
      <div className="view-list">
        <div className="left" >
          <div className="item">
            <div className="details">

              {/* <div className="detailItem">
                <span ><pre className="itemValue">{data && JSON.stringify(data, null, 2)}</pre></span>
              </div> */}
              <DetailItem
              data={data}
              />
              {/* {data?.order_detail && Object?.entries(order_detail)?.map(([keys, values]) => {
                return (typeof values === "string") ?
                    <div className="detailItem" key={keys}>
                    <span className="itemKey" >{keys}:</span>
                  <span className="itemValue">{values}</span>
                    </div>:(typeof values === "object" && values !== null) ?
                    Object.entries(values)?.map(([key , val])=>{
                      return (typeof val === "string") &&
                      <div className="detailItem" key={key}>
                      <span className="itemKey" >{key}:</span>
                    <span className="itemValue">{val}</span>
                      </div>
                    })
                    :<></>
              })} */}
            </div>
          </div>
        </div>
      </div>

    </Container></>);
};

export default RawOrdersViewList;
