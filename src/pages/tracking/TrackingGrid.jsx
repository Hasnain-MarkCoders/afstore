import React, { useState, useRef } from "react";
import API from "../../api/api";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Modal,
  Typography,
  Fade,
  Backdrop,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";

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

  const formatted = `${formattedDate}`;
  return formatted;
};

const columns = [
  {
    field: "starts_with",
    headerName: "Starts With",
    flex: 1,
  },
  {
    field: "ends_with",
    headerName: "Ends With",
    flex: 1,
  },
  {
    field: "url",
    headerName: "URl",
    flex: 1,
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1,
  },
 
];

const TrackingGrid = ({ rows, isLoading, setPaginationModel }) => {
  // add modal
  const [editFields, setEditFields] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState(null);
  const boolRef = useRef(false);

  const [serviceError, setServiceError] = useState(null);
  const handleSetTrackingError = (data) => {
    setServiceError(data);
  };
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setEditFields((p) => ({ ...p, [name]: value }));
  };

  const handleEditModal = (data) => {
    setEditFields(data);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    await API.post(`/admin/tracking/edit`, {
      id: editFields._id,
      starts_with: editFields.starts_with,
      ends_with: editFields.ends_with,
      company: editFields.company
    })
      .then((responce) => {
        setEditFields(null);
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
        // Reset the form fields
      })
      .catch((error) => {
        handleSetTrackingError(error?.response?.data?.message);
      });
  };


  const handleDeleteTracking = async (id) => {
    await API.delete(`/admin/tracking/delete`, {
      params: {
        id,
      }
    })
      .then((response) => {
        setDeleteId(null);
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        handleSetTrackingError(error?.response?.data?.message);
      });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      minWidth: 180,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="action-icon-btn viewBtn">
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => handleEditModal(params.row)}
                  data={params.row}
                  id="activate-field"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className="action-icon-btn deleteBtn">
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => setDeleteId(params.row._id)}
                  data={params.row}
                  id="activate-field"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Box className="datatable" >
      <DataGridPro
        rows={rows}
        getRowId={(row) => row._id}
        columns={[...columns, ...actionColumn]}
        rowsPerPageOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        loading={isLoading}
        autoHeight
      />


      {editFields && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={true}
          onClose={() => handleEditModal(null)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="custom-modal"
        >
          <Fade in={!!editFields}>
            <Box>
              <Box className="modal-body">
                <a onClick={() => handleEditModal(null)} className="close-btn">
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2">
                  Edit Tracking
                </Typography>
                <form onSubmit={handleSubmitEdit}>
                  <TextField
                    type="text"
                    label="Starts With"
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "20px" }}
                    value={editFields.starts_with}
                    onChange={handleInput}
                    name="starts_with"
                    required
                  />
                  <TextField
                    type="text"
                    label="Ends With"
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "20px" }}
                    value={editFields.ends_with}
                    onChange={handleInput}
                    name="ends_with"
                    required
                  />
                  <TextField
                    type="text"
                    label="Company"
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "10px" }}
                    value={editFields.company}
                    onChange={handleInput}
                    name="company"
                    required
                  />
                  <Box className="modal-footer">
                    <Button
                      className="btn btn-outline-primary"
                      onClick={() => handleEditModal(null)}
                    >
                      Cancel
                    </Button>
                    <Button className="btn btn-primary" type="submit">
                      Add
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}

{deleteId && <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => setDeleteId(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal delete-modal"
      >
        <Fade in={!!deleteId} >
          <Box>
            <Box className="modal-body" >
              <a onClick={() => setDeleteId(null)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2">
                Cancel Tracking
              </Typography>
              <Typography component="p">
                Are you sure want to cancel?
              </Typography>
              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={() => setDeleteId(null)}
                >
                  No
                </Button>
                <Button className="btn btn-outline-danger" onClick={() => handleDeleteTracking(deleteId)}>
                  Yes
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>}

      {serviceError && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={true}
          onClose={() => handleSetTrackingError(null)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="custom-modal delete-modal"
        >
          <Fade in={!!serviceError}>
            <Box>
              <Box className="modal-body">
                <a
                  onClick={() => handleSetTrackingError(null)}
                  className="close-btn"
                >
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2" color={"red"}>
                  Error
                </Typography>
                <Typography component="p">{serviceError}</Typography>
                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => handleSetTrackingError(null)}
                  >
                    Ok
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </Box>
  );
};

export default TrackingGrid;
