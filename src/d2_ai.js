/* ================= Banao · real-life defaults and name ideas ================= */

/* ---------- billing, printable bills and business details for templates ---------- */
const SOFT_BILLING = {
  'pharmacy-ms': {items:'medicines', name:'name', price:'mrp', stock:'qty', to:'psales', map:{no:'no', customer:'customer', date:'date', items:'items', total:'amount', mode:'mode'}, paid:'', tax:12},
  'retail-ms': {items:'products', name:'name', price:'price', stock:'stock', to:'orders', map:{no:'no', customer:'customer', date:'date', items:'items', total:'total', mode:'mode', status:'status'}, paid:'Paid', tax:5},
  'restaurant-ms': {items:'menu', name:'name', price:'price', stock:null, to:'korders', map:{no:'no', date:'date', items:'items', total:'amount', status:'status'}, paid:'Billed', tax:5}
};
const SOFT_PRINT = {'hospital-ms':['hbills'], 'hotel-ms':['invoices'], 'school-ms':['fees'], 'gym-ms':['payments'], 'clinic-ms':['invoices'], 'hr-ms':['payroll'], 'realestate-ms':['deals']};
const SOFT_BIZ = {
  'hospital-ms':['14 Karve Road, Kothrud, Pune 411038','+91 20 4100 2200'], 'pharmacy-ms':['Shop 3, FC Road, Shivajinagar, Pune 411004','+91 98220 31122'],
  'hotel-ms':['22 Lal Ghat, near Jagdish Temple, Udaipur 313001','+91 294 242 8800'], 'school-ms':['Sector 6, Vibhuti Khand, Gomti Nagar, Lucknow 226010','+91 522 400 1188'],
  'retail-ms':['Shop 12, Station Road, Nashik 422001','+91 94220 55190'], 'restaurant-ms':['7 Hauz Khas Village, New Delhi 110016','+91 11 4105 2299'],
  'gym-ms':['Plot 41, DLF Road, Gachibowli, Hyderabad 500032','+91 40 4870 2211'], 'library-ms':['Civil Lines, Jaipur 302006','+91 141 222 3344'],
  'clinic-ms':['MG Road, Ernakulam, Kochi 682016','+91 484 236 7788'], 'hr-ms':['4th floor, Cyber Towers, Hitec City, Hyderabad 500081','+91 40 6655 1200'],
  'realestate-ms':['Unit 905, Tower B, Golf Course Road, Gurugram 122002','+91 124 471 5500']
};
const SOFT_WA = {
  'gym-ms':{0:'Hello {name}, your {plan} membership at {biz} ends on {expires}. Reply here to renew and keep training.', 1:'Hello {name}, your membership at {biz} ended on {expires}. We would love to have you back. Reply to restart.'},
  'realestate-ms':{1:'Hello {name}, thank you for your enquiry with {biz}. When would be a good time for a site visit?'}
};
function autoBilling(mods){
  const items = mods.find(m => /^(products|menu|medicines)$/.test(m.id)), to = mods.find(m => /^(orders|psales|korders|invoices)$/.test(m.id));
  if (!items || !to) return null;
  const f = k => to.fields.find(x => x.k === k) ? k : null;
  const price = items.fields.find(x => x.t === 'money' && /price|mrp|rate/.test(x.k)) || items.fields.find(x => x.t === 'money');
  const stock = items.fields.find(x => x.t === 'num' && /stock|qty/.test(x.k));
  const total = to.fields.find(x => x.t === 'money' && /total|amount/.test(x.k)) || to.fields.find(x => x.t === 'money');
  const st = to.fields.find(x => x.t === 'status');
  if (!price || !total) return null;
  return {items:items.id, name:items.fields[0].k, price:price.k, stock:stock ? stock.k : null, to:to.id,
    map:{no:f('no'), customer:f('customer'), phone:null, date:(to.fields.find(x => x.t === 'date') || {}).k || null, items:f('items'), total:total.k, mode:f('mode'), status:st ? st.k : null},
    paid:st && st.o ? (st.o.find(o => /^(paid|billed|completed)$/i.test(o)) || st.o[0]) : '', tax:5};
}
function bizFor(tplId, city, billing){
  const d = SOFT_BIZ[tplId];
  return {address: d ? d[0] : (city ? 'Main Road, ' + city : ''), phone: d ? d[1] : '+91 98765 43210', gstin:'', upi:'', gst: billing ? billing.tax : 0, note:'Thank you! Please visit again.'};
}

