import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_COMPTE_TRANSACTIONS, GET_ALL_COMPTES, GET_TOTAL_SOLDE, GET_TRANSACTION_STATS } from '../graphql/queries';
import { TypeTransaction } from '../graphql/types';
import { ArrowDownCircle, ArrowUpCircle, Zap } from 'lucide-react';

function AddTransaction({ compteId, onSuccess }) {
  const [type, setType] = useState(TypeTransaction.DEPOT);
  const [montant, setMontant] = useState('');

  const [addTransaction, { loading }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_COMPTE_TRANSACTIONS, variables: { id: compteId } },
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE },
      { query: GET_TRANSACTION_STATS }
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!montant || parseFloat(montant) <= 0) {
      alert('Veuillez entrer un montant valide (supérieur à 0)');
      return;
    }

    try {
      await addTransaction({
        variables: {
          transaction: {
            type: type,
            montant: parseFloat(montant),
            compteId: compteId,
          },
        },
      });

      setMontant('');
      setType(TypeTransaction.DEPOT);
      alert('✅ Transaction effectuée avec succès!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de la transaction:', error);
      alert('❌ Erreur lors de la transaction: ' + error.message);
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700 overflow-hidden">
      {renderGlowEffect()}
      
      <div className="relative z-10">
        {renderHeader()}
        {renderForm(type, setType, montant, setMontant, handleSubmit, loading)}
      </div>
    </div>
  );
}

function renderGlowEffect() {
  return (
    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
  );
}

function renderHeader() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2.5 rounded-lg">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-black text-white">
        New Transaction
      </h3>
    </div>
  );
}

function renderForm(type, setType, montant, setMontant, handleSubmit, loading) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {renderTypeSelection(type, setType)}
      {renderMontantInput(montant, setMontant)}
      {renderSubmitButton(type, loading)}
    </form>
  );
}

function renderTypeSelection(type, setType) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        Transaction Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {renderTypeButton(
          TypeTransaction.DEPOT,
          type,
          setType,
          ArrowDownCircle,
          'Deposit',
          'emerald'
        )}
        {renderTypeButton(
          TypeTransaction.RETRAIT,
          type,
          setType,
          ArrowUpCircle,
          'Withdraw',
          'orange'
        )}
      </div>
    </div>
  );
}

function renderTypeButton(typeValue, currentType, setType, Icon, label, color) {
  const isSelected = currentType === typeValue;
  const colorClasses = {
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      iconBg: 'bg-orange-500'
    }
  };

  return (
    <button
      type="button"
      onClick={() => setType(typeValue)}
      className={`group flex items-center justify-center py-4 px-4 rounded-lg border-2 transition-all duration-300 ${
        isSelected
          ? `${colorClasses[color].border} ${colorClasses[color].bg} ${colorClasses[color].text} scale-105`
          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
      }`}
    >
      <div className={`p-2 rounded-lg mr-3 ${isSelected ? colorClasses[color].iconBg : 'bg-gray-700'}`}>
        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
      </div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}

function renderMontantInput(montant, setMontant) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        Amount (DH)
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 text-lg font-bold text-white placeholder-gray-600"
          placeholder="0.00"
          required
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
          DH
        </div>
      </div>
    </div>
  );
}

function renderSubmitButton(type, loading) {
  const isDepo = type === TypeTransaction.DEPOT;
  const gradient = isDepo
    ? 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
    : 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700';

  return (
    <button
      type="submit"
      disabled={loading}
      className={`group relative w-full bg-gradient-to-r ${gradient} disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <div className="relative flex items-center justify-center space-x-2">
        {isDepo ? (
          <ArrowDownCircle className="w-5 h-5" />
        ) : (
          <ArrowUpCircle className="w-5 h-5" />
        )}
        <span className="text-base">
          {loading ? 'Processing...' : `Make ${isDepo ? 'Deposit' : 'Withdrawal'}`}
        </span>
      </div>
    </button>
  );
}

export default AddTransaction;