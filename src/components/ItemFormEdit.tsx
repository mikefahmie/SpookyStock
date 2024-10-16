import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Link, useNavigate, useParams } from 'react-router-dom';

const client = generateClient<Schema>();

const ItemFormEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [condition, setCondition] = useState<'Good' | 'Damaged' | 'Broken' | null>(null);
  const [binId, setBinId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [bins, setBins] = useState<Schema['Bin']['type'][]>([]);
  const [categories, setCategories] = useState<Schema['Category']['type'][]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditions: ('Good' | 'Damaged' | 'Broken')[] = ['Good', 'Damaged', 'Broken'];

  useEffect(() => {
    fetchItem();
    fetchBins();
    fetchCategories();
  }, [id]);

  const fetchItem = async () => {
    if (!id) return;
    try {
      const { data: item, errors } = await client.models.Item.get({ id });
      if (errors) {
        setError('Failed to fetch item');
        console.error('Errors:', errors);
      } else if (item) {
        setName(item.name);
        setPhotoUrl(item.photo_url || '');
        setCondition(item.condition || null);
        setBinId(item.binID || null);
        setCategoryId(item.categoryID || null);
      } else {
        setError('Item not found');
      }
    } catch (err) {
      setError('An error occurred while fetching the item');
      console.error('Error:', err);
    }
  };

  const fetchBins = async () => {
    try {
      const { data, errors } = await client.models.Bin.list();
      if (errors) {
        console.error('Errors fetching bins:', errors);
      } else {
        setBins(data);
      }
    } catch (err) {
      console.error('Error fetching bins:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, errors } = await client.models.Category.list();
      if (errors) {
        console.error('Errors fetching categories:', errors);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!name.trim() || !condition || !categoryId) {
      setError('Name, condition, and category are required');
      setIsSubmitting(false);
      return;
    }

    if (photoUrl && !isValidUrl(photoUrl)) {
      setError('Please enter a valid URL for the photo');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: updatedItem, errors } = await client.models.Item.update({
        id,
        name: name.trim(),
        photo_url: photoUrl.trim() || undefined,
        condition: condition,
        binID: binId || undefined,
        categoryID: categoryId,
      });

      if (errors) {
        setError('Failed to update item. Please try again.');
        console.error('Errors:', errors);
      } else if (updatedItem) {
        setMessage(`Item "${updatedItem.name}" updated successfully!`);
        setTimeout(() => navigate('/items'), 2000);
      } else {
        setError('Failed to update item. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <div className="mb-4">
        <Link to="/items" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Items
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Item</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter item name"
          />
        </div>
        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter photo URL (optional)"
          />
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="condition"
            value={condition || ''}
            onChange={(e) => setCondition(e.target.value as 'Good' | 'Damaged' | 'Broken' | null)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a condition</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bin" className="block text-sm font-medium text-gray-700">
            Bin
          </label>
          <select
            id="bin"
            value={binId || ''}
            onChange={(e) => setBinId(e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Out of Bin</option>
            {bins.map((bin) => (
              <option key={bin.id} value={bin.id || ''}>
                {bin.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || null)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id || ''}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Updating...' : 'Update Item'}
        </button>
      </form>
      {message && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ItemFormEdit;