import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find or create user
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Create new user with default settings
      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        settings: {
          rounding: 1,
          weekStart: 1,
          aiEnabled: true,
          notificationsEnabled: false,
          timeFormat: '12h',
        },
      });

      // Create default categories for new user
      const defaultCategories = [
        { name: 'Sleep', color: '#8B5CF6', type: 'life' },
        { name: 'Food', color: '#45E06F', type: 'life' },
        { name: 'Work', color: '#3A8DFF', type: 'skill' },
        { name: 'Exercise', color: '#FF5C5C', type: 'life' },
        { name: 'Learning', color: '#F11D75', type: 'skill' },
      ];

      await Category.insertMany(
        defaultCategories.map(cat => ({
          ...cat,
          userId: user._id,
          countsTowardMastery: cat.type === 'skill',
          targetWeeklyHours: 0,
          archived: false,
        }))
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
    const { settings } = body;

    if (settings) {
      user.settings = { ...user.settings, ...settings };
      await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
