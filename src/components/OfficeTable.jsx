import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Modal,
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import AddTableModal from './AddTableModal';

const OfficeTable = () => {
  const [tables, setTables] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [assignedItems, setAssignedItems] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableToView, setTableToView] = useState(null);

  // Fetch tables from the API
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/tables') // Fetch tables from the backend
      .then(response => {
        setTables(response.data); // Set the tables with assigned items
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle adding or updating a table
  const handleAddOrUpdateTable = async (newTable) => {
    setLoading(true);  // Set loading state to true before making the request
    try {
      let response;
      if (tableToEdit) {
        // Update existing table
        response = await axios.put(`http://localhost:3000/api/tables/${tableToEdit._id}`, newTable);
        setTables((prevTables) =>
          prevTables.map((table) =>
            table._id === response.data._id ? response.data : table
          )
        );
      } else {
        // Add new table
        response = await axios.post('http://localhost:3000/api/tables', newTable);
        setTables((prevTables) => [...prevTables, response.data]);  // Add the new table to the state
      }
      setOpenModal(false);  // Close the modal after success
    } catch (error) {
      console.error('Error saving table:', error);
      alert('Error saving table. Please check the console for details.');
    } finally {
      setLoading(false);  // Reset loading state after the request
    }
  };

  const fetchAssignedItems = (tableId) => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/items?assigned_to=${tableId}`)
      .then(response => {
        setAssignedItems(response.data);  // Set the assigned items for the table
      })
      .catch(error => {
        console.error('Error fetching assigned items:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // Handle opening the modal for adding a new table
  const handleAddClick = () => {
    setTableToEdit(null);  // Clear any selected table for editing
    setOpenModal(true);
  };

  // Handle opening the modal for editing an existing table
  const handleEditClick = (table) => {
    setTableToEdit(table);
    setOpenModal(true);
  };

  // Handle opening the modal for viewing a table's details and its assigned items
  const handleViewClick = (table) => {
    setTableToView(table);  // Set the selected table for viewing
    fetchAssignedItems(table._id);  // Fetch the items assigned to the selected table
    setViewModalOpen(true);
  };

  // Handle closing the modals
  const handleCloseModal = () => {
    setOpenModal(false);
    setViewModalOpen(false);
  };

  // Handle deleting a table
  const handleDeleteTable = (tableId) => {
    setLoading(true);
    axios.delete(`http://localhost:3000/api/tables/${tableId}`)
      .then(() => {
        setTables((prevTables) => prevTables.filter(table => table._id !== tableId));
      })
      .catch(error => {
        console.error('Error deleting table:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered tables based on search query
  const filteredTables = tables.filter((table) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      table.name?.toLowerCase().includes(queryLower) ||
      table.location?.toLowerCase().includes(queryLower) ||
      table.employee?.toLowerCase().includes(queryLower)
    );
  });

  return (
    <div>
      <TextField
        label="Search by Name, Location, or Employee"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add New Table
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table._id}>
                  <TableCell>{table.name}</TableCell>
                  <TableCell>{table.location}</TableCell>
                  <TableCell>{table.employee}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewClick(table)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(table)} color="secondary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTable(table._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add Table / Edit Table Modal */}
      <AddTableModal
        open={openModal}
        onClose={handleCloseModal}
        table={tableToEdit}
        onAdd={handleAddOrUpdateTable}
        onUpdate={handleAddOrUpdateTable}
      />

      {/* View Table Modal with Assigned Items */}
   <Modal
  open={viewModalOpen}
  onClose={handleCloseModal}
  aria-labelledby="view-table-modal"
  aria-describedby="view-table-modal-description"
>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,  // You can adjust this width as needed
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',  // Ensure the modal doesn't overflow
    overflowY: 'auto',  // Make the modal scrollable if needed
  }}>
    <Typography variant="h6" component="h2" gutterBottom>
      Assigned Items
    </Typography>
    
    {assignedItems.length > 0 ? (
      <Grid container spacing={2}>  {/* Grid container with spacing between items */}
        {assignedItems.map((item, index) => (
          <Grid item xs={6} key={index}> {/* Two columns layout, xs=6 means 50% width */}
            <Box sx={{ marginBottom: 2 }}> {/* Box around each item */}
              <Typography><strong>Item Name:</strong> {item.name}</Typography>
              <Typography><strong>Description:</strong> {item.description}</Typography>
              <Typography><strong>Serial Number:</strong> {item.serial_number}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography>No items assigned to this table.</Typography>
    )}

    <Button
      onClick={handleCloseModal}
      variant="contained"
      color="primary"
      sx={{ marginTop: 2 }}
    >
      Close
    </Button>
  </Box>
</Modal>
    </div>
  );
};

export default OfficeTable;
