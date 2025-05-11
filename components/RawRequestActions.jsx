"use client";
import { useState } from 'react';

export default function RawRequestActions({ requestId }) {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState('');
  const [rawReason, setRawReason] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/account-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          reason: rawReason // Sends exactly what you typed
        })
      });
      if (!res.ok) throw new Error('Failed');
      alert('Done! Email sent with your exact message.');
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {!showForm ? (
        <div className="flex gap-2">
          <button
            onClick={() => { setAction('approved'); setShowForm(true); }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => { setAction('rejected'); setShowForm(true); }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <textarea
            value={rawReason}
            onChange={(e) => setRawReason(e.target.value)}
            placeholder={`Type your exact message for ${action}...`}
            className="w-full p-2 border rounded"
            rows={5}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSending}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isSending ? 'Sending...' : `Send ${action} Email`}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}