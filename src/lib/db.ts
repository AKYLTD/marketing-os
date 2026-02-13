// Simple in-memory data store for development
// In production, swap this with Prisma/Drizzle connected to your database

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  password: string | null;
  tier: string;
  stripeCustomerId: string | null;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  channel: string;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  reach: number;
  engagement: number;
  clicks: number;
  revenue: number;
  spend: number;
  roi: number;
  createdAt: Date;
}

// In-memory store (resets on restart — for development only)
const store = {
  users: new Map<string, User>(),
  posts: [] as Post[],
};

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const db = {
  user: {
    findByEmail: (email: string) => {
      for (const u of store.users.values()) {
        if (u.email === email) return u;
      }
      return null;
    },
    findById: (id: string) => store.users.get(id) || null,
    create: (data: Partial<User> & { email: string }) => {
      const user: User = {
        id: genId(),
        name: data.name || null,
        email: data.email,
        image: data.image || null,
        password: data.password || null,
        tier: data.tier || "basic",
        stripeCustomerId: null,
        createdAt: new Date(),
      };
      store.users.set(user.id, user);
      return user;
    },
    update: (id: string, data: Partial<User>) => {
      const user = store.users.get(id);
      if (!user) return null;
      Object.assign(user, data);
      return user;
    },
    list: () => Array.from(store.users.values()),
  },
  post: {
    findByUserId: (userId: string) => store.posts.filter(p => p.userId === userId),
    create: (data: Partial<Post> & { userId: string; title: string; channel: string }) => {
      const post: Post = {
        id: genId(),
        userId: data.userId,
        title: data.title,
        content: data.content || "",
        type: data.type || "post",
        channel: data.channel,
        status: data.status || "draft",
        scheduledAt: data.scheduledAt || null,
        publishedAt: data.publishedAt || null,
        reach: data.reach || 0,
        engagement: data.engagement || 0,
        clicks: data.clicks || 0,
        revenue: data.revenue || 0,
        spend: data.spend || 0,
        roi: data.roi || 0,
        createdAt: new Date(),
      };
      store.posts.push(post);
      return post;
    },
    list: () => store.posts,
  },
};

export default db;
