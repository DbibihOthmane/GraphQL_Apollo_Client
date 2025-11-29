import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOTAL_SOLDE, GET_TRANSACTION_STATS } from '../graphql/queries';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

function Dashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_TOTAL_SOLDE);
  const { data: transStatsData, loading: transLoading } = useQuery(GET_TRANSACTION_STATS);

  if (statsLoading || transLoading) {
    return renderLoading();
  }

  const cards = getCardsData(statsData, transStatsData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => renderCard(card, index))}
    </div>
  );
}

function renderLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-800 animate-pulse rounded-2xl h-48 border border-gray-700"></div>
      ))}
    </div>
  );
}

function getCardsData(statsData, transStatsData) {
  return [
    {
      title: 'Total Balance',
      value: `${statsData?.totalSolde?.sum?.toFixed(2) || '0.00'}`,
      currency: 'DH',
      subtitle: `${statsData?.totalSolde?.count || 0} accounts`,
      icon: DollarSign,
      gradient: 'from-cyan-500 to-blue-600',
      glowColor: 'cyan',
      change: '+12.5%',
      changePositive: true
    },
    {
      title: 'Total Deposits',
      value: `${transStatsData?.transactionStats?.sumDepots?.toFixed(2) || '0.00'}`,
      currency: 'DH',
      subtitle: `${transStatsData?.transactionStats?.count || 0} transactions`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      glowColor: 'emerald',
      change: '+8.2%',
      changePositive: true
    },
    {
      title: 'Total Withdrawals',
      value: `${transStatsData?.transactionStats?.sumRetraits?.toFixed(2) || '0.00'}`,
      currency: 'DH',
      subtitle: `Avg: ${statsData?.totalSolde?.average?.toFixed(2) || '0.00'} DH`,
      icon: TrendingDown,
      gradient: 'from-orange-500 to-red-600',
      glowColor: 'orange',
      change: '-3.1%',
      changePositive: false
    }
  ];
}

function renderCard(card, index) {
  return (
    <div
      key={index}
      className="group relative bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden"
    >
      {renderCardGlow(card.glowColor)}
      {renderCardContent(card)}
    </div>
  );
}

function renderCardGlow(color) {
  const glowColors = {
    cyan: 'from-cyan-500/20',
    emerald: 'from-emerald-500/20',
    orange: 'from-orange-500/20'
  };

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${glowColors[color]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
    </>
  );
}

function renderCardContent(card) {
  return (
    <div className="relative z-10">
      {renderCardHeader(card)}
      {renderCardStats(card)}
      {renderCardFooter(card)}
    </div>
  );
}

function renderCardHeader(card) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-xl`}>
        <card.icon className="w-6 h-6 text-white" />
      </div>
      {renderChangeBadge(card.change, card.changePositive)}
    </div>
  );
}

function renderChangeBadge(change, isPositive) {
  return (
    <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
      isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
    }`}>
      <svg className={`w-4 h-4 ${!isPositive && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      <span className="text-xs font-bold">{change}</span>
    </div>
  );
}

function renderCardStats(card) {
  return (
    <div className="space-y-2 mb-6">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {card.title}
      </p>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-black text-white">
          {card.value}
        </p>
        <span className="text-lg text-gray-400 font-bold">{card.currency}</span>
      </div>
    </div>
  );
}

function renderCardFooter(card) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
      <p className="text-sm text-gray-400 font-medium">
        {card.subtitle}
      </p>
      <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  );
}

export default Dashboard;