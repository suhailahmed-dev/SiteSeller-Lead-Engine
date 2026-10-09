const nodemailer = require('nodemailer');

function getCleanWANumber(phone, city, country) {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  const loc = `${city || ''} ${country || ''}`.toLowerCase();

  // Strip accidental trunk zeros after country codes (e.g. 97105X -> 9715X, 6104X -> 614X, 9203X -> 923X)
  if (clean.startsWith('9710')) {
    clean = '971' + clean.slice(4);
  } else if (clean.startsWith('610')) {
    clean = '61' + clean.slice(3);
  } else if (clean.startsWith('920')) {
    clean = '92' + clean.slice(3);
  } else if (clean.startsWith('440')) {
    clean = '44' + clean.slice(3);
  }

  // If already starts with international country code
  if (clean.startsWith('971') && clean.length >= 12) {
    return clean;
  }
  if (clean.startsWith('61') && clean.length >= 11) {
    return clean;
  }
  if (clean.startsWith('92') && clean.length >= 12) {
    return clean;
  }
  if (clean.startsWith('1') && clean.length === 11) {
    return clean;
  }

  // Australian local mobile: 04XX XXX XXX -> 614XXXXXXXX
  if (clean.startsWith('04') || loc.includes('aust') || loc.includes('sydney') || loc.includes('melbourne') || loc.includes('brisbane')) {
    if (clean.startsWith('0')) return '61' + clean.slice(1);
    if (clean.startsWith('4')) return '61' + clean;
    return '61' + clean;
  }

  // UAE local mobile: 05X XXX XXXX -> 9715XXXXXXXX
  if (clean.startsWith('05') || loc.includes('dubai') || loc.includes('uae')) {
    if (clean.startsWith('0')) return '971' + clean.slice(1);
    if (clean.startsWith('5')) return '971' + clean;
    return '971' + clean;
  }

  // US local: 10 digits -> 1XXXXXXXXXX
  if (loc.includes('usa') || loc.includes('united states') || loc.includes('miami') || loc.includes('angeles') || loc.includes('dallas') || loc.includes('york')) {
    if (clean.length === 10) return '1' + clean;
    return clean;
  }

  // Pakistan local: 03XX XXXXXXX -> 923XXXXXXXXX
  if (clean.startsWith('03')) {
    return '92' + clean.slice(1);
  }
  if (clean.startsWith('3') && clean.length === 10) {
    return '92' + clean;
  }
  if (clean.startsWith('0')) {
    return '92' + clean.slice(1);
  }

  return clean;
}


function detectMarket(prospect) {
  const loc = `${prospect.city || ''} ${prospect.country || ''} ${prospect.address || ''}`.toLowerCase();
  const phone = (prospect.phone || '').replace(/[^0-9]/g, '');

  if (loc.includes('aust') || loc.includes('sydney') || loc.includes('melbourne') || loc.includes('brisbane') || phone.startsWith('61')) {
    return 'AUSTRALIA';
  }
  if (loc.includes('usa') || loc.includes('united states') || loc.includes('miami') || loc.includes('angeles') || loc.includes('dallas') || loc.includes('york') || (phone.startsWith('1') && phone.length === 11)) {
    return 'USA';
  }
  if (loc.includes('dubai') || loc.includes('uae') || phone.startsWith('971')) {
    return 'DUBAI';
  }
  return 'PAKISTAN';
}

function detectNiche(prospect) {
  const text = `${prospect.category || ''} ${prospect.business_name || ''}`.toLowerCase();
  if (/dent|smile|teeth|ortho/i.test(text)) return 'dental';
  if (/clinic|salon|spa|aesthetic|skin|beauty|dermatology|medspa|laser|facial/i.test(text)) return 'aesthetic';
  if (/solar|energy|renewable/i.test(text)) return 'solar';
  return 'auto';
}

function getNichePitchBullets(niche) {
  if (niche === 'aesthetic') {
    return {
      portalType: 'Haute Aesthetics & Clinical Consultation Portal',
      bullets: [
        '• Interactive Skin Radiance & Rejuvenation Slider',
        '• VIP Clinical Treatment Selector (HydraFacial, Laser, Tox)',
        '• 1-Click WhatsApp VIP Consultation Engine'
      ],
      nicheLabel: 'aesthetic dermatology & clinic'
    };
  }
  if (niche === 'dental') {
    return {
      portalType: 'Digital Smile Atelier & Patient Consultation Portal',
      bullets: [
        '• Interactive Hollywood Smile Transformation Slider',
        '• Cosmetic Treatment Selector (Porcelain Veneers, Invisalign)',
        '• 1-Click WhatsApp Smile Assessment Engine'
      ],
      nicheLabel: 'cosmetic dentistry'
    };
  }
  return {
    portalType: 'Interactive Virtual Showroom & Studio Website',
    bullets: [
      '• Interactive Vehicle Selector (Porsche, G-Wagon, Ferrari, Lambo)',
      '• Interactive Scratch & Swirl Eraser Slider',
      '• 1-Click VIP WhatsApp Booking Engine'
    ],
    nicheLabel: 'luxury detailing & PPF'
  };
}

function createWhatsAppPitch(prospect, demoUrl, agencyConfig) {
  const waNumber = getCleanWANumber(prospect.phone, prospect.city, prospect.country);
  const market = detectMarket(prospect);
  const niche = detectNiche(prospect);
  const nicheInfo = getNichePitchBullets(niche);

  let message = '';
  if (market === 'DUBAI') {
    const price = agencyConfig.price_offer && agencyConfig.price_offer.includes('AED') ? agencyConfig.price_offer : '500 AED';
    message = `Hi Team *${prospect.business_name}*! 👋\n\nI'm *${agencyConfig.sender_name}* from *${agencyConfig.agency_name}*.\n\nI noticed your top-rated reputation in ${prospect.city || 'Dubai'} ⭐. Instead of sending a generic proposal, our digital studio built a bespoke *${nicheInfo.portalType}* specifically for ${prospect.business_name}:\n\n👉 *View Your Live Demo:* ${demoUrl}\n\n${nicheInfo.bullets.join('\n')}\n\nTake 30 seconds to open it on your phone. If you like the direction, we can connect it directly to your official .ae or .com domain for just *${price}*.\n\nWhat do you think?`;
  } 
  else if (market === 'USA') {
    const price = agencyConfig.price_offer && agencyConfig.price_offer.includes('$') ? agencyConfig.price_offer : '$249';
    message = `Hi Team *${prospect.business_name}*! 👋\n\nI'm *${agencyConfig.sender_name}* from *${agencyConfig.agency_name}*.\n\nI came across your stellar 5-star reputation in ${prospect.city} ⭐, but noticed your business listing doesn't have a modern, high-converting website connected for direct customer bookings.\n\nInstead of pitching, our studio built a custom interactive website demo for ${prospect.business_name}:\n\n👉 *Live Interactive Demo:* ${demoUrl}\n\nFeatures loaded in your demo:\n${nicheInfo.bullets.join('\n')}\n\nIf you love the demo, we can deploy it directly onto your official .com domain for a one-time setup of *${price}*.\n\nWould you like me to walk you through it?`;
  } 
  else if (market === 'AUSTRALIA') {
    const price = agencyConfig.price_offer && agencyConfig.price_offer.includes('AUD') ? agencyConfig.price_offer : '$299 AUD';
    message = `G'day Team *${prospect.business_name}*! 👋\n\nI'm *${agencyConfig.sender_name}* from *${agencyConfig.agency_name}*.\n\nI was looking up top-rated ${nicheInfo.nicheLabel} studios in ${prospect.city} ⭐ and saw your outstanding reviews.\n\nRather than sending a cold brochure, our digital studio put together a custom interactive demo website for ${prospect.business_name}:\n\n👉 *Take a look here:* ${demoUrl}\n\n${nicheInfo.bullets.join('\n')}\n\nIf you'd like to take it live on your official .com.au domain, we can set up the whole package for just *${price}*.\n\nCheers and let me know your thoughts!`;
  } 
  else {
    const price = agencyConfig.price_offer && agencyConfig.price_offer.includes('PKR') ? agencyConfig.price_offer : '25,000 PKR';
    message = `Assalam o Alaikum! 👋\n\nMain *${agencyConfig.sender_name}* hoon from *${agencyConfig.agency_name}*.\n\nMaine dekha ke Google par *${prospect.business_name}* ki reviews aur rating bohot achhi hain ⭐, lekin aapki koi official website nahi thi jahan se clients direct book kar sakein.\n\nMaine aapke business ke liye ek *modern, fast demo website* banayi hai, check karein:\n👉 ${demoUrl}\n\nIs mein aapki services, customer reviews, aur direct WhatsApp booking button already laga hua hai.\n\nAgar aapko pasand aaye toh batayein, hum sirf *${price}* mein isko aapke official domain par live kar denge.\n\nKaisi lagi aapko?`;
  }

  const encoded = encodeURIComponent(message);
  return {
    rawMessage: message,
    clickToChatUrl: `https://wa.me/${waNumber}?text=${encoded}`,
    webWhatsAppUrl: `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`,
    phone: waNumber,
    market,
    niche
  };
}

function createFollowUp1Pitch(prospect, demoUrl, agencyConfig) {
  const waNumber = getCleanWANumber(prospect.phone, prospect.city, prospect.country);
  const market = detectMarket(prospect);
  const niche = detectNiche(prospect);

  let message = '';
  if (market === 'USA' || market === 'AUSTRALIA') {
    message = `Hi Team *${prospect.business_name}*! 👋\n\nHope you're having a great week.\n\nDid you get a quick minute to check out the custom website demo we put together for ${prospect.business_name}?\n👉 ${demoUrl}\n\nIf you want to swap out photos, adjust pricing, or add specific services, I'd be happy to customize it for you today at no extra charge.\n\nLet me know what you think!`;
  } else if (market === 'DUBAI') {
    message = `Hi Team *${prospect.business_name}*! 👋\n\nHope you're having a productive week.\n\nDid you get a chance to test drive the bespoke prototype we built for ${prospect.business_name}?\n👉 ${demoUrl}\n\nIf you want to customize the services, pricing, or photos, I can update it for you today free of charge.\n\nLet me know your feedback!`;
  } else {
    message = `Assalam o Alaikum! 👋\n\nUmeed hai aap khairiyat se honge.\n\nMaine kal aapke business *${prospect.business_name}* ke liye jo demo website share ki thi:\n👉 ${demoUrl}\n\nKya aapko woh check karne ka moqa mila?\n\nAgar aapko services, rates ya photos mein koi bhi tabdeeli karwani ho toh batayein, main free customize kar deta hoon.\n\nKaisa laga aapko design?`;
  }

  const encoded = encodeURIComponent(message);
  return {
    rawMessage: message,
    clickToChatUrl: `https://wa.me/${waNumber}?text=${encoded}`,
    webWhatsAppUrl: `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`,
    phone: waNumber,
    market,
    niche
  };
}

function createFollowUp2Pitch(prospect, demoUrl, agencyConfig) {
  const waNumber = getCleanWANumber(prospect.phone, prospect.city, prospect.country);
  const market = detectMarket(prospect);
  const niche = detectNiche(prospect);

  let message = '';
  if (market === 'USA' || market === 'AUSTRALIA') {
    message = `Hi Team *${prospect.business_name}*! ⏳\n\nQuick heads up — the reservation period for your custom website concept expires tomorrow:\n👉 ${demoUrl}\n\nWe limit our client onboarding to just 2 businesses per region each month to maintain dedicated support. If you want us to link this to your official domain, let me know so we can lock in your spot, otherwise we'll archive the demo.\n\nBest regards,\n*${agencyConfig.sender_name}* | ${agencyConfig.agency_name}`;
  } else if (market === 'DUBAI') {
    message = `Hi Team *${prospect.business_name}*! ⏳\n\nQuick heads up — the 48-hour reservation period for your bespoke prototype expires tomorrow:\n👉 ${demoUrl}\n\nWe only onboard 2 studios in Dubai per month to keep dedicated focus. If you want us to connect it to your official domain, let me know so we can lock in your slot, otherwise we will archive the demo.\n\nBest regards,\n*${agencyConfig.sender_name}* | ${agencyConfig.agency_name}`;
  } else {
    message = `Assalam o Alaikum sir! ⏳\n\nBas ek quick update dena tha ke *${prospect.business_name}* ke demo website ka reservation period kal expire ho raha hai:\n👉 ${demoUrl}\n\nHum is haftay sirf 2 local businesses ko official domain par live kar rahe hain.\n\nAgar aap isey activate karwana chahte hain toh batayein taake setup start karein, warna hum is design ko archive kar denge.\n\nThank you!\n*${agencyConfig.sender_name}* | ${agencyConfig.agency_name}`;
  }

  const encoded = encodeURIComponent(message);
  return {
    rawMessage: message,
    clickToChatUrl: `https://wa.me/${waNumber}?text=${encoded}`,
    webWhatsAppUrl: `https://web.whatsapp.com/send?phone=${waNumber}&text=${encoded}`,
    phone: waNumber,
    market,
    niche
  };
}

function createEmailPitch(prospect, demoUrl, agencyConfig) {
  const market = detectMarket(prospect);
  const niche = detectNiche(prospect);
  const nicheInfo = getNichePitchBullets(niche);
  const price = market === 'DUBAI' ? '500 AED' : (market === 'USA' ? '$249' : (market === 'AUSTRALIA' ? '$299 AUD' : '25,000 PKR'));

  const subject = `Bespoke Website Prototype for ${prospect.business_name}`;
  const text = `Hi Team ${prospect.business_name},

I came across your business listing in ${prospect.city} and was impressed by your stellar reviews.

However, I noticed that you don't have an active official website connected for direct customer inquiries and mobile bookings.

Instead of sending a generic sales pitch, our digital studio designed a full custom interactive demo website specifically for ${prospect.business_name}:

👉 View Your Live Demo Here: ${demoUrl}

Features included:
- Mobile-optimized luxury design
${nicheInfo.bullets.join('\n')}
- Direct 1-Click WhatsApp & Phone Booking

If you love the direction, we can deploy it directly onto your official domain for a one-time setup of ${price}.

If not interested, no hard feelings at all — feel free to enjoy interacting with the demo!

Best regards,
${agencyConfig.sender_name}
${agencyConfig.agency_name}
Phone: ${agencyConfig.sender_phone}`;

  return {
    subject,
    text,
    to: prospect.email || '',
    market,
    niche
  };
}

async function sendEmailViaSMTP(emailData, smtpConfig) {
  if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
    throw new Error("SMTP credentials not configured.");
  }

  const transporter = nodemailer.createTransport({
    service: smtpConfig.service || 'gmail',
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    }
  });

  const info = await transporter.sendMail({
    from: `"${smtpConfig.sender_name || 'Antigravity Digital'}" <${smtpConfig.user}>`,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text
  });

  return info;
}

module.exports = {
  createWhatsAppPitch,
  createFollowUp1Pitch,
  createFollowUp2Pitch,
  createEmailPitch,
  sendEmailViaSMTP,
  getCleanWANumber,
  detectMarket,
  detectNiche
};
