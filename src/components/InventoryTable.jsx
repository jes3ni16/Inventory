import React from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
  // Sort items by createdAt in descending order
  const sortedInventory = [...inventory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Table className='filtered-table'>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Sku</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Serial Number</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Condition</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Purchase By</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Purchase Date</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Invoice</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedInventory.map((item) => (
          <TableRow key={item._id}>
            {/* Serial Number */}
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.serial_number}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.condition}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.assigned_to ? item.assigned_to.employee : ''}</TableCell>
            <TableCell>{item.purchase_by}</TableCell>
            <TableCell>
              {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell>{item.invoice ? item.invoice : ''}</TableCell>
            <TableCell>{item.location ? item.location : ''}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(item)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => onDelete(item._id, item.name, item.description)}
                color="secondary"
                style={{ marginLeft: '8px' }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;