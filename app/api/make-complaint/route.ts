// // // // // // // import { NextRequest, NextResponse } from 'next/server';
// // // // // // // import { getDatabase } from '@/lib/database';

// // // // // // // export async function POST(req: NextRequest) {
// // // // // // //   try {
// // // // // // //     const db = await getDatabase();
// // // // // // //     const { user_id, subject, description } = await req.json();

// // // // // // //     const complaint = {
// // // // // // //       user_id,
// // // // // // //       subject,
// // // // // // //       description,
// // // // // // //       created_at: new Date(),
// // // // // // //       status: 'open'
// // // // // // //     };

// // // // // // //     await db.collection('complaints').insertOne(complaint);
// // // // // // //     return NextResponse.json({ message: 'Complaint submitted successfully' }, { status: 200 });
// // // // // // //   } catch (error) {
// // // // // // //     console.error(error);
// // // // // // //     return NextResponse.json({ message: 'Error submitting complaint' }, { status: 500 });
// // // // // // //   }
// // // // // // // }

// // // // // // import { NextRequest, NextResponse } from "next/server";
// // // // // // import { getDatabase } from "@/lib/database";
// // // // // // import { writeFile } from "fs/promises";
// // // // // // import path from "path";

// // // // // // // Remove the deprecated config export

// // // // // // export async function POST(req: NextRequest) {
// // // // // //   try {
// // // // // //     const db = await getDatabase();

// // // // // //     const formData = await req.formData();
// // // // // //     const user_id = formData.get("user_id") as string;
// // // // // //     const subject = formData.get("subject") as string;
// // // // // //     const description = formData.get("description") as string;
// // // // // //     const attachment = formData.get("attachment") as File | null;

// // // // // //     let attachmentPath = null;
// // // // // //     if (attachment) {
// // // // // //       const bytes = await attachment.arrayBuffer();
// // // // // //       const buffer = Buffer.from(bytes);

// // // // // //       const uploadDir = path.join(process.cwd(), "public", "uploads");
// // // // // //       const fileName = `${Date.now()}-${attachment.name}`;
// // // // // //       const filePath = path.join(uploadDir, fileName);

// // // // // //       await writeFile(filePath, buffer);
// // // // // //       attachmentPath = `/uploads/${fileName}`;
// // // // // //     }

// // // // // //     const complaint = {
// // // // // //       user: user_id,
// // // // // //       subject,
// // // // // //       description,
// // // // // //       attachment: attachmentPath,
// // // // // //       date: new Date(),
// // // // // //       status: "open",
// // // // // //     };

// // // // // //     await db.collection("complaints").insertOne(complaint);
// // // // // //     return NextResponse.json(
// // // // // //       { message: "Complaint submitted successfully" },
// // // // // //       { status: 200 }
// // // // // //     );
// // // // // //   } catch (error) {
// // // // // //     console.error(error);
// // // // // //     return NextResponse.json(
// // // // // //       { message: "Error submitting complaint" },
// // // // // //       { status: 500 }
// // // // // //     );
// // // // // //   }
// // // // // // }
// // // // // import { NextRequest, NextResponse } from "next/server";
// // // // // import { getDatabase } from "@/lib/database";
// // // // // import { writeFile } from "fs/promises";
// // // // // import path from "path";

// // // // // export async function POST(req: NextRequest) {
// // // // //   try {
// // // // //     const db = await getDatabase();

// // // // //     const formData = await req.formData();
// // // // //     const user_id = formData.get("user_id") as string;
// // // // //     const subject = formData.get("subject") as string;
// // // // //     const description = formData.get("description") as string;
// // // // //     const attachment = formData.get("attachment") as File | null;

// // // // //     let attachmentPath = null;
// // // // //     if (attachment) {
// // // // //       const bytes = await attachment.arrayBuffer();
// // // // //       const buffer = new Uint8Array(bytes);

// // // // //       const uploadDir = path.join(process.cwd(), "public", "uploads");
// // // // //       const fileName = `${Date.now()}-${attachment.name}`;
// // // // //       const filePath = path.join(uploadDir, fileName);

// // // // //       await writeFile(filePath, buffer);
// // // // //       attachmentPath = `/uploads/${fileName}`;
// // // // //     }

// // // // //     const complaint = {
// // // // //       user: user_id,
// // // // //       subject,
// // // // //       description,
// // // // //       attachment: attachmentPath,
// // // // //       date: new Date(),
// // // // //       status: "open",
// // // // //     };

// // // // //     await db.collection("complaints").insertOne(complaint);
// // // // //     return NextResponse.json(
// // // // //       { message: "Complaint submitted successfully" },
// // // // //       { status: 200 }
// // // // //     );
// // // // //   } catch (error) {
// // // // //     console.error(error);
// // // // //     return NextResponse.json(
// // // // //       { message: "Error submitting complaint" },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }

// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { getDatabase } from "@/lib/database";
// // // // import { writeFile } from "fs/promises";
// // // // import path from "path";

// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     const db = await getDatabase();

// // // //     const formData = await req.formData();
// // // //     const user_id = formData.get("user_id") as string;
// // // //     const subject = formData.get("subject") as string;
// // // //     const description = formData.get("description") as string;
// // // //     const attachment = formData.get("attachment");

// // // //     let attachmentPath = null;
// // // //     if (attachment && typeof attachment !== "string") {
// // // //       const bytes = await (attachment as Blob).arrayBuffer();
// // // //       const buffer = new Uint8Array(bytes);

// // // //       const uploadDir = path.join(process.cwd(), "public", "uploads");
// // // //       const fileName = `${Date.now()}-${
// // // //         (attachment as File).name || "attachment"
// // // //       }`;
// // // //       const filePath = path.join(uploadDir, fileName);

// // // //       await writeFile(filePath, buffer);
// // // //       attachmentPath = `/uploads/${fileName}`;
// // // //     }

// // // //     const complaint = {
// // // //       user: user_id,
// // // //       subject,
// // // //       description,
// // // //       attachment: attachmentPath,
// // // //       date: new Date(),
// // // //       status: "open",
// // // //     };

// // // //     await db.collection("complaints").insertOne(complaint);
// // // //     return NextResponse.json(
// // // //       { message: "Complaint submitted successfully" },
// // // //       { status: 200 }
// // // //     );
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     return NextResponse.json(
// // // //       { message: "Error submitting complaint" },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // import { NextRequest, NextResponse } from "next/server";
// // // import { getDatabase } from "@/lib/database";
// // // import { writeFile, mkdir } from "fs/promises";
// // // import path from "path";

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     const db = await getDatabase();

// // //     const formData = await req.formData();
// // //     const user_id = formData.get("user_id") as string;
// // //     const subject = formData.get("subject") as string;
// // //     const description = formData.get("description") as string;
// // //     const attachment = formData.get("attachment");

// // //     let attachmentPath = null;
// // //     if (attachment && typeof attachment !== "string") {
// // //       const uploadDir = path.join(process.cwd(), "public", "uploads");

// // //       // Ensure the uploads directory exists
// // //       await mkdir(uploadDir, { recursive: true });

// // //       const fileName = `${Date.now()}-${
// // //         (attachment as File).name || "attachment"
// // //       }`;
// // //       const filePath = path.join(uploadDir, fileName);

// // //       // Convert the attachment to a Buffer
// // //       const arrayBuffer = await (attachment as File).arrayBuffer();
// // //       const buffer = Buffer.from(arrayBuffer);

// // //       await writeFile(filePath, new Uint8Array(buffer));
// // //       attachmentPath = `/uploads/${fileName}`;
// // //     }

// // //     const complaint = {
// // //       user: user_id,
// // //       subject,
// // //       description,
// // //       attachment: attachmentPath,
// // //       date: new Date(),
// // //       status: "open",
// // //     };

// // //     await db.collection("complaints").insertOne(complaint);
// // //     return NextResponse.json(
// // //       { message: "Complaint submitted successfully" },
// // //       { status: 200 }
// // //     );
// // //   } catch (error) {
// // //     console.error("Error submitting complaint:", error);
// // //     return NextResponse.json(
// // //       {
// // //         message: "Error submitting complaint",
// // //         error: (error as Error).message,
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }
// // import { NextRequest, NextResponse } from "next/server";
// // import { getDatabase } from "@/lib/database";
// // import { writeFile, mkdir } from "fs/promises";
// // import path from "path";

