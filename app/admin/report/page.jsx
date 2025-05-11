"use client";
import AdminBreadcrumb from "@/components/Breadcrumb/adminBreadcrumb";
import ClearanceNums from "@/components/Report/ClearanceNums";
import ReasonStaffReports from "@/components/Report/ReasonStaffReports";
import ClearanceStatusDetail from "@/components/Report/clearanceStatusDetail";
import React, { useEffect, useState } from "react";

const ManageReport = () => {
  const [reasonReport, setReasonReport] = useState([]);
  const [academicStaff, setAcademicStaff] = useState([]);
  const [adminStaff, setAdminStaff] = useState([]);
  const [academicStaffReason, setAcademicStaffReason] = useState([]);
  const [adminStaffReason, setAdminStaffReason] = useState([]);
  const [staffClearance, setStaffClearance] = useState([]);

  useEffect(() => {
    const fetchReasonReports = async () => {
      try {
        const response = await fetch("/api/approvalHistory/reasonReport");
        const data = await response.json();

        if (response.ok) {
          const academic = data.filter((item) => item.staffType === "ACADEMIC");
          const admin = data.filter((item) => item.staffType === "ADMIN");
          setAcademicStaffReason(academic);
          setAdminStaffReason(admin);
          setReasonReport(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReasonReports();
  }, [reasonReport, academicStaffReason, adminStaffReason]);

  useEffect(() => {
    const fetchAllStaffReqs = async () => {
      try {
        const response = await fetch("/api/staffApproval/allStaffReq");
        const data = await response.json();

        if (response.ok) {
          // Filter academic and admin staff
          const academic = data.filter((item) => item.staffType === "ACADEMIC");
          const admin = data.filter((item) => item.staffType === "ADMIN");

          setStaffClearance(data);
          // Set the filtered arrays
          setAcademicStaff(academic);
          setAdminStaff(admin);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllStaffReqs();
  }, []);

  //Total Clearances on Process
  const staffOnProcess = staffClearance.filter(
    (item) => item.status != "APPROVED"
  );
  const onProcess = staffOnProcess.length;

  //Total Rejected Clearances
  const currentlyRejectedStaffs = staffClearance.filter(
    (item) => item.rejections.length > 0
  ).length;

  const rejectedTotal = currentlyRejectedStaffs;

  return (
    <div>
      <AdminBreadcrumb title="Reports" mainRoute="Admin" subRoute="Reports" />
      <ClearanceNums
        rejectedTotal={rejectedTotal}
        onProcessTotal={onProcess}
        approvedNum={reasonReport.length}
      />
      <div class="col-span-12 row-span-6 xl:col-span-6">
        <ClearanceStatusDetail
          title="academic staffs"
          clearance={academicStaff}
        />
        <ClearanceStatusDetail title="admin staffs" clearance={adminStaff} />
        <ReasonStaffReports title="academic" reason={academicStaffReason} />
        <ReasonStaffReports title="admin" reason={adminStaffReason} />
      </div>
      <div class="col-span-12 row-span-6 xl:col-span-6"></div>
    </div>
  );
};

export default ManageReport;