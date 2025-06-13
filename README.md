# KNOUX VERSA - The Uncensored AI Nexus

A powerful full-stack AI image processing application with React frontend, Express backend, and Electron desktop support. Transform images with unlimited AI power using advanced machine learning algorithms.

## ✨ Features

### 🤖 AI Services

- **Magic Morph** - Transform anything with unlimited AI power
- **Remove & Replace** - Erase objects and fill with intelligent context
- **Style Transfer** - Transform to any artistic style (Anime, 3D, Van Gogh...)
- **Background Replace** - Generate or replace backgrounds with AI
- **Object Recolor** - Change colors of any object intelligently
- **Text2Image Add** - Add new objects with text descriptions
- **AI Enhance** - Upscale and enhance to Ultra HD quality
- **VIP Magic Morph** - Ultra-advanced AI for complex transformations

### 🎨 Advanced Features

- **Interactive Customization Panel** - Fine-tune every AI service
- **Before/After Comparison** - Stacked and side-by-side views
- **Multi-Language Support** - English and Arabic
- **Selection Tools** - Rectangle, Circle, and Freehand selection
- **Real-time Processing** - Live progress tracking
- **VIP Access System** - Encrypted premium features
- **Glass Morphism UI** - Modern, stunning interface
- **Electron Desktop App** - Native desktop experience

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- A Neon Database account (free tier available)

### Database Setup

