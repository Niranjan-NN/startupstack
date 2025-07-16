import { NextResponse } from "next/server"

// Sample data - same as in route.ts
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
    founded: 2010,
    employees: "4000+",
    funding: "$2.2B (Public)",
    website: "https://stripe.com",
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
    founded: 2008,
    employees: "6000+",
    funding: "Public (ABNB)",
    website: "https://airbnb.com",
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
    founded: 2016,
    employees: "500+",
    funding: "$343M Series C",
    website: "https://notion.so",
  },
  {
    _id: "4",
    name: "Discord",
    industry: "Social Media",
    scale: "Unicorn",
    location: "San Francisco, CA",
    description: "Voice, video and text communication service designed for creating communities.",
    techStack: {
      frontend: ["React", "JavaScript", "Electron"],
      backend: ["Elixir", "Python", "Rust"],
      database: ["Cassandra", "MongoDB", "Redis"],
      infrastructure: ["Google Cloud", "Kubernetes", "Docker"],
    },
    founded: 2015,
    employees: "600+",
    funding: "$995M (Unicorn)",
    website: "https://discord.com",
  },
  {
    _id: "5",
    name: "Figma",
    industry: "SaaS",
    scale: "Unicorn",
    location: "San Francisco, CA",
    description: "Collaborative interface design tool that runs in the browser.",
    techStack: {
      frontend: ["TypeScript", "React", "WebAssembly"],
      backend: ["Node.js", "TypeScript", "C++"],
      database: ["PostgreSQL", "Redis"],
      infrastructure: ["AWS", "Kubernetes", "Docker"],
    },
    founded: 2012,
    employees: "800+",
    funding: "$333M (Acquired by Adobe)",
    website: "https://figma.com",
  },
  {
    _id: "6",
    name: "Canva",
    industry: "SaaS",
    scale: "Unicorn",
    location: "Sydney, Australia",
    description:
      "Graphic design platform that allows users to create social media graphics, presentations, and other visual content.",
    techStack: {
      frontend: ["React", "TypeScript", "WebGL"],
      backend: ["Java", "Scala", "Python"],
      database: ["MongoDB", "Redis", "Elasticsearch"],
      infrastructure: ["AWS", "Kubernetes", "Docker"],
    },
    founded: 2013,
    employees: "3000+",
    funding: "$71B Valuation",
    website: "https://canva.com",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const stack = sampleStacks.find((s) => s._id === params.id)

  if (!stack) {
    return NextResponse.json({ error: "Stack not found" }, { status: 404 })
  }

  return NextResponse.json(stack)
}
