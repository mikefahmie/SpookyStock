import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/api'
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>()

// Define a more specific type for Category
type Category = Schema['Category']['type']

function App() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, errors } = await client.models.Category.list()
        if (errors) {
          console.error('Error fetching categories:', errors)
        } else {
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const addCategory = async () => {
    const newCategoryName = prompt('Enter new category name:')
    if (newCategoryName) {
      try {
        const { data, errors } = await client.models.Category.create({
          name: newCategoryName,
          description: 'A new category'
        })
        if (errors) {
          console.error('Error creating category:', errors)
        } else {
          setCategories(prevCategories => {
            // Use type assertion here
            return [...prevCategories, data as Category]
          })
        }
      } catch (error) {
        console.error('Error creating category:', error)
      }
    }
  }

  return (
    <div>
      <h1>SpookyStock Categories</h1>
      <button onClick={addCategory}>Add New Category</button>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name} - {category.description}</li>
        ))}
      </ul>
    </div>
  )
}

export default App