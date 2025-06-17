
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'expense-tracker-categories';

interface Category {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF6384' },
  { id: '2', name: 'Transportation', color: '#36A2EB' },
  { id: '3', name: 'Shopping', color: '#FFCE56' },
  { id: '4', name: 'Entertainment', color: '#4BC0C0' },
  { id: '5', name: 'Bills & Utilities', color: '#9966FF' },
  { id: '6', name: 'Healthcare', color: '#FF9F40' },
  { id: '7', name: 'Travel', color: '#FF6B6B' },
  { id: '8', name: 'Education', color: '#4ECDC4' }
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load categories from localStorage
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEY);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  // Save categories to localStorage whenever categories change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories]);

  const addCategory = (category: Omit<Category, 'id'> & { id?: string }) => {
    const newCategory: Category = {
      ...category,
      id: category.id || Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...updatedCategory }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
