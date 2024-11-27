import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Autocomplete, Grid, Select, MenuItem } from '@mui/material';

const StockOutModal = ({ open, onClose, inventory, setSelectedItem, selectedItem, reloadInventory }) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);

  // Fetch tables when the reason is 'Used'
  useEffect(() => {
    if (reason === 'used') {
      axios.get('http://localhost:3000/api/tables')
        .then((response) => {
          setTables(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tables:', error);
        });
    }
  }, [reason]);

  // Handle item selection from autocomplete
  const handleItemSelect = (event, newValue) => {
    setSelectedItem(newValue);
    setQuantity(1); // Default to 1 if a new item is selected
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setSelectedTable(null); // Reset table selection when changing reason
  };

  // Handle stock-out action
  const handleStockOut = () => {
    if (!selectedItem) {
      alert('Please select an item');
      return;
    }

    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (reason === 'used' && !selectedTable) {
      alert('Please select a table for the "Used" reason');
      return;
    }

    // Make API call to process stock-out (either used or disposed)
    if (reason === 'used' && selectedTable) {
      // Add the item to the table
      axios.post(`http://localhost:3000/api/tables/${selectedTable._id}/add-item`, { itemId: selectedItem._id, quantity })
        .then(() => {
          // Update the item's status to 'used'
          axios.put(`http://localhost:3000/api/items/${selectedItem._id}`, { status: 'used', location: selectedTable.name, quantity })
            .then(() => {
              alert(`Item has been assigned to table ${selectedTable.name} and marked as used`);
              reloadInventory(); // Reload inventory after updating
              onClose(); // Close modal
            })
            .catch((error) => {
              console.error('Error updating item status:', error);
              alert('Error updating item status');
            });
        })
        .catch((error) => {
          console.error('Error adding item to table:', error);
          alert('Error processing stock-out');
        });
    } else if (reason === 'disposed') {
      // If the reason is 'disposed', delete the item from the database automatically
      axios.delete(`http://localhost:3000/api/items/${selectedItem._id}`)
        .then(() => {
          alert(`Item ${selectedItem.name} has been disposed.`);
          reloadInventory(); // Reload inventory after disposal
          onClose(); // Close modal
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
          alert('Error deleting item');
        });
    }
  };

  const filteredItems = inventory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) &&
      item.status !== 'used' // Exclude items with status 'used'
  );

  useEffect(() => {
    if (selectedItem) {
      reloadInventory(); // Reload inventory when an item is selected
    }
  }, [selectedItem, reloadInventory]);

  return (
    <Dialog open={open} onClose={onClose} sx={{
      '& .MuiDialog-paper': {
        maxWidth: '90%',
        width: '900px'
      },
    }}>
      <DialogTitle>Stock Out Item</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Autocomplete for Item Search */}
          <Grid item xs={12}>
            <Autocomplete
              value={selectedItem}
              onChange={handleItemSelect}
              inputValue={searchTerm}
              onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)} // Track input value
              options={filteredItems} // Use filtered items for suggestions
              getOptionLabel={(option) => `${option.serial_number} - ${option.name} - ${option.description} - ${option.condition}`} // Display name, serial number, and description
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Item by Name, Description or Serial Number"
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* Quantity Input */}
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>

          {/* Reason Input */}
          <Grid item xs={12}>
            <Select
              label="Reason"
              value={reason}
              onChange={handleReasonChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="used">Used</MenuItem>
              <MenuItem value="disposed">Disposed</MenuItem> {/* Removed stock out option */}
            </Select>
          </Grid>

          {/* Table Selection if Reason is "Used" */}
          {reason === 'used' && (
            <Grid item xs={12}>
              <Select
                label="Select Table"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                fullWidth
                variant="outlined"
              >
                {tables.map((table) => (
                  <MenuItem key={table._id} value={table}>
                    {table.name} - {table.location}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleStockOut} color="primary">Stock Out</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockOutModal;
