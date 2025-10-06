# Google OAuth Setup Guide for Snappixy

This guide will help you set up Google OAuth authentication for the Snappixy application.

## Prerequisites

1. A Google Cloud Platform account
2. Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Snappixy App")
5. Click "Create"

### 2. Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Google Identity API** (for authentication)
   - **Google Drive API** (for file access)
   - **Google Cloud Storage API** (for file storage)

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: `Snappixy`
   - User support email: Your email
   - Developer contact information: Your email
4. Add the following scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `drive` (if you want Google Drive integration)
5. Add test users (your email and any others you want to test with)
6. Save and continue

### 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the name to "Snappixy Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:5174` (backup port)
   - Your production domain (when you deploy)
6. Add Authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `http://localhost:5174` (backup port)
   - Your production domain (when you deploy)
7. Click "Create"
8. Copy the Client ID (it will look like: `xxxxx.apps.googleusercontent.com`)

### 5. Update Environment Variables

1. In your Snappixy project, open the `.env` file
2. Replace the `VITE_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

### 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Continue with Google"
4. You should see the Google OAuth popup
5. Sign in with a test user account

## Common Issues and Solutions

### Issue: "Error 400: redirect_uri_mismatch"
**Solution**: Make sure your redirect URIs in Google Cloud Console exactly match your application URL (including port numbers).

### Issue: "Error 403: access_denied"
**Solution**: Make sure your email is added as a test user in the OAuth consent screen.

### Issue: Google popup doesn't appear
**Solution**: 
- Check browser popup blockers
- Ensure your Client ID is correct
- Check the browser console for errors

### Issue: "Error 400: invalid_request"
**Solution**: Make sure you've enabled the Google Identity API in your Google Cloud project.

## Security Best Practices

1. **Never commit your actual Client ID to public repositories**
2. **Use environment variables** for all sensitive configuration
3. **Limit OAuth scopes** to only what your application needs
4. **Regularly rotate credentials** if they become compromised
5. **Use HTTPS in production** - Google OAuth requires secure connections in production

## Production Deployment

When deploying to production:

1. Add your production domain to authorized origins and redirect URIs
2. Update your `.env` file with production values
3. Ensure your domain uses HTTPS
4. Consider moving from "Testing" to "In production" status in OAuth consent screen

## Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Need Help?** If you encounter issues, check the browser console for error messages and ensure all steps above are completed correctly.
