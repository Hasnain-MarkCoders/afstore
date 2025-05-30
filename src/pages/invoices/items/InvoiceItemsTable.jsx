import { DataGridPro } from "@mui/x-data-grid-pro";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { Box, Backdrop, Button, Fade, Modal, TextField, Typography, Tooltip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import "./../style.scss";
import CustomIcon from "../../../components/CustomIcon/CustomIcon";

const InvoiceItemsTable = ({ tabName, isLoading = false, rows = [], pageInfo = {}, setPaginationModel, selectedRow, setSelectedRow }) => {
const navigate = useNavigate()
  // Column definitions for the data grid for admin users
  const userColumns = [
    {
      field: "po", headerName: "Po", minWidth: 110, flex: 1,
    },
    {
      field: "po_id", headerName: "Po Id", minWidth: 240, flex: 1
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200
    },
    {
      field: "shipment_customer_price",
      headerName: "Shiptment Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return !!params.row.shipment_customer_price ? `$${params.row.shipment_customer_price}` : ""
      }
    },
    {
      field: "customer_price",
      headerName: "Customer Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return !!params?.row?.customer_price ? `$${params?.row?.customer_price}` : ""
      }
    },
    {
      field: "shipment_local_price_usd",
      headerName: "YE Shipment USD",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return !!params?.row?.shipment_local_price_usd ? `$${params?.row?.shipment_local_price_usd}` : ""
      }
    },
    {
      field: "shipment_local_price",
      headerName: "YE Shipment RMB",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return !!params?.row?.shipment_local_price ? `¥${params?.row?.shipment_local_price}` : ""
      }
    },
    {
      field: "tracking_number",
      headerName: "Tracking Number",
      flex: 1,
      minWidth: 150
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus status-btn ${params.row.order_status ? "complete" : ""}`}>
            {params.row.order_status}
          </div>
        );
      }
    },
    {
      field: "invoice_status",
      headerName: "Invoice Status",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus status-btn ${params.row.invoice_status ? "complete" : ""}`}>
            {params.row.invoice_status}
          </div>
        );
      }
    }
  ];

  // Column definition for the action column in the data grid
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <div className="cellAction">
               <CustomIcon
          style={ {color: "#1fc600"} }
          title={"View"}
          className="action-icon-btn viewBtn"
          cb={()=>navigate(`/afstore/${params.row._id}`)}
          icon={ <RemoveRedEyeIcon />}
         />
            {/* <Tooltip title="View">
              <Link to={`/pupring/${params.row._id}`} style={{ color: "#7451f8" }}>
                <RemoveRedEyeIcon />
              </Link>
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  // Handle selection model change
  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedRow(newSelectionModel);
  };

  // Handle pagination change
  const handlePagination = (fieldName, value) => {
    setPaginationModel(prev => ({
      ...prev, [fieldName]: value
    }));
  };

  // Handle row click to prevent row selection
  const handleRowClick = (params) => {
    if (params.row) {
      params?.api?.clearSelectedRows();
    }
  };

  // Render the data grid component
  return (<>
    <div className="datatable">
      {/* DataGrid component */}
      <DataGridPro
        rows={rows}
        pagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        key={tabName}
        getRowId={(rows) => rows._id}
        columns={[...actionColumn, ...userColumns]}
        loading={isLoading}
        rowCount={pageInfo?.totalRowCount || 1}
        onPageSizeChange={(x) => handlePagination("pageSize", x)}
        onPageChange={(x) => handlePagination("page", x)}
        pageSize={pageInfo?.pageSize || 10}
        page={pageInfo?.page || 0}
        paginationMode="server"
        checkboxSelection
        disableSelectionOnClick
        onRowClick={handleRowClick}
        selectionModel={selectedRow}
        onSelectionModelChange={handleSelectionModelChange}
        scrollbarSize={10}
      />
    </div>
  </>
  );
};

export default InvoiceItemsTable;