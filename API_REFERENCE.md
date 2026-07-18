# ContentForge AI - API & Server Actions Reference

## Server Actions (Authentication)

### `registerUser(data)`
Create a new user account.

**Location**: `src/app/actions/auth.ts`

**Parameters**:
```typescript
{
  name: string              // User's full name
  email: string            // Email address (unique)
  password: string         // Min 8 characters
  confirmPassword: string  // Must match password
}
```

**Returns**:
```typescript
{
  success: boolean
  message?: string         // Success message
  error?: string          // Error description
}
```

**Example**:
```typescript
const result = await registerUser({
  name: "Jane Developer",
  email: "jane@example.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123"
})

if (result.success) {
  router.push('/dashboard')
}
```

**Errors**:
- Email already in use
- Passwords do not match
- Password too short
- Invalid email format

---

### `loginUser(data)`
Authenticate user and create session.

**Location**: `src/app/actions/auth.ts`

**Parameters**:
```typescript
{
  email: string
  password: string
}
```

**Returns**:
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

**Example**:
```typescript
const result = await loginUser({
  email: "jane@example.com",
  password: "SecurePass123"
})

if (result.success) {
  router.push('/dashboard')
}
```

**Errors**:
- No user found with this email
- Incorrect password

---

### `logout()`
Destroy user session.

**Location**: `src/app/actions/logout.ts`

**Parameters**: None

**Returns**:
```typescript
{
  success: boolean
}
```

**Example**:
```typescript
import { logout } from '@/app/actions/logout'

await logout()
// User is logged out, redirects to login
```

---

## Server Actions (Projects)

### `createProject(data)`
Create a new content project.

**Location**: `src/app/actions/projects.ts`

**Parameters**:
```typescript
{
  name: string              // Project title
  description?: string      // Project description
  topic?: string           // Content topic
  channels?: string[]      // Publishing channels
}
```

**Returns**:
```typescript
{
  success: boolean
  projectId?: number
  error?: string
}
```

**Example**:
```typescript
const result = await createProject({
  name: "Q3 Marketing Campaign",
  topic: "Product Launch",
  channels: ["LinkedIn", "Twitter"]
})

if (result.success) {
  console.log("Project created:", result.projectId)
}
```

---

### `getProjects(options)`
Fetch user's projects with pagination.

**Location**: `src/app/actions/projects.ts`

**Parameters**:
```typescript
{
  page?: number          // Page number (default: 1)
  limit?: number         // Items per page (default: 10)
  status?: string        // Filter by status
}
```

**Returns**:
```typescript
{
  success: boolean
  projects: Array<{
    id: number
    name: string
    description: string
    topic: string
    status: string
    channels: string[]
    createdAt: Date
    updatedAt: Date
  }>
  total: number          // Total project count
  error?: string
}
```

**Example**:
```typescript
const result = await getProjects({ page: 1, limit: 20 })

if (result.success) {
  result.projects.forEach(project => {
    console.log(`${project.name} - ${project.status}`)
  })
}
```

---

### `updateProject(id, data)`
Update project details.

**Location**: `src/app/actions/projects.ts`

**Parameters**:
```typescript
{
  id: number
  name?: string
  description?: string
  topic?: string
  status?: "draft" | "published" | "archived"
  channels?: string[]
}
```

**Returns**:
```typescript
{
  success: boolean
  error?: string
}
```

---

### `deleteProject(id)`
Delete a project.

**Location**: `src/app/actions/projects.ts`

**Parameters**:
```typescript
{
  id: number  // Project ID
}
```

**Returns**:
```typescript
{
  success: boolean
  error?: string
}
```

---

## Database Queries (Raw Drizzle)

### Query a User by Email

```typescript
import { db } from '@/lib/db'
import { users, eq } from '@/lib/db'

const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1)

// Returns: Array<User>
```

### Query All User Projects

```typescript
import { db } from '@/lib/db'
import { projects, eq, desc } from '@/lib/db'

const userProjects = await db
  .select()
  .from(projects)
  .where(eq(projects.userId, userId))
  .orderBy(desc(projects.createdAt))

// Returns: Array<Project>
```

### Query with JOIN

```typescript
import { db } from '@/lib/db'
import { projects, analytics, eq } from '@/lib/db'

const projectMetrics = await db
  .select({
    projectName: projects.name,
    views: analytics.views,
    engagement: analytics.engagement
  })
  .from(projects)
  .leftJoin(analytics, eq(projects.id, analytics.projectId))
  .where(eq(projects.userId, userId))

// Returns: Array<JoinedResult>
```

