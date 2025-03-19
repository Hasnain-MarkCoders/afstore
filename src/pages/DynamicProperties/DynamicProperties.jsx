import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../styles.scss";
import "./styles.scss";
import { useSelector } from "react-redux";
import API from "../../api/api";

export const DynamicProperties = ({ setShowSideBar }) => {
  const auth = useSelector((state) => state.user);

  const [keyValues, setKeyValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingAlias, setAddingAlias] = useState(null);
  const [newAlias, setNewAlias] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [aliasToDelete, setAliasToDelete] = useState({ key: "", alias: "" });
  const [rejectedAlias, setRejectedAlias] = useState([{}]);
  const [rejectedAliasForDelete, setRejectedAliasForDelete] = useState({});
  const [confirmDeleteRejected, setConfirmDeleteRejectedAlias] =
    useState(false);
  const [showAddRejectedAlias, setShowAddRejectedAlias] = useState(false);
  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get(`/customer/get-properties/`);
        const rejectedResponse = await API.get(
          `/customer/get-rejected-properties/`
        );
        const rejectedData = rejectedResponse.data;
        const data = response.data;

        // Transform data into a key-value pair object
        const transformedData = {};
        data.forEach((item) => {
          const key = item.title;
          const aliases = item.alias.filter((alias) => alias !== "");
          transformedData[key] = aliases;
        });
        if (rejectedData && rejectedData?.length > 0) {
          setRejectedAlias(rejectedData);
        } else {
          setRejectedAlias([]);
        }
        setKeyValues(transformedData);
      } catch (err) {
        setError("Failed to fetch properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [auth.type]);

  // Handle adding a new alias
  const handleAddAlias = async () => {
    if (!newAlias.trim()) return;

    const payload = {
      property_type: addingAlias,
      alias: newAlias.trim(),
    };

    try {
      const response = await API.post(`/customer/add-property-alias`, payload);

      if (response.status === 200 || response.status === 201) {
        // Update the state with the new alias
        setKeyValues((prevState) => ({
          ...prevState,
          [addingAlias]: [...prevState[addingAlias], newAlias.trim()],
        }));
        setNewAlias("");
        setAddingAlias(null);
      } else {
        throw new Error("Failed to add new alias.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add new alias.");
    }
  };

  // Handle delete icon click
  const handleDeleteClick = (key, alias) => {
    setAliasToDelete({ key, alias });
    setConfirmDelete(true);
  };

  // Confirm deletion of alias
  const confirmDeleteAlias = async () => {
    const { key, alias } = aliasToDelete;
    try {
      const response = await API.delete(`/customer/delete-property-alias`, {
        params: {
          property_type: key,
          alias: alias,
        },
      });

      if (response.status === 200) {
        // Update the state by removing the alias
        setKeyValues((prevState) => ({
          ...prevState,
          [key]: prevState[key].filter((item) => item !== alias),
        }));
        setAliasToDelete({ key: "", alias: "" });
        setConfirmDelete(false);
      } else {
        throw new Error("Failed to delete alias.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete alias.");
    }
  };

  const confirmDeleteRejectedAlias = async () => {
    try {
      const response = await API.delete(`/customer/delete-rejected-property`, {
        params: {
          id: rejectedAliasForDelete._id,
        },
      });

      if (response.status === 200) {
        setRejectedAlias((prevState) =>
          prevState.filter((item) => item._id !== rejectedAliasForDelete._id)
        );
        setConfirmDeleteRejectedAlias(false);
        setShowAddRejectedAlias(false);
      } else {
        throw new Error("Failed to delete alias.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete alias.");
    }
  };

  const handleAddRejectedAlias = async () => {
    if (!newAlias.trim()) return;

    const payload = {
      alias: newAlias.trim(),
    };

    try {
      const response = await API.post(
        `/customer/add-rejected-property`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setNewAlias("");
        setRejectedAlias((prevState) => [...prevState, response.data]);
        setShowAddRejectedAlias(false);
      } else {
        throw new Error("Failed to add new alias.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add new alias.");
    }
  };

  // Cancel deletion
  const cancelDeleteAlias = () => {
    setAliasToDelete({ key: "", alias: "" });
    setConfirmDelete(false);
  };

  const cancelDeleteRejectedAlias = () => {
    setRejectedAliasForDelete({});
    setConfirmDeleteRejectedAlias(false);
  };

  const handleDeleteClickRejectedAlias = (rejectedAlias) => {
    setRejectedAliasForDelete(rejectedAlias);
    setConfirmDeleteRejectedAlias(true);
  };

  return (
    <>
      <Sidebar />
      <Navbar setShowSideBar={setShowSideBar} />
      <Container maxWidth="100" className="contailer-fluid">
        <div className={`tickets-system ${"active-image"}`}>
          <h2 style={{}}>Dynamic Properties</h2>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              p: "50px 0",
              mt: "20px",
            }}
          >
            <div className="ticket-user-info">
              {/* Render the key-values below the heading */}
              {loading ? (
                <Container>
                  <CircularProgress />
                </Container>
              ) : error ? (
                <Container>
                  <Alert severity="error">{error}</Alert>
                </Container>
              ) : (
                <Container>
                  <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                      <Paper elevation={3} sx={{ padding: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h1>Rejected Properties</h1>
                          <IconButton
                            color="primary"
                            onClick={() => setShowAddRejectedAlias(true)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        {rejectedAlias.map((key, index) => (
                          <>
                            <List>
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteClickRejectedAlias(key)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText primary={key.alias} />
                              </ListItem>
                            </List>
                          </>
                        ))}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} >

                      <Paper elevation={3} sx={{ padding: 2 }} >
                    <h1>Dynamic Properties</h1>
                      {Object.keys(keyValues).map((key) => (
                      <Grid item xs={12} md={12} marginY={3} key={key}>

                        <Box>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {key}
                            <IconButton
                              color="primary"
                              onClick={() => setAddingAlias(key)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Typography>
                          <List>
                            {keyValues[key].map((value, index) => (
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteClick(key, value)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText primary={value} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    ))}
                      </Paper>

                    </Grid>
                  
                    {/* <Grid item xs={12} md={12}>
                      <Paper elevation={3} sx={{ padding: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h1>Rejected Alias</h1>
                          <IconButton
                            color="primary"
                            onClick={() => setShowAddRejectedAlias(true)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        {rejectedAlias.map((key, index) => (
                          <>
                            <List>
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteClickRejectedAlias(key)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText primary={key.alias} />
                              </ListItem>
                            </List>
                          </>
                        ))}
                      </Paper>
                    </Grid> */}
                  </Grid>
                </Container>
              )}

              {/* Dialog for adding a new alias */}
              <Dialog
                open={Boolean(addingAlias)}
                onClose={() => setAddingAlias(null)}
              >
                <DialogTitle>Add Alias to "{addingAlias}"</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="New Alias"
                    type="text"
                    fullWidth
                    value={newAlias}
                    sx={{
                      mt: 2,
                    }}
                    onChange={(e) => setNewAlias(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setAddingAlias(null)}>Cancel</Button>
                  <Button
                    onClick={handleAddAlias}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Confirmation Dialog for deleting an alias */}
              <Dialog open={confirmDelete} onClose={cancelDeleteAlias}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete the alias "
                    {aliasToDelete.alias}" from "{aliasToDelete.key}"?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={cancelDeleteAlias}>Cancel</Button>
                  <Button
                    onClick={confirmDeleteAlias}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={confirmDeleteRejected}
                onClose={cancelDeleteRejectedAlias}
              >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete the alias "
                    {rejectedAliasForDelete.alias}"?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={cancelDeleteRejectedAlias}>Cancel</Button>
                  <Button
                    onClick={confirmDeleteRejectedAlias}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={Boolean(showAddRejectedAlias)}
                onClose={() => setShowAddRejectedAlias(false)}
              >
                <DialogTitle>Add new rejected Alias</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="New Alias"
                    type="text"
                    fullWidth
                    value={newAlias}
                    sx={{
                      mt: 2,
                    }}
                    onChange={(e) => setNewAlias(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowAddRejectedAlias(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddRejectedAlias}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Box>
        </div>
      </Container>
    </>
  );
};
