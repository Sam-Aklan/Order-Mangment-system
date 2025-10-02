import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  // Secure your endpoint with a secret stored in GitHub Secrets
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  try {
    const { count } = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          gte:now, // `lt` stands for "less than"
        },
      },
    });
    console.log(`Deleted ${count} expired sessions.`);
    return NextResponse.json({ success: true, deletedCount: count });
  } catch (error) {
    console.error('Error deleting expired sessions:', error);
   
    return NextResponse.json({ success: false, error: "Error deleting expired sessions:" }, { status: 500 });
  }
}

//You create a dedicated API endpoint in your Next.js app to handle the database cleanup.
// You set up a GitHub Actions workflow with a cron schedule that makes a cURL request to your cleanup API endpoint