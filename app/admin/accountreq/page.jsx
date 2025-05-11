"use client";
import AdminContainer from "@/components/Admin/AdminContainer";
import AdminBreadcrumb from "@/components/Breadcrumb/adminBreadcrumb";
import useSWR from "swr";
import { useState } from "react";

const columns = [
  { field: "staffId", headerName: "Staff ID", width: "120" },
  { 
    field: "fullName", 
    headerName: "Full Name", 
    width: "240",
    valueGetter: (params) => `${params.row.firstname} ${params.row.middlename} ${params.row.lastname}`
  },
  { 
    field: "collegeDept", 
    headerName: "College/Dept", 
    width: "300",
    valueGetter: (params) => `${params.row.collegeName} / ${params.row.departmentName}\n${params.row.officeName} ${params.row.blockNo ? `(Block ${params.row.blockNo})` : ''}`
  },
  { 
    field: "contact", 
    headerName: "Contact", 
    width: "200",
    valueGetter: (params) => `${params.row.email}\n${params.row.telephone}`
  },
  { field: "staffType", headerName: "Type", width: "120" },
  { 
    field: "status", 
    headerName: "Status", 
    width: "120",
    renderCell: (params) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        params.value === 'approved' ? 'bg-green-100 text-green-800' :
        params.value === 'rejected' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {params.value}
      </span>
    )
  },
  {
    field: "actions",
    headerName: "Actions",
    width: "180",
    renderCell: (params) => (
      params.row.status === 'pending' && (
        <div className="flex gap-2">
          <button 
            onClick={() => handleStatusUpdate(params.row._id, 'approved')}
            className="bg-green-500 text-black px-2 py-1 rounded text-sm"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
            className="bg-red-500 text-black px-2 py-1 rounded text-sm"
          >
            Reject
          </button>
        </div>
      )
    )
  }
];

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.map(item => ({ ...item, id: item._id }));
};

const handleStatusUpdate = async (id, newStatus) => {
  try {
    const res = await fetch(`/api/admin/account-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Status update failed');
  } catch (error) {
    console.error("Status update failed:", error);
  }
};

const AccountRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const { data: requests, error, mutate } = useSWR(
    '/api/admin/account-requests',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 2000,
    }
  );

  const handleSendCredentials = async () => {
    try {
      const res = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          password: userPassword,
          email: recipientEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Credentials sent successfully");
        setUserId("");
        setUserPassword("");
        setRecipientEmail("");
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending credentials:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRequests = requests?.filter(request => 
    request.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    console.error("Error fetching requests:", error);
    return <p>Failed to load requests</p>;
  }

  if (!requests) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <AdminBreadcrumb
        title="Account Requests"
        mainRoute="Admin"
        subRoute="Account Requests"
      />
      
      <input
        type="text"
        placeholder="Search account requests..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full sm:hidden pt-4 pb-3 px-3 py-4 mb-7 rounded-md border border-stroke bg-gray text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
      />

      <div className="grid grid-cols-12">
        <div className="col-span-12 mb-6 p-4 border border-gray-200 rounded-md bg-white shadow">
          <h2 className="text-lg font-semibold mb-3">Send Credentials to Staff</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-auto"
            />
            <input
              type="text"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-auto"
            />
            <input
              type="email"
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-auto"
            />
            <button
              onClick={handleSendCredentials}
              disabled={!userId || !userPassword || !recipientEmail}
              className="bg-blue-600 text-primary px-4 py-2 rounded"
            >
              Send Email
            </button>
          </div>
        </div>

        <AdminContainer
          columns={columns}
          rows={filteredRequests}
          mutate={mutate}
        />
      </div>
    </>
  );
};

export default AccountRequestsPage;
