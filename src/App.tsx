import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navigation from './components/Navigation';
import CategoryList from './components/CategoryList';
import BinList from './components/BinList';
import ItemList from './components/ItemList';
import CategoryForm from './components/CategoryForm';
import BinForm from './components/BinForm';
import ItemForm from './components/ItemForm';
import SearchComponent from './components/SearchComponent';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="flex flex-col h-screen">
            <Navigation signOut={signOut} user={user} />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<CategoryList />} />
                <Route path="/bins" element={<BinList />} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/category/new" element={<CategoryForm />} />
                <Route path="/bin/new" element={<BinForm />} />
                <Route path="/item/new" element={<ItemForm />} />
                <Route path="/search" element={<SearchComponent />} />
              </Routes>
            </main>
          </div>
          <div>Hello, world!</div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;