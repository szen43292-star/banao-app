/* ================= Banao · builder engine (offline, rule-based) ================= */
const clone = o => JSON.parse(JSON.stringify(o));
const titleCase = s => String(s || '').replace(/(^|[\s(/-])([a-z])/g, (m, a, c) => a + c.toUpperCase());
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function hsl2hex(h, s, l){ s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return toHex(255 * f(0), 255 * f(8), 255 * f(4)); }
function hueOf(hex){ const [r, g, b] = hx(hex).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return 0; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; }
function accentFor(p){ const h = hueOf(p); return h >= 15 && h <= 70 ? '#2BB3A3' : '#F2B134'; }

const parseSvc = (str, def) => rows(str).map(r => ({t: r[0], d: r[1] || '', i: r[2] || def}));
const parseItems = str => rows(str).map(r => ({t: r[0], m: r[1] || '', p: r[2] || '', tag: r[3] || ''}));
const parseForm = str => rows(str).map(r => ({l: r[0], type: r[1] || 'text'}));

/* ---------- websites ---------- */
function webFromTemplate(t){
  return {
    kind:'website', tpl:t.id, label:t.label, slug:slugify(t.name) + '-' + newId().slice(-4),
    name:t.name, tagline:t.tagline, city:t.city, phone:t.phone, email:t.email, address:t.address, hours:t.hours,
    p:t.p, a:t.a, style:t.style, font:t.font, icon:t.icon, image:'',
    hero:{eyebrow:t.hero[0], title:t.hero[1], sub:t.hero[2], cta:t.hero[3], cta2:t.hero[4]},
    chips:SPL(t.chips), stats:rows(t.stats).map(r => ({v:r[0], l:r[1]})),
    services:{title:t.svcT, items:parseSvc(t.svc, t.icon)},
    show:{type:t.show.type, title:t.show.title, btn:t.show.btn, icon:t.show.icon || t.icon, cart:!!t.show.cart, items:parseItems(t.show.items)},
    about:{title:t.about[0], text:t.about[1], points:SPL(t.about[2])},
    reviews:rows(t.reviews).map(r => ({q:r[0], n:r[1], r:r[2]})),
    form:{title:t.form.title, btn:t.form.btn, fields:parseForm(t.form.fields)},
    sections:{stats:true, services:true, show:true, about:true, reviews:true, contact:true},
    whatsapp:true
  };
}

const ARCH = {
  store:{show:'cards', btn:'Add to bag', cart:true, svcT:'Why shop with us', showT:'Our range',
    title:'{Noun} worth coming back for', sub:'Browse the range, order on WhatsApp or visit us in {city}. Every order is packed by hand and checked before it leaves.',
    cta:'Order now', cta2:'See the range', chips:'Delivery across {city};Cash on delivery',
    stats:'4.8★|Customer rating;2,000+|Happy customers;48 hrs|City delivery;7 days|Easy returns',
    aboutT:'Why people choose {name}', about:'{name} started as a small {label} in {city} with one rule: sell only what we would buy ourselves. We still check every order by hand and reply to every message personally.',
    points:'Quality checked by hand;Fair, fixed prices;Quick replies on WhatsApp',
    form:['Order on WhatsApp','Send order','Your name|text;Phone|tel;Product|select:showcase;Quantity|number;Delivery address|textarea'],
    svc:'{Noun} range|Everyday and premium options, always in stock|bag;Home delivery|Across {city} within 48 hours|truck;Gift packing|Free gift wrap on request|star;Bulk orders|Special prices for shops and events|box',
    items:'{Noun} Classic|Our everyday bestseller|₹499|Bestseller;{Noun} Premium|Top grade, small batch|₹899|;{Noun} Gift Box|Festive packing, ready to give|₹1,299|Gift;{Noun} Starter Pack|Try three favourites|₹699|',
    reviews:'Ordered on Friday evening and it arrived on Saturday morning, packed with care.|Sneha R.|{city};Good quality, and the owner personally helped me choose.|Imran K.|{city};Fair prices and they never push you to buy more than you need.|Lakshmi V.|{city}'},
  food:{show:'menu', btn:'', svcT:'Ways to enjoy', showT:'Menu',
    title:'Fresh {noun}, made the way you like it', sub:'Cooked fresh every day in {city}. Eat in, take away or order to your door.',
    cta:'Order now', cta2:'See the menu', chips:'Fresh every day;Home delivery',
    stats:'4.7★|Rating;50+|Dishes;30 min|Average delivery;10 yrs|Serving {city}',
    aboutT:'Cooked fresh, every single day', about:'At {name} everything is made in small batches with ingredients bought fresh every morning. No reheated food and no shortcuts, just recipes our regulars have loved for years.',
    points:'Ingredients bought fresh daily;Clean, open kitchen;Party and bulk orders taken',
    form:['Reserve or order','Send request','Your name|text;Phone|tel;Date|date;Time|time;Guests|number'],
    svc:'Dine-in|Comfortable seating for families|users;Home delivery|Hot and on time|truck;Party orders|Birthdays and office events|cake;Takeaway|Ready in 15 minutes|bag',
    items:'House special {noun}|Our most-ordered dish|₹240|Bestseller;Classic {noun}|Made the way it always has been|₹180|;{Noun} combo|With a drink and a side|₹299|;Family pack|Serves four|₹699|',
    reviews:'Tastes like home cooking, and the portions are generous.|Rohan M.|{city};Ordered for an office party of 40. Everything arrived hot and on time.|Ayesha F.|{city};My go-to place on weekends. Friendly staff and spotless.|Vikram S.|{city}'},
  service:{show:'menu', btn:'', svcT:'Services', showT:'Prices',
    title:'{Label} you can rely on', sub:'Trained staff, prices agreed upfront and work done right the first time. Book a slot and we confirm within the hour.',
    cta:'Book a service', cta2:'See prices', chips:'Prices agreed upfront;Same-day slots',
    stats:'1,500+|Jobs done;4.8★|Customer rating;60 min|Response time;30 days|Work warranty',
    aboutT:'Honest work at fair prices', about:'{name} has served customers across {city} since 2015. Every job is done by trained staff, every price is agreed before work begins, and if something is not right we come back and fix it free.',
    points:'Verified, trained staff;Written quote before work starts;30-day warranty on work',
    form:['Book a service','Request booking','Your name|text;Phone|tel;Service|select:services;Preferred date|date;Address or details|textarea'],
    svc:'{Noun} service|Done by trained, verified staff|wrench;Home visits|We come to you, anywhere in {city}|house;Annual plans|Regular service at a fixed yearly price|calendar;Urgent help|Same-day support when it cannot wait|bolt',
    items:'Basic {noun} service|Inspection and standard work|₹499|;Standard {noun} service|Our most requested job|₹999|Popular;Complete {noun} service|Full job with warranty|₹1,999|;Annual maintenance plan|Four visits a year|₹3,499|',
    reviews:'They came on time, explained the problem and fixed it in an hour.|Suresh P.|{city};The quote they gave was exactly what I paid. Rare these days.|Nandini K.|{city};Booked on WhatsApp in the morning, done by evening.|Farhan A.|{city}'},
  care:{show:'menu', btn:'', svcT:'What we treat', showT:'Fees',
    title:'Care that puts you first', sub:'Qualified professionals, unhurried appointments and clear advice. Book a visit at {name} in under a minute.',
    cta:'Book an appointment', cta2:'See fees', chips:'Same-day appointments;Clear, written advice',
    stats:'8,000+|Patients cared for;12 yrs|Experience;4.9★|Patient rating;15 min|Average wait',
    aboutT:'Unhurried, honest care', about:'{name} was started to give people in {city} care without the rush. We take time to listen, explain every option in plain words and write down your plan before you leave.',
    points:'Qualified, registered professionals;Clean, sterilised rooms;Reminders for follow-ups',
    form:['Book an appointment','Request appointment','Your name|text;Phone|tel;Reason for visit|select:services;Preferred date|date;Message|textarea'],
    svc:'Consultation|An unhurried first visit and a clear plan|steth;{Noun}|Treatment by qualified, registered staff|heart;Follow-up care|Reminders and progress check-ins|calendar;Home visits|Available for elderly patients|house',
    items:'First consultation|45 minutes|₹600|;Follow-up visit|Within 14 days|₹400|;{Noun} session|Per session|₹800|;Six-session package|Valid for two months|₹4,200|Save ₹600',
    reviews:'The doctor listened properly and did not rush me out.|Geeta M.|{city};Clean clinic, short wait, and a written plan to take home.|Arun B.|{city};They called to remind me of my follow-up. Thoughtful.|Rekha D.|{city}'},
  learn:{show:'cards', btn:'Enquire', svcT:'What we teach', showT:'Courses',
    title:'Learn from teachers who care', sub:'Small batches, regular feedback and teachers who know every student by name. Book a free demo class at {name}.',
    cta:'Book a demo class', cta2:'See courses', chips:'Small batches;Free demo class',
    stats:'1,200+|Students taught;8 yrs|Teaching;15|Students per batch;4.9★|Parent rating',
    aboutT:'Every student gets attention', about:'{name} began with one batch of eight students in {city}. We still keep batches small, share progress every month and help students outside class hours when they get stuck.',
    points:'Batches of 15 or fewer;Monthly progress updates;Doubt sessions every week',
    form:['Book a demo class','Book demo','Your name|text;Phone|tel;Course|select:showcase;Preferred batch|select:Morning,Evening,Weekend;Message|textarea'],
    svc:'{Noun} classes|Small batches, personal attention|book;Weekend batches|For working adults and school students|calendar;Online sessions|Live classes from home|laptop;Certificates|Assessment and certificate on completion|cap',
    items:'{Noun} for beginners|8 weeks · 2 classes a week|₹3,000 / month|;{Noun}, intermediate|12 weeks|₹3,500 / month|;Weekend batch|Saturdays and Sundays|₹2,500 / month|;Private coaching|One-on-one|₹1,000 / hour|',
    reviews:'My son looks forward to every class. His confidence has grown a lot.|Priya S.|{city};Teachers share honest feedback every month, not just praise.|Manoj T.|{city};Weekend batch fits perfectly around my job.|Kavitha R.|{city}'},
  fitness:{show:'plans', btn:'Join now', svcT:'What you get', showT:'Plans',
    title:'Feel stronger every week', sub:'Expert coaching, friendly classes and plans that fit around work and family. Your first session at {name} is free.',
    cta:'Book a free session', cta2:'See plans', chips:'First session free;Certified coaches',
    stats:'600+|Members;10|Coaches;6 am|Doors open;4.8★|Member rating',
    aboutT:'Coaching that keeps you going', about:'{name} opened in {city} to make fitness simple and steady. Every member gets a plan in the first week and a coach who checks in on progress.',
    points:'Personal plan in week one;Clean, well-kept space;Women-only batches available',
    form:['Book a free session','Book session','Your name|text;Phone|tel;Plan|select:showcase;Preferred time|select:Morning,Evening;Message|textarea'],
    svc:'{Noun} sessions|For beginners and regulars|dumbbell;Personal training|One-on-one plans|user;Group classes|Energetic group sessions|users;Diet guidance|Simple Indian meal plans|leaf',
    items:'Monthly|Full access,1 assessment|₹1,500 / month|;Quarterly|Full access,Group classes,Monthly review|₹4,000 / 3 months|Most popular;Yearly|Everything included,Diet plan,Guest passes|₹13,500 / year|',
    reviews:'Six months in and I have never felt better. The coaches really care.|Deepa N.|{city};Friendly people, no judgement, and the morning batch is perfect.|Karan J.|{city};The diet plan was simple enough to actually follow.|Sana P.|{city}'},
  stay:{show:'cards', btn:'Book this room', svcT:'What we offer', showT:'Rooms',
    title:'A comfortable stay in {city}', sub:'Clean rooms, home-cooked food and hosts who know the best local spots. Book directly with us for the best rate.',
    cta:'Check availability', cta2:'View rooms', chips:'Best rate when you book direct;Breakfast included',
    stats:'4.8★|Guest rating;12|Rooms;24×7|Help desk;10 min|To the centre',
    aboutT:'Hosts, not just a hotel', about:'{name} is run by a family who have lived in {city} for generations. We cook breakfast ourselves, plan day trips for guests and keep every room spotless.',
    points:'Home-cooked breakfast;Day trips arranged on request;Free Wi-Fi in every room',
    form:['Check availability','Send booking request','Your name|text;Phone|tel;Check-in|date;Check-out|date;Guests|number;Room|select:showcase'],
    svc:'Comfortable rooms|Clean, quiet and well kept|bed;Home-cooked meals|Breakfast and dinner on request|utensils;Local trips|Sightseeing arranged by our team|car;Wi-Fi|Fast internet in every room|laptop',
    items:'Standard room|Double bed · attached bath|₹2,200 / night|;Deluxe room|Balcony · valley view|₹3,200 / night|Popular;Family room|Sleeps four|₹4,200 / night|;Dormitory bed|Per bed, shared room|₹700 / night|',
    reviews:'Felt like staying with family. The breakfast was the best part.|Ankita & Rahul|Mumbai;Spotless rooms and the hosts planned our whole day trip.|Joseph M.|Bengaluru;Quiet, comfortable and great value for money.|Harsh V.|Delhi'},
  portfolio:{show:'cards', btn:'View project', svcT:'What we do', showT:'Selected work',
    title:'Thoughtful work, delivered on time', sub:'Selected projects from {name}, based in {city} and working with clients across India.',
    cta:'Start a project', cta2:'See the work', chips:'Clients across India;Fixed quotes',
    stats:'120+|Projects;9 yrs|Experience;14|Cities;4.9★|Client rating',
    aboutT:'How we work', about:'{name} works with a small team on a few projects at a time. You get one point of contact, a fixed quote and regular updates from first sketch to final handover.',
    points:'One point of contact;Fixed quote, no surprises;Updates every week',
    form:['Start a project','Send enquiry','Your name|text;Phone|tel;Project type|select:services;Start date|date;Tell us about it|textarea'],
    svc:'{Noun}|Thoughtful work, delivered on time|star;Consultation|We understand the brief first|chat;Revisions|Two rounds included|edit;Handover|Final files in every format you need|download',
    items:'Recent project|For a client in {city}|2026|;Featured work|Shortlisted for an award|2025|;Personal project|Ongoing|2025|;Collaboration|With a local brand|2024|',
    reviews:'Clear communication from start to finish, and delivered on the promised date.|Neha G.|{city};They understood exactly what we wanted after one meeting.|Studio Kaveri|Bengaluru;Fixed quote, no surprises, beautiful result.|Amit D.|{city}'}
};
const ARCH_ICON = {store:'bag', food:'utensils', service:'wrench', care:'steth', learn:'book', fitness:'dumbbell', stay:'bed', portfolio:'star'};
const ARCH_STYLE = {store:'warm', food:'warm', service:'clean', care:'clean', learn:'warm', fitness:'dark', stay:'luxe', portfolio:'clean'};
const STYLE_FONT = {clean:'modern', bold:'bold', luxe:'elegant', warm:'friendly', dark:'tech'};
const NAME_SUFFIX = {yoga:'Yoga Studio', bakery:'Bakehouse', tea:'Tea Co.', garage:'Car Care', pets:'Pet Spa', vet:'Pet Clinic', jewellery:'Jewellers', electronics:'Electronics', mobilerepair:'Mobile Care', laundry:'Laundry', interior:'Interiors', architect:'Architects', ca:'& Associates', driving:'Driving School', music:'School of Music', dance:'Dance Academy', coaching:'Classes', daycare:'Kids Preschool', ngo:'Foundation', catering:'Caterers', organic:'Organics', furniture:'Furniture', hardware:'Hardware', construction:'Constructions', homeservices:'Home Services', cleaning:'Cleaning Co.', movers:'Packers & Movers', taxi:'Cabs', optician:'Opticals', physio:'Physiotherapy', lab:'Diagnostics', ayurveda:'Ayurveda', homestay:'Homestay', coworking:'Cowork', bookstore:'Book House', sweets:'Sweets', icecream:'Creamery', tattoo:'Ink Studio', agency:'Digital', temple:'Temple Trust', florist:'Florist', clinic:'Clinic', pharmacyweb:'Medicals'};
const PREFIX = ['Saffron','Sunrise','Lotus','Silver Oak','Neelam','Green Leaf','Shree','Nova','Banyan','Kesar','Urban','Prime'];
const SOFT_TITLES = {
  'garage.jobs':'General service/Brake pad replacement/AC gas refill/Wheel alignment', 'garage.products':'Engine oil 5W-30, 3.5 L/Brake pads, front/Air filter/Wiper blades',
  'bakery.products':'Chocolate truffle cake, 1 kg/Red velvet cake, 1 kg/Butter cookies, 500 g/Cupcake box of 6', 'tea.products':'First flush Darjeeling, 100 g/Assam CTC masala, 250 g/Nilgiri green, 100 g/Kashmiri kahwa, 100 g',
  'jewellery.products':'Temple necklace set/Diamond solitaire ring/Gold jhumkas/Silver anklets', 'mobilerepair.jobs':'Screen replacement/Battery replacement/Charging port repair/Water damage check',
  'mobilerepair.products':'Display, 6.5 inch/Battery, 5000 mAh/Charging port flex/Back glass', 'laundry.jobs':'Wash & fold, 6 kg/Dry clean, 3 sarees/Steam iron, 12 pieces/Blazer dry clean',
  'interior.jobs':'3 BHK, Whitefield/Kitchen makeover/Villa, Sarjapur/Café fit-out', 'ca.tasks':'GSTR-3B for this month/ITR, salaried client/TDS return, Q2/ROC annual filing',
  'catering.jobs':'Wedding, 400 plates/Office lunch, 60 boxes/Birthday party, 80 guests/Monthly tiffin, 12 people', 'catering.menu':'Veg thali/Paneer butter masala/Jeera rice/Gulab jamun',
  'construction.jobs':'G+2 house, Baner/Shop renovation/Compound wall/Office interiors', 'homeservices.jobs':'Fan installation/Kitchen tap leak/AC wet service/RO filter change',
  'cleaning.jobs':'2 BHK deep clean/Sofa shampoo, 5 seats/Bathroom cleaning/Office weekly clean', 'movers.jobs':'2 BHK, Pune to Bengaluru/1 BHK, within city/Office shift, 20 desks/Car transport to Delhi',
  'agency.tasks':'Website redesign/SEO audit/Festive campaign creatives/Monthly ads report', 'ngo.tasks':'Evening classes/Health camp/Tailoring batch/Relief kits',
  'temple.tasks':'Navratri utsav/Sunday annadanam/Temple painting/Kalyanotsavam'
};
const ARCH_SOFT = {store:'products,orders,customers,suppliers', food:'menu,korders,tables,staff', service:'jobs,customers,staff,invoices', care:'opdpatients,cappointments,prescriptions,invoices', learn:'students,fees,attendance,teachers', fitness:'members,plans,payments,trainers', stay:'rooms,bookings,guests,invoices', portfolio:'leads,customers,jobs:Projects:Project,invoices'};

const fillT = (s, v) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m);

function composeWebsite(o){
  const A = ARCH[o.arch] || ARCH.service;
  const v = {name:o.name, city:o.city || 'your city', label:o.label.toLowerCase(), Label:cap(o.label), noun:o.noun.toLowerCase(), Noun:titleCase(o.noun)};
  const style = o.style || ARCH_STYLE[o.arch] || 'clean';
  const sh = o.sh;
  const icon = o.icon || ARCH_ICON[o.arch] || 'star';
  return {
    kind:'website', tpl:null, label:cap(o.label), slug:slugify(o.name) + '-' + newId().slice(-4),
    name:o.name, tagline:cap(o.label) + (o.city ? ' in ' + o.city : ''), city:o.city || '', phone:o.phone || '+91 98765 43210', email:o.email || slugify(o.name).replace(/-/g,'') + '@gmail.com',
    address:o.city ? 'Main Road, ' + o.city : 'Shop 4, Main Road', hours:'Mon–Sat, 10 am–8 pm',
    p:o.p, a:o.a, style, font:o.font || STYLE_FONT[style], icon, image:'',
    hero:{eyebrow:cap(o.label) + (o.city ? ' · ' + o.city : ''), title:fillT(A.title, v), sub:fillT(A.sub, v), cta:A.cta, cta2:A.cta2},
    chips:SPL(fillT(A.chips, v)), stats:rows(fillT(A.stats, v)).map(r => ({v:r[0], l:r[1]})),
    services:{title:A.svcT, items:parseSvc(fillT(o.svc || A.svc, v), icon)},
    show:{type:sh ? sh[0] : A.show, title:sh ? sh[1] : A.showT, btn:sh ? sh[2] : A.btn, icon, cart:!!((sh ? sh[0] : A.show) === 'cards' && o.arch === 'store'), items:parseItems(fillT(sh ? sh[3] : A.items, v))},
    about:{title:fillT(A.aboutT, v), text:fillT(A.about, v), points:SPL(A.points)},
    reviews:rows(fillT(A.reviews, v)).map(r => ({q:r[0], n:r[1], r:r[2]})),
    form:{title:A.form[0], btn:A.form[1], fields:parseForm(A.form[2])},
    sections:{stats:true, services:true, show:true, about:true, reviews:true, contact:true},
    whatsapp:true
  };
}

