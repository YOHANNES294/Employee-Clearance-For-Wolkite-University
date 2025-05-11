import ClearanceDay from "@/models/clearanceDay";
import { connectToDB } from "@/utils/database";

// PATCH: Update the clearance day
export const PATCH = async (request) => {
  try {
    const { day } = await request.json();
    if (typeof day !== "number") {
      return new Response("Invalid 'day' value", { status: 400 });
    }

    await connectToDB();
    const existing = await ClearanceDay.find();

    if (existing.length === 0) {
      return new Response("No clearance day to update", { status: 404 });
    }

    const updated = await ClearanceDay.findByIdAndUpdate(existing[0]._id, { day });

    if (updated) {
      return new Response(JSON.stringify({ message: "Day updated successfully" }), { status: 200 });
    }

    return new Response("Failed to update day", { status: 500 });
  } catch (error) {
    console.error("Error updating day:", error);
    return new Response("Failed to update day", { status: 500 });
  }
};

// GET: Retrieve the current clearance day
export const GET = async () => {
  try {
    await connectToDB();
    const fetchDay = await ClearanceDay.find();

    if (fetchDay.length > 0) {
      return new Response(JSON.stringify(fetchDay[0]), { status: 200 });
    }

    return new Response("No clearance day found", { status: 404 });
  } catch (error) {
    console.error("Error fetching day:", error);
    return new Response("Failed to fetch day", { status: 500 });
  }
};

// POST: Create a new clearance day (should only happen once)
export const POST = async (request) => {
  try {
    const { day } = await request.json();
    if (typeof day !== "number") {
      return new Response("Invalid 'day' value", { status: 400 });
    }

    await connectToDB();

    const exists = await ClearanceDay.find();
    if (exists.length > 0) {
      return new Response("Clearance day already exists", { status: 400 });
    }

    const newDay = new ClearanceDay({ day });
    await newDay.save();

    return new Response("Day created successfully", { status: 201 });
  } catch (error) {
    console.error("Error creating day:", error);
    return new Response("Failed to create day", { status: 500 });
  }
};
