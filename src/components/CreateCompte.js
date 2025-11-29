import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_TOTAL_SOLDE } from '../graphql/queries';
import { TypeCompte } from '../graphql/types';
import { PlusCircle, CreditCard, PiggyBank } from 'lucide-react';

function CreateCompte() {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState(TypeCompte.COURANT);
  
  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE }
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!solde || parseFloat(solde) < 0) {
      alert('Veuillez entrer un solde valide (supérieur ou égal à 0)');
      return;
    }

    try {
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type: type,
          },
        },
      });
      
      setSolde('');
      setType(TypeCompte.COURANT);
      alert('✅ Compte créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      alert('❌ Erreur lors de la création du compte: ' + error.message);
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      {renderGlowEffect()}
      
      <div className="relative z-10 p-8">
        {renderHeader()}
        {renderForm(solde, setSolde, type, setType, handleSubmit, loading)}
      </div>
    </div>
  );
}

function renderGlowEffect() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
    </>
  );
}

function renderHeader() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl">
        <PlusCircle className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white">
          Create New Account
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-1">
          Start your financial journey
        </p>
      </div>
    </div>
  );
}

function renderForm(solde, setSolde, type, setType, handleSubmit, loading) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderSoldeInput(solde, setSolde)}
      {renderTypeSelection(type, setType)}
      {renderSubmitButton(loading)}
    </form>
  );
}

function renderSoldeInput(solde, setSolde) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
        Initial Balance (DH)
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          min="0"
          value={solde}
          onChange={(e) => setSolde(e.target.value)}
          className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 text-lg font-semibold text-white placeholder-gray-600"
          placeholder="0.00"
          required
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
          DH
        </div>
      </div>
    </div>
  );
}

function renderTypeSelection(type, setType) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
        Account Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        {renderTypeButton(TypeCompte.COURANT, type, setType, CreditCard, 'Current', 'Daily use', 'cyan')}
        {renderTypeButton(TypeCompte.EPARGNE, type, setType, PiggyBank, 'Savings', 'Save money', 'emerald')}
      </div>
    </div>
  );
}

function renderTypeButton(typeValue, currentType, setType, Icon, title, subtitle, color) {
  const isSelected = currentType === typeValue;
  const colorClasses = {
    cyan: {
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/10',
      gradient: 'from-cyan-500 to-blue-600',
      text: 'text-cyan-400'
    },
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/10',
      gradient: 'from-emerald-500 to-green-600',
      text: 'text-emerald-400'
    }
  };

  return (
    <button
      type="button"
      onClick={() => setType(typeValue)}
      className={`group flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all duration-300 ${
        isSelected
          ? `${colorClasses[color].border} ${colorClasses[color].bg} scale-105`
          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
      }`}
    >
      <div className={`p-3 rounded-lg mb-3 ${
        isSelected
          ? `bg-gradient-to-r ${colorClasses[color].gradient}`
          : 'bg-gray-800'
      }`}>
        <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
      </div>
      <span className={`font-bold text-base ${
        isSelected ? colorClasses[color].text : 'text-gray-400'
      }`}>
        {title}
      </span>
      <span className="text-xs text-gray-600 mt-1">{subtitle}</span>
    </button>
  );
}

function renderSubmitButton(loading) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <div className="relative flex items-center justify-center space-x-3">
        <PlusCircle className="w-5 h-5" />
        <span className="text-lg">
          {loading ? 'Creating...' : 'Create Account'}
        </span>
      </div>
    </button>
  );
}

export default CreateCompte;