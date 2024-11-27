import React from 'react';
import { Button } from '@mui/material';

// The ActionButtons component renders Stock In and Stock Out buttons
const ActionButtons = ({ onOpenModal, onOpenStockOutModal }) => {
  return (
    <div className="operationButtons">
      {/* Button for Stock In */}
      <Button variant="contained" color="primary" onClick={onOpenModal}>
        Stock In
      </Button>

      {/* Button for Stock Out */}
      <Button color="warning" variant="contained" onClick={onOpenStockOutModal}>
        Stock Out
      </Button>
    </div>
  );
};

export default ActionButtons;
