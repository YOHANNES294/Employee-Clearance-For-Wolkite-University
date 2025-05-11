import { connectToDB } from "@/utils/database";
import StaffClearnceReq from "@/models/staffClearanceRequest";
import { STAFFSTEPS } from "@/utils/constants";
import StepSchema from "@/models/step";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import DynamicSteps from "@/models/DynamicSteps";
import History from "@/models/history";

// const staffApproval = STAFFSTEPS;
let staffApproval;

export const PATCH = async (request) => {
  let stepType="";
  let step ={};
  const session = await getServerSession(authOptions);
  const privilege = session?.user?.privilege;
  try {
    const { objectId, arrLength } = await request.json();

    await connectToDB();
    const existingRequest = await StaffClearnceReq.findById(objectId);

    if (existingRequest && existingRequest.staffType == "ACADEMIC") {
      stepType = "ACADEMIC";
      const requests = await DynamicSteps.find({stepType: stepType});
     
       
         requests.forEach((data, index) => {
          step[data.name] = data.nextSteps;
         }
       );
      }else if (existingRequest && existingRequest.staffType == "ADMIN") {
        stepType = "ADMIN";
        const requests = await DynamicSteps.find({stepType: stepType});
       
         
          requests.forEach((data, index) => {
            step[data.name] = data.nextSteps;
          }
        );
      }



// FETCH ACEDEMIC STEPS

   


   


   

    

    if (existingRequest && existingRequest.staffType == "ACADEMIC") {
      const currentStatus = existingRequest.status;
      const nextApprovers = step[privilege];

      const approvalTime = new Date(); // Get the current time for approval

      if (!existingRequest.approvals) {
        existingRequest.approvals = []; // Initialize approvals array if it doesn't exist
      }

      if (Array.isArray(currentStatus) && currentStatus.length > 1) {
        existingRequest.approvals.push({ role: privilege, time: approvalTime });
        if (currentStatus.indexOf(nextApprovers[0]) == -1) {
          currentStatus.push(nextApprovers[0]);
        }
        const newStatus = currentStatus.filter((item) => item !== privilege);
        existingRequest.status = newStatus;
      } else if (nextApprovers && nextApprovers.length == 1) {
        // console.log("nextApprovers", nextApprovers);
        existingRequest.status = nextApprovers[0];
        existingRequest.approvals.push({ role: privilege, time: approvalTime });
      } else if (nextApprovers && nextApprovers.length > 1) {
        existingRequest.status = nextApprovers;
        existingRequest.approvals.push({ role: privilege, time: approvalTime });
      }

      await existingRequest.save();

      // Create new document in History collection if status is APPROVED
      if (existingRequest.status.includes("APPROVED")) {
      
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });

        const clearanceReq = new History({
          userId: existingRequest.userId,
          firstname: existingRequest.firstname,
          middlename: existingRequest.middlename,
          reason: existingRequest.reason,
          status: "APPROVED",
          role: existingRequest.role,
          dateApproved: formattedDate,
          dateRequested: existingRequest.dateRequested,
          clearanceId: existingRequest._id,
          staffType: existingRequest.staffType,
        });
        await clearanceReq.save();
      }
      console.log("history created successfully");
      return new Response(`Approved successfully ${arrLength} requests`, {
        status: 201,
      });
    } else if (existingRequest && existingRequest.staffType == "ADMIN") {
      const currentStatus = existingRequest.status;
      const approvalRoles = existingRequest.approvals.map(
        (approval) => approval.role
      );

      //if existingRequest.director is inside existingRequest.approvals.role concatinate nextapprover with adminStep[director]
      let nextApprovers;
      function isDirectorInApprovals() {
        for (let approval of existingRequest.approvals) {
          if (approval.role === existingRequest.director) {
            return true; // If found, return true
          }
        }
        return false; // If not found, return false
      }
      const isDirectorApproved = isDirectorInApprovals();
      if (!isDirectorApproved) {
        if (step["Director"].includes(existingRequest.director)) {
          nextApprovers = step["Director"].filter(
            (role) => role !== existingRequest.director
          );
   
          nextApprovers = nextApprovers.concat(
            step[existingRequest.director]
          );
         
        } else {
          nextApprovers = step[privilege].concat(step["Director"]);
          
        }
      } else {
        // console.log("Director is approved");
        nextApprovers = step[privilege];
      }

      const approvalTime = new Date(); // Get the current time for approval

      if (Array.isArray(currentStatus) && currentStatus.length > 1) {
        existingRequest.approvals.push({
          role: privilege,
          time: approvalTime,
        });

        nextApprovers = nextApprovers.filter(
          (role) => !approvalRoles.includes(role)
        );

        if (
          nextApprovers.length > 0 &&
          currentStatus.indexOf(nextApprovers[0]) == -1
        ) {
          currentStatus.push(nextApprovers[0]);
        }
        const newStatus = currentStatus.filter((item) => item !== privilege);
        existingRequest.status = newStatus;
      } else if (nextApprovers && nextApprovers.length == 1) {
        existingRequest.status = nextApprovers[0];
        existingRequest.approvals.push({
          role: privilege,
          time: approvalTime,
        });
      } else if (nextApprovers && nextApprovers.length > 1) {
        existingRequest.status = nextApprovers;
        existingRequest.approvals.push({
          role: privilege,
          time: approvalTime,
        });
      }

      await existingRequest.save();

      // Create new document in History collection if status is APPROVED
      if (existingRequest.status.includes("APPROVED")) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });

        const clearanceReq = new History({
          userId: existingRequest.userId,
          firstname: existingRequest.firstname,
          middlename: existingRequest.middlename,
          reason: existingRequest.reason,
          status: "APPROVED",
          role: existingRequest.role,
          dateApproved: formattedDate,
          dateRequested: existingRequest.dateRequested,
          clearanceId: existingRequest._id,
        });
        await clearanceReq.save();
      }

      return new Response(`Approved successfully ${arrLength} requests`, {
        status: 201,
      });
    } else {
      return new Response("Request not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Failed to update the request status", { status: 500 });
  }
};
