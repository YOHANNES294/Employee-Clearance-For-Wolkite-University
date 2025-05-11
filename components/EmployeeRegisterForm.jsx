'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeeRegisterForm() {
  const [form, setForm] = useState({
    firstname: '',
    middlename: '',
    staffId: '',
    staffType: 'Academic'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeField, setActiveField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setMessage({ 
        type: 'success', 
        text: 'Employee registered successfully!' 
      });
      setForm({
        firstname: '',
        middlename: '',
        staffId: '',
        staffType: 'Academic'
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto p-6 bg-gray rounded-xl shadow-md"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Employee Registration
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {message.text && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onFocus={() => setActiveField('firstname')}
            onBlur={() => setActiveField(null)}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <motion.input
              type="text"
              value={form.firstname}
              onChange={(e) => setForm({...form, firstname: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              animate={{
                borderColor: activeField === 'firstname' ? '#3b82f6' : '#d1d5db'
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onFocus={() => setActiveField('middlename')}
            onBlur={() => setActiveField(null)}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <motion.input
              type="text"
              value={form.middlename}
              onChange={(e) => setForm({...form, middlename: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              animate={{
                borderColor: activeField === 'middlename' ? '#3b82f6' : '#d1d5db'
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onFocus={() => setActiveField('staffId')}
            onBlur={() => setActiveField(null)}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff ID *
            </label>
            <motion.input
              type="text"
              value={form.staffId}
              onChange={(e) => setForm({...form, staffId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              animate={{
                borderColor: activeField === 'staffId' ? '#3b82f6' : '#d1d5db'
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onFocus={() => setActiveField('staffType')}
            onBlur={() => setActiveField(null)}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Type *
            </label>
            <motion.select
              value={form.staffType}
              onChange={(e) => setForm({...form, staffType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
              required
              animate={{
                borderColor: activeField === 'staffType' ? '#3b82f6' : '#d1d5db'
              }}
            >
              <option value="Academic">Academic</option>
              <option value="Admin">Admin</option>
            </motion.select>
          </motion.div>
        </div>

        <motion.button
  type="submit"
  className="w-full py-3 px-6 bg-gray text-primary rounded-lg font-medium shadow-md"
  whileHover={{ 
    scale: 1.03,
    backgroundColor: "#0000" // Slightly lighter black on hover
  }}
  whileTap={{ 
    scale: 0.97 
  }}
>
  Register Employee
</motion.button>
      </form>
    </motion.div>
  );
}