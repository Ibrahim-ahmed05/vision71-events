# Vision71 Events

Build a Premium Executive Event Intelligence Dashboard for Vision71 Technologies

ROLE

Act as a world-class product designer, UX architect, frontend engineer, and data visualization specialist.

Build a premium internal Event Intelligence Dashboard for Vision71 Technologies that tracks technology events, trade shows, exhibitions, conferences, and other strategically relevant events in Pakistan.

This is NOT a generic admin dashboard.

It should feel like a real product designed by a top-tier technology company, with a minimalist, sophisticated, highly polished interface inspired by the design philosophy of Apple: excellent typography, whitespace, hierarchy, subtle animations, intuitive interactions, restrained visual language, and extreme attention to detail.

The dashboard should be something that an executive/CEO can open and immediately understand:

What events are coming up?
Which events matter to Vision71?
Which events have ended?
Where are they happening?
What is the expected cost?
Who organizes them?
What is the potential ROI?
Which events should Vision71 consider attending or exhibiting at?

1. CORE OBJECTIVE

Create a centralized Pakistan Technology & Trade Show Intelligence Platform.

The application should read data from two Google Spreadsheet sheets:

Sheet 1

Trade Shows

Sheet 2

Tech Events

These should remain separate at the data level but be presented through one unified dashboard.

The application must NOT duplicate or hardcode event information.

The Google Spreadsheet should be treated as the single source of truth.

If the Google Sheet changes, the dashboard should be able to refresh and display the latest information.

2. GOOGLE SHEETS INTEGRATION

Design the application architecture so that it can connect to a Google Spreadsheet.

I will provide the Google Spreadsheet URL after the initial implementation.

Create a clear configuration/integration layer where the spreadsheet ID and sheet names can be supplied.

Expected sheets:

Trade Shows

Tech Events

The application should fetch the data dynamically.

Do NOT hardcode sample events into the final production interface.

During development, you may use realistic mock data to demonstrate the UI, but structure the application so the mock data can be cleanly replaced by Google Sheets data.

The application should gracefully handle:

Empty cells

Missing fields

Invalid dates

Missing URLs

Missing organizer information

Missing costs

Long descriptions

Multiple source links

Unknown values

Do not allow malformed spreadsheet data to break the UI.

3. TRADE SHOW DATA SCHEMA

The Trade Shows sheet contains:

Sr No

Trade Show Name

Sector / Industry

Date

City

Venue

Organizer

Organizer Contact (Phone / Email)

Official Website

Stall Prices

Scale (Past Edition - Exhibitors/Visitors)

Source Link(s)

Notes

Map these fields intelligently into the application.

4. TECH EVENTS DATA SCHEMA

The Tech Events sheet contains:

Sr No

Event Name

Date

City

Venue

Organizer

Organizer Contact

Est. Stall Cost (Shell Scheme, PKR)

Discount / Package Structure

Est. Collateral Cost (Standees/Brochures, PKR)

Conversion / ROI Evidence (Past Editions)

LinkedIn / Source Research

Relevance to Vision71

Source Link(s)

Again, map these fields intelligently.

5. IMPORTANT UX PRINCIPLE

DO NOT display every piece of information on the main dashboard.

The interface should be progressive disclosure.

The initial view should be clean and highly scannable.

Users should see the most important information first.

When they click an event, open a beautiful detailed event experience containing the complete information.

Think:

Overview → Event Card → Event Detail → External Source

rather than:

Huge table containing everything.

6. GLOBAL VISUAL DIRECTION

The visual language should feel:

Premium

Minimal

Executive

Modern

Calm

Sophisticated

Technology-oriented

Data-rich without feeling cluttered

Take inspiration from the design principles of Apple, not by copying Apple's website.

Use:

Large clean typography

Generous whitespace

Subtle borders

Very light shadows

Rounded cards

Excellent alignment

Clear visual hierarchy

Restrained color palette

Elegant micro-interactions

Smooth transitions

Minimal gradients

Subtle glass/blur effects only where appropriate

