import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Session from '@/lib/models/Session';
import User from '@/lib/models/User';

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const categoryId = searchParams.get('categoryId');

    const query: {
      userId: typeof user._id;
      start?: { $gte?: Date; $lt?: Date };
      categoryId?: string;
    } = { userId: user._id };
    
    if (from || to) {
      query.start = {};
      if (from) query.start.$gte = new Date(from);
      if (to) query.start.$lt = new Date(to);
    }
    
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const sessions = await Session.find(query)
      .populate('categoryId')
      .sort({ start: -1 });
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { categoryId, title, start, end, quality, tags } = body;

    // Calculate duration if end is provided
    let durationMin = 0;
    if (end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      durationMin = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    }

    const session = await Session.create({
      userId: user._id,
      categoryId,
      title,
      start: new Date(start),
      end: end ? new Date(end) : null,
      durationMin,
      quality,
      tags: tags || [],
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
