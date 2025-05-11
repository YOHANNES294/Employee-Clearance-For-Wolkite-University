import { connectToDB } from "@/utils/database";
import StaffRequestSchema from "@/models/staffClearanceRequest";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
import DynamicSteps from "@/models/DynamicSteps";
import { FamilyRestroomOutlined } from "@mui/icons-material";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const privilege = session?.user?.privilege;
  const id = session?.user?.userId;
  const collegeName = session?.user?.collegeName;
  const departmentName = session?.user?.departmentName;
  // const director = session?.user?.director;
  let director;

  try {
    await connectToDB();

    // first fetch myprofile to get the director name
    const myprofile = await User.find({ userId: id });
    if (myprofile.length == 0) {
      return new Response("User not found", { status: 404 });
    }

    director = myprofile[0]?.director;
    const staffType = myprofile[0]?.staffType;
    // let steps = {};
    // fetch steps
    //   const stepRequests = await DynamicSteps.find({ stepType: staffType });
    //  console.log("stepRequests", stepRequests);
    //   if (stepRequests) {
    //     stepRequests.forEach((data, index) => {
    //       steps[data.name] = data.nextSteps;
    //     });
    //   }

    //   let stageKeys = [];
    //   Object.keys(steps).forEach((key) => {
    //     if (steps[key].includes(privilege)) {
    //       stageKeys.push(key);
    //     }
    //   });

    const forApprovals = await StaffRequestSchema.find({
      status: privilege,
      userId: { $ne: id },
    });

    const requests = [];
    for (const approvalEntry of forApprovals) {
      let steps = {};
      // console.log(approvalEntry,"approvalEntry stafftype", approvalEntry.staffType);
      const stepRequests = await DynamicSteps.find({
        stepType: approvalEntry.staffType,
      });
      //  console.log("stepRequests", stepRequests);
      if (stepRequests) {
        stepRequests.forEach((data, index) => {
          steps[data.name] = data.nextSteps;
        });
      }

      let stageKeys = [];
      Object.keys(steps).forEach((key) => {
        if (steps[key].includes(privilege)) {
          stageKeys.push(key);
        }
      });

      let allStageKeysInApprovals = false;
      let inRejections = false;

      const approvals = approvalEntry.approvals.map(
        (approval) => approval.role
      );
      const rejected = approvalEntry.rejections;

      const userFromRequests = approvalEntry.userId;
      // Check if all stage keys are present in the approvals for this user
      allStageKeysInApprovals = stageKeys.every((key) =>
        approvals.includes(key)
      );

      inRejections = rejected.includes(privilege);

      if (stageKeys.includes("Director")) {
        // remove from stageKeys
        stageKeys = stageKeys.filter((key) => key !== "Director");
      }
      if (stageKeys.length == 0) {
        allStageKeysInApprovals = true;
      }

      const query = {
        status: privilege,
        userId: { $ne: id },
        userId: userFromRequests,
        // 'approvals': { $all: stageKeys }
      };

      // console.log("allStageKeysInApprovals", allStageKeysInApprovals, "inRejections", !inRejections, "query", query);
      //console.log(approvalEntry.firstname,"stageKeys", stageKeys,"approvals",approvals);
      let userRequests = [];
      if (approvalEntry.director && privilege == approvalEntry.director && !inRejections) {
        userRequests = await StaffRequestSchema.find(query);
      } else if (director && allStageKeysInApprovals && !inRejections) {
        userRequests = await StaffRequestSchema.find(query);
      } else if (
        allStageKeysInApprovals &&
        !inRejections &&
        collegeName &&
        (privilege == "College Dean" || privilege == "College Registrar")
      ) {
        userRequests = await StaffRequestSchema.find({
          status: privilege,
          userId: { $ne: id },
          collegeName: collegeName,
          userId: userFromRequests,
        });
      } else if (
        allStageKeysInApprovals &&
        !inRejections &&
        departmentName &&
        privilege == "Head"
      ) {
        userRequests = await StaffRequestSchema.find({
          status: privilege,
          userId: { $ne: id },
          departmentName: departmentName,
          userId: userFromRequests,
        });
      } else if (allStageKeysInApprovals && !inRejections) {
        userRequests = await StaffRequestSchema.find({
          status: privilege,
          userId: { $ne: id },
          userId: userFromRequests,
        });
      }

      // Concatenate the requests for this user to the overall requests list
      requests.push(...userRequests);
    }

    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};
