import React, { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../amplify/data/resource'

const client = generateClient<Schema>()

const AddItemsForm = () => {
  const [name, setName] = useState('')
  const [binID, setBinID] = useState('')
  const [condition, setCondition] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newItem = await client.models.Item.create({
        name,
        binID,
        condition,
        photo_url: photoUrl,
      })
      console.log('New item created:', newItem)
      // Reset form
      setName('')
      setBinID('')
      setCondition('')
      setPhotoUrl('')
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
        required
      />
      <input
        type="text"
        value={binID}
        onChange={(e) => setBinID(e.target.value)}
        placeholder="Bin ID"
        required
      />
      <input
        type="text"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        placeholder="Condition"
      />
      <input
        type="text"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        placeholder="Photo URL"
      />
      <button type="submit">Add Item</button>
    </form>
  )
}

export default AddItemsForm