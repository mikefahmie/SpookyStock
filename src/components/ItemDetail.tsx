import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  condition: string;
  categoryId: string;
  categoryName: string;
  binId: string;
  binName: string;
  photoUrl?: string;
}

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const data = await API.graphql(graphqlOperation(getItem, { id }));
        // setItem(data.data.getItem);
        
        // Dummy data
        setItem({
          id: id || '1',
          name: 'Spooky Skeleton',
          condition: 'Good',
          categoryId: '1',
          categoryName: 'Halloween',
          binId: '1',
          binName: 'Attic Bin',
          photoUrl: 'https://example.com/skeleton.jpg',
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch item details');
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // TODO: Replace with actual API call
        // await API.graphql(graphqlOperation(deleteItem, { id }));
        console.log('Item deleted');
        navigate('/items');
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <div className="mb-4">
        {item.photoUrl && (
          <img src={item.photoUrl} alt={item.name} className="w-64 h-64 object-cover rounded-lg shadow-md mb-4" />
        )}
        <p className="mb-2">Condition: {item.condition}</p>
        <p className="mb-2">
          Category: <Link to={`/category/${item.categoryId}`} className="text-blue-600 hover:text-blue-800">{item.categoryName}</Link>
        </p>
        <p className="mb-4">
          Bin: <Link to={`/bin/${item.binId}`} className="text-blue-600 hover:text-blue-800">{item.binName}</Link>
        </p>
      </div>
      <div className="mb-4">
        <Link to={`/item/edit/${id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Edit
        </Link>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      </div>
      
      <Link to="/items" className="text-blue-600 hover:text-blue-800">
        Back to Items
      </Link>
    </div>
  );
};

export default ItemDetail;