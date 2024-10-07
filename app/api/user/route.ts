import { getDatabase, User } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try{
        const { email } = await req.json();
        const db = await getDatabase();
        if (!email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const user = await db.collection<User>('users').findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user
         }, { status: 200 });

    }catch(error){
        console.error(error);
        return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }
}