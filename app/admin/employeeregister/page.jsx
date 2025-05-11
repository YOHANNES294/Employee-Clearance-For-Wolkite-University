import EmployeeRegisterForm from '@/components/EmployeeRegisterForm';
import EmployeeList from '@/components/EmployeeList';

export default function EmployeeRegisterPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Register New Employee</h2>
          <EmployeeRegisterForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Employee Records</h2>
          <EmployeeList />
        </div>
      </div>
    </div>
  );
}