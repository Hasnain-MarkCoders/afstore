import { DataGridPro } from "@mui/x-data-grid-pro";
import { useRef, useState } from "react";
import { Box, Button, Modal, Typography, Fade, Backdrop, Tooltip, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Alert, Snackbar } from "@mui/material";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import CustomChip from "../../components/CustomChip/CustomChip";

const userColumns = [
  { field: "email", headerName: "Email", flex: 1 },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 1
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      return (
        <CustomChip title={params.row.status} className={`cellWithStatus  ${params.row.status}`} />
      );
    },
  },
];


const Datatable = ({ data  ,isLoading , setPaginationModel }) => {

  const [error, setError] = useState("")
  const [fields, setFields] = useState(null)
  // const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({
    open:false,
    severity:"success",
    message:""
  })

  const boolRef = useRef(false);

  const handleEditModal = (data) => {
    setFields(data)
  };
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setFields(p => ({ ...p, [name]: value }))
  }
  const handleSubmitUpdateUser = async (e) => {

    if (newPassword !== confirmPassword) {
      e.preventDefault()
      setAlert({
        severity:"error",
        open:true,
        message:"Password and confirm password do not match"
      })
      return   ;
    }
    e.preventDefault();
    API.post(`/suadmin/edit-user`, {
      id: fields._id,
      name: fields.name,
      email: fields.email,
      type: fields.type,
      // current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }).then((response) => {
      handleEditModal(null);
      setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
      setAlert({
        severity:"success",
        open:true,
        message:"Details updated successfully"
      })
      setConfirmPassword("")
      setNewPassword("")
    }).catch((error) => { setError(error) })
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
             title={"Edit"}
             className="action-icon-btn editBtn"
             cb={()=>handleEditModal(params.row)}
             icon={<EditIcon/>}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">

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
        <Fade in={!!fields}  >
          
          <Box>
            <form onSubmit={handleSubmitUpdateUser}>
              <Box className="modal-body" >
                <a onClick={() => handleEditModal(null)} className="close-btn">
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2">
                  Update User
                </Typography>
                  <TextField type="text" value={fields.name} name='name' onChange={handleInput} label="Name" fullWidth variant="outlined" />
                  <TextField type="email" value={fields.email} name="email" onChange={handleInput} label="Email" fullWidth variant="outlined" />
                  {/* <TextField type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e?.target?.value)} label="Current Password" fullWidth variant="outlined" /> */}
                  <TextField type="password" value={newPassword} onChange={(e) => setNewPassword(e?.target?.value)} label="New Password" fullWidth variant="outlined" />
                  <TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e?.target?.value)} label="Confirm Password" fullWidth variant="outlined" />
                  <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Type</InputLabel>
                      <Select
                      name="type"
                        value={fields?.type}
                        label="Type"
                        onChange={(e) => handleInput(e)}
                        required
                      >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"customer"}>Customer</MenuItem>
                        <MenuItem value={"factory"}>Factory</MenuItem>
                        <MenuItem value={"suadmin"}>Super Admin</MenuItem>

                      </Select>
                    </FormControl>
                  {error?.response?.data?.message &&
                    <p style={{ color: "red", fontStyle: "italic" }}>{error?.response?.data?.message}</p>
                  }
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


      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={alert.open} autoHideDuration={6000} onClose={()=>{
      setAlert({
        open:false,
        severity:"success",
        message:""
      })
    }}>
  <Alert
    onClose={()=>{
      setAlert({
        open:false,
        severity:"success",
        message:""
      })
    }}
    severity={alert.severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {alert.message}
  </Alert>
</Snackbar>

        <DataGridPro
          className="datagrid"
          getRowId={(rows) => rows?._id}
          rows={data?.users}
          loading={isLoading}
          columns={[...userColumns, ...actionColumn]}
          pageSize={9}
          rowsPerPageOptions={[9]}
        />
    </div>
  );
};

export default Datatable;
