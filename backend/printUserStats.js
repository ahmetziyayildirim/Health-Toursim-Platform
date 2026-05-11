// Demographic & preference breakdown for seeded users.
// Run with:  node printUserStats.js
// Outputs:   console table + backend/stats-report.html
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const Booking = require('./src/models/Booking');

const today = new Date();
const ageOf = (dob) => {
  if (!dob) return null;
  const d = new Date(dob);
  let a = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
  return a;
};

const tally = (items) => items.reduce((m, k) => (k == null ? m : (m[k] = (m[k] || 0) + 1, m)), {});
const tallyArr = (rows, key) => {
  const m = {};
  rows.forEach(r => (r[key] || []).forEach(v => { m[v] = (m[v] || 0) + 1; }));
  return m;
};
const sortDesc = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
const pct = (n, total) => total ? `${((n / total) * 100).toFixed(1)}%` : '0%';

// ─── Console renderer ────────────────────────────────────────────────────────
const consoleSection = (title, rows, total, limit = null) => {
  console.log(`\n── ${title} ──`);
  const sliced = limit ? rows.slice(0, limit) : rows;
  sliced.forEach(([k, v]) => console.log(`  ${String(k).padEnd(28)} ${String(v).padStart(4)}   ${pct(v, total)}`));
  if (limit && rows.length > limit) console.log(`  …${rows.length - limit} more`);
};

// ─── HTML renderer ───────────────────────────────────────────────────────────
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const htmlSection = (title, rows, total, limit = null) => {
  const sliced = limit ? rows.slice(0, limit) : rows;
  const max = sliced.length ? sliced[0][1] : 1;
  const bars = sliced.map(([k, v]) => {
    const widthOfMax = (v / max) * 100;
    return `<tr>
        <td class="label">${escapeHtml(k)}</td>
        <td class="count">${v}</td>
        <td class="pct">${pct(v, total)}</td>
        <td class="bar-cell"><div class="bar" style="width:${widthOfMax.toFixed(1)}%"></div></td>
      </tr>`;
  }).join('');
  const more = (limit && rows.length > limit) ? `<p class="more">…${rows.length - limit} more</p>` : '';
  return `<section class="card">
    <h2>${escapeHtml(title)}</h2>
    <table class="dist">
      <thead><tr><th>Item</th><th>Count</th><th>%</th><th>Distribution</th></tr></thead>
      <tbody>${bars}</tbody>
    </table>${more}
  </section>`;
};

