import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Link } from 'react-router-dom';

const client = generateClient<Schema>();

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Schema['Category']['type'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, errors } = await client.models.Category.list();
      if (errors) {
        setError('Failed to fetch categories');
        console.error('Errors:', errors);
      } else {
        setCategories(data);
      }
    } catch (err) {
      setError('An error occurred while fetching categories');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;

    try {
      const { errors } = await client.models.Category.delete({ id: deleteConfirmation.id });
      if (errors) {
        setError('Failed to delete category');
        console.error('Errors:', errors);
      } else {
        // Remove the deleted category from the state
        setCategories(categories.filter(cat => cat.id !== deleteConfirmation.id));
      }
    } catch (err) {
      setError('An error occurred while deleting the category');
      console.error('Error:', err);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  if (loading) return <div className="mt-8 text-center">Loading categories...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link 
          to="/category/new" 
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ml-4"
        >
          Create Category
        </Link>
      </div>
      {categories.length === 0 ? (
          <p className="text-center text-gray-600">No categories found.</p>
        ) : (
          <ul className="space-y-6 px-4 max-w-3xl mx-auto bg-gray-100 border-none" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
            {categories.map((category) => (
              <li key={category.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                  <Link 
                    to={`/category/edit/${category.id}`} 
                    className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded hover:bg-indigo-50 transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => category.id && category.name && handleDeleteClick(category.id, category.name)}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete the category "{deleteConfirmation.name}"?</p>
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

export default CategoryList;