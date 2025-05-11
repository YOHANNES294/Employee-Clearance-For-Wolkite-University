"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function RequestAccountForm() {
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    staffId: '',
    staffType: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/employee/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.isValid) {
        throw new Error(data.message);
      }

      toast.success("Request submitted successfully!");
      setFormData({
        firstname: '',
        middlename: '',
        staffId: '',
        staffType: '',
        email: ''
      });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}