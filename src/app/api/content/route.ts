import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Content from "@/models/content";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const contents = await Content.find({});
        return NextResponse.json({ contents });
    } catch (error) {
        console.error("Error fetching contents:", error);
        return NextResponse.json({ message: "Error fetching contents", error: error?.toString() }, { status: 500 });
    }   

}


export async function POST(request: NextRequest) {
    try {
        const { title, body, aboutbio, aboutcard1 , aboutcard2 } = await request.json();
        await connectDB();
        const newContent = new Content({ title, body, aboutbio, aboutcard1,aboutcard2 });
        await newContent.save();
        return NextResponse.json({ message: "Content created successfully", content: newContent }, { status: 201 });
    } catch (error) {
        console.error("Error creating content:", error);
        return NextResponse.json({ message: "Error creating content", error: error?.toString() }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await connectDB();
        await Content.findByIdAndDelete(id);
        return NextResponse.json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ message: "Error deleting content", error: error?.toString() }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, title, body, aboutbio, aboutcard1 ,aboutcard2 } = await request.json();
        await connectDB();
        const updatedContent = await Content.findByIdAndUpdate(
            id,
            { title, body, aboutbio, aboutcard1 , aboutcard2 },
            { new: true }
        );
        if (!updatedContent) {
            console.error(`Document not found for ID: ${id}`);
            // Return 404 if the document was not found
            return NextResponse.json({ message: "Content not found, update failed" }, { status: 404 });
        }
        return NextResponse.json({ message: "Content updated successfully", content: updatedContent });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ message: "Error updating content", error: error?.toString() }, { status: 500 });
    }
}