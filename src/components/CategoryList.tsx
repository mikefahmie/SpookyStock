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
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div>
                  <Link 
                    to={`/category/edit/${category.id}`} 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => category.id && category.name && handleDeleteClick(category.id, category.name)}
                    className="text-red-600 hover:text-red-800"
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