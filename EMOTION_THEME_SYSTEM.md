# Emotion-Based Adaptive Theme System

## ✅ Implementation Complete

A complete psychology-backed adaptive theme system that dynamically changes the UI based on detected emotions to improve user's emotional state.

---

## 🎨 Features

### 1. **Psychology-Based Theme Presets**

Five emotion-based themes designed using color therapy principles:

- **Happy Theme (Joyful Uplift)**: Soft yellow, aqua blue, pastel pink - Amplifies joy and energy
- **Sad Theme (Warm Comfort)**: Warm peach, lavender, mint green - Uplifts mood and provides comfort
- **Angry Theme (Cooling Calm)**: Cool blue, teal, forest green - Calms nervous system and reduces tension
- **Anxious Theme (Peaceful Control)**: Dusty blue, muted violet, soft white - Reduces chaos and increases control
- **Neutral Theme (Gentle Activation)**: Beige, pastel green, mild yellow - Adds gentle motivation

### 2. **Theme Suggestion Modal**

- Appears automatically when emotions are detected (confidence > 60% for text, > 70% for facial)
- Shows theme preview with color swatches
- User-friendly message: "I noticed you're feeling [emotion]. I have a theme designed to improve your mood."
- Buttons: "Apply Theme" or "No Thanks"
- Smooth animations using Framer Motion

### 3. **Reset Theme Button**

- Floating button in bottom-right corner (only visible when custom theme is active)
- Confirmation dialog before resetting
- Returns to default theme
- Persistent across page reloads

### 4. **Automatic Theme Persistence**

- Themes are saved to localStorage
- Automatically restored on page reload
- Seamless user experience

---

## 📁 Files Created/Modified

### New Files:
1. **`src/utils/themeManager.ts`**
   - Theme presets with psychology-based colors
   - `mapEmotionToTheme()` - Maps emotions to recommended themes
   - `applyTheme()` - Applies theme to document
   - `resetTheme()` - Resets to default
   - `loadSavedTheme()` - Loads from localStorage
   - `initializeTheme()` - Initializes on app load

2. **`src/components/ThemeSuggestionModal.tsx`**
   - Modal component with theme preview
   - Color swatches display
   - Apply/Cancel buttons

3. **`src/components/ResetThemeButton.tsx`**
   - Floating reset button
   - Only shows when custom theme is active
   - Confirmation dialog

### Modified Files:
1. **`src/App.tsx`**
   - Added theme initialization on mount
   - Added ResetThemeButton component

2. **`src/pages/Chat.tsx`**
   - Integrated theme suggestion on emotion detection
   - Shows modal after 1.5 seconds delay
   - Works with both ML and fallback emotion detection

3. **`src/pages/FacialEmotion.tsx`**
   - Integrated theme suggestion on facial emotion detection
   - Shows modal after 2 seconds delay
   - Prevents spam (30 second cooldown between suggestions)

---

## 🧠 Psychology Principles Applied

### Color Therapy Research:
- **Warm colors** (orange, peach) → Comfort and emotional elevation
- **Cool colors** (blue, teal) → Calming and tension release
- **Soft pastels** → Reduce visual stress and overstimulation
- **Gentle gradients** → Create sense of flow and peace

### Emotional Goals:
- **Happy**: Reinforce positivity without overstimulation
- **Sad**: Elevate mood and provide emotional comfort
- **Angry**: Cool nervous system and reduce sympathetic arousal
- **Anxious**: Lower physiological intensity and increase control
- **Neutral**: Add gentle activation and brightness

---

## 🔧 Technical Implementation

### CSS Variables System:
Themes use CSS custom properties that match the existing design system:
- `--background`, `--foreground`
- `--primary`, `--secondary`, `--accent`
- `--gradient-calm`, `--gradient-card`
- `--shadow-soft`

### Smooth Transitions:
- 0.4s ease transitions for theme changes
- Prevents jarring visual changes
- Maintains calm, peaceful experience

### State Management:
- localStorage for persistence
- React state for modal visibility
- Ref-based tracking to prevent suggestion spam

---

## 🎯 User Experience Flow

1. **Emotion Detected** (text or facial)
   - System maps emotion to recommended theme
   - Checks confidence threshold
   - Waits brief moment (1.5-2 seconds)

2. **Modal Appears**
   - Shows detected emotion
   - Displays theme preview
   - Explains mood improvement goal

3. **User Choice**
   - **Apply Theme**: Theme changes smoothly, saved to localStorage
   - **No Thanks**: Modal closes, no theme applied

4. **Reset Available**
   - Floating button appears when custom theme active
   - One-click reset to default
   - Confirmation prevents accidental resets

---

## 🚀 Usage

### Automatic:
- Themes are suggested automatically when emotions are detected
- No user action required to trigger suggestions

### Manual Reset:
- Click the floating reset button (bottom-right)
- Confirm in dialog
- Theme returns to default

### Persistence:
- Selected themes persist across:
  - Page refreshes
  - Browser sessions
  - Navigation between pages

---

## 📊 Emotion → Theme Mapping

| Emotion | Theme | Goal |
|---------|-------|------|
| Happy, Joy, Excitement | Happy (Joyful Uplift) | Amplify positivity |
| Sad, Grief, Disappointment | Sad (Warm Comfort) | Uplift and comfort |
| Angry, Annoyance, Disgust | Angry (Cooling Calm) | Calm and ground |
| Fear, Anxiety, Nervousness | Anxious (Peaceful Control) | Reduce intensity |
| Neutral, Low Energy | Neutral (Gentle Activation) | Add motivation |
| Default | Default | Original calm theme |

---

## ✨ Key Features

✅ **Non-intrusive**: Only suggests when appropriate  
✅ **Smooth transitions**: 0.4s ease animations  
✅ **Persistent**: Saves user preferences  
✅ **Psychology-backed**: Based on color therapy research  
✅ **User-controlled**: Always optional, easy to reset  
✅ **Integrated**: Works with both text and facial emotion detection  

---

## 🎨 Theme Preview

Each theme includes:
- **Background colors**: Soft, calming base
- **Primary colors**: Main accent (emotion-appropriate)
- **Secondary colors**: Supporting accent
- **Gradients**: Smooth, flowing backgrounds
- **Shadows**: Soft, gentle depth

All colors use HSL format for easy manipulation and consistency.

---

## 🔍 Testing

To test the theme system:

1. **Text Emotion Detection**:
   - Go to `/chat`
   - Type: "I'm feeling really sad today"
   - Wait 1.5 seconds
   - Modal should appear suggesting "Warm Comfort" theme

2. **Facial Emotion Detection**:
   - Go to `/facial-emotion`
   - Show a sad expression to camera
   - Wait 2 seconds (if confidence > 70%)
   - Modal should appear

3. **Theme Reset**:
   - Apply any theme
   - Look for floating button (bottom-right)
   - Click to reset

---

## 📝 Notes

- Themes are designed to be **calm and subtle**, not dramatic
- Visual changes are **smooth and gradual** (0.4s transitions)
- System **respects user choice** - always optional
- **No breaking changes** - all existing features work as before
- **Accessible** - maintains contrast ratios and readability

---

## 🎉 Summary

The emotion-based adaptive theme system is fully functional and integrated. It provides a unique, psychology-backed way to improve user's emotional state through carefully designed color themes that respond to their detected emotions.

