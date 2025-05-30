import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import API from "../../api/api";
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const Settings = ({ setShowSideBar }) => {
  const auth = useSelector((state) => state.user);
  const authType = auth.type;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(null); // Tracks which field is being edited
  const [editedValues, setEditedValues] = useState({}); // Stores edited values

  const fetchURLS = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(`/${authType}/settings`);
      if (response.data.success) {
        setData(response.data.obj);
      } else {
        setError("Failed to fetch settings.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred while fetching settings.");
    } finally {
      setLoading(false);
    }
  }, [authType]);

  const handleEdit = (key) => {
    setIsEditing(key);
    setEditedValues((prev) => ({
      ...prev,
      [key]: data[key], // Set the initial value of the key being edited
    }));
  };

  const handleSave = async (key) => {
    try {
      setLoading(true);
      const updatedData = { ...data, [key]: editedValues[key] };
      const response = await API.put(`/${authType}/settings`, { [key]: editedValues[key] });

      if (response.data.success) {
        setData(updatedData);
        setIsEditing(null);
      } else {
        setError("Failed to save changes.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred while saving changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedValues({});
  };

  useEffect(() => {
    fetchURLS();
  }, [fetchURLS]);

  return (
   
    <>
      <Sidebar />
          <Navbar setShowSideBar={setShowSideBar} />
          <Container maxWidth="100" className="contailer-fluid" >
          <Typography sx={{
            mb:"30px"
           }} variant="h4" gutterBottom>
             Settings
           </Typography>
               <Box sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                minHeight:"800px"
               }} p={4}>
        

         {error ? (
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              gap={4}
              alignItems="center"
              minHeight="600px"
            >
              <Typography color="error" variant="body1">
                {error}
              </Typography>
              <Button onClick={fetchURLS} variant="contained">
                Try Again
              </Button>
            </Box>
          ) : loading && data.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="600px">
              <CircularProgress />
            </Box>
          ) : Object.keys(data).length === 0 ? (
            <Typography variant="body1">No settings available to display.</Typography>
          ) : (
            <Grid container spacing={3}>
            {Object.entries(data).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Card elevation={2} sx={{ borderRadius: "10px" }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, textTransform: "capitalize", marginBottom: 1 }}
                    >
                      {key.split("_").join(" ")}
                    </Typography>
                    {isEditing === key ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editedValues[key] || ""}
                        onChange={(e) =>
                          setEditedValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {value}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    {isEditing === key ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSave(key)}
                          disabled={loading}
                          color="success"
                          sx={{ borderRadius: "50px" }}
                        >
                          <CheckCircleOutlineIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancel}
                          sx={{ borderRadius: "50px" }}
                        >
                          <HighlightOffIcon />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEdit(key)}
                        sx={{ borderRadius: "50px" }}
                      >
                        <CreateIcon />
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        
          )}
        </Box>
            
          </Container>
    </>
  );
};

export default Settings;
