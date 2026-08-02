import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useMenu = (category, search) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/menu/categories');
      // Sort or define a custom order if needed. We'll use them as is.
      setCategories(['All', ...data.data]);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (category && category !== 'All') {
        params.append('category', category);
      }
      if (search) {
        params.append('search', search);
      }

      const { data } = await api.get(`/menu?${params.toString()}`);
      setItems(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, categories, isLoading, error };
};