/* extend the template builders with the real-life parts */
const _webFromTemplate = webFromTemplate;
webFromTemplate = function(t){
  const s = _webFromTemplate(t);
  s.faq = defaultFaq(s); s.gallery = []; s.upi = '';
  Object.assign(s.sections, {faq:true, gallery:true, cta:true});
  s.nameIdeas = suggestNames(s.label, s.city, 0, s.name);
  return s;
};
const _composeWebsite = composeWebsite;
composeWebsite = function(o){
  const s = _composeWebsite(o);
  s.faq = defaultFaq(s); s.gallery = []; s.upi = '';
  Object.assign(s.sections, {faq:true, gallery:true, cta:true});
  s.nameIdeas = suggestNames(s.label, s.city, 0, s.name);
  return s;
};
const _softFromTemplate = softFromTemplate;
softFromTemplate = function(t){
  const s = _softFromTemplate(t);
  s.billing = SOFT_BILLING[t.id] ? clone(SOFT_BILLING[t.id]) : null;
  s.printable = clone(SOFT_PRINT[t.id] || []);
  s.biz = bizFor(t.id, '', s.billing);
  const wa = SOFT_WA[t.id]; if (wa) Object.keys(wa).forEach(i => { if (s.alerts[i]) s.alerts[i].wa = wa[i]; });
  s.nameIdeas = suggestNames(t.label, '', 0, s.name);
  return s;
};
const _composeSoftware = composeSoftware;
composeSoftware = function(o){
  const s = _composeSoftware(o);
  s.billing = autoBilling(s.modules);
  s.printable = s.modules.filter(m => /^(invoices|orders|payments|fees)$/.test(m.id)).map(m => m.id);
  s.biz = bizFor('', o.city, s.billing);
  s.nameIdeas = suggestNames(o.label, o.city, 0, s.name);
  return s;
};

/* ---------- business-name suggestions (offline) ---------- */
const NAME_PARTS = [
  {w:/hospital|clinic|health|medical|pharma|chemist|dental|dentist|doctor|physio|diagnostic|lab\b|ayurved|vet|pharmacy|medicine|nursing/, roots:['Aarogya','Sanjivani','Cura','Medi','Nirog','Jeevan','Vitalis','Arogyam'], types:['Care','Health','Clinic','Medicals','Wellness']},
  {w:/restaurant|food|kitchen|dhaba|biryani|catering|tiffin|thali|sweet|bakery|cake|cafe|café|coffee|tea|juice|ice cream|canteen/, roots:['Tadka','Rasoi','Zaika','Swaad','Masala','Chulha','Annapurna','Kesar'], types:['Kitchen','House','Rasoi','Bites','Café']},
  {w:/hotel|resort|homestay|stay|hostel|\bpg\b|lodge|villa|cottage|guest/, roots:['Aangan','Haveli','Neem','Banyan','Kesar','Vista','Darpan'], types:['Retreat','Stay','Residency','Inn','Homestay']},
  {w:/cloth|fashion|boutique|saree|kurta|shoe|sneaker|footwear|jewel|tailor|apparel/, roots:['Saanjh','Rang','Sutra','Loom','Kala','Tara','Stride'], types:['Studio','Co.','Label','House','Store']},
  {w:/school|college|coaching|tuition|academy|class|institute|learn|course|music|preschool|library/, roots:['Vidya','Gyan','Prerna','Shiksha','Bright','Saraswati','Disha'], types:['Academy','Classes','Institute','School','Learning']},
  {w:/gym|fitness|yoga|crossfit|sport|dance|pilates|martial/, roots:['Pulse','Iron','Shakti','Core','Flex','Prana','Agni'], types:['Fitness','Gym','Studio','Club','Athletics']},
  {w:/garage|car|bike|auto|vehicle|taxi|cab|motor|tyre|mechanic/, roots:['Torque','Gear','Pitstop','Motor','Drive','Speedo','Chakra'], types:['Auto','Garage','Motors','Car Care','Services']},
  {w:/salon|spa|beauty|parlour|parlor|makeup|tattoo|barber/, roots:['Velvet','Glow','Roop','Aura','Silk','Noor','Bloom'], types:['Salon','Studio','Spa','Lounge','Beauty']},
  {w:/farm|dairy|goat|cattle|poultry|organic|agri|crop|krishi|milk|nursery|plant/, roots:['Krishi','Gokul','Dhara','Harvest','Khet','Hariyali','Kamdhenu'], types:['Farms','Dairy','Agro','Organics','Fields']},
  {w:/\blaw\b|legal|advocate|lawyer|\bca\b|account|tax|audit/, roots:['Nyay','Lex','Vidhi','Satya','Lekha'], types:['& Associates','Legal','Partners','Advisors','Consultants']},
  {w:/wedding|event|party|decor|banquet/, roots:['Shubh','Utsav','Mangal','Shagun','Baraat'], types:['Events','Weddings','Celebrations','Planners']},
  {w:/travel|tour|holiday|trip|yatra/, roots:['Yatra','Safar','Musafir','Wander','Trail'], types:['Holidays','Travels','Journeys','Trips']},
  {w:/software|saas|\bapp\b|tech|digital|agency|\bit\b|startup|cloud|web/, roots:['Nimbus','Loop','Byte','Stack','Kite','Pixel','Orbit'], types:['Labs','Tech','Digital','Works','Systems']},
  {w:/shop|store|mart|kirana|grocery|retail|wholesale|electronics|hardware|furniture|book|stationery|florist|toy|mobile/, roots:['Apna','Shree','Lakshmi','Saathi','Haat','Bazaar','Anand'], types:['Mart','Store','Traders','Emporium','Bazaar']},
  {w:/real estate|property|realty|builder|construction|interior|architect/, roots:['Keystone','Vastu','Nivas','Griha','Ashiyana','Skyline'], types:['Realty','Homes','Estates','Builders','Spaces']},
  {w:/hr\b|payroll|employee|office|company/, roots:['Nimbus','Sahyog','Udyam','Pragati','Saarthi'], types:['Technologies','Enterprises','Solutions','Group']}
];
const BRAND_SUFFIX = ['nest','hub','kart','point','plus','ly','wala','ora','verse'];
function suggestNames(label, city, seed, keep){
  const L = ' ' + String(label || '').toLowerCase() + ' ';
  const g = NAME_PARTS.find(x => x.w.test(L)) || {roots:['Nova','Shree','Prime','Saarthi','Urban','Apex','Anand'], types:['Co.','Works','Hub','Services','Solutions']};
  let h = hashStr(L + (seed || 0)) || 7; const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 8) / 16777216; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const core = titleCase((subjectOf(String(label || '').toLowerCase()).split(' ').filter(Boolean).slice(-1)[0]) || 'Store');
  const out = new Set(keep ? [keep] : []);
  const makers = [
    () => pick(g.roots) + ' ' + pick(g.types),
    () => city ? city + ' ' + pick(g.types) : pick(g.roots) + ' ' + core,
    () => { const r = pick(g.roots), sx = pick(BRAND_SUFFIX); return r + sx[0].toUpperCase() + sx.slice(1); },
    () => pick(g.roots) + ' ' + core,
    () => 'The ' + pick(g.roots) + ' ' + pick(g.types),
    () => pick(['Shree','New','Royal','Prime','Sai','Om']) + ' ' + pick(g.roots) + ' ' + pick(g.types)
  ];
  for (let i = 0; out.size < 7 && i < 60; i++) out.add(makers[i % makers.length]().replace(/\s+/g, ' ').trim());
  return Array.from(out).slice(0, 7);
}
