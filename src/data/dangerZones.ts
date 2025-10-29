export interface DangerZone {
  position: [number, number];
  name: string;
  risk: 'high' | 'medium' | 'low';
  radius: number;
  description: string;
}

export const dangerZones: DangerZone[] = [
  {
    position: [12.9767, 77.5710],
    name: 'Majestic Bus Stand',
    risk: 'high',
    radius: 600,
    description: 'Crowded transport hub - High pickpocketing, chaotic traffic, avoid at night'
  },
  {
    position: [12.9698, 77.5802],
    name: 'City Market (KR Market)',
    risk: 'high',
    radius: 500,
    description: 'Extremely crowded wholesale market - Pickpocketing, narrow lanes, poor sanitation'
  },
  {
    position: [12.9716, 77.5946],
    name: 'MG Road',
    risk: 'medium',
    radius: 400,
    description: 'Busy commercial area - Pickpocketing in crowds, safe during day'
  },
  {
    position: [12.9850, 77.6020],
    name: 'Shivajinagar',
    risk: 'high',
    radius: 500,
    description: 'Congested market area - Traffic chaos, pickpocketing, unsafe after dark'
  },
  {
    position: [12.9716, 77.5650],
    name: 'Kalasipalyam',
    risk: 'high',
    radius: 500,
    description: 'Wholesale market zone - High petty crime, poor infrastructure, avoid after sunset'
  },
  {
    position: [13.0358, 77.5970],
    name: 'Hebbal',
    risk: 'medium',
    radius: 450,
    description: 'Industrial area - Traffic congestion, moderate crime rate'
  },
  {
    position: [12.9141, 77.6411],
    name: 'BTM Layout',
    risk: 'low',
    radius: 400,
    description: 'Residential area - Generally safe, minor incidents reported'
  },
  {
    position: [13.0282, 77.6387],
    name: 'KR Puram',
    risk: 'medium',
    radius: 500,
    description: 'Mixed residential-commercial - Moderate safety concerns, busy traffic'
  }
];