/* ---------- software ---------- */
function fieldsFrom(defs){ return defs.map(d => { const [k, l, t0, o] = d.split('|'); const hide = t0[0] === '~', t = hide ? t0.slice(1) : t0; const f = {k, l, t, hide}; if (t === 'ref') f.ref = o; else if (o) f.o = o.split(','); return f; }); }
function buildModule(id, name, sg){ const L = MODLIB[id]; return {id, name:name || L.name, sg:sg || L.sg, icon:L.icon, on:true, fields:fieldsFrom(L.f), rows:clone(L.r)}; }
function genericModule(label){
  const name = titleCase(label), sg = singular(name);
  return {id:'x_' + slugify(label).replace(/-/g,'_'), name, sg, icon:'folder', on:true,
    fields:fieldsFrom(['name|' + sg + '|text','category|Category|text','date|Date|date','amount|Amount|money','status|Status|status|Active,Pending,Closed','notes|Notes|~long']), rows:[]};
}
function singular(n){ const w = String(n).trim(); if (/(al|el|ol)ves$/i.test(w)) return w.replace(/ves$/i, 'f'); if (/ies$/i.test(w)) return w.replace(/ies$/i, 'y'); if (/(ss|us)$/i.test(w)) return w; if (/(ches|shes|xes)$/i.test(w)) return w.replace(/es$/i, ''); return w.replace(/s$/i, ''); }
function softFromTemplate(t){
  return {kind:'software', tpl:t.id, label:t.label, slug:slugify(t.name) + '-' + newId().slice(-4), name:t.name, title:t.title, p:t.p, a:t.a, icon:t.icon,
    currency:'₹', sample:true, login:{on:false, user:'admin', pass:'admin123'},
    modules:t.mods.split(',').map(x => buildModule(x)), stats:clone(t.stats), alerts:clone(t.alerts), chart:clone(t.chart)};
}
const NAMES = ['Rahul Verma','Anita Desai','Vijay Kumar','Meena Pillai','Sanjay Gupta','Pooja Nair','Arjun Reddy','Fatima Khan','Rohit Sharma','Kavya Iyer'];
function genRows(m, ctx, all){
  const out = [];
  for (let i = 0; i < 4; i++) {
    out.push(m.fields.map((f, j) => {
      const k = f.k, nm = NAMES[(i + ctx.off) % NAMES.length];
      if (j === 0) {
        if (ctx.titles && ctx.titles[i]) return ctx.titles[i];
        if (/^(name|customer|guest|patient|member|lead|emp|student)$/.test(k)) return nm;
        if (k === 'no') return m.sg.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() + '-' + (1001 + i);
        if (k === 'reg') return ['MH 12 AB 4521','MH 14 CD 9087','KA 05 EF 3310','DL 3C GH 7702'][i];
        return m.sg + ' ' + String.fromCharCode(65 + i);
      }
      if (f.t === 'ref') { const rm = all.find(x => x.id === f.ref); return rm && rm.rows.length ? rm.rows[i % rm.rows.length][0] : ''; }
      if (f.t === 'sel' || f.t === 'status') return f.o[i % f.o.length];
      if (f.t === 'money') return /salary/.test(k) ? [18000,24000,32000,15000][i] : [499,1250,2400,899][i];
      if (f.t === 'num') return [12,4,30,8][i];
      if (f.t === 'date') return '@' + [0,-1,2,-5][i];
      if (f.t === 'time') return ['10:00','11:30','15:00','17:30'][i];
      if (f.t === 'phone') return '98' + String(220 + i * 37 + ctx.off) + ' ' + String(41000 + i * 1371 + ctx.off * 7).slice(0,5);
      if (f.t === 'email') return nm.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com';
      if (/^(service|task|reason|title)$/.test(k) && ctx.services.length) return ctx.services[i % ctx.services.length];
      if (k === 'items') return ctx.products.length ? ctx.products[i % ctx.products.length] + ' ×' + (i + 1) : (i + 2) + ' items';
      if (/^(customer|owner|assigned|staff|agent|guardian|person|member|guest|patient|lead|emp|student|teacher|doctor|buyer)$/.test(k)) return NAMES[(i + ctx.off + 3 + j) % NAMES.length];
      if (/^(city|loc)$/.test(k)) return ctx.city || 'Pune';
      if (/^(sku|batch|rack|shelf|mid|eid|roll|gst|room|sec)$/.test(k)) return k.toUpperCase().slice(0, 2) + '-' + (101 + i);
      if (k === 'model') return ['Maruti Swift','Hyundai Creta','Tata Nexon','Honda City'][i];
      if (k === 'perks') return ['Basic access','Full access','Full access, extras','Everything included'][i];
      return '';
    }));
  }
  return out;
}
function autoStats(mods){
  const st = [], m0 = mods[0];
  st.push([m0.name, m0.id, 'count', [], m0.icon]);
  for (const m of mods) { const sf = m.fields.find(f => f.t === 'status'); const o = sf && sf.o.find(x => /^(open|pending|due|scheduled|booked|in progress|new|to do|issued)$/i.test(x)); if (o) { st.push([o + ' ' + m.name.toLowerCase(), m.id, 'count', [{k:sf.k, op:'eq', v:o}], 'clock']); break; } }
  for (const m of mods) { const df = m.fields.find(f => f.t === 'date' && /^(date|checkin|issued)$/.test(f.k)); if (df) { st.push([m.name + ' today', m.id, 'count', [{k:df.k, op:'today'}], 'calendar']); break; } }
  for (const m of mods) { const mf = m.fields.find(f => f.t === 'money' && /amount|total|paid|fee/.test(f.k)) || m.fields.find(f => f.t === 'money'), sf = m.fields.find(f => f.t === 'status' && (f.o || []).includes('Paid')); if (mf && sf) { st.push(['Collected', m.id, 'sum:' + mf.k, [{k:sf.k, op:'eq', v:'Paid'}], 'wallet']); break; } }
  for (const m of mods.slice(1)) { if (st.length >= 4) break; if (!st.some(s => s[1] === m.id)) st.push([m.name, m.id, 'count', [], m.icon]); }
  return st.slice(0, 4);
}
function autoAlerts(mods){
  const al = [];
  mods.forEach(m => {
    const sf = m.fields.find(f => f.t === 'status'); if (!sf) return; const tk = m.fields[0].k;
    sf.o.forEach(o => {
      if (/^(overdue|expired)$/i.test(o)) al.push({m:m.id, w:[{k:sf.k, op:'eq', v:o}], msg:m.sg + ': {' + tk + '} is ' + o.toLowerCase(), lvl:'crit'});
      else if (/^(pending|open|due|new|low stock)$/i.test(o)) al.push({m:m.id, w:[{k:sf.k, op:'eq', v:o}], msg:m.sg + ': {' + tk + '} is ' + o.toLowerCase(), lvl:'warn'});
    });
    const df = m.fields.find(f => f.t === 'date'), sch = sf.o.find(o => /^(scheduled|booked|confirmed)$/i.test(o));
    if (df && sch) al.push({m:m.id, w:[{k:df.k, op:'today'}, {k:sf.k, op:'eq', v:sch}], msg:'Today: ' + m.sg.toLowerCase() + ' for {' + tk + '}', lvl:'info'});
  });
  return al.slice(0, 6);
}
function autoChart(mods){ for (const m of mods) { const sf = m.fields.find(f => f.t === 'status'); if (sf) return {m:m.id, k:sf.k, t:m.name + ' by status'}; } return null; }
function composeSoftware(o){
  // o: {name, title, p, a, icon, list:[[id,name,sg,titles]], kbKey, services, city}
  const all = [];
  o.list.forEach(([id, name, sg, titles]) => {
    if (all.some(m => m.id === id)) return;
    const m = MODLIB[id] ? buildModule(id, name, sg) : genericModule(name || id);
    m.rows = []; m._titles = titles; all.push(m);
  });
  const products = (all.find(m => /^(products|menu|medicines)$/.test(m.id)) || {}).id;
  all.forEach((m, i) => {
    if (m.id === 'products') { const cf = m.fields.find(f => f.k === 'cat'); if (cf) cf.o = ['General','Premium','Accessories','Other']; }
    const ctx = {titles:m._titles || (SOFT_TITLES[o.kbKey + '.' + m.id] || '').split('/').filter(Boolean), off:i * 2, city:o.city, services:o.services || [], products:[]};
    if (products && products !== m.id) { const pm = all.find(x => x.id === products); ctx.products = pm.rows.map(r => r[0]); }
    m.rows = !ctx.titles.length && MODLIB[m.id] && MODLIB[m.id].keep ? clone(MODLIB[m.id].r) : genRows(m, ctx, all); delete m._titles;
  });
  return {kind:'software', tpl:null, label:o.label, slug:slugify(o.name) + '-' + newId().slice(-4), name:o.name, title:o.title, p:o.p, a:o.a, icon:o.icon,
    currency:o.currency || '₹', sample:true, login:{on:!!o.login, user:'admin', pass:'admin123'}, modules:all, stats:autoStats(all), alerts:autoAlerts(all), chart:autoChart(all)};
}

