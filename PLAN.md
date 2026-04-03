# Grit UI v2 — Cross-Platform React Component Library

## Overview

Port the 84-component Rust/Leptos library to React, creating a unified component system that works across all Grit architectures: web (React DOM), mobile (React Native + NativeWind), and desktop (Wails webview).

**Location:** `D:/Projects/GO FRAMEWORK/grit-ui-crossplatform`
**GitHub:** `https://github.com/MUKE-coder/grit-ui-crossplatform`
**Replaces:** The old `packages/grit-ui/` (100 shadcn marketing/auth/SaaS components) in scaffolded projects

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Web styling | Tailwind CSS v4 | Same as Rust version, consistent with Grit |
| Mobile styling | NativeWind v4 | Tailwind for React Native — same className API as web |
| Variant system | CVA (class-variance-authority) | Type-safe variants, closest to Rust `variants!` macro |
| Class merging | tailwind-merge + clsx | Industry standard, already used in Grit |
| Monorepo tool | Turborepo + pnpm | Same tooling as Grit projects |
| Component model | Copy-paste (shadcn-style) | Users own the code, no version lock-in |
| Registry format | JSON (shadcn-compatible) | CLI installs from registry, same as current Grit UI |
| New projects | Do NOT ship grit-ui by default | Users install components on demand via CLI |

## Architecture

```
grit-ui-crossplatform/
├── packages/
│   ├── core/                     # Shared: types, variants, theme, utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── cn.ts             # clsx + tailwind-merge
│   │   │   ├── variants.ts       # CVA variant factory
│   │   │   ├── theme.ts          # OKLCH color tokens, CSS variables
│   │   │   └── types.ts          # Shared prop types (Size, Variant, etc.)
│   │   ├── package.json          # @grit-ui/core
│   │   └── tsconfig.json
│   ├── web/                      # React DOM components (84)
│   │   ├── src/
│   │   │   ├── index.ts          # Re-exports all components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (84 total)
│   │   ├── package.json          # @grit-ui/web
│   │   └── tsconfig.json
│   ├── native/                   # React Native components (84)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── button.tsx        # NativeWind + RN Pressable
│   │   │   ├── card.tsx          # NativeWind + RN View
│   │   │   └── ... (84 total)
│   │   ├── package.json          # @grit-ui/native
│   │   └── tsconfig.json
│   ├── hooks/                    # Cross-platform hooks (27)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── use-click-outside.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-is-mobile.ts
│   │   │   ├── use-copy-clipboard.ts
│   │   │   ├── use-lock-body-scroll.ts
│   │   │   └── ... (27 total)
│   │   ├── package.json          # @grit-ui/hooks
│   │   └── tsconfig.json
│   └── cli/                      # CLI tool
│       ├── src/
│       │   ├── index.ts          # grit-ui add <component>
│       │   ├── commands/
│       │   │   ├── add.ts        # Add component(s) to project
│       │   │   ├── init.ts       # Initialize grit-ui in project
│       │   │   └── list.ts       # List available components
│       │   └── registry.ts       # Fetch from registry
│       ├── package.json          # @grit-ui/cli (bin: grit-ui)
│       └── tsconfig.json
├── registry/                     # Component registry (JSON files)
│   ├── index.json                # All components metadata
│   ├── web/                      # Web component source
│   │   ├── button.json
│   │   └── ...
│   └── native/                   # Native component source
│       ├── button.json
│       └── ...
├── apps/
│   └── docs/                     # Documentation site (Next.js)
│       └── ...                   # Component previews, API docs
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── README.md
├── PLAN.md                       # This file
└── CHANGELOG.md
```

## Component List (84 Components — Full Parity with Rust Version)

### Phase 1: Core Primitives (20 components) — Week 1
These are the building blocks everything else depends on.

| # | Component | Web | Native | Priority |
|---|-----------|-----|--------|----------|
| 1 | Button | `<button>` | `<Pressable>` | P0 |
| 2 | Input | `<input>` | `<TextInput>` | P0 |
| 3 | Label | `<label>` | `<Text>` | P0 |
| 4 | Checkbox | `<input type="checkbox">` | `<Pressable>` + icon | P0 |
| 5 | Radio Button | `<input type="radio">` | `<Pressable>` + icon | P0 |
| 6 | Switch | `<button role="switch">` | `<Switch>` | P0 |
| 7 | Textarea | `<textarea>` | `<TextInput multiline>` | P0 |
| 8 | Select | Custom dropdown | `<Picker>` or custom | P0 |
| 9 | Badge | `<span>` | `<View>` + `<Text>` | P0 |
| 10 | Avatar | `<img>` + fallback | `<Image>` + fallback | P0 |
| 11 | Card | `<div>` sections | `<View>` sections | P0 |
| 12 | Separator | `<hr>` / `<div>` | `<View>` | P0 |
| 13 | Skeleton | Animated `<div>` | Animated `<View>` | P0 |
| 14 | Spinner | CSS animation | `<ActivityIndicator>` | P0 |
| 15 | Progress | `<progress>` / `<div>` | `<View>` animated | P0 |
| 16 | Alert | `<div role="alert">` | `<View>` | P0 |
| 17 | KBD | `<kbd>` | `<Text>` styled | P1 |
| 18 | Link | `<a>` | `<Link>` (Expo Router) | P0 |
| 19 | Image | `<img>` optimized | `<Image>` | P0 |
| 20 | Chips | `<span>` + dismiss | `<View>` + dismiss | P1 |

