import React from 'react';
import { ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';

// This component manages the search filter and status filter.
const FilterSection = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {

  // Handles changes in the search input field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handles changes in the filter status (available, used, disposed)
  const handleFilterStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
    }
  };

  return (
    <div className="filter-section">
      {/* Search Filter */}
      <div className="search-filter">
        <TextField
          label="Search by Name, Description or Serial Number"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search"
        />
      </div>

      {/* Status Filter */}
      <div className="status-filter">
        <ToggleButtonGroup
          value={filterStatus}
          exclusive
          onChange={handleFilterStatusChange}
          aria-label="Status filter"
        >
          <ToggleButton value="available" aria-label="Available">
            Available
          </ToggleButton>
          <ToggleButton value="used" aria-label="Used">
            Used
          </ToggleButton>
          <ToggleButton value="disposed" aria-label="Disposed">
            Disposed
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default FilterSection;
