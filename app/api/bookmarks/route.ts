import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In-memory storage for demo - use MongoDB in production
const bookmarks: any[] = []
const sampleStacks = [
  {
    _id: "1",
    name: "Stripe",
    industry: "Fintech",
    scale: "Unicorn",
    location: "San Francisco, CA",
    description: "Online payment processing platform that enables businesses to accept payments over the internet.",
    techStack: {
      frontend: ["React", "TypeScript", "Next.js"],
      backend: ["Ruby on Rails", "Node.js", "Go"],
      database: ["PostgreSQL", "Redis", "MongoDB"],
      infrastructure: ["AWS", "Kubernetes", "Docker"],
    },
    employees: "4000+",
  },
  {
    _id: "2",
    name: "Airbnb",
    industry: "E-commerce",
    scale: "Public",
    location: "San Francisco, CA",
    description: "Online marketplace for short-term homestays and experiences.",
    techStack: {
      frontend: ["React", "JavaScript", "Sass"],
      backend: ["Ruby on Rails", "Java", "Python"],
      database: ["MySQL", "Redis", "Elasticsearch"],
      infrastructure: ["AWS", "Kubernetes", "Kafka"],
    },
    employees: "6000+",
  },
  {
    _id: "3",
    name: "Notion",
    industry: "SaaS",
    scale: "Series C+",
    location: "San Francisco, CA",
    description: "All-in-one workspace for notes, tasks, wikis, and databases.",
    techStack: {
      frontend: ["React", "TypeScript", "Electron"],
      backend: ["Node.js", "TypeScript"],
      database: ["PostgreSQL", "Redis"],
      infrastructure: ["AWS", "CloudFlare", "Docker"],
    },
    employees: "500+",
  },
]

function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
}

export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request)

    const userBookmarks = bookmarks
      .filter((b) => b.userId === decoded.userId)
      .map((bookmark) => ({
        ...bookmark,
        stack: sampleStacks.find((s) => s._id === bookmark.stackId),
      }))
      .filter((b) => b.stack) // Remove bookmarks for non-existent stacks

    return NextResponse.json(userBookmarks)
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request)
    const { stackId } = await request.json()

    // Check if already bookmarked
    const existingBookmark = bookmarks.find((b) => b.userId === decoded.userId && b.stackId === stackId)

    if (existingBookmark) {
      return NextResponse.json({ message: "Already bookmarked" }, { status: 400 })
    }

    const bookmark = {
      _id: Date.now().toString(),
      userId: decoded.userId,
      stackId,
      createdAt: new Date(),
    }

    bookmarks.push(bookmark)

    return NextResponse.json({
      message: "Bookmark added",
      bookmark,
    })
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: Request) {
  try {
    const decoded = verifyToken(request)
    const { stackId } = await request.json()

    const bookmarkIndex = bookmarks.findIndex((b) => b.userId === decoded.userId && b.stackId === stackId)

    if (bookmarkIndex === -1) {
      return NextResponse.json({ message: "Bookmark not found" }, { status: 404 })
    }

    bookmarks.splice(bookmarkIndex, 1)

    return NextResponse.json({
      message: "Bookmark removed",
    })
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
