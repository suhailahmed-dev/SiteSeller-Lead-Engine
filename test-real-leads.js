const axios = require('axios');

async function testDubai() {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const query = `[out:json][timeout:25];(node["phone"](25.0,55.1,25.3,55.4);node["contact:phone"](25.0,55.1,25.3,55.4););out 40;`;

  try {
    const res = await axios.get(overpassUrl, {
      params: { data: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000
    });
    console.log('Total elements found in Dubai bbox:', res.data.elements.length);
    const leads = res.data.elements.map(e => ({
      name: e.tags.name || e.tags['name:en'] || '',
      phone: e.tags.phone || e.tags['contact:phone'] || e.tags['contact:mobile'] || '',
      category: e.tags.shop || e.tags.amenity || e.tags.craft || 'Service',
      website: e.tags.website
    })).filter(l => l.name && l.phone && !l.website);

    console.log('REAL LEADS (NO WEBSITE) WITH REAL PHONES:', JSON.stringify(leads.slice(0, 8), null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testDubai();
