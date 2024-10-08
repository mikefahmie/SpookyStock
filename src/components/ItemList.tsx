import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  category: string;
  bin: string;
}

const ItemList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('category');
  const binId = searchParams.get('bin');

  // Dummy data - replace with actual data fetching logic later
  const items: Item[] = [
    { id: '1', name: 'Spooky Skeleton', category: 'Halloween', bin: 'Attic Bin' },
    { id: '2', name: 'Christmas Lights', category: 'Christmas', bin: 'Garage Shelf 1' },
    { id: '3', name: 'Easter Eggs', category: 'Easter', bin: 'Basement Box' },
  ];

  const filteredItems = items.filter((item) => {
    if (categoryId && item.category !== categoryId) return false;
    if (binId && item.bin !== binId) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">
        Items
        {categoryId ? ` in Category ${categoryId}` : ''}
        {binId ? ` in Bin ${binId}` : ''}
      </h1>
      <Link to="/item/new" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4 inline-block">
        Add New Item
      </Link>
      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li key={item.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
            <span>{item.name}</span>
            <div>
              <span className="text-gray-600 mr-2">{item.category}</span>
              <span className="text-gray-600">{item.bin}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;