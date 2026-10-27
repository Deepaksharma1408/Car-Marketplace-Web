import { Listing } from '@/types';

export const LIFESTYLES = [
  { id: 'weekend', title: 'Weekend Supercars', subtitle: 'Make every escape extraordinary', image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&auto=format&fit=crop' },
  { id: 'everyday', title: 'Everyday Luxury', subtitle: 'An exceptional everyday drive', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop' },
  { id: 'family', title: 'Family SUVs', subtitle: 'More room. No compromises.', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop' },
  { id: 'electric', title: 'Electric Performance', subtitle: 'A different kind of exhilaration', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop' },
] as const;
export const SHOWROOM_AREAS = [
  { id: 'downtown', name: 'Downtown Dubai', description: 'Flagship cars in the heart of the city', x: 64, y: 30 },
  { id: 'marina', name: 'Dubai Marina', description: 'Coastal luxury and weekend favourites', x: 24, y: 76 },
  { id: 'difc', name: 'DIFC', description: 'Executive elegance, exceptional collections', x: 76, y: 14 },
  { id: 'al-quoz', name: 'Al Quoz', description: 'Specialist showrooms and performance cars', x: 46, y: 54 },
] as const;
export function matchesLifestyle(car: Listing, lifestyle: string) {
  const body = car.bodyType.toLowerCase();
  if (lifestyle === 'weekend') return /supercar|hypercar|coupe|convertible|spider/.test(body);
  if (lifestyle === 'everyday') return /sedan|wagon|grand tourer/.test(body) || /rolls-royce|bentley|mercedes-benz|range rover|lexus/i.test(car.make);
  if (lifestyle === 'family') return /suv/.test(body);
  if (lifestyle === 'electric') return /electric|\bev\b/i.test(car.fuelType);
  return true;
}
export interface DiscoveryFilters { lifestyle?: string; budget?: string; body?: string; drive?: string; area?: string }
export function matchesDiscovery(car: Listing, filters: DiscoveryFilters) {
  if (!matchesLifestyle(car, filters.lifestyle || '')) return false;
  const budget = Number(filters.budget);
  if (budget > 0 && car.price > budget) return false;
  if (filters.body && filters.body !== 'any' && !car.bodyType.toLowerCase().includes(filters.body)) return false;
  if (filters.drive === 'performance' && !matchesLifestyle(car, 'weekend') && !matchesLifestyle(car, 'electric')) return false;
  if (filters.drive === 'comfort' && !matchesLifestyle(car, 'everyday') && !/suv/i.test(car.bodyType)) return false;
  if (filters.drive === 'electric' && !matchesLifestyle(car, 'electric')) return false;
  if (filters.area) {
    const area = SHOWROOM_AREAS.find((item) => item.id === filters.area);
    const name = area?.name || filters.area;
    if (!car.dubaiArea.toLowerCase().includes(name.toLowerCase())) return false;
  }
  return true;
}
