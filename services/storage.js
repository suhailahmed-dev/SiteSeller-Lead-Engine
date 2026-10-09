const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const leadsFile = path.join(dataDir, 'leads.json');
const configFile = path.join(dataDir, 'config.json');

// Ensure data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default config
const defaultConfig = {
  sender_name: "Suhail Ahmed",
  agency_name: "Antigravity Digital",
  sender_phone: "+923000000000",
  sender_email: "suhail@antigravitydigital.com",
  target_city: "Karachi",
  target_country: "Pakistan",
  business_niche: "Aesthetic Clinics & Salons",
  currency: "PKR",
  price_offer: "25,000 PKR",
  max_leads_per_day: 15
};

function getConfig() {
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  try {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (e) {
    return defaultConfig;
  }
}

function saveConfig(newConfig) {
  const current = getConfig();
  const updated = { ...current, ...newConfig };
  fs.writeFileSync(configFile, JSON.stringify(updated, null, 2));
  return updated;
}

function getLeads() {
  if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveLeads(leads) {
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
}

function addLead(lead) {
  const leads = getLeads();
  // Check if exists by name & city
  const exists = leads.find(l => l.business_name.toLowerCase() === lead.business_name.toLowerCase() && l.city.toLowerCase() === lead.city.toLowerCase());
  if (exists) {
    return exists;
  }
  leads.unshift(lead);
  saveLeads(leads);
  return lead;
}

function updateLead(id, updates) {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates, updated_at: new Date().toISOString() };
    saveLeads(leads);
    return leads[index];
  }
  return null;
}

function deleteLead(id) {
  let leads = getLeads();
  leads = leads.filter(l => l.id !== id);
  saveLeads(leads);
  return true;
}

module.exports = {
  getConfig,
  saveConfig,
  getLeads,
  saveLeads,
  addLead,
  updateLead,
  deleteLead
};
