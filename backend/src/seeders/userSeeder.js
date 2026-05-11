const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// Weighted random helper — picks an item from {value, weight} pairs
// ─────────────────────────────────────────────────────────────────────────────
const weightedPick = (pairs) => {
  const total = pairs.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of pairs) {
    if ((r -= p.weight) < 0) return p.value;
  }
  return pairs[pairs.length - 1].value;
};

const pickMany = (arr, min, max) => {
  const n = faker.number.int({ min, max });
  return faker.helpers.arrayElements(arr, n);
};

// ─────────────────────────────────────────────────────────────────────────────
// Distributions — modeled after typical Turkey health-tourism source markets
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_DIST = [
  { value: { country: 'Germany',         nationality: 'German',       phoneCode: '+49',  cities: ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Düsseldorf','Leipzig','Dortmund','Bremen'] },                weight: 18 },
  { value: { country: 'United Kingdom',  nationality: 'British',      phoneCode: '+44',  cities: ['London','Manchester','Birmingham','Leeds','Glasgow','Edinburgh','Liverpool','Bristol','Sheffield','Newcastle'] },          weight: 14 },
  { value: { country: 'United States',   nationality: 'American',     phoneCode: '+1',   cities: ['New York','Los Angeles','Chicago','Houston','Miami','Boston','Seattle','San Francisco','Dallas','Atlanta'] },               weight: 10 },
  { value: { country: 'Netherlands',     nationality: 'Dutch',        phoneCode: '+31',  cities: ['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven','Groningen','Tilburg','Almere'] },                                  weight:  8 },
  { value: { country: 'France',          nationality: 'French',       phoneCode: '+33',  cities: ['Paris','Marseille','Lyon','Toulouse','Nice','Bordeaux','Nantes','Strasbourg','Lille','Montpellier'] },                       weight:  7 },
  { value: { country: 'Saudi Arabia',    nationality: 'Saudi',        phoneCode: '+966', cities: ['Riyadh','Jeddah','Mecca','Medina','Dammam','Khobar','Tabuk','Abha'] },                                                       weight:  6 },
  { value: { country: 'Russia',          nationality: 'Russian',      phoneCode: '+7',   cities: ['Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg','Kazan','Nizhny Novgorod','Samara','Rostov-on-Don'] },              weight:  5 },
  { value: { country: 'Azerbaijan',      nationality: 'Azerbaijani',  phoneCode: '+994', cities: ['Baku','Ganja','Sumqayit','Mingachevir','Lankaran'] },                                                                        weight:  4 },
  { value: { country: 'Belgium',         nationality: 'Belgian',      phoneCode: '+32',  cities: ['Brussels','Antwerp','Ghent','Bruges','Charleroi','Liège','Namur'] },                                                         weight:  4 },
  { value: { country: 'Italy',           nationality: 'Italian',      phoneCode: '+39',  cities: ['Rome','Milan','Naples','Turin','Florence','Venice','Bologna','Genoa','Palermo'] },                                           weight:  4 },
  { value: { country: 'Spain',           nationality: 'Spanish',      phoneCode: '+34',  cities: ['Madrid','Barcelona','Valencia','Seville','Bilbao','Málaga','Zaragoza','Granada'] },                                          weight:  3 },
  { value: { country: 'Canada',          nationality: 'Canadian',     phoneCode: '+1',   cities: ['Toronto','Montreal','Vancouver','Calgary','Ottawa','Edmonton','Quebec City','Winnipeg'] },                                   weight:  3 },
  { value: { country: 'Australia',       nationality: 'Australian',   phoneCode: '+61',  cities: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Hobart'] },                                       weight:  3 },
  { value: { country: 'UAE',             nationality: 'Emirati',      phoneCode: '+971', cities: ['Dubai','Abu Dhabi','Sharjah','Al Ain','Ajman','Ras Al Khaimah','Fujairah'] },                                                weight:  3 },
  { value: { country: 'Kuwait',          nationality: 'Kuwaiti',      phoneCode: '+965', cities: ['Kuwait City','Hawalli','Salmiya','Al Ahmadi','Al Farwaniyah'] },                                                             weight:  2 },
  { value: { country: 'Iran',            nationality: 'Iranian',      phoneCode: '+98',  cities: ['Tehran','Mashhad','Isfahan','Tabriz','Shiraz','Karaj','Qom','Ahvaz'] },                                                      weight:  2 },
  { value: { country: 'Ukraine',         nationality: 'Ukrainian',    phoneCode: '+380', cities: ['Kyiv','Kharkiv','Odesa','Lviv','Dnipro','Zaporizhzhia','Vinnytsia'] },                                                       weight:  2 },
  { value: { country: 'Sweden',          nationality: 'Swedish',      phoneCode: '+46',  cities: ['Stockholm','Gothenburg','Malmö','Uppsala','Västerås','Örebro'] },                                                            weight:  1 },
  { value: { country: 'Norway',          nationality: 'Norwegian',    phoneCode: '+47',  cities: ['Oslo','Bergen','Trondheim','Stavanger','Drammen','Tromsø'] },                                                                weight:  1 }
];

const GENDER_DIST = [
  { value: 'female',             weight: 52 },
  { value: 'male',               weight: 46 },
  { value: 'other',              weight:  1 },
  { value: 'prefer-not-to-say',  weight:  1 }
];

const MARITAL_DIST = [
  { value: 'married',   weight: 55 },
  { value: 'single',    weight: 30 },
  { value: 'divorced',  weight: 12 },
  { value: 'widowed',   weight:  3 }
];

const DATE_RANGE_DIST = [
  { value: 'next-month',     weight: 15 },
  { value: 'next-3-months',  weight: 35 },
  { value: 'next-6-months',  weight: 30 },
  { value: 'flexible',       weight: 20 }
];

const COMPANION_DIST = [
  { value: { type: 'solo',    count: 1 },                                                         weight: 40 },
  { value: { type: 'couple',  count: 2 },                                                         weight: 35 },
  { value: 'family',                                                                              weight: 20 },
  { value: 'friends',                                                                             weight:  5 }
];

const TREATMENT_DIST = [
  { value: 'hair-transplant',     weight: 25 },
  { value: 'dental-care',         weight: 22 },
  { value: 'aesthetic-surgery',   weight: 15 },
  { value: 'wellness-spa',        weight: 12 },
  { value: 'health-checkup',      weight:  8 },
  { value: 'eye-surgery',         weight:  6 },
  { value: 'weight-loss',         weight:  5 },
  { value: 'medical-treatment',   weight:  3 },
  { value: 'rehabilitation',      weight:  2 },
  { value: 'fertility-treatment', weight:  2 }
];

const EXPERIENCES = ['Relaxing (Wellness)', 'Treatment-Focused', 'Close to Nature', 'Family-Friendly', 'Quick Care'];
const SERVICES = [
  'Doctor Consultation', 'Health Screening', 'Aesthetic Treatments', 'Psychological Counseling',
  'Thermal Spa', 'Dietitian Consultation', 'Sightseeing Tours', 'Airport Pickup'
];
const TRAVEL_INTERESTS = ['Beach', 'Winter', 'Museum', 'History', 'Nature', 'Culinary', 'Shopping', 'Adventure'];

// Age distribution: triangular-ish around 50 (health-tourism demographic)
const randomAge = () => {
  // Average of 3 uniforms in [25,75] → bell curve centered ~50
  const a = faker.number.int({ min: 25, max: 75 });
  const b = faker.number.int({ min: 25, max: 75 });
  const c = faker.number.int({ min: 25, max: 75 });
  return Math.round((a + b + c) / 3);
};

// Budget distribution: 3-tier mixture
//   70% mainstream  €700–€4 000   (lognormal)
//   22% premium     €4 000–€10 000 (uniform)
//    8% luxury      €10 000–€20 000 (uniform)
const randomBudget = () => {
  const roll = Math.random();
  let v;
  if (roll < 0.70) {
    v = Math.exp(7.5 + (Math.random() - 0.5) * 1.6);
  } else if (roll < 0.92) {
    v = 4000 + Math.random() * 6000;
  } else {
    v = 10000 + Math.random() * 10000;
  }
  return Math.round(v / 50) * 50;
};

// Companion sampling that expands family/friends into a count
const sampleCompanions = () => {
  const pick = weightedPick(COMPANION_DIST);
  if (pick === 'family') {
    return { type: 'family', count: faker.number.int({ min: 2, max: 5 }) };
  }
  if (pick === 'friends') {
    return { type: 'friends', count: faker.number.int({ min: 2, max: 4 }) };
  }
  return pick;
};

// Hash password ONCE — reused for all generated users (seed data, not production)
let SHARED_PASSWORD_HASH = null;
const getSharedHash = async () => {
  if (!SHARED_PASSWORD_HASH) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    SHARED_PASSWORD_HASH = await bcrypt.hash('password123', salt);
  }
  return SHARED_PASSWORD_HASH;
};

// ─────────────────────────────────────────────────────────────────────────────
// Fixed demo users — preserved for existing booking/test references
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@email.com',
    phone: '+1-555-0123', country: 'United States', city: 'Los Angeles', nationality: 'American',
    gender: 'female', maritalStatus: 'married', dateOfBirth: new Date('1985-03-15'),
    preferences: {
      budget: 1000, dateRange: 'next-3-months',
      experiences: ['Relaxing (Wellness)', 'Close to Nature'],
      services: ['Doctor Consultation', 'Thermal Spa', 'Sightseeing Tours'],
      previousTreatments: [], desiredTreatments: ['wellness-spa'],
      companions: { type: 'couple', count: 2 },
      travelInterests: ['Beach', 'Nature']
    },
    healthInfo: { conditions: 'None', allergies: 'None', medications: 'None', specialRequirements: 'Vegetarian meals preferred' },
    isEmailVerified: true, isActive: true
  },
  {
    firstName: 'Michael', lastName: 'Smith', email: 'michael.smith@email.com',
    phone: '+44-20-7946-0958', country: 'United Kingdom', city: 'London', nationality: 'British',
    gender: 'male', maritalStatus: 'married', dateOfBirth: new Date('1978-07-22'),
    preferences: {
      budget: 800, dateRange: 'next-month',
      experiences: ['Treatment-Focused', 'Quick Care'],
      services: ['Doctor Consultation', 'Health Screening', 'Airport Pickup'],
      previousTreatments: ['health-checkup'], desiredTreatments: ['dental-care'],
      companions: { type: 'solo', count: 1 },
      travelInterests: ['History', 'Museum']
    },
    healthInfo: { conditions: 'Mild hypertension', allergies: 'Penicillin', medications: 'Lisinopril 10mg daily', specialRequirements: 'Need wheelchair accessible facilities' },
    isEmailVerified: true, isActive: true
  },
  {
    firstName: 'David', lastName: 'Brown', email: 'david.brown@email.com',
    phone: '+1-416-555-0199', country: 'Canada', city: 'Toronto', nationality: 'Canadian',
    gender: 'male', maritalStatus: 'married', dateOfBirth: new Date('1982-11-08'),
    preferences: {
      budget: 1500, dateRange: 'next-6-months',
      experiences: ['Treatment-Focused', 'Family-Friendly'],
      services: ['Doctor Consultation', 'Aesthetic Treatments', 'Dietitian Consultation'],
      previousTreatments: ['dental-care'], desiredTreatments: ['hair-transplant'],
      companions: { type: 'family', count: 3 },
      travelInterests: ['Beach', 'Culinary']
    },
    healthInfo: { conditions: 'Type 2 Diabetes', allergies: 'Shellfish', medications: 'Metformin 500mg twice daily', specialRequirements: 'Diabetic-friendly meals required' },
    isEmailVerified: true, isActive: true
  },
  {
    firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@email.com',
    phone: '+49-30-12345678', country: 'Germany', city: 'Berlin', nationality: 'German',
    gender: 'female', maritalStatus: 'divorced', dateOfBirth: new Date('1975-05-30'),
    preferences: {
      budget: 1200, dateRange: 'flexible',
      experiences: ['Relaxing (Wellness)', 'Treatment-Focused'],
      services: ['Doctor Consultation', 'Health Screening', 'Thermal Spa', 'Psychological Counseling'],
      previousTreatments: ['wellness-spa', 'health-checkup'], desiredTreatments: ['aesthetic-surgery'],
      companions: { type: 'solo', count: 1 },
      travelInterests: ['Museum', 'Culinary', 'Shopping']
    },
    healthInfo: { conditions: 'Anxiety disorder', allergies: 'Latex', medications: 'Sertraline 50mg daily', specialRequirements: 'Quiet room preferred, latex-free environment' },
    isEmailVerified: true, isActive: true
  },
  {
    firstName: 'Emma', lastName: 'Garcia', email: 'emma.garcia@email.com',
    phone: '+34-91-123-4567', country: 'Spain', city: 'Madrid', nationality: 'Spanish',
    gender: 'female', maritalStatus: 'single', dateOfBirth: new Date('1990-09-12'),
    preferences: {
      budget: 900, dateRange: 'next-3-months',
      experiences: ['Relaxing (Wellness)', 'Close to Nature'],
      services: ['Doctor Consultation', 'Aesthetic Treatments', 'Thermal Spa'],
      previousTreatments: [], desiredTreatments: ['aesthetic-surgery', 'wellness-spa'],
      companions: { type: 'friends', count: 3 },
      travelInterests: ['Beach', 'Nature', 'Adventure']
    },
    healthInfo: { conditions: 'None', allergies: 'Pollen', medications: 'Antihistamines as needed', specialRequirements: 'Prefer organic/natural treatments' },
    isEmailVerified: true, isActive: true
  },
  {
    firstName: 'James', lastName: 'Miller', email: 'james.miller@email.com',
    phone: '+61-2-9876-5432', country: 'Australia', city: 'Sydney', nationality: 'Australian',
    gender: 'male', maritalStatus: 'single', dateOfBirth: new Date('1988-12-03'),
    preferences: {
      budget: 2000, dateRange: 'flexible',
      experiences: ['Treatment-Focused'],
      services: ['Doctor Consultation', 'Health Screening'],
      previousTreatments: [], desiredTreatments: ['hair-transplant'],
      companions: { type: 'solo', count: 1 },
      travelInterests: ['Adventure', 'Nature']
    },
    healthInfo: { conditions: 'None', allergies: 'None', medications: 'None', specialRequirements: 'None' },
    isEmailVerified: false, isActive: false
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Random user generator
// ─────────────────────────────────────────────────────────────────────────────
const buildRandomUser = (index, passwordHash) => {
  const country = weightedPick(COUNTRY_DIST);
  const gender = weightedPick(GENDER_DIST);
  const sex = gender === 'male' ? 'male' : gender === 'female' ? 'female' : faker.helpers.arrayElement(['male', 'female']);
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const age = randomAge();
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - age);
  dob.setMonth(faker.number.int({ min: 0, max: 11 }));
  dob.setDate(faker.number.int({ min: 1, max: 28 }));

  // 65% have at least one previous treatment
  const prevCount = Math.random() < 0.35 ? 0 : faker.number.int({ min: 1, max: 2 });
  const previousTreatments = prevCount === 0 ? [] : Array.from({ length: prevCount }, () => weightedPick(TREATMENT_DIST))
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  // Desired treatment: 1–2 items, weighted
  const desiredCount = faker.number.int({ min: 1, max: 2 });
  const desiredTreatments = Array.from({ length: desiredCount }, () => weightedPick(TREATMENT_DIST))
    .filter((v, i, a) => a.indexOf(v) === i);

  const companions = sampleCompanions();

  const phone = `${country.phoneCode}-${faker.string.numeric({ length: 9, allowLeadingZeros: false })}`;
  const email = `${firstName}.${lastName}.${index}@example.com`.toLowerCase().replace(/[^a-z0-9.@]/g, '');

  return {
    firstName,
    lastName,
    email,
    password: passwordHash,
    phone,
    country: country.country,
    city: faker.helpers.arrayElement(country.cities),
    nationality: country.nationality,
    gender,
    maritalStatus: weightedPick(MARITAL_DIST),
    dateOfBirth: dob,
    role: 'user',
    preferences: {
      budget: randomBudget(),
      dateRange: weightedPick(DATE_RANGE_DIST),
      experiences: pickMany(EXPERIENCES, 1, 3),
      services: pickMany(SERVICES, 2, 5),
      previousTreatments,
      desiredTreatments,
      companions,
      travelInterests: pickMany(TRAVEL_INTERESTS, 1, 4)
    },
    healthInfo: {
      conditions: faker.helpers.arrayElement(['None', 'None', 'None', 'Mild hypertension', 'Type 2 Diabetes', 'Asthma', 'Anxiety', 'Arthritis']),
      allergies: faker.helpers.arrayElement(['None', 'None', 'Pollen', 'Penicillin', 'Shellfish', 'Latex', 'Nuts']),
      medications: faker.helpers.arrayElement(['None', 'None', 'Daily blood-pressure medication', 'Insulin', 'Antihistamines']),
      specialRequirements: faker.helpers.arrayElement(['None', 'None', 'Vegetarian meals', 'Wheelchair access', 'Quiet room', 'Halal meals'])
    },
    isEmailVerified: Math.random() < 0.85,
    isActive: Math.random() < 0.95
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Main seeder
// ─────────────────────────────────────────────────────────────────────────────
const TARGET_TOTAL = 800;

const seedUsers = async () => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🗑️ Cleared existing users (kept admin)');

    faker.seed(42); // reproducible runs

    // 1) Demo users (use Mongoose pre-save hook for hashing on these 6)
    const demoCreated = [];
    for (let i = 0; i < DEMO_USERS.length; i++) {
      const u = new User({ ...DEMO_USERS[i], password: 'password123' });
      await u.save();
      demoCreated.push(u);
    }
    console.log(`✅ Created ${demoCreated.length} demo users (Alice, Michael, David, Sarah, Emma, James)`);

    // 2) Bulk random users with shared password hash → insertMany bypasses pre-save
    const passwordHash = await getSharedHash();
    const remaining = TARGET_TOTAL - demoCreated.length;
    const randomDocs = Array.from({ length: remaining }, (_, i) => buildRandomUser(i + 1, passwordHash));

    // Chunked insertMany to keep memory reasonable
    const CHUNK = 100;
    let inserted = 0;
    for (let i = 0; i < randomDocs.length; i += CHUNK) {
      const slice = randomDocs.slice(i, i + CHUNK);
      const res = await User.insertMany(slice, { ordered: false, rawResult: false });
      inserted += res.length;
      console.log(`   …${inserted}/${remaining} random users inserted`);
    }

    const total = await User.countDocuments({ role: 'user' });
    console.log(`✅ Seeded ${total} total users (${demoCreated.length} demo + ${inserted} random)`);
    return total;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = { seedUsers };
