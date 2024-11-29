import { useState, useEffect } from 'react';
import axios from 'axios';

const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadInventory = () => {
    axios
      .get('https://inventory-server-eight.vercel.app/api/items') // Ensure the API endpoint is correct
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    reloadInventory();
  }, []);

  return { inventory, loading, error, reloadInventory };
};

export default useInventory;