### Insert Project

```typescript
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

await db.insert(projects).values({
  userId,
  name: "New Project",
  topic: "AI",
  status: "draft",
  channels: JSON.stringify(["LinkedIn"]),
  createdAt: new Date(),
  updatedAt: new Date()
})

// Returns: InsertResult
```

### Update Project

```typescript
import { db } from '@/lib/db'
import { projects, eq } from '@/lib/db'

await db
  .update(projects)
  .set({
    name: "Updated Name",
    status: "published",
    updatedAt: new Date()
  })
  .where(eq(projects.id, projectId))

// Returns: UpdateResult
```

### Delete Project

```typescript
import { db } from '@/lib/db'
import { projects, eq, and } from '@/lib/db'

await db
  .delete(projects)
  .where(
    and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)  // Security: Ensure user ownership
    )
  )

// Returns: DeleteResult
```

---

## Session Management

### Get Current User

```typescript
import { getSession } from '@/lib/auth'

// In Server Component or Server Action:
const user = await getSession()

if (!user) {
  // User not authenticated
  redirect('/auth/login')
}

console.log(user.id, user.email, user.name)
```

### Create Session (Internal)

```typescript
import { createSession } from '@/lib/auth'

await createSession({
  id: userId,
  email: userEmail,
  name: userName
})
```

---

## Error Handling Patterns

### In Server Actions

```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function myAction(data: unknown) {
  try {
    // Validate input
    const validated = MySchema.parse(data)
    
    // Get user
    const user = await getSession()
    if (!user) throw new Error('Unauthorized')
    
    // Database operation
    const result = await db.insert(...).values({
      userId: user.id,
      ...validated
    })
    
    // Revalidate cache
    revalidatePath('/dashboard')
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

### In Components

```typescript
'use client'

import { useState } from 'react'
import { myAction } from '@/app/actions'
import { toast } from 'sonner'

export function MyComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    try {
      const result = await myAction(formData)
      
      if (!result.success) {
        setError(result.error || 'Something went wrong')
        toast.error(result.error)
        return
      }
      
      toast.success('Success!')
      // Handle success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      {/* Form fields */}
    </form>
  )
}
```

---

## Validation Patterns

### Zod Schema

```typescript
import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Usage
try {
  const validated = signUpSchema.parse(formData)
  // Use validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.log(`${err.path}: ${err.message}`)
    })
  }
}
```

---

## Common Patterns

### Protected Route Pattern

```typescript
// In any Server Action
import { getSession } from '@/lib/auth'

async function protectedAction(data: unknown) {
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  // Now you have user.id for scoping queries
  const userItems = await db
    .select()
    .from(items)
    .where(eq(items.userId, user.id))
}
```

### Data Ownership Check

```typescript
// Always verify user owns the resource
const project = await db
  .select()
  .from(projects)
  .where(
    and(
      eq(projects.id, projectId),
      eq(projects.userId, user.id)  // Ownership check
    )
  )
  .limit(1)

if (!project.length) {
  throw new Error('Project not found or unauthorized')
}
```

### Pagination Pattern

```typescript
const page = 1
const limit = 10
const offset = (page - 1) * limit

const [items, totalCount] = await Promise.all([
  db
    .select()
    .from(myTable)
    .where(eq(myTable.userId, userId))
    .limit(limit)
    .offset(offset),
  db
    .select({ count: count() })
    .from(myTable)
    .where(eq(myTable.userId, userId))
])

const total = totalCount[0].count
const totalPages = Math.ceil(total / limit)
```

---

## Rate Limiting (Ready to Implement)

```typescript
// In any route handler or server action
import { db } from '@/lib/db'
import { audit_logs, eq } from '@/lib/db/schema'

async function checkRateLimit(userId: string, maxPerMinute = 60) {
  const oneMinuteAgo = new Date(Date.now() - 60000)
  
  const recentActions = await db
    .select({ count: count() })
    .from(audit_logs)
    .where(
      and(
        eq(audit_logs.userId, userId),
        gt(audit_logs.createdAt, oneMinuteAgo)
      )
    )
  
  const count = recentActions[0].count
  
  if (count > maxPerMinute) {
    throw new Error('Rate limit exceeded. Please try again later.')
  }
}
```

---

This API is fully functional and ready for integration with AI features and additional backend services.
