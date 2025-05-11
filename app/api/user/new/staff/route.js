import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export async function GET() {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all users from the database
    const users = await User.find({ role: "STAFF" });

    // Return a success response with the users data
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return an error response
    return new Response("Failed to fetch users", { status: 500 });
  }
}


// const staffApproval = STAFFSTEPS;

export const PATCH = async (request) => {
  try {
    const { objectId, privilege,userId,director,blockNo } = await request.json();
  
    await connectToDB();
    // first fetch the steps
    
    
    // const editUser = await StepSchema.findOne({ userId:userId});
    //   // Fetch the user by userId
    
      const  updatedUser =(director && privilege) ?await User.findOneAndUpdate({ userId: userId }, { privilege:privilege,director:director })
                          :privilege ? await User.findOneAndUpdate({ userId: userId }, { privilege:privilege })
                          :director? await User.findOneAndUpdate({ userId: userId }, { director:director })
                          :await User.findOneAndUpdate({ userId: userId }, { blockNo:blockNo });
      

      if (!updatedUser) {
        return new Response("User not found", { status: 404 });
      }
  
      // Success message (optional)
    
  
      return new Response("Privilege updated successfully", { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Failed to update privilege", { status: 500 });
    }
   
 
};

