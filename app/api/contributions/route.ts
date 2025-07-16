import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In-memory storage for demo - use MongoDB in production
const contributions: any[] = []

function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
}

export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request)
    const contributionData = await request.json()

    const contribution = {
      _id: Date.now().toString(),
      userId: decoded.userId,
      userEmail: decoded.email,
      status: "pending",
      submittedAt: new Date(),
      ...contributionData,
    }

    contributions.push(contribution)

    return NextResponse.json({
      message: "Contribution submitted successfully",
      contribution: {
        _id: contribution._id,
        status: contribution.status,
        submittedAt: contribution.submittedAt,
      },
    })
  } catch (error) {
    console.error("Contribution error:", error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}

export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request)

    // Only admins can view all contributions
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(contributions)
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
