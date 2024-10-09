import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Schema['Category']['type'][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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

    fetchCategories();
  }, []);

  if (loading) return <div className="mt-8 text-center">Loading categories...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {categories === null ? (
        <p className="text-center text-gray-600">No categories found. The list is empty.</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories have been added yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;