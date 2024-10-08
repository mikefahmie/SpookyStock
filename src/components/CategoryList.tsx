import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

const CategoryList: React.FC = () => {
  // Dummy data - replace with actual data fetching logic later
  const categories: Category[] = [
    { id: '1', name: 'Halloween' },
    { id: '2', name: 'Christmas' },
    { id: '3', name: 'Easter' },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <Link to="/category/new" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4 inline-block">
        Add New Category
      </Link>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
            <span>{category.name}</span>
            <div>
              <Link to={`/bins?category=${category.id}`} className="text-purple-600 hover:text-purple-800 mr-2">
                View Bins
              </Link>
              <Link to={`/items?category=${category.id}`} className="text-purple-600 hover:text-purple-800">
                View Items
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;