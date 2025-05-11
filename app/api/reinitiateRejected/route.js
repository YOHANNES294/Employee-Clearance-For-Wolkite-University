import { connectToDB } from "@/utils/database";
import StaffClearnceReq from "@/models/staffClearanceRequest";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const PATCH = async (request) => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  try {
    const { objectId, reinitiate } = await request.json();
    let existingRequest = [];
    await connectToDB();
    if (role == "STAFF") {
      existingRequest = await StaffClearnceReq.findById(objectId);
    }
    if (existingRequest !== null) {
      existingRequest.rejections = existingRequest.rejections.filter(
        (item) => item !== reinitiate
      );

      await existingRequest.save();
      return new Response(JSON.stringify(existingRequest), { status: 201 });
    } else {
      return new Response("Request not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Failed to reinitate the request", { status: 500 });
  }
};