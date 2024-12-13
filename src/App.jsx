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
import LoginModal from './components/LoginModal';



function App() {
  const [inventory, setInventory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('inventory');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [token, setToken] = useState(null);

useEffect(() => {
  document.title = "Cenix Inventory"; // Set title when App component mounts
  const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = '/cenix-icon.png'; // Path to your new favicon
    }
}, []);

useEffect(() => {
  const savedToken = sessionStorage.getItem('token');
  if (savedToken) {
    setToken(savedToken);
    setIsLoggedIn(true);
  }
}, []);

const handleLoginSuccess = (token) => {
  sessionStorage.setItem('token', token);
  setToken(token);
  setIsLoggedIn(true);
  console.log('Logged in with token:', token);
};

const handleLogout = () => {
  sessionStorage.removeItem('token'); // Clear token from sessionStorage
  setIsLoggedIn(false);
};

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

    const newItem = { ...item }; 

    if (newItem.status === 'available' && newItem.assignedTo) {
      newItem.assignedTo = ''; 
    }
  
    if (newItem.status === 'disposed') {
      newItem.assignedTo = '';  
      newItem.location = '';   
    }
  
    
    setSelectedItem(item);
    setOpenModal(true);
    return newItem; 

  };

  useEffect(() => {
    reloadInventory();
  }, []);


  const handleDeleteItem = (itemId) => {
    const itemToDelete = inventory.find(item => item._id === itemId);
  
    if (itemToDelete) {
      setItemToDelete(itemToDelete);
      setOpenDeleteDialog(true); 
    }
  };

  const handleConfirmDelete = () => {
    axios.delete(`https://inventory-server-eight.vercel.app/api/items/${itemToDelete._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Attach the token in Authorization header
      }
    })
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

          {!isLoggedIn && <LoginModal onLoginSuccess={handleLoginSuccess} />}
          {isLoggedIn && (
            <>
      <h1>Welcome to Cenix Inventory System</h1>

      <button onClick={handleLogout}>Logout</button>


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
        <p>Description: <strong>{itemToDelete?.description}</strong></p>
        <p>Serial Number: <strong>{itemToDelete?.serial_number}</strong></p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
        <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>

      <AddItemModal
        open={openModal}
        onClose={()=> {
          setOpenModal(false);
          setSelectedItem(null);
        }}
        addItem={(newItem) => {
          axios.post('https://inventory-server-eight.vercel.app/api/items', newItem, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Attach the token here
            }
          })
            .then((response) => {
              setInventory(prevInventory => [...prevInventory, response.data]); // Add new item to inventory
              setOpenModal(false); // Close the modal
            })
            .catch((error) => {
              console.error('Error adding item:', error);
            });
        }}
        updateItem={(updatedItem) => {
          axios.patch(`https://inventory-server-eight.vercel.app/api/items/${updatedItem._id}`, updatedItem, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Attach the token in Authorization header
            }
          })
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

         </> )}
    </main>
  );
}

export default App;
