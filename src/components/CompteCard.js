import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_TOTAL_SOLDE } from '../graphql/queries';
import { CreditCard, Trash2, Eye, Calendar } from 'lucide-react';

function CompteCard({ compte, onViewTransactions }) {
  const [deleteCompte, { loading }] = useMutation(DELETE_COMPTE, {
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE }
    ],
  });

  const handleDelete = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce compte?')) {
      try {
        await deleteCompte({ 
          variables: { id: compte.id } 
        });
        alert('✅ Compte supprimé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression du compte: ' + error.message);
      }
    }
  };

  const config = getCompteConfig(compte.type);

  return (
    <div className="group relative bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden">
      {renderGlowEffect(config)}
      
      <div className="relative z-10 p-6">
        {renderHeader(compte, config, handleDelete, loading)}
        {renderBalance(compte)}
        {renderActionButton(compte, onViewTransactions, config)}
      </div>
    </div>
  );
}

function getCompteConfig(type) {
  return type === 'COURANT' 
    ? {
        label: 'Current Account',
        gradient: 'from-cyan-500 to-blue-600',
        glowColor: 'cyan-500/20',
        iconBg: 'bg-cyan-500/10',
        iconColor: 'text-cyan-400',
        buttonGradient: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
      }
    : {
        label: 'Savings Account',
        gradient: 'from-emerald-500 to-green-600',
        glowColor: 'emerald-500/20',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
        buttonGradient: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
      };
}

function renderGlowEffect(config) {
  return (
    <>
      <div className={`absolute inset-0 bg-${config.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
    </>
  );
}

function renderHeader(compte, config, handleDelete, loading) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className={`${config.iconBg} p-4 rounded-xl`}>
          <CreditCard className={`w-7 h-7 ${config.iconColor}`} />
        </div>
        <div className="ml-4">
          <p className={`text-sm font-bold ${config.iconColor} uppercase tracking-wider`}>
            {config.label}
          </p>
          <p className="text-xs text-gray-600 font-medium mt-1">ID: {compte.id}</p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-lg transition-all duration-300 disabled:opacity-50"
        title="Delete account"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

function renderBalance(compte) {
  return (
    <div className="mb-6 py-6 border-t border-b border-gray-700">
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
        Available Balance
      </p>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-black text-white">
          {compte.solde.toFixed(2)}
        </p>
        <span className="text-lg text-gray-400 font-bold">DH</span>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Calendar className="w-4 h-4 text-gray-600" />
        <p className="text-xs text-gray-500 font-medium">
          {new Date(compte.dateCreation).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}

function renderActionButton(compte, onViewTransactions, config) {
  return (
    <button
      onClick={() => onViewTransactions(compte)}
      className={`group/btn relative w-full bg-gradient-to-r ${config.buttonGradient} text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
      <div className="relative flex items-center justify-center space-x-2">
        <Eye className="w-5 h-5" />
        <span>View Transactions</span>
      </div>
    </button>
  );
}

export default CompteCard;