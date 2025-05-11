"use client";
import { useEffect, useState } from 'react';
import RequestActions from '@/components/RequestActions';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/account-requests')
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Account Requests</h1>
      
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="border p-4 rounded-lg">
            <h3>{req.firstname} {req.lastname}</h3>
            <p>Email: {req.email}</p>
            <p>Status: 
              <span className={`ml-2 px-2 py-1 text-xs rounded ${
                req.status === 'approved' ? 'bg-green-100' :
                req.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {req.status}
              </span>
            </p>
            
            {/* Show action buttons or decision details */}
            {req.status === 'pending' ? (
              <RequestActions 
                requestId={req._id} 
                userEmail={req.email} 
              />
            ) : (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p><strong>Admin Reason:</strong> {req.adminReason}</p>
                <p className="text-sm text-gray-500">
                  Processed on: {new Date(req.processedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}