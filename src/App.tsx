import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CategoryForm from './components/CategoryForm';
import CategoryFormEdit from './components/CategoryFormEdit';
import CategoryList from './components/CategoryList';
import BinForm from './components/BinForm';
import BinList from './components/BinList';
import BinFormEdit from './components/BinFormEdit';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import ItemFormEdit from './components/ItemFormEdit';

function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Welcome to SpookyStock</h2>
      <div className="flex space-x-4">
        <Link to="/categories" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Categories
        </Link>
        <Link to="/bins" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Bins
        </Link>
        <Link to="/items" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Items
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600">
                  SpookyStock
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Sign out
                </button>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/category/new" element={<CategoryForm />} />
                <Route path="/category/edit/:id" element={<CategoryFormEdit />} />
                <Route path="/bins" element={<BinList />} />
                <Route path="/bin/new" element={<BinForm />} />
                <Route path="/bin/edit/:id" element={<BinFormEdit />} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/item/new" element={<ItemForm />} />
                <Route path="/item/edit/:id" element={<ItemFormEdit />} />
              </Routes>
            </main>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;