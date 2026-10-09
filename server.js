const express = require('express');
const cors = require('cors');
const path = require('path');
const storage = require('./services/storage');
const { generateSiteHTML } = require('./services/siteGenerator');
const { discoverLeads } = require('./services/scraper');
const { createWhatsAppPitch, createFollowUp1Pitch, createFollowUp2Pitch, createEmailPitch, sendEmailViaSMTP } = require('./services/outreach');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Get Configuration
app.get('/api/config', (req, res) => {
  res.json(storage.getConfig());
});

// 2. Save Configuration
app.post('/api/config', (req, res) => {
  const updated = storage.saveConfig(req.body);
  res.json({ success: true, config: updated });
});

// 3. Get All Leads & Stats
app.get('/api/leads', (req, res) => {
  const leads = storage.getLeads();
  const config = storage.getConfig();
  
  // Calculate analytics
  const totalLeads = leads.length;
  const demosReady = leads.filter(l => l.status === 'demo_ready').length;
  const contacted = leads.filter(l => l.status === 'contacted').length;
  const closedDeals = leads.filter(l => l.status === 'deal_closed').length;
  
  // Revenue calculation based on price_offer
  const priceNumeric = parseInt((config.price_offer || '25000').replace(/[^0-9]/g, '')) || 25000;
  const revenueTotal = closedDeals * priceNumeric;

  res.json({
    leads,
    stats: {
      totalLeads,
      demosReady,
      contacted,
      closedDeals,
      revenueTotal,
      currency: config.currency || 'PKR'
    }
  });
});

// 4. Trigger Lead Discovery Engine
app.post('/api/leads/discover', async (req, res) => {
  try {
    const config = storage.getConfig();
    const city = req.body.city || config.target_city;
    const niche = req.body.niche || config.business_niche;
    const count = parseInt(req.body.count) || 5;

    const discovered = await discoverLeads(city, niche, count);
    
    // Save to storage
    const saved = [];
    for (const lead of discovered) {
      const added = storage.addLead(lead);
      saved.push(added);
    }

    res.json({ success: true, count: saved.length, leads: saved });
  } catch (error) {
    console.error("Discovery error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Add Single Lead Manually
app.post('/api/leads/add', (req, res) => {
  const { business_name, category, city, phone, email, address } = req.body;
  if (!business_name) {
    return res.status(400).json({ error: "Business name is required" });
  }

  const slug = business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newLead = {
    id: 'lead_' + Math.random().toString(36).substr(2, 9),
    business_name,
    category: category || 'General Business',
    city: city || 'Karachi',
    address: address || `${business_name}, ${city || 'Karachi'}`,
    phone: phone || '',
    email: email || '',
    rating: 4.8,
    reviews_count: 50,
    has_website: false,
    lead_score: 90,
    slug,
    discovered_at: new Date().toISOString(),
    status: 'demo_ready'
  };

  const saved = storage.addLead(newLead);
  res.json({ success: true, lead: saved });
});

// 6. Update Lead Status
app.patch('/api/leads/:id', (req, res) => {
  const updated = storage.updateLead(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Lead not found" });
  }
  res.json({ success: true, lead: updated });
});

// 7. Delete Lead
app.delete('/api/leads/:id', (req, res) => {
  storage.deleteLead(req.params.id);
  res.json({ success: true });
});

// 8. Get Outreach Pitches for Lead
app.get('/api/outreach/:id', (req, res) => {
  const leads = storage.getLeads();
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const config = storage.getConfig();
  const host = req.get('host');
  const protocol = req.protocol;
  // Use public tunnel if available, else local host
  const baseUrl = config.public_url || `${protocol}://${host}`;
  const demoUrl = `${baseUrl}/demo/${lead.slug}`;

  const waPitch = createWhatsAppPitch(lead, demoUrl, config);
  const followup1 = createFollowUp1Pitch(lead, demoUrl, config);
  const followup2 = createFollowUp2Pitch(lead, demoUrl, config);
  const emailPitch = createEmailPitch(lead, demoUrl, config);

  res.json({
    lead,
    demoUrl,
    whatsapp: waPitch,
    followup1,
    followup2,
    email: emailPitch
  });
});

// 9. PUBLIC DYNAMIC DEMO WEBSITE ROUTE
app.get('/demo/:slug', (req, res) => {
  const leads = storage.getLeads();
  const slug = req.params.slug.toLowerCase();
  let lead = leads.find(l => l.slug === slug);

  // If not found in active leads, check SEED_PROSPECTS
  if (!lead) {
    const { SEED_PROSPECTS } = require('./services/scraper');
    for (const cityKey in SEED_PROSPECTS) {
      if (Array.isArray(SEED_PROSPECTS[cityKey])) {
        const found = SEED_PROSPECTS[cityKey].find(p => {
          const s = p.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return s === slug;
        });
        if (found) {
          lead = { ...found, slug };
          break;
        }
      }
    }
  }

  // If still not found, generate on-the-fly with smart niche inference
  if (!lead) {
    const formattedName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    let cat = 'Car Detailing & Ceramic Studio';
    if (/dent|smile|teeth|ortho/i.test(slug)) {
      cat = 'Dental Care & Implants';
    } else if (/clinic|salon|spa|aesthetic|skin|beauty|laser|medspa/i.test(slug)) {
      cat = 'Aesthetic Clinics & Salons';
    }

    const config = storage.getConfig();
    lead = {
      business_name: formattedName,
      category: cat,
      city: config.target_city || 'Dubai',
      country: config.target_country || 'UAE',
      phone: '+971 55 241 8817',
      rating: 4.9,
      reviews_count: 120,
      slug
    };
  }

  const config = storage.getConfig();
  const html = generateSiteHTML(lead, config);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Antigravity SiteSeller Engine Running!`);
  console.log(`📊 Dashboard URL : http://localhost:${PORT}`);
  console.log(`⚡ Demo Example : http://localhost:${PORT}/demo/zehra-abbas-salon-spa`);
  console.log(`=================================================\n`);
});
