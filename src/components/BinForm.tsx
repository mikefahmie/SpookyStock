import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const BinForm: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locations = ['Garage', 'Basement', 'Upstairs'];

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
  
    const binInput: any = {
      name: name.trim(),
      location: location.trim(),
    };
  
    if (photoUrl.trim()) {
      binInput.photo_url = photoUrl.trim();
    }
  
    console.log('Bin input:', binInput);
  
    try {
      const { data: newBin, errors } = await client.models.Bin.create(binInput);
  
      if (errors) {
        setError(`Failed to create bin. Errors: ${JSON.stringify(errors, null, 2)}`);
      } else if (newBin) {
        setMessage(`Bin "${newBin.name}" created successfully!`);
        setName('');
        setLocation('');
        setPhotoUrl('');
      } else {
        setError('Failed to create bin. No data returned.');
      }
    } catch (err) {
      setError(`An error occurred. Details: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Bin</h2>
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
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter photo URL (optional)"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Bin'}
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

export default BinForm;