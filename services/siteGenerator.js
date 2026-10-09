/**
 * ⚡ ANTIGRAVITY MULTI-NICHE HIGH-TICKET WEBSITE GENERATOR
 * Generates 100% tailored, bespoke, luxury interactive websites for:
 * 1. 🏎️ Luxury Auto Detailing, PPF & Ceramic Studios (With 3D Model-Viewer & Scratch Slider)
 * 2. ✨ Aesthetic Clinics, MedSpas & Skin Care (With Skin Radiance Slider & VIP Treatment Engine)
 * 3. 🦷 Cosmetic Dentistry & Smile Design (With Hollywood Smile Slider & Veneer Selector)
 * 4. ☀️ High-Ticket Solar Energy & Installation
 */

function detectNiche(prospect) {
  const text = `${prospect.category || ''} ${prospect.business_name || ''}`.toLowerCase();
  if (/dent|smile|teeth|ortho/i.test(text)) return 'dental';
  if (/clinic|salon|spa|aesthetic|skin|beauty|dermatology|medspa|laser|facial/i.test(text)) return 'aesthetic';
  if (/solar|energy|renewable/i.test(text)) return 'solar';
  return 'auto';
}

function getCurrencyData(prospect, agencyConfig) {
  const loc = `${prospect.city || ''} ${prospect.country || ''} ${prospect.address || ''}`.toLowerCase();
  if (loc.includes('aust') || loc.includes('sydney') || loc.includes('melbourne') || loc.includes('brisbane')) {
    return {
      code: 'AUD',
      symbol: '$',
      suffix: ' AUD',
      priceDefault: agencyConfig.price_offer && agencyConfig.price_offer.includes('AUD') ? agencyConfig.price_offer : '$299 AUD',
      tld: '.com.au'
    };
  }
  if (loc.includes('usa') || loc.includes('united states') || loc.includes('miami') || loc.includes('angeles') || loc.includes('dallas') || loc.includes('york')) {
    return {
      code: 'USD',
      symbol: '$',
      suffix: '',
      priceDefault: agencyConfig.price_offer && agencyConfig.price_offer.includes('$') ? agencyConfig.price_offer : '$249',
      tld: '.com'
    };
  }
  if (loc.includes('karachi') || loc.includes('lahore') || loc.includes('pakistan')) {
    return {
      code: 'PKR',
      symbol: 'Rs. ',
      suffix: '',
      priceDefault: agencyConfig.price_offer && agencyConfig.price_offer.includes('PKR') ? agencyConfig.price_offer : '25,000 PKR',
      tld: '.pk'
    };
  }
  return {
    code: 'AED',
    symbol: 'AED ',
    suffix: '',
    priceDefault: agencyConfig.price_offer && agencyConfig.price_offer.includes('AED') ? agencyConfig.price_offer : '500 AED',
    tld: '.ae'
  };
}

function cleanPhone(phone) {
  let cleaned = (phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '971' + cleaned.slice(1);
  }
  return cleaned;
}

// MAIN ENTRYPOINT
function generateSiteHTML(prospect, agencyConfig) {
  const niche = detectNiche(prospect);
  if (niche === 'aesthetic') {
    return generateAestheticSite(prospect, agencyConfig);
  }
  if (niche === 'dental') {
    return generateDentalSite(prospect, agencyConfig);
  }
  return generateAutoSite(prospect, agencyConfig);
}

