# IP Geolocation Web App

A React-based frontend application for retrieving and displaying geolocation and network information based on IP addresses or domains. It provides an intuitive interface to query IP details, view locations on an interactive map, and access additional network insights.

**Live Demo:** [ip-geo-web-peach.vercel.app](https://ip-geo-web-peach.vercel.app)

---

## Features

- **IP/Domain Search:** Enter an IP address or domain to fetch geolocation data.  
- **Detailed Information:** Displays location details including country, region, city, latitude, longitude, timezone, ISP, and more.  
- **Interactive Map:** Visualizes the location using an embedded map powered by Leaflet.  
- **Responsive Design:** Fully responsive UI built with Tailwind CSS for optimal viewing on all devices.  
- **Animations and Icons:** Smooth animations via Framer Motion and modern icons from Lucide React.  
- **API Integration:** Uses Axios to communicate with a backend API for data retrieval.  

---

## Technologies Used

- **Frontend Framework:** React.js  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS with PostCSS and Autoprefixer  
- **HTTP Client:** Axios  
- **Mapping:** Leaflet and React-Leaflet  
- **Routing:** React Router DOM  
- **Animations:** Framer Motion  
- **Icons:** Lucide React  
- **Deployment:** Vercel  

---

## Prerequisites

- Node.js (version 20.x recommended)  
- A running backend API (see the companion backend repository)  

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <frontend-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `VITE_API_BASE_URL` to match your backend URL (default is `http://localhost:5000`)

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be running at `http://localhost:5173`

## Backend Requirement

This frontend requires the backend API to be running. Make sure:
1. Backend is running on the specified `VITE_API_BASE_URL`
2. Database migrations have been run
3. Test user has been seeded

See the backend README for setup instructions.

## Features

- **User Authentication**: Login with email and password
- **IP Geolocation Lookup**: Get detailed information about any IP address
- **Current IP Detection**: Automatically fetch information about your current IP
- **Search History**: View and manage previously searched IPs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Test Credentials

Use these credentials to login:

- **Email:** test@example.com
- **Password:** password123

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

See `.env.example` for all available options.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Technologies Used

- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **ipinfo.io** - IP geolocation API (third-party)

## Page Structure

### Login Page (`/login`)
- Email and password input fields
- Form validation
- Error message display
- Test credentials hint

### Home Page (`/home`)
Protected route that displays:

**Section A: Your IP Information**
- Automatically fetched IP geolocation data
- Displays: IP, City, Region, Country, Coordinates

**Section B: IP Search**
- Text input for IP address
- IP format validation
- Search results display
- Clear button to reset

**Section C: Search History**
- List of previously searched IPs
- Delete individual items
- Reverse chronological order

**Section D: Logout**
- Logout button to clear session

## API Integration

The app communicates with the backend API at the configured URL:

- **Login:** `POST /api/login` - User authentication
- **IP Info:** Uses `https://ipinfo.io/json` for geolocation data

## Deployment

### Vercel Deployment

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/import
   - Select your GitHub repository
   - Set build command to `npm run build`
   - Set output directory to `dist`

3. **Add Environment Variables in Vercel**
   - Add `VITE_API_BASE_URL` with your production backend URL

4. **Deploy**
   - Click Deploy
   - Your app will be live at a Vercel URL

## Authentication Flow

```
App Loads
  ↓
Check localStorage for user
  ↓
├─ User exists → Redirect to /home
└─ User missing → Redirect to /login

Login Form Submission
  ↓
Send credentials to backend
  ↓
├─ Success → Save user to localStorage → Navigate to /home
└─ Failure → Display error message

Logout
  ↓
Clear localStorage
  ↓
Redirect to /login
```

## Error Handling

- Invalid email format validation
- Required field validation
- IP address format validation
- Network error handling
- User-friendly error messages

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Security

- ✅ Password never stored locally
- ✅ Authentication tokens managed securely
- ✅ HTTPS recommended for production
- ✅ Input validation on all forms
- ✅ Protected routes with authentication check

## Responsive Design

The application is fully responsive and works optimally on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## Troubleshooting

**Problem: Cannot connect to backend**
- Check if backend is running on the correct port
- Verify `VITE_API_BASE_URL` is correct in `.env`
- Check CORS settings on backend

**Problem: Login fails**
- Verify test user exists in backend database
- Check backend is responding to requests
- Check console for error messages

**Problem: IP lookup returns no data**
- Check internet connection
- Verify ipinfo.io is accessible
- Try a different IP address format