/* ---------- understanding a description ---------- */
const CITIES = ['new delhi','navi mumbai','mumbai','delhi','bengaluru','bangalore','hyderabad','chennai','kolkata','pune','ahmedabad','jaipur','lucknow','surat','kanpur','nagpur','indore','bhopal','patna','vadodara','ludhiana','agra','nashik','rajkot','varanasi','srinagar','amritsar','ranchi','coimbatore','madurai','kochi','cochin','thiruvananthapuram','trivandrum','mysuru','mysore','mangaluru','mangalore','goa','panaji','udaipur','jodhpur','chandigarh','dehradun','rishikesh','shimla','manali','darjeeling','gangtok','guwahati','shillong','bhubaneswar','raipur','noida','gurugram','gurgaon','faridabad','ghaziabad','thane','aurangabad','visakhapatnam','vizag','vijayawada','tirupati','puducherry','pondicherry','ooty','meerut','prayagraj','allahabad','gwalior','jabalpur','jammu','leh','hubli','belagavi','kolhapur','solapur','siliguri','kozhikode','calicut','thrissur','salem','tiruchirappalli','warangal','dubai','abu dhabi','london','new york','singapore','toronto','sydney','kathmandu','dhaka','colombo'];
const COLOR_WORDS = {red:'#B42318', maroon:'#7A1F3D', crimson:'#A4161A', pink:'#BE185D', rose:'#BE123C', magenta:'#A21CAF', orange:'#C2410C', saffron:'#D97706', yellow:'#CA8A04', gold:'#B8893B', golden:'#B8893B', green:'#15803D', emerald:'#047857', olive:'#5B6B1F', mint:'#0F766E', teal:'#0F766E', turquoise:'#0E7490', cyan:'#0E7490', blue:'#1D4ED8', navy:'#16324F', sky:'#0369A1', indigo:'#3730A3', purple:'#6D28D9', violet:'#6D28D9', lavender:'#7C6BB8', brown:'#7C4A2D', coffee:'#4A3426', beige:'#A68A64', black:'#111827', grey:'#4B5563', gray:'#4B5563', silver:'#64748B', peach:'#E07A5F', cream:'#A68A64'};
const MOODS = {
  luxe:/\b(luxury|luxurious|premium|elegant|royal|classy|high[- ]end|upscale|sophisticated|heritage|regal|exclusive)\b/,
  bold:/\b(bold|sporty|sports|street|streetwear|energetic|loud|edgy|youthful|young|brutal|punchy)\b/,
  dark:/\b(dark|night|neon|gaming|futuristic|techy|black theme|dark mode)\b/,
  warm:/\b(warm|friendly|cozy|cosy|fun|kids|playful|homely|cute|colou?rful|cheerful|cheery|soft)\b/,
  clean:/\b(clean|minimal|minimalist|simple|professional|corporate|white|sleek)\b/
};
const SOFT_RX = /\b(management|manage|managing|manager|system|software|erp|crm|pos|billing|inventory|stock|dashboard|admin panel|records?|track|tracking|tracker|register|attendance|payroll|point of sale|accounting app|app to)\b/;
const HARD_SOFT_RX = /\b(management|system|software|erp|crm|pos|dashboard|admin panel|payroll|inventory)\b/;
const WEB_RX = /\b(website|web site|site|landing page|webpage|web page|homepage|home page|online presence|portfolio)\b/;

