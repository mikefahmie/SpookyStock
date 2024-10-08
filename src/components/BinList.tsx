import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Bin {
  id: string;
  name: string;
  location: string;
}

const BinList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('category');

  // Dummy data - replace with actual data fetching logic later
  const bins: Bin[] = [
    { id: '1', name: 'Attic Bin', location: 'Attic' },
    { id: '2', name: 'Garage Shelf 1', location: 'Garage' },
    { id: '3', name: 'Basement Box', location: 'Basement' },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Bins {categoryId ? `for Category ${categoryId}` : ''}</h1>
      <Link to="/bin/new" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4 inline-block">
        Add New Bin
      </Link>
      <ul className="space-y-2">
        {bins.map((bin) => (
          <li key={bin.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <span className="font-bold">{bin.name}</span>
              <span className="text-gray-600 ml-2">({bin.location})</span>
            </div>
            <Link to={`/items?bin=${bin.id}`} className="text-purple-600 hover:text-purple-800">
              View Items
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BinList;