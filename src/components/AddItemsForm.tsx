import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface AddItemFormProps {
  onClose: () => void;
  onItemAdded: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onClose, onItemAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let photoUrl = '';
    if (photo) {
      const fileName = `${uuidv4()}-${photo.name}`;
      const result = await uploadData({
        key: fileName,
        data: photo,
        options: {
          accessLevel: 'private',
          contentType: photo.type,
        },
      }).result;
      photoUrl = result.key;
    }

    await client.models.Item.create({
      name,
      description,
      condition,
      notes,
      photoUrl,
      tags: tags.split(',').map(tag => tag.trim()),
    });

    onItemAdded();
    onClose();
  };

  return (
    <div className="add-item-form">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit">Add Item</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddItemForm;