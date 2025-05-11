/*import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ROLES } from "@/utils/constants";
import StaffClearnceReq from "@/models/staffClearanceRequest";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const id = session?.user?.userId;
  const role = session?.user?.role;
  try {
    await connectToDB();
    let request;
    if (role !== ROLES.ADMIN) {
      request = await StaffClearnceReq.find({ userId: id });
    }

    // Return a success response with the users data
    return new Response(JSON.stringify(request), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};*/
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import StaffClearnceReq from "@/models/staffClearanceRequest";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const id = session?.user?.userId;

  try {
    await connectToDB();

    const request = await StaffClearnceReq.find({ userId: id });

    return new Response(JSON.stringify(request), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return new Response("Failed to fetch requests", { status: 500 });
  }
};
