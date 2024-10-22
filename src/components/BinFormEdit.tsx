import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { type Schema } from '../../amplify/data/resource';
import { useParams, useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();

const BinFormEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locations = ['Garage', 'Basement', 'Upstairs'];

  useEffect(() => {
    const fetchBin = async () => {
      if (!id) return;
      try {
        const { data: bin, errors } = await client.models.Bin.get({ id });
        if (errors) {
          setError('Failed to fetch bin');
          console.error('Errors:', errors);
        } else if (bin) {
          setName(bin.name);
          setLocation(bin.location || '');
          setCurrentPhotoUrl(bin.photo_url || null);
        } else {
          setError('Bin not found');
        }
      } catch (err) {
        setError('An error occurred while fetching the bin');
        console.error('Error:', err);
      }
    };

    fetchBin();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!name.trim() || !location) {
      setError('Bin name and location are required');
      setIsSubmitting(false);
      return;
    }

    if (name.length > 55) {
      setError('Bin name must be 55 characters or less');
      setIsSubmitting(false);
      return;
    }

    try {
      let photo_url = currentPhotoUrl; // Keep existing photo URL by default
      
      if (photo) {
        // If a new photo is selected, upload it
        const fileName = `${Date.now()}-${photo.name}`;
        const result = await uploadData({
          key: fileName,
          data: photo,
          options: {
            contentType: photo.type,
          }
        }).result;
        photo_url = result.key;
      }

      const { data: updatedBin, errors } = await client.models.Bin.update({
        id,
        name: name.trim(),
        location,
        photo_url: photo_url || undefined,
      });

      if (errors) {
        setError('Failed to update bin. Please try again.');
        console.error('Errors:', errors);
      } else if (updatedBin) {
        setMessage(`Bin "${updatedBin.name}" updated successfully!`);
        setTimeout(() => navigate('/bins'), 2000); // Redirect to bins list after 2 seconds
      } else {
        setError('Failed to update bin. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Bin</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={55}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter bin name"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            Photo
          </label>
          {currentPhotoUrl && (
            <div className="mt-2 mb-2">
              <p className="text-sm text-gray-500">Current photo: {currentPhotoUrl}</p>
            </div>
          )}
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Updating...' : 'Update Bin'}
        </button>
      </form>
      {message && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default BinFormEdit;