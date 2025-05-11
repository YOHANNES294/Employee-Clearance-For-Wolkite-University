import { connectToDB } from "@/utils/database";
import DynamicSteps from "@/models/DynamicSteps";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { KeyOutlined } from "@mui/icons-material";
export const POST = async (req) => {
  try {
    await connectToDB();
    const { steps, stepType, key, value } = await req.json();

    if (steps) {
      await populateSteps(steps, stepType);
    } else if (key && value) {
      const currentStep = new DynamicSteps({
        stepId: key + stepType,
        name: key,
        nextSteps: value,
        stepType,
      });
      await currentStep.save();
    }
    return new Response(`Request sent Successfully!`, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
//     + - * / = =0[]

// Helper function to iterate and create Step documents
async function populateSteps(data, stepType) {
  //   const keys = Object.keys(data);
  //console.log("dataa", data);
  for (const key in data) {

    
    if (data[key] != null ) {
   
      const currentStep = new DynamicSteps({
        stepId: key + stepType,
        name: key,
        nextSteps: data[key],
        stepType,
      });
      await currentStep.save();
    }

    // Recursively create documents for next steps
    //   if (data[key].length > 0) {
    //       await populateSteps(Object.fromEntries(data[key].map(step => [step, []])));
    //   }
  }
  // }
}

export const GET = async (request) => {

  // Parse the stepType from the URL query parameters
  const params = new URL(request.url).searchParams;
  const stepType = params.get("stepType");

  const session = await getServerSession(authOptions);
  const privilage = session?.user?.privilege;

  try {
    await connectToDB();
    if (stepType) {
      const requests = await DynamicSteps.find({ stepType: stepType });
      return new Response(JSON.stringify(requests), { status: 200 });
    } else {
      const requests = await DynamicSteps.find();
      return new Response(JSON.stringify(requests), { status: 200 });
    }

    // Return a success response with the users data
    // return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};

export const PATCH = async (request) => {
  try {
    const { key, value, stepType } = await request.json();
   
    await connectToDB();

    const updateSteps = await DynamicSteps.findOne({
      // stepType: stepType,
      name: key,
      stepType
    });

    if (updateSteps) {
      // updateSteps.name = key;
      updateSteps.nextSteps = value;
      updateSteps.stepType = stepType;
      await updateSteps.save();

      return new Response(`Staff updated successfully`, {
        status: 201,
      });
    } else {
      return new Response("Request not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Failed to modify the steps", { status: 500 });
  }
};
