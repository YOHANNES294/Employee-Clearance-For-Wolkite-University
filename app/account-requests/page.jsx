"use client";
import { useState, useEffect } from 'react';

export default function AccountRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    staffType: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Convert filters to query string
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });

      const res = await fetch(`/api/account-requests?${query.toString()}`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Account Requests</h1>
      
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Name or email"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Staff Type</label>
          <select
            name="staffType"
            value={filters.staffType}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="academic">Academic</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req._id} className="border p-3 rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">{req.firstname} {req.lastname}</h3>
              <p>Staff ID: {req.staffId} | Type: {req.staffType}</p>
              <p>Dept: {req.departmentName} | Email: {req.email}</p>
              <p>Status: 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  req.status === 'approved' ? 'bg-green-100' :
                  req.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {req.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Requested: {new Date(req.requestedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}