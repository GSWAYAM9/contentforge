# Environment Variables Setup Guide

## Required Environment Variables

### AI APIs
```env
# Claude AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-v1-xxxxxxxxxxxxx

# OpenAI (DALL-E 3 Image Generation)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Database
```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/database

# Better Auth
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
```

### Authentication
```env
# Session Configuration
SESSION_SECRET=generate-with-openssl-rand-base64-32

# CORS & Security
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### LinkedIn Integration (Optional)
```env
# LinkedIn OAuth
LINKEDIN_CLIENT_ID=xxxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxx
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/callback/linkedin
```

### Email (Optional for notifications)
```env
# Email Service (e.g., SendGrid, Nodemailer)
EMAIL_FROM=noreply@contentforge.ai
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## How to Generate Secrets

### OpenSSL (macOS/Linux)
```bash
# Generate BETTER_AUTH_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET
openssl rand -base64 32
```

### Node.js Alternative
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## API Setup Instructions

### Claude API (Anthropic)
1. Visit https://console.anthropic.com
2. Create an account or sign in
3. Go to API Keys section
4. Generate a new API key
5. Copy and set as `ANTHROPIC_API_KEY`

### OpenAI API (DALL-E 3)
1. Visit https://platform.openai.com
2. Sign up or log in
3. Go to API Keys (https://platform.openai.com/api-keys)
4. Create a new secret key
5. Set up billing and credit
6. Copy and set as `OPENAI_API_KEY`

### Neon Database
1. Visit https://neon.tech
2. Create a new project
3. Get the connection string
4. Set as `DATABASE_URL`

### LinkedIn OAuth (Optional)
1. Go to https://www.linkedin.com/developers/apps
2. Create a new app
3. Configure OAuth settings
4. Get Client ID and Client Secret
5. Set redirect URL to `{NEXT_PUBLIC_APP_URL}/auth/callback/linkedin`

---

## Local Development Setup

1. Create `.env.local` file in project root
2. Copy the variables from this guide
3. Fill in your API keys
4. For development, use:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_URL=postgresql://localhost:5432/contentforge
   ```

## Production Setup

1. Use Vercel Environment Variables
2. Set production URLs:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Use production API keys
4. Enable stronger CORS restrictions
5. Set `NODE_ENV=production`

---

## API Pricing Reference

### Claude API (Anthropic)
- Input: $0.003 per 1,000 tokens
- Output: $0.015 per 1,000 tokens
- Models: claude-3-5-sonnet-20241022

### OpenAI (DALL-E 3)
- Standard: $0.04 per image (1024x1024)
- HD Quality: $0.08 per image (1024x1024)
- Used in project: HD Quality

### Rate Limits (as configured)
- Claude: 10,000 requests/min
- DALL-E: 500 images/hour
- Embeddings: 100,000 requests/min

---

## Verification Checklist

- [ ] ANTHROPIC_API_KEY is set
- [ ] OPENAI_API_KEY is set
- [ ] DATABASE_URL is valid
- [ ] BETTER_AUTH_SECRET is generated
- [ ] SESSION_SECRET is generated
- [ ] NEXT_PUBLIC_APP_URL is configured
- [ ] (Optional) LinkedIn credentials if using LinkedIn integration
- [ ] (Optional) Email service configured for notifications

---

## Testing API Connections

### Test Claude API
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":100,"messages":[{"role":"user","content":"Hello"}]}'
```

### Test OpenAI API
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Test Database Connection
```bash
psql $DATABASE_URL -c "SELECT 1"
```

---

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Use `.env.example`** template for team
3. **Rotate secrets** regularly
4. **Use Vercel secrets** for production
5. **Restrict API key permissions** (read-only when possible)
6. **Monitor API usage** in dashboards
7. **Set spending limits** on API accounts
8. **Use IP allowlists** where available

---

## Troubleshooting

### "Invalid API Key" Error
- Verify the key is copied correctly
- Check API is enabled on provider account
- Ensure billing is set up
- Check key hasn't been revoked

### "Database Connection Failed"
- Verify DATABASE_URL format
- Check network access rules
- Ensure Neon project is running
- Test connection manually with psql

### "CORS Error"
- Verify NEXT_PUBLIC_APP_URL matches domain
- Check CORS policy in API settings
- Whitelist frontend origin on API provider

### "Rate Limit Exceeded"
- Check current usage on provider dashboard
- Implement exponential backoff
- Consider upgrading API tier
- Batch requests where possible
