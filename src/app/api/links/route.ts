import { NextRequest, NextResponse } from "next/server";
import Links from "@/models/links";
import { connectDB } from "@/lib/connectDB";

export async function GET(request: NextRequest) {
    console.log("these is for links");
    await connectDB();
    const links = await Links.find({});
    return NextResponse.json({ 
        success: true,
        data: links
    });
}

export async function POST(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    try {
        const newLink = new Links(body);
        const savedLink = await newLink.save();
        return NextResponse.json({ success: true, data: savedLink });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}

// PUT handler for updating an existing link
export async function PUT(request: NextRequest) {
    // Connect to the database
    await connectDB();

    // Parse the request body to get the id and update data
    const requestBody = await request.json();
    const { id, ...updateData } = requestBody;

    // Attempt to find the link by id and update it with the new data
    const updatedLink = await Links.findByIdAndUpdate(id, updateData, { new: true });

    // If no link is found with the given id, return a 404 error response
    if (!updatedLink) {
        return NextResponse.json(
            { success: false, error: "Link not found" },
            { status: 404 }
        );
    }

    // If the link is successfully updated, return the updated link data
    return NextResponse.json({
        success: true,
        data: updatedLink
    });
}

// DELETE handler for removing a link by id
export async function DELETE(request: NextRequest) {
    // Connect to the database
    await connectDB();

    // Parse the request body to get the id of the link to delete
    const requestBody = await request.json();
    const { id } = requestBody;

    // Attempt to find the link by id and delete it
    const deletedLink = await Links.findByIdAndDelete(id);

    // If no link is found with the given id, return a 404 error response
    if (!deletedLink) {
        return NextResponse.json(
            { success: false, error: "Link not found" },
            { status: 404 }
        );
    }

    // If the link is successfully deleted, return the deleted link data
    return NextResponse.json({
        success: true,
        data: deletedLink
    });
}