Avoid:

Generic SaaS dashboard appearance

Excessive gradients

Neon colors

Excessive badges

Giant colorful KPI cards

Dense tables

Clutter

Unnecessary icons

Excessive animations

Dashboard templates that look like admin panels

The application should feel expensive and intentional.

7. COLOR SYSTEM

Use a primarily neutral interface.

Suggested direction:

Background: soft off-white / very light gray

Primary text: near-black

Secondary text: muted gray

Borders: extremely subtle gray

Accent: restrained Vision71-inspired blue

Success: subtle green

Warning: subtle amber

Critical/high relevance: subtle red

Do not make the interface overly colorful.

Color should communicate meaning rather than decoration.

8. TYPOGRAPHY

Use a premium modern sans-serif.

Prefer:

Inter

SF Pro-style typography if available

Geist

Manrope

Use strong typographic hierarchy.

For example:

Dashboard title:
large and confident.

Section titles:
medium/semibold.

Metadata:
small and muted.

Event names:
prominent but not oversized.

Numbers:
large but restrained.

9. MAIN NAVIGATION

Create a clean left sidebar or elegant top navigation.

Primary navigation:

Overview

Executive overview of the entire event landscape.

Trade Shows

Dedicated trade show intelligence.

Tech Events

Dedicated technology event intelligence.

Calendar

Visual calendar of upcoming events.

Analytics

Event trends, locations, industries, costs and relevance.

Sources

Optional section showing where event information comes from.

Settings

Data connection and dashboard settings.

Keep navigation minimal.

10. OVERVIEW PAGE

This should be the CEO's primary landing page.

Header:

Pakistan Event Intelligence

Subtitle:

Technology, trade shows and strategic events relevant to Vision71

Show the current date.

Then a sophisticated summary area.

Instead of generic colorful KPI cards, use elegant metric blocks.

Example:

Upcoming

42

This Month

12

Trade Shows

27

Tech Events

15

High Relevance

9

Cities

6

These numbers must be calculated dynamically from the spreadsheet data.

11. SMART EVENT STATUS

Automatically classify events based on their date.

Upcoming

Event date is in the future.

Today

Event date is today.

Ongoing

If an event has a date range, detect whether the current date falls within it.

Ended

Event date has passed.

Do not rely on manually entered status.

Calculate status automatically.

Use subtle status indicators.

12. UPCOMING EVENTS

Create a prominent section:

Upcoming Events

Show the most relevant upcoming events.

Each event should appear as a sophisticated card.

Example card:

ITCN Asia

Technology · Trade Show

📅 22–24 September 2026

📍 Karachi Expo Centre

Organizer: Example Organizer

High relevance

[View event →]

Do not put every field on the card.

Only show:

Event name

Category/type

Date

City/venue

Organizer

Relevance indicator when available

Everything else belongs in the detail view.

13. EVENT CARDS

Design beautiful responsive event cards.

Each card should include:

Event name

Event type

Sector/category

Date

City

Venue

Organizer

Relevance indicator

Small source indicator

"View Details" interaction

Hover:

Slight elevation

Very subtle scale/elevation effect

Border emphasis

Arrow movement

Keep animations subtle and professional.

14. EVENT DETAIL EXPERIENCE

This is one of the most important parts of the application.

When the user clicks an event card, do NOT simply expand the card.

Open a premium event detail page or large modal/drawer.

It should feel like opening a detailed Apple product page.

Header:

Event Name

Below:

Technology · Karachi · 22 September 2026

Then organize information into logical sections.

EVENT OVERVIEW

Display:

Date

City

Venue

Organizer

Event Type

Sector / Industry

ORGANIZER

Show:

Organizer name

Contact information

Phone

Email

Official website

Provide clear actions:

Visit Website →

Contact Organizer →

COMMERCIAL INFORMATION

For Trade Shows:

Exhibition Economics

Stall Prices

Past Edition Scale

Exhibitors

Visitors

Notes

For Tech Events:

Event Economics

Estimated Stall Cost

