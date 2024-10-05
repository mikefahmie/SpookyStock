import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import NavBar from './components/NavBar';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import AddItemButton from './components/AddItemButton';
import './App.css';

const client = generateClient<Schema>();

function App() {
  const [items, setItems] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setItems([...data.items]),
    });
  }, []);

  const filteredItems = items.filter(item =>
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <NavBar onSignOut={signOut} user={user} />
          <div className="sticky-top">
            <SearchBar onSearch={setSearchQuery} />
            <AddItemButton />
          </div>
          <main>
            <ItemList items={filteredItems} />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;