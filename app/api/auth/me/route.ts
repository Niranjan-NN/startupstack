import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In-memory storage for demo - use MongoDB in production
const users: any[] = []

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
