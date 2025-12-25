# Story 7.5: Community Map UX Enhancement

Status: done

## Story

As a User,
I want a clean, static community map without zoom controls,
So that I have a consistent, predictable map viewing experience.

## Acceptance Criteria

1. **Given** a user views the landing page
2. **When** the Community Map section loads
3. **Then** the map should display at a fixed optimal zoom level
4. **And** zoom in/out buttons should be REMOVED
5. **And** scroll wheel zoom should be DISABLED
6. **And** pinch-to-zoom on mobile should be DISABLED
7. **And** map panning/dragging should be DISABLED
8. **And** state hover tooltips should STILL work
9. **And** the map should fit nicely within the container (like mypeta.ai)

## Tasks/Subtasks

- [ ] Remove zoom control buttons (+/-) from UI <!-- id: 1 -->
- [ ] Remove `ZoomableGroup` wrapper component <!-- id: 2 -->
- [ ] Set fixed projection scale to fit Malaysia nicely <!-- id: 3 -->
- [ ] Disable all zoom/pan interactions <!-- id: 4 -->
- [ ] Keep hover tooltip functionality intact <!-- id: 5 -->
- [ ] Adjust container styling for cleaner presentation <!-- id: 6 -->
- [ ] Test on mobile devices <!-- id: 7 -->

## Technical Requirements

### Current Implementation (to be removed)

```tsx
// REMOVE: ZoomableGroup enables zoom/pan
<ZoomableGroup
  zoom={position.zoom}
  center={position.coordinates}
  onMoveEnd={handleMoveEnd}
  minZoom={0.5}
  maxZoom={4}
>
  <Geographies>...</Geographies>
</ZoomableGroup>

// REMOVE: Zoom state and handlers
const [position, setPosition] = useState({ coordinates: [...], zoom: 1 });
function handleZoomIn() { ... }
function handleZoomOut() { ... }

// REMOVE: Zoom control buttons
<Button onClick={handleZoomIn}>+</Button>
<Button onClick={handleZoomOut}>-</Button>
```

### New Implementation (simplified)

```tsx
export function CommunityMap() {
  const { data = [], isLoading } = useCommunityLocations();
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // ... colorScale and totalUsers remain unchanged

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header - unchanged */}
      
      {/* Map Container - simplified */}
      <div className="relative w-full h-[300px] md:h-[400px] border-2 border-green-500/30 bg-gray-900/80 overflow-hidden">
        {/* REMOVED: Zoom Controls */}
        
        {/* Tooltip - unchanged */}
        
        <div className="w-full h-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 3500,  // Adjust for best fit
              center: [109, 4],
            }}
            width={800}
            height={400}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {/* No ZoomableGroup wrapper - map is now static! */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={...}
                    stroke="#22c55e"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", cursor: "default" },
                      hover: { fill: "#4ade80", outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={...}
                    onMouseLeave={...}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
        
        {/* Legend - unchanged */}
      </div>
    </div>
  );
}
```

### Reference Design: mypeta.ai

The mypeta.ai map has these characteristics:
- Fixed zoom level showing all of Malaysia
- Clean, minimal styling
- Hover effects on states with tooltips
- No zoom/pan controls
- Slight visual effects on interaction

## Architecture Compliance

- **Component Location**: `src/features/landingpage/components/community-map.tsx`
- **No New Dependencies**: Uses existing `react-simple-maps`
- **Simplification**: Removes unused zoom state and handlers

## Dev Notes

- This is a **simplification** - we're removing code, not adding
- May need to adjust `projectionConfig.scale` and `center` for optimal fit
- Consider removing `cursor-grab` CSS classes since panning is disabled
- Mobile: ensure touch interactions don't trigger unwanted behaviors

### Verification Checklist

- [ ] Zoom buttons removed from UI
- [ ] Scroll wheel does NOT zoom the map
- [ ] Pinch-to-zoom does NOT work on mobile
- [ ] Map cannot be dragged/panned
- [ ] Hover tooltips still show state names and dev counts
- [ ] Map displays Malaysia at optimal fixed zoom
- [ ] No visual regressions

### References

- [mypeta.ai](https://mypeta.ai/) - Reference design for static map
- [react-simple-maps docs](https://www.react-simple-maps.io/docs/composable-map/)
