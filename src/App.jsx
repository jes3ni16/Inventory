import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddItemModal from './components/AddItemModal';
import InventoryTable from './components/InventoryTable';
import SearchFilter from './components/SearchFilter';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import OfficeTable from './components/OfficeTable';

function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('inventory');

  // Fetch inventory items
  const reloadInventory = () => {
    axios
      .get('http://localhost:3000/api/items')
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setOpenModal(true); // Open the modal to edit
  };

  useEffect(() => {
    reloadInventory();
  }, []);

  // Handle delete of an inventory item
  const handleDeleteItem = (itemId) => {
    axios.delete(`http://localhost:3000/api/items/${itemId}`)
      .then(() => {
        setInventory(prevInventory => prevInventory.filter(item => item._id !== itemId));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  // Filter inventory (when selectedTable is 'inventory')
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'available' ? item.status === 'available' :
                          filterStatus === 'used' ? item.status === 'used' :
                          filterStatus === 'disposed' ? item.status === 'disposed' :
                          true;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="main">
      <h1>Welcome to Cenix Inventory System</h1>

      <div className="operationButtons">
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Stock In
        </Button>
      </div>

      {/* Table Selection Toggle */}
      <div className="tableToggle">
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

{selectedTable === 'inventory' && (
  <SearchFilter
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    placeholder={`Search ${selectedTable === 'inventory' ? 'Items' : 'Tables'}`}
  />
)}

      {/* Conditionally render components based on selectedTable */}
      {selectedTable === 'inventory' && (
        <InventoryTable
          inventory={filteredInventory}
          onDelete={handleDeleteItem}
          onEdit={handleEditItem}
        />
      )}
      {selectedTable === 'office' && (
        <OfficeTable />
      )}

      {/* Modals */}
      <AddItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        addItem={(newItem) => {
          axios.post('http://localhost:3000/api/items', newItem)
            .then((response) => {
              setInventory(prevInventory => [...prevInventory, response.data]);
              setOpenModal(false);
            })
            .catch((error) => {
              console.error('Error adding item:', error);
            });
        }}
        updateItem={(updatedItem) => {
          axios.patch(`http://localhost:3000/api/items/${updatedItem._id}`, updatedItem)
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
