import { useState, useEffect } from 'react';
import axios from 'axios';

const useTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadTables = () => {
    axios
      .get('https://inventory-server-eight.vercel.app/api/tables')  // Ensure this API exists and is returning the tables correctly
      .then((response) => {
        setTables(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    reloadTables();
  }, []);

  return { tables, loading, error, reloadTables };
};

export default useTables;
