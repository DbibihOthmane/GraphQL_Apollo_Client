import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import Dashboard from './components/Dashboard';
import CreateCompte from './components/CreateCompte';
import CompteList from './components/CompteList';
import { Wallet, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-900">
        {/* Header Dark */}
        <header className="bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    BANKFLOW
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">Digital Banking System</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 font-semibold text-sm">Online</span>
                </div>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-gray-700 transition">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Dashboard />
          <CreateCompte />
          <CompteList />
        </main>

        {/* Footer Dark */}
        <footer className="bg-black border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">BANKFLOW</span>
              </div>
              <p className="text-gray-500 text-sm">
                © 2025 BankFlow. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm font-medium">
                  Privacy
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm font-medium">
                  Terms
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm font-medium">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;