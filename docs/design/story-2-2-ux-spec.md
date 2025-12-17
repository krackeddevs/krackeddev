# UX Design Spec: Live Stats & CTA (Cyberpunk/CRT Theme)

## Visual Language
- **Theme**: Dark, high contrast, retro-futuristic (CRT monitor style).
- **Colors**:
    - **Primary Neon**: `#00ff00` (Terminal Green) or `#00f3ff` (Cyber Blue)
    - **Background**: `#111` (Near Black) with scanline overlay.
    - **Text**: Monospace font (Courier, Fira Code, or similar system mono).

## Component: Live Stats
### Layout
- **Container**: 3-column grid (responsive: 1 column on mobile).
- **Cards**: "Holographic" border effect.
    - Border: 1px solid `rgba(0, 255, 0, 0.3)`
    - Box Shadow: `0 0 10px rgba(0, 255, 0, 0.1)`
    - Hover: Glitch effect or intensity boost.

### Content
1.  **Payout Volume**: "TOTAL BOUNTIES PAID" -> Display as Currency (e.g., "$12,450").
2.  **Active Bounties**: "LIVE MISSIONS" -> Display as Integer.
3.  **Hunters**: "ACTIVE AGENTS" -> Display as Integer.

### Animation
- **Counter**: Numbers should "count up" on mount (Slot machine style).
- **Scanline**: Subtle horizontal line moving down periodically.

## Component: Brand CTA
### Layout
- **Position**: Full-width section below stats.
- **Copy**: "NEED ELITE TALENT?" / "DEPLOY YOUR MISSION".
- **Button**:
    - Style: Solid Block, Inverse colors (Black text on Green bg).
    - Text: "INITIATE PROTOCOL" (or "Post a Bounty" for clarity).
    - Interaction: Scale up slightly on hover.

## Mobile Considerations
- Stack stats vertically.
- Ensure touch targets for CTA are >44px.
