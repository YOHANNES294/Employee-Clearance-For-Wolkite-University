'use client';
import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editData, setEditData] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employee');
        const data = await res.json();
        setEmployees(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle CSV Import
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      // Process imported data
      const processed = jsonData.map(item => ({
        firstname: item['First Name'] || '',
        middlename: item['Middle Name'] || '',
        staffId: item['Staff ID'] || '',
        staffType: item['Type'] || 'Academic'
      }));
      
      setEmployees([...employees, ...processed]);
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const res = await fetch('/api/employee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        setEmployees(employees.filter(emp => emp._id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => 
    `${emp.firstname} ${emp.middlename}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CSV Export Function
  const exportToCSV = () => {
    const headers = ['First Name', 'Middle Name', 'Staff ID', 'Type', 'Created At'];
    const csvRows = [
      headers.join(','),
      ...filteredEmployees.map(emp => 
        [
          `"${emp.firstname}"`,
          `"${emp.middlename || ''}"`,
          `"${emp.staffId}"`,
          `"${emp.staffType}"`,
          `"${new Date(emp.createdAt).toLocaleDateString()}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="px-4 py-2 border border-white-700 rounded-md w-full sm:w-64 bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-800 hover:bg-gray-700 text-primary px-4 py-2 rounded-md shadow-sm transition-colors duration-200 w-full sm:w-auto"
          >
            Import CSV
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
          </button>
          <button
            onClick={exportToCSV}
            className="bg-gray-800 hover:bg-gray-700 text-primary px-4 py-2 rounded-md shadow-sm transition-colors duration-200 w-full sm:w-auto"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-900 p-8 rounded-lg flex justify-center">
          <p className="text-gray-300">Loading employees...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Staff ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {emp.firstname} {emp.middlename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{emp.staffId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      emp.staffType === 'Academic' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-600 text-gray-200'
                    }`}>
                      {emp.staffType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setEditData(emp)}
                      className="text-gray-400 hover:text-white font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-gray-400 hover:text-white font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}