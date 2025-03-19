import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ReorderIcon from '@mui/icons-material/Reorder';
import "./navbar.scss";
import { Box, Button, Modal, Typography, Fade, Backdrop, Menu, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import React from "react";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { logoutAction } from "../../redux/slices/authAction";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Navbar = ({ setShowSideBar, logoutAction }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const auth = useSelector(
    state => state.user
  )

  const [openModal, setOpenModal] = React.useState(false);
  const handleModal = () => {
    setOpenModal((prevOpenModal) => !prevOpenModal);
  };

  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

  return (
    <div className="navbar">
      <div className="wrapper">

        <ReorderIcon className="showHideBtn" onClick={() => setShowSideBar((e) => !e)} />
        <div className="items">
        
          <div className="item">
            <span className="user-name">Hi, {capitalizeFirstLetter(auth?.name)}</span>
          </div>

          <div className="item">
            <img
              src="https://test.markcoders.com/ola_ads_api/uploads/user.png"
              alt=""
              className="avatar"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              className="logout-select-field"
            >

              <MenuItem className="select-field-item" onClick={handleClose} ><Link onClick={handleModal} style={{ textDecoration: "none" }}><ExitToAppIcon className="icon" /> Logout</Link></MenuItem>
            </Menu>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openModal}
              onClose={handleModal}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
              className="custom-modal delete-modal"
            >
              <Fade in={openModal} >
                <Box>
                  <Box className="modal-body" >
                    <a onClick={handleModal} className="close-btn">
                      <CloseIcon className="icon" />
                    </a>
                    <Typography className="main-title" component="h2">
                      Logout
                    </Typography>
                    <Typography component="p">
                      Are you sure want to logout?
                    </Typography>

                    <Box className="modal-footer">
                      <Button
                        className="btn btn-outline-primary"
                        onClick={handleModal}
                      >
                        No
                      </Button>
                      <Button className="btn btn-outline-danger" onClick={logoutAction}>
                        Yes
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};

// export default Navbar;
const actions = {
  logoutAction
}
export default connect(null, actions)(Navbar);
