# OneDot ABM — Website & System Architecture

## 1. Product Overview

The OneDot ABM digital platform consists of two connected layers:

1. **Public Website** — the customer-facing marketing and web development website.
2. **Admin Platform** — a private management system used to operate the website, leads, clients, projects, portfolio, billing, content, and analytics.

The system should be designed as a scalable business platform rather than a simple portfolio website.

---

## 2. Public Website Architecture

### Primary Navigation

- Home
- Services
- Work / Portfolio
- Case Studies
- Web Applications
- About
- Pricing
- Contact
- Client Login
- Start a Project

### Homepage Structure

1. Initial Loading Screen
2. Hero
3. Trust / Business Metrics
4. Client Logos
5. Marketing Overview
6. Web Development Overview
7. Marketing + Development Integration
8. Featured Case Studies
9. Featured Websites / Applications
10. Why OneDot ABM
11. Process
12. Industries
13. Testimonials
14. FAQ
15. Final CTA
16. Footer

---

## 3. Marketing Architecture

### Marketing Service Categories

- Meta Ads
- Google Ads
- Performance Marketing
- Lead Generation
- Social Media Marketing
- Creative Strategy
- Ad Creative Production
- Funnel Strategy
- Branding & Identity
- SEO

### Marketing Workflow

Business Discovery → Strategy → Campaign Setup → Creative → Launch → Tracking → Optimization → Reporting

---

## 4. Web Development Architecture

### Development Categories

- Business Websites
- E-commerce Websites
- Landing Pages
- Custom Web Applications
- Admin Dashboards
- Customer Portals
- Business Management Systems
- Payment Integration
- API Integration
- Analytics & Tracking

### Technology Layer

Primary technologies may include:

- Next.js
- React
- TypeScript
- Laravel
- PHP
- Node.js
- Prisma
- Tailwind CSS
- MySQL / PostgreSQL
- REST APIs

Technology should be selected according to project requirements rather than forced into every project.

---

## 5. Portfolio Architecture

Portfolio should support multiple content types:

### Projects

- Websites
- E-commerce
- Web Applications
- Marketing Campaigns
- Branding
- Creative Work

Each project should support:

- Title
- Client
- Category
- Industry
- Description
- Services
- Technologies
- Images
- Videos
- Features
- Results
- Project URL
- Case Study
- Publication status
- Featured status

---

## 6. Case Study Architecture

Each case study should follow:

### Overview

- Client
- Industry
- Service
- Project period
- Objective

### Challenge

Business problem and starting condition.

### Strategy

Strategic approach and reasoning.

### Execution

Work completed by OneDot ABM.

### Results

Verified metrics and outcomes.

### Evidence

- Screenshots
- Campaign data
- Website screens
- Creative examples
- Analytics

### Conclusion

Key business impact and lessons.

---

## 7. Web Application Showcase

A dedicated section for larger digital products and systems.

Example projects:

- KANZIE
- LUMIFLICK

Each application entry can include:

- Product overview
- Architecture
- Technology stack
- User-facing features
- Admin features
- Integrations
- Screenshots
- Live URL
- Development scope

---

# 8. Admin Platform Architecture

The existing admin feature set should be retained.

### Main Admin Navigation

- Dashboard
- Leads
- Prospects
- Analytics
- Blog
- Portfolio
- Websites
- Logos
- Site Banner
- Quotations
- Billing
- Projects
- Clients
- Integrations
- Settings

Additional utility actions:

- View Site
- Sign Out

---

## 9. Admin Dashboard

The dashboard should provide a business-level overview.

### Metrics

- Total Leads
- New Leads
- Prospects
- Active Clients
- Active Projects
- Completed Projects
- Pending Quotations
- Outstanding Invoices
- Revenue
- Recent Activity

### Dashboard Components

- Lead pipeline
- Project status
- Revenue overview
- Recent leads
- Recent clients
- Recent quotations
- Recent invoices
- Activity feed
- Quick actions

---

## 10. Lead Management

### Lead Record

- Name
- Company
- Email
- Phone
- Website
- Service interest
- Industry
- Budget
- Source
- Message
- Status
- Assigned person
- Notes
- Created date
- Last activity

### Lead Status

Example pipeline:

New → Contacted → Qualified → Proposal → Negotiation → Won / Lost

### Lead Features

- Search
- Filters
- Sorting
- Tags
- Notes
- Follow-up
- Assignment
- Status changes
- Activity history

---

## 11. Prospect Management

Prospects are leads that have entered a more qualified stage.

Features:

- Prospect profile
- Company information
- Requirements
- Estimated project value
- Communication history
- Notes
- Quotation
- Project conversion
- Status
- Follow-up tracking

---

## 12. Client Management

Client profiles should contain:

- Company information
- Contact information
- Services
- Active projects
- Completed projects
- Quotations
- Invoices
- Payments
- Files
- Messages
- Notes
- Activity history

---

## 13. Project Management

### Project Fields

- Project name
- Client
- Service/category
- Description
- Start date
- Deadline
- Budget
- Status
- Progress
- Assigned team
- Milestones
- Deliverables
- Files
- Notes

### Project Status

- Inquiry
- Planning
- In Progress
- Review
- Completed
- On Hold
- Cancelled

### Project Features

- Timeline
- Milestones
- Tasks
- Deliverables
- File management
- Client visibility
- Internal notes
- Activity history

---

## 14. Quotation System

Admin should be able to create professional quotations.

### Quotation Fields

- Client
- Company
- Project
- Services
- Line items
- Quantity
- Unit price
- Discount
- Tax
- Total
- Valid until
- Terms
- Notes

### Status

- Draft
- Sent
- Viewed
- Accepted
- Rejected
- Expired

### Features

- Generate quotation
- Preview
- PDF
- Send to client
- Track status
- Convert accepted quotation into project

---

## 15. Billing System

### Invoice Features

- Invoice number
- Client
- Project
- Line items
- Subtotal
- Discount
- Tax
- Total
- Due date
- Payment status
- Payment method
- Notes

### Invoice Status

- Draft
- Sent
- Partially Paid
- Paid
- Overdue
- Cancelled

### Payment Tracking

- Amount
- Date
- Method
- Transaction/reference ID
- Invoice
- Client
- Notes

---

## 16. Blog / CMS

Admin-managed content system.

### Features

- Create
- Edit
- Delete
- Draft
- Publish
- Schedule
- Categories
- Tags
- Featured image
- SEO title
- Meta description
- Slug
- Author
- Related posts

---

## 17. Website Management

The Websites section manages completed and featured website projects.

Fields:

- Project name
- Client
- URL
- Category
- Technology
- Description
- Features
- Screenshots
- Thumbnail
- Case study
- Featured status
- Publication status

---

## 18. Portfolio Management

Portfolio entries should support:

- Project title
- Client
- Category
- Industry
- Services
- Description
- Images
- Videos
- Technologies
- Results
- External URL
- Case study
- Featured status

---

## 19. Logo Management

Used for client/trusted-by sections.

Features:

- Upload logo
- Client name
- Website
- Display order
- Active/inactive
- Light/dark version
- Alt text

---

## 20. Site Banner Management

Admin should control promotional banners without code changes.

Fields:

- Banner title
- Description
- CTA
- CTA URL
- Image
- Start date
- End date
- Active/inactive

---

## 21. Analytics

Analytics should provide both business and marketing visibility.

### Business Analytics

- Leads
- Prospects
- Clients
- Projects
- Revenue
- Quotations
- Invoices
- Conversion rates

### Website Analytics

- Visitors
- Page views
- Traffic sources
- Device
- Geography
- Conversion events

### Marketing Analytics

Where integrations are available:

- Ad spend
- Impressions
- Reach
- Clicks
- CTR
- CPC
- Leads
- CPL
- Conversions
- ROAS

---

## 22. Integrations

Central integration management.

Potential integrations:

- Meta
- Google Ads
- Google Analytics
- Meta Pixel
- Conversion API
- WhatsApp
- Email
- Payment gateways
- Cloud storage
- CRM/API integrations

The architecture should use an integration layer so individual services can be connected or disconnected without rewriting the core application.

---

## 23. Authentication & Access Control

### Admin

- Secure login
- Password reset
- Two-factor authentication
- Session management
- Role-based permissions

### Client

- Client login
- Password reset
- Two-factor authentication where required
- Client-specific data access

### Roles

Possible roles:

- Super Admin
- Admin
- Manager
- Marketing
- Developer
- Finance
- Client

Permissions should control access to modules and actions.

---

## 24. Client Portal

Clients should have a separate authenticated experience.

### Client Navigation

- Overview
- Projects
- Deliverables
- Files
- Quotations
- Invoices
- Payments
- Messages
- Reports
- Account

Clients should only access information belonging to their own account/company.

---

## 25. Notifications

Support:

- New lead
- New quotation
- Quotation accepted
- Project update
- New deliverable
- Invoice created
- Payment received
- Invoice overdue
- Client message
- System notifications

Channels can include:

- In-app
- Email
- WhatsApp where integrated

---

## 26. File Management

Central file system for:

- Project files
- Client documents
- Creative assets
- Website assets
- Quotations
- Invoices
- Deliverables

Features:

- Upload
- Download
- Preview
- Folder/category
- File size
- File type
- Access permissions
- Delete/archive

---

## 27. Settings

### General

- Business name
- Logo
- Contact information
- Address
- Currency
- Timezone

### Website

- SEO
- Social links
- Navigation
- Footer
- Global settings

### Business

- Services
- Tax
- Invoice settings
- Quotation settings

### Users

- Team members
- Roles
- Permissions

### Security

- Password
- 2FA
- Sessions
- Login history

---

## 28. Data Architecture

Core entities:

- Users
- Roles
- Permissions
- Leads
- Prospects
- Clients
- Projects
- Tasks
- Deliverables
- Portfolio Items
- Websites
- Case Studies
- Blog Posts
- Services
- Quotations
- Invoices
- Payments
- Files
- Messages
- Notifications
- Integrations
- Analytics Events
- Settings
- Activity Logs

Relationships should be designed around a central client/project model.

Example:

**Lead → Prospect → Client → Project → Quotation → Invoice → Payment**

---

## 29. Technical Principles

- Responsive architecture
- Mobile-first admin interface
- API-ready backend
- Modular components
- Role-based access control
- Secure authentication
- Server-side validation
- Database indexing
- Activity logging
- Error handling
- Auditability
- SEO-ready public website
- Performance optimization
- Image optimization
- Scalable storage
- Integration-ready architecture

---

## 30. Future Expansion

The architecture should leave room for:

- AI-assisted lead qualification
- AI customer support
- Automated proposals
- Automated reporting
- WhatsApp CRM
- Unified inbox
- Marketing campaign dashboards
- Subscription billing
- Team collaboration
- Client approval workflows
- Advanced business intelligence

The system should be modular so these features can be added without rebuilding the core platform.
