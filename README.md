# StartupStack 🚀

A full-stack platform where users can browse and filter tech stacks used by successful startups.

## Features

### 🔍 Core Functionality
- **Browse & Filter Stacks**: Explore startup tech stacks with filters for industry, scale, and search
- **Stack Details**: Detailed view of each startup's complete tech stack
- **User Authentication**: JWT-based signup/login system
- **Bookmarking**: Save favorite stacks for later reference
- **Contributions**: Submit new startup stack information
- **Admin Dashboard**: Review and approve contributions

### 👥 User Roles
- **Guest**: Browse and filter stacks
- **User**: Bookmark stacks + contribute new data
- **Admin**: Review contributions and view platform statistics

## Tech Stack

### Frontend
- **React.js** with Vite
- **JavaScript** (no TypeScript)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd startupstack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm run install-deps
   \`\`\`

3. **Set up environment variables**
   
   Create `server/.env` file:
   \`\`\`env
   MONGO_URI=mongodb://localhost:27017/startupstack
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   \`\`\`

4. **Start the development servers**
   \`\`\`bash
   npm run dev
   \`\`\`

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:5173`

### Production Deployment

1. **Build the frontend**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start the production server**
   \`\`\`bash
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Stacks
- `GET /api/stack/list` - List all stacks with filtering
- `GET /api/stack/:id` - Get specific stack details
- `POST /api/stack/bookmark` - Toggle bookmark
- `GET /api/stack/user/bookmarks` - Get user bookmarks
- `POST /api/stack/contribute` - Submit contribution

### Admin
- `GET /api/admin/contributions` - List contributions
- `POST /api/admin/contributions/:id/review` - Review contribution
- `GET /api/admin/stats` - Get platform statistics

## Database Models

### User
\`\`\`javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  bookmarks: [ObjectId],
  createdAt: Date
}
\`\`\`

### StartupStack
\`\`\`javascript
{
  name: String,
  industry: String,
  scale: String,
  location: String,
  description: String,
  techStack: {
    frontend: [String],
    backend: [String],
    database: [String],
    infrastructure: [String],
    mobile: [String],
    other: [String]
  },
  founded: Number,
  employees: String,
  funding: String,
  website: String,
  contributedBy: ObjectId,
  status: String,
  createdAt: Date
}
\`\`\`

### Contribution
\`\`\`javascript
{
  // Same fields as StartupStack
  contributedBy: ObjectId,
  status: String (pending/approved/rejected),
  adminNotes: String,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  createdAt: Date
}
\`\`\`

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **Input Sanitization**: Clean user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@startupstack.com or create an issue in the repository.