### Phase 2: Layout & Navigation (14 components) — Week 1-2

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 21 | Tabs | Tab panels | Tab view |
| 22 | Accordion | Collapsible sections | Animated sections |
| 23 | Collapsible | Toggle visibility | Animated height |
| 24 | Breadcrumb | `<nav>` trail | `<View>` trail |
| 25 | Pagination | Page buttons | Page buttons |
| 26 | Bottom Nav | Fixed bottom bar | Tab bar |
| 27 | Sidenav | Sidebar layout | Drawer |
| 28 | Menubar | macOS-style menu | N/A (web only) |
| 29 | Navigation Menu | `<nav>` with links | `<View>` with links |
| 30 | Header | Page header | Screen header |
| 31 | Footer | Page footer | N/A (web only) |
| 32 | Item | List item | `<Pressable>` row |
| 33 | Scroll Area | Custom scrollbar | `<ScrollView>` |
| 34 | Aspect Ratio | CSS aspect-ratio | Calculated dimensions |

### Phase 3: Overlays & Feedback (10 components) — Week 2

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 35 | Dialog | Portal modal | `<Modal>` |
| 36 | Alert Dialog | Confirmation modal | `<Modal>` confirm |
| 37 | Drawer | Side panel | `<Modal>` slide |
| 38 | Tooltip | Hover popup | Long-press popup |
| 39 | Popover | Click popup | `<Modal>` positioned |
| 40 | Hover Card | Hover preview | Long-press preview |
| 41 | Context Menu | Right-click menu | Long-press menu |
| 42 | Dropdown Menu | Click menu | Action sheet |
| 43 | Toast / Sonner | Toast notification | `<Animated.View>` toast |
| 44 | Callout | Info block | Info block |

### Phase 4: Forms & Input (10 components) — Week 2-3

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 45 | Field | Form field wrapper | Form field wrapper |
| 46 | Form | Form container | Form container |
| 47 | Auto Form | Auto-generate from schema | Auto-generate |
| 48 | Input OTP | Code input | Code input |
| 49 | Input Phone | Phone + country | Phone + country |
| 50 | Input Group | Icon + input + button | Icon + input + button |
| 51 | Multi Select | Multi-value dropdown | Multi-value picker |
| 52 | Select Native | `<select>` native | `<Picker>` |
| 53 | Radio Button Group | Grouped radios | Grouped radios |
| 54 | Toggle Group | Grouped toggles | Grouped toggles |

### Phase 5: Data Display (10 components) — Week 3

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 55 | Table | `<table>` | `<FlatList>` rows |
| 56 | Data Table | Sortable/filterable | Sortable/filterable |
| 57 | Data Grid | Spreadsheet-like | Spreadsheet-like |
| 58 | Empty | Empty state | Empty state |
| 59 | Status | Status badge | Status badge |
| 60 | Shimmer | Loading shimmer | Loading shimmer |
| 61 | Bento Grid | CSS Grid layout | Flex grid |
| 62 | Charts (Area) | SVG/Canvas | react-native-svg |
| 63 | Charts (Bar) | SVG/Canvas | react-native-svg |
| 64 | Charts (Line) | SVG/Canvas | react-native-svg |

### Phase 6: Advanced & Animation (14 components) — Week 3-4

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 65 | Charts (Pie) | SVG/Canvas | react-native-svg |
| 66 | Charts (Radar) | SVG/Canvas | react-native-svg |
| 67 | Charts (Radial) | SVG/Canvas | react-native-svg |
| 68 | Date Picker | Calendar popup | Calendar modal |
| 69 | Date Picker Dual | Date range | Date range |
| 70 | Carousel | Slide carousel | `<FlatList>` horizontal |
| 71 | Card Carousel | Card slider | Card slider |
| 72 | Drag and Drop | HTML5 drag API | `<PanGestureHandler>` |
| 73 | Command | Command palette | Search modal |
| 74 | Marquee | CSS animation | Animated scroll |
| 75 | Animate | CSS transitions | `<Animated.View>` |
| 76 | Animate Group | Grouped animations | Grouped animations |
| 77 | Pressable | Click/press state | `<Pressable>` |
| 78 | FAQTransition | FAQ accordion anim | FAQ accordion anim |

### Phase 7: Specialized (6 components) — Week 4

| # | Component | Web | Native |
|---|-----------|-----|--------|
| 79 | Chat | Chat UI | Chat UI |
| 80 | Action Bar | Sticky action bar | Sticky action bar |
| 81 | Mask | CSS mask utility | N/A (web only) |
| 82 | Direction Provider | RTL/LTR context | RTL/LTR context |
| 83 | Theme Toggle | Dark/light switch | Dark/light switch |
| 84 | Expandable | Expandable content | Expandable content |

## Hooks (27 — Ported from Rust Version)

| # | Hook | Platform | Purpose |
|---|------|----------|---------|
| 1 | useClickOutside | Web | Detect clicks outside element |
| 2 | useMediaQuery | Both | CSS media query detection |
| 3 | useIsMobile | Both | Mobile viewport detection |
| 4 | useCopyClipboard | Both | Copy to clipboard |
| 5 | useLockBodyScroll | Web | Prevent body scroll (modals) |
| 6 | useThemeMode | Both | Dark/light mode detection |
| 7 | usePagination | Both | Pagination state |
| 8 | usePressHold | Both | Long-press detection |
| 9 | useDataScrolled | Web | Scroll position detection |
| 10 | useHorizontalScroll | Web | Horizontal scroll state |
| 11 | useCanScroll | Web | Check scrollability |
| 12 | useHistory | Both | Undo/redo history |
| 13 | useForm | Both | Form state + validation |
| 14 | useVirtualScroll | Web | Virtual scrolling |
| 15 | useBreadcrumb | Both | Breadcrumb path |
| 16 | useColumnState | Both | Table column visibility |
| 17 | useCellEdit | Web | Grid cell editing |
| 18 | useCellSelection | Web | Grid cell selection |
| 19 | useDragSelection | Web | Drag-to-select |
| 20 | useDataGridState | Both | Full grid state |
| 21 | useHandleDayClick | Both | Date picker interaction |
| 22 | useCanScrollVertical | Web | Vertical scroll check |
| 23 | useLockBodyScrollDialog | Web | Dialog-specific scroll lock |
| 24 | useLockBodyScrollPopover | Web | Popover-specific scroll lock |
| 25 | useRandom | Both | Random ID generation |
| 26 | useDebounce | Both | Debounced value |
| 27 | useLocalStorage | Both | Persistent storage |

## Theme System

### OKLCH Color Tokens (from Rust version)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --success: oklch(0.65 0.16 145);
  --warning: oklch(0.65 0.16 55);
  --info: oklch(0.65 0.16 250);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.18 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --border: oklch(0.3 0 0);
  /* ... */
}
```

### Variant System (CVA-based)

```typescript
// Mirrors the Rust variants! macro
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap rounded-md font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border bg-background hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        xl: 'h-12 rounded-md px-8 text-lg',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

## CLI Commands

```bash
# Install CLI globally
npm install -g @grit-ui/cli

# Or use npx
npx @grit-ui/cli add button

# Initialize in a project
grit-ui init                    # Detects web vs native, adds config
grit-ui init --native           # Force React Native mode

# Add components
grit-ui add button              # Add single component
grit-ui add button card input   # Add multiple
grit-ui add --all               # Add all 84 components
grit-ui add --category forms    # Add all form components

# List available
grit-ui list                    # All components
grit-ui list --category         # Grouped by category

# Update
grit-ui update button           # Update a component
grit-ui diff button             # Show changes since install
```

## How It Integrates with Grit CLI

### Current behavior (v3.6):
```bash
grit new myapp --triple --next
# Scaffolds packages/grit-ui/ with 100 components (always included)
```

### New behavior (after this):
```bash
grit new myapp --triple --next
# Does NOT ship grit-ui. Clean project.
# Users install components on demand:
cd myapp
npx @grit-ui/cli init
npx @grit-ui/cli add button card input table
```

### For mobile:
```bash
grit new myapp --mobile
cd myapp/apps/expo
npx @grit-ui/cli init --native
npx @grit-ui/cli add button card input
# Installs React Native versions with NativeWind
```

## Implementation Order

### Week 1: Foundation + Core 20
- [ ] Set up monorepo (Turborepo + pnpm)
- [ ] Create @grit-ui/core (cn, variants, theme, types)
- [ ] Create @grit-ui/web package skeleton
- [ ] Create @grit-ui/native package skeleton
- [ ] Implement Phase 1: 20 core components (web)
- [ ] Implement Phase 1: 20 core components (native)

### Week 2: Layout + Overlays + Forms
- [ ] Implement Phase 2: 14 layout/navigation components
- [ ] Implement Phase 3: 10 overlay/feedback components
- [ ] Implement Phase 4: 10 form components
- [ ] Start @grit-ui/hooks (first 10 hooks)

### Week 3: Data + Advanced
- [ ] Implement Phase 5: 10 data display components
- [ ] Implement Phase 6: 14 advanced components (part 1)
- [ ] Complete remaining hooks (17 more)

### Week 4: Finish + CLI + Docs
- [ ] Implement Phase 6: remaining advanced components
- [ ] Implement Phase 7: 6 specialized components
- [ ] Build @grit-ui/cli
- [ ] Build registry (JSON files)
- [ ] Documentation site
- [ ] Update Grit CLI to stop shipping grit-ui by default
- [ ] Push to npm + GitHub

## Quality Standards

- Every component has TypeScript types
- Every variant is type-safe via CVA
- Every component supports className override
- Every component supports ref forwarding
- Dark mode works by default (CSS variables)
- Web components are accessible (ARIA)
- Native components follow RN accessibility patterns
- All components have JSDoc documentation
- All components have Storybook stories (web)