Collateral Cost

Discount / Package Structure

15. VISION71 INTELLIGENCE

For Tech Events, make this section particularly prominent.

Why This Matters to Vision71

Display:

Relevance to Vision71

Use the spreadsheet's existing "Relevance to Vision71" field.

Do not invent information that does not exist in the spreadsheet.

If the field contains qualitative text, display it beautifully.

If it contains a rating/score, visualize it appropriately.

ROI / CONVERSION INTELLIGENCE

If available:

Display:

Conversion / ROI Evidence

Show the information from the spreadsheet exactly but formatted elegantly.

For example:

Past Edition Results

Potential ROI

Conversion evidence

Do not fabricate numbers.

If information is unavailable:

Display a subtle:

No ROI data available

rather than leaving the area broken.

16. SOURCES

Every event should have a dedicated source section.

Display:

Sources

Official Website

LinkedIn / Research

Source Links

Each should be a clickable external link.

Use:

Open Website ↗

View Source ↗

View LinkedIn Research ↗

External links should open in a new tab.

Make sure links are safely handled and malformed URLs do not crash the application.

17. EVENT ACTION BAR

At the top or bottom of event details, provide elegant actions:

Open Official Website ↗

View Source ↗

Add to Calendar

Share

Do not make these oversized buttons.

Use subtle premium button styling.

18. ENDED EVENTS

Create a dedicated section:

Past Events

This should automatically contain events whose dates have passed.

Do NOT delete historical events.

Historical events are valuable for:

ROI analysis

Market research

Recurring event identification

Comparing future editions

Understanding event scale

Use a slightly more subdued visual treatment for past events.

Allow filtering:

Recently ended

This year

Older events

19. SEARCH

Implement powerful global search.

Search across:

Event name

Industry

City

Venue

Organizer

Notes

Relevance

Sources

Example:

Searching:

AI

could return:

AI conferences

Technology exhibitions

AI-related trade shows

Events where AI appears in notes/industry

Search should update instantly.

20. FILTER SYSTEM

Create a sophisticated filter bar.

Filters:

Event Type

All

Trade Shows

Tech Events

Date

All

Today

This Week

This Month

Next 3 Months

Custom

City

Karachi

Lahore

Islamabad

Rawalpindi

Faisalabad

Peshawar

Other

Populate dynamically from spreadsheet data.

Industry / Sector

Populate dynamically.

Organizer

Populate dynamically.

Vision71 Relevance

High

Medium

Low

Unknown

Only show this filter where relevant.

21. SORTING

Allow:

Newest

Soonest

Recently Added

Alphabetical

Highest Relevance

Highest Estimated Cost

Lowest Estimated Cost

Do not show irrelevant sorting options for a dataset.

22. CALENDAR VIEW

Create a premium calendar page.

Display events on a monthly calendar.

Use small event indicators.

Clicking an event should open the same detailed event experience.

Allow switching:

Month

Week

List

Avoid an overly colorful calendar.

23. ANALYTICS PAGE

Create a sophisticated analytics section.

Show:

Events by City

Visual chart.

Events by Industry

Visual chart.

Events by Month

Timeline/bar chart.

Trade Shows vs Tech Events

Comparison.

Event Relevance

High / Medium / Low.

Estimated Exhibition Costs

Where cost data exists.

Event Scale

Based on exhibitors/visitors where available.

Charts should be minimalist and executive-friendly.

Do not create unnecessary charts.

Every visualization should answer a useful business question.

24. EXECUTIVE INSIGHTS

At the top of Analytics, include automatically calculated insights.

Example:

Karachi currently has the highest concentration of upcoming events.

Technology is the most represented sector over the next 90 days.

7 upcoming events have high relevance to Vision71.

These insights must be generated strictly from the available dataset.

Do not fabricate conclusions.

If insufficient data exists, simply don't show the insight.

25. DATA QUALITY

Create a subtle data-quality mechanism.

The dashboard should detect:

Missing dates

Missing organizer

Missing official website

Missing city

Missing source

Duplicate event names

Optionally display:

Data Quality

94% Complete

This is useful because the spreadsheet will be continuously maintained.

Do not make this feature visually dominant.

26. DUPLICATE HANDLING

Because the same event may appear across different sources, design the data architecture so duplicate detection can eventually be implemented.

Potential matching fields:

Event name

Date

City

Organizer

Do not automatically delete records.

Instead, flag potential duplicates for review.

27. RESPONSIVE DESIGN

Desktop is the primary target because this will be used by management.

But it must also work beautifully on:

Laptop

Tablet

Mobile

Desktop:

Sidebar + spacious content.

Tablet:

Collapsible sidebar.

Mobile:

Bottom navigation or compact navigation.

Event detail should become a full-screen mobile experience.

28. MICRO-INTERACTIONS

Use subtle animations:

Card hover

Page transitions

Filter transitions

Modal/drawer transitions

Loading states

Skeleton loaders

Button hover

Calendar transitions

Animations should be fast and elegant.

Never use excessive motion.

Respect prefers-reduced-motion.

29. LOADING EXPERIENCE

When retrieving Google Sheets data:

Show beautiful skeleton states.

Example:

Event cards should shimmer subtly.

Do not show:

"Loading..."

everywhere.

Create a polished perceived-performance experience.

30. EMPTY STATES

If there are no events:

Show:

No events found

Then provide:

"Try changing your filters."

Do not leave blank white areas.

31. ERROR HANDLING

If Google Sheets cannot be reached:

Show a professional message:

Unable to sync event data

"Check the spreadsheet connection and try again."

Include:

Retry Sync

Do not expose technical errors to the CEO.

Log technical errors appropriately for debugging.

32. DATA REFRESH

Provide a subtle indicator:

Last synced: 13 Aug 2026, 9:42 AM

And a:

Refresh

action.

If possible, implement automatic refresh.

Do not refresh excessively and create unnecessary API calls.

33. GOOGLE SHEETS DATA MAPPING

Build a robust mapping layer.

Trade Shows:

Trade Show Name → event.name

Sector / Industry → event.category

Date → event.date

City → event.city

Venue → event.venue

Organizer → event.organizer

Organizer Contact → event.organizerContact

Official Website → event.website

Stall Prices → event.stallPrice

Scale → event.scale

Source Link(s) → event.sources

Notes → event.notes

Tech Events:

Event Name → event.name

Date → event.date

City → event.city

Venue → event.venue

Organizer → event.organizer

Organizer Contact → event.organizerContact

Est. Stall Cost → event.stallCost

Discount / Package Structure → event.discountPackage

Est. Collateral Cost → event.collateralCost

Conversion / ROI Evidence → event.roiEvidence

LinkedIn / Source Research → event.linkedinResearch

Relevance to Vision71 → event.relevance

Source Link(s) → event.sources

Create a normalized internal event model so both sheets can be displayed through the same UI.

34. DO NOT LOSE SOURCE-SPECIFIC INFORMATION

Even though the two sheets use different fields, preserve every field.

Trade Show-specific information must remain available.

Tech Event-specific information must remain available.

Do not force all information into identical fields if doing so would cause data loss.

The detail page should dynamically show sections based on which fields exist.

35. DATA SOURCE BADGES

Each event should subtly indicate:

TRADE SHOW

or

TECH EVENT

This should be elegant and understated.

36. EXECUTIVE-FIRST DESIGN

The CEO should be able to answer these questions within seconds:

What events are coming up?

What is happening this month?

Where are the events?

Which events are relevant to Vision71?

Which events could require exhibition spending?

What are the largest trade shows?

Which events have strong historical ROI evidence?

Where can I get more information?

What has already happened?

What should I investigate next?

Design the information architecture around these questions.

37. NO GENERIC DASHBOARD COMPONENTS

Do not use generic:

"Total Users"

"Revenue"

"Orders"

"Customers"

style SaaS dashboard cards.

Everything should be specifically designed around event intelligence.

The product should feel like a business intelligence terminal, not an admin panel.

38. DESIGN REFERENCES

Take conceptual inspiration from:

Apple's information hierarchy

Apple's whitespace

Apple's typography

Linear's product polish

Notion's simplicity

Stripe's information architecture

Bloomberg-style information density, but redesigned into a modern minimalist interface

Do NOT copy any company's exact UI.

Create an original Vision71 design language.

39. BRANDING

Use:

Vision71 Technologies

Product name:

Event Intelligence

Subtitle:

Pakistan Technology & Trade Event Intelligence

Keep branding subtle.

This should feel like an internal premium Vision71 product.

40. TECHNICAL EXPECTATIONS

Use a modern production-quality stack.

Prefer:

React

TypeScript

Tailwind CSS

shadcn/ui where appropriate

Lucide icons

A reliable charting library

Clean component architecture

Reusable components

Strong TypeScript typing

Responsive design

Accessible interactions

Do not create one giant component.

Structure the application logically.

41. COMPONENT ARCHITECTURE

Create reusable components such as:

Sidebar

Header

MetricSummary

EventCard

EventGrid

EventDetail

EventDrawer

EventFilters

SearchBar

CalendarView

AnalyticsCharts

SourceLinks

RelevanceIndicator

DataQualityIndicator

SyncStatus

EmptyState

LoadingSkeleton

ErrorState

42. PERFORMANCE

The dashboard may eventually contain hundreds or thousands of events.

Design accordingly.

Use:

Efficient filtering

Memoization where appropriate

Pagination or virtualization where necessary

Lazy loading

Optimized rendering

Cached data

Do not render thousands of cards simultaneously if unnecessary.

43. SECURITY

Never expose private Google credentials in frontend code.

If Google Sheets API credentials are required:

Use a secure server-side mechanism or appropriate OAuth flow.

Do not hardcode API keys or service account credentials in the frontend.

44. GOOGLE SHEETS CONNECTION UX

Create a Settings/Data Sources interface where I can eventually configure:

Google Sheets

Spreadsheet URL

Spreadsheet ID

Trade Shows Sheet Name

Tech Events Sheet Name

Connection status

Last sync

Refresh

Do not expose secrets.

Show:

Connected

or

Not Connected

with a clean status indicator.

45. DEMO DATA

Initially populate the interface with realistic Pakistan event examples purely to demonstrate the UI.

Clearly structure this as temporary mock data.

Once Google Sheets is connected, the application must use real spreadsheet data.

The design should remain beautiful regardless of the number of events.

46. FINAL QUALITY BAR

Before considering the implementation complete, review the application as if the CEO were seeing it for the first time.

Ask:

Does it look premium?

Does it look like a serious internal product?

Is the hierarchy immediately understandable?

Can an executive find an event within seconds?

Is the interface clean?

Is the detail page comprehensive without being overwhelming?

Are the most important fields visible first?

Can the user progressively discover more information?

Does every external source have a clear action?

Does it feel significantly better than a normal dashboard template?

If not, refine the UI.

47. MOST IMPORTANT REQUIREMENT

Do not simply build a CRUD dashboard.

Build a high-end Event Intelligence product.

The spreadsheet is the data layer.

The dashboard is the intelligence and presentation layer.

The final product should make the CEO feel that Vision71 has built its own internal technology platform for monitoring Pakistan's technology and trade ecosystem.

Prioritize:

Exceptional UX > visual clutter

Clarity > information overload

Executive usability > generic dashboard conventions

Polish > excessive features

Progressive disclosure > showing everything at once

Real data integration > hardcoded content

Build the first version with the complete UI/UX architecture, realistic data, Google Sheets-ready data layer, responsive design, event detail experience, filters, search, calendar, analytics, and executive overview.

LInk of spreadsheet: https://docs.google.com/spreadsheets/d/1RoNMO_FRPMcSC470E3yCz1-C1wpT6la-JVZLuOz0jag/edit?usp=sharing

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea42e68e-44c8-403c-a291-75d1cb67aa4b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
