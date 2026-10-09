# 🚀 Antigravity SiteSeller Engine

Autonomous Lead Generation, Instant Demo Website Builder & High-Converting Outreach Engine built for **Suhail Ahmed** (Antigravity Digital).

---

## 🌟 Key Capabilities

1. **Lead Hunter (Google Maps / Places):**
   - Automatically finds high-intent local businesses without active websites.
   - Captures business name, phone number, Google star rating, review count, and address.
2. **Instant Demo Website Generator:**
   - Automatically builds a complete, high-converting, mobile-responsive Tailwind CSS landing page for each business.
   - Niche-tailored design:
     - 💅 Salons, Spas & Aesthetic Clinics
     - 🦷 Dental Care & Smile Design Clinics
     - ⚡ Car Detailing, Wrapping & Ceramic Coating
     - ☀️ Solar Energy & Home Renovations
     - 🏢 General High-End Local Services
   - Features: Hero Section, Verified Review Badges, Signature Services with Pricing, Interactive Reservation Form, and Floating WhatsApp Button.
   - Includes a top sticky banner with 1-click **"Claim This Website"** button leading directly to your WhatsApp!
3. **1-Click High-Converting Outreach:**
   - Generates personalized Roman Urdu / English WhatsApp pitches with the live demo link.
   - 1-click button to open WhatsApp Web or WhatsApp Mobile with pre-filled message.
   - Pre-written CAN-SPAM compliant cold email templates.
4. **Deal Tracking & Revenue Counter:**
   - Real-time pipeline: *Demo Ready* ➔ *Pitch Sent* ➔ *In Discussion* ➔ *Deal Won 🏆*.
   - Automatically calculates your total revenue in PKR / AED / USD based on won deals!

---

## 🛠️ How to Run

1. **Double-click `start.bat`** (or run `node server.js` in terminal).
2. Open your browser and go to:
   👉 **http://localhost:3000**
3. Select your target city & niche, and click **"Hunt & Build Demos"**!

---

## 🌐 Making Demo Links Public on the Internet (Free)

When sending links to clients on their phone via WhatsApp, you can share a public link using a free tunnel:

### Option A: Cloudflare Tunnel (100% Free & No Account Needed)
Run in PowerShell:
```powershell
npx localtunnel --port 3000
```
or with cloudflared:
```powershell
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:3000
```
This gives you a public HTTPS URL (e.g. `https://random-subdomain.trycloudflare.com/demo/zehra-abbas-salon-spa`) that any client can open directly on their phone!

### Option B: Free Permanent Cloud Hosting (Render.com / Railway / Vercel)
You can push this repository to GitHub and connect it to Render or Railway for free 24/7 online hosting!
