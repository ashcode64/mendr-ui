## Overview

 visual language feels confident, modern, and highly legible, with a strong enterprise SaaS posture. The page balances a playful sense of energy through orange accents and a gentle pastel hero gradient, while keeping the overall tone professional and technical. The layout is spacious and centered, optimized for scanning, trust, and clear conversion actions. feels crisp, modern, and highly product-led, with a playful creative edge balanced by strong editorial restraint. The interface is designed for a broad audience of designers, teams, and buyers, so it stays approachable while still feeling premium and confident. Visually, it leans spacious and airy, using white space and a single saturated accent to keep attention on content and calls to action.
 feels airy, premium, and quietly confident, with a strong editorial sensibility wrapped around a modern B2B SaaS message. The visual tone is warm and optimistic rather than technical or sterile, helped by the soft cream palatter and generous whitespace. It is designed for a business audience that expects credibility, clarity, and a polished conversion-focused experience.
The overall experience is spacious and airy,
## Colors

- **Primary (#123175):** The signature action blue used for primary buttons, links, and high-priority interactive states. It carries the brand’s strongest contrast against the light background.
    
- **Neutral (#FFFFFF):** Clean white is used for button fills, inputs, and surfaces that need separation from the soft gray canvas.
    
- **Surface (#FBFAF8):** The main page background is a very light calm gray, creating a calm, low-noise foundation for content.
- **Secondary (#12171A):** A blue gray accent for subtle separation and low-emphasis surfaces. Use it when you need structure without drawing attention, useful for supportive UI states, subtle differentiation, and tonal variation when primary feels too heavy. 
    
- **On-surface (#000000):** Pure black is reserved for major headlines, navigation text, and the strongest reading hierarchy.
    
- **Muted (#6B7280):** A restrained gray for supporting copy, secondary navigation, and metadata where emphasis should be reduced.
    
- **Border (#E5E7EB):** A subtle divider color that defines cards, inputs, and framed UI without heavy shadows.
    
- **Accent (#FDFCD7):** A cream yellow used sparingly for brand moments, icons, and attention-catching details.
    
- **Info (#D6E4FF):** A pale blue highlight tone suited for chips, helper states, or subtle informational emphasis.
    
- **Error (#D92D20):** A clear semantic red for destructive or invalid states, kept out of the main visual story unless needed.
    

## Typography

Headings use Poppins to create a bold, geometric editorial feel. The largest headline styles are tightly tracked with negative letter spacing, which gives the hero its compressed, premium presence; `headline-display`, `headline-lg`, and `headline-md` should be used for major marketing statements. Use  Inter Tight also if you see fit anywhere

Body content switches to Inter for clarity and product readability. `body-lg`, `body-md`, and `body-sm` keep support copy crisp and neutral, while labels and buttons use heavier Inter weights for strong scannability. The system does not rely on uppercase treatment; emphasis comes from weight, size, and spacing rather than forced casing.

## Layout

The composition is centered and spacious, with a fluid full-width feel in the hero and content blocks aligned to a broad content column. Vertical rhythm is generous, using the `xs` to `xl` spacing scale to separate dense information into clear sections without feeling crowded.

Use `xs` for tight internal gaps, `sm` for paired controls and short stacks, `md` for section breathing room, `lg` for major panel separation, and `xl` for page-level divisions. Cards and modules should generally keep comfortable internal padding, with 16px as the default card inset and 12px–20px for control content. The layout is centered and intentionally spacious, with a wide hero composition and generous breathing room around the headline and CTA. Use wide gutters and generous vertical padding so the interface never feels dense. Cards and utility surfaces should remain compact, but the page overall should feel open, calm, and editorial.Cards and interactive panels should retain modest internal padding, allowing the content to breathe while preserving a compact product feel.

## Elevation & Depth

The system is intentionally flat and low-elevation. Instead of heavy shadows, hierarchy comes from color contrast, white-on-gray separation, thin borders, and occasional soft glow treatment around highlighted modules like the AI prompt bar.

Shadows should remain subtle and rare, preserving the calm product feel. If depth is needed, prefer a faint 1px border and tonal surface shift before introducing shadow blur.The visual language is mostly flat, relying on contrast, borders, and white-space separation instead of heavy shadow stacks. When depth is needed, it appears as subtle card outlines and occasional soft separation rather than dramatic elevation. Primary action emphasis comes from color and scale, not from aggressive shadows. This keeps the interface feeling modern, fast, and easy to scan.Depth is created almost entirely through contrast, layering, and soft borders rather than shadows. The system is deliberately flat: shadows are absent, so hierarchy depends on clear tonal separation, whitespace, and image layering. Small bordered surfaces like cards and cookie notices provide the only real containment, using the `border` color to stay subtle.Because the visual language is illustrative, depth should stay subtle and mostly tonal. Avoid heavy shadows, glossy effects, or layered blur; they would fight the handmade, paper-like feel of the brand.

## Shapes

The shape language is soft and approachable, with rounded corners used consistently across interactive elements. `rounded.md` at 8px is the default for buttons, cards, and inputs, while `rounded.full` is used for pills, chips, and circular affordances.

The overall feel is polished rather than bubbly: enough roundness to feel modern and friendly, but not so much that it undermines the technical, enterprise character.

## Components

Buttons are the clearest expression of the system. `button-primary` uses the blue primary fill with white text, 12px 20px padding,  and a substantial 62px height for strong CTA presencet, and medium rounding; it should be the dominant call to action. `button-secondary`  visually similar but softer,  text for lower-priority actions like sign-in. `button-link` should remain minimal and inline, with no border, no fill, and body-sized text.

Cards should use `card` with the light surface background, 1px border, 16px padding, and no shadow. They should feel like framed content blocks rather than floating panels.Cards should feel light, framed, and content-first. Use the `card` treatment with a 1px neutral border, `rounded.lg`, and modest 16px padding; keep shadows off. Cards are best used for product previews, message mockups, or supporting information blocks that need containment without heaviness.

Inputs should be clean, white, and bordered, with  generous padding for comfortable typing. Focus states should be clearly visible, but the default appearance should stay quiet and uncluttered.Inputs should match the button and card language: calm, readable, and slightly rounded. Use a light surface, green text, medium rounding, and comfortable padding so forms feel welcoming rather than enterprise-heavy.

Chips and badges should be bright and compact. `chip` is a good fit for highlighted audience tags, feature callouts, and small status pills, especially when paired with the accent yellow and pill rounding.

Navigation and utility actions should remain lightweight, with text-first treatments and minimal chrome. Icons should be simple and mostly monochrome, with orange reserved for specific brand or assistant moments.

## Do's and Don'ts

- Do use Poppins for large headlines and Inter for everything that requires dense reading.
    
- Do keep primary actions blue and secondary actions neutral so the CTA hierarchy stays obvious.
    
- Do prefer borders and tonal surfaces over heavy shadows or glossy effects.
    
- Do keep corner radii consistent at 8px for most controls and 9999px for pills.
-  Do keep corners gently rounded, especially on buttons, inputs, cards, and pills.
- Don't make the layout dense, cramped, or grid-heavy; the brand depends on breathing room.
    
- Don't use heavy gradients, glass effects, or dramatic drop shadows that clash with the hand-drawn aesthetic.
    
- Don't introduce additional bright accent colors that compete with the Grafana orange or blue.
    
- Don't make buttons taller or more pill-shaped than the established 48px, 8px-radius pattern.
    
- Don't over-tighten spacing; the layout should feel open, breathable, and enterprise-grade.
    
- Don't use decorative typography treatments like all-caps labels or exaggerated tracking outside the hero headings.
- 