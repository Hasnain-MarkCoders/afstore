import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Modal, Typography, Fade, Backdrop, Container, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import UserTable from "./UsersTable";
import '../styles.scss'
import API from "../../api/api";
import useQueryUser from "../../Hooks/useQueryUser/useQueryUser";
export const Users = ({ setShowSideBar }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const boolRef = useRef(false);
  const [paginationModel, setPaginationModel] = useState({})
  const { isLoading, data } = useQueryUser(paginationModel);
  const [loading, setLoading] = useState(false)
  const handleModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };
  const isPending = isLoading ||loading

  const handleSubmitAddUser = async (e) => {
    e.preventDefault();
    setLoading(true)
   return API.post(`/suadmin/add-user`, {
      name: name,
      email: email,
      password: password,
      confirm_password: confirmPassword,
      type: type
    })
      .then((responce) => {
        handleModal();
        // Reset the form fields
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
        setName("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setType("");
      })
      .catch((error) => {
        setError(error);
      }).finally(()=>{
        setLoading(false)
      })
  };

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="Users">
        <div
          className="add-category"
        >
          <h2 className="page-title">Users</h2>
          <Button onClick={handleModal} className="btn btn-outline-primary">
            Add User
          </Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={!isPending &&handleModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal"
          >
            <Fade in={open} >
              <Box>
                <Box className="modal-body" >
                  <a onClick={!isPending ? handleModal:()=>{}} className="close-btn">
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    Add User
                  </Typography>
                  <form onSubmit={handleSubmitAddUser}>
                    <TextField type="text" value={name} onChange={(e) => setName(e?.target?.value)} label="Name" fullWidth style={{ marginBottom: "20px" }} variant="outlined" required/>
                    <TextField type="email" value={email} onChange={(e) => setEmail(e?.target?.value)} label="Email" fullWidth style={{ marginBottom: "20px" }} variant="outlined" required/>
                    <TextField type="password" value={password} onChange={(e) => setPassword(e?.target?.value)} label="Password" fullWidth style={{ marginBottom: "20px" }} variant="outlined" required/>
                    <TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e?.target?.value)} label="Confirm Password" fullWidth style={{ marginBottom: "20px" }} variant="outlined" required/>
                    <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Type</InputLabel>
                      <Select
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e?.target?.value)}
                        required
                      >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"customer"}>Customer</MenuItem>
                        <MenuItem value={"factory"}>Factory</MenuItem>
                        <MenuItem value={"suadmin"}>Super Admin</MenuItem>

                      </Select>
                    </FormControl>
                    {error?.response?.data?.message &&
                      <p style={{ color: "red", fontStyle: "italic", marginBottom: "20px" }}>{error?.response?.data?.message}</p>
                    }

                    <Box className="modal-footer">
                      <Button
                      disabled={isPending}

                        className="btn btn-outline-primary"
                        onClick={handleModal}
                      >
                        Cancel
                      </Button>
                      <Button 
                      disabled={isPending}
                      className="btn btn-primary" type="submit">
                        {isPending?"Adding...":"Add"}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Fade>
          </Modal>
        </div>
        <UserTable data={data} isLoading={isLoading} setPaginationModel={setPaginationModel} />
      </div>
    </Container>
  </>
  );
};
