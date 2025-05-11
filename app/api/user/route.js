import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export async function GET() {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all users from the database
    const users = await User.find({});

    // Count users with specific roles or types
    const academicStaffCount = users.filter(
      (user) => user.staffType === "ACADEMIC"
    ).length;
    const adminStaffCount = users.filter(
      (user) => user.staffType === "ADMIN"
    ).length;

    const totalRequester = users.filter((user) => user.role !== "ADMIN").length;
    const totalApprovers = users.filter(
      (user) => user.privilege != null
    ).length;

    // Calculate total number of users
    const totalUsers = users.length;

    // Return a success response with the counts
    const responseData = {
      totalUsers,
      academicStaffCount,
      adminStaffCount,
      totalRequester,
      totalApprovers,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return an error response
    return new Response("Failed to fetch users", { status: 500 });
  }
}