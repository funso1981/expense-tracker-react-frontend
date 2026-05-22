import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, DollarSign, Tag, Calendar } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(true);

  //const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;
  // New Live Azure Configuration
const API_URL = 'https://expense-tracker-api-funso.azurewebsites.net/api/expenses';

  // 1. READ: Fetch expenses on component load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  // 2. CREATE: Submit a new expense form
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount: parseFloat(amount), category }),
      });

      if (response.ok) {
        // Reset form input values
        setTitle('');
        setAmount('');
        setCategory('Food');
        // Refresh local state lists
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // 3. DELETE: Remove an expense line item
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Calculate total balance value dynamically
  const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>💰 ExpenseTracker<span style={styles.accent}>.io</span></h1>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total Tracked Expenses</span>
          <h2 style={styles.totalAmount}>€{totalExpenses.toFixed(2)}</h2>
        </div>
      </header>

      <main style={styles.mainLayout}>
        {/* Left Side: Creation Form */}
        <section style={styles.formSection}>
          <h3 style={styles.sectionTitle}>Add New Transaction</h3>
          <form onSubmit={handleAddExpense} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Expense Title</label>
              <input 
                type="text" 
                placeholder="e.g., Azure Server Hosting" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input} 
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (€)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input} 
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              >
                <option value="Food">Food & Dining</option>
                <option value="Utilities">Utilities & Bills</option>
                <option value="Development">Cloud & Development</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <button type="submit" style={styles.submitBtn}>
              <PlusCircle size={18} style={{ marginRight: '8px' }} /> Add Expense
            </button>
          </form>
        </section>

        {/* Right Side: Expense List Items */}
        <section style={styles.listSection}>
          <h3 style={styles.sectionTitle}>Transaction History</h3>
          {loading ? (
            <p style={styles.statusMsg}>Waking up serverless database partitions...</p>
          ) : expenses.length === 0 ? (
            <p style={styles.statusMsg}>No transactions found. Add one to get started!</p>
          ) : (
            <div style={styles.listContainer}>
              {expenses.map((expense) => (
                <div key={expense.id} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <h4 style={styles.cardTitle}>{expense.title}</h4>
                    <div style={styles.metaRow}>
                      <span style={styles.metaBadge}><Tag size={12} style={{marginRight: '4px'}}/> {expense.category}</span>
                      <span style={styles.metaDate}><Calendar size={12} style={{marginRight: '4px'}}/> {new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={styles.cardAmount}>-€{parseFloat(expense.amount).toFixed(2)}</span>
                    <button onClick={() => handleDeleteExpense(expense.id)} style={styles.deleteBtn} title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Modern UI Inline CSS Stylesheet
const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '0 0 40px 0', color: '#333' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', borderBottom: '1px solid #eef2f5' },
  logo: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 },
  accent: { color: '#2563eb' },
  summaryCard: { textAlign: 'right' },
  summaryLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', tracking: '0.05em' },
  totalAmount: { fontSize: '28px', fontWeight: '800', color: '#ef4444', margin: '4px 0 0 0' },
  mainLayout: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4px', maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 20px' },
  formSection: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #eef2f5', height: 'fit-content' },
  listSection: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #eef2f5' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#475569' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', transition: 'border 0.2s' },
  submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  statusMsg: { textAlign: 'center', color: '#64748b', padding: '40px 0', fontSize: '15px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', transition: 'transform 0.15s' },
  cardLeft: { display: 'flex', flexDirection: 'column', gap: '6px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  metaRow: { display: 'flex', gap: '16px', alignItems: 'center' },
  metaBadge: { display: 'inline-flex', alignItems: 'center', fontSize: '11px', backgroundColor: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' },
  metaDate: { display: 'inline-flex', alignItems: 'center', fontSize: '12px', color: '#94a3b8' },
  cardRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  cardAmount: { fontSize: '18px', fontWeight: '700', color: '#1e293b' },
  deleteBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' },
};

export default App;