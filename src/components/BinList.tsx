import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { type Schema } from '../../amplify/data/resource';
import { Link, useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();

type SimplifiedBin = {
  id: string | null;
  name: string;
  location?: string | null;
  photo_url?: string | null;
  items?: { id: string }[] | null;
};

const BinList: React.FC = () => {
  const navigate = useNavigate();
  const [bins, setBins] = useState<SimplifiedBin[]>([]);
  const [filteredBins, setFilteredBins] = useState<SimplifiedBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Define available locations
  const locations = ['Garage', 'Basement', 'Upstairs'];

  useEffect(() => {
    fetchBins();
  }, []);

  useEffect(() => {
    filterBins();
  }, [bins, searchText, selectedLocation]);

  const fetchBins = async () => {
    try {
      setLoading(true);
      const { data, errors } = await client.models.Bin.list({
        selectionSet: ['id', 'name', 'location', 'photo_url', 'items.id']
      });
      if (errors) {
        setError('Failed to fetch bins');
        console.error('Errors:', errors);
      } else {
        console.log('Fetched bins:', data);
        setBins(data as SimplifiedBin[]);
        setFilteredBins(data as SimplifiedBin[]);
      }
    } catch (err) {
      setError('An error occurred while fetching bins');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBins = React.useCallback(() => {
    let filtered = bins;
    
    if (searchText) {
      filtered = filtered.filter(bin => 
        bin.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(bin => bin.location === selectedLocation);
    }
    
    setFilteredBins(filtered);
  }, [bins, searchText, selectedLocation]);

  const handleBinImageClick = (binId: string | null) => {
    if (binId) {
      navigate('/items', { state: { selectedBinId: binId } });
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
      
      {/* Search and Filter Section */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search bins..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {filteredBins.length === 0 ? (
        <p className="text-center text-gray-600">No bins found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBins.map((bin) => (
            <div key={bin.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="w-full h-48 relative cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => bin.id && handleBinImageClick(bin.id)}
              >
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
                <p className="text-gray-600 mb-2">Location: {bin.location}</p>
                <p className="text-gray-600 mb-4">
                  Items:{' '}
                  <button
                    onClick={() => bin.id && handleBinImageClick(bin.id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {bin.items?.length || 0}
                  </button>
                </p>
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