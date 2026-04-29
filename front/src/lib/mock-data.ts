import type { Report, Zone, TopAccount, Stats } from './ui-types'

export const MOCK_STATS: Stats = {
  total: 14823,
  today: 47,
  verified: 9201,
  activeZones: 134,
}

export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Venta de iPhones falsos en Mercado Libre por cuenta nueva',
    description:
      'Cuenta creada hace 2 semanas vendiendo iPhones 15 Pro a $180.000. Pide transferencia anticipada y nunca envía. Ya tiene 12 víctimas documentadas en el grupo de Facebook "Estafas Chile".',
    category: 'fraude_digital',
    location: 'Mercado Libre — Envío nacional',
    region: 'Región Metropolitana',
    status: 'verified',
    votes: 284,
    userVote: null,
    createdAt: '2026-04-16T10:23:00Z',
    isAnonymous: false,
    author: 'MarcosV',
  },
  {
    id: '2',
    title: 'Kia Sportage blanco visto en Lo Barnechea, posiblemente robado',
    description:
      'Vehículo patente BBDF32 circulando con vidrios oscuros no originales. El dueño original reportó el robo la semana pasada en la 47ª Comisaría.',
    category: 'vehiculo_robado',
    location: 'Lo Barnechea, Santiago',
    region: 'Región Metropolitana',
    status: 'pending',
    votes: 97,
    userVote: null,
    createdAt: '2026-04-16T08:15:00Z',
    isAnonymous: true,
  },
  {
    id: '3',
    title: 'Falso arrendador departamento Providencia — cobra adelanto y desaparece',
    description:
      'Publica departamentos reales de otros portales con precio rebajado. Cobra 2 meses de adelanto via transferencia, da llave falsa. Perfil en Yapo: "arriendos_rpv".',
    category: 'estafa',
    location: 'Providencia, Santiago',
    region: 'Región Metropolitana',
    status: 'verified',
    votes: 412,
    userVote: null,
    createdAt: '2026-04-15T20:44:00Z',
    isAnonymous: false,
    author: 'CarlaT',
  },
  {
    id: '4',
    title: 'Robo con violencia en paradero Maipú — mismo MO repetido',
    description:
      'Grupo de 3 personas en moto (2 motos Yamaha negras sin patente) asaltan a usuarios del transporte público entre 22:00 y 00:00. Van 5 reportes similares en 10 días.',
    category: 'robo',
    location: 'Av. Pajaritos con Av. Américo Vespucio, Maipú',
    region: 'Región Metropolitana',
    status: 'verified',
    votes: 631,
    userVote: null,
    createdAt: '2026-04-15T12:30:00Z',
    isAnonymous: true,
  },
  {
    id: '5',
    title: 'Instagram @modaurbana_cl cobra por ropa y no despacha',
    description:
      'Cuenta con 12k seguidores. Cobra via WebPay y transferencia. Más de 40 personas reportan no haber recibido pedidos en los últimos 3 meses.',
    category: 'fraude_digital',
    location: 'Instagram — @modaurbana_cl',
    region: 'Nacional',
    status: 'verified',
    votes: 519,
    userVote: null,
    createdAt: '2026-04-14T18:00:00Z',
    isAnonymous: false,
    author: 'PaolaBM',
  },
  {
    id: '6',
    title: 'Clonación de tarjetas en bencinera Ñuñoa',
    description:
      'Dos personas instalaron skimmer en surtidor #3. Varios usuarios reportaron cargos no reconocidos días después de cargar combustible.',
    category: 'estafa',
    location: 'Bencinera Shell, Irarrázaval 3200, Ñuñoa',
    region: 'Región Metropolitana',
    status: 'pending',
    votes: 203,
    userVote: null,
    createdAt: '2026-04-14T09:10:00Z',
    isAnonymous: true,
  },
]

export const MOCK_ZONES: Zone[] = [
  { name: 'Maipú', region: 'RM', count: 312, trend: 'up' },
  { name: 'La Florida', region: 'RM', count: 287, trend: 'up' },
  { name: 'Providencia', region: 'RM', count: 214, trend: 'stable' },
  { name: 'Valparaíso Centro', region: 'V', count: 198, trend: 'up' },
  { name: 'Concepción', region: 'VIII', count: 176, trend: 'down' },
  { name: 'San Bernardo', region: 'RM', count: 163, trend: 'stable' },
]

export const MOCK_TOP_ACCOUNTS: TopAccount[] = [
  { handle: '@modaurbana_cl', platform: 'instagram', reports: 43, category: 'fraude_digital' },
  { handle: 'arriendos_rpv', platform: 'facebook', reports: 38, category: 'estafa' },
  { handle: '@cryptochile2024', platform: 'instagram', reports: 31, category: 'fraude_digital' },
  { handle: 'VentasRapidas_CL', platform: 'whatsapp', reports: 27, category: 'estafa' },
]

export const CATEGORIES = [
  { value: 'robo', label: 'Robo', color: 'text-red-400 bg-red-400/10' },
  { value: 'estafa', label: 'Estafa', color: 'text-amber-400 bg-amber-400/10' },
  { value: 'fraude_digital', label: 'Fraude digital', color: 'text-purple-400 bg-purple-400/10' },
  { value: 'vehiculo_robado', label: 'Vehículo robado', color: 'text-blue-400 bg-blue-400/10' },
  { value: 'violencia', label: 'Violencia', color: 'text-orange-400 bg-orange-400/10' },
  { value: 'otro', label: 'Otro', color: 'text-gray-400 bg-gray-400/10' },
] as const

export const REGIONS = [
  'Región Metropolitana',
  'Valparaíso',
  'Biobío',
  'La Araucanía',
  'Los Lagos',
  'Antofagasta',
  'Coquimbo',
  'Maule',
  "O'Higgins",
  'Nacional',
]
