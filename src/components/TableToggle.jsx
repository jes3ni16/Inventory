import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const TableToggle = ({ selectedTable, setSelectedTable }) => (
  <div className="tableToggleSection">
    <ToggleButtonGroup
      value={selectedTable}
      exclusive
      onChange={(event, newTable) => setSelectedTable(newTable)}
      aria-label="Table selection"
    >
      <ToggleButton value="inventory" aria-label="Inventory Table">Inventory Table</ToggleButton>
      <ToggleButton value="office" aria-label="Office Table">Office Table</ToggleButton>
    </ToggleButtonGroup>
  </div>
);

export default TableToggle;
