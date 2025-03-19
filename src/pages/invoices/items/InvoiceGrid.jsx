import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import API from "../../../api/api";
import "./../style.scss";
import CustomIcon from "../../../components/CustomIcon/CustomIcon";

export default function DataGridDemo() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getInvoices().then((data) => {
      const sortedInvoices = data.date.map((date, index) => ({
        id: index + 1,
        date: date,
        invoice_pdf: data.invoice_pdf[index],
        items_sheet: data.items_sheet[index],
      }));

      setGridData(sortedInvoices);
      setLoading(false);
    });
  }, []);

  function getInvoices() {
    return API.get("/admin/invoice/get-invoice")
      .then((res) => {
        const invoices = res.data.invoices;
        const pagination = res.data.pagination;
        const invoice_pdf = invoices.map((invoice) => invoice.invoice_pdf);
        const items_sheet = invoices.map((invoice) => invoice.items_sheet);
        const date = invoices.map((invoice) => invoice.date);
        return { invoice_pdf, items_sheet, date , pagination };
      })
      .catch((err) => {
      });
  }


const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "date",
    headerName: "Date",
    width: 500,
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
    // flex: 1,
    width: 100,
    renderCell: (params) => {
      const handleViewInvoice = () => {
        window.open(params.value, "_blank");
      };

      return (

        <CustomIcon
        style={ {color: "#7451f8"} }
        title={"View Invoice"}
        className="action-icon-btn viewBtn"
        cb={handleViewInvoice}
        icon={ <RemoveRedEyeIcon />}
       />
        // <Tooltip title="View Invoice">
        //   <IconButton onClick={handleViewInvoice} style={{ color: "#7451f8" }}>
        //     <RemoveRedEyeIcon />
        //   </IconButton>
        // </Tooltip>
      );
    },
  },
  {
    field: "items_sheet",
    headerName: "Items Sheet",
    // flex: 1,
    width: 100,
    renderCell: (params) => {
      const handleViewItemsSheet = () => {
        window.open(params.value, "_blank");
      };

      return (
        <CustomIcon
        style={ {color: "#1fc600"} }
        title={"View Items Sheet"}
        className="action-icon-btn viewBtn"
        cb={handleViewItemsSheet}
        icon={ <DownloadIcon />}
       />
        // <Tooltip title="View Items Sheet">
        //   <IconButton onClick={handleViewItemsSheet}>
        //     <DownloadIcon />
        //   </IconButton>
        // </Tooltip>
      );
    },
  },
];

const handleRowClick = (params) => {
  if (params.row) {
    params?.api?.clearSelectedRows();
  }
};

return (
  <Box className="dataGrid" sx={{ height: 600, width: "100%" }}>
    {loading ? ( // Render CircularProgress if loading is true
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    ) : (
      <DataGridPro
        rows={gridData}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={handleRowClick}
      />
    )}
  </Box>
);
}