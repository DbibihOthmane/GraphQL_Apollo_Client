import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPTE_TRANSACTIONS } from '../graphql/queries';
import AddTransaction from './AddTransaction';
import { X, ArrowDownCircle, ArrowUpCircle, Clock, History } from 'lucide-react';

function TransactionModal({ compte, onClose }) {
  const { loading, error, data, refetch } = useQuery(GET_COMPTE_TRANSACTIONS, {
    variables: { id: compte.id },
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {renderModalHeader(compte, onClose)}
        {renderModalContent(compte, loading, error, data, refetch)}
      </div>
    </div>
  );
}

function renderModalHeader(compte, onClose) {
  const isEpargne = compte.type === 'EPARGNE';
  const gradient = isEpargne 
    ? 'from-emerald-500 to-green-600'
    : 'from-cyan-500 to-blue-600';

  return (
    <div className={`relative bg-gradient-to-r ${gradient} p-8 text-white overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black">
                {isEpargne ? 'Savings' : 'Current'} Account
              </h2>
              <p className="text-white/70 text-sm font-medium mt-0.5">ID: {compte.id}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 inline-block">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
              Available Balance
            </p>
            <p className="text-4xl font-black">
              {compte.solde.toFixed(2)} <span className="text-2xl">DH</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function renderModalContent(compte, loading, error, data, refetch) {
  return (
    <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)] custom-scrollbar">
      <AddTransaction 
        compteId={compte.id} 
        onSuccess={() => refetch()}
      />
      
      {renderTransactionHistory(loading, error, data)}
    </div>
  );
}

function renderTransactionHistory(loading, error, data) {
  return (
    <div className="mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-700 p-3 rounded-xl">
          <History className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">
            Transaction History
          </h3>
          <p className="text-sm text-gray-400 font-medium">
            All your recent operations
          </p>
        </div>
      </div>

      {loading && renderLoadingState()}
      {error && renderErrorState(error)}
      {data && renderTransactionList(data)}
    </div>
  );
}

function renderLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-700 animate-pulse rounded-xl h-24"></div>
      ))}
    </div>
  );
}

function renderErrorState(error) {
  return (
    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
      <p className="text-red-400 font-semibold">❌ Error: {error.message}</p>
    </div>
  );
}

function renderTransactionList(data) {
  if (!data.compteTransactions || data.compteTransactions.length === 0) {
    return renderEmptyTransactions();
  }

  const sortedTransactions = [...data.compteTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => renderTransaction(transaction))}
    </div>
  );
}

function renderEmptyTransactions() {
  return (
    <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
      <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 font-semibold text-lg">
        No transactions yet
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Make your first transaction above
      </p>
    </div>
  );
}

function renderTransaction(transaction) {
  const isDepo = transaction.type === 'DEPOT';
  const config = isDepo
    ? {
        border: 'border-emerald-500',
        bg: 'bg-emerald-500/10',
        icon: ArrowDownCircle,
        iconColor: 'text-emerald-400',
        textColor: 'text-emerald-400',
        label: 'Deposit',
        sign: '+'
      }
    : {
        border: 'border-orange-500',
        bg: 'bg-orange-500/10',
        icon: ArrowUpCircle,
        iconColor: 'text-orange-400',
        textColor: 'text-orange-400',
        label: 'Withdrawal',
        sign: '-'
      };

  return (
    <div
      key={transaction.id}
      className={`group relative border-l-4 ${config.border} ${config.bg} rounded-xl p-5 hover:bg-opacity-20 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${isDepo ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
            <config.icon className={`w-7 h-7 ${config.iconColor}`} />
          </div>
          <div>
            <p className="font-black text-white text-lg">
              {config.label}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1 flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-black ${config.textColor}`}>
            {config.sign}{transaction.montant.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 font-bold">DH</p>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;