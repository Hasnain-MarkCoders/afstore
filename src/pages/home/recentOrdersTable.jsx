import { DataGridPro } from "@mui/x-data-grid-pro";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const userColumns = [
  {
    field: "po", headerName: "Po", minWidth: 110
  },
  {
    field: "po_id", headerName: "Po Id", minWidth: 240
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 200
  },
  {
    field: "submitted",
    headerName: "Submitted Date",
    minWidth: 140,
    flex: 1,
    renderCell: (params) => {
      const date = new Date(params.row.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      const timeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const formattedTime = date.toLocaleTimeString(undefined, timeFormatOptions);
    
      const formatted = `${formattedDate} ${formattedTime}`;
      return formatted;
    },
  },
  {
    field: "waybill_number",
    headerName: "WayBill Number",
    flex: 1,
    minWidth: 190
  },
  {
    field: "order_status",
    headerName: "Order Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus status-btn ${params.row.order_status ? "complete" : ""}`}>
          {params.row.order_status}
        </div>
      );
    }
  }
];


const RecentOrdersTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const auth = useSelector(
    state => state.user
  )

  useEffect(() => {
    API.post(`/${auth?.type}/line-orders`, {
      filter: []
    }).then((response) => {
      setData(response?.data)
    })
      .catch((error) => {
        if (error?.response?.status === 480) {
          navigate("/login");
        }
      })
  }, [])

  return (
    <div className="datatable">
      {data?.lineOrders &&
        <DataGridPro
          className="datagrid"
          getRowId={(rows) => rows?._id}
          rows={data?.lineOrders}
          columns={userColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />}
    </div>
  );
};

export default RecentOrdersTable;
