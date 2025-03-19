

import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Container from "@mui/material/Container";
import API from "../../api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./sku.scss";
import { useSelector } from "react-redux";
import { DataGridPro } from "@mui/x-data-grid-pro";
import {  Button,Tooltip, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCountryModal from "../../components/Modals/SKUModals/AddCountryModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import { localeDateAndTime } from "../../Utils/Utils";

const userColumns = [
  {
    field: "country", headerName: "Country", minWidth: 240, flex: 1
  },
  {
    field: "first_item_price",
    headerName: "First Item Price",
    flex: 1,
    minWidth: 150
  },
  {
    field: "n_item_price",
    headerName: "N Item Price",
    flex: 1,
    minWidth: 180
  }
];

const SKUViewList = ({ setShowSideBar }) => {

  const auth = useSelector(
    state => state.user
  )
  const [isLoading, setIsLoading] = useState(true); 
  const [reload, setReload] = useState(false);
  const handleReload = () => {
    setReload(!reload);
  };


  // view details
  const { skuId } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    setIsLoading(true); // Set loading to true before making the API call

    API.get(`/${auth?.type}/sku/get/` + skuId)
      .then((response) => {
        setData(response?.data);
        setIsLoading(false); // Set loading to false after receiving the data
      })
      .catch((error) => {
        setIsLoading(false); // Set loading to false in case of an error
      });
  }, [reload]);

  // Add Countrys

  const [open, setOpen] = useState(false);
  const handleAddCountryModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };

  const [country, setCountry] = useState("")
  const [firstItemPrice, setFirstItemPrice] = useState("")
  const [nItemPrice, setnNItemPrice] = useState("")
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitAddCountry = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(`/${auth?.type}/sku/edit`, {
        id: skuId,
        customer_shipment_price: [
          {
            country: country,
            first_item_price: parseFloat(firstItemPrice),
            n_item_price: parseFloat(nItemPrice),
          },
        ],
      });
      handleAddCountryModal();
      handleReload();
      setCountry("");
      setFirstItemPrice("");
      setnNItemPrice("");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message)
    }
  };


  // delete
  const [deleteCountry, setDeleteCountry] = useState(null);
  const handleDeleteModal = (data) => {
    setDeleteCountry(data)
  };
  const deleteSku = async (country) => {
    API.post(`/${auth?.type}/sku/delete-customer-shipment-price`, {
      sku_id: skuId,
      country: country
    })
      .then((response) => {
        setDeleteCountry(null)
        handleReload();
      })
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="action-icon-btn deleteBtn" onClick={() => handleDeleteModal(params.row.country)}>
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
  ];

  const formattedDate = (date) => {
    const newDate = new Date(date);
    const formate = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return formate;
  }
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="add-category" style={{ marginBottom: "15px" }} >
        <h2 className="page-title">SKU Details</h2>
        {/* <Link to={"/sku/add-sku"}> */}

        {/* <Button onClick={handleAddCountryModal} className="btn btn-outline-primary">
          Add Shipment Price
        </Button> */}

        <AddCountryModal 
        open={open}
        handleAddCountryModal={()=>{handleAddCountryModal()}}
        setCountry={setCountry}
        handleSubmitAddCountry={handleSubmitAddCountry}
        setnNItemPrice={setnNItemPrice}
        setFirstItemPrice={setFirstItemPrice}
        errorMsg={errorMsg}
        country={country}
        nItemPrice={nItemPrice}
        firstItemPrice={firstItemPrice}
        />
        
      </div>
      <div className="view-list">
        <div className="left" >
          <div className="item">
            <div className="details">
            {data?.sku && <div className="detailItem">
                <span className="itemKey">SKU:</span>
                <span className="itemValue">{data?.sku}</span>
              </div>}
              {data?.sku_id && <div className="detailItem">
                <span className="itemKey">SKU ID:</span>
                <span className="itemValue">{data?.sku_id}</span>
              </div>}
              {data?.unit_price && <div className="detailItem">
                <span className="itemKey">SKU PRICE:</span>
                <span className="itemValue">{data?.unit_price}</span>
              </div>}
              {/* {data?.title && <div className="detailItem">
                <span className="itemKey">Title:</span>
                <span className="itemValue">{data?.title}</span>
              </div>}
              {data?.properties && <div className="detailItem">
                <span className="itemKey">Properties Pair:</span>
                <span className="itemValue">{data?.properties.pair}</span>
              </div>}
              {data?.properties && <div className="detailItem">
                <span className="itemKey">Properties Name:</span>
                <span className="itemValue">{data?.properties?.name ? 'Yes' : 'No'}</span>
              </div>}
              {data?.properties && <div className="detailItem">
                <span className="itemKey">Properties Image:</span>
                <span className="itemValue">{data?.properties?.image ? 'Yes' : 'No'}</span>
              </div>}
              {data?.description && <div className="detailItem">
                <span className="itemKey">Description:</span>
                <span className="itemValue">{data?.description}</span>
              </div>}
              {data?.factory_price_usd && <div className="detailItem">
                <span className="itemKey">Factory Price USD:</span>
                <span className="itemValue">${data?.factory_price_usd}</span>
              </div>}
              {data?.factory_price && <div className="detailItem">
                <span className="itemKey">Factory Price RMB:</span>
                <span className="itemValue">¥{data?.factory_price}</span>
              </div>}
              {data?.customer_price && <div className="detailItem">
                <span className="itemKey">Customer Price:</span>
                <span className="itemValue">¥{data?.customer_price}</span>
              </div>}
              {data?.sku_id && <div className="detailItem">
                <span className="itemKey">Sku Id:</span>
                <span className="itemValue">{data?.sku_id}</span>
              </div>}
              {data?.date && <div className="detailItem">
                <span className="itemKey">Date:</span>
                <span className="itemValue">{localeDateAndTime(data?.date)}</span>
              </div>} */}
            </div>
          </div>
        </div>

      </div>
      {/* <div className="datatable skuTable">
        {data?.customer_shipment_price &&
          <DataGridPro
            className="datagrid"
            loading={isLoading}
            getRowId={(rows) => rows?.country}
            rows={data?.customer_shipment_price}
            columns={userColumns?.concat(actionColumn)}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        }
      </div>
      
      {deleteCountry && <DeleteModal
            title={"Delete Country"}
            handleDeleteModal={()=>{handleDeleteModal(null)}}
            deleteId={deleteCountry}
            handleDelete={()=>{deleteSku(deleteCountry)}}
           />} */}
      
    </Container></>);
};

export default SKUViewList;