1. **Create a Neon Database:**

   - Go to [https://neon.tech](https://neon.tech)
   - Create a free account
   - Create a new project
   - Go to your project dashboard and click "Connect"
   - Copy the PostgreSQL connection string

2. **Easy Setup (Recommended):**

   ```bash
   npm run setup
   ```

   Follow the interactive prompts to configure your database.

3. **Manual Setup:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and replace the `DATABASE_URL`:

   ```
   DATABASE_URL="postgresql://your-username:your-password@your-endpoint.neon.tech/your-database?sslmode=require"
   ```

### Installation & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Push database schema:**

   ```bash
   npm run db:push
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` (proxy) with the backend running on port 5000.

## 📱 Electron Desktop App

### Development

```bash
# Start web app and Electron together
npm run electron:dev

# Or start Electron separately
npm run electron
```

### Building Desktop App

```bash
# Build for current platform
npm run electron:dist

# Package without installer
npm run electron:pack

# Build for all platforms (requires additional setup)
npm run electron:build
```

### Supported Platforms

- **Windows** - NSIS installer and portable EXE
- **macOS** - DMG installer (x64 and ARM64)
- **Linux** - AppImage and DEB packages

## 🛠️ Available Scripts

### Web Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

### Electron Development

- `npm run electron:dev` - Start web + Electron
- `npm run electron` - Start Electron only
- `npm run electron:build` - Build desktop app
- `npm run electron:dist` - Build without publishing
- `npm run electron:pack` - Package for testing

### Database

- `npm run db:push` - Push database schema to Neon
- `npm run setup` - Interactive database setup

## 🏗️ Project Structure

```
versaa/
│
├── client/                     # React Frontend (TailwindCSS)
│   ├── src/
│   │   ├── components/         # All UI components
│   │   │   ├── ui/            # Shadcn/ui design system
│   │   │   ├── ServicesLayout.tsx    # AI services with customization
│   │   │   ├── ResultsComparison.tsx # Before/after image display
│   │   │   ├── SimpleImageCanvas.tsx # Image upload & selection
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Complete pages (Home.tsx)
│   │   └── App.tsx           # Frontend entry point
│   └── public/
│
├── server/                    # Express Backend
│   ├── ai/                   # AI processing modules
│   ├── routes.ts            # API endpoints
│   └── index.ts             # Server entry point
│
├── electron/                 # Electron Desktop App
│   ├── main.ts              # Electron main process
│   └── preload.js           # Secure IPC bridge
│
├── shared/                  # Shared code
│   └── schema.ts           # Database schema & types
│
├── assets/                  # App icons and resources
├── .env.example            # Environment template
├── package.json            # Dependencies & scripts
└── README.md               # This documentation
```

## 🎨 Design System

### Components Location

All UI components are in `client/src/components/`:

- **Design System**: `ui/` folder (Shadcn/ui based)
- **AI Services**: `ServicesLayout.tsx` - Service cards with customization
- **Image Processing**: `SimpleImageCanvas.tsx` - Upload & selection tools
- **Results Display**: `ResultsComparison.tsx` - Before/after comparison
- **Modals**: Processing, VIP access, language switching

### Styling Guidelines

- **Framework**: TailwindCSS with custom CSS variables
- **Theme**: Dark theme with neon accents (cyan, purple, pink)
- **Effects**: Glass morphism, neon glows, floating animations
- **Typography**: Orbitron for headings, Inter for body text
- **Responsive**: Mobile-first design with fluid scaling

## 🔧 AI Services Customization

Each AI service includes advanced customization options:

### Magic Morph

- Creativity Level (0-100%)
- Transformation Style (Realistic, Artistic, Fantasy, Anime)
- Preserve Facial Features (Toggle)

### Remove & Replace

- Fill Method (AI Generated, Context-Aware, Pattern Match)
- Edge Blending (0-100%)

### Style Transfer

- Style Strength (0-100%)
- Content Preservation (0-100%)
- Color Enhancement (Toggle)

### Background Replace

- Subject Detection Precision (0-100%)
- Lighting Adaptation (Toggle)
- Background Blur/Depth (0-50px)

### Object Recolor

- Color Accuracy (0-100%)
- Preserve Texture (Toggle)
- Color Mode (Replace, Tint, Overlay, Multiply)

### Text2Image Add

- Object Scale (10-200%)
- Perspective Matching (Toggle)
- Shadow Generation (Toggle)

### AI Enhance

- Upscale Factor (2x, 4x, 8x)
- Noise Reduction (0-100%)
- Detail Sharpening (0-100%)

### VIP Magic Morph

- AI Power Level (80-100%)
- Multi-Step Processing (Toggle)
- Ultra Quality Mode (Toggle)

## 🗃️ Database Schema

Uses **Neon Database** (serverless PostgreSQL) with **Drizzle ORM**:

### Tables

- `users` - User authentication
- `transformations` - AI processing history
- `vip_sessions` - Premium access management

### Key Features

- Type-safe database operations
- Automatic migrations
- Connection pooling
- SSL encryption

## 🔐 VIP System

### Features

- Encrypted access key validation
- Enhanced AI processing capabilities
- Priority queue processing
- Advanced customization options
- Exclusive transformation algorithms

### Setup

Place your VIP key in `vip.key` file (automatically encrypted in Electron builds).

## 🌍 Multi-Language Support

### Supported Languages

- **English** - Full support
- **العربية (Arabic)** - Complete translation with RTL support

### Adding Languages

1. Extend `useLanguage.ts` hook
2. Add translations to the language map
3. Update UI components with `t()` function calls

## 🔧 Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is correctly formatted
- Check Neon database status and connection limits
- Verify SSL mode is set to `require`
- Try running `npm run setup` for guided configuration

### Development Server Issues

- Install dependencies: `npm install`
- Check ports: Backend (5000), Frontend (3000)
- Verify environment variables in `.env`
- Clear cache: `rm -rf node_modules/.cache`

### Electron Build Issues

- Ensure all dependencies are installed
- Check Node.js version compatibility
- Verify build assets exist in `assets/` folder
- Run `npm run check` for TypeScript errors

### AI Processing Issues

- Check API endpoints are accessible
- Verify image upload size limits (10MB max)
- Ensure proper image formats (JPG, PNG, WebP)
- Check network connectivity for AI services

## 🚀 Deployment

### Web Application

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to your hosting platform
3. Configure environment variables on the server
4. Ensure database is accessible from production

### Desktop Application

1. Build for your platform:

   ```bash
   npm run electron:dist
   ```

2. Distribute the installer from `release/` folder
3. Include VIP key for premium features
4. Configure auto-updater (optional)

## 📄 License

MIT License - Created by **Sadek Elgazar**

## 🙏 Support

Support the creator on [BuyMeACoffee](https://buymeacoffee.com/knoux) ✨

---

**KNOUX VERSA** - Transform your vision into reality with unlimited AI power.
