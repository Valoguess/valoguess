import { getFriendships } from '@/services/friendship';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ userId: string }>
};

export async function GET(request: Request, { params }: RouteParams) {
  const { userId } = await params; 
  if (!userId) {
    return NextResponse.json({ 
      success: false, 
      message: "Missing userId parameter. Call /api/internal/socket/friends/<userId>"
    }, { status: 400 });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    return NextResponse.json({ 
      success: false, 
      message: "Unauthorized" 
    }, { status: 401 });
  }

  const friendships = await getFriendships(userId);

  const friends = [];
  const incoming = [];
  const outgoing = [];

  for (const f of friendships) {
    const isRequester = f.requesterId === userId;

    const otherUser = isRequester
      ? f.receiver
      : f.requester;

    const friend = {
      id: isRequester ? f.receiverId : f.requesterId,
      username: otherUser?.username,
      name: otherUser?.name,
      image: otherUser?.image,
    };

    if (f.status === "ACCEPTED") {
      friends.push(friend);
    } else if (f.status === "PENDING") {
      if (isRequester) {
        outgoing.push(friend);
      } else {
        incoming.push(friend);
      }
    }
  }

  const data = {
    friends,
    requests: {
      incoming,
      outgoing,
    },
  };

  return NextResponse.json({ 
    success: true,
    data,
  });
}