// ============================================================================
// 1. 🏎️ LUXURY AUTO ATELIER TEMPLATE
// ============================================================================
function generateAutoSite(prospect, agencyConfig) {
  const waNumber = cleanPhone(prospect.phone);
  const city = prospect.city || "Dubai";
  const address = prospect.address || `${prospect.business_name}, ${city}`;
  const curr = getCurrencyData(prospect, agencyConfig);
  const agencyPhone = (agencyConfig.sender_phone || '+923000000000').replace(/[^0-9]/g, '');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth bg-[#08090C] text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${prospect.business_name} | Bespoke Auto Atelier</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Lightweight Google Model-Viewer -->
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>

  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #08090C; color: #E2E8F0; overflow-x: hidden; }
    .font-serif-luxury { font-family: 'Cinzel', Georgia, serif; }
    .font-mono-clean { font-family: 'Space Grotesk', monospace; }
    .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
    .gold-border-active { border: 1.5px solid #D4AF37; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
    .atelier-card { background: rgba(14, 17, 24, 0.7); border: 1px solid rgba(255, 255, 255, 0.07); backdrop-filter: blur(12px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .atelier-card:hover { border-color: rgba(212, 175, 55, 0.35); transform: translateY(-2px); }
    .scratch-container { position: relative; overflow: hidden; user-select: none; -webkit-user-select: none; }
    .scratch-divider { position: absolute; top: 0; bottom: 0; width: 2.5px; background: #D4AF37; box-shadow: 0 0 12px rgba(212, 175, 55, 0.8); cursor: ew-resize; z-index: 20; }
    .scratch-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: #D4AF37; color: #000; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.9); }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #08090C; }
    ::-webkit-scrollbar-thumb { background: #1E2330; border-radius: 3px; }
  </style>
</head>
<body class="selection:bg-amber-400 selection:text-black antialiased">

  <!-- TOP 48H CLAIM BAR -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-[#060709]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2 text-xs">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono-clean">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          BESPOKE PROTOTYPE
        </span>
        <span class="text-slate-400 hidden sm:inline">Exclusively Prepared for <strong>${prospect.business_name} (${city})</strong></span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-slate-400 text-xs hidden md:inline">Connect to your official ${curr.tld} domain:</span>
        <a href="https://wa.me/${agencyPhone}?text=Hi%20${encodeURIComponent(agencyConfig.sender_name)}%2C%20I%20saw%20the%20bespoke%20website%20prototype%20for%20${encodeURIComponent(prospect.business_name)}.%20Let's%20activate%20it!" 
           target="_blank"
           class="bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-3 py-1 rounded-md transition shadow-md shadow-amber-400/20 flex items-center gap-1.5 text-xs">
          <i class="fab fa-whatsapp"></i> Claim This Website (${curr.priceDefault})
        </a>
      </div>
    </div>
  </div>

  <!-- NAVIGATION -->
  <header class="fixed top-9 left-0 right-0 z-40 px-4 md:px-8 py-4 bg-[#08090C]/85 backdrop-blur-md border-b border-white/[0.06]">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black text-sm">
          <i class="fas fa-crown"></i>
        </div>
        <div>
          <div class="text-base font-extrabold tracking-widest uppercase font-serif-luxury text-white">
            ${prospect.business_name}
          </div>
          <div class="text-[10px] text-slate-400 tracking-widest uppercase font-mono-clean">${city} • Certified Atelier</div>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-8 text-xs text-slate-300 font-medium">
        <a href="#services" class="hover:text-amber-400 transition">Services</a>
        <a href="#vehicle-quote" class="hover:text-amber-400 transition">Vehicle Selector</a>
        <a href="#scratch-slider" class="hover:text-amber-400 transition">Paint Restoration</a>
        <a href="#packages" class="hover:text-amber-400 transition">Packages</a>
        <a href="#atelier" class="hover:text-amber-400 transition">Atelier Studio</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20inquire%20about%20a%20detailing%20slot." 
           target="_blank"
           class="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2">
          <i class="fab fa-whatsapp text-emerald-400 text-sm"></i>
          <span>VIP WhatsApp</span>
        </a>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="pt-36 pb-20 px-4 md:px-8 relative border-b border-white/5">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-7">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono-clean mb-6">
            <i class="fas fa-shield-halved"></i>
            <span>XPEL & GRAPHENE CERTIFIED ATELIER • ${city.toUpperCase()}</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-black text-white leading-tight uppercase font-serif-luxury tracking-tight mb-6">
            Flawless <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              Paint Protection
            </span><br>
            & Restoration
          </h1>

          <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
            Bespoke 10-Mil Paint Protection Film (PPF), multi-stage paint correction, and 10H Graphene ceramic encapsulation engineered for exotic and luxury supercars in ${city}.
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20reserve%20a%20detailing%20and%20PPF%20slot." 
               target="_blank"
               class="bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-7 py-3.5 rounded-xl transition shadow-lg shadow-amber-400/20 text-xs flex items-center gap-2 font-mono-clean uppercase tracking-wider">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Reserve Cleanroom Bay</span>
            </a>

            <a href="#vehicle-quote" 
               class="atelier-card text-slate-200 hover:text-white px-6 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 font-mono-clean">
              <span>Select Your Car</span>
              <i class="fas fa-arrow-down text-xs text-amber-400"></i>
            </a>
          </div>

          <div class="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/5 font-mono-clean">
            <div>
              <div class="text-2xl font-black text-white">100%</div>
              <div class="text-xs text-slate-400 mt-0.5">Wrapped Edges</div>
            </div>
            <div>
              <div class="text-2xl font-black text-amber-400">10-Year</div>
              <div class="text-xs text-slate-400 mt-0.5">PPF Warranty</div>
            </div>
            <div>
              <div class="text-2xl font-black text-white">10H</div>
              <div class="text-xs text-slate-400 mt-0.5">Graphene Hardness</div>
            </div>
          </div>
        </div>

        <!-- 3D CAR VIEWPORT -->
        <div class="lg:col-span-5 relative">
          <div class="atelier-card rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <div class="flex items-center justify-between pb-3 border-b border-white/5 text-[11px] font-mono-clean text-slate-400">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Interactive 3D Preview (Drag to Rotate)
              </span>
              <span class="text-amber-400">Cleanroom Spec</span>
            </div>

            <div class="h-80 w-full relative">
              <model-viewer 
                id="hero-car-viewer"
                src="/models/car.glb"
                alt="Supercar 3D View"
                auto-rotate
                camera-controls
                shadow-intensity="1.5"
                exposure="1.0"
                style="width: 100%; height: 100%; background: radial-gradient(circle at center, #151922 0%, #08090C 100%);">
              </model-viewer>
            </div>

            <!-- Color Palette Switcher -->
            <div class="pt-4 border-t border-white/5 flex items-center justify-between">
              <span class="text-xs font-mono-clean text-slate-400">Paint Spec:</span>
              <div class="flex items-center gap-2">
                <button onclick="setCarVariant('Carmine Candy')" title="Carmine Candy Red" class="w-6 h-6 rounded-full bg-red-700 border-2 border-white/30 hover:scale-110 transition"></button>
                <button onclick="setCarVariant('Pearly Swirly')" title="Pearly White" class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white/30 hover:scale-110 transition"></button>
                <button onclick="setCarVariant('Torched Graphite')" title="Graphite Grey" class="w-6 h-6 rounded-full bg-zinc-800 border-2 border-white/30 hover:scale-110 transition"></button>
                <button onclick="setCarGold()" title="Champagne Gold" class="w-6 h-6 rounded-full bg-amber-400 border-2 border-white/30 hover:scale-110 transition"></button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- INTERACTIVE VEHICLE SELECTOR & INSTANT WHATSAPP QUOTE -->
  <section id="vehicle-quote" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0A0D14]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-amber-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Instant Quote Engine</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Select Your Supercar
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Select your vehicle to preview customized PPF and Graphene Ceramic packages tailored to its bodywork dimensions.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        <button onclick="selectCar('Porsche 911 GT3 RS', '${curr.symbol}2,800${curr.suffix}', '${curr.symbol}11,500${curr.suffix}', '3 Days', 'Coupe / Sports')" 
                class="v-tab active atelier-card gold-border-active rounded-2xl p-4 text-center transition">
          <i class="fas fa-car text-xl text-amber-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Porsche 911</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Coupe</div>
        </button>

        <button onclick="selectCar('Mercedes G63 AMG', '${curr.symbol}3,400${curr.suffix}', '${curr.symbol}14,000${curr.suffix}', '4 Days', 'Luxury SUV / 4x4')" 
                class="v-tab atelier-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-truck-monster text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Mercedes G63</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Box SUV</div>
        </button>

        <button onclick="selectCar('Ferrari SF90 Stradale', '${curr.symbol}3,200${curr.suffix}', '${curr.symbol}13,500${curr.suffix}', '4 Days', 'Mid-Engine Exotic')" 
                class="v-tab atelier-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-bolt text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Ferrari SF90</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Supercar</div>
        </button>

        <button onclick="selectCar('Lamborghini Urus', '${curr.symbol}3,200${curr.suffix}', '${curr.symbol}13,000${curr.suffix}', '4 Days', 'Super SUV')" 
                class="v-tab atelier-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-tachometer-alt text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Lambo Urus</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Super SUV</div>
        </button>

        <button onclick="selectCar('Rolls-Royce Cullinan', '${curr.symbol}4,200${curr.suffix}', '${curr.symbol}16,500${curr.suffix}', '5 Days', 'Ultra-Luxury')" 
                class="v-tab atelier-card border-white/10 rounded-2xl p-4 text-center transition col-span-2 sm:col-span-1">
          <i class="fas fa-gem text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Rolls Cullinan</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Ultra Luxury</div>
        </button>
      </div>

      <!-- Live Calculation Card -->
      <div class="atelier-card rounded-3xl p-6 md:p-8 border border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Vehicle Selected</div>
            <div id="v-name" class="text-xl font-bold text-white font-serif-luxury mt-1">Porsche 911 GT3 RS</div>
            <div id="v-cat" class="text-xs text-amber-400 font-mono-clean">Coupe / Sports</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">10H Ceramic Coating</div>
            <div id="v-price-ceramic" class="text-2xl font-black text-white font-mono-clean mt-1">${curr.symbol}2,800${curr.suffix}</div>
            <div class="text-xs text-slate-400 font-mono-clean">5-Year Multi-Layer Shield</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Full Body 10-Mil PPF</div>
            <div id="v-price-ppf" class="text-2xl font-black text-amber-400 font-mono-clean mt-1">${curr.symbol}11,500${curr.suffix}</div>
            <div id="v-price-time" class="text-xs text-slate-400 font-mono-clean">Self-Healing • 3 Days bay time</div>
          </div>

          <div>
            <a id="v-book-btn" 
               href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20drive%20a%20Porsche%20911%20GT3%20RS%20in%20${encodeURIComponent(city)}.%20I%20would%20like%20to%20book%20a%20VIP%20inspection%20for%20Full%20PPF%20%26%20Ceramic." 
               target="_blank"
               class="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 font-mono-clean">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Book For This Model</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- INTERACTIVE SCRATCH RESTORATION SLIDER -->
  <section id="scratch-slider" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#08090C]">
    <div class="max-w-6xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-amber-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Paint Restoration Science</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Scratch & Swirl Eraser
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Drag the slider below to inspect our 3-stage rotary optical correction eliminating 99% of swirl marks and scratches.
        </p>
      </div>

      <div class="atelier-card rounded-3xl p-4 md:p-6 border border-white/10 max-w-4xl mx-auto">
        <div id="scratch-box" class="scratch-container h-80 sm:h-96 w-full rounded-2xl relative cursor-ew-resize">
          
          <!-- After (Deep Mirror Gloss) -->
          <div class="absolute inset-0 bg-[#0A0D14] flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-amber-950/20 to-black"></div>
            <div class="text-center z-10 p-6">
              <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono-clean font-bold mb-3 border border-emerald-500/30">
                100% Optical Reflection (Graphene 10H)
              </span>
              <div class="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-wider">
                DEEP CONCOURS MIRROR FINISH
              </div>
              <p class="text-xs text-slate-300 font-mono-clean mt-2 max-w-md mx-auto">
                Hydrophobic water contact angle >115°. 0 swirl marks under 1000W inspection lamps.
              </p>
            </div>
          </div>

          <!-- Before (Swirl Marks) -->
          <div id="scratch-before" class="absolute inset-y-0 left-0 bg-[#16181F] flex items-center justify-center overflow-hidden w-1/2 border-r border-amber-400">
            <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div class="text-center z-10 p-6 w-full min-w-[320px]">
              <span class="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono-clean font-bold mb-3 border border-rose-500/30">
                Before: Swirl Marks & Clearcoat Scratches
              </span>
              <div class="text-2xl sm:text-3xl font-black text-slate-300 font-serif-luxury tracking-wider">
                HAZED CLEARCOAT OXIDATION
              </div>
              <p class="text-xs text-slate-400 font-mono-clean mt-2 max-w-md mx-auto">
                Swirl marks caused by desert dust and improper car wash brushes.
              </p>
            </div>
          </div>

          <!-- Slider Divider & Handle -->
          <div id="scratch-divider" class="scratch-divider left-1/2">
            <div class="scratch-handle">
              <i class="fas fa-arrows-left-right"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs font-mono-clean text-slate-400 pt-4 px-2">
          <span>◀ Drag Left: Inspect Swirl Marks</span>
          <span>Drag Right: Inspect Mirror Gloss ▶</span>
        </div>
      </div>

    </div>
  </section>

  <!-- 3 TRANSPARENT SIGNATURE PACKAGES -->
  <section id="packages" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0A0D14]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="text-xs text-amber-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Transparent Pricing</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Signature Packages
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          No hidden fees. Every vehicle treated in a dedicated, climate-controlled, dust-free cleanroom bay.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        <!-- Package 1 -->
        <div class="atelier-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-amber-400/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Package 01</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">10H Graphene Ceramic</h3>
            <p class="text-slate-400 text-xs mb-6">Multi-layer nano-ceramic coating with 5-year hydrophobic shield and UV oxidation barrier.</p>
            
            <div class="text-3xl font-black text-amber-400 font-mono-clean mb-6">
              ${curr.symbol}2,800${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Full Vehicle</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 2-Stage Optical Paint Correction</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 2 Base Layers 10H Matrix Ceramic</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 1 Top Layer Graphene Hydrophobic Coat</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Infrared Heat Cured Bay Treatment</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 5-Year Certified Warranty Card</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20the%2010H%20Graphene%20Ceramic%20Package." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Book Ceramic Coating
          </a>
        </div>

        <!-- Package 2: Most Popular PPF -->
        <div class="atelier-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border-2 border-amber-400 relative shadow-2xl shadow-amber-400/10 bg-gradient-to-b from-amber-950/20 to-black">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider font-mono-clean shadow-md">
            MOST POPULAR • MAXIMUM DEFENSE
          </div>

          <div>
            <div class="text-xs text-amber-400 font-mono-clean uppercase mb-2">Package 02</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Full Vehicle 10-Mil PPF</h3>
            <p class="text-slate-300 text-xs mb-6">Complete vehicle wrap with XPEL Ultimate Plus TPU. Unrivaled stone chip defense.</p>
            
            <div class="text-3xl font-black text-white font-mono-clean mb-6">
              ${curr.symbol}11,500${curr.suffix}
              <span class="text-xs text-slate-400 font-normal">/ Full Vehicle</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-200 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 100% Full body panels encapsulated</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Seamless wrapped edges (Zero blade cuts)</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Instant self-healing scratches under sun</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> 10-Year anti-yellowing & bubbling warranty</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Complimentary 6-month ceramic top-up</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20the%20Full%20Vehicle%2010-Mil%20PPF%20Package." 
             target="_blank"
             class="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 font-mono-clean">
            <i class="fab fa-whatsapp text-sm"></i> Reserve PPF Cleanroom Bay
          </a>
        </div>

        <!-- Package 3: Interior Nanotech -->
        <div class="atelier-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-amber-400/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Package 03</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Interior Nanotech & Leather</h3>
            <p class="text-slate-400 text-xs mb-6">Deep steam sanitization and hydrophobic ceramic barrier for Napa leathers and Alcantara trims.</p>
            
            <div class="text-3xl font-black text-amber-400 font-mono-clean mb-6">
              ${curr.symbol}1,800${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Complete Cabin</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Anti-dye transfer barrier for white/cream leather</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Alcantara & carpet liquid repellant</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Ozone sterilization & bacteria elimination</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Matte OEM leather conditioner</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-amber-400"></i> Carbon fiber interior trim polish</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20book%20the%20Interior%20Nanotech%20Package." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Book Interior Detailing
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- ATELIER LOCATION & APPOINTMENTS -->
  <section id="atelier" class="py-16 px-4 md:px-8 border-b border-white/5 bg-[#08090C]">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <div class="text-xs text-amber-400 font-mono-clean uppercase font-bold tracking-wider mb-2">
          VISIT THE ATELIER
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white uppercase font-serif-luxury mb-3">
          ${prospect.business_name}
        </h2>
        <p class="text-slate-400 text-xs md:text-sm max-w-lg mb-4">
          ${address} • Cleanroom detailing bays with infrared curing technology.
        </p>
        <div class="text-xs text-slate-300 font-mono-clean flex items-center gap-4">
          <span><i class="fas fa-clock text-amber-400 mr-1.5"></i> Mon – Sat: 9 AM – 8 PM</span>
          <span><i class="fas fa-shield-alt text-emerald-400 mr-1.5"></i> Certified Bay Access</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20visit%20the%20studio." 
           target="_blank"
           class="bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-6 py-3.5 rounded-xl transition text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 font-mono-clean uppercase tracking-wider">
          <i class="fab fa-whatsapp text-sm"></i> WhatsApp Concierge
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="py-10 px-4 md:px-8 bg-[#050608] text-xs">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center text-black font-black text-[11px]">
          <i class="fas fa-crown"></i>
        </div>
        <div class="font-serif-luxury text-white tracking-wider uppercase font-bold text-xs">
          ${prospect.business_name} • ${city}
        </div>
      </div>

      <div class="text-slate-500 font-mono-clean text-[11px]">
        © 2026 ${prospect.business_name}. All rights reserved. ${city}.
      </div>

      <div class="text-slate-400 font-mono-clean text-[11px]">
        Engineered by <a href="https://wa.me/${agencyPhone}" target="_blank" class="text-amber-400 hover:underline">Antigravity Digital Studio</a>
      </div>
    </div>
  </footer>

  <!-- FLOATING QUICK WHATSAPP CTA -->
  <div class="fixed bottom-6 right-6 z-40">
    <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20book%20a%20detailing%20inspection." 
       target="_blank"
       class="w-13 h-13 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/40 transition hover:scale-110 relative">
      <i class="fab fa-whatsapp"></i>
      <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-black animate-ping"></span>
    </a>
  </div>

  <script>
    window.selectCar = function(name, ceramic, ppf, time, cat) {
      document.querySelectorAll('.v-tab').forEach(b => {
        b.classList.remove('active', 'gold-border-active');
        b.classList.add('border-white/10');
      });
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active', 'gold-border-active');
        event.currentTarget.classList.remove('border-white/10');
      }
      document.getElementById('v-name').innerText = name;
      document.getElementById('v-cat').innerText = cat;
      document.getElementById('v-price-ceramic').innerText = ceramic;
      document.getElementById('v-price-ppf').innerText = ppf;
      document.getElementById('v-price-time').innerText = time;
      const btn = document.getElementById('v-book-btn');
      if (btn) {
        const msg = "Hi ${prospect.business_name}, I drive a " + name + ". I want to book a VIP inspection for Full PPF & Ceramic.";
        btn.href = "https://wa.me/${waNumber}?text=" + encodeURIComponent(msg);
      }
    };

    window.setCarVariant = function(variant) {
      const mv = document.getElementById('hero-car-viewer');
      if (mv && mv.availableVariants && mv.availableVariants.includes(variant)) {
        mv.variantName = variant;
      }
    };

    window.setCarGold = function() {
      const mv = document.getElementById('hero-car-viewer');
      if (!mv || !mv.model) return;
      mv.model.materials.forEach(m => {
        if (m.name && m.name.toLowerCase().includes('paint')) {
          m.pbrMetallicRoughness.setBaseColorFactor([0.83, 0.68, 0.21, 1.0]);
          m.pbrMetallicRoughness.setRoughnessFactor(0.12);
          m.pbrMetallicRoughness.setMetallicFactor(0.9);
        }
      });
    };

    function initSlider() {
      const box = document.getElementById('scratch-box');
      const divider = document.getElementById('scratch-divider');
      const before = document.getElementById('scratch-before');
      if (!box || !divider || !before) return;
      let isDown = false;
      function setPos(clientX) {
        const r = box.getBoundingClientRect();
        let x = clientX - r.left;
        if (x < 0) x = 0;
        if (x > r.width) x = r.width;
        const p = (x / r.width) * 100;
        divider.style.left = p + '%';
        before.style.width = p + '%';
      }
      box.addEventListener('mousedown', (e) => { isDown = true; setPos(e.clientX); });
      window.addEventListener('mousemove', (e) => { if (isDown) setPos(e.clientX); });
      window.addEventListener('mouseup', () => { isDown = false; });
      box.addEventListener('touchstart', (e) => { isDown = true; setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', (e) => { if (isDown) setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { isDown = false; });
    }
    window.addEventListener('DOMContentLoaded', initSlider);
  </script>
</body>
</html>`;
}

// ============================================================================
// 2. ✨ LUXURY AESTHETIC CLINIC & MEDSPA TEMPLATE
// ============================================================================
function generateAestheticSite(prospect, agencyConfig) {
  const waNumber = cleanPhone(prospect.phone);
  const city = prospect.city || "Dubai";
  const address = prospect.address || `${prospect.business_name}, ${city}`;
  const curr = getCurrencyData(prospect, agencyConfig);
  const agencyPhone = (agencyConfig.sender_phone || '+923000000000').replace(/[^0-9]/g, '');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth bg-[#090A0F] text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${prospect.business_name} | Haute Aesthetics & Clinical Dermatology</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #090A0F; color: #F1F5F9; overflow-x: hidden; }
    .font-serif-luxury { font-family: 'Cinzel', Georgia, serif; }
    .font-mono-clean { font-family: 'Space Grotesk', monospace; }
    .rose-border { border: 1px solid rgba(224, 169, 109, 0.3); }
    .rose-border-active { border: 1.5px solid #E0A96D; box-shadow: 0 0 20px rgba(224, 169, 109, 0.25); }
    .clinic-card { background: rgba(18, 19, 29, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(14px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .clinic-card:hover { border-color: rgba(224, 169, 109, 0.4); transform: translateY(-2px); }
    .skin-container { position: relative; overflow: hidden; user-select: none; -webkit-user-select: none; }
    .skin-divider { position: absolute; top: 0; bottom: 0; width: 2.5px; background: #E0A96D; box-shadow: 0 0 14px rgba(224, 169, 109, 0.9); cursor: ew-resize; z-index: 20; }
    .skin-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: #E0A96D; color: #000; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 0 22px rgba(224, 169, 109, 0.9); }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #090A0F; }
    ::-webkit-scrollbar-thumb { background: #262938; border-radius: 3px; }
  </style>
</head>
<body class="selection:bg-[#E0A96D] selection:text-black antialiased">

  <!-- TOP 48H CLAIM BAR -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-[#07080D]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2 text-xs">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0A96D]/15 text-[#E0A96D] border border-[#E0A96D]/30 font-mono-clean">
          <span class="w-1.5 h-1.5 rounded-full bg-[#E0A96D] animate-ping"></span>
          BESPOKE CLINIC PROTOTYPE
        </span>
        <span class="text-slate-400 hidden sm:inline">Exclusively Prepared for <strong>${prospect.business_name} (${city})</strong></span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-slate-400 text-xs hidden md:inline">Connect to your official ${curr.tld} domain:</span>
        <a href="https://wa.me/${agencyPhone}?text=Hi%20${encodeURIComponent(agencyConfig.sender_name)}%2C%20I%20saw%20the%20aesthetic%20clinic%20website%20prototype%20for%20${encodeURIComponent(prospect.business_name)}.%20Let's%20activate%20it!" 
           target="_blank"
           class="bg-[#E0A96D] hover:bg-[#D4985B] text-black font-extrabold px-3 py-1 rounded-md transition shadow-md shadow-[#E0A96D]/20 flex items-center gap-1.5 text-xs font-mono-clean">
          <i class="fab fa-whatsapp"></i> Claim This Website (${curr.priceDefault})
        </a>
      </div>
    </div>
  </div>

  <!-- NAVIGATION -->
  <header class="fixed top-9 left-0 right-0 z-40 px-4 md:px-8 py-4 bg-[#090A0F]/85 backdrop-blur-md border-b border-white/[0.06]">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-[#E0A96D] flex items-center justify-center text-black font-black text-sm">
          <i class="fas fa-spa"></i>
        </div>
        <div>
          <div class="text-base font-extrabold tracking-widest uppercase font-serif-luxury text-white">
            ${prospect.business_name}
          </div>
          <div class="text-[10px] text-slate-400 tracking-widest uppercase font-mono-clean">${city} • Haute Aesthetics</div>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-8 text-xs text-slate-300 font-medium">
        <a href="#protocols" class="hover:text-[#E0A96D] transition">Clinical Protocols</a>
        <a href="#treatment-calc" class="hover:text-[#E0A96D] transition">VIP Treatment Selector</a>
        <a href="#skin-slider" class="hover:text-[#E0A96D] transition">Skin Radiance</a>
        <a href="#packages" class="hover:text-[#E0A96D] transition">Signature Packages</a>
        <a href="#clinic" class="hover:text-[#E0A96D] transition">The Clinic</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20inquire%20about%20a%20VIP%20consultation." 
           target="_blank"
           class="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2">
          <i class="fab fa-whatsapp text-emerald-400 text-sm"></i>
          <span>VIP WhatsApp</span>
        </a>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="pt-36 pb-20 px-4 md:px-8 relative border-b border-white/5">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-7">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0A96D]/10 border border-[#E0A96D]/30 text-[#E0A96D] text-xs font-mono-clean mb-6">
            <i class="fas fa-award"></i>
            <span>FDA & CE CERTIFIED AESTHETIC DERMATOLOGY • ${city.toUpperCase()}</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-black text-white leading-tight uppercase font-serif-luxury tracking-tight mb-6">
            The Science Of <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E0A96D] via-[#F3C892] to-amber-200">
              Ageless Skin
            </span><br>
            & Facial Harmony
          </h1>

          <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
            Bespoke regenerative aesthetics, medical-grade laser rejuvenation, and non-surgical facial sculpting in an ultra-private luxury clinical suite in ${city}.
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20reserve%20a%20private%20VIP%20consultation." 
               target="_blank"
               class="bg-[#E0A96D] hover:bg-[#D4985B] text-black font-extrabold px-7 py-3.5 rounded-xl transition shadow-lg shadow-[#E0A96D]/20 text-xs flex items-center gap-2 font-mono-clean uppercase tracking-wider">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Book VIP Consultation</span>
            </a>

            <a href="#treatment-calc" 
               class="clinic-card text-slate-200 hover:text-white px-6 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 font-mono-clean">
              <span>Explore Treatments</span>
              <i class="fas fa-arrow-down text-xs text-[#E0A96D]"></i>
            </a>
          </div>

          <div class="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/5 font-mono-clean">
            <div>
              <div class="text-2xl font-black text-white">0 Downtime</div>
              <div class="text-xs text-slate-400 mt-0.5">Rapid Protocols</div>
            </div>
            <div>
              <div class="text-2xl font-black text-[#E0A96D]">100%</div>
              <div class="text-xs text-slate-400 mt-0.5">Doctor Supervised</div>
            </div>
            <div>
              <div class="text-2xl font-black text-white">VIP Suite</div>
              <div class="text-xs text-slate-400 mt-0.5">Private Entrance</div>
            </div>
          </div>
        </div>

        <!-- HERO HIGHLIGHT PANEL -->
        <div class="lg:col-span-5 relative">
          <div class="clinic-card rounded-3xl p-6 border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#151724] to-[#0A0B10]">
            <div class="flex items-center justify-between pb-4 border-b border-white/5 text-[11px] font-mono-clean text-slate-400">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Doctor's Featured Protocol
              </span>
              <span class="text-[#E0A96D]">Red Carpet Standard</span>
            </div>

            <div class="py-6 space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-[#E0A96D]/15 text-[#E0A96D] flex items-center justify-center text-xl border border-[#E0A96D]/30">
                <i class="fas fa-wand-magic-sparkles"></i>
              </div>
              <h3 class="text-2xl font-black text-white font-serif-luxury">
                HydraFacial Syndeo™ & Collagen Infusion
              </h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                A 6-step vortex vacuum infusion extracting deep impurities while saturating the dermis with pure hyaluronic peptides, niacinamide, and red-light photorejuvenation.
              </p>
              
              <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-clean">
                <span class="text-slate-400">Duration: 45 Mins</span>
                <span class="text-[#E0A96D] font-bold">Immediate Glass Skin Glow</span>
              </div>
            </div>

            <div class="pt-2">
              <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20the%20HydraFacial%20Syndeo%20Protocol." 
                 target="_blank"
                 class="w-full py-3 rounded-xl bg-white/10 hover:bg-[#E0A96D] hover:text-black text-white text-xs font-bold font-mono-clean text-center transition flex items-center justify-center gap-2">
                <i class="fab fa-whatsapp"></i> Inquire Treatment Availability
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- INTERACTIVE TREATMENT SELECTOR -->
  <section id="treatment-calc" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0B0C14]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-[#E0A96D] font-mono-clean uppercase tracking-widest font-bold mb-2">Clinical Architecture</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Select Your Treatment
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Select a medical aesthetic protocol to inspect clinical details, recovery timeline, and immediate consultation booking.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <button onclick="selectTreatment('HydraFacial Deluxe', '${curr.symbol}850${curr.suffix}', '45 Mins', 'Zero Downtime', 'Deep Vortex Cleansing & Peptides')" 
                class="t-tab active clinic-card rose-border-active rounded-2xl p-4 text-center transition">
          <i class="fas fa-droplet text-xl text-[#E0A96D] mb-2"></i>
          <div class="text-xs font-bold text-white">HydraFacial Deluxe</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Glass Skin Glow</div>
        </button>

        <button onclick="selectTreatment('PicoSure® Laser Rejuvenation', '${curr.symbol}1,600${curr.suffix}', '60 Mins', '24 Hours Mild Pink', 'Pigment Removal & Pore Shrink')" 
                class="t-tab clinic-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-sun text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">PicoSure® Laser</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Porcelain Tone</div>
        </button>

        <button onclick="selectTreatment('Full Face Micro-Tox & Contour', '${curr.symbol}2,400${curr.suffix}', '30 Mins', 'Immediate Return', 'Natural Muscle Relaxation')" 
                class="t-tab clinic-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-gem text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Facial Micro-Tox</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Subtle Architecture</div>
        </button>

        <button onclick="selectTreatment('Profhilo® 5-Point Remodeling', '${curr.symbol}2,800${curr.suffix}', '30 Mins', 'Zero Downtime', '100% Pure Hyaluronic Matrix')" 
                class="t-tab clinic-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-water text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Profhilo® Remodeling</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Deep Hydration</div>
        </button>
      </div>

      <!-- Live Calculation Card -->
      <div class="clinic-card rounded-3xl p-6 md:p-8 border border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Protocol Selected</div>
            <div id="t-name" class="text-xl font-bold text-white font-serif-luxury mt-1">HydraFacial Deluxe</div>
            <div id="t-sub" class="text-xs text-[#E0A96D] font-mono-clean">Deep Vortex Cleansing & Peptides</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Session Investment</div>
            <div id="t-price" class="text-2xl font-black text-[#E0A96D] font-mono-clean mt-1">${curr.symbol}850${curr.suffix}</div>
            <div id="t-time" class="text-xs text-slate-400 font-mono-clean">45 Mins • Clinical Suite</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Recovery Time</div>
            <div id="t-recovery" class="text-2xl font-black text-white font-mono-clean mt-1">Zero Downtime</div>
            <div class="text-xs text-slate-400 font-mono-clean">Walk-out glowing</div>
          </div>

          <div>
            <a id="t-book-btn" 
               href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20reserve%20a%20VIP%20slot%20for%20HydraFacial%20Deluxe%20in%20${encodeURIComponent(city)}." 
               target="_blank"
               class="w-full py-4 rounded-xl bg-[#E0A96D] hover:bg-[#D4985B] text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-[#E0A96D]/20 font-mono-clean">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Book VIP Appointment</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- INTERACTIVE SKIN RADIANCE SLIDER -->
  <section id="skin-slider" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#090A0F]">
    <div class="max-w-6xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-[#E0A96D] font-mono-clean uppercase tracking-widest font-bold mb-2">Clinical Results</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Skin Radiance & Rejuvenation
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Drag the interactive slider to inspect our laser pigment removal and glass skin dermis transformation.
        </p>
      </div>

      <div class="clinic-card rounded-3xl p-4 md:p-6 border border-white/10 max-w-4xl mx-auto">
        <div id="skin-box" class="skin-container h-80 sm:h-96 w-full rounded-2xl relative cursor-ew-resize">
          
          <!-- After (Glass Skin Radiance) -->
          <div class="absolute inset-0 bg-[#0F101A] flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-[#E0A96D]/25 via-amber-950/20 to-black"></div>
            <div class="text-center z-10 p-6">
              <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono-clean font-bold mb-3 border border-emerald-500/30">
                Post-Protocol Session 3: Flawless Luminescence
              </span>
              <div class="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-wider">
                ULTRA-REFINED GLASS SKIN
              </div>
              <p class="text-xs text-slate-300 font-mono-clean mt-2 max-w-md mx-auto">
                Uniform porcelain tone, tightened pore architecture, and radiant hyaluronic bounce.
              </p>
            </div>
          </div>

          <!-- Before (Hyperpigmentation) -->
          <div id="skin-before" class="absolute inset-y-0 left-0 bg-[#1A1822] flex items-center justify-center overflow-hidden w-1/2 border-r border-[#E0A96D]">
            <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div class="text-center z-10 p-6 w-full min-w-[320px]">
              <span class="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono-clean font-bold mb-3 border border-rose-500/30">
                Initial Consultation: Uneven Tone & Hyperpigmentation
              </span>
              <div class="text-2xl sm:text-3xl font-black text-slate-300 font-serif-luxury tracking-wider">
                SUN DAMAGE & DULL TEXTURE
              </div>
              <p class="text-xs text-slate-400 font-mono-clean mt-2 max-w-md mx-auto">
                Melasma clusters, enlarged pore congestion, and loss of dermal elasticity.
              </p>
            </div>
          </div>

          <!-- Slider Divider & Handle -->
          <div id="skin-divider" class="skin-divider left-1/2">
            <div class="skin-handle">
              <i class="fas fa-arrows-left-right"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs font-mono-clean text-slate-400 pt-4 px-2">
          <span>◀ Drag Left: Inspect Initial State</span>
          <span>Drag Right: Inspect Radiant Transformation ▶</span>
        </div>
      </div>

    </div>
  </section>

  <!-- 3 SIGNATURE CLINICAL PACKAGES -->
  <section id="packages" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#0B0C14]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="text-xs text-[#E0A96D] font-mono-clean uppercase tracking-widest font-bold mb-2">Haute Treatment Plans</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Signature Clinical Packages
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Scientifically curated treatment journeys formulated by expert aesthetic dermatologists.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        <!-- Package 1 -->
        <div class="clinic-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-[#E0A96D]/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Protocol 01</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">The Red Carpet Radiance</h3>
            <p class="text-slate-400 text-xs mb-6">Complete dermal detox, lymphatic drainage, and intense oxygenation before events.</p>
            
            <div class="text-3xl font-black text-[#E0A96D] font-mono-clean mb-6">
              ${curr.symbol}850${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Session</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> HydraFacial Syndeo™ 6-Step Treatment</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Medical LED Phototherapy (Red & Blue)</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Cold Hammer Cryo-Pore Tightening</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Custom Antioxidant Peptide Infusion</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> 0 Downtime • Instant Glow Guarantee</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20The%20Red%20Carpet%20Radiance%20Protocol." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#E0A96D] hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Reserve Protocol
          </a>
        </div>

        <!-- Package 2: Most Popular -->
        <div class="clinic-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border-2 border-[#E0A96D] relative shadow-2xl shadow-[#E0A96D]/15 bg-gradient-to-b from-[#E0A96D]/10 to-black">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E0A96D] text-black font-extrabold text-[10px] uppercase tracking-wider font-mono-clean shadow-md">
            MOST REQUESTED • COMPREHENSIVE
          </div>

          <div>
            <div class="text-xs text-[#E0A96D] font-mono-clean uppercase mb-2">Protocol 02</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Total Collagen Sculpt</h3>
            <p class="text-slate-300 text-xs mb-6">Combination laser toning, subtle micro-tox facial relaxation, and deep cellular collagen remodeling.</p>
            
            <div class="text-3xl font-black text-white font-mono-clean mb-6">
              ${curr.symbol}2,400${curr.suffix}
              <span class="text-xs text-slate-400 font-normal">/ Full Face & Neck</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-200 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> PicoSure® Pro Full Facial Laser Toning</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Full Face Baby Botox Micro-Relaxation</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Collagen Bio-Stimulator Matrix Application</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Post-Treatment Soothing Dermal Recovery</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> 2-Week Doctor Follow-Up & Touch-Up</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20the%20Total%20Collagen%20Sculpt%20Package." 
             target="_blank"
             class="w-full py-4 rounded-xl bg-[#E0A96D] hover:bg-[#D4985B] text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-[#E0A96D]/25 font-mono-clean">
            <i class="fab fa-whatsapp text-sm"></i> Reserve Clinical Suite
          </a>
        </div>

        <!-- Package 3 -->
        <div class="clinic-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-[#E0A96D]/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Protocol 03</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Haute Facial Harmony</h3>
            <p class="text-slate-400 text-xs mb-6">Multi-vector facial harmonizing with high G-prime dermal contouring and Profhilo bio-remodeling.</p>
            
            <div class="text-3xl font-black text-[#E0A96D] font-mono-clean mb-6">
              ${curr.symbol}4,800${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Bespoke Journey</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> 3D Facial Vectoring & Golden Ratio Analysis</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Profhilo® 5-Point Full Face Hydration</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Jawline Definition & Cheek Architecture</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Medical Homecare Regimen Box Included</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-[#E0A96D]"></i> Dedicated VIP Concierge & Priority Access</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20inquire%20about%20Haute%20Facial%20Harmony." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#E0A96D] hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Inquire Consultation
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- CLINIC LOCATION -->
  <section id="clinic" class="py-16 px-4 md:px-8 border-b border-white/5 bg-[#090A0F]">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <div class="text-xs text-[#E0A96D] font-mono-clean uppercase font-bold tracking-wider mb-2">
          PRIVATE CLINICAL ATELIER
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white uppercase font-serif-luxury mb-3">
          ${prospect.business_name}
        </h2>
        <p class="text-slate-400 text-xs md:text-sm max-w-lg mb-4">
          ${address} • State-of-the-art medical suites designed for total client privacy and relaxation.
        </p>
        <div class="text-xs text-slate-300 font-mono-clean flex items-center gap-4">
          <span><i class="fas fa-clock text-[#E0A96D] mr-1.5"></i> Mon – Sat: 10 AM – 8 PM</span>
          <span><i class="fas fa-user-shield text-emerald-400 mr-1.5"></i> Discreet VIP Valet</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20book%20a%20private%20consultation." 
           target="_blank"
           class="bg-[#E0A96D] hover:bg-[#D4985B] text-black font-extrabold px-6 py-3.5 rounded-xl transition text-xs flex items-center gap-2 shadow-lg shadow-[#E0A96D]/20 font-mono-clean uppercase tracking-wider">
          <i class="fab fa-whatsapp text-sm"></i> WhatsApp VIP Concierge
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="py-10 px-4 md:px-8 bg-[#05060A] text-xs">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-md bg-[#E0A96D] flex items-center justify-center text-black font-black text-[11px]">
          <i class="fas fa-spa"></i>
        </div>
        <div class="font-serif-luxury text-white tracking-wider uppercase font-bold text-xs">
          ${prospect.business_name} • ${city}
        </div>
      </div>

      <div class="text-slate-500 font-mono-clean text-[11px]">
        © 2026 ${prospect.business_name}. All rights reserved. ${city}.
      </div>

      <div class="text-slate-400 font-mono-clean text-[11px]">
        Engineered by <a href="https://wa.me/${agencyPhone}" target="_blank" class="text-[#E0A96D] hover:underline">Antigravity Digital Studio</a>
      </div>
    </div>
  </footer>

  <!-- FLOATING QUICK WHATSAPP CTA -->
  <div class="fixed bottom-6 right-6 z-40">
    <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20book%20a%20VIP%20consultation." 
       target="_blank"
       class="w-13 h-13 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/40 transition hover:scale-110 relative">
      <i class="fab fa-whatsapp"></i>
      <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E0A96D] border-2 border-black animate-ping"></span>
    </a>
  </div>

  <script>
    window.selectTreatment = function(name, price, time, recovery, sub) {
      document.querySelectorAll('.t-tab').forEach(b => {
        b.classList.remove('active', 'rose-border-active');
        b.classList.add('border-white/10');
      });
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active', 'rose-border-active');
        event.currentTarget.classList.remove('border-white/10');
      }
      document.getElementById('t-name').innerText = name;
      document.getElementById('t-price').innerText = price;
      document.getElementById('t-time').innerText = time + " • Clinical Suite";
      document.getElementById('t-recovery').innerText = recovery;
      document.getElementById('t-sub').innerText = sub;
      const btn = document.getElementById('t-book-btn');
      if (btn) {
        const msg = "Hi ${prospect.business_name}, I want to book a VIP slot for " + name + " in ${city}.";
        btn.href = "https://wa.me/${waNumber}?text=" + encodeURIComponent(msg);
      }
    };

    function initSkinSlider() {
      const box = document.getElementById('skin-box');
      const divider = document.getElementById('skin-divider');
      const before = document.getElementById('skin-before');
      if (!box || !divider || !before) return;
      let isDown = false;
      function setPos(clientX) {
        const r = box.getBoundingClientRect();
        let x = clientX - r.left;
        if (x < 0) x = 0;
        if (x > r.width) x = r.width;
        const p = (x / r.width) * 100;
        divider.style.left = p + '%';
        before.style.width = p + '%';
      }
      box.addEventListener('mousedown', (e) => { isDown = true; setPos(e.clientX); });
      window.addEventListener('mousemove', (e) => { if (isDown) setPos(e.clientX); });
      window.addEventListener('mouseup', () => { isDown = false; });
      box.addEventListener('touchstart', (e) => { isDown = true; setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', (e) => { if (isDown) setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { isDown = false; });
    }
    window.addEventListener('DOMContentLoaded', initSkinSlider);
  </script>
</body>
</html>`;
}

// ============================================================================
// 3. 🦷 COSMETIC DENTISTRY & SMILE ATELIER TEMPLATE
// ============================================================================
function generateDentalSite(prospect, agencyConfig) {
  const waNumber = cleanPhone(prospect.phone);
  const city = prospect.city || "Dubai";
  const address = prospect.address || `${prospect.business_name}, ${city}`;
  const curr = getCurrencyData(prospect, agencyConfig);
  const agencyPhone = (agencyConfig.sender_phone || '+923000000000').replace(/[^0-9]/g, '');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth bg-[#060810] text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${prospect.business_name} | Cosmetic Dentistry & Smile Architecture</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #060810; color: #F1F5F9; overflow-x: hidden; }
    .font-serif-luxury { font-family: 'Cinzel', Georgia, serif; }
    .font-mono-clean { font-family: 'Space Grotesk', monospace; }
    .diamond-border { border: 1px solid rgba(56, 189, 248, 0.3); }
    .diamond-border-active { border: 1.5px solid #38BDF8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.25); }
    .dental-card { background: rgba(12, 17, 30, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(14px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .dental-card:hover { border-color: rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
    .smile-container { position: relative; overflow: hidden; user-select: none; -webkit-user-select: none; }
    .smile-divider { position: absolute; top: 0; bottom: 0; width: 2.5px; background: #38BDF8; box-shadow: 0 0 14px rgba(56, 189, 248, 0.9); cursor: ew-resize; z-index: 20; }
    .smile-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: #38BDF8; color: #000; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 0 22px rgba(56, 189, 248, 0.9); }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060810; }
    ::-webkit-scrollbar-thumb { background: #1C243B; border-radius: 3px; }
  </style>
</head>
<body class="selection:bg-cyan-400 selection:text-black antialiased">

  <!-- TOP 48H CLAIM BAR -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-[#05060C]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2 text-xs">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 font-mono-clean">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          BESPOKE DENTAL PROTOTYPE
        </span>
        <span class="text-slate-400 hidden sm:inline">Exclusively Prepared for <strong>${prospect.business_name} (${city})</strong></span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-slate-400 text-xs hidden md:inline">Connect to your official ${curr.tld} domain:</span>
        <a href="https://wa.me/${agencyPhone}?text=Hi%20${encodeURIComponent(agencyConfig.sender_name)}%2C%20I%20saw%20the%20dental%20studio%20website%20prototype%20for%20${encodeURIComponent(prospect.business_name)}.%20Let's%20activate%20it!" 
           target="_blank"
           class="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-3 py-1 rounded-md transition shadow-md shadow-cyan-400/20 flex items-center gap-1.5 text-xs font-mono-clean">
          <i class="fab fa-whatsapp"></i> Claim This Website (${curr.priceDefault})
        </a>
      </div>
    </div>
  </div>

  <!-- NAVIGATION -->
  <header class="fixed top-9 left-0 right-0 z-40 px-4 md:px-8 py-4 bg-[#060810]/85 backdrop-blur-md border-b border-white/[0.06]">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-cyan-400 flex items-center justify-center text-black font-black text-sm">
          <i class="fas fa-teeth-open"></i>
        </div>
        <div>
          <div class="text-base font-extrabold tracking-widest uppercase font-serif-luxury text-white">
            ${prospect.business_name}
          </div>
          <div class="text-[10px] text-slate-400 tracking-widest uppercase font-mono-clean">${city} • Smile Atelier</div>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-8 text-xs text-slate-300 font-medium">
        <a href="#services" class="hover:text-cyan-400 transition">Services</a>
        <a href="#smile-calc" class="hover:text-cyan-400 transition">Smile Assessment</a>
        <a href="#smile-slider" class="hover:text-cyan-400 transition">Smile Transformation</a>
        <a href="#packages" class="hover:text-cyan-400 transition">Smile Packages</a>
        <a href="#studio" class="hover:text-cyan-400 transition">The Studio</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20inquire%20about%20a%20Cosmetic%20Smile%20Assessment." 
           target="_blank"
           class="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2">
          <i class="fab fa-whatsapp text-emerald-400 text-sm"></i>
          <span>VIP WhatsApp</span>
        </a>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="pt-36 pb-20 px-4 md:px-8 relative border-b border-white/5">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-7">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono-clean mb-6">
            <i class="fas fa-certificate"></i>
            <span>DIGITAL SMILE DESIGN (DSD) CERTIFIED STUDIO • ${city.toUpperCase()}</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-black text-white leading-tight uppercase font-serif-luxury tracking-tight mb-6">
            Architects Of <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
              The Iconic
            </span><br>
            Hollywood Smile
          </h1>

          <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal">
            Bespoke ultra-thin porcelain veneers, Invisalign clear orthodontics, and laser enamel restoration designed to elevate facial symmetry in ${city}.
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20would%20like%20to%20book%20a%20Smile%20Assessment%20consultation." 
               target="_blank"
               class="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-7 py-3.5 rounded-xl transition shadow-lg shadow-cyan-400/20 text-xs flex items-center gap-2 font-mono-clean uppercase tracking-wider">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Book Smile Assessment</span>
            </a>

            <a href="#smile-calc" 
               class="dental-card text-slate-200 hover:text-white px-6 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 font-mono-clean">
              <span>Explore Veneers & Invisalign</span>
              <i class="fas fa-arrow-down text-xs text-cyan-400"></i>
            </a>
          </div>

          <div class="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/5 font-mono-clean">
            <div>
              <div class="text-2xl font-black text-white">0.3 mm</div>
              <div class="text-xs text-slate-400 mt-0.5">Minimal-Prep Veneers</div>
            </div>
            <div>
              <div class="text-2xl font-black text-cyan-400">3D DSD</div>
              <div class="text-xs text-slate-400 mt-0.5">Digital Mockup Previews</div>
            </div>
            <div>
              <div class="text-2xl font-black text-white">100%</div>
              <div class="text-xs text-slate-400 mt-0.5">Swiss Porcelain</div>
            </div>
          </div>
        </div>

        <!-- HERO HIGHLIGHT PANEL -->
        <div class="lg:col-span-5 relative">
          <div class="dental-card rounded-3xl p-6 border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#0F182A] to-[#070B14]">
            <div class="flex items-center justify-between pb-4 border-b border-white/5 text-[11px] font-mono-clean text-slate-400">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Lead Cosmetic Dental Surgeon
              </span>
              <span class="text-cyan-400">Master Ceramist Lab</span>
            </div>

            <div class="py-6 space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center text-xl border border-cyan-400/30">
                <i class="fas fa-teeth"></i>
              </div>
              <h3 class="text-2xl font-black text-white font-serif-luxury">
                Handcrafted Emax® Porcelain Veneers
              </h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Individually sculpted porcelain veneers mimicking natural optical translucency, micro-texture, and enamel luminescence. Minimal tooth preparation preserving natural tooth structure.
              </p>
              
              <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-clean">
                <span class="text-slate-400">Turnaround: 5 Days</span>
                <span class="text-cyan-400 font-bold">15-Year Clinical Guarantee</span>
              </div>
            </div>

            <div class="pt-2">
              <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20Handcrafted%20Porcelain%20Veneers." 
                 target="_blank"
                 class="w-full py-3 rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-black text-white text-xs font-bold font-mono-clean text-center transition flex items-center justify-center gap-2">
                <i class="fab fa-whatsapp"></i> Inquire Veneers Availability
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- INTERACTIVE SMILE ASSESSMENT ENGINE -->
  <section id="smile-calc" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#080C18]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-cyan-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Bespoke Options</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Select Your Aesthetic Solution
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Select an aesthetic dental treatment to calculate treatment timeline, pricing breakdown, and instant WhatsApp booking.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <button onclick="selectDental('Handcrafted Emax Veneers', '${curr.symbol}1,800${curr.suffix}', 'Per Tooth', '5 Days Turnaround', 'Ultra-Thin Porcelain Luminescence')" 
                class="d-tab active dental-card diamond-border-active rounded-2xl p-4 text-center transition">
          <i class="fas fa-gem text-xl text-cyan-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Emax® Veneers</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Hollywood Smile</div>
        </button>

        <button onclick="selectDental('Invisalign® Clear Aligners', '${curr.symbol}9,800${curr.suffix}', 'Full Alignment', '4 - 8 Months', 'Virtually Invisible Orthodontics')" 
                class="d-tab dental-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-arrows-split-up-and-left text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Invisalign® Aligners</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Discrete Alignment</div>
        </button>

        <button onclick="selectDental('Philips Zoom! Laser Whitening', '${curr.symbol}950${curr.suffix}', 'Full Arch', '45 Mins In-Chair', 'Up to 8 Shades Whiter')" 
                class="d-tab dental-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-bolt text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Zoom! Whitening</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Enamel Brightening</div>
        </button>

        <button onclick="selectDental('Full Smile Arch Makeover', '${curr.symbol}18,000${curr.suffix}', '10 Veneers', '7 Days Total', 'Complete Smile Transformation')" 
                class="d-tab dental-card border-white/10 rounded-2xl p-4 text-center transition">
          <i class="fas fa-crown text-xl text-slate-400 mb-2"></i>
          <div class="text-xs font-bold text-white">Full Arch Makeover</div>
          <div class="text-[10px] text-slate-400 font-mono-clean">Total Redesign</div>
        </button>
      </div>

      <!-- Live Calculation Card -->
      <div class="dental-card rounded-3xl p-6 md:p-8 border border-white/10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Treatment Selected</div>
            <div id="d-name" class="text-xl font-bold text-white font-serif-luxury mt-1">Handcrafted Emax Veneers</div>
            <div id="d-sub" class="text-xs text-cyan-400 font-mono-clean">Ultra-Thin Porcelain Luminescence</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Investment</div>
            <div id="d-price" class="text-2xl font-black text-cyan-400 font-mono-clean mt-1">${curr.symbol}1,800${curr.suffix}</div>
            <div id="d-unit" class="text-xs text-slate-400 font-mono-clean">Per Tooth • Master Lab Sculpted</div>
          </div>

          <div>
            <div class="text-[11px] text-slate-400 font-mono-clean uppercase">Estimated Timeline</div>
            <div id="d-timeline" class="text-2xl font-black text-white font-mono-clean mt-1">5 Days</div>
            <div class="text-xs text-slate-400 font-mono-clean">Digital 3D Simulation Included</div>
          </div>

          <div>
            <a id="d-book-btn" 
               href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20book%20a%20Smile%20Assessment%20for%20Handcrafted%20Emax%20Veneers." 
               target="_blank"
               class="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 font-mono-clean">
              <i class="fab fa-whatsapp text-sm"></i>
              <span>Book Smile Assessment</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- INTERACTIVE BEFORE/AFTER SMILE SLIDER -->
  <section id="smile-slider" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#060810]">
    <div class="max-w-6xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <div class="text-xs text-cyan-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Clinical Results</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Smile Architecture Transformation
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          Drag the interactive slider to inspect a handcrafted 10-unit porcelain veneer transformation correcting discolored and chipped enamel.
        </p>
      </div>

      <div class="dental-card rounded-3xl p-4 md:p-6 border border-white/10 max-w-4xl mx-auto">
        <div id="smile-box" class="smile-container h-80 sm:h-96 w-full rounded-2xl relative cursor-ew-resize">
          
          <!-- After (Hollywood Smile) -->
          <div class="absolute inset-0 bg-[#0B1224] flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-cyan-950/20 to-black"></div>
            <div class="text-center z-10 p-6">
              <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono-clean font-bold mb-3 border border-emerald-500/30">
                Post-Treatment: 10-Unit Emax® Porcelain Veneers
              </span>
              <div class="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-wider">
                FLAWLESS HOLLYWOOD SMILE
              </div>
              <p class="text-xs text-slate-300 font-mono-clean mt-2 max-w-md mx-auto">
                Perfect incisal symmetry, high-translucency shade OM1, and anatomical gum scalloping.
              </p>
            </div>
          </div>

          <!-- Before (Stained / Misaligned) -->
          <div id="smile-before" class="absolute inset-y-0 left-0 bg-[#161B2E] flex items-center justify-center overflow-hidden w-1/2 border-r border-cyan-400">
            <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div class="text-center z-10 p-6 w-full min-w-[320px]">
              <span class="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono-clean font-bold mb-3 border border-rose-500/30">
                Initial Examination: Severe Staining & Enamel Wear
              </span>
              <div class="text-2xl sm:text-3xl font-black text-slate-300 font-serif-luxury tracking-wider">
                CHIPPED EDGES & DISCOLORATION
              </div>
              <p class="text-xs text-slate-400 font-mono-clean mt-2 max-w-md mx-auto">
                Tetracycline staining, irregular midline, and uneven incisal wear.
              </p>
            </div>
          </div>

          <!-- Slider Divider & Handle -->
          <div id="smile-divider" class="smile-divider left-1/2">
            <div class="smile-handle">
              <i class="fas fa-arrows-left-right"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs font-mono-clean text-slate-400 pt-4 px-2">
          <span>◀ Drag Left: Inspect Initial State</span>
          <span>Drag Right: Inspect Porcelain Perfection ▶</span>
        </div>
      </div>

    </div>
  </section>

  <!-- 3 SIGNATURE SMILE PACKAGES -->
  <section id="packages" class="py-20 px-4 md:px-8 border-b border-white/5 bg-[#080C18]">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="text-xs text-cyan-400 font-mono-clean uppercase tracking-widest font-bold mb-2">Transparent Treatment Tiers</div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
          Signature Smile Packages
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-3">
          All procedures include digital 3D scans and personalized smile mockups before beginning.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        <!-- Package 1 -->
        <div class="dental-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-cyan-400/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Tier 01</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Zoom! Laser Brightening</h3>
            <p class="text-slate-400 text-xs mb-6">Philips Zoom in-chair cold laser activation with customized take-home enamel top-up kits.</p>
            
            <div class="text-3xl font-black text-cyan-400 font-mono-clean mb-6">
              ${curr.symbol}950${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Full Session</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Full Ultrasonic Airflow Polish</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> 4x 15-Minute Zoom LED Light Cycles</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Anti-Sensitivity Enamel Sealant</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Custom Molded Bleaching Trays</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Guaranteed 6 - 8 Shades Whiter</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20Zoom%20Laser%20Brightening." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Book Whitening
          </a>
        </div>

        <!-- Package 2: Most Popular Veneers -->
        <div class="dental-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border-2 border-cyan-400 relative shadow-2xl shadow-cyan-400/15 bg-gradient-to-b from-cyan-950/20 to-black">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-400 text-black font-extrabold text-[10px] uppercase tracking-wider font-mono-clean shadow-md">
            FLAGSHIP • HOLLYWOOD SMILE
          </div>

          <div>
            <div class="text-xs text-cyan-400 font-mono-clean uppercase mb-2">Tier 02</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">10-Unit Haute Veneer Makeover</h3>
            <p class="text-slate-300 text-xs mb-6">Complete upper cosmetic arch restoration with ultra-thin Emax porcelain veneers.</p>
            
            <div class="text-3xl font-black text-white font-mono-clean mb-6">
              ${curr.symbol}18,000${curr.suffix}
              <span class="text-xs text-slate-400 font-normal">/ Full Upper Arch</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-200 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> 10 Handcrafted Emax® Porcelain Units</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Digital Smile Design 3D Simulation</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Temporary Trial Smile Mockup</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Micro-Laser Cosmetic Gum Contouring</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> 15-Year Clinical Guarantee Card</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20the%2010-Unit%20Haute%20Veneer%20Makeover." 
             target="_blank"
             class="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/25 font-mono-clean">
            <i class="fab fa-whatsapp text-sm"></i> Reserve Dental Suite
          </a>
        </div>

        <!-- Package 3: Invisalign -->
        <div class="dental-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-cyan-400/30 transition">
          <div>
            <div class="text-xs text-slate-400 font-mono-clean uppercase mb-2">Tier 03</div>
            <h3 class="text-xl font-bold text-white mb-2 font-serif-luxury">Invisalign® Diamond Alignment</h3>
            <p class="text-slate-400 text-xs mb-6">Complete clear aligner orthodontics with iTero 5D digital progress tracking.</p>
            
            <div class="text-3xl font-black text-cyan-400 font-mono-clean mb-6">
              ${curr.symbol}9,800${curr.suffix}
              <span class="text-xs text-slate-500 font-normal">/ Full Treatment</span>
            </div>

            <ul class="space-y-3 text-xs text-slate-300 font-mono-clean mb-8">
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> iTero 5D Element Intraoral Scanning</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Unlimited SmartTrack Clear Aligners</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Remote Dental Monitoring App Access</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Final Vivera Retainers (3 Sets Included)</li>
              <li class="flex items-center gap-2"><i class="fas fa-check text-cyan-400"></i> Complimentary Post-Alignment Whitening</li>
            </ul>
          </div>

          <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20am%20interested%20in%20Invisalign%20Clear%20Alignment." 
             target="_blank"
             class="w-full py-3.5 rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-black text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 font-mono-clean">
            <i class="fab fa-whatsapp"></i> Inquire Invisalign
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- DENTAL STUDIO LOCATION -->
  <section id="studio" class="py-16 px-4 md:px-8 border-b border-white/5 bg-[#060810]">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <div class="text-xs text-cyan-400 font-mono-clean uppercase font-bold tracking-wider mb-2">
          VISIT THE SMILE ATELIER
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white uppercase font-serif-luxury mb-3">
          ${prospect.business_name}
        </h2>
        <p class="text-slate-400 text-xs md:text-sm max-w-lg mb-4">
          ${address} • Equipped with low-radiation 3D CBCT imaging and on-site master ceramic lab.
        </p>
        <div class="text-xs text-slate-300 font-mono-clean flex items-center gap-4">
          <span><i class="fas fa-clock text-cyan-400 mr-1.5"></i> Mon – Sat: 9 AM – 7 PM</span>
          <span><i class="fas fa-shield-halved text-emerald-400 mr-1.5"></i> Private Dental Suites</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20visit%20the%20studio%20for%20a%20consultation." 
           target="_blank"
           class="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-6 py-3.5 rounded-xl transition text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/20 font-mono-clean uppercase tracking-wider">
          <i class="fab fa-whatsapp text-sm"></i> WhatsApp Concierge
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="py-10 px-4 md:px-8 bg-[#04050A] text-xs">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-md bg-cyan-400 flex items-center justify-center text-black font-black text-[11px]">
          <i class="fas fa-teeth-open"></i>
        </div>
        <div class="font-serif-luxury text-white tracking-wider uppercase font-bold text-xs">
          ${prospect.business_name} • ${city}
        </div>
      </div>

      <div class="text-slate-500 font-mono-clean text-[11px]">
        © 2026 ${prospect.business_name}. All rights reserved. ${city}.
      </div>

      <div class="text-slate-400 font-mono-clean text-[11px]">
        Engineered by <a href="https://wa.me/${agencyPhone}" target="_blank" class="text-cyan-400 hover:underline">Antigravity Digital Studio</a>
      </div>
    </div>
  </footer>

  <!-- FLOATING QUICK WHATSAPP CTA -->
  <div class="fixed bottom-6 right-6 z-40">
    <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(prospect.business_name)}%2C%20I%20want%20to%20book%20a%20Smile%20Assessment." 
       target="_blank"
       class="w-13 h-13 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/40 transition hover:scale-110 relative">
      <i class="fab fa-whatsapp"></i>
      <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black animate-ping"></span>
    </a>
  </div>

  <script>
    window.selectDental = function(name, price, unit, timeline, sub) {
      document.querySelectorAll('.d-tab').forEach(b => {
        b.classList.remove('active', 'diamond-border-active');
        b.classList.add('border-white/10');
      });
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active', 'diamond-border-active');
        event.currentTarget.classList.remove('border-white/10');
      }
      document.getElementById('d-name').innerText = name;
      document.getElementById('d-price').innerText = price;
      document.getElementById('d-unit').innerText = unit + " • Master Lab Sculpted";
      document.getElementById('d-timeline').innerText = timeline;
      document.getElementById('d-sub').innerText = sub;
      const btn = document.getElementById('d-book-btn');
      if (btn) {
        const msg = "Hi ${prospect.business_name}, I want to book a Smile Assessment for " + name + " in ${city}.";
        btn.href = "https://wa.me/${waNumber}?text=" + encodeURIComponent(msg);
      }
    };

    function initSmileSlider() {
      const box = document.getElementById('smile-box');
      const divider = document.getElementById('smile-divider');
      const before = document.getElementById('smile-before');
      if (!box || !divider || !before) return;
      let isDown = false;
      function setPos(clientX) {
        const r = box.getBoundingClientRect();
        let x = clientX - r.left;
        if (x < 0) x = 0;
        if (x > r.width) x = r.width;
        const p = (x / r.width) * 100;
        divider.style.left = p + '%';
        before.style.width = p + '%';
      }
      box.addEventListener('mousedown', (e) => { isDown = true; setPos(e.clientX); });
      window.addEventListener('mousemove', (e) => { if (isDown) setPos(e.clientX); });
      window.addEventListener('mouseup', () => { isDown = false; });
      box.addEventListener('touchstart', (e) => { isDown = true; setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', (e) => { if (isDown) setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { isDown = false; });
    }
    window.addEventListener('DOMContentLoaded', initSmileSlider);
  </script>
</body>
</html>`;
}

module.exports = {
  generateSiteHTML,
  detectNiche
};
