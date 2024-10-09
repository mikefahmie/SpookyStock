//import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="flex flex-col min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">Spookystock</h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            <CategoryForm />
            <CategoryList />
          </main>
          <footer className="bg-white shadow-sm mt-8">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
              <button
                onClick={signOut}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Sign out
              </button>
            </div>
          </footer>
        </div>
      )}
    </Authenticator>
  );
}

export default App;