"use client";
import { useState } from 'react';

export default function RequestActions({ requestId, userEmail }) {
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleActionClick = (type) => {
    setActionType(type);
    setShowReasonInput(true);
  };

  const handleSubmitReason = async () => {
    setIsSending(true);
    try {
      // Send to your API endpoint
      const response = await fetch(`/api/admin/account-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: actionType,
          reason: reason
        })
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      alert(`Action completed! Email sent to ${userEmail}`);
      setShowReasonInput(false);
      setReason('');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {!showReasonInput ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleActionClick('approved')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleActionClick('rejected')}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Enter reason for ${actionType}...`}
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitReason}
              disabled={isSending}
              className={`px-4 py-2 rounded text-white ${
                actionType === 'approved' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isSending ? 'Sending...' : `Confirm ${actionType}`}
            </button>
            <button
              onClick={() => setShowReasonInput(false)}
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