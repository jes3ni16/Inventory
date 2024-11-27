import React from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const InventoryTable = ({ inventory, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Serial Number</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
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
        {inventory.map((item) => (
          <TableRow key={item._id}>
            {/* Serial Number */}
            <TableCell>{item.serial_number}</TableCell>

            {/* Name */}
            <TableCell>{item.name}</TableCell>

            {/* Description */}
            <TableCell>{item.description}</TableCell>

            {/* Condition */}
            <TableCell>{item.condition}</TableCell>

            {/* Price */}
            <TableCell>{item.price}</TableCell>

            {/* Assigned To */}
            <TableCell>{item.assigned_to ? item.assigned_to.name : 'Unassigned'}</TableCell>

            {/* Purchase By */}
            <TableCell>{item.purchase_by}</TableCell>

            {/* Purchase Date */}
            <TableCell>
  {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : 'N/A'}
</TableCell>

            {/* Invoice */}
            <TableCell>{item.invoice ? item.invoice : 'No invoice'}</TableCell>

            {/* Location */}
            <TableCell>{item.location ? item.location : 'No location'}</TableCell>

            {/* Status */}
            <TableCell>{item.status}</TableCell>

            {/* Actions */}
            <TableCell>
              {/* Edit button with pencil icon */}
              <IconButton onClick={() => onEdit(item)} color="primary">
                <EditIcon />
              </IconButton>

              {/* Delete button with trash icon */}
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
