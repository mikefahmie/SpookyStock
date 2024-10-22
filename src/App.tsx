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
import { Amplify } from 'aws-amplify';
import awsExports from '../amplify_outputs.json';
import Navbar from './components/Navbar'; // Import the new Navbar component

Amplify.configure(awsExports);

function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Welcome to SpookyStock</h2>
      <div className="flex flex-col space-y-4">
        <Link to="/categories" className="bg-purple-800 text-white py-4 px-4 rounded-md hover:bg-purple-700">
          Categories
        </Link>
        <Link to="/bins" className="bg-purple-800 text-white py-4 px-4 rounded-md hover:bg-purple-700">
          Bins
        </Link>
        <Link to="/items" className="bg-purple-800 text-white py-4 px-4 rounded-md hover:bg-purple-700">
          Items
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Authenticator>
      {() => (  // Removed the unused 'signOut' function
        <Router>
          <div className="flex flex-col min-h-screen bg-white">
            {/* Use the new Navbar component */}
            <Navbar />

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
