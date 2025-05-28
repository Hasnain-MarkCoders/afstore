import React from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
} from '@mui/x-data-grid-pro';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import "./styles.scss";
import {  IconButton, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Toolbar } from "../../../components/pagination/paginationDataGrid";
import CustomIcon from "../../../components/CustomIcon/CustomIcon";

const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Format options for date and time
  const timeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const formattedTime = dateTime.toLocaleTimeString(undefined, timeFormatOptions);

  const formatted = `${formattedDate} ${formattedTime}`
  return (formatted);
}

const columns = [
  {
    field: "po", headerName: "Po", minWidth: 140, flex: 1,
  },
  {
    field: "store_id", headerName: "Store Id", minWidth: 200, flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    minWidth: 190,
    flex: 1,
    renderCell: (params) => {
      console.log(params.row)
      return (formattedDateTime(params.row.created_at));
    },
  },
];

export default function ({ isLoading = false, rows = [], pageInfo = {}, setPaginationModel, selectedRow}) {
const navigate= useNavigate()

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="cellAction">

            
          <CustomIcon
             title={"View"}
             className="action-icon-btn viewBtn"
             cb={()=>navigate(`/raw-orders/${params.row._id}`)}
             icon={<RemoveRedEyeIcon />}
            />
          </div>
        );
      },
    },
  ];

  const handlePagination = (fieldName, value) => {
    setPaginationModel(prev => ({
      ...prev, [fieldName]: value
    }))
  }


  return (
    <>
      <Box className="datatable" sx={{ minHeight: "calc(100vh - 140px)" }}>
        <DataGridPro
          rows={rows}
          getRowId={(rows) => rows?._id}
          columns={[ ...columns ,...actionColumn]}
          loading={isLoading}
          pagination
          rowsPerPageOptions={[5 , 10, 15, 20]}
          rowCount={pageInfo?.totalRowCount || 1}
          onPageSizeChange={(x) => handlePagination("pageSize", x)}
          onPageChange={(x) => handlePagination("page", x)}
          pageSize={pageInfo?.pageSize || 10}
          page={pageInfo?.page || 0}
          paginationMode="server"
          selectionModel={selectedRow}
          scrollbarSize={10}
          components={{
            Toolbar,
          }}
        />
        
      </Box>
    </>
  );
}
