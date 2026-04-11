import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useEcosystem = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to Accounts
    const qAccounts = query(collection(db, `users/${user.uid}/accounts`));
    const unsubscribeAccounts = onSnapshot(qAccounts, async (snapshot) => {
      const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Initialize defaults if empty
      if (accountsData.length === 0) {
        await initializeDefaultAccounts(user.uid);
      } else {
        setAccounts(accountsData);
      }
    });

    // Listen to Transactions
    const qTransactions = query(collection(db, `users/${user.uid}/transactions`));
    const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
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
    for (const acc of defaults) {
      await addDoc(collection(db, `users/${uid}/accounts`), acc);
    }
  };

  const addTransaction = async (data) => {
    if (!user) return;
    
    try {
      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, `users/${user.uid}/accounts`, data.accountId);
        const accountDoc = await transaction.get(accountRef);
        
        if (!accountDoc.exists()) throw "Account does not exist!";

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
    const accountRef = doc(db, `users/${user.uid}/accounts`, accountId);
    await updateDoc(accountRef, { balance: parseFloat(newBalance) });
  };

  return { accounts, transactions, loading, addTransaction, updateAccountBalance };
};
