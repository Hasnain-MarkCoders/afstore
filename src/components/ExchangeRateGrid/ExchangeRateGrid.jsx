import * as React from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Backdrop, Button, Fade, Modal, TextField, Typography, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import "./style.scss";
import { useSelector } from "react-redux";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon/CustomIcon";

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
  // { field: "id", headerName: "ID", width: 90 },
  {
    field: "rmb",
    headerName: "RMB",
    flex: 1,
    renderCell: (params) => {
      return `¥${params.row.rmb}`
    }
  },
  {
    field: "usd",
    headerName: "USD",
    flex: 1,
    renderCell: (params) => {
      return `$${params.row.usd}`
    }
  },
  {
    field: "last_updated",
    headerName: "Last Update",
    flex: 1,
    renderCell: (params) => {
      return (!!params.row.last_updated ? formattedDateTime(params.row.last_updated) : null)
    }
  }
];

export default function ExchangeRateGrid() {

  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fields, setFields] = React.useState(null)

  const auth = useSelector(
    state => state.user
  )
  const navigate = useNavigate();
  React.useEffect(() => {
    API.get(`/${auth?.type}/exchange-rate`)
      .then((response) => {
        setData(response?.data)
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 480) {
          navigate('/login')
        }
      })
  }, [fields])


  // Edit EMB & USD

  const handleEditModal = (data) => {
    setFields(data)
  };
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setFields(p => ({ ...p, [name]: value }))
  }
  const handleSubmitUpdateLineOrder = async (e) => {
    e.preventDefault();

    API.post(`/${auth?.type}/exchange-rate/update`, {
      id: fields._id,
      usd: fields.usd,
      rmb: fields.rmb,
    }).then((response) => {
      setIsLoading(true);
      handleEditModal(null);
    })
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <div className="action-icon-btn viewBtn">
                <Tooltip title="View">
                  <IconButton>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip>
              </div> */}

          <CustomIcon
             title={"Edit"}
             className="action-icon-btn editBtn"
             cb={()=>handleEditModal(params.row)}
             icon={<EditIcon/>}
            />
            {/* <div className="action-icon-btn editBtn">
              <Tooltip title="Edit">
                <IconButton onClick={() => handleEditModal(params.row)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div> */}
            {/* <div className="action-icon-btn deleteBtn">
                <Tooltip title="Delete">
                  <IconButton>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </div> */}
          </div>
        );
      },
    },
  ];

  return (
    <Box className="dataGrid" sx={{ height: 160.5, width: "100%" }}>
      {fields && <Modal
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
        <Fade in={!!fields} >
          <Box>
            <form onSubmit={handleSubmitUpdateLineOrder}>
              <Box className="modal-body" >
                <a onClick={() => handleEditModal(null)} className="close-btn">
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2" style={{ fontSize: "25px" }}>
                  Update Exchange Rate
                </Typography>
                <TextField type="text"
                  label="USD"
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "10px" }}
                  value={fields.usd}
                  onChange={handleInput}
                  name="usd"
                />
                <TextField type="text"
                  label="RMB"
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "10px" }}
                  value={fields.rmb}
                  onChange={handleInput}
                  name="rmb"
                />
                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => handleEditModal(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Update
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>}
      <DataGridPro
        rows={data}
        getRowId={(rows) => rows._id}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        loading={isLoading}
        pageSizeOptions={[5]}
      />
    </Box>
  );
}
