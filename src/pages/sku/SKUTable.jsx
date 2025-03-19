import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
} from "@mui/x-data-grid-pro";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import "./sku.scss";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import API from "../../api/api";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Toolbar } from "../../components/pagination/paginationDataGrid";
import SKUEditModal from "../../components/Modals/SKUModals/SKUEditModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import ErrorModal from "../../components/Modals/ErrorModal";
import CustomIcon from "../../components/CustomIcon/CustomIcon";

const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format options for date and time
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(
    undefined,
    timeFormatOptions
  );

  const formatted = `${formattedDate} ${formattedTime}`;
  return formatted;
};

const columns = [
  // {
  //   field: "title",
  //   headerName: "Title",
  //   minWidth: 200,
  //   flex: 1,
  // },
  // {
  //   field: "ename",
  //   headerName: "Ename",
  //   minWidth: 120,
  //   flex: 1,
  // },
  // {
  //   field: "cname",
  //   headerName: "Cname",
  //   minWidth: 120,
  //   flex: 1,
  // },
  // {
  //   field: "production_time",
  //   headerName: "Production Time",
  //   minWidth: 120,
  //   flex: 1,
  // },
  // {
  //   field: "pair",
  //   headerName: "Pair",
  //   minWidth: 150,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.properties ? params.row.properties.pair : "";
  //   },
  // },
  // {
  //   field: "name",
  //   headerName: "Name",
  //   minWidth: 150,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.properties?.name
  //       ? params.row.properties.name === "not_mandatory"
  //         ? "Not Mandatory"
  //         : params.row.properties.name === "mandatory"
  //         ? "Mandatory"
  //         : params.row.properties.name === "optional"
  //         ? "Optional"
  //         : ""
  //       : "";
  //   },
  // },
  // {
  //   field: "image",
  //   headerName: "Image",
  //   minWidth: 150,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.properties?.image
  //       ? params.row.properties.image === "not_mandatory"
  //         ? "Not Mandatory"
  //         : params.row.properties.image === "mandatory"
  //         ? "Mandatory"
  //         : params.row.properties.image === "optional"
  //         ? "Optional"
  //         : ""
  //       : "";
  //   },
  // },
  // {
  //   field: "factory_price_usd",
  //   headerName: "Factory Price USD",
  //   minWidth: 140,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.factory_price_usd
  //       ? `$${params.row.factory_price_usd}`
  //       : "";
  //   },
  // },
  // {
  //   field: "factory_price",
  //   headerName: "Factory Price RMB",
  //   minWidth: 140,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.factory_price ? `¥${params.row.factory_price}` : "";
  //   },
  // },
  // {
  //   field: "customer_price",
  //   headerName: "Customer Price",
  //   minWidth: 150,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return params.row.customer_price ? `$${params.row.customer_price}` : "";
  //   },
  // },
  // {
  //   field: "date",
  //   headerName: "Date",
  //   minWidth: 190,
  //   flex: 1,
  //   renderCell: (params) => {
  //     return formattedDateTime(params.row.date);
  //   },
  // },

  {
    field: "sku",
    headerName: "SKU",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "sku_id",
    headerName: "SKU_ID",
    minWidth: 120,
    flex: 1,
  },
  {
    field: "unit_price",
    headerName: "UNIT_PRICE",
    minWidth: 120,
    flex: 1,
  },

  {
    field: "date",
    headerName: "Date",
    minWidth: 190,
    flex: 1,
    renderCell: (params) => {
      return formattedDateTime(params.row.created_at);
    },
  },
];

export default function ({
  isLoading = false,
  rows = [],
  pageInfo = {},
  setPaginationModel,
  selectedRow,
}) {
  const auth = useSelector((state) => state.user);
  const [addSkuError, setAddSkuError] = useState(null);
  const [fields, setFields] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const boolRef = useRef(false);
  const navigate = useNavigate()
  // add Action

  const handleAddSkuError = (data) => {
    setAddSkuError(data);
  };

  // delete
  const handleDeleteModal = (data) => {
    setDeleteId(data);
  };
  const deleteSku = async (_id) => {
    API.post(`/admin/sku/delete`, {
      id: _id,
    }).then((response) => {
      setDeleteId(null);
      setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    });
  };

  // edit
  const handleEditModal = (data) => {
    setFields(data);
  };
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    setFields((prevFields) => {
      // Determine the value based on the component type
      const newValue = type === "checkbox" ? checked : value;

      // Check if the field is a nested property within 'properties'
      if (prevFields.properties && name in prevFields.properties) {
        return {
          ...prevFields,
          properties: {
            ...prevFields.properties,
            [name]: newValue,
          },
        };
      } else {
        // For non-nested properties
        return {
          ...prevFields,
          [name]: newValue,
        };
      }
    });
  };

  const handleSubmitUpdateSKU = async (e) => {
    e.preventDefault();
    API.post(`/${auth?.type}/sku/edit`, {
      ...fields,
      // id: fields._id,
      // title: fields.title,
      // ename:fields.ename,
      // cname:fields.cname,
      // production_time: fields.production_time,
      // factory_price: parseFloat(fields.factory_price),
      // customer_price: parseFloat(fields.customer_price),
      // properties: {
      //   pair: fields.properties.pair,
      //   name: fields.properties.name,
      //   image: fields.properties.image,
      // },
    })
      .then((response) => {
        handleEditModal(null);
        handlePagination("pageSize", pageInfo.pageSize);
        handlePagination("page", pageInfo.page);
      })
      .catch((error) => {
        handleAddSkuError(error?.response?.data?.message);
      });
  };

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
             cb={()=>navigate(`/sku/${params.row._id}`)}
             icon={ <RemoveRedEyeIcon />}
            />
            <CustomIcon
             title={"Edit"}
             className="action-icon-btn editBtn"
             cb={()=>handleEditModal(params.row)}
             icon={ <EditIcon />}
            />

            <CustomIcon
             title={"Delete"}
             className="action-icon-btn deleteBtn"
             cb={()=>handleDeleteModal(params.row._id)}
             icon={ <DeleteForeverIcon />}
            />
          </div>
        );
      },
    },
  ];

  const handlePagination = (fieldName, value) => {
    setPaginationModel((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <>
    
      <Box className="datatable" sx={{ height: "calc(100vh - 180px)" }}>
        {fields && (
              <SKUEditModal
              sku={fields?.sku}
              sku_id={fields?.sku_id}
              unit_price={fields?.unit_price}
              setSku={(e) => { setFields({ ...fields, sku: e }) }}
              setSkuId={(e) => { setFields({ ...fields, sku_id: e }) }}
              setUnitPrice={(e) => { setFields({ ...fields, unit_price: e }) }}
              handleEditModal={()=>handleEditModal(null)}
              fields={fields}
              handleInput={(e)=>handleInput(e)}
              handleSubmitUpdateSKU={(e)=>handleSubmitUpdateSKU(e)}
              />
        )}
         
         
        {addSkuError && (
           <ErrorModal
           reason={addSkuError}
           handleErrorModal ={()=>handleAddSkuError(null)}
           />
        )}
          
        {deleteId && (
          <DeleteModal
          title={"Delete SKU"}
          handleDeleteModal={()=>{handleDeleteModal(null)}}
          deleteId={deleteId}
          handleDelete={()=>{deleteSku(deleteId)}}
          />
        )}

        <DataGridPro
          rows={rows}
          getRowId={(rows) => rows?._id}
          columns={[...actionColumn, ...columns]}
          loading={isLoading}
          pagination
          rowsPerPageOptions={[10, 25, 50, 100]}
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
