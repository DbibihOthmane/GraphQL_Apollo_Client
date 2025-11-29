import { TypeCompte, TypeTransaction } from './types';

// Interface pour un compte
export interface Compte {
  id: string;
  solde: number;
  dateCreation: string;
  type: typeof TypeCompte[keyof typeof TypeCompte];
}

// Interface pour une transaction
export interface Transaction {
  id: string;
  type: typeof TypeTransaction[keyof typeof TypeTransaction];
  montant: number;
  date: string;
  compte: Compte;
}

// Interface pour les statistiques de solde
export interface SoldeStats {
  count: number;
  sum: number;
  average: number;
}

// Interface pour les statistiques de transaction
export interface TransactionStats {
  count: number;
  sumDepots: number;
  sumRetraits: number;
}

// Interface pour les demandes de création de compte
export interface CompteRequest {
  solde: number;
  type: typeof TypeCompte[keyof typeof TypeCompte];
}

// Interface pour les demandes de création de transaction
export interface TransactionRequest {
  type: typeof TypeTransaction[keyof typeof TypeTransaction];
  montant: number;
  compteId: string;
}