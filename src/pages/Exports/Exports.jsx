import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Link, Container, Chip, Button, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import API from "../../api/api";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Toolbar } from "../../components/pagination/paginationDataGrid";
import { useLocation } from "react-router-dom";
import moment from "moment/moment";
import ReplayIcon from '@mui/icons-material/Replay';
const Exports = ({ setShowSideBar }) => {
  const auth = useSelector((state) => state.user);
  const refresh = useSelector(state=>state.refresh)
  const authType = auth.type;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // 0-based index for DataGrid
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const fetchExports = useCallback(async (isLoading=false) => {
    if (isLoading) {
      setLoading(true);
    }
    setError("");

    try {
      // API request simulation (replace this with your real API call)
      const response = await API.get(`/${authType}/get-exports`, {
        params: {
          page: page + 1, // Backend expects 1-based page indexing
          limit: pageSize,
        },
      });

  

      if (response.data.success) {
        const media = response.data.data.map((item) => ({
          id: item._id, // Ensure unique IDs
          name: item.userId?.name || "Unknown",
          date: dayjs(item.createdAt).format("YYYY-MM-DD  h:mm A"),
          time: dayjs(item.createdAt).format("YYYY-MM-DD  h:mm A"),
          status: item.done ? "Download" : "In Progress",
          isFailed:item.isFailed,
          isDone:item?.done,
          invoicePdf: item.invoice_pdf,
          itemsSheet: item.items_sheet,
        }));
        setData(media);
        setRowCount(response.data.pagination.totalDocuments);
      } else {
        setError("Failed to fetch media data.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [authType, page, pageSize]);



  useEffect(() => {
    fetchExports(true); 

  }, [fetchExports, refresh]);

  const columns = [
    { field: "name", headerName: "User", flex: 1 },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      renderCell: ({ value }) => (
        moment(value).fromNow()
      ),
    },
    { field: "date", headerName: "Date", flex: 1, type: "date" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ value, row }) => (
        <>
       {/* <Chip    label={value} color={value === "Download" ? "success" : "warning"} /> */}

       {!row.isFailed && (<Chip label={value} color={value === "Download" ? "success" : "warning"} />)}
       {row.isFailed && (<Chip label={"Failed"} 
       sx={{
        cursor:"pointer"
       }}
        // onDelete={() => {
        //   console.log(row)
        //   const updatedData = data.map(item => {
        //     if (item.id === row.id) {
        //       return { ...item, isFailed: false, status: "In Progress" };
        //     }
        //     return item;
        //   });
        //   setData(updatedData);
        // }} 
       
      //  deleteIcon={
      //   <ReplayIcon 
      //     sx={{ 
      //       fontSize:30,
      //       color: "white", 
      //     }} 
      //   />
      // } 
      />)}

    

        </>
    
      ),
    },
    {
      field: "invoicePdf",
      headerName: "Invoice PDF",
      flex: 1,

      renderCell: ({ value }) =>
        value ? (
          <Tooltip title={value}>
          <Link
          href={value} target="_blank" rel="noopener">
            {/* View PDF */}
            {value?.slice(0,20)+"..."}
          </Link>
          </Tooltip>
        ) : (
          <Typography color="textSecondary">N/A</Typography>
        ),
    },
    {
      field: "itemsSheet",
      headerName: "Items Sheet",
      flex: 1,

      renderCell: ({ value }) =>
        value ? (
          <Tooltip title={value}>
          <Link
          href={value} target="_blank" rel="noopener">
                {/* View Excel */}
            {value?.slice(0,20)+"..."}

          </Link>
          </Tooltip>
        ) : (
          <Typography color="textSecondary">N/A</Typography>
        ),
    },
  ];



  return (
    <>
      <Sidebar />
      <Navbar setShowSideBar={setShowSideBar} />
      <Container maxWidth="100" className="contailer-fluid">
        <Box p={4}>
       
          <Typography  variant="h4" gutterBottom>
            Download Center
          </Typography>
          {error ? (
          
              <Box display="flex" justifyContent="center" flexDirection={"column"} gap={4} alignItems="center" minHeight="600px">
             <Typography color="error" variant="body1">
              {error}
            </Typography>
            <Button
            onClick={fetchExports}
            variant="contained">Try Again</Button>
            </Box>
          )  
          
          :(
            <Box sx={{  width: "100%", overflowX: "auto"  }}>
              {/* Set a minWidth to force the grid to be wider than its container */}
            <Box sx={{ minWidth: "1200px"}} className="datatable">

                <DataGridPro
           
                needsHorizontalScroll={true}
                  rows={data}
                  columns={columns}
                  pagination
                  page={page}
                  pageSize={pageSize}
                  disableColumnResize={false}
                  autoPageSize
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]}
                  rowCount={rowCount}
                  paginationMode="server"
                  loading={loading}
                   components={{
                              Toolbar,
                            }}
                />
            </Box>
            </Box>

          )}
        </Box>
      </Container>
    </>
  );
};

export default Exports;