const renderHtml = (report) => `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Health Tourism — Kullanıcı İstatistikleri</title>
<style>
  :root {
    --bg: #f6f8fb;
    --card: #ffffff;
    --ink: #14202b;
    --muted: #5b6b7a;
    --line: #e6ebf1;
    --primary: #0d6efd;
    --accent: #20c997;
    --bar-from: #4f8cff;
    --bar-to: #7ad3ff;
    --shadow: 0 1px 3px rgba(20,32,43,.06), 0 6px 24px rgba(20,32,43,.05);
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  header.page {
    background: linear-gradient(135deg, #0d6efd 0%, #20c997 100%);
    color: white; padding: 32px 24px; box-shadow: var(--shadow);
  }
  header.page h1 { margin: 0 0 4px; font-size: 24px; font-weight: 600; }
  header.page .meta { opacity: .9; font-size: 13px; }
  main { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .kpi-grid {
    display: grid; gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    margin-bottom: 24px;
  }
  .kpi {
    background: var(--card); border-radius: 12px; padding: 16px 18px;
    box-shadow: var(--shadow);
  }
  .kpi .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  .kpi .value { font-size: 26px; font-weight: 700; margin-top: 4px; color: var(--primary); }
  .kpi .sub { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .grid {
    display: grid; gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  }
  .card {
    background: var(--card); border-radius: 12px; padding: 18px 20px;
    box-shadow: var(--shadow);
  }
  .card h2 { font-size: 15px; margin: 0 0 12px; color: var(--ink); font-weight: 600; }
  table.dist { width: 100%; border-collapse: collapse; }
  table.dist th { font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 500; text-align: left; padding: 6px 8px 6px 0; border-bottom: 1px solid var(--line); }
  table.dist th:nth-child(2), table.dist th:nth-child(3) { text-align: right; }
  table.dist td { padding: 6px 8px 6px 0; border-bottom: 1px solid var(--line); vertical-align: middle; }
  table.dist tr:last-child td { border-bottom: none; }
  td.label { font-weight: 500; }
  td.count, td.pct { text-align: right; font-variant-numeric: tabular-nums; }
  td.pct { color: var(--muted); font-size: 12px; min-width: 56px; }
  td.bar-cell { width: 40%; padding-left: 12px; }
  .bar {
    height: 10px; border-radius: 5px;
    background: linear-gradient(90deg, var(--bar-from), var(--bar-to));
    min-width: 2px;
  }
  .card.wide { grid-column: 1 / -1; }
  .more { color: var(--muted); font-size: 12px; margin: 8px 0 0; }
  footer { text-align: center; color: var(--muted); font-size: 12px; padding: 24px; }
  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr; }
    td.bar-cell { width: 30%; }
  }
</style>
</head>
<body>
<header class="page">
  <h1>🌍 Health Tourism — Kullanıcı İstatistikleri</h1>
  <div class="meta">Generated: ${report.generatedAt} · MongoDB: <code>${escapeHtml(report.database)}</code></div>
</header>
<main>
  <div class="kpi-grid">
    <div class="kpi"><div class="label">Toplam Kullanıcı</div><div class="value">${report.totalUsers}</div><div class="sub">${report.demoUsers} demo + ${report.totalUsers - report.demoUsers} random</div></div>
    <div class="kpi"><div class="label">Aktif Booking</div><div class="value">${report.bookings.total}</div><div class="sub">${report.bookings.uniqueUserPct} kullanıcı booking aldı</div></div>
    <div class="kpi"><div class="label">Ortalama Yaş</div><div class="value">${report.age.avg}</div><div class="sub">aralık ${report.age.min}–${report.age.max}</div></div>
    <div class="kpi"><div class="label">Ortalama Bütçe</div><div class="value">€${report.budget.avg.toLocaleString('tr-TR')}</div><div class="sub">aralık €${report.budget.min}–€${report.budget.max.toLocaleString('tr-TR')}</div></div>
    <div class="kpi"><div class="label">Ülke Sayısı</div><div class="value">${report.countriesCount}</div><div class="sub">${report.citiesCount} farklı şehir</div></div>
    <div class="kpi"><div class="label">Ort. Refakatçi</div><div class="value">${report.companionAvg}</div><div class="sub">kişi / seyahat</div></div>
  </div>

  <div class="grid">
    ${htmlSection('Yaş Bandı', report.ageBands, report.totalUsers)}
    ${htmlSection('Cinsiyet', report.gender, report.totalUsers)}
    ${htmlSection('Medeni Durum', report.marital, report.totalUsers)}
    ${htmlSection('Bütçe (€)', report.budgetBands, report.totalUsers)}
    ${htmlSection('Uyruk (Top 10)', report.nationality, report.totalUsers, 10)}
    ${htmlSection('Ülke / Konum (Top 10)', report.country, report.totalUsers, 10)}
    ${htmlSection('Şehir (Top 15)', report.city, report.totalUsers, 15)}
    ${htmlSection('Daha Önce Aldığı Tedavi', report.prevTreatments, report.totalUsers)}
    ${htmlSection('Almak İstediği Tedavi', report.desiredTreatments, report.totalUsers)}
    ${htmlSection('Refakatçi Tipi', report.companionType, report.totalUsers)}
    ${htmlSection('Tatil İlgisi', report.travelInterests, report.totalUsers)}
    ${htmlSection('Tarih Tercihi', report.dateRange, report.totalUsers)}
  </div>
</main>
<footer>
  Health Tourism Platform · 800 kullanıcı veri seti · <code>node printUserStats.js</code> ile yeniden üretilebilir.
</footer>
</body>
</html>`;

