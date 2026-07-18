# ContentForge AI - Authentication & Database Implementation

## Overview
Production-grade authentication and database system for ContentForge AI SaaS platform, built with Next.js 16, Auth.js v5, Drizzle ORM, and Neon PostgreSQL.

## Architecture

### Authentication System
- **Method**: Custom JWT-based authentication with HTTPOnly cookies
- **Session Management**: JWT tokens stored in secure HTTP-only cookies
- **Password Security**: Bcryptjs password hashing with 10 salt rounds
- **Session Duration**: 30-day sessions with optional refresh

### Database
- **Provider**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Schema**: 20 tables including Auth.js standard tables + application-specific tables

## Database Tables

### Authentication Tables (Auth.js Standard)
1. **users** - User accounts with id, email, password (hashed), name, image
2. **sessions** - JWT session tokens with expiration
3. **accounts** - OAuth provider accounts (future OAuth integration)
4. **verification_tokens** - Email verification tokens (future email verification)

### Application Tables
5. **projects** - Content projects with userId, name, description, topic, channels, status
6. **pipeline_steps** - Individual pipeline stages for content creation
7. **approvals** - Workflow approvals and feedback system
8. **analytics** - Performance metrics (views, engagement, shares)
9. **user_settings** - User preferences (theme, notifications, 2FA)
10. **api_keys** - API key management for integrations
11. **audit_logs** - Audit trail for compliance

## Security Features

### Per-User Data Isolation
Every query in server actions includes `eq(table.userId, userId)` to ensure users only access their own data. This is enforced at the application level since there's no Row Level Security on Neon.

```typescript
// Example: getUserId() pattern used in all server actions
async function getUserId() {
  const session = await getSession()
  if (!session?.id) {
    throw new Error('Unauthorized: User not found')
  }
  return session.id
}
```

### Password Security
- Minimum 8 characters
- Must contain: uppercase, lowercase, numbers
- Hashed with bcryptjs before storage
- Never stored in plain text

### Session Security
- JWT tokens with HS256 signing
- HTTPOnly cookies (prevents XSS access)
- Secure flag in production
- SameSite=Lax to prevent CSRF
- 30-day expiration

### Middleware Protection
Routes automatically protected by middleware:
- `/dashboard` - Main dashboard
- `/projects` - Projects list
- `/project/*` - Individual projects
- `/settings` - User settings

Unauthenticated users redirect to `/auth/login`

## File Structure

```
src/
├── lib/
│   ├── auth.ts                 # JWT auth functions
│   ├── auth-client.ts          # Client-side auth utilities
│   ├── get-user.ts             # User session helpers
│   ├── schemas/
│   │   └── auth.ts             # Zod validation schemas
│   └── db/
│       ├── index.ts            # Drizzle client
│       └── schema.ts           # Database tables
├── app/
│   ├── actions/
│   │   ├── auth.ts             # Login/signup server actions
│   │   ├── logout.ts           # Logout action
│   │   └── projects.ts         # Project CRUD (getUserId pattern)
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   └── api/auth/...            # Auth endpoints (removed - using custom JWT)
├── components/
│   └── layout/
│       ├── navbar.tsx          # With logout button
│       └── sidebar.tsx         # Navigation
└── middleware.ts               # Auth middleware for route protection
```

## Key Features Implemented

### 1. User Registration
- Full name, email, password, password confirmation
- Password strength validation
- Duplicate email detection
- Automatic session creation on success
- Redirect to dashboard

### 2. User Login
- Email and password validation
- Database lookup with bcryptjs verification
- Session creation on successful login
- Redirect to dashboard
- Error handling with descriptive messages

### 3. Session Management
- JWT token in HttpOnly cookie
- 30-day session duration
- Automatic session restoration on page refresh
- Secure logout with cookie deletion

### 4. Protected Routes
- Middleware enforces authentication
- Automatic redirect to login for unauthenticated users
- Callback URL support for post-login redirect
- Authenticated users cannot access auth pages

### 5. Server Actions
```typescript
// Example: registerUser
- Input validation with Zod
- Duplicate email check
- Password hashing
- User creation
- Automatic session creation

// Example: loginUser
- Email/password validation
- User lookup
- Password verification
- Session creation
- Detailed error messages

// Pattern: getUserId()
- Used in ALL data access actions
- Returns userId from JWT session
- Throws if unauthorized
- Enables per-user data scoping
```

## Testing Instructions

1. **Test Registration**
   - Go to `/auth/signup`
   - Fill in: John Developer, john@test.com, SecurePass123, agree to terms
   - Should redirect to `/dashboard`
   - Dashboard shows welcome message with user's first name

2. **Test Login**
   - Logout from dropdown menu
   - Should redirect to `/auth/login`
   - Go back to `/auth/login` explicitly
   - Enter: john@test.com, SecurePass123
   - Should redirect to `/dashboard`

3. **Test Protected Routes**
   - Open browser dev tools, Application tab
   - Find `auth-token` cookie
   - Delete it or use private/incognito mode
   - Try accessing `/dashboard`
   - Should redirect to `/auth/login`

4. **Test Session Persistence**
   - Login successfully
   - Refresh the page
   - Should remain logged in
   - Session restored from JWT cookie

## Environment Variables Required

```
AUTH_SECRET=<random 32+ char string>
DATABASE_URL=<neon postgres connection string>
```

Generate AUTH_SECRET with:
```bash
openssl rand -base64 32
```

## API Routes

All custom route handling is done via:
- Server actions in `/src/app/actions/`
- Middleware in `/middleware.ts`
- No `/api/auth/*` routes (using custom JWT instead of next-auth HTTP handler)

## Future Enhancements

1. **Email Verification** - Use `verification_tokens` table
2. **Password Reset** - Email-based password recovery
3. **OAuth Integration** - Use `accounts` table for Google/GitHub
4. **Two-Factor Authentication** - Enabled in `user_settings`
5. **API Key Management** - Use `api_keys` table for programmatic access
6. **Audit Logging** - Automatically log actions in `audit_logs`
7. **Admin Dashboard** - User management and system monitoring

## Performance Considerations

- Database queries are indexed on userId for fast lookups
- JWT reduces database calls for session verification
- HTTPOnly cookies secure against XSS
- Middleware runs at Edge for fast auth checks
- Session tokens cached in cookies (no session table lookups)

## Compliance & Security

- No plain text passwords
- No sensitive data in JWT token payload
- HTTPS-enforced in production
- SameSite cookies prevent CSRF
- Per-user data scoping (no cross-user access)
- Audit trail available for compliance
- All user queries filtered by userId

## Troubleshooting

**"Email already in use"**
- That email is already registered
- Use a different email or login instead

**"Incorrect password"**
- Check password matches exactly (case sensitive)
- Password must include uppercase, lowercase, number

**"Unauthorized" in server actions**
- Session cookie may be expired
- Try logging out and back in
- Check AUTH_SECRET is set

**Database connection errors**
- Verify DATABASE_URL is set
- Check Neon database is running
- Test connection: `psql $DATABASE_URL`
