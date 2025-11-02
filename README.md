# Dental Appointment & Treatment Management System

A complete cross-platform dental management system built with React Native Web and PHP MySQL backend. Works seamlessly on Web, Android, and iOS with a single codebase.

## 🌟 Features

### Doctor Dashboard
- 👨‍⚕️ Doctor authentication and profile management
- 👥 Patient management (add, view, update patients)
- 📅 Smart appointment slot booking (30-minute intervals, 9 AM - 9 PM, Mon-Sat)
- 📱 Treatment status tracking
- 📄 View uploaded scan videos and reports
- ✅ Treatment confirmation system

### A1 Aligners Dashboard
- 🏢 A1 team authentication
- 👥 View all patients from all doctors
- 📹 Upload scan videos (~15 minutes)
- 📊 Upload patient reports (PDF, images)
- 🔓 Automatic slot unlocking after file uploads
- 📈 Patient status management

### Core Features
- 🔒 Secure authentication system
- 🔄 Real-time slot booking with collision prevention
- 📱 Cross-platform support (Web, Android, iOS)
- 🎨 Professional UI with gold & green theme
- 📲 Responsive design for all screen sizes
- ⚡ Fast and efficient backend API
- 📁 File upload and management system

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (Web support)
- **Backend**: Core PHP with PDO
- **Database**: MySQL
- **UI Framework**: React Native Paper
- **Navigation**: React Navigation v6
- **File Handling**: Expo Document Picker
- **Styling**: Custom theme with animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- XAMPP (Apache + MySQL)
- Expo CLI: `npm install -g @expo/cli`

### 1. Backend Setup

1. **Start XAMPP**
   ```bash
   # Start Apache and MySQL from XAMPP Control Panel
   ```

2. **Create Database**
   ```bash
   # Open phpMyAdmin (http://localhost/phpmyadmin)
   # Import the database file: backend/database/dental_system.sql
   ```

3. **Configure Backend**
   ```bash
   # Copy the backend folder to your XAMPP htdocs directory
   cp -r backend/ /path/to/xampp/htdocs/dental-management-system/backend/
   
   # Update database credentials in backend/config/database.php if needed
   ```

### 2. Frontend Setup

1. **Install Dependencies**
   ```bash
   cd dental-management-system
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Update API_BASE_URL in .env if needed
   ```

3. **Run the Application**
   ```bash
   # For Web
   npm run web
   
   # For Android (with Android Studio/Emulator)
   npm run android
   
   # For iOS (macOS only, with Xcode)
   npm run ios
   
   # Start development server
   npm start
   ```

## 📱 Demo Credentials

### Doctor Login
- **Email**: rajesh@example.com
- **Password**: doctor123

### A1 Aligners Login
- **Email**: admin@a1aligners.com
- **Password**: a1admin123

## 📂 Project Structure

```
dental-management-system/
├── 📱 Frontend (React Native)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens/pages
│   │   ├── services/       # API and storage services
│   │   ├── styles/         # Theme and styling
│   │   ├── context/        # React Context (Auth)
│   │   ├── navigation/     # Navigation setup
│   │   └── utils/          # Helper functions
│   ├── public/             # Web assets
│   └── package.json
│
├── 🔧 Backend (PHP)
│   ├── config/             # Database configuration
│   ├── api/                # REST API endpoints
│   ├── uploads/            # File storage
│   └── database/           # SQL schema
│
└── 📚 Documentation
    ├── README.md
    └── .env.example
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth.php` - Login for doctors and A1 users
- `POST /api/auth.php` - Register new doctors

### Patients
- `GET /api/patients.php` - Get patients list
- `POST /api/patients.php` - Create new patient
- `PUT /api/patients.php` - Update patient details
- `GET /api/patients.php?patient_id=X` - Get patient details

### Time Slots
- `GET /api/slots.php` - Get available slots
- `POST /api/slots.php` - Book a slot

### File Uploads
- `POST /api/uploads.php` - Upload video/report files
- `GET /api/uploads.php?action=get_file` - Get uploaded files

## 🎨 UI/UX Features

- **Gold Theme**: A1 Aligners branding with elegant gold colors
- **Green Theme**: Fresh green colors for medical/health feeling
- **Smooth Animations**: Fade-in, slide-up effects throughout the app
- **Responsive Design**: Adapts perfectly to mobile, tablet, and desktop
- **Professional Cards**: Clean card-based layout with shadows
- **Status Badges**: Color-coded status indicators
- **Loading States**: Beautiful loading animations
- **Error Handling**: User-friendly error messages

## 🔧 Customization

### Changing Colors
Edit `src/styles/theme.js`:
```javascript
export const colors = {
  primary: '#2E7D32',    // Green theme
  secondary: '#FFD700',   // Gold theme
  change to this gold #D4AF37
  // ... customize other colors
};
```

### Adding New Features
1. Create new screens in `src/screens/`
2. Add API endpoints in `backend/api/`
3. Update navigation in `src/navigation/AppNavigator.js`

### Database Schema
The database includes tables for:
- `doctors` - Doctor accounts and profiles
- `a1_users` - A1 Aligners team accounts
- `patients` - Patient information and status
- `time_slots` - Appointment slot management
- `notifications` - System notifications

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the generated web-build/ folder to your web server
```

### Mobile App Deployment
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

### Backend Deployment
- Upload backend files to your web hosting
- Create MySQL database and import SQL file
- Update database credentials in config file

## 🔒 Security Features

- Password hashing with MD5 (upgrade to bcrypt recommended)
- SQL injection prevention with PDO prepared statements
- CORS headers for API security
- File upload validation and type checking
- Token-based authentication

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS headers are enabled in PHP files
   - Check API base URL configuration

2. **File Upload Issues**
   - Verify upload directory permissions
   - Check file size limits in PHP configuration

3. **Database Connection**
   - Confirm XAMPP MySQL is running
   - Verify database credentials

4. **Mobile App Issues**
   - Update Expo CLI to latest version
   - Clear Expo cache: `expo start -c`

## 📞 Support

For support and questions:
- 📧 Email: support@dentalapp.com
- 📖 Documentation: Check inline code comments
- 🐛 Issues: Create GitHub issues for bugs

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🚀 Getting Started Checklist

- [ ] Install Node.js and Expo CLI
- [ ] Set up XAMPP with Apache and MySQL
- [ ] Import database from `backend/database/dental_system.sql`
- [ ] Copy backend files to XAMPP htdocs
- [ ] Run `npm install` in project directory
- [ ] Configure `.env` file
- [ ] Start the app with `npm start`
- [ ] Test with demo credentials
- [ ] Customize colors and branding
- [ ] Deploy to production

**🎉 You're all set! Enjoy using the Dental Management System!**
