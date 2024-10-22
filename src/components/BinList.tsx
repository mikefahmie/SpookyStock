import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { type Schema } from '../../amplify/data/resource';
import { Link } from 'react-router-dom';

const client = generateClient<Schema>();

const BinList: React.FC = () => {
  const [bins, setBins] = useState<Schema['Bin']['type'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      setLoading(true);
      const { data, errors } = await client.models.Bin.list();
      if (errors) {
        setError('Failed to fetch bins');
        console.error('Errors:', errors);
      } else {
        console.log('Fetched bins:', data);
        data.forEach(bin => {
          const cleanPath = bin.photo_url ? bin.photo_url : 'No file';
          console.log(`Bin: ${bin.name}, Clean photo path: ${cleanPath}`);
        });
        setBins(data);
      }
    } catch (err) {
      setError('An error occurred while fetching bins');
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
      const { errors } = await client.models.Bin.delete({ id: deleteConfirmation.id });
      if (errors) {
        setError('Failed to delete bin');
        console.error('Errors:', errors);
      } else {
        setBins(bins.filter(bin => bin.id !== deleteConfirmation.id));
      }
    } catch (err) {
      setError('An error occurred while deleting the bin');
      console.error('Error:', err);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  if (loading) return <div className="mt-8 text-center">Loading bins...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bins</h2>
        <Link 
          to="/bin/new" 
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 ml-4"
        >
          Create Bin
        </Link>
      </div>
      {bins.length === 0 ? (
        <p className="text-center text-gray-600">No bins found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bins.map((bin) => (
            <div key={bin.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-48 relative">
                {bin.photo_url ? (
                  <StorageImage
                    alt={bin.name}
                    path={`public/${bin.photo_url}`} 
                    className="w-full h-full object-cover"
                    fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{bin.name}</h3>
                <p className="text-gray-600 mb-4">Location: {bin.location}</p>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/bin/edit/${bin.id}`} 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => bin.id && bin.name && handleDeleteClick(bin.id, bin.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete the bin "{deleteConfirmation.name}"?</p>
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

export default BinList;