// SearchFilter.js
import React from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchFilter = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <Paper
      component="form"
      sx={{

        display: 'flex',
        justifyContent:'end',
        alignItems: 'center',
        float:'right',
        padding: '4px 8px',
        width: '100%',
        maxWidth: '500px',  // You can adjust the width as needed
        borderRadius: '20px',
        backgroundColor: '#f4f4f4', // Light gray background
        boxShadow: 1,  // Optional: add shadow for a subtle effect
      }}
    >
      {/* Search Icon */}
      <IconButton sx={{ padding: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>

      {/* Search Input */}
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '14px',  // Adjust the font size if needed
          color: 'black',
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder || "Search by Name, Description or Serial Number"}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Paper>
  );
};

export default SearchFilter;
