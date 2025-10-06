# Google OAuth Setup Instructions

## Step 1: Create a New OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Image Builder"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `../auth/drive`
5. Add test users:
   - Add your Gmail address
   - Add any other email addresses you want to test with

## Step 3: Create Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "Image Builder Web Client"
5. Authorized JavaScript origins:
   - `http://localhost:5174`
   - `http://localhost:3000` (backup)
   - `http://127.0.0.1:5174`
6. Authorized redirect URIs:
   - `http://localhost:5174`
   - `http://localhost:5174/`

## Step 4: Update Environment Variables

Copy the Client ID and update your `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your-new-client-id.apps.googleusercontent.com
```

## Step 5: Test the Application

1. Restart your development server: `npm run dev`
2. Clear browser cache and cookies for localhost
3. Try logging in again

## Troubleshooting

- Make sure your email is added as a test user
- Verify the Client ID in your .env file matches the one in Google Cloud Console
- Check that Google Drive API is enabled in your project
- Ensure authorized origins match your local development URL exactly
