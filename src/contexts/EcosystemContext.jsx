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
import { db } from '../lib/firebase';
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
