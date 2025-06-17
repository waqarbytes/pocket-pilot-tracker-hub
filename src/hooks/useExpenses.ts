
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'expense-tracker-expenses';

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem(STORAGE_KEY);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...expense, ...updatedExpense, updatedAt: new Date().toISOString() }
          : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['Title', 'Amount', 'Date', 'Category', 'Description'];
      const csvContent = [
        headers.join(','),
        ...expenses.map(expense => [
          `"${expense.title}"`,
          expense.amount,
          expense.date,
          `"${expense.categoryId}"`,
          `"${expense.description || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(expenses, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    exportData
  };
};
