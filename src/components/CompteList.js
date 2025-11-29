import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_COMPTES } from '../graphql/queries';
import CompteCard from './CompteCard';
import TransactionModal from './TransactionModal';
import { Wallet, Grid } from 'lucide-react';

function CompteList() {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);
  const [selectedCompte, setSelectedCompte] = useState(null);

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError(error);
  }

  if (!data?.allComptes || data.allComptes.length === 0) {
    return renderEmptyState();
  }

  return (
    <>
      {renderHeader(data.allComptes.length)}
      {renderCompteGrid(data.allComptes, setSelectedCompte)}
      {selectedCompte && (
        <TransactionModal
          compte={selectedCompte}
          onClose={() => setSelectedCompte(null)}
        />
      )}
    </>
  );
}

function renderLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-700 animate-pulse rounded-xl h-8 w-48"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 animate-pulse rounded-2xl h-80 border border-gray-700"></div>
        ))}
      </div>
    </div>
  );
}

function renderError(error) {
  return (
    <div className="relative bg-gray-800 border-2 border-red-500/50 rounded-2xl p-8">
      <div className="flex items-center space-x-4">
        <div className="bg-red-500/10 p-4 rounded-xl">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-red-400">Error occurred</p>
          <p className="text-red-300 font-medium mt-1">{error.message}</p>
        </div>
      </div>
    </div>
  );
}

function renderEmptyState() {
  return (
    <div className="relative bg-gray-800 border-2 border-dashed border-gray-700 rounded-2xl p-16 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-700 rounded-2xl mb-6">
          <Wallet className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3">
          No Accounts Yet
        </h3>
        <p className="text-gray-400 font-medium text-lg">
          Create your first account to get started
        </p>
      </div>
    </div>
  );
}

function renderHeader(count) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl">
          <Grid className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            My Accounts
          </h2>
          <p className="text-gray-400 font-medium mt-1">
            {count} {count > 1 ? 'active accounts' : 'active account'}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-gray-300">Synced</span>
      </div>
    </div>
  );
}

function renderCompteGrid(comptes, setSelectedCompte) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {comptes.map((compte) => (
        <CompteCard
          key={compte.id}
          compte={compte}
          onViewTransactions={setSelectedCompte}
        />
      ))}
    </div>
  );
}

export default CompteList;