import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddItemModal from './components/AddItemModal';
import InventoryTable from './components/InventoryTable';
import SearchFilter from './components/SearchFilter';
import { Button, IconButton, ToggleButton, ToggleButtonGroup,Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import OfficeTable from './components/OfficeTable';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

function App() {
  const [inventory, setInventory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('inventory');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);


useEffect(() => {
  document.title = "Cenix Inventory"; // Set title when App component mounts
  const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = '/cenix-icon.png'; // Path to your new favicon
    }
}, []);

  // Fetch inventory items
  const reloadInventory = () => {
    axios
      .get('https://inventory-server-eight.vercel.app/api/items')
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };


  
  const handleEditItem = (item) => {

    const newItem = { ...item }; // Create a copy of the previous state

    if (newItem.status === 'available' && newItem.assignedTo) {
      newItem.assignedTo = ''; // Reset assignedTo if status is 'available'
    }
  
    if (newItem.status === 'disposed') {
      newItem.assignedTo = '';  // Reset assignedTo if status is 'disposed'
      newItem.location = '';    // Reset location if status is 'disposed'
    }
  
    
    setSelectedItem(item);
    setOpenModal(true); // Open the modal to edit
    return newItem; 

  };

  useEffect(() => {
    reloadInventory();
  }, []);

  // Handle delete of an inventory item
  const handleDeleteItem = (itemId) => {
    // Find the item to be deleted
    const itemToDelete = inventory.find(item => item._id === itemId);
  
    if (itemToDelete) {
      setItemToDelete(itemToDelete);
      setOpenDeleteDialog(true); // Open the confirmation dialog
    }
  };

  const handleConfirmDelete = () => {
    // Proceed with deletion
    axios.delete(`https://inventory-server-eight.vercel.app/api/items/${itemToDelete._id}`)
      .then(() => {
        setInventory(prevInventory => prevInventory.filter(item => item._id !== itemToDelete._id));
        setOpenDeleteDialog(false); // Close the dialog after deletion
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        setOpenDeleteDialog(false); // Close the dialog if there's an error
      });
  };

  const handleCancelDelete = () => {
    // Just close the dialog without doing anything
    setOpenDeleteDialog(false);
  };


  // Filter inventory (when selectedTable is 'inventory')
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.assigned_to && item.assigned_to.employee && item.assigned_to.employee.toLowerCase().includes(searchTerm.toLowerCase()));


    const matchesStatus = filterStatus === 'available' ? item.status === 'available' :
                          filterStatus === 'used' ? item.status === 'used' :
                          filterStatus === 'disposed' ? item.status === 'disposed' :
                          true;

    return matchesSearch && matchesStatus;
  });

  const exportToExcel = () => {
    const table = document.querySelector('.filtered-table'); // Get the table element by class name
    if (table) {
      const worksheet = XLSX.utils.table_to_sheet(table);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
      XLSX.writeFile(workbook, 'filtered_data.xlsx');
    } else {
      alert("No data to export!");
    }
  };


  return (
    <main className="main">
      <h1>Welcome to Cenix Inventory System</h1>

      {/* Table Selection Toggle */}
      <div className="tableToggle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
  <ToggleButtonGroup
    value={selectedTable}
    exclusive
    onChange={(event, newSelectedTable) => setSelectedTable(newSelectedTable)}
    aria-label="Select Table"
  >
    <ToggleButton value="inventory" aria-label="Inventory">Items</ToggleButton>
    <ToggleButton value="office" aria-label="Office Tables">Office Tables</ToggleButton>
  </ToggleButtonGroup>
</div>
<IconButton
  onClick={exportToExcel} style={{ position: 'absolute', right: '100px', backgroundColor: '#4caf50', color: 'white',   border: '2px solid #388e3c', padding: '5px',   borderRadius: '5px', 
    fontSize: '16px',     cursor: 'pointer',   fontWeight: 'bold',transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')} // Hover effect
  onMouseOut={(e) => (e.target.style.backgroundColor = '#4caf50')} // Hover effect reset
>
<DownloadIcon />
  </IconButton>
      {/* Filter buttons for status */}
      {selectedTable === 'inventory' && (
        <div className="filterSection">
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(event, newStatus) => setFilterStatus(newStatus)}
            aria-label="Status filter"
          >
            <ToggleButton value="available" aria-label="Available">Available</ToggleButton>
            <ToggleButton value="used" aria-label="Used">Used</ToggleButton>
            <ToggleButton value="disposed" aria-label="Disposed">Disposed</ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}





      {/* Conditionally render components based on selectedTable */}
      {selectedTable === 'inventory' && (
        <>
        <div className="operationButtons">
  <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
    Stock In
  </Button>

  <SearchFilter
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    placeholder={`Search ${selectedTable === 'inventory' ? 'Items' : 'Tables'}`}
  />
</div>
        <InventoryTable
          inventory={filteredInventory}
          onDelete={handleDeleteItem}
          onEdit={handleEditItem}
        />
        </>
      )}
      {selectedTable === 'office' && (
        <OfficeTable />
      )}

<Dialog
      open={openDeleteDialog}
      onClose={handleCancelDelete}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <p> Delete the item: <strong>{itemToDelete?.name}</strong>?</p>
        <p>Description: <strong>{itemToDelete?.location}</strong></p>
        <p>Serial Number: <strong>{itemToDelete?.employee}</strong></p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
        <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>

      {/* Modals */}
      <AddItemModal
        open={openModal}
        onClose={()=> setOpenModal(false)}
        addItem={(newItem) => {
          axios.post('https://inventory-server-eight.vercel.app/api/items', newItem)
            .then((response) => {
              setInventory(prevInventory => [...prevInventory, response.data]);
              setOpenModal(false);
            })
            .catch((error) => {
              console.error('Error adding item:', error);
            });
        }}

        updateItem={(updatedItem) => {
          axios.patch(`https://inventory-server-eight.vercel.app/api/items/${updatedItem._id}`, updatedItem)
            .then((response) => {
              setInventory(prevInventory => 
                prevInventory.map(item => item._id === updatedItem._id ? updatedItem : item)
              );
              setOpenModal(false);
            })
            .catch((error) => {
              console.error('Error updating item:', error);
            });
        }}
        editItem={selectedItem}

      />
    </main>
  );
}

export default App;
