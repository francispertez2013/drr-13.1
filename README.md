# MDRRMO Pio Duran - Disaster Risk Reduction Management System

A comprehensive web application for the Municipal Disaster Risk Reduction and Management Office of Pio Duran, Albay, Philippines.

## 🚀 Features

### Public Features
- **Emergency Reporting**: Public incident reporting system with reference tracking
- **News Portal**: Latest updates and announcements from MDRRMO
- **Resource Downloads**: Emergency guides, forms, and planning documents
- **Gallery**: Photos from training sessions and community events
- **Emergency Procedures**: Step-by-step guides for various disaster types
- **Contact Information**: Emergency hotlines and office details
- **Responsive Design**: Mobile-first design for all devices
- **PWA Support**: Installable as a mobile app
- **Offline Mode**: Basic functionality works without internet

### Admin Features
- **Content Management**: Manage news, services, gallery, and pages
- **Incident Tracking**: Monitor and respond to public reports
- **Emergency Alerts**: Send community-wide emergency notifications
- **Social Media Management**: Manage social media presence
- **User Management**: Admin and editor role management
- **Analytics Dashboard**: Track website performance and engagement
- **Resource Management**: Upload and organize downloadable resources
- **Real-time Updates**: Live data synchronization across all components

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **React Helmet Async** for SEO

### Backend & Database
- **Supabase** (PostgreSQL) for database and authentication
- **Real-time subscriptions** for live updates
- **Row Level Security (RLS)** for data protection
- **Automatic API generation** from database schema

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** with Autoprefixer
- **Vite PWA Plugin** for Progressive Web App features

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mdrrmo-pio-duran
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration files in your Supabase SQL editor
   - The migrations will create all necessary tables and sample data

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Schema

The application uses the following main tables:

- **news** - News articles and announcements
- **services** - MDRRMO services and programs
- **incident_reports** - Public incident reports with tracking
- **gallery** - Photo gallery with categorization
- **pages** - Dynamic page content management
- **page_sections** - Modular page sections
- **resources** - Downloadable documents and files
- **emergency_alerts** - Emergency notification system
- **social_posts** - Social media content management

## 🔐 Authentication

The system includes a production-ready authentication system with two user roles:

- **Admin**
  - Full access to all features including user management
  - System settings and configuration control
  - Can create and manage other admin accounts

- **Editor**
  - Content management access
  - Limited administrative features
  - Cannot manage users or system settings

### Creating Admin Accounts

1. **First Admin Account**: Use the registration form on the login page
2. **Additional Accounts**: Existing admins can create new accounts via the Users Management panel
3. **Account Verification**: All new users receive email verification links
4. **Security**: All passwords are securely managed by Supabase Auth

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

### Production Authentication Features

✅ **Secure User Management**:
- Real user accounts stored in database
- Supabase Auth integration for security
- Email verification for new accounts
- Password reset functionality
- First registered user automatically becomes admin
- Automatic user profile creation for authenticated users

✅ **Role-Based Access Control**:
- Admin: Full system access
- Editor: Content management only
- Secure role enforcement
- Automatic role assignment for first user

✅ **Production Security**:
- No demo accounts or hardcoded credentials
- Encrypted password storage
- Session management
- Secure logout functionality
- Automatic user profile synchronization

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
Ensure all environment variables are properly set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📱 Progressive Web App (PWA)

The application is configured as a PWA with:
- **Offline functionality** for critical features
- **Install prompts** for mobile devices
- **Service worker** for caching and offline support
- **App manifest** with proper icons and metadata

## 🔧 Development

### Code Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
├── lib/                # External service configurations
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   └── public/         # Public website pages
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Features Implementation

#### Real-time Updates
```typescript
// Automatic data synchronization using Supabase real-time
useEffect(() => {
  const subscription = supabase
    .channel('news_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, 
      (payload) => {
        // Handle real-time updates
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

#### Error Handling
```typescript
// Centralized error handling with user-friendly messages
const { handleError } = useErrorHandler();

try {
  await someAsyncOperation();
} catch (error) {
  handleError(error, 'Operation Context');
}
```

#### Caching System
```typescript
// Client-side caching for improved performance
const { data, loading } = useCache('news-data', fetchNews, {
  ttl: 5 * 60 * 1000, // 5 minutes
  refreshInterval: 30000 // 30 seconds
});
```

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Input validation** and sanitization
- **Rate limiting** for form submissions
- **CSRF protection** for sensitive operations
- **File upload validation** with size and type restrictions
- **SQL injection prevention** through parameterized queries

## 📊 Performance Optimizations

- **Code splitting** with dynamic imports
- **Image lazy loading** with intersection observer
- **Bundle optimization** with manual chunks
- **Caching strategies** for API responses
- **Debounced search** and form inputs
- **Optimized re-renders** with React.memo and useMemo

## 🌍 SEO & Accessibility

- **Meta tags** and Open Graph support
- **Structured data** for search engines
- **Semantic HTML** with proper ARIA labels
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast mode** support
- **Reduced motion** preferences

## 📈 Analytics & Monitoring

- **Custom analytics** system for tracking user behavior
- **Performance monitoring** with Web Vitals
- **Error tracking** and reporting
- **Health checks** for system components
- **Real-time system status** monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- **Email**: mdrrmo@pioduran.gov.ph
- **Phone**: (052) 234-5678
- **Emergency**: 911

## 🙏 Acknowledgments

- **MDRRMO Pio Duran** for project requirements and content
- **Supabase** for backend infrastructure
- **React Community** for excellent documentation and tools
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ for the safety and resilience of Pio Duran community**