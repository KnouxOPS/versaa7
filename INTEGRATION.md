# KNOUX VERSA - Integration Guide

This document provides a comprehensive overview of the enhanced KNOUX VERSA application architecture and integration points.

## 🏗️ Application Architecture

### Frontend Architecture

```
client/src/
├── components/
│   ├── ui/                     # Shadcn/ui design system
│   ├── ServicesLayout.tsx      # AI services with customization panels
│   ├── ResultsComparison.tsx   # Before/after image display (stacked)
│   ├── SimpleImageCanvas.tsx   # Image upload and selection tools
│   ├── PromptNexus.tsx        # AI command interface
│   └── ...
├── hooks/
│   ├── useImageTransform.ts    # Image transformation logic
│   └── useLanguage.ts         # Multi-language support
├── pages/
│   └── Home.tsx              # Main application page with tabs
└── App.tsx
```

### Backend Architecture

```
server/
├── ai/                        # AI processing modules
│   ├── huggingface.ts        # Hugging Face API integration
│   ├── stableDiffusion.ts    # Stable Diffusion processing
│   └── imageProcessor.ts     # Image processing utilities
├── routes.ts                 # API endpoints
├── db.ts                     # Database connection
└── index.ts                  # Express server
```

### Desktop Application

```
electron/
├── main.ts                   # Electron main process with menu system
├── preload.js               # Secure IPC bridge
└── assets/                  # Application icons and resources
```

## 🎨 Design System Integration

### Component Structure

All components follow a consistent pattern:

```typescript
interface ComponentProps {
  // Typed props with clear interfaces
}

export function Component({ prop1, prop2 }: ComponentProps) {
  const { t } = useLanguage(); // Multi-language support

  return (
    <Card className="glass rounded-2xl">
      {/* Glass morphism styling */}
    </Card>
  );
}
```

### Styling Guidelines

- **Base**: TailwindCSS with custom CSS variables
- **Effects**: Glass morphism, neon glows, floating animations
- **Colors**: Neon cyan (#00FFFF), purple (#8B5CF6), dark theme
- **Typography**: Orbitron for headings, Inter for body

### Custom CSS Classes

```css
.glass                 /* Glass morphism background */
.glass-strong          /* Enhanced glass effect */
.neon-text            /* Neon text glow */
.neon-glow            /* Neon box glow */
.animate-float        /* Floating animation */
.animate-pulse-glow   /* Pulsing glow effect */
.vip-exclusive        /* VIP service styling */
.slider-cyan          /* Custom slider styling */
```

## 🔧 AI Services Integration

### Service Configuration

Each AI service is defined with:

```typescript
interface Service {
  id: string;
  icon: string;
  color: string;
  bgColor: string;
  titleKey: string;
  descKey: string;
  category: string;
  customizations: ServiceCustomization[];
}
```

### Customization System

Services support various customization types:

- **Slider**: Numeric range controls (0-100%)
- **Select**: Dropdown options
- **Toggle**: Boolean switches
- **Color**: Color picker
- **Text**: Text input fields

### Adding New Services

1. Add service definition to `ServicesLayout.tsx`
2. Define customization options
3. Update backend processing in `server/ai/`
4. Add translations to `useLanguage.ts`

## 📱 Electron Integration

### Main Process Features

- **Splash Screen**: Animated loading screen
- **Menu System**: Native application menus
- **File Operations**: Open/save dialogs
- **VIP Key Validation**: Secure key checking
- **Window Management**: Responsive window sizing

### IPC Communication

Secure communication between main and renderer processes:

```typescript
// Renderer Process (React)
const electronAPI = (window as any).electronAPI;
electronAPI.onNewTransformation(() => {
  // Handle menu action
});

// Main Process (Electron)
ipcMain.handle("validate-vip-key", (event, key) => {
  // Validate VIP access
});
```

### Building Desktop App

```bash
npm run electron:build    # Full build with installer
npm run electron:dist     # Build without publishing
npm run electron:pack     # Package for testing
```

## 🗃️ Database Integration

### Schema Design

```typescript
// shared/schema.ts
export const transformations = pgTable("transformations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  originalImageUrl: text("original_image_url").notNull(),
  transformedImageUrl: text("transformed_image_url").notNull(),
  prompt: text("prompt").notNull(),
  service: text("service").notNull(),
  selectionData: text("selection_data"),
  quality: text("quality").notNull().default("standard"),
  isVIP: boolean("is_vip").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Database Operations

- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL
- **Connection Pooling**: Efficient resource management
- **SSL Encryption**: Secure data transmission

## 🔐 VIP System Integration

### Access Control

```typescript
// VIP key validation
const isVIPValid = await electronAPI.validateVipKey(key);

// Service-level restrictions
if (service.isVIP && !vipSession) {
  setShowVIPModal(true);
  return;
}
```

### VIP Features

- Enhanced AI processing capabilities
- Priority queue access
- Advanced customization options
- Exclusive transformation algorithms

## 🌍 Multi-Language Support

### Implementation

```typescript
const { t, currentLanguage, toggleLanguage } = useLanguage();

// Usage in components
<h1>{t("Transform Images with AI Magic")}</h1>
```

### Adding Languages

1. Extend language map in `useLanguage.ts`
2. Add translations for all text keys
3. Update RTL support for right-to-left languages

## 🚀 Deployment Integration

### Web Application

1. Build: `npm run build`
2. Deploy `dist/public/` folder
3. Configure environment variables
4. Ensure database connectivity

### Desktop Application

1. Build: `npm run electron:dist`
2. Distribute installer from `release/`
3. Include VIP key file
4. Configure auto-updater (optional)

## 🔧 Development Workflow

### Starting Development

```bash
# Database setup
npm run setup
npm run db:push

# Web development
npm run dev

# Electron development
npm run electron:dev
```

### Code Structure

- **Components**: Modular, reusable UI components
- **Hooks**: Custom React hooks for state management
- **Services**: Backend API integration
- **Types**: Shared TypeScript interfaces
- **Styles**: TailwindCSS with custom CSS

### Best Practices

1. **Component Isolation**: Each component handles its own state
2. **Type Safety**: Full TypeScript coverage
3. **Error Handling**: Comprehensive error boundaries
4. **Performance**: Optimized rendering and lazy loading
5. **Accessibility**: ARIA labels and keyboard navigation

## 📊 Performance Considerations

### Frontend Optimization

- Code splitting with dynamic imports
- Image optimization and lazy loading
- State management with React hooks
- Memoization for expensive calculations

### Backend Optimization

- Connection pooling for database
- Image processing queue management
- Caching for AI service responses
- Rate limiting for API endpoints

### Electron Optimization

- Preload scripts for security
- Main process optimization
- Renderer process isolation
- Memory management

## 🔍 Debugging and Monitoring

### Development Tools

- React Developer Tools
- Electron Developer Tools
- Database query logging
- Network request monitoring

### Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Automatic error reporting
- Graceful degradation

## 📈 Future Enhancements

### Planned Features

- Real-time collaboration
- Cloud storage integration
- Advanced AI models
- Plugin system
- Mobile application

### Architecture Scalability

- Microservices architecture
- Container deployment
- Load balancing
- CDN integration

---

This integration guide provides a comprehensive overview of the KNOUX VERSA application architecture. For specific implementation details, refer to the individual component files and documentation.
