# Setup Guide for 10,000hours.com

This guide will walk you through setting up the development environment for the 10,000hours.com application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Clerk Account** - For authentication

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd tenthousandhours
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16.0.1
- React 19.2.0
- Clerk for authentication
- Mongoose for MongoDB
- Tailwind CSS for styling
- And other dependencies

## Step 3: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended for Development)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier is sufficient)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with `tenthousandhours`

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/tenthousandhours?retryWrites=true&w=majority
```

### Option B: Local MongoDB

1. Install MongoDB locally - [Instructions](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service
3. Your connection string will be:
```
mongodb://localhost:27017/tenthousandhours
```

## Step 4: Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or sign in
3. In your application settings, go to "API Keys"
4. Copy your:
   - Publishable Key (starts with `pk_`)
   - Secret Key (starts with `sk_`)

## Step 5: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and fill in your values:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs (keep these as is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/now
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/now

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tenthousandhours?retryWrites=true&w=majority

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-your-openai-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Never commit `.env.local` to version control
- The Clerk keys must be valid (not placeholder values)
- MongoDB URI must be accessible from your machine
- OpenAI API key is optional; AI features will be disabled without it

## Step 6: Run the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the landing page
3. Click "Start Free" to go to the sign-up page
4. Create an account using Clerk authentication
5. After signing in, you'll be redirected to `/app/now`

## Common Issues and Solutions

### Issue: Build fails with "Invalid publishableKey"

**Solution:** Make sure your `.env.local` file has valid Clerk keys that start with `pk_test_` or `pk_live_`

### Issue: Database connection fails

**Solution:** 
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- For local MongoDB, ensure the service is running

### Issue: Pages show "Unauthorized" error

**Solution:**
- Clear your browser cache and cookies
- Sign out and sign in again
- Check that middleware.ts is properly configured

### Issue: Styles not loading correctly

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
# Rebuild
npm run build
```

## Project Structure

```
tenthousandhours/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (app)/               # Protected app pages
│   │   ├── now/             # Timer page
│   │   ├── timeline/        # Calendar views
│   │   ├── insights/        # Analytics
│   │   ├── notes/           # Notes management
│   │   ├── categories/      # Category management
│   │   └── settings/        # User settings
│   ├── api/                 # API routes
│   │   ├── categories/
│   │   ├── sessions/
│   │   └── user/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Reusable components
│   └── ui/
├── lib/
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Session.ts
│   │   └── Note.ts
│   ├── mongodb.ts           # Database connection
│   └── utils/               # Utility functions
├── docs/                    # Documentation
├── middleware.ts            # Auth middleware
├── .env.local               # Environment variables (create this)
├── .env.example             # Example env file
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Create production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Next Steps

After setup:

1. **Explore the App**: Navigate through all pages to understand the layout
2. **Review Documentation**: Read files in `/docs` directory for detailed specs
3. **Check Data Models**: Review `/lib/models` to understand the data structure
4. **Test API Routes**: Use the app to test creating categories and sessions
5. **Customize**: Follow the design system in `/docs/ui-guidelines.md`

## Getting Help

- Review the comprehensive PRD in `/docs/PRD.md`
- Check technical specs in `/docs/tech-stack-overview.md`
- See UI guidelines in `/docs/ui-guidelines.md`
- App flow documentation in `/docs/app-flow.md`

## Deployment

For production deployment to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up Edge Functions
- Configure the domain
- Enable auto-deployments from GitHub

---

**Happy Coding! 🚀**

Track your first 10,000 hours!
