import React from 'react';
import type { Schema } from '../../amplify/data/resource';

interface ItemListProps {
  items: Array<Schema["Todo"]["type"]>;
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.id} className="item">
          <h3>{item.content}</h3>
          <p>BIN Name - Category Name</p>
          <p>Last Updated: {new Date(item.updatedAt || '').toLocaleDateString()}</p>
          <button>Details</button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;