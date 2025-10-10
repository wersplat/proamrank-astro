# 🧪 Sentry Testing Guide

Use this guide to verify your Sentry integration is working correctly.

## Quick Test Page

I've created a dedicated test page at: **`/sentry-test`**

Visit: `http://localhost:4321/sentry-test` (dev) or `https://your-domain.com/sentry-test` (production)

## Test Scenarios

### 1. Client-Side Errors (Browser)

**Test Page Button**: "Throw Client Error"

**Manual Test**: Add this to any component:
```javascript
throw new Error('[Test] Client-side error');
```

**Expected in Sentry**:
- Error message with full stack trace
- Browser information (Chrome, Firefox, etc.)
- User agent details
- Breadcrumbs showing user actions

---

### 2. Async Errors (Promises)

**Test Page Button**: "Throw Async Error"

**Manual Test**:
```javascript
async function testAsync() {
  await Promise.reject(new Error('[Test] Async error'));
}
```

**Expected in Sentry**:
- Promise rejection error
- Async stack trace
- Context about when it was triggered

---

### 3. React Component Errors

**Interactive Component**: Available on test page

**Manual Test**: Create `src/pages/react-test.astro`:
```astro
---
import SentryTestComponent from '../components/SentryTestComponent';
---

<html>
  <body>
    <SentryTestComponent client:load />
  </body>
</html>
```

**Expected in Sentry**:
- Component name and stack
- React component tree
- State information at time of error
- Props and context

---

### 4. Server-Side Errors (SSR)

**Manual Test**: Uncomment line 2 in `src/pages/sentry-test.astro`:
```astro
---
throw new Error('[Test] Server-side error');
---
```

Then visit `/sentry-test`

**Expected in Sentry**:
- Server-side error
- Request URL and headers
- Server environment info
- No browser information (server-only)

---

### 5. API Route Errors

**Test Endpoint**: `/api/sentry-test-error`

**Manual Test**:
```bash
# GET request
curl http://localhost:4321/api/sentry-test-error

# POST request
curl -X POST http://localhost:4321/api/sentry-test-error \
  -H "Content-Type: application/json" \
  -d '{"trigger":"error"}'
```

**Expected in Sentry**:
- API route error
- HTTP method (GET/POST)
- Request headers
- Request body (for POST)

---

### 6. Cloudflare Function Errors

**Test**: Modify any function to throw an error temporarily

**Example** - `functions/api/player-stats.ts`:
```typescript
export async function onRequest(context: { request: Request; env: Env }) {
  // Add this at the top to test
  throw new Error('[Test] Cloudflare Function error');
  
  // ... rest of code
}
```

**Expected in Sentry**:
- Function name and location
- Cloudflare environment details
- Request information

---

## Verification Checklist

After triggering test errors, check your Sentry dashboard:

### ✅ Error Appears in Issues
- [ ] Error shows up in https://sentry.io/organizations/bodegacatsgc/issues/
- [ ] Error has correct message and title
- [ ] Stack trace is readable (not minified)

### ✅ Source Maps Working
- [ ] Stack trace shows original file names (not bundle names)
- [ ] Line numbers point to actual source code
- [ ] Can click through to see source code snippets

### ✅ Context Information
- [ ] Environment set to "production"
- [ ] Correct project (proamrank)
- [ ] Browser/server info captured
- [ ] Breadcrumbs show user actions

### ✅ Performance Data (if enabled)
- [ ] Transaction appears in Performance tab
- [ ] Load times recorded
- [ ] API calls tracked

### ✅ Session Replay (for client errors)
- [ ] Some errors have replay sessions attached
- [ ] Can watch user actions leading to error
- [ ] UI interactions visible in replay

---

## Testing in Different Environments

### Local Development (`npm run dev`)

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:4321/sentry-test`
3. Click test buttons
4. Check Sentry dashboard

**Note**: Errors will be tagged with environment "production" (as configured)

### Production (Cloudflare Pages)

1. Deploy to Cloudflare Pages with `SENTRY_AUTH_TOKEN` set
2. Visit: `https://your-domain.com/sentry-test`
3. Run all test scenarios
4. Verify source maps are working (readable stack traces)

---

## Expected Sentry Dashboard Views

### Issues Tab
```
[Sentry Test] Client-side JavaScript error from button click
  Environment: production
  Browser: Chrome 120.0.0
  Last seen: 2 minutes ago
  
  Stack Trace:
    at HTMLButtonElement.click (sentry-test.astro:45:11)
    at ... (readable source code)
```

### Performance Tab
```
GET /sentry-test
  Duration: 125ms
  Status: 200
  
Transaction breakdown:
  - Browser: 95ms
  - Server: 30ms
```

### Replays Tab
```
Session Replay - Error occurred
  Duration: 2m 34s
  Errors: 1
  
  Timeline:
    0:00 - Page loaded
    0:15 - User clicked "Test Error" button
    0:16 - ERROR: Client-side error thrown
```

---

## Troubleshooting

### Error Not Appearing in Sentry

1. **Check DSN is correct** in config files
2. **Verify SENTRY_AUTH_TOKEN** is set (for source maps)
3. **Check browser console** for Sentry errors
4. **Ensure build succeeded** without Sentry errors
5. **Wait 30-60 seconds** - Sentry may batch events

### Source Maps Not Working

1. **Verify SENTRY_AUTH_TOKEN** is set in Cloudflare Pages
2. **Check build logs** for "Successfully uploaded source maps"
3. **Ensure project slug** is correct in `astro.config.mjs` (should be "proamrank")
4. **Rebuild and redeploy** if token was added after initial deploy

### Errors Appear Twice

- This is normal during development
- Sentry may capture errors from both HMR and actual runtime
- Won't happen in production builds

---

## Clean Up

After testing, you can:

1. **Remove test page**: Delete `src/pages/sentry-test.astro`
2. **Remove test component**: Delete `src/components/SentryTestComponent.tsx`
3. **Remove test API**: Delete `src/pages/api/sentry-test-error.ts`

Or keep them for future testing!

---

## Next Steps

Once you've verified errors are being captured:

1. ✅ Set up **Alert Rules** in Sentry to get notified of errors
2. ✅ Configure **Issue Owners** for automatic assignment
3. ✅ Set up **Slack/Email** integrations for notifications
4. ✅ Adjust **sample rates** if needed to manage quota
5. ✅ Create **filters** to ignore known issues (if any)

---

## Support

- **Sentry Dashboard**: https://sentry.io/organizations/bodegacatsgc/
- **Documentation**: See `SENTRY_SETUP.md`
- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/astro/

Happy testing! 🚀