function phraseRx(w){ return new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s-]+') + '(e?s)?(?=[^a-z]|$)'); }
const GENERIC_W = /^(startup|company|shop|store|business|brand|agency|studio|centre|center|services|service|platform|tool|stay|rooms|products|items|stock|members|staff|employees|team|students|classes|office|dashboard|crm|billing|inventory|pos|leads)$/;
function scoreWords(text, words){ let s = 0; String(words).split(',').map(w => w.trim()).filter(Boolean).forEach(w => { if (phraseRx(w).test(text)) s += GENERIC_W.test(w) ? 1 : 2 * w.split(/\s+/).length + (w.length >= 6 ? 1 : 0); }); return s; }
function hashStr(s){ let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

function extractName(raw){
  let m = raw.match(/["“]([^"”]{2,40})["”]/);
  if (m) return m[1].trim();
  m = raw.match(/\b(?:called|named|name is|name will be|brand name is|business name is|brand is|company is)\s+([A-Za-z0-9&@.'’-]+(?:\s+(?!(?:in|at|from|with|for|and|that|which|based|located|near|it|is|we|to|of|on|a|an|the)\b)[A-Za-z0-9&@.'’-]+){0,3})/i);
  if (m) { const n = m[1].replace(/[.,]$/, '').trim(); return /[A-Z]/.test(n) ? n : titleCase(n); }
  return '';
}
function extractCity(raw, low){
  for (const c of CITIES) if (phraseRx(c).test(low)) return titleCase(c === 'bangalore' ? 'bengaluru' : c === 'gurgaon' ? 'gurugram' : c === 'cochin' ? 'kochi' : c);
  const m = raw.match(/\b(?:in|at|from|based in|located in)\s+([A-Z][a-zA-Z]{2,}(?:\s[A-Z][a-zA-Z]{2,})?)/);
  if (m && !COLOR_WORDS[m[1].toLowerCase()] && !/^(India|English|Hindi|My|Our|The|A|An)$/.test(m[1])) return m[1];
  return '';
}
function extractNoun(low){
  const STOP = '(?=\\s+(?:called|named|in|at|with|that|which|where|based|located|near|to|and|website|site|software|system|app|management)\\b|\\s*[.,!;]|\\s*$)';
  const m = low.match(new RegExp("\\bfor\\s+(?:(?:my|an|a|our|the|his|her|their)\\s+)?([a-z&'-]+(?:\\s+[a-z&'-]+){0,3}?)" + STOP));
  let n = m ? m[1].trim() : '';
  if (!n) { const m2 = low.match(/\b(?:an|a|my|our)\s+([a-z&'-]+(?:\s+[a-z&'-]+){0,2}?)\s+(?:website|site|app|software|system|management)\b/); n = m2 ? m2[1].trim() : ''; }
  n = n.replace(/\b(small|new|local|own|online|simple|nice|good|best|perfect|beautiful|modern|website|site|management|software|system|app|business|company|firm)\b/g, '').replace(/\s+/g, ' ').trim();
  return n;
}
function subjectOf(n){ return n.replace(/\b(shop|store|business|company|brand|startup|centre|center|services|service|agency|outlet|firm|place)\b/g, '').replace(/\s+/g, ' ').trim() || n; }
function archFromWords(low){
  if (/\b(shop|store|brand|sell|selling|boutique|mart|products?)\b/.test(low)) return 'store';
  if (/\b(clinic|care|therapy|therapist|health|doctor|hospital|treatment)\b/.test(low)) return 'care';
  if (/\b(class|classes|course|courses|academy|training|tuition|coaching|school|teach|lessons?)\b/.test(low)) return 'learn';
  if (/\b(food|kitchen|cafe|café|restaurant|snacks|meals|dhaba|bakery|juice)\b/.test(low)) return 'food';
  if (/\b(stay|resort|rooms|lodge|camp|camping|hostel)\b/.test(low)) return 'stay';
  if (/\b(fitness|gym|sports|training centre|martial|boxing|swimming)\b/.test(low)) return 'fitness';
  if (/\b(studio|design|photo|art|portfolio|freelance)\b/.test(low)) return 'portfolio';
  return 'service';
}

