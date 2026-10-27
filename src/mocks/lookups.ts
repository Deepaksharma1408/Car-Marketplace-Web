export interface MakeModelMap {
  [make: string]: string[];
}

export const DUBAI_MAKES_MODELS: MakeModelMap = {
  'Porsche': ['911 GT3 RS', '911 Turbo S', 'Taycan Turbo GT', 'Cayenne GTS', 'Panamera 4S', '718 Cayman GT4 RS'],
  'Ferrari': ['SF90 Stradale', '296 GTB', '812 Competizione', 'Roma Spider', 'F8 Tributo', 'Purosangue'],
  'Lamborghini': ['Revuelto', 'Urus Performante', 'Huracán Sterrato', 'Huracán Tecnica', 'Aventador SVJ'],
  'Rolls-Royce': ['Ghost Black Badge', 'Cullinan Series II', 'Spectre Electric', 'Phantom Extended', 'Dawn Onyx'],
  'Mercedes-Benz': ['G63 AMG 4x4²', 'G63 AMG Mansory', 'AMG GT Black Series', 'S580 Maybach', 'SL63 AMG', 'C63 AMG'],
  'Bentley': ['Continental GT Speed', 'Flying Spur Mulliner', 'Bentayga EWB', 'Bacalar Signature'],
  'Range Rover': ['SV Autobiography LWB', 'Sport SV Edition One', 'Velar Dynamic HSE', 'Defender 110 V8 Carpathian'],
  'McLaren': ['750S Spider', 'Artura Hybrid', '765LT', 'GT Luxe'],
  'Aston Martin': ['DBS 770 Ultimate', 'DB12 Coupe', 'Vantage F1 Edition', 'DBX707 Luxury SUV'],
  'BMW': ['M4 Competition xDrive', 'M8 Gran Coupe', 'XM Label Red', 'M3 Touring', 'i7 M70 xDrive'],
  'Audi': ['RS6 Avant Performance', 'RSQ8 Carbon Black', 'R8 V10 Performance', 'e-tron GT RS'],
  'Tesla': ['Model S Plaid', 'Cybertruck Cyberbeast', 'Model X Plaid'],
};

export const DUBAI_AREAS = [
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'DIFC',
  'Palm Jumeirah',
  'Al Quoz Industrial (Auto Vaults)',
  'Jumeirah Beach Residence (JBR)',
  'Jumeirah 1',
  'Emirates Hills',
  'Arabian Ranches',
  'Al Barsha',
  'Deira Clock Tower',
  'City Walk',
  'Dubai Hills Estate',
  'Meydan Horizon',
];

export const BODY_TYPES = [
  'Coupe',
  'Supercar / Hypercar',
  'Luxury SUV',
  'Sedan',
  'Convertible / Cabriolet',
  'Grand Tourer',
  'Wagon / Avant',
];

export const FUEL_TYPES = [
  'Petrol',
  'Hybrid (PHEV)',
  'Electric (EV)',
  'Mild Hybrid (MHEV)',
];

export const TRANSMISSIONS = [
  'Automatic (Dual-Clutch PDK/DCT)',
  'Automatic (Torque Converter)',
  'Manual 6-Speed',
  'Direct-Drive EV',
];

export const CONDITIONS: Array<'Brand New' | 'Like New' | 'Excellent' | 'Good'> = [
  'Brand New',
  'Like New',
  'Excellent',
  'Good',
];
