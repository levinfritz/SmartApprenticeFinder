export interface SwissLocation {
  postalCode: string;
  city: string;
  canton: string;
  coordinates: { lat: number; lng: number };
  region: string;
  majorCity?: boolean;
}

export const swissLocations: SwissLocation[] = [
  // Zürich Region
  { postalCode: '8001', city: 'Zürich', canton: 'ZH', coordinates: { lat: 47.3769, lng: 8.5417 }, region: 'Zürich', majorCity: true },
  { postalCode: '8002', city: 'Zürich', canton: 'ZH', coordinates: { lat: 47.3370, lng: 8.5345 }, region: 'Zürich' },
  { postalCode: '8003', city: 'Zürich', canton: 'ZH', coordinates: { lat: 47.3572, lng: 8.5084 }, region: 'Zürich' },
  { postalCode: '8004', city: 'Zürich', canton: 'ZH', coordinates: { lat: 47.3762, lng: 8.5242 }, region: 'Zürich' },
  { postalCode: '8005', city: 'Zürich', canton: 'ZH', coordinates: { lat: 47.3660, lng: 8.5206 }, region: 'Zürich' },
  { postalCode: '8400', city: 'Winterthur', canton: 'ZH', coordinates: { lat: 47.5009, lng: 8.7243 }, region: 'Zürich', majorCity: true },
  { postalCode: '8800', city: 'Thalwil', canton: 'ZH', coordinates: { lat: 47.2908, lng: 8.5635 }, region: 'Zürich' },
  { postalCode: '8600', city: 'Dübendorf', canton: 'ZH', coordinates: { lat: 47.3960, lng: 8.6186 }, region: 'Zürich' },
  { postalCode: '8610', city: 'Uster', canton: 'ZH', coordinates: { lat: 47.3468, lng: 8.7208 }, region: 'Zürich' },
  { postalCode: '8620', city: 'Wetzikon', canton: 'ZH', coordinates: { lat: 47.3275, lng: 8.7973 }, region: 'Zürich' },

  // St. Gallen Region (Ostschweiz)
  { postalCode: '9000', city: 'St. Gallen', canton: 'SG', coordinates: { lat: 47.4239, lng: 9.3767 }, region: 'Ostschweiz', majorCity: true },
  { postalCode: '9001', city: 'St. Gallen', canton: 'SG', coordinates: { lat: 47.4200, lng: 9.3700 }, region: 'Ostschweiz' },
  { postalCode: '9004', city: 'St. Gallen', canton: 'SG', coordinates: { lat: 47.4320, lng: 9.3920 }, region: 'Ostschweiz' },
  { postalCode: '9006', city: 'St. Gallen', canton: 'SG', coordinates: { lat: 47.4100, lng: 9.3600 }, region: 'Ostschweiz' },
  { postalCode: '9010', city: 'St. Gallen', canton: 'SG', coordinates: { lat: 47.4500, lng: 9.4000 }, region: 'Ostschweiz' },
  { postalCode: '9200', city: 'Gossau', canton: 'SG', coordinates: { lat: 47.4147, lng: 9.2504 }, region: 'Ostschweiz' },
  { postalCode: '9300', city: 'Wittenbach', canton: 'SG', coordinates: { lat: 47.4683, lng: 9.3494 }, region: 'Ostschweiz' },
  { postalCode: '9400', city: 'Rorschach', canton: 'SG', coordinates: { lat: 47.4779, lng: 9.4950 }, region: 'Ostschweiz' },
  { postalCode: '9500', city: 'Wil', canton: 'SG', coordinates: { lat: 47.4616, lng: 9.0450 }, region: 'Ostschweiz' },
  { postalCode: '9320', city: 'Arbon', canton: 'TG', coordinates: { lat: 47.5170, lng: 9.4336 }, region: 'Ostschweiz' },
  { postalCode: '8500', city: 'Frauenfeld', canton: 'TG', coordinates: { lat: 47.5546, lng: 8.8991 }, region: 'Ostschweiz' },

  // Basel Region
  { postalCode: '4001', city: 'Basel', canton: 'BS', coordinates: { lat: 47.5596, lng: 7.5886 }, region: 'Basel', majorCity: true },
  { postalCode: '4002', city: 'Basel', canton: 'BS', coordinates: { lat: 47.5500, lng: 7.5800 }, region: 'Basel' },
  { postalCode: '4051', city: 'Basel', canton: 'BS', coordinates: { lat: 47.5370, lng: 7.5827 }, region: 'Basel' },
  { postalCode: '4052', city: 'Basel', canton: 'BS', coordinates: { lat: 47.5419, lng: 7.6144 }, region: 'Basel' },
  { postalCode: '4103', city: 'Bottmingen', canton: 'BL', coordinates: { lat: 47.5218, lng: 7.5667 }, region: 'Basel' },
  { postalCode: '4142', city: 'Münchenstein', canton: 'BL', coordinates: { lat: 47.5175, lng: 7.6175 }, region: 'Basel' },

  // Bern Region
  { postalCode: '3000', city: 'Bern', canton: 'BE', coordinates: { lat: 46.9480, lng: 7.4474 }, region: 'Bern', majorCity: true },
  { postalCode: '3001', city: 'Bern', canton: 'BE', coordinates: { lat: 46.9500, lng: 7.4500 }, region: 'Bern' },
  { postalCode: '3008', city: 'Bern', canton: 'BE', coordinates: { lat: 46.9350, lng: 7.4050 }, region: 'Bern' },
  { postalCode: '3011', city: 'Bern', canton: 'BE', coordinates: { lat: 46.9456, lng: 7.4647 }, region: 'Bern' },
  { postalCode: '3012', city: 'Bern', canton: 'BE', coordinates: { lat: 46.9700, lng: 7.4200 }, region: 'Bern' },
  { postalCode: '3600', city: 'Thun', canton: 'BE', coordinates: { lat: 46.7578, lng: 7.6281 }, region: 'Bern' },
  { postalCode: '2500', city: 'Biel/Bienne', canton: 'BE', coordinates: { lat: 47.1368, lng: 7.2463 }, region: 'Bern' },

  // Luzern Region (Zentralschweiz)
  { postalCode: '6000', city: 'Luzern', canton: 'LU', coordinates: { lat: 47.0502, lng: 8.3093 }, region: 'Zentralschweiz', majorCity: true },
  { postalCode: '6003', city: 'Luzern', canton: 'LU', coordinates: { lat: 47.0400, lng: 8.3000 }, region: 'Zentralschweiz' },
  { postalCode: '6004', city: 'Luzern', canton: 'LU', coordinates: { lat: 47.0600, lng: 8.3200 }, region: 'Zentralschweiz' },
  { postalCode: '6010', city: 'Kriens', canton: 'LU', coordinates: { lat: 47.0356, lng: 8.2783 }, region: 'Zentralschweiz' },
  { postalCode: '6020', city: 'Emmenbrücke', canton: 'LU', coordinates: { lat: 47.0808, lng: 8.2658 }, region: 'Zentralschweiz' },
  { postalCode: '6300', city: 'Zug', canton: 'ZG', coordinates: { lat: 47.1663, lng: 8.5155 }, region: 'Zentralschweiz' },
  { postalCode: '6460', city: 'Altdorf', canton: 'UR', coordinates: { lat: 46.8804, lng: 8.6440 }, region: 'Zentralschweiz' },

  // Aargau Region
  { postalCode: '5000', city: 'Aarau', canton: 'AG', coordinates: { lat: 47.3911, lng: 8.0428 }, region: 'Aargau', majorCity: true },
  { postalCode: '5001', city: 'Aarau', canton: 'AG', coordinates: { lat: 47.3900, lng: 8.0400 }, region: 'Aargau' },
  { postalCode: '5400', city: 'Baden', canton: 'AG', coordinates: { lat: 47.4763, lng: 8.3066 }, region: 'Aargau' },
  { postalCode: '5600', city: 'Lenzburg', canton: 'AG', coordinates: { lat: 47.3889, lng: 8.1764 }, region: 'Aargau' },
  { postalCode: '8200', city: 'Schaffhausen', canton: 'SH', coordinates: { lat: 47.6979, lng: 8.6309 }, region: 'Aargau' },

  // Genf Region (Romandie)
  { postalCode: '1200', city: 'Genève', canton: 'GE', coordinates: { lat: 46.2044, lng: 6.1432 }, region: 'Romandie', majorCity: true },
  { postalCode: '1201', city: 'Genève', canton: 'GE', coordinates: { lat: 46.2100, lng: 6.1500 }, region: 'Romandie' },
  { postalCode: '1202', city: 'Genève', canton: 'GE', coordinates: { lat: 46.2000, lng: 6.1300 }, region: 'Romandie' },
  { postalCode: '1204', city: 'Genève', canton: 'GE', coordinates: { lat: 46.1900, lng: 6.1600 }, region: 'Romandie' },
  { postalCode: '1205', city: 'Genève', canton: 'GE', coordinates: { lat: 46.1950, lng: 6.1250 }, region: 'Romandie' },

  // Lausanne Region (Romandie)
  { postalCode: '1000', city: 'Lausanne', canton: 'VD', coordinates: { lat: 46.5197, lng: 6.6323 }, region: 'Romandie', majorCity: true },
  { postalCode: '1001', city: 'Lausanne', canton: 'VD', coordinates: { lat: 46.5200, lng: 6.6300 }, region: 'Romandie' },
  { postalCode: '1003', city: 'Lausanne', canton: 'VD', coordinates: { lat: 46.5150, lng: 6.6400 }, region: 'Romandie' },
  { postalCode: '1004', city: 'Lausanne', canton: 'VD', coordinates: { lat: 46.5300, lng: 6.6200 }, region: 'Romandie' },
  { postalCode: '1800', city: 'Vevey', canton: 'VD', coordinates: { lat: 46.4609, lng: 6.8429 }, region: 'Romandie' },
  { postalCode: '1820', city: 'Montreux', canton: 'VD', coordinates: { lat: 46.4312, lng: 6.9106 }, region: 'Romandie' },

  // Tessin
  { postalCode: '6900', city: 'Lugano', canton: 'TI', coordinates: { lat: 46.0037, lng: 8.9511 }, region: 'Tessin', majorCity: true },
  { postalCode: '6901', city: 'Lugano', canton: 'TI', coordinates: { lat: 46.0000, lng: 8.9500 }, region: 'Tessin' },
  { postalCode: '6500', city: 'Bellinzona', canton: 'TI', coordinates: { lat: 46.1944, lng: 9.0175 }, region: 'Tessin' },
  { postalCode: '6600', city: 'Locarno', canton: 'TI', coordinates: { lat: 46.1712, lng: 8.7977 }, region: 'Tessin' },

  // Graubünden
  { postalCode: '7000', city: 'Chur', canton: 'GR', coordinates: { lat: 46.8529, lng: 9.5302 }, region: 'Graubünden', majorCity: true },
  { postalCode: '7270', city: 'Davos Platz', canton: 'GR', coordinates: { lat: 46.7939, lng: 9.8240 }, region: 'Graubünden' },
  { postalCode: '7500', city: 'St. Moritz', canton: 'GR', coordinates: { lat: 46.4908, lng: 9.8355 }, region: 'Graubünden' },

  // Weitere wichtige Orte
  { postalCode: '1950', city: 'Sion', canton: 'VS', coordinates: { lat: 46.2276, lng: 7.3586 }, region: 'Wallis' },
  { postalCode: '2000', city: 'Neuchâtel', canton: 'NE', coordinates: { lat: 46.9929, lng: 6.9309 }, region: 'Romandie' },
  { postalCode: '2800', city: 'Delémont', canton: 'JU', coordinates: { lat: 47.3647, lng: 7.3436 }, region: 'Romandie' }
];

// Hilfsfunktionen für Standort-Operationen
export const findLocationByPostalCode = (postalCode: string): SwissLocation | undefined => {
  return swissLocations.find(loc => loc.postalCode === postalCode);
};

export const findLocationsByCity = (city: string): SwissLocation[] => {
  const normalizedCity = city.toLowerCase().trim();
  return swissLocations.filter(loc => 
    loc.city.toLowerCase().includes(normalizedCity)
  );
};

export const searchLocations = (query: string): SwissLocation[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) return [];
  
  const results = swissLocations.filter(loc => 
    loc.city.toLowerCase().includes(normalizedQuery) ||
    loc.postalCode.includes(normalizedQuery) ||
    loc.canton.toLowerCase().includes(normalizedQuery)
  );
  
  // Sortiere Ergebnisse: Exakte Matches zuerst, dann nach Wichtigkeit
  return results.sort((a, b) => {
    const aExact = a.city.toLowerCase() === normalizedQuery || a.postalCode === normalizedQuery;
    const bExact = b.city.toLowerCase() === normalizedQuery || b.postalCode === normalizedQuery;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Dann nach Major Cities
    if (a.majorCity && !b.majorCity) return -1;
    if (!a.majorCity && b.majorCity) return 1;
    
    return 0;
  });
};

// Entfernungsberechnung zwischen zwei Koordinaten (Haversine Formel)
export const calculateDistance = (
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number => {
  const R = 6371; // Erdradius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;

  return Math.round(distance);
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI/180);
};

export const getRegionScore = (userLocation: SwissLocation, jobLocation: SwissLocation): number => {
  const distance = calculateDistance(userLocation.coordinates, jobLocation.coordinates);
  
  // Bonuspunkte für gleiche Region
  if (userLocation.region === jobLocation.region) {
    if (distance < 25) return 95;
    if (distance < 50) return 85;
    if (distance < 75) return 75;
    return 65;
  }
  
  // Unterschiedliche Regionen
  if (distance < 100) return 60;
  if (distance < 150) return 45;
  if (distance < 200) return 30;
  return 15;
};