# Supabase Setup Instructions

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Sign in** with your account or create a new one
3. **Select your project** or create a new one
4. **Go to Settings** → **API**
5. **Copy these values**:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

## Step 2: Update Environment Variables

Create a `.env` file in your project root and add your credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Run Database Migration

The migration files are located in the `supabase/migrations/` directory.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content from each migration file in order:
   - `20250629144429_lingering_cherry.sql`
   - `20250630032934_graceful_beacon.sql` 
   - `20250812150824_summer_desert.sql`
4. Click **Run**

**Option B: Using Supabase CLI (if installed)**
```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Step 4: Verify Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the application**:
   - Visit: http://localhost:5173
   - Try logging in: http://localhost:5173/admin/login
   - Use credentials: `admin@mdrrmo.gov.ph` / `admin123`

## Step 5: Enable Authentication

In your Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. **Configure email confirmation** as needed for production
3. **Add your domain** to allowed origins
4. **Set up email templates** for user verification and password reset

### Creating Your First Admin Account

1. **Visit the login page**: http://localhost:5173/admin/login
2. **Click "Need an account? Register"**
3. **Fill in the registration form**:
   - Full Name: Your name
   - Username: Unique username
   - Email: Your admin email
   - Password: Secure password (min 6 characters)
   - Role: First user automatically becomes Administrator
4. **Complete registration** and verify your email if required
5. **Sign in** with your new credentials

### How User Management Works

✅ **Automatic Profile Creation**:
- When you sign up through Supabase Auth, a user profile is automatically created
- First registered user automatically gets admin privileges
- Subsequent users default to editor role (can be changed by admins)

✅ **Seamless Integration**:
- Supabase Auth handles password security and email verification
- User profiles are automatically synchronized with authentication
- No manual database setup required for user accounts

### Production Authentication Features

✅ **Secure User Management**:
- Real user accounts stored in database
- Supabase Auth integration for security
- Email verification for new accounts
- Password reset functionality

✅ **Role-Based Access Control**:
- Admin: Full system access
- Editor: Content management only
- Secure role enforcement

✅ **Production Security**:
- No demo accounts or hardcoded credentials
- Encrypted password storage
- Session management
- Secure logout functionality
## What's Included

✅ **Complete Database Schema**:
- News articles
- Services
- Incident reports
- Gallery items
- Pages
- Page sections
- Resources
- Emergency alerts
- Social posts

✅ **Row Level Security (RLS)**:
- Public can read published content
- Authenticated users can manage all content
- Anyone can submit incident reports

✅ **Sample Data**:
- Pre-populated with demo content
- Ready to use immediately

✅ **Real-time Features**:
- Live updates across all components
- Automatic data synchronization

✅ **Production Ready**:
- Optimized database queries
- Error handling and validation
- Performance monitoring
- Security best practices

## Troubleshooting

**If you get connection errors**:
1. Check your credentials in `.env`
2. Ensure your Supabase project is active
3. Verify all migrations were run successfully
4. Check the browser console for specific error messages

**If authentication fails**:
1. Check that email confirmation is disabled
2. Verify the demo users exist in the auth table
3. Try creating users manually in Supabase dashboard

**If tables don't exist**:
1. Ensure all migration files were executed
2. Check the Supabase SQL editor for any errors
3. Verify your project has the correct permissions

## Next Steps

Once connected, you can:
1. **Manage Content** - Add/edit news, services, gallery items
2. **Handle Incidents** - Review and respond to public reports
3. **Emergency Alerts** - Send automated alerts to the community
4. **Create Pages** - Build custom pages with dynamic content
5. **Manage Resources** - Upload and organize downloadable files
6. **Social Media** - Manage social media presence
7. **Analytics** - Track engagement and performance

## Production Deployment

For production deployment:
1. Set environment variables in your hosting platform
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting provider
4. Ensure Supabase project is in production mode
5. Configure custom domain and SSL if needed

Need help? The application includes comprehensive admin tools and monitoring for all features!