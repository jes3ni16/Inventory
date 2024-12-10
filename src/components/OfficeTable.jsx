import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,TextField,InputAdornment,Modal,Box,IconButton,CircularProgress,Typography, Grid,  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import AddTableModal from './AddTableModal';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const OfficeTable = () => {
  const [tables, setTables] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [assignedItems, setAssignedItems] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableToView, setTableToView] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  

  // Fetch tables from the API
  useEffect(() => {
    setLoading(true);
    axios.get('https://inventory-server-eight.vercel.app/api/tables') // Fetch tables from the backend
      .then(response => {
        const sortedTables = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTables(sortedTables); // Set the tables with assigned items
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
        response = await axios.put(`https://inventory-server-eight.vercel.app/api/tables/${tableToEdit._id}`, newTable);
        setTables((prevTables) =>
          prevTables.map((table) =>
            table._id === response.data._id ? response.data : table
          )
        );
      } else {
        // Add new table
        response = await axios.post('https://inventory-server-eight.vercel.app/api/tables', newTable);
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
    axios.get(`https://inventory-server-eight.vercel.app/api/items?assigned_to=${tableId}`)
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
    axios.delete(`https://inventory-server-eight.vercel.app/api/tables/${tableId}`)
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

  const handleDeleteClick = (table) => {
    setTableToDelete(table);  // Set the table to be deleted
    setOpenDialog(true);  // Open the dialog
  };

  const handleDeleteConfirm = () => {
    if (!tableToDelete) return;

    setLoading(true);
    axios.delete(`https://inventory-server-eight.vercel.app/api/tables/${tableToDelete._id}`)
      .then(() => {
        setTables((prevTables) => prevTables.filter(table => table._id !== tableToDelete._id));
        setOpenDialog(false);  // Close the dialog after deletion
      })
      .catch(error => {
        console.error('Error deleting table:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTableToDelete(null);  // Reset the table to delete
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

  const sortedTables = filteredTables.sort((a, b) => {
    // Compare room names to ensure rooms appear in order (e.g., Room 1, Room 2, etc.)
    if (a.room < b.room) return -1;
    if (a.room > b.room) return 1;
    return 0;
  });

  const exportModalData = () => {
     // Get the modal content (all the content inside the modal)
  const modalContent = document.querySelector('#modal-contents');

  if (!modalContent) {
    alert("No modal content to export!");
    return;
  }

  // Create a worksheet from the modal's HTML content
  const worksheet = XLSX.utils.html_to_sheet(modalContent);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modal Content');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, 'modal_content.xlsx');
  };



  return (
    <div>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 }}>
  {/* Add New Table button on the left */}
  <Button variant="contained" color="primary" onClick={handleAddClick}>
    Add New Table
  </Button>
  
  {/* Search input on the right */}
  <TextField
    label="Search by Name, Location, or Employee"
    variant="outlined"
    value={searchQuery}
    onChange={handleSearchChange}
    fullWidth
    margin="normal"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{
      maxWidth: 500, // Set max width to 500px
      width: '100%', // Ensures that the TextField takes full width until the max-width is reached
    }}
  />
</div>

    


      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
  {loading ? (
    <CircularProgress />
  ) : (
    <Table className='filtered-table'>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell> 
          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> 
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedTables.map((table) => (
          <TableRow key={table._id}>
            <TableCell>{table.name}</TableCell>
            <TableCell>{table.location}</TableCell>
            <TableCell>{table.employee}</TableCell>
            
            {/* View icon in a new column */}
            <TableCell>
              <IconButton onClick={() => handleViewClick(table)} color="primary">
                <VisibilityIcon />
              </IconButton>
            </TableCell>
            
            <TableCell>
              <IconButton onClick={() => handleEditClick(table)} color="secondary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(table)} color="error">
                
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</TableContainer>

<Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {tableToDelete && (
            <>
              <Typography variant="body1">Are you sure you want to delete this table?</Typography>
              <Typography variant="body2"><strong>Name:</strong> {tableToDelete.name}</Typography>
              <Typography variant="body2"><strong>Location:</strong> {tableToDelete.location}</Typography>
              <Typography variant="body2"><strong>Employee:</strong> {tableToDelete.employee}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
        width: 600,  // Adjust the width as needed
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh',  // Ensure the modal doesn't overflow
        overflowY: 'auto',  // Make the modal scrollable if needed
      }}>
        <IconButton
  onClick={exportModalData} style={{ position: 'absolute', right: '100px', backgroundColor: '#4caf50', color: 'white',   border: '2px solid #388e3c', padding: '5px',   borderRadius: '5px', 
    fontSize: '16px',     cursor: 'pointer',   fontWeight: 'bold',transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')} // Hover effect
  onMouseOut={(e) => (e.target.style.backgroundColor = '#4caf50')} // Hover effect reset
>
<DownloadIcon />
  </IconButton>
        <div >
          <h6>Assigned Items: <strong> {tableToView && tableToView.employee ? tableToView.employee : 'N/A'}</strong></h6>
        </div>

        {/* Table to display the assigned items */}
        {assignedItems.length > 0 ? (
          <TableContainer sx={{ maxHeight: '60vh', overflow: 'auto' }} className='filtered-table'>
            <Table aria-label="assigned items table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Item Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Serial Number</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.serial_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
