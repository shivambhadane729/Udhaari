import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './AuthContext';

const EcosystemContext = createContext();

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};

export const EcosystemProvider = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (!isFirebaseConfigured) {
      // Local Storage Mode
      const localAccountsKey = `udhaari_accounts_${user.uid}`;
      const localTransactionsKey = `udhaari_transactions_${user.uid}`;

      let accountsData = [];
      try {
        const stored = localStorage.getItem(localAccountsKey);
        if (stored) accountsData = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse accounts from localStorage", e);
      }

      if (accountsData.length === 0) {
        accountsData = [
          { id: 'acc-1', name: 'Main Bank', balance: 12500, type: 'bank', icon: 'account_balance' },
          { id: 'acc-2', name: 'Cash', balance: 1500, type: 'cash', icon: 'payments' },
          { id: 'acc-3', name: 'Savings', balance: 5000, type: 'savings', icon: 'savings' }
        ];
        localStorage.setItem(localAccountsKey, JSON.stringify(accountsData));
      }
      setAccounts(accountsData);

      let transactionsData = [];
      try {
        const stored = localStorage.getItem(localTransactionsKey);
        if (stored) transactionsData = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse transactions from localStorage", e);
      }

      if (transactionsData.length === 0) {
        transactionsData = [
          {
            id: 'trans-1',
            title: 'Office Supplies',
            amount: 450,
            category: 'Other',
            accountId: 'acc-2',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
          },
          {
            id: 'trans-2',
            title: 'AWS Cloud Hosting',
            amount: 2499,
            category: 'Subscription',
            accountId: 'acc-1',
            date: new Date().toISOString().split('T')[0]
          }
        ];
        localStorage.setItem(localTransactionsKey, JSON.stringify(transactionsData));
      }
      setTransactions(transactionsData);
      setLoading(false);

      return;
    }

    // Firebase Mode
    // Listen to Accounts
    const qAccounts = query(collection(db, `users/${user.uid}/accounts`));
    const unsubscribeAccounts = onSnapshot(qAccounts, (snapshot) => {
      const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (accountsData.length === 0) {
        initializeDefaultAccounts(user.uid);
      } else {
        setAccounts(accountsData);
      }
    }, (error) => {
      console.error("Accounts subscription error:", error);
    });

    // Listen to Transactions
    const qTransactions = query(collection(db, `users/${user.uid}/transactions`));
    const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedData = transactionsData.sort((a, b) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return dateB - dateA;
      });
      setTransactions(sortedData);
      setLoading(false);
    }, (error) => {
      console.error("Transactions subscription error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeTransactions();
    };
  }, [user]);

  const initializeDefaultAccounts = async (uid) => {
    const defaults = [
      { name: 'Main Bank', balance: 0, type: 'bank', icon: 'account_balance' },
      { name: 'Cash', balance: 0, type: 'cash', icon: 'payments' },
      { name: 'Savings', balance: 0, type: 'savings', icon: 'savings' }
    ];
    try {
      for (const acc of defaults) {
        await addDoc(collection(db, `users/${uid}/accounts`), acc);
      }
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  const addTransaction = async (data) => {
    if (!user) return;
    
    if (!isFirebaseConfigured) {
      const localAccountsKey = `udhaari_accounts_${user.uid}`;
      const localTransactionsKey = `udhaari_transactions_${user.uid}`;

      const updatedAccounts = accounts.map(acc => {
        if (acc.id === data.accountId) {
          return { ...acc, balance: acc.balance - data.amount };
        }
        return acc;
      });

      const newTrans = {
        id: `trans-${Date.now()}`,
        ...data,
        userId: user.uid,
        date: data.date || new Date().toISOString().split('T')[0]
      };
      const updatedTransactions = [newTrans, ...transactions];

      localStorage.setItem(localAccountsKey, JSON.stringify(updatedAccounts));
      localStorage.setItem(localTransactionsKey, JSON.stringify(updatedTransactions));

      setAccounts(updatedAccounts);
      setTransactions(updatedTransactions);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, `users/${user.uid}/accounts`, data.accountId);
        const accountDoc = await transaction.get(accountRef);
        
        if (!accountDoc.exists()) throw new Error("Account does not exist!");

        const newBalance = accountDoc.data().balance - data.amount;
        
        // Add Transaction
        const transRef = collection(db, `users/${user.uid}/transactions`);
        await addDoc(transRef, {
          ...data,
          userId: user.uid,
          createdAt: serverTimestamp()
        });

        // Update Account Balance
        transaction.update(accountRef, { balance: newBalance });
      });
    } catch (e) {
      console.error("Transaction failed: ", e);
      throw e;
    }
  };

  const updateAccountBalance = async (accountId, newBalance) => {
    if (!user) return;

    if (!isFirebaseConfigured) {
      const localAccountsKey = `udhaari_accounts_${user.uid}`;
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === accountId) {
          return { ...acc, balance: parseFloat(newBalance) };
        }
        return acc;
      });

      localStorage.setItem(localAccountsKey, JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
      return;
    }

    try {
      const accountRef = doc(db, `users/${user.uid}/accounts`, accountId);
      await updateDoc(accountRef, { balance: parseFloat(newBalance) });
    } catch (err) {
      console.error("Update balance error:", err);
      throw err;
    }
  };

  const value = {
    accounts,
    transactions,
    loading,
    addTransaction,
    updateAccountBalance
  };

  return (
    <EcosystemContext.Provider value={value}>
      {children}
    </EcosystemContext.Provider>
  );
};
