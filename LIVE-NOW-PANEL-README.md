# Knoux Live Now Panel

A premium live broadcast interface component for the Knoux VERSA project that displays real-time status of AI tools in operation.

## Features

- **Real-time Status Display**: Shows current AI tool, model, privacy settings, and operation status
- **Glassmorphism + Neon Design**: Premium visual design matching Knoux VERSA aesthetic
- **Pulsing Live Indicator**: Dynamic visual indicator that pulses every 800ms with status-based colors
- **Interactive Controls**: Stop task, switch tool, and show logs functionality
- **Responsive Design**: Optimized for desktop use with hover effects
- **Multi-language Support**: Arabic and English text support

## Status Colors

- **Running** (🟢): Green (`#00FF88`) - Active processing
- **Paused** (🟡): Yellow (`#FFD700`) - Idle/waiting state
- **Error** (🔴): Red (`#FF4444`) - Error state

## Props

```typescript
interface LiveNowPanelProps {
  tool: string; // Name of the current AI tool
  model: string; // AI model being used
  privacy: string; // Privacy status text
  status: "Running" | "Paused" | "Error"; // Current operation status
  onStop?: () => void; // Callback for stop button
  onSwitch?: () => void; // Callback for switch tool button
  onShowLogs?: () => void; // Callback for show logs (panel click)
  className?: string; // Additional CSS classes
}
```

## Usage

```typescript
import LiveNowPanel from "@/components/LiveNowPanel";

function App() {
  const [status, setStatus] = useState<"Running" | "Paused" | "Error">("Running");

  return (
    <LiveNowPanel
      tool="Knoux VERSA"
      model="SDXL Turbo"
      privacy="No Censorship"
      status={status}
      onStop={() => setStatus("Paused")}
      onSwitch={() => console.log("Tool switched")}
      onShowLogs={() => alert("Opening logs...")}
    />
  );
}
```

## Integration in Knoux VERSA

The component is integrated into the main `Home.tsx` page as a floating panel that:

1. **Automatically syncs** with the processing state of the application
2. **Updates status** based on `isProcessing`, `isLocalProcessing`, and `error` states
3. **Changes model name** based on the selected service
4. **Provides interactive controls** for task management

## Styling

The component uses the existing Knoux VERSA design system:

- **Glassmorphism effects** with `glass-strong` class
- **Neon colors** from the established color palette
- **Custom animations** for live pulse and glow effects
- **Hover effects** with scale and glow enhancements

## CSS Dependencies

The component requires these CSS animations (already added to `index.css`):

```css
@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 20px currentColor;
  }
  50% {
    opacity: 0.3;
    box-shadow: none;
  }
}

@keyframes neon-text {
  0%,
  100% {
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.75);
  }
  50% {
    text-shadow:
      0 0 10px rgba(0, 229, 255, 1),
      0 0 20px rgba(0, 229, 255, 0.8);
  }
}
```

## Design Philosophy

The LiveNowPanel embodies the Knoux VERSA principles:

- **Premium Feel**: High-quality visual design with attention to detail
- **User Control**: Clear visual feedback and intuitive interactions
- **Performance**: Smooth animations without impacting performance
- **Accessibility**: Clear status indicators and readable text
- **Brand Consistency**: Matches the overall Knoux aesthetic

---

_Created for Knoux VERSA - The Uncensored AI Nexus_
