import { TextField } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./new.scss";

const NewUser = ({ Inputs, title }) => {
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New User</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              <TextField
                id="outlined-basic"
                label="Enter name"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                label="Enter email"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                label="Enter password"
                variant="outlined"
              />

              <button type="button">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
