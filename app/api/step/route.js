
import { connectToDB } from "@/utils/database";
import StepSchema from "@/models/step";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async (request) => {
  // Parse the stepType from the URL query parameters
  const params = new URL(request.url).searchParams;
  const stepType = params.get("stepType");

  const session = await getServerSession(authOptions);
  const privilage = session?.user?.privilege;
  // console.log("sendtoapi", stepType);

  // console.log("session from studentApproval ", session?.user?.privilege)
  try {

    await connectToDB();

    const requests = await StepSchema.find({ stepType });


    // Return a success response with the users data
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};



export const PATCH = async (request) => {
  try {
    const { stepType, updatedSteps } = await request.json();
 
    await connectToDB();

    const updateSteps = await StepSchema.findOne({ stepType: stepType });

    if (updateSteps) {
      updateSteps.steps = updatedSteps;
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





export const POST = async (req) => {
  const { stepType, steps } = await req.json();

  // await connectToDB();
  const requests = await StepSchema.find({ stepType: stepType });

  if (requests.length > 0 && requests != null) {
    return new Response(
      `Cannot request clearance. An active request is already in progress`,
      { status: 201 }
    );
  }


  try {
    await connectToDB();
    const stepReq = new StepSchema({
      steps: steps
    });

    await stepReq.save();
    return new Response(`Request sent Successfully!`, {
      status: 201,
    });
  } catch (error) {
    console.error("Error on requseting clearance:", error);
    return new Response("Failed to requset new clearance", {
      status: 500,
    });
  }
};

