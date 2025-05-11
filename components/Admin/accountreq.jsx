"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiChevronRight, FiLoader, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const fetcher = (url) => fetch(url).then((res) => res.json());

const AccountRequestPage = () => {
  const { data: requests, error, isLoading, mutate } = useSWR("/api/admin/account-requests", fetcher);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    reason: ""
  });

  const filteredRequests = requests
    ? requests.filter(request => 
        `${request.firstname} ${request.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.staffId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleApprove = async () => {
    if (!formData.username || !formData.password || !formData.reason) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`/api/admin/account-requests/${selectedRequest._id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Account approved and email sent!");
        mutate();
        setIsModalOpen(false);
        setFormData({ username: "", password: "", reason: "" });
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      toast.error(err.message || "Failed to approve account");
    }
  };

  // Error and Loading states remain the same as in your first component
  // ... (keep your existing error and loading states)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header and Search - keep your nice animated version */}
      {/* ... */}

      {/* Table - combine both versions */}
      <motion.div layout className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-300">
          <div className="col-span-2">Staff ID</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <AnimatePresence>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="col-span-2">{request.staffId}</div>
                  <div className="col-span-3">{request.firstname} {request.lastname}</div>
                  <div className="col-span-3">{request.email}</div>
                  <div className="col-span-2">{request.departmentName}</div>
                  <div className="col-span-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="p-8 text-center text-gray-500">
              No requests found
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Approval Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  Approve {selectedRequest?.firstname}'s Account
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500">
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Temporary Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter password"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Approval Message</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Enter approval message"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
                >
                  <FiCheck /> Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountRequestPage;