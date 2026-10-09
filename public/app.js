let currentLeads = [];
let currentConfig = {};
let activeOutreachData = null;
let hideContacted = false;
let selectedMarketFilter = 'ALL';

function toggleHideContacted(val) {
  hideContacted = val;
  renderLeadsTable();
}

// Market Filter (ALL, UAE, USA, Australia, Pakistan)
function filterByMarket(marketCode) {
  selectedMarketFilter = marketCode;

  // Update button visual styles
  const buttons = document.querySelectorAll('.market-pill');
  buttons.forEach(btn => {
    btn.className = 'market-pill text-[11px] font-mono-tech font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition';
  });

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.className = 'market-pill active text-[11px] font-mono-tech font-bold px-2.5 py-1 rounded-lg bg-amber-400 text-black shadow-md shadow-amber-400/20';
  } else {
    // Fallback if called programmatically
    buttons.forEach(btn => {
      if (btn.innerText.includes(marketCode) || (marketCode === 'ALL' && btn.innerText.trim() === 'ALL')) {
        btn.className = 'market-pill active text-[11px] font-mono-tech font-bold px-2.5 py-1 rounded-lg bg-amber-400 text-black shadow-md shadow-amber-400/20';
      }
    });
  }

  renderLeadsTable();
}

// Handle Market Selection in Dropdown
async function handleMarketChange(market) {
  const defaults = {
    dubai: { price_offer: "500 AED", currency: "AED", city: "Dubai", country: "UAE" },
    usa: { price_offer: "$249 USD", currency: "USD", city: "Miami", country: "USA" },
    australia: { price_offer: "$299 AUD", currency: "AUD", city: "Sydney", country: "Australia" },
    karachi: { price_offer: "25,000 PKR", currency: "PKR", city: "Karachi", country: "Pakistan" }
  };

  const selected = defaults[market] || defaults.dubai;
  
  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currency: selected.currency,
        price_offer: selected.price_offer,
        target_city: selected.city,
        target_country: selected.country
      })
    });
    
    // Auto switch the filter pill to match the selected market
    const filterKey = market === 'dubai' ? 'UAE' : market === 'usa' ? 'USA' : market === 'australia' ? 'Australia' : 'Pakistan';
    filterByMarket(filterKey);
    loadLeads();
  } catch (err) {
    console.error('Error auto-updating market config:', err);
  }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  loadLeads();
});

// Load Configuration
async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    currentConfig = await res.json();
    if (document.getElementById('cfg-sender-name')) document.getElementById('cfg-sender-name').value = currentConfig.sender_name || '';
    if (document.getElementById('cfg-agency-name')) document.getElementById('cfg-agency-name').value = currentConfig.agency_name || '';
    if (document.getElementById('cfg-sender-phone')) document.getElementById('cfg-sender-phone').value = currentConfig.sender_phone || '';
    if (document.getElementById('cfg-currency')) document.getElementById('cfg-currency').value = currentConfig.currency || 'AED';
    if (document.getElementById('cfg-price-offer')) document.getElementById('cfg-price-offer').value = currentConfig.price_offer || '500 AED';
  } catch (err) {
    console.error('Error loading config:', err);
  }
}

// Save Configuration
async function saveSettings(e) {
  e.preventDefault();
  const updated = {
    sender_name: document.getElementById('cfg-sender-name').value,
    agency_name: document.getElementById('cfg-agency-name').value,
    sender_phone: document.getElementById('cfg-sender-phone').value,
    currency: document.getElementById('cfg-currency') ? document.getElementById('cfg-currency').value : 'AED',
    price_offer: document.getElementById('cfg-price-offer').value
  };

  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    currentConfig = { ...currentConfig, ...updated };
    closeConfigModal();
    loadLeads(); // refresh revenue math
  } catch (err) {
    alert('Failed to save settings');
  }
}

// Load Leads & Stats
async function loadLeads() {
  const container = document.getElementById('leads-container');
  try {
    const res = await fetch('/api/leads');
    const data = await res.json();
    currentLeads = data.leads || [];
    const stats = data.stats || {};

    // Update Stats
    document.getElementById('stat-total').innerText = stats.totalLeads || 0;
    document.getElementById('stat-demos').innerText = stats.demosReady || 0;
    document.getElementById('stat-contacted').innerText = stats.contacted || 0;
    document.getElementById('stat-closed').innerText = stats.closedDeals || 0;
    
    // Revenue formatted
    const revFormatted = (stats.revenueTotal || 0).toLocaleString();
    document.getElementById('stat-revenue').innerText = `${revFormatted} ${stats.currency || 'AED'}`;
    document.getElementById('lead-count-badge').innerText = currentLeads.length;

    renderLeadsTable();
  } catch (err) {
    console.error('Error loading leads:', err);
    container.innerHTML = `<div class="glass-card rounded-2xl p-8 text-center text-rose-400">Failed to load leads from agent server.</div>`;
  }
}

// Render Leads
function renderLeadsTable() {
  const container = document.getElementById('leads-container');
  let displayLeads = currentLeads;

  // Filter 1: Contacted toggle
  if (hideContacted) {
    displayLeads = displayLeads.filter(l => l.status === 'demo_ready');
  }

  // Filter 2: Market / Country Filter
  if (selectedMarketFilter !== 'ALL') {
    displayLeads = displayLeads.filter(lead => {
      const country = (lead.country || '').toUpperCase();
      const city = (lead.city || '').toLowerCase();

      if (selectedMarketFilter === 'UAE') {
        return country === 'UAE' || city.includes('dubai');
      }
      if (selectedMarketFilter === 'USA') {
        return country === 'USA' || ['miami', 'los angeles', 'dallas', 'new york'].some(c => city.includes(c));
      }
      if (selectedMarketFilter === 'Australia') {
        return country === 'AUSTRALIA' || ['sydney', 'melbourne', 'brisbane'].some(c => city.includes(c));
      }
      if (selectedMarketFilter === 'Pakistan') {
        return country === 'PAKISTAN' || ['karachi', 'lahore', 'islamabad'].some(c => city.includes(c));
      }
      return true;
    });
  }

  if (displayLeads.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-3xl p-12 text-center space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-3xl mx-auto border border-indigo-500/20">
          <i class="fas fa-search-location text-amber-400"></i>
        </div>
        <h4 class="text-lg font-bold text-white">No Leads in ${selectedMarketFilter} Filter</h4>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          ${hideContacted ? 'All current leads in this market have been pitched! Uncheck "Hide Pitched Leads" or discover fresh prospects.' : 'Click "Hunt & Build Demos" to fetch fresh verified prospects and generate bespoke client sites instantly.'}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = displayLeads.map(lead => {
    const statusBadges = {
      demo_ready: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      contacted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      replied: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      deal_closed: 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold'
    };

    const statusLabels = {
      demo_ready: '● Demo Ready',
      contacted: '✓ Pitch Sent',
      replied: '💬 In Discussion',
      deal_closed: '🏆 Deal Won'
    };

    // Country flags & badge style
    let flagBadge = '🇦🇪 UAE';
    let flagClass = 'bg-amber-400/10 text-amber-300 border-amber-400/20';
    const c = (lead.country || '').toUpperCase();
    const cityLower = (lead.city || '').toLowerCase();
    
    if (c === 'USA' || ['miami', 'los angeles', 'dallas', 'new york'].some(x => cityLower.includes(x))) {
      flagBadge = '🇺🇸 USA';
      flagClass = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    } else if (c === 'AUSTRALIA' || ['sydney', 'melbourne', 'brisbane'].some(x => cityLower.includes(x))) {
      flagBadge = '🇦🇺 AUS';
      flagClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    } else if (c === 'PAKISTAN' || ['karachi', 'lahore'].some(x => cityLower.includes(x))) {
      flagBadge = '🇵🇰 PAK';
      flagClass = 'bg-green-500/10 text-green-300 border-green-500/20';
    }

    const demoUrl = `/demo/${lead.slug}`;

    return `
      <div class="glass-card rounded-2xl p-5 sm:p-6 transition hover:border-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusBadges[lead.status] || 'bg-slate-800 text-slate-300 border-slate-700'}">
              ${statusLabels[lead.status] || lead.status}
            </span>
            <span class="text-xs font-mono-tech px-2 py-0.5 rounded-md border ${flagClass}">
              ${flagBadge}
            </span>
            <span class="text-xs text-indigo-400 font-medium">${lead.category}</span>
            <span class="text-xs text-slate-500">• ${lead.city}</span>
          </div>

          <h4 class="text-lg font-extrabold text-white flex items-center gap-2">
            ${lead.business_name}
            <span class="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 flex items-center gap-1 font-mono-tech">
              <i class="fas fa-star text-[10px]"></i> ${lead.rating || '4.9'} (${lead.reviews_count || 120}+)
            </span>
          </h4>

          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span><i class="fas fa-phone-alt text-slate-500 mr-1"></i> ${lead.phone || 'No phone'}</span>
            <span><i class="fas fa-map-marker-alt text-slate-500 mr-1"></i> ${lead.address || lead.city}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <!-- LIVE DEMO BUTTON -->
          <a href="${demoUrl}" target="_blank" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm font-mono-tech">
            <i class="fas fa-external-link-alt text-[10px]"></i> View 3D Demo
          </a>

          <!-- VIEW PITCH BUTTON -->
          ${lead.status === 'contacted' || lead.status === 'replied' || lead.status === 'deal_closed' ? `
          <button onclick="openPitchModal('${lead.id}')" class="px-3.5 py-2 rounded-xl bg-slate-800/90 text-emerald-400 border border-slate-700/60 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 transition" title="Pitched! Click to send follow-up">
            <i class="fas fa-check-double text-emerald-400"></i> Sent (Follow-Up)
          </button>
          ` : `
          <button onclick="openPitchModal('${lead.id}')" class="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition font-mono-tech">
            <i class="fab fa-whatsapp"></i> 1-Click WhatsApp
          </button>
          `}

          <!-- STATUS SELECTOR -->
          <select onchange="updateLeadStatus('${lead.id}', this.value)" class="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-300 font-semibold focus:outline-none">
            <option value="demo_ready" ${lead.status === 'demo_ready' ? 'selected' : ''}>Demo Ready</option>
            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Pitch Sent</option>
            <option value="replied" ${lead.status === 'replied' ? 'selected' : ''}>In Discussion</option>
            <option value="deal_closed" ${lead.status === 'deal_closed' ? 'selected' : ''}>🏆 Deal Closed</option>
          </select>

          <!-- DELETE -->
          <button onclick="deleteLead('${lead.id}')" class="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition" title="Delete">
            <i class="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Launch Discovery & Building
async function launchHunt() {
  const btn = document.getElementById('btn-hunt');
  const city = document.getElementById('input-city').value;
  const niche = document.getElementById('input-niche').value;

  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Hunting & Building Demos...</span>`;

  try {
    const res = await fetch('/api/leads/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, niche, count: 5 })
    });
    const data = await res.json();
    if (data.success) {
      loadLeads();
    }
  } catch (err) {
    alert('Failed to run discovery');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-bolt"></i> <span>Hunt & Build Demos</span>`;
  }
}

// Update Status
async function updateLeadStatus(id, newStatus) {
  try {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    loadLeads();
  } catch (err) {
    console.error('Status update failed:', err);
  }
}

// Delete Lead
async function deleteLead(id) {
  if (!confirm('Are you sure you want to delete this lead?')) return;
  try {
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    loadLeads();
  } catch (err) {
    console.error('Delete failed:', err);
  }
}

// Mark Active Lead Contacted on WhatsApp Click
function markActiveLeadContacted() {
  if (activeOutreachData && activeOutreachData.lead) {
    updateLeadStatus(activeOutreachData.lead.id, 'contacted');
    setTimeout(closePitchModal, 350);
  }
}

// Open Pitch Modal
async function openPitchModal(leadId) {
  const modal = document.getElementById('modal-pitch');
  try {
    const res = await fetch(`/api/outreach/${leadId}`);
    activeOutreachData = await res.json();

    document.getElementById('modal-pitch-title').innerText = `Outreach for ${activeOutreachData.lead.business_name}`;
    document.getElementById('text-pitch-wa').value = activeOutreachData.whatsapp.rawMessage;
    
    // Set Target Phone Number & Action Buttons
    const phoneEl = document.getElementById('modal-wa-target-number');
    if (phoneEl) {
      phoneEl.innerText = activeOutreachData.whatsapp.phone ? `+${activeOutreachData.whatsapp.phone}` : (activeOutreachData.lead.phone || 'N/A');
    }
    const btnDirect = document.getElementById('btn-open-wa-direct');
    if (btnDirect) btnDirect.href = activeOutreachData.whatsapp.clickToChatUrl;
    const btnWeb = document.getElementById('btn-open-wa-web');
    if (btnWeb) btnWeb.href = activeOutreachData.whatsapp.webWhatsAppUrl || activeOutreachData.whatsapp.clickToChatUrl;

    // Set Market Badge
    const mBadge = document.getElementById('modal-market-badge');
    if (mBadge && activeOutreachData.lead) {
      const cntry = (activeOutreachData.lead.country || '').toUpperCase();
      const city = (activeOutreachData.lead.city || '').toLowerCase();

      if (cntry === 'UAE' || city.includes('dubai')) {
        mBadge.innerText = '🇦🇪 DUBAI OUTREACH (500 AED)';
        mBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30';
      } else if (cntry === 'USA' || ['miami', 'los angeles', 'dallas', 'new york'].some(c => city.includes(c))) {
        mBadge.innerText = '🇺🇸 US OUTREACH ($249 USD)';
        mBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-blue-400/10 text-blue-300 border border-blue-400/30';
      } else if (cntry === 'AUSTRALIA' || ['sydney', 'melbourne', 'brisbane'].some(c => city.includes(c))) {
        mBadge.innerText = '🇦🇺 AUSTRALIA OUTREACH ($299 AUD)';
        mBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/30';
      } else {
        mBadge.innerText = '🇵🇰 PAKISTAN OUTREACH (25,000 PKR)';
        mBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-green-400/10 text-green-300 border border-green-400/30';
      }
    }

    document.getElementById('text-pitch-email-subject').value = activeOutreachData.email.subject;
    document.getElementById('text-pitch-email-body').value = activeOutreachData.email.text;

    modal.classList.remove('hidden');
  } catch (err) {
    alert('Failed to load pitch');
  }
}

function closePitchModal() {
  document.getElementById('modal-pitch').classList.add('hidden');
}

function switchPitchTab(tab) {
  const btnWa = document.getElementById('tab-btn-wa');
  const btnFu1 = document.getElementById('tab-btn-fu1');
  const btnFu2 = document.getElementById('tab-btn-fu2');
  const btnEmail = document.getElementById('tab-btn-email');
  const boxWa = document.getElementById('box-pitch-wa');
  const boxEmail = document.getElementById('box-pitch-email');
  const hint = document.getElementById('pitch-tag-hint');
  const btnDirect = document.getElementById('btn-open-wa-direct');
  const btnWeb = document.getElementById('btn-open-wa-web');

  // Reset tab button styles
  const inactiveClass = 'px-3.5 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-1.5 transition';
  btnWa.className = inactiveClass;
  btnFu1.className = inactiveClass;
  btnFu2.className = inactiveClass;
  btnEmail.className = inactiveClass;

  if (tab === 'wa') {
    btnWa.className = 'px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5';
    document.getElementById('text-pitch-wa').value = activeOutreachData.whatsapp.rawMessage;
    if (btnDirect) btnDirect.href = activeOutreachData.whatsapp.clickToChatUrl;
    if (btnWeb) btnWeb.href = activeOutreachData.whatsapp.webWhatsAppUrl || activeOutreachData.whatsapp.clickToChatUrl;
    hint.innerText = '✨ Step 1: Initial personalized message with live demo link';
    boxWa.classList.remove('hidden');
    boxEmail.classList.add('hidden');
  } else if (tab === 'fu1') {
    btnFu1.className = 'px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5';
    document.getElementById('text-pitch-wa').value = activeOutreachData.followup1 ? activeOutreachData.followup1.rawMessage : '';
    if (btnDirect) btnDirect.href = activeOutreachData.followup1 ? activeOutreachData.followup1.clickToChatUrl : '#';
    if (btnWeb) btnWeb.href = activeOutreachData.followup1 ? (activeOutreachData.followup1.webWhatsAppUrl || activeOutreachData.followup1.clickToChatUrl) : '#';
    hint.innerText = '💬 Step 2: Polite Day-2 follow up reminder asking if they reviewed it';
    boxWa.classList.remove('hidden');
    boxEmail.classList.add('hidden');
  } else if (tab === 'fu2') {
    btnFu2.className = 'px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5';
    document.getElementById('text-pitch-wa').value = activeOutreachData.followup2 ? activeOutreachData.followup2.rawMessage : '';
    if (btnDirect) btnDirect.href = activeOutreachData.followup2 ? activeOutreachData.followup2.clickToChatUrl : '#';
    if (btnWeb) btnWeb.href = activeOutreachData.followup2 ? (activeOutreachData.followup2.webWhatsAppUrl || activeOutreachData.followup2.clickToChatUrl) : '#';
    hint.innerText = '⏳ Step 3: High-urgency last call (48-hour reservation expiring)';
    boxWa.classList.remove('hidden');
    boxEmail.classList.add('hidden');
  } else if (tab === 'email') {
    btnEmail.className = 'px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5';
    boxWa.classList.add('hidden');
    boxEmail.classList.remove('hidden');
  }
}

// Manual Add Lead
function openAddLeadModal() {
  document.getElementById('modal-add-lead').classList.remove('hidden');
}
function closeAddLeadModal() {
  document.getElementById('modal-add-lead').classList.add('hidden');
}
async function handleManualAddLead(e) {
  e.preventDefault();
  const payload = {
    business_name: document.getElementById('lead-bname').value,
    category: document.getElementById('lead-cat').value,
    city: document.getElementById('lead-city').value,
    phone: document.getElementById('lead-phone').value
  };

  try {
    await fetch('/api/leads/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    closeAddLeadModal();
    loadLeads();
  } catch (err) {
    alert('Failed to add lead');
  }
}

// Settings Modal
function openConfigModal() {
  document.getElementById('modal-config').classList.remove('hidden');
}
function closeConfigModal() {
  document.getElementById('modal-config').classList.add('hidden');
}

// Copy Helper
function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  el.select();
  navigator.clipboard.writeText(el.value);
  alert('Copied to clipboard! Ready to paste into WhatsApp or Email.');
}