function understand(raw, forceKind){
  const low = ' ' + raw.toLowerCase().replace(/[’]/g, "'") + ' ';
  const notes = [];
  const softSignal = SOFT_RX.test(low), webSignal = WEB_RX.test(low);
  const kind = forceKind === 'website' || forceKind === 'software' ? forceKind : (softSignal && (!webSignal || HARD_SOFT_RX.test(low)) ? 'software' : 'website');
  // match

  const head = low.split(/\b(?:with|including|having|which has|that has)\b/)[0] + ' ';
  const scoreAll = txt => { const c = []; (kind === 'website' ? WEB_TEMPLATES : SOFT_TEMPLATES).forEach(t => c.push({type:'tpl', t, s:scoreWords(txt, t.kw) + 0.5})); KB.forEach(k => c.push({type:'kb', t:k, s:scoreWords(txt, k.w)})); return c.sort((x, y) => y.s - x.s); };
  let cands = scoreAll(head); if (cands[0].s < 1) cands = scoreAll(low);
  let best = cands[0].s >= 1 ? cands[0] : null;
  // a business type Banao knows well beats a loosely related template (a bakery is not a restaurant)
  const kbBest = cands.find(c => c.type === 'kb' && c.s >= 1);
  if (best && best.type === 'tpl' && kbBest && kbBest.s >= best.s - 0.5) {
    const linked = kind === 'website' ? kbBest.t.tpl === best.t.id : kbBest.t.tplSoft === best.t.id;
    const primaryHit = phraseRx(String(best.t.kw || '').split(',')[0].trim()).test(low);
    if (!linked && !primaryHit) best = kbBest;
  }
  const name = extractName(raw), city = extractCity(raw, low);
  // colours & mood
  const colours = []; Object.keys(COLOR_WORDS).forEach(w => { const i = low.search(phraseRx(w)); if (i > -1) colours.push([i, COLOR_WORDS[w], w]); });
  colours.sort((a, b) => a[0] - b[0]);
  let mood = null; for (const k of ['luxe','dark','bold','warm','clean']) if (MOODS[k].test(low)) { mood = k; break; }
  if (!mood && colours[0] && colours[0][2] === 'black') mood = 'dark';
  const pCol = colours.find(c => !(mood === 'dark' && c[2] === 'black'));
  const aCol = colours.filter(c => c !== pCol && c[2] !== 'black')[0];
  notes.push(['Type', kind === 'website' ? 'Website' : 'Management software']);
  let spec;
  if (kind === 'website') {
    if (best && best.type === 'tpl') {
      spec = webFromTemplate(best.t);
      notes.push(['Business', best.t.label], ['Starting point', best.t.label + ' template']);
      if (name) spec.name = name;
      if (city && city !== spec.city) { spec.city = city; spec.address = 'Main Road, ' + city; spec.hero.eyebrow = best.t.label + ' · ' + city; spec.tagline = best.t.label + ' in ' + city; spec.reviews.forEach(r => r.r = city); }
      if (name) {
        const tn = best.t.name, w = tn.split(' ');
        const olds = [tn, w.slice(0, 2).join(' ')].concat(w[0].length >= 5 && !/^(Smile|Bright|City|Velvet)$/.test(w[0]) ? [w[0]] : []);
        const rep = str => olds.reduce((acc, o) => acc.split(o).join(name), str);
        spec.about.text = rep(spec.about.text); spec.about.title = rep(spec.about.title); spec.hero.sub = rep(spec.hero.sub); spec.tagline = rep(spec.tagline);
        spec.reviews.forEach(r => r.q = rep(r.q));
        spec.email = slugify(name).replace(/-/g,'') + '@gmail.com';
      }
      if (city && city !== best.t.city) spec.phone = '+91 98765 43210';
    } else {
      const k = best && best.t, noun = extractNoun(low) || (k ? k.l.toLowerCase() : 'business');
      const arch = k ? k.a : archFromWords(low);
      const own = k && noun && scoreWords(' ' + noun + ' ', k.w) ? noun : '';
      const label = k ? (own || k.l) : noun;
      const subj = subjectOf(k ? (own || k.l.toLowerCase()) : noun);
      const hue = k ? k.h : hashStr(noun) % 360;
      const nm = name || (city ? city : PREFIX[hashStr(noun) % PREFIX.length]) + ' ' + (k ? NAME_SUFFIX[k.k] || titleCase(subj) : titleCase(subj));
      spec = composeWebsite({name:nm, city, label, noun:subj, arch, icon:k ? k.i : ARCH_ICON[arch], svc:k && k.svc, sh:k && k.sh, style:k ? k.st : null, font:k ? k.fo : null, p:hsl2hex(hue, 58, 30), a:accentFor(hsl2hex(hue, 58, 30))});
      notes.push(['Business', cap(label)], ['Starting point', k ? 'Built from what Banao knows about ' + k.l.toLowerCase() : 'New design, composed for “' + noun + '”']);
    }
  } else {
    const kb = best && best.type === 'kb' ? best.t : null;
    let tpl = best && best.type === 'tpl' ? best.t : (kb && kb.tplSoft && !kb.soft ? SOFT_TEMPLATES.find(t => t.id === kb.tplSoft) : (kb && kb.tplSoft ? SOFT_TEMPLATES.find(t => t.id === kb.tplSoft) : null));
    if (kb && kb.soft && !kb.tplSoft) tpl = null;
    const noun = extractNoun(low);
    if (tpl) {
      spec = softFromTemplate(tpl);
      if (kb) {
        const own = noun && scoreWords(' ' + noun + ' ', kb.w) ? noun : '';
        (kb.soft || '').split(',').forEach(x => { const [id, n, sg] = x.split(':'); const m = spec.modules.find(mm => mm.id === id); if (m && n) { m.name = n; m.sg = sg || singular(n); } });
        spec.title = titleCase(own || kb.l) + ' Management'; spec.label = own ? cap(own) : kb.l;
        spec.name = (city ? city : PREFIX[hashStr(kb.k) % PREFIX.length]) + ' ' + (own ? titleCase(subjectOf(own)) : NAME_SUFFIX[kb.k] || titleCase(kb.l));
      }
      notes.push(['Business', spec.label.replace(/ management| & billing| pos| crm/i, '')], ['Starting point', tpl.label + ' template']);
    } else {
      const arch = kb ? kb.a : archFromWords(low);
      const list = (kb && kb.soft ? kb.soft : ARCH_SOFT[arch]).split(',').map(x => x.split(':'));
      const label = kb ? (noun && scoreWords(' ' + noun + ' ', kb.w) ? noun : kb.l) : (noun || 'business');
      const hue = kb ? kb.h : hashStr(label) % 360;
      spec = composeSoftware({name:(city ? city : PREFIX[hashStr(label) % PREFIX.length]) + ' ' + (kb ? NAME_SUFFIX[kb.k] || titleCase(kb.l) : titleCase(subjectOf(label))), title:titleCase(label) + ' Management', label,
        p:hsl2hex(hue, 55, 32), a:accentFor(hsl2hex(hue, 55, 32)), icon:kb ? kb.i : ARCH_ICON[arch], list, kbKey:kb ? kb.k : '', services:kb ? parseSvc(kb.svc || '').map(x => x.t) : [], city});
      notes.push(['Business', cap(label)], ['Starting point', kb ? 'Modules chosen from what Banao knows about ' + kb.l.toLowerCase() : 'New system, composed for “' + label + '”']);
    }
    // modules the person asked for by name
    const added = [];
    const listM = low.match(/\b(?:with|including|for managing|to manage|to track|manage|track|handle|having)\s+([^.;!?]+)/);
    const asked = [];
    Object.keys(MODLIB).forEach(id => MODLIB[id].syn.split(',').forEach(w => { const i = low.search(phraseRx(w)); if (i > -1) asked.push([i, id, w]); }));
    asked.sort((a, b) => a[0] - b[0]);
    const spans = asked.map(([i, id, w]) => [i, i + w.length + 1]);
    for (let x = asked.length - 1; x >= 0; x--) { const [a0, a1] = spans[x]; if (spans.some(([b0, b1], y) => y !== x && b0 <= a0 && b1 >= a1 && (b1 - b0) > (a1 - a0))) asked.splice(x, 1), spans.splice(x, 1); }
    const pref = ['invoices','customers','products','orders','staff','payments','gbookings','tasks'];
    const groups = {};
    asked.forEach(([i, id, w]) => { (groups[i] = groups[i] || []).push([id, w]); });
    Object.keys(groups).map(Number).sort((a, b) => a - b).forEach(i => {
      if (!listM || listM.index > i + 1) return; // only count words in the "with …" part
      const g = groups[i], w = g.map(x => x[1]).sort((a, b) => b.length - a.length)[0];
      const holders = Array.from(new Set(g.map(x => x[0])));
      if (holders.some(h => spec.modules.some(m => m.id === h))) return;
      const pick = holders.find(h => pref.includes(h)) || holders[0];
      if (spec.modules.some(m => m.id === pick)) return;
      const m = buildModule(pick, /^[a-z]/.test(w) && w !== MODLIB[pick].name.toLowerCase() ? titleCase(w) : null, null);
      if (m.name !== MODLIB[pick].name) m.sg = singular(m.name);
      if (!spec.tpl) m.rows = genRows(m, {titles:[], off:5, city, services:[], products:[]}, spec.modules);
      spec.modules.push(m); added.push(m.name);
    });
    if (listM) {
      listM[1].split(/,|\band\b|&|\//).map(x => x.replace(/\s+(?:in|at|near|from|for)\s+.*$/, '').replace(/\b(a|an|the|my|our|their|all|its|proper|simple|full|complete|separate|module|modules|section|sections|page|pages|tab|tabs|management|tracking|details|list|lists)\b/g, '').replace(/\s+/g, ' ').trim())
        .filter(x => x && x.split(' ').length <= 3 && !/alert|remind|report|dashboard|login|password|backup|notification|sms|whatsapp|mobile|offline|online|phone|colou?r|theme|design|api|search|export|print/.test(x))
        .forEach(x => {
          const known = Object.keys(MODLIB).some(id => MODLIB[id].syn.split(',').some(w => phraseRx(w).test(' ' + x + ' ')));
          if (known || spec.modules.some(m => m.name.toLowerCase() === x)) return;
          if (!/^[a-z][a-z\s-]{2,}$/.test(x) || /\b(low|high|expiry|due|daily|weekly|monthly|multiple|many|easy|fast)\b/.test(x)) return;
          const g = genericModule(x); g.rows = genRows(g, {titles:[], off:7, city, services:[], products:[]}, spec.modules);
          spec.modules.push(g); added.push(g.name);
        });
    }
    if (added.length) { notes.push(['Added because you asked', added.join(', ')]); if (!spec.tpl) { spec.stats = autoStats(spec.modules); spec.alerts = autoAlerts(spec.modules); } }
    if (name) spec.name = name;
    if (city && !name && spec.tpl && !kb) spec.name = spec.name;
    if (/\b(login|password|secure|lock|admin login)\b/.test(low)) { spec.login.on = true; notes.push(['Lock', 'Password screen on (admin / admin123)']); }
    if (/(\$|\busd\b|dollars?)/.test(low)) spec.currency = '$'; else if (/(€|\beuros?\b)/.test(low)) spec.currency = '€'; else if (/(£|\bpounds?\b|\bgbp\b)/.test(low)) spec.currency = '£'; else if (/\b(aed|dirhams?)\b/.test(low)) spec.currency = 'AED ';
  }
  // look
  if (pCol) { spec.p = pCol[1]; spec.a = aCol ? aCol[1] : (spec.kind === 'website' && spec.tpl ? spec.a : accentFor(pCol[1])); }
  if (spec.kind === 'website') {
    if (mood) { spec.style = mood; spec.font = STYLE_FONT[mood]; }
    if (/\b(no|without|skip)\s+(reviews?|testimonials?)\b/.test(low)) spec.sections.reviews = false;
    if (/\b(no|without|skip)\s+(numbers|stats|statistics)\b/.test(low)) spec.sections.stats = false;
    notes.push(['Name', spec.name + (name ? '' : ' (suggested, change it in Business)')]);
    if (city) notes.push(['City', city]);
    notes.push(['Look', STYLES[spec.style].label + ' style, ' + FONTS[spec.font].label.toLowerCase() + ' type' + (pCol ? ', ' + pCol[2] + (aCol ? ' and ' + aCol[2] : '') : '')]);
    notes.push(['Sections', ['Hero', spec.sections.stats && 'numbers', 'services', spec.show.title.toLowerCase(), 'about', spec.sections.reviews && 'reviews', 'contact form → WhatsApp'].filter(Boolean).join(', ')]);
  } else {
    notes.push(['Name', spec.name + (name ? '' : ' (suggested, change it in Business)')]);
    if (city) notes.push(['City', city]);
    notes.push(['Modules', 'Dashboard, ' + spec.modules.map(m => m.name).join(', ')]);
    if (pCol) notes.push(['Colours', pCol[2] + (aCol ? ' and ' + aCol[2] : '')]);
  }
  if (spec.kind === 'software' && city && spec.biz && spec.tpl) spec.biz.address = 'Main Road, ' + city;
  spec.nameIdeas = suggestNames(spec.label, city || spec.city || '', 0, spec.name);
  return {spec, notes};
}
