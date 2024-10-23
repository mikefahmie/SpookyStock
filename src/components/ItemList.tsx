import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { type Schema } from '../../amplify/data/resource';
import { Link, useSearchParams } from 'react-router-dom';

const client = generateClient<Schema>();

type SimplifiedItem = {
  id: string | null;
  name: string;
  photo_url?: string | null;
  condition?: 'Good' | 'Damaged' | 'Broken' | null;
  bin?: { id: string | null; name: string };
  category?: { id: string | null; name: string };
};

const ItemList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<SimplifiedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SimplifiedItem[]>([]);
  const [categories, setCategories] = useState<{ id: string | null; name: string }[]>([]);
  const [bins, setBins] = useState<{ id: string | null; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);
  const [searchText, setSearchText] = useState('');
const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchBins();
    handleUrlParamChange();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, selectedBinId, searchText]);

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

  const filterItems = React.useCallback(() => {
    let filtered = items;

    if (selectedBinId) {
      filtered = filtered.filter((item) => item.bin?.id === selectedBinId);
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category?.id === selectedCategory);
    }

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedBinId, selectedCategory, searchText]);

  const handleUrlParamChange = () => {
    const binId = searchParams.get('bin');
    setSelectedBinId(binId || null);
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
        setItems(items.filter((item) => item.id !== deleteConfirmation.id));
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

  const handleImageClick = (photoUrl: string | null | undefined) => {
    if (photoUrl) {
      setSelectedImage(photoUrl);
    }
  };

  if (loading) return <div className="mt-8 text-center">Loading items...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-8 mt-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Items</h2>
        <Link
          to={`/item/new?bin=${selectedBinId || ''}`}
          className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-center"
        >
          Add New Item
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search items..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id ?? 'unknown'} value={category.id ?? ''}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedBinId || ''}
          onChange={(e) => setSelectedBinId(e.target.value || null)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        <p className="text-center text-gray-600 py-8">No items found.</p>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-24 h-48 relative cursor-pointer"
                onClick={() => handleImageClick(item.photo_url)}
                >
                  {item.photo_url ? (
                    <StorageImage
                      alt={item.name}
                      path={`public/${item.photo_url}`}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://via.placeholder.com/100?text=No+Image"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow p-4">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-gray-600 text-sm">Bin: {item.bin?.name || 'Out of Bin'}</p>
                    <p className="text-gray-600 text-sm">Category: {item.category?.name || 'Uncategorized'}</p>
                    <p className="text-gray-600 text-sm">Condition: {item.condition || 'Not specified'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/item/edit/${item.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => item.id && item.name && handleDeleteClick(item.id, item.name)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete "{deleteConfirmation.name}"?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-full max-h-full w-full h-full flex items-center justify-center">
            <StorageImage
              alt="Enlarged view"
              path={`public/${selectedImage}`}
              className="max-w-full max-h-full object-contain"
              fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;