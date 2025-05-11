import { connectToDB } from "@/utils/database";
import Office from "@/models/office";
import bcrypt from "bcryptjs";
import DynamicSteps from "@/models/DynamicSteps";

export const POST = async (req) => {
  const { officeId, officeName, password, location, items, type, status } =
    await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await connectToDB();
    const newOffice = new Office({
      officeId,
      officeName,
      password: hashedPassword,
      location,
      items,
      type,
      status,
    });

    console.log(
      officeId,
      officeName,
      hashedPassword,
      location,
      items,
      type,
      status
    );
    await newOffice.save();
    return new Response(JSON.stringify(newOffice), { status: 201 });
  } catch (error) {
    console.error("Error creating a new office:", error);
    return new Response("Failed to create a new office", { status: 500 });
  }
};

export const GET = async () => {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all users from the database
    const offices = await Office.find();

    // Return a success response with the users data
    return new Response(JSON.stringify(offices), { status: 200 });
  } catch (error) {
    console.error("Error fetching offices:", error);

    // Return an error response
    return new Response("Failed to fetch offices", { status: 500 });
  }
};

// add delete method below
export const DELETE = async (req) => {
  const { objectId } = await req.json();
  console.log("objectId", objectId);
  try {
    await connectToDB();
    const fetchFirst = await Office.findOne({ _id: objectId });
    console.log("fetchFirst", fetchFirst);

    console.log("fetchFirst", fetchFirst.type);

    const office = await Office.findOneAndDelete({ _id: objectId });
    const deleteFromStep = await DynamicSteps.findOneAndDelete({
      name: fetchFirst.officeName,
      stepType: fetchFirst.type,
    });

    if (!office) {
      console.log("Office not found");
      return new Response("Office not found", { status: 404 });
    }
    return new Response(JSON.stringify(office), { status: 200 });
  } catch (error) {
    console.error("Error deleting office:", error);
    return new Response("Failed to delete office", { status: 500 });
  }
};
