import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
} from "@mui/x-data-grid-pro";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import "./tags.scss";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import API from "../../api/api";
import { useSelector } from "react-redux";
import TagEditModal from "../../components/Modals/TagModals/TagEditModal";
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
  {
    field: "type",
    headerName: "Type",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      return <span style={{ textTransform: 'capitalize' }}>{params.row.type}</span>;
    },
  },
  {
    field: "name", headerName: "Name", minWidth: 200, flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    minWidth: 190,
    flex: 1,
    renderCell: (params) => {
      return formattedDateTime(params.row.date);
    },
  },
];

export default function ({
  isLoading = false,
  rows = [],
  setPaginationModel,
  selectedRow,

}) {
  const auth = useSelector((state) => state.user);
  const [addTagError, setAddTagError] = useState(null);
  const handleAddTagError = (data) => {
    setAddTagError(data);
  };

  // add Action
  const boolRef = useRef(false);

  // delete
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteModal = (data) => {
    setDeleteId(data);
  };
  const deleteTag = async (_id) => {
    API.delete(`/admin/delete-tag`, {
      params: { id: _id, }
    }).then((response) => {
      setDeleteId(null);
      setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    });
  };

  // edit
  const [fields, setFields] = useState(null);
  const handleEditModal = (data) => {
    setFields(data);
  };
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    setFields((prevFields) => {
      // Determine the value based on the component type
      const newValue = type === "checkbox" ? checked : value;
      return {
        ...prevFields,
        [name]: newValue,
      };
    });
  };

  const handleSubmitUpdateTag = async (e) => {
    e.preventDefault();

    API.post(`/admin/edit-tag`, {
      id: fields._id,
      type: fields.type,
      name: fields.name,
    })
      .then((response) => {
        handleEditModal(null);
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        handleAddTagError(error?.response?.data?.message);
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
            title="Edit"
            className="action-icon-btn editBtn"
            cb={()=>handleEditModal(params.row)}
            icon={<EditIcon/>}
            />
            <CustomIcon
             title={"Delete"}
             className="action-icon-btn deleteBtn"
             cb={()=>handleDeleteModal(params.row._id)}
             icon={<DeleteForeverIcon/>}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Box className="datatable" sx={{ height: "calc(100vh - 180px)" }}>
        {fields && (
           <TagEditModal 
           handleSubmitUpdateTag={handleSubmitUpdateTag}
           fields={fields}
           handleInput={(e)=>{handleInput(e)}}
           handleEditModal={()=>{handleEditModal(null)}}
           />
        )}

 
        {addTagError &&   
        <ErrorModal
        reason={addTagError}
        handleErrorModal ={()=>handleAddTagError(null)}
      />}
           
        {deleteId && (
            <DeleteModal
            title={"Delete Tag"}
            handleDeleteModal={()=>{handleDeleteModal(null)}}
            deleteId={deleteId}
            handleDelete={()=>{deleteTag(deleteId)}}
           />
        )}

        <DataGridPro
          rows={rows}
          getRowId={(rows) => rows?._id}
          columns={[...actionColumn, ...columns]}
          loading={isLoading}
          pagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          // rowCount={pageInfo?.totalRowCount || 1}
          // onPageSizeChange={(x) => handlePagination("pageSize", x)}
          // onPageChange={(x) => handlePagination("page", x)}
          // pageSize={pageInfo?.pageSize || 10}
          // page={pageInfo?.page || 0}
          paginationMode="server"
          selectionModel={selectedRow}
          scrollbarSize={10}
        />
      </Box>
    </>
  );
}