// ─── Main ────────────────────────────────────────────────────────────────────
const run = async () => {
  await connectDB();
  console.log('📊 Connected. Generating user statistics…\n');

  const users = await User.find({ role: 'user' }).lean();
  const total = users.length;
  console.log(`Total active users in DB: ${total}\n`);

  // Age
  const ages = users.map(u => ageOf(u.dateOfBirth)).filter(a => a != null);
  const ageBandsMap = { '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65-75': 0 };
  ages.forEach(a => {
    if (a < 35) ageBandsMap['25-34']++;
    else if (a < 45) ageBandsMap['35-44']++;
    else if (a < 55) ageBandsMap['45-54']++;
    else if (a < 65) ageBandsMap['55-64']++;
    else ageBandsMap['65-75']++;
  });
  const avgAge = +(ages.reduce((s, a) => s + a, 0) / ages.length).toFixed(1);
  const ageBands = Object.entries(ageBandsMap); // keep order

  // Budget
  const budgets = users.map(u => u.preferences?.budget).filter(b => typeof b === 'number');
  const budgetBandsMap = { '<1000': 0, '1000-2499': 0, '2500-4999': 0, '5000-9999': 0, '10000-19999': 0, '20000+': 0 };
  budgets.forEach(b => {
    if (b < 1000) budgetBandsMap['<1000']++;
    else if (b < 2500) budgetBandsMap['1000-2499']++;
    else if (b < 5000) budgetBandsMap['2500-4999']++;
    else if (b < 10000) budgetBandsMap['5000-9999']++;
    else if (b < 20000) budgetBandsMap['10000-19999']++;
    else budgetBandsMap['20000+']++;
  });
  const avgBudget = +(budgets.reduce((s, b) => s + b, 0) / budgets.length).toFixed(0);
  const budgetBands = Object.entries(budgetBandsMap).map(([k, v]) => [`€${k}`, v]);

  // Companions
  const counts = users.map(u => u.preferences?.companions?.count).filter(c => c);
  const companionAvg = +(counts.reduce((s, c) => s + c, 0) / counts.length).toFixed(2);

  // Bookings cross
  const bookingCount = await Booking.countDocuments();
  const usersWithBookings = await Booking.distinct('user');

  const report = {
    generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    database: mongoose.connection.name,
    totalUsers: total,
    demoUsers: 6,
    countriesCount: new Set(users.map(u => u.country).filter(Boolean)).size,
    citiesCount: new Set(users.map(u => u.city).filter(Boolean)).size,
    age: { avg: avgAge, min: Math.min(...ages), max: Math.max(...ages) },
    ageBands,
    gender: sortDesc(tally(users.map(u => u.gender))),
    marital: sortDesc(tally(users.map(u => u.maritalStatus))),
    nationality: sortDesc(tally(users.map(u => u.nationality))),
    country: sortDesc(tally(users.map(u => u.country))),
    city: sortDesc(tally(users.map(u => u.city))),
    budget: { avg: avgBudget, min: Math.min(...budgets), max: Math.max(...budgets) },
    budgetBands,
    prevTreatments: sortDesc(tallyArr(users.map(u => u.preferences || {}), 'previousTreatments')),
    desiredTreatments: sortDesc(tallyArr(users.map(u => u.preferences || {}), 'desiredTreatments')),
    companionType: sortDesc(tally(users.map(u => u.preferences?.companions?.type))),
    companionAvg,
    travelInterests: sortDesc(tallyArr(users.map(u => u.preferences || {}), 'travelInterests')),
    dateRange: sortDesc(tally(users.map(u => u.preferences?.dateRange))),
    bookings: {
      total: bookingCount,
      uniqueUsers: usersWithBookings.length,
      uniqueUserPct: pct(usersWithBookings.length, total)
    }
  };

  // ── Console output ────────────────────────────────────────────────────────
  console.log(`── Age — average ${avgAge}, min ${report.age.min}, max ${report.age.max} ──`);
  ageBands.forEach(([k, v]) => console.log(`  ${k.padEnd(28)} ${String(v).padStart(4)}   ${pct(v, total)}`));
  consoleSection('Gender', report.gender, total);
  consoleSection('Marital Status', report.marital, total);
  consoleSection('Nationality (top 10)', report.nationality, total, 10);
  consoleSection('Country / Location (top 10)', report.country, total, 10);
  consoleSection('City (top 15)', report.city, total, 15);
  console.log(`\n── Budget (€) — average €${avgBudget}, min €${report.budget.min}, max €${report.budget.max} ──`);
  budgetBands.forEach(([k, v]) => console.log(`  ${k.padEnd(28)} ${String(v).padStart(4)}   ${pct(v, total)}`));
  consoleSection('Previous Treatments', report.prevTreatments, total);
  consoleSection('Desired Treatments', report.desiredTreatments, total);
  consoleSection('Companion Type', report.companionType, total);
  console.log(`\n── Companion Count — average ${companionAvg} people per trip ──`);
  consoleSection('Travel Interests', report.travelInterests, total);
  consoleSection('Date Range Preference', report.dateRange, total);
  console.log(`\n── Bookings ──`);
  console.log(`  Total bookings:               ${bookingCount}`);
  console.log(`  Users with ≥1 booking:        ${usersWithBookings.length}   ${report.bookings.uniqueUserPct}`);

  // ── HTML output ───────────────────────────────────────────────────────────
  const html = renderHtml(report);
  const outPath = path.join(__dirname, 'stats-report.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`\n📄 HTML report saved to: ${outPath}`);

  console.log('\n✅ Stats complete.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => { console.error('❌', err); process.exit(1); });
