import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Container from "@mui/material/Container";
import "./styles.scss";
import API from "../../../api/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box } from "@mui/material";
import AutohideSnackbar from "../../../components/snackbar/Snackbar";

export const originalPropertiesColumn = [
  {
    field: "name", headerName: "Name", minWidth: 250, flex: 1
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
    minWidth: 500,
    renderCell: (params) => {
      return (
        // params.row?.value ? params.row.value.startsWith("http") ?
        //   <Link to={params.row.value} className={`cellWithStatus status-btn`} target="blank">
        //     View Image
        //   </Link>
        //   : params.row.value : <></>
        <>
        {params.row.value}
        </>
      )
    },
  }
];

const PupringViewList = ({ setShowSideBar }) => {
  const [snackbar, setSnackbar] = useState({
    open:false,
    message:""
  })
  const auth = useSelector(
    state => state.user
  )
  const { pupringId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      API.get(`/${auth?.type}/line-order/` + pupringId)
      .then((response) => {
        setData(response?.data)
        setIsLoading(false);
      })
    }
    fetchData();
    }, [])
    
  let userColumns = []
  if (data?.properties){
    //  userColumns = [
    //   {
    //     field: "name", headerName: "Name", minWidth: 100, flex: 1,
    //     renderCell: (params) => {
    //       return (params.row?.name &&  <div>
    //           {params.row?.name}
    //         </div>
    //       );
    //       }
    //   },
    //   {
    //     field: "value",
    //     headerName: "Value",
    //     flex: 1,
    //     minWidth: 200,
    //     renderCell: (params) => {
  
    //       return (
    //         // params.row?.value?.startsWith("http") ?
    //           // <Link to={params.row?.value} className={`cellWithStatus status-btn`} target="blank">
    //           //   View Image
    //           // </Link>
    //           // : params.row?.value
    //           <>
    //           {params.row.value}
              
    //           </>

    //       )
    //     },
    //   }
    // ];

    const keys = Object.keys(data.properties[0]);

  userColumns = keys.map((key) => ({
    field: key,
    headerName: key.replace(/_/g, " "), // Optional: Format the header name
    minWidth: 150,
    flex: 1,
    renderCell: (params) => (
      <div>{params.row[key]}</div>
    ),
  }));
  }
  // else if(data?.properties && (data?.properties[0]?.customizedContent || data?.properties && data?.properties[0]?.url)){
  //    userColumns = [
  //     {
  //       field: "customizedContent", headerName: "Name", minWidth: 100, flex: 1,
  //       renderCell: (params) => {
  //         return (params.row?.customizedContent &&  <div>
  //             {params.row?.customizedContent}
  //           </div>
  //         );
  //         }
  //     },
  //     {
  //       field: "url",
  //       headerName: "Value",
  //       flex: 1,
  //       minWidth: 200,
  //       renderCell: (params) => {
  //         return (
  //           params.row?.url &&  params.row?.url?.startsWith("http") ?
  //             <Link to={params.row.url} className={`cellWithStatus status-btn`} target="blank">
  //               View Image
  //             </Link>
  //             : params.row.url
  //         )
  //       },
  //     }
  //   ];
  // }
  
  else{
     userColumns = []
  }
  const handleCopy=(field,text)=>{
    navigator.clipboard.writeText(text)
    setSnackbar({
      open:true,
      message:`${field} Copied to clipboad.`
    })
  }

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="add-category" style={{ marginBottom: "15px" }} >
        <h2 className="page-title"><Link to={"/afstore"} >AfStore</Link> / View</h2>
      </div>
      <div className="view-list">
        <div className="left" >
          <div className="item">
           
            <div className="details">
              <h1 className="itemTitle">Order Details</h1>
              {
                console.log(data)
              }
              {data && Object?.entries(data)?.map(([keys, values]) => {
                return (typeof values === "string") ?
                <Box sx={{
                  display:"flex",
                  alignItems:"center",
                  gap:"10px"
                }} className="detailItem" key={keys}>
                   

                  {["po","name", "tracking_number"].includes(keys)?<Box><Tooltip title={`Copy ${keys}`}><ContentCopyIcon style={{cursor:"pointer"}} onClick={()=>handleCopy(keys, values)}/></Tooltip></Box>:null}
                    <span className="itemKey" >{keys}:</span>
                    <span className="itemValue">{["last_comment_date", "invoice_date", "shipped_out", "accepted", "date", "submitted", "in_production"].includes(keys)?  new Date(values).toLocaleDateString() + " | " +
                new Date(values).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }):values}</span>
                  </Box> : 
                  <></>
                  
              })}
              
              {data?.admin_remarks && auth?.type === "admin" && <div className="detailItem">
                <span className="itemKey">Admin Remarks:</span>
                <span className="itemValue">{data?.admin_remarks}</span>
              </div>}
              {data?.factory_note && auth?.type !== "customer" && <div className="detailItem">
                <span className="itemKey">Factory Note:</span>
                <span className="itemValue">{data?.factory_note?.join(" , ")}</span>
              </div>}
              {
              }
            </div>
          </div>
        </div>

      </div>
      <div className="datatable skuTable" style={{position:"relative", minHeight:'300px'}}>
        <h1 className="itemTitle" style={{ padding: "15px" }}>Properties</h1>
        {data?.properties &&
          <DataGridPro
            className="datagrid"
            loading={isLoading}
            getRowId={(row) => row.id ? row.id : Math.random().toString()}
            rows={data?.properties}
            columns={userColumns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        }
      </div><div className="datatable skuTable" style={{position:"relative", minHeight:'300px'}}>
        <h1 className="itemTitle" style={{ padding: "15px" }}>Original Properties</h1>
        {data?.original_properties &&
          <DataGridPro
            className="datagrid"
            loading={isLoading}
            getRowId={(row) => row.id ? row.id : Math.random().toString()}
            rows={data?.original_properties}
            columns={originalPropertiesColumn}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        }
         <AutohideSnackbar open = {snackbar.open} message = {snackbar.message} onClose={()=>setSnackbar({open:false, message:""})}/>
      </div>
    </Container></>);
};

export default PupringViewList;
