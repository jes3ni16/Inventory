import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

const AddItemModal = ({ open, onClose, addItem, updateItem, editItem }) => {
  const initialState = {
    name: '',
    quantity: 0,
    description: '',
    condition: '',
    price: '',
    assigned_to: null,
    purchase_by: '',
    purchase_date: '',
    invoice: '',
    serial_number: '',
    location: '',
    status: 'available',
  };

  const [newItem, setNewItem] = useState(initialState);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [loadingAssignedTo, setLoadingAssignedTo] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (editItem) { 
      // Fetch the item details, including assigned_to, from the backend before setting it in the state
      axios
        .get(`http://localhost:3000/api/items/${editItem._id}`)
        .then((response) => {
          setNewItem(response.data);  // Set the full updated item
        })
        .catch((error) => {
          console.error('Error fetching item:', error);
        });
    } else {
      setNewItem(initialState);
    }
    fetchAssignedToOptions(); // Keep fetching the options as you already do
  }, [editItem]);

  const fetchAssignedToOptions = () => {
    setLoadingAssignedTo(true);
    axios
      .get('http://localhost:3000/api/tables') // Fetching tables to assign to
      .then((response) => {
        setAssignedToOptions(response.data);
        setLoadingAssignedTo(false);
      })
      .catch((error) => {
        console.error('Error fetching assigned-to options:', error);
        setLoadingAssignedTo(false);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleAssignedToChange = (event, newValue) => {
    setNewItem((prevItem) => ({
      ...prevItem,
      assigned_to: newValue ? newValue : null, // Store the whole object, not just the _id
      location: newValue ? newValue.location : '', // Update location
      status: newValue ? 'used' : prevItem.status, // Change status to "used" if assigned
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newItem.purchase_date) {
      newItem.purchase_date = '';
    }

    try {
      setLoadingSubmit(true);
      setSnackbarMessage('Submitting...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);

      if (editItem) {
        await updateItem(newItem);
        showSnackbar('Item updated successfully!', 'success');
      } else {
        await addItem(newItem);
        showSnackbar('Item added successfully!', 'success');
      }

      fetchAssignedToOptions();
      setNewItem(initialState); // Resetting form
      onClose();
    } catch (error) {
      console.error('Error submitting item:', error);
      showSnackbar('Failed to submit item. Please try again.', 'error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  variant="outlined"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  variant="outlined"
                  name="serial_number"
                  value={newItem.serial_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Condition"
                  variant="outlined"
                  name="condition"
                  value={newItem.condition}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  variant="outlined"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purchase By"
                  variant="outlined"
                  name="purchase_by"
                  value={newItem.purchase_by}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  type="date"
                  variant="outlined"
                  name="purchase_date"
                  value={newItem.purchase_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Invoice"
                  variant="outlined"
                  name="invoice"
                  value={newItem.invoice}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
              <Autocomplete
  value={assignedToOptions.find((option) => option._id === newItem.assigned_to) || null}
  onChange={handleAssignedToChange}
  options={assignedToOptions}
  getOptionLabel={(option) => option.name}
  renderInput={(params) => <TextField {...params} label="Assigned To" />}
  disableClearable
  isOptionEqualToValue={(option, value) => option._id === value._id}
  loading={loadingAssignedTo}
/>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  variant="outlined"
                  name="location"
                  value={newItem.location}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newItem.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="used">Used</MenuItem>
                    <MenuItem value="disposed">Disposed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? 'Submitting...' : editItem ? 'Update Item' : 'Add Item'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddItemModal;
