// AddPostServiceModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Country, State } from 'country-state-city';
import axios from 'axios';
import API from '../../api/api';
import "./AddServiceStyles.css"
import { useSelector } from 'react-redux';

const AddPostServiceModal = ({ open, handleClose, cb=()=>{} }) => {
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState('');
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [lossCode, setLossCode] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const auth  = useSelector(state=>state.user)
  // Fetch list of countries
  const countryList = Country.getAllCountries().map((country) => ({
    name: country.name,
    code: country.isoCode,
  }));

  useEffect(() => {
    if (country) {
      setCountryCode(country.code);

      // Fetch states for the selected country
      const statesData = State.getStatesOfCountry(country.code).map((state) => ({
        name: state.name,
        code: state.isoCode,
      }));
      setStateOptions(statesData);
    } else {
      setCountryCode('');
      setStateOptions([]);
      setStates([]);
    }
  }, [country]);

  const validateForm = () => {
    const newErrors = {};
    if (!service.trim()) newErrors.service = 'Service is required.';
    if (!country || !country.name) newErrors.country = 'Country is required.';
    if (!countryCode.trim()) newErrors.countryCode = 'Country Code is required.';
    if (!lossCode.trim()) newErrors.lossCode = 'Loss Code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors in the form.', severity: 'error' });
      return;
    }

    const data = {
      service,
      country: country ? country.name : '',
      country_code: countryCode,
      state: states.map((state) => ({ name: state.name || state })),
      loss_code: lossCode,
    };

    try {
      setLoading(true)
      const response = await  API.post(`${auth.type}/add-post-service`, data); 
      setSnackbar({ open: true, message: 'Post Service added successfully!', severity: 'success' });
      // Reset form
      cb()
      setService('');
      setCountry(null);
      setCountryCode('');
      setStates([]);
      setLossCode('');
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred while adding the post service.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
    finally{
      setLoading(false)
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Add Post Service
          </Typography>
          <TextField
            sx={{
              padding:"10"
            }}

            label="Service"
            fullWidth
            value={service}
            onChange={(e) => setService(e.target.value)}
            margin="normal"
            error={!!errors.service}
            helperText={errors.service}
          />
          <Autocomplete
              sx={{
                padding:"10"
              }}
            options={countryList}
            getOptionLabel={(option) => option.name}
            value={country}
            onChange={(event, newValue) => setCountry(newValue)}
            freeSolo
            renderInput={(params) => (
              <TextField
                      
              sx={{
                padding:"10"
              }}
                {...params}
                label="Country"
                margin="normal"
                error={!!errors.country}
                helperText={errors.country}
              />
            )}
          />
          <TextField
              sx={{
                padding:"10"
              }}

            label="Country Code"
            fullWidth
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            margin="normal"
            error={!!errors.countryCode}
            helperText={errors.countryCode}
          />
          <Autocomplete
              sx={{
                padding:"10"
              }}
            multiple
            options={stateOptions}
            getOptionLabel={(option) => option.name}
            value={states}
            onChange={(event, newValue) => setStates(newValue)}
            freeSolo
            disabled={!country}
            renderInput={(params) => (
              <TextField
              sx={{
                padding:"10"
              }}           
              {...params} label="States" margin="normal" />
            )}
          />
          <TextField
          
          sx={{
            padding:"10"
          }}
            label="Loss Code"
            fullWidth
            value={lossCode}
            onChange={(e) => setLossCode(e.target.value)}
            margin="normal"
            error={!!errors.lossCode}
            helperText={errors.lossCode}
          
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={()=>{
              handleClose();
              setService('');
              setCountry(null);
              setCountryCode('');
              setStates([]);
              setLossCode('');
              setErrors({});
            }} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button 
            disabled={loading}
            
            variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPostServiceModal;
