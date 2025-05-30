import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from '@mui/icons-material/Download';
import "./../style.scss";
import { IconButton, Tooltip } from "@mui/material";
import CustomIcon from "../../../components/CustomIcon/CustomIcon";
import { colors } from "@material-ui/core";

export default function DataGridDemo({ rows, isLoading, pageInfo, setPaginationModel }) {
  const columns = [
    { field: "_id", headerName: "ID", minWidth: 90 , flex: 1 },
    {
      field: "date",
      headerName: "Date",
      minWidth: 300,
      flex: 1,
      editable: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
      },
    },
    {
      field: "invoice_pdf",
      headerName: "Invoice PDF",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const handleViewInvoice = () => {
          // window.open(params.value, "_blank");
        };

        return (
          <CustomIcon
          style={ {color: "#7451f8"} }
          title={"View Invoice"}
          className="action-icon-btn viewBtn"
          cb={handleViewInvoice}
          icon={ <RemoveRedEyeIcon />}
         />
        );
      },
    },
    {
      field: "items_sheet",
      headerName: "Items Sheet",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const handleViewItemsSheet = () => {
          // window.open(params.value, "_blank");
        };

        return (

            <CustomIcon
            style={ {color: "#1fc600"} }
          title={"View Items Sheet"}
          className="action-icon-btn viewBtn"
          cb={handleViewItemsSheet}
          icon={ <DownloadIcon />}
         />
        );
      },
    },
  ];

  const handlePagination = (fieldName, value) => {
    setPaginationModel(prev => ({
      ...prev, [fieldName]: value
    }))
  }

  const handleRowClick = (params) => {
    if (params.row) {
      params?.api?.clearSelectedRows();
    }
  };

  return (
    <Box className="dataGrid" sx={{ height: 600, width: "100%" }}>
      <DataGridPro
        rows={rows}
        loading={isLoading}
        columns={columns}
        getRowId={(rows) => rows?._id}
         pagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        rowCount={pageInfo?.totalRowCount || 1}
        onPageSizeChange={(x) => handlePagination("pageSize", x)}
        onPageChange={(x) => handlePagination("page", x)}
        pageSize={pageInfo?.pageSize || 10}
        page={pageInfo?.page || 0}
        paginationMode="server"
        scrollbarSize={10}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={handleRowClick}
      />
    </Box>
  );
}