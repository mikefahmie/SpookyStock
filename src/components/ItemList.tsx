import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Link } from 'react-router-dom';

const client = generateClient<Schema>();

type SimplifiedItem = {
  id: string;
  name: string;
  photo_url?: string;
  condition?: string;
  bin?: { id: string; name: string };
  category?: { id: string; name: string };
};

const ItemList: React.FC = () => {
  const [items, setItems] = useState<SimplifiedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SimplifiedItem[]>([]);
  const [categories, setCategories] = useState<{ id: string | null; name: string }[]>([]);
  const [bins, setBins] = useState<{ id: string | null; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchBins();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, selectedBin]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, errors } = await client.models.Item.list({
        selectionSet: ['id', 'name', 'photo_url', 'condition', 'bin.id', 'bin.name', 'category.id', 'category.name']
      });
      if (errors) {
        setError('Failed to fetch items');
        console.error('Errors:', errors);
      } else {
        setItems(data as SimplifiedItem[]);
      }
    } catch (err) {
      setError('An error occurred while fetching items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, errors } = await client.models.Category.list();
      if (errors) {
        console.error('Errors fetching categories:', errors);
      } else {
        setCategories(data.map(category => ({ id: category.id ?? null, name: category.name })));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBins = async () => {
    try {
      const { data, errors } = await client.models.Bin.list();
      if (errors) {
        console.error('Errors fetching bins:', errors);
      } else {
        setBins(data.map(bin => ({ id: bin.id ?? null, name: bin.name })));
      }
    } catch (err) {
      console.error('Error fetching bins:', err);
    }
  };

  const filterItems = () => {
    let filtered = items;
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category?.id === selectedCategory);
    }
    if (selectedBin) {
      filtered = filtered.filter(item => item.bin?.id === selectedBin);
    }
    setFilteredItems(filtered);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;

    try {
      const { errors } = await client.models.Item.delete({ id: deleteConfirmation.id });
      if (errors) {
        setError('Failed to delete item');
        console.error('Errors:', errors);
      } else {
        setItems(items.filter(item => item.id !== deleteConfirmation.id));
      }
    } catch (err) {
      setError('An error occurred while deleting the item');
      console.error('Error:', err);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  if (loading) return <div className="mt-8 text-center">Loading items...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Items</h2>
        <Link 
          to="/item/new" 
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 ml-4"
        >
          Add New Item
        </Link>
      </div>
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id ?? 'unknown'} value={category.id ?? ''}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedBin}
          onChange={(e) => setSelectedBin(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Bins</option>
          {bins.map((bin) => (
            <option key={bin.id ?? 'unknown'} value={bin.id ?? ''}>
              {bin.name}
            </option>
          ))}
        </select>
      </div>
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600">No items found.</p>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
              <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                {item.photo_url ? (
                  <img 
                    src={item.photo_url} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between p-4 flex-grow">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Bin: {item.bin?.name || 'Out of Bin'}</p>
                  <p className="text-gray-600 text-sm">Category: {item.category?.name || 'Uncategorized'}</p>
                  <p className="text-gray-600 text-sm">Condition: {item.condition}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Link 
                    to={`/item/edit/${item.id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => item.id && item.name && handleDeleteClick(item.id, item.name)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete the item "{deleteConfirmation.name}"?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;