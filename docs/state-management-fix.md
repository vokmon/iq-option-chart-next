# State Management Fix: Shared Bollinger Bands State

## Problem

Previously, there were **two separate `useBollingerBands` hooks** being used:

1. **Home.page.tsx**: `const { showBollingerBands, bollingerConfig } = useBollingerBands();`
2. **BollingerBands.tsx**: `useBollingerBands(initialConfig, initialShow)`

This created **two independent states**, meaning:

- Changes in the BollingerBands component wouldn't affect the Chart
- Changes in the Chart wouldn't affect the BollingerBands component
- The UI controls and the actual chart were out of sync

## Solution

### ✅ **Before (Two Independent States)**

```typescript
// Home.page.tsx
const { showBollingerBands, bollingerConfig } = useBollingerBands();

// BollingerBands.tsx
const { showBollingerBands, setShowBollingerBands, ... } = useBollingerBands();
// ❌ This creates a separate state!
```

### ✅ **After (Single Shared State)**

```typescript
// Home.page.tsx - Single source of truth
const {
  showBollingerBands,
  setShowBollingerBands,
  bollingerConfig,
  updatePeriod,
  updateStdDev,
} = useBollingerBands();

// BollingerBands.tsx - Controlled component
<BollingerBands
  showBollingerBands={showBollingerBands}
  onToggleBollingerBands={setShowBollingerBands}
  bollingerConfig={bollingerConfig}
  onUpdatePeriod={updatePeriod}
  onUpdateStdDev={updateStdDev}
/>;
```

## Changes Made

### 1. **Updated BollingerBands Component**

- **Before**: Used `useBollingerBands` hook internally
- **After**: Accepts controlled props from parent

```typescript
// Before
export function BollingerBands({ initialConfig, initialShow, ... }) {
  const { showBollingerBands, setShowBollingerBands, ... } = useBollingerBands();
  // ...
}

// After
export function BollingerBands({
  showBollingerBands,
  onToggleBollingerBands,
  bollingerConfig,
  onUpdatePeriod,
  onUpdateStdDev,
  size = "sm",
}) {
  return <BollingerBandsComponent {...props} />;
}
```

### 2. **Updated Home.page.tsx**

- **Before**: Only used `showBollingerBands` and `bollingerConfig`
- **After**: Uses all hook methods and passes them to BollingerBands

```typescript
// Before
const { showBollingerBands, bollingerConfig } = useBollingerBands();
<BollingerBands size="sm" />;

// After
const {
  showBollingerBands,
  setShowBollingerBands,
  bollingerConfig,
  updatePeriod,
  updateStdDev,
} = useBollingerBands();

<BollingerBands
  showBollingerBands={showBollingerBands}
  onToggleBollingerBands={setShowBollingerBands}
  bollingerConfig={bollingerConfig}
  onUpdatePeriod={updatePeriod}
  onUpdateStdDev={updateStdDev}
  size="sm"
/>;
```

## Benefits

### ✅ **Single Source of Truth**

- Only one `useBollingerBands` hook in the entire app
- All state changes flow through the same hook
- No state synchronization issues

### ✅ **Synchronized UI**

- Chart and controls are always in sync
- Changes in controls immediately affect the chart
- Changes in chart configuration immediately affect controls

### ✅ **Better Performance**

- No duplicate state management
- No unnecessary re-renders from multiple hooks
- Cleaner component hierarchy

### ✅ **Easier Debugging**

- Single place to track state changes
- Clear data flow from parent to child
- No confusion about which state is being used

## Testing the Fix

To verify the fix works:

1. **Toggle the switch** in BollingerBands component

   - ✅ Chart should show/hide Bollinger Bands immediately

2. **Change the period** in the NumberInput

   - ✅ Chart should recalculate and redraw Bollinger Bands

3. **Change the standard deviation** in the NumberInput

   - ✅ Chart should recalculate and redraw Bollinger Bands

4. **All changes should be reflected in both components simultaneously**

## Architecture

```
Home.page.tsx (Single State Source)
├── useBollingerBands() hook
├── Chart component (receives state)
└── BollingerBands component (receives state + handlers)
    └── BollingerBandsComponent (pure UI)
```

The state now flows in one direction: **Home.page.tsx → Chart & BollingerBands**, ensuring perfect synchronization! 🎉
