import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const PATCH = async (request) => {
  let message = "";
  try {
    const { objectId } = await request.json();

    await connectToDB();

    const existingRequest = await User.findById(objectId);

    if (existingRequest) {
      if (existingRequest.status === "active") {
        existingRequest.status = "inactive";
        message = "Request has been deactivated successfully";
      } else {
        existingRequest.status = "active";
        message = "Request has been activated successfully";
      }

      await existingRequest.save();

      return new Response(`${message}`, {
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