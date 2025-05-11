import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const POST = async (req) => {
  try {
    await connectToDB();

    const data = await req.json();
    //  console.log(data);
    let count = 0;
    for (const userData of data) {
      const newUser = new User({
        userId: userData["Id"],
        firstname: userData["First Name"],
        middlename: userData["Middle Name"],
        lastname: userData["Last Name"],
        collegeName: userData["College Name"],
        departmentName: userData["Department Name"],
        year: userData["Year"],
        role: userData["Role"],
        //additional for staffs
        staffType: userData["Staff Type"],
        director: userData["Director"],

        // Map each property to the corresponding field in your User model
      });
      
      await newUser.save();
      count++;
    }

    // return res.status(201).json({ message: "Users created successfully" });
    return new Response(`${count} users registered successfully`, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Faild to create a new user", { status: 500 });
    //return res.status(500).json({ message: "Failed to create users" });
  }
};
