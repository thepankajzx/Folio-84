const XLSX = require('xlsx');
const path = require('path');

// 1. Create a new Workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Summary Overview
const summaryData = [
    ["Portfolio Master Projects Tracker", "Last Updated: 2026-09-01", "", ""],
    ["", "", "", ""],
    ["Tier #", "Niche Category", "Deal Size Range", "Total Active Projects Listed", "Website Section"],
    ["Tier 1", "Agentic AI & Autonomous Systems", "$6,000 - $15,000+", 3, "Section 01 (#agentic-ai)"],
    ["Tier 2", "Moodle & LMS Enterprise Extensions", "$4,000 - $10,000", 3, "Section 02 (#moodle-lms)"],
    ["Tier 3", "Enterprise n8n & Automated ETL Pipelines", "$3,000 - $8,000", 3, "Section 03 (#n8n-pipelines)"],
    ["Tier 4", "Full-Stack Web Applications & SaaS", "$2,500 - $6,000", 3, "Section 04 (#web-apps)"],
    ["Tier 5", "UI/UX Design Systems & KDP Publishing", "$1,000 - $3,000", 3, "Section 05 (#design-publishing)"],
    ["", "", "", ""],
    ["Key Rule:", "This portfolio is strictly a Showcase & Inquiry Hub. No direct payments/buy buttons.", "", ""],
    ["Commerce Hub:", "All commercial plugin purchases are routed to The Definite Labs.", "", ""]
];
const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
XLSX.utils.book_append_sheet(wb, wsSummary, "Overview");

// Sheet 2: Tier 1 - Agentic AI
const aiData = [
    ["Project ID", "Project Name", "System Type", "Key Tech Stack", "Source Folder / Chat", "Website Status", "Asset File Path"],
    ["AI-01", "Autonomous Patient & Client Intake Agent", "Multi-Agent Triage", "LangChain, OpenAI, FastAPI, Webhooks", "Moodle Automation / AI Chat", "Live Showcase", "assets/images/agentic-ai/intake-agent.webp"],
    ["AI-02", "AI Educational Assessment & Essay Evaluator", "Rubric Evaluator", "Python, Vector DB, LLM Reasoning", "prompt-architect", "Live Showcase", "assets/images/agentic-ai/essay-evaluator.webp"],
    ["AI-03", "In-App Conversational Copilot & Lead Triage", "Embedded SSE Agent", "React, SSE Streaming, Fastify", "Moodle Automation Project", "Live Showcase", "assets/images/agentic-ai/inapp-copilot.webp"]
];
const wsAI = XLSX.utils.aoa_to_sheet(aiData);
XLSX.utils.book_append_sheet(wb, wsAI, "01_Agentic_AI");

// Sheet 3: Tier 2 - Moodle LMS
const lmsData = [
    ["Project ID", "Project Name", "System Type", "Key Tech Stack", "Source Folder / Chat", "Website Status", "Asset File Path"],
    ["LMS-01", "Enterprise Real-Time Webhook Dispatcher", "Moodle 4.x/5.2 Plugin", "PHP 8.2, Moodle Events API, async cURL", "EX FILES 4.5", "Live Showcase", "assets/images/moodle-lms/webhook-dispatcher.webp"],
    ["LMS-02", "Role-Gated Retention & Gradebook Dashboard", "Commercial Analytics", "PHP, Chart.js, Moodle DB", "fcidashboard_COMMERCIAL", "Live Showcase", "assets/images/moodle-lms/fci-dashboard.webp"],
    ["LMS-03", "Compliance & Seat-Time Gatekeeper Block", "Regulation Module", "Moodle Activity Completion API", "REAL MOODLE BACKUPS", "Live Showcase", "assets/images/moodle-lms/compliance-gatekeeper.webp"]
];
const wsLMS = XLSX.utils.aoa_to_sheet(lmsData);
XLSX.utils.book_append_sheet(wb, wsLMS, "02_Moodle_LMS");

// Sheet 4: Tier 3 - n8n Automation
const n8nData = [
    ["Project ID", "Project Name", "System Type", "Key Tech Stack", "Source Folder / Chat", "Website Status", "Asset File Path"],
    ["AUT-01", "Zapier-to-n8n Self-Hosted Cluster Migration", "Enterprise ETL", "n8n, Docker, Redis, Postgres", "N8N BACKUPS", "Live Showcase", "assets/images/n8n-automation/n8n-cluster.webp"],
    ["AUT-02", "Zero-Touch Stripe-to-Accounting Reconciliation", "Financial Pipeline", "Stripe Webhooks, n8n, QuickBooks/Xero", "N8N BACKUPS", "Live Showcase", "assets/images/n8n-automation/stripe-accounting.webp"],
    ["AUT-03", "Event-Driven AI Logistics & Document Parser", "Autonomous OCR / Parser", "OpenAI Vision, n8n, GCS Webhooks", "N8N BACKUPS", "Live Showcase", "assets/images/n8n-automation/doc-parser.webp"]
];
const wsN8N = XLSX.utils.aoa_to_sheet(n8nData);
XLSX.utils.book_append_sheet(wb, wsN8N, "03_n8n_Automation");

// Sheet 5: Tier 4 - Web Apps & SaaS
const webData = [
    ["Project ID", "Project Name", "System Type", "Key Tech Stack", "Source Folder / Chat", "Website Status", "Asset File Path"],
    ["WEB-01", "Stitch Habit Tracker SaaS Platform", "Productivity SaaS", "Tailwind CSS, Firebase DB, JS PWA", "STITCH HABIT TRACKER", "Live Showcase", "assets/images/web-apps/stitch-tracker.webp"],
    ["WEB-02", "Last Percent — Knowledge Brand Portal", "Editorial Experience", "Headless CMS, Tailwind, Responsive Engine", "Last Percent Chat", "Live Showcase", "assets/images/web-apps/last-percent.webp"],
    ["WEB-03", "Custom B2B Wholesale Portal & Invoicing", "B2B E-Commerce", "Shopify Liquid, Stripe/Razorpay, Docker VPS", "Folio-84", "Live Showcase", "assets/images/web-apps/b2b-portal.webp"]
];
const wsWeb = XLSX.utils.aoa_to_sheet(webData);
XLSX.utils.book_append_sheet(wb, wsWeb, "04_Web_and_SaaS");

// Sheet 6: Tier 5 - Design & Publishing
const desData = [
    ["Project ID", "Project Name", "System Type", "Key Tech Stack", "Source Folder / Chat", "Website Status", "Asset File Path"],
    ["DES-01", "Complete Amazon KDP & Book Publishing Suite", "Publishing Architecture", "InDesign, KDP Formatting, Spine Math, 3D", "KDP Publishing Chat", "Live Showcase", "assets/images/design-publishing/kdp-publishing.webp"],
    ["DES-02", "Luxury Brand Figma UI/UX Design System", "Enterprise Design Kit", "Figma, Tokenized Components, Atomic UI", "Folio-84", "Live Showcase", "assets/images/design-publishing/figma-system.webp"],
    ["DES-03", "High-CTR Direct-Response Ad Creative Packs", "Performance Visuals", "Photoshop, AI Enhancement, Direct-Response", "FOLIO IMAGES - WORK", "Live Showcase", "assets/images/design-publishing/high-ctr-ads.webp"]
];
const wsDes = XLSX.utils.aoa_to_sheet(desData);
XLSX.utils.book_append_sheet(wb, wsDes, "05_Design_Publishing");

// Write to File
const outputPath = path.join(__dirname, 'PORTFOLIO_MASTER_TRACKER.xlsx');
XLSX.writeFile(wb, outputPath);
console.log('Successfully created PORTFOLIO_MASTER_TRACKER.xlsx with 6 categorized tabs!');