// // export async function POST(req: NextRequest) {
// //   try {
// //     const db = await getDatabase();

// //     const formData = await req.formData();
// //     const user_id = formData.get("user_id") as string;
// //     const subject = formData.get("subject") as string;
// //     const description = formData.get("description") as string;
// //     const attachment = formData.get("attachment") as File | null;

// //     let attachmentPath = null;
// //     if (attachment && attachment instanceof File) {
// //       const uploadDir = path.join(process.cwd(), "public", "uploads");

// //       // Ensure the uploads directory exists
// //       await mkdir(uploadDir, { recursive: true });

// //       const fileName = `${Date.now()}-${attachment.name}`;
// //       const filePath = path.join(uploadDir, fileName);

// //       const arrayBuffer = await attachment.arrayBuffer();
// //       await writeFile(filePath, new Uint8Array(arrayBuffer));
// //       attachmentPath = `/uploads/${fileName}`;
// //     }

// //     const complaint = {
// //       user: user_id,
// //       subject,
// //       description,
// //       attachment: attachmentPath,
// //       date: new Date(),
// //       status: "open",
// //     };

// //     await db.collection("complaints").insertOne(complaint);
// //     return NextResponse.json(
// //       { message: "Complaint submitted successfully" },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error submitting complaint:", error);
// //     return NextResponse.json(
// //       {
// //         message: "Error submitting complaint",
// //         error: (error as Error).message,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/database";
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";

// export async function POST(req: NextRequest) {
//   try {
//     const db = await getDatabase();

//     const formData = await req.formData();
//     const user_id = formData.get("user_id") as string;
//     const subject = formData.get("subject") as string;
//     const description = formData.get("description") as string;
//     const attachment = formData.get("attachment");

//     let attachmentPath = null;
//     if (attachment && typeof attachment !== "string") {
//       const uploadDir = path.join(process.cwd(), "public", "uploads");

//       // Ensure the uploads directory exists
//       await mkdir(uploadDir, { recursive: true });

//       const fileName = `${Date.now()}-${attachment.name || "attachment"}`;
//       const filePath = path.join(uploadDir, fileName);

//       const fileBuffer = Buffer.from(await attachment.arrayBuffer());
//       await writeFile(filePath, new Uint8Array(fileBuffer));
//       attachmentPath = `/uploads/${fileName}`;
//     }

//     const complaint = {
//       user: user_id,
//       subject,
//       description,
//       attachment: attachmentPath,
//       date: new Date(),
//       status: "open",
//     };

//     await db.collection("complaints").insertOne(complaint);
//     return NextResponse.json(
//       { message: "Complaint submitted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error submitting complaint:", error);
//     return NextResponse.json(
//       {
//         message: "Error submitting complaint",
//         error: (error as Error).message,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import { Binary } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const attachment = formData.get("attachment");

    let attachmentData = null;
    let attachmentName = null;

    if (attachment && attachment instanceof Blob) {
      attachmentName = attachment.name || "attachment";
      const buffer = Buffer.from(await attachment.arrayBuffer());
      attachmentData = new Binary(new Uint8Array(buffer));
    }

    const complaint = {
      user: user_id,
      subject,
      description,
      attachment: attachmentData
        ? {
            name: attachmentName,
            data: attachmentData,
          }
        : null,
      date: new Date(),
      status: "open",
    };

    await db.collection("complaints").insertOne(complaint);

    return NextResponse.json(
      { message: "Complaint submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return NextResponse.json(
      {
        message: "Error submitting complaint",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
