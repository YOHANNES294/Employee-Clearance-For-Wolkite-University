
// import { connectToDB } from "@/utils/database";
// import User from "@/models/user";


// export const GET = async (request, { params }) => {
//   try {
//     // Get the user session
//     // const session = await getServerSession();
//     // console.log("session from studentApproval", session?.user?.privilege);

//     await connectToDB();

//     // Uncomment the following line if you want to use clearanceId from params
//     // const clearanceId = params.id;

//     // Or if you want to use clearanceId from request.query, uncomment the following line
//     // const { clearanceId } = request.query;

//     // Log the clearanceId
//      console.log("staffUserId", params.id );

//     const requests = await User.find({ userId: params.id });

//     // Return a success response with the users data
//     return new Response(JSON.stringify(requests), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     // Return an error response
//     return new Response("Failed to fetch requests", { status: 500 });
//   }
// };
// import { connectToDB } from "@/utils/database";
// import User from "@/models/user";

// export const GET = async (request, { params }) => {
//   try {
//     // Get the user session
//     // const session = await getServerSession();
//     // console.log("session from studentApproval", session?.user?.privilege);
    
//     await connectToDB();
//     console.log("ere bisera ", params.id)
//     const users = await User.find({ _id: params.id });
//     // console.log("ojjbshvcxcgzxcvg",users);
//     // Return a success response with the users data
//     return new Response(JSON.stringify(users), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching users:", error);

//     // Return an error response
//     return new Response("Failed to fetch users", { status: 500 });
//   }
// };




// // const staffApproval = STAFFSTEPS;
// let  staffApproval;
// export const PATCH = async (request) => {
//   try {
//     const { objectId, arrLength } = await request.json();
  

//     await connectToDB();
//     // first fetch the steps
    
//     const steps = await StepSchema.findOne({ stepType:"STAFF"});
    
//     staffApproval=steps.steps;
//     console.log("staffApprovalithink it works",staffApproval)
//     console.log("ererererr",objectId,"aaaa",arrLength)
    
//     const existingRequest = await StaffClearnceReq.findById(objectId);

//     if (existingRequest) {
//       const currentIndex = staffApproval.indexOf(existingRequest.status);
//         console.log("currentIndex",currentIndex)
//       if (currentIndex !== -1 && currentIndex < staffApproval.length - 1) {
//         existingRequest.status = staffApproval[currentIndex + 1];
//       } else {
//         existingRequest.status = "APPROVED";
//       }

//       await existingRequest.save();

//       return new Response(`Approved successfully ${arrLength} requests`, {
//         status: 201,
//       });
//     } else {
//       return new Response("Request not found", { status: 404 });
//     }
//   } catch (error) {
//     console.log(error);
//     return new Response("Failed to update the request status", { status: 500 });
//   }
// };


