import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const AddTableModal = ({ open, onClose, table, onAdd, onUpdate }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [employee, setEmployee] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state

  // When the modal is opened or table is passed, populate form with table data if editing
  useEffect(() => {
    if (table) {
      setName(table.name);
      setLocation(table.location);
      setEmployee(table.employee);
    } else {
      // Reset form if creating a new table
      setName('');
      setLocation('');
      setEmployee('');
    }
  }, [table, open]); // Reset the form if `open` or `table` changes

  // Handle form submission for both adding and updating
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const newTable = { name, location, employee };  // Collect form data
  
    if (loading) return;  // Prevent submission if already in progress
  
    // Pass form data to the parent component (OfficeTable)
    if (table) {
      // Update existing table
      onUpdate(newTable); // Pass updated data back to the parent
    } else {
      // Add new table
      onAdd(newTable);  // Pass new table data to the parent
    }
    onClose();  // Close the modal after submitting
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <h2>{table ? 'Edit Table' : 'Add New Table'}</h2>

        <TextField
          label="Table Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          disabled={loading}  // Disable inputs while loading
        />
        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
          disabled={loading}  // Disable inputs while loading
        />
        <TextField
          label="Assigned Employee"
          fullWidth
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          margin="normal"
          disabled={loading}  // Disable inputs while loading
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ marginTop: '16px' }}
          disabled={loading || !name || !location || !employee}  // Disable if required fields are missing
        >
          {table ? 'Update Table' : 'Add Table'}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddTableModal;
