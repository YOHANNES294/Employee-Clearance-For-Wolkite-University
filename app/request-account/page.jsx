"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function RequestAccountPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    collegeName: '',
    departmentName: '',
    staffId: '',
    officeName: '',
    telephone: '',
    blockNo: '',
    staffType: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First Name is required';
    if (!formData.middlename.trim()) newErrors.middlename = 'Middle Name is required';
    if (!formData.staffId.trim()) newErrors.staffId = 'Staff ID is required';
    if (!formData.staffType) newErrors.staffType = 'Staff Type is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.telephone.trim()) newErrors.telephone = 'Telephone is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.telephone && !/^\+?\d{10,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Invalid phone format (e.g. +251XXXXXXXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/employee/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      toast.success('Request submitted successfully!');
      setFormData({
        firstname: '',
        middlename: '',
        lastname: '',
        collegeName: '',
        departmentName: '',
        staffId: '',
        officeName: '',
        telephone: '',
        blockNo: '',
        staffType: '',
        email: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Request Account For Administrator</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.firstname ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.middlename ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.middlename && <p className="text-red-500 text-sm">{errors.middlename}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg transition duration-300 focus:outline-none border-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Staff ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.staffId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.staffId && <p className="text-red-500 text-sm">{errors.staffId}</p>}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Telephone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Department Name</label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg transition duration-300 focus:outline-none border-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Office Name</label>
            <input
              type="text"
              name="officeName"
              value={formData.officeName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg transition duration-300 focus:outline-none border-gray-300"
            />
          </div>
        </div>

        {/* Staff Type */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium">
            Staff Type <span className="text-red-500">*</span>
          </label>
          <select
            name="staffType"
            value={formData.staffType}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition duration-300 focus:outline-none ${errors.staffType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a type</option>
            <option value="academic">Academic</option>
            <option value="admin">Admin</option>
          </select>
          {errors.staffType && <p className="text-red-500 text-sm">{errors.staffType}</p>}
        </div>

        {/* Submit Button and Sign In Link */}
        <div className="md:col-span-2 flex justify-between items-center mt-6">
          <div className="text-left">
            <p>
              <Link href="/signIn" className="text-blue-600">
                Already have an account? Sign In
              </Link>
            </p>
          </div>
          <div className="text-center">
  <button
    type="submit"
    disabled={isSubmitting}
    className="relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-primary font-semibold rounded-xl shadow-lg hover:from-pink-500 hover:to-indigo-500 transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="relative z-10">
      {isSubmitting ? 'Submitting...' : 'Submit Request'}
    </span>
    {/* Optional animated shine */}
    <span className="absolute inset-0 bg-gray opacity-100 rounded-xl blur-sm pointer-events-none transition-opacity duration-500 group-hover:opacity-100"></span>
  </button>
</div>

        </div>
      </form>
    </div>
  );
}
