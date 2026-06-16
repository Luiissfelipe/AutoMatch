import 'dotenv/config';
import bcrypt from 'bcrypt';
import driver from './database/neo4j.js';

const imagensPorModelo = {
  'Jeep Compass':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260605/jeepcompass2016vdiesellimited4x4automatico-WMIMAGEM15192443883.jpg',
  'Jeep Renegade':        'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202512/20251223/JEEP-RENEGADE-1.3-T270-TURBO-FLEX-LONGITUDE-AT6-wmimagem01292101913.jpg',
  'Jeep Commander':       'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260605/jeep-commander-1.3-t270-turbo-flex-limited-at6-wmimagem21352303679.jpg',
  'Toyota Hilux':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260603/toyotahilux27vvtiflexcdsrv4x4automatico-WMIMAGEM22113899498.jpg',
  'Toyota Corolla':       'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202605/20260528/toyota-corolla-2.0-vvtie-flex-xei-direct-shift-wmimagem09015597597.jpg',
  'Toyota SW4':           'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/toyota-hilux-sw4-2-8-srx-diamond-4x4-7-lugares-16v-turbo-intercooler-diesel-4p-automatico-wmimagem15493911431.webp',
  'Toyota Yaris':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/toyota-yaris-1.5-16v-flex-xl-multidrive-wmimagem10411837260.jpg',
  'Honda Civic':          'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202605/20260515/honda-civic-2.0-16v-flexone-exl-4p-cvt-wmimagem11304543167.jpg',
  'Honda HR-V':           'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202605/20260529/honda-hrv-1.8-16v-flex-ex-4p-automatico-wmimagem21140348237.jpg://commons.wikimedia.org/wiki/Special:FilePath/2023_Honda_HR-V_Advance_i-MMD_CVT_1.5.jpg?width=640',
  'Honda City':           'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260602/hondacity15ivtecflexexlcvt-WMIMAGEM2239235953.jpg',
  'VW Polo':              'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260605/volkswagenpolo10200tsihighlineautomatico-WMIMAGEM09213542737.jpg',
  'VW Jetta':             'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260609/volkswagen-jetta-2-0-350-tsi-gasolina-gli-dsg-wmimagem12485219531.webp',
  'VW Nivus':             'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/volkswagen-nivus-1.0-200-tsi-total-flex-highline-automatico-wmimagem09563274696.jpg',
  'VW Amarok':            'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260601/volkswagen-amarok-3-0-v6-tdi-diesel-highline-cd-4motion-automatico-wmimagem13533772224.webp',
  'VW T-Cross':           'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/volkswagen-tcross-1.4-250-tsi-total-flex-highline-automatico-wmimagem18111045273.jpg',
  'BYD Dolphin':          'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202605/20260517/byd-dolphin-451-kw-eletrico-se-wmimagem16153817629.webp',
  'BYD Seal':             'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260606/byd-seal-825-kw-eletrico-awd-wmimagem11283574233.jpg',
  'BYD Han':              'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260601/byd-han-eletrico-awd-wmimagem14533645096.jpg',
  'Fiat Toro':            'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/fiat-toro-2.0-16v-turbo-diesel-ranch-4wd-at9-wmimagem08234080957.jpg',
  'Fiat Mobi':            'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/fiat-mobi-1.0-evo-flex-like.-manual-wmimagem17243116823.jpg',
  'Fiat Strada':          'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/fiat-strada-1.3-firefly-flex-freedom-cd-manual-wmimagem10491966577.jpg',
  'Fiat Pulse':           'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260611/fiat-pulse-1.0-turbo-200-hybrid-impetus-cvt-wmimagem17151415150.jpg',
  'Fiat Cronos':          'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/fiat-cronos-1.0-firefly-flex-drive-manual-wmimagem02392469795.jpg',
  'Chevrolet Tracker':    'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202512/20251223/CHEVROLET-TRACKER-1.0-TURBO-FLEX-LT-AUTOMATICO-wmimagem01573261253.jpg',
  'Chevrolet Onix':       'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/chevrolet-onix-1.0-flex-lt-manual-wmimagem01485839625.jpg',
  'Chevrolet S10':        'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260610/chevrolet-s10-2.5-16v-flex-ltz-cd-4x4-automatico-wmimagem15504011360.jpg',
  'Chevrolet Equinox':    'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/chevrolet-equinox-1.5-16v-turbo-gasolina-premier-awd-automatico-wmimagem04081348857.jpg',
  'Ford Ranger':          'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260603/ford-ranger-3.0-v6-turbo-diesel-cd-limited-4x4-automatico-wmimagem15580946573.jpg',
  'Ford Mustang':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202512/20251202/ford-mustang-5-0-v8-gasolina-dark-horse-selectshift-wmimagem04025955323.webp',
  'Renault Kwid':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/renault-kwid-1.0-12v-sce-flex-zen-manual-wmimagem00583013975.jpg',
  'Renault Sandero':      'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260604/renaultsandero16stepway8vflex4pmanual-WMIMAGEM18370757352.jpg',
  'Hyundai Creta':        'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260610/hyundai-creta-1.0-tgdi-flex-platinum-automatico-wmimagem12530172764.jpg',
  'Hyundai HB20':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/hyundai-hb20-1.0-12v-flex-limited-plus-manual-wmimagem05592103737.jpg',
  'KIA Sportage':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260602/kiasportage20ex4x216vflex4pautomatico-WMIMAGEM21445192811.jpg',
  'KIA EV6':              'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Kia_EV6_GT-Line_S.jpg?width=640',
  'Nissan Kicks':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260604/nissankicks1616vflexstarts4pxtronic-WMIMAGEM19055392191.jpg',
  'Mitsubishi Outlander': 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202605/20260518/mitsubishioutlander224x416vdiesel4pautomatico-WMIMAGEM12021138669.jpg',
  'Mercedes GLA':         'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260605/mercedesbenzgla20016cgiflexadvance7gdct-WMIMAGEM18233654689.jpg',
  'BMW X1':               'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260602/bmw-x1-2.0-16v-turbo-activeflex-sdrive20i-xline-4p-automatico-wmimagem09131796817.jpg',
  'Audi A3':              'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260611/audi-a3-1.4-tfsi-flex-sedan-prestige-plus-tiptronic-wmimagem11293605757.jpg',
};

async function popularBanco() {
  const session = driver.session();
  const dataAtual = new Date().toISOString();

  try {
    console.log('⏳ Iniciando Seed — Carga Massiva de Interações...');

    // ── 1. LIMPEZA ──────────────────────────────────────────────
    console.log('🧹 Limpando a base de dados...');
    await session.run('MATCH (n) DETACH DELETE n');

    // ── 2. TAGS (50) ────────────────────────────────────────────
    console.log('🏷️  Criando 50 Tags...');
    const tagsData = [
      { id: 'SUV',         categoria: 'CARROCERIA' }, { id: 'SEDAN',       categoria: 'CARROCERIA' },
      { id: 'HATCH',       categoria: 'CARROCERIA' }, { id: 'PICKUP',      categoria: 'CARROCERIA' },
      { id: 'COUPE',       categoria: 'CARROCERIA' }, { id: 'MINIVAN',     categoria: 'CARROCERIA' },
      { id: 'CONVERSIVEL', categoria: 'CARROCERIA' },
      { id: 'AUTOMATICO',  categoria: 'CAMBIO' },     { id: 'MANUAL',      categoria: 'CAMBIO' },
      { id: 'CVT',         categoria: 'CAMBIO' },
      { id: 'FLEX',        categoria: 'COMBUSTIVEL' },{ id: 'ELETRICO',    categoria: 'COMBUSTIVEL' },
      { id: 'DIESEL',      categoria: 'COMBUSTIVEL' },{ id: 'HIBRIDO',     categoria: 'COMBUSTIVEL' },
      { id: 'GASOLINA',    categoria: 'COMBUSTIVEL' },{ id: 'GNV',         categoria: 'COMBUSTIVEL' },
      { id: 'HONDA',       categoria: 'MARCA' },      { id: 'TOYOTA',      categoria: 'MARCA' },
      { id: 'JEEP',        categoria: 'MARCA' },      { id: 'FIAT',        categoria: 'MARCA' },
      { id: 'VW',          categoria: 'MARCA' },      { id: 'CHEVROLET',   categoria: 'MARCA' },
      { id: 'BYD',         categoria: 'MARCA' },      { id: 'FORD',        categoria: 'MARCA' },
      { id: 'RENAULT',     categoria: 'MARCA' },      { id: 'HYUNDAI',     categoria: 'MARCA' },
      { id: 'KIA',         categoria: 'MARCA' },      { id: 'NISSAN',      categoria: 'MARCA' },
      { id: 'MITSUBISHI',  categoria: 'MARCA' },      { id: 'MERCEDES',    categoria: 'MARCA' },
      { id: 'BMW',         categoria: 'MARCA' },      { id: 'AUDI',        categoria: 'MARCA' },
      { id: 'BRANCO',      categoria: 'COR' },        { id: 'PRETO',       categoria: 'COR' },
      { id: 'PRATA',       categoria: 'COR' },        { id: 'VERMELHO',    categoria: 'COR' },
      { id: 'AZUL',        categoria: 'COR' },        { id: 'CINZA',       categoria: 'COR' },
      { id: 'VERDE',       categoria: 'COR' },        { id: 'DOURADO',     categoria: 'COR' },
      { id: 'TETO_SOLAR',          categoria: 'ACESSORIO' }, { id: 'BANCO_COURO',         categoria: 'ACESSORIO' },
      { id: '4X4',                 categoria: 'ACESSORIO' }, { id: 'CENTRAL_MULTIMIDIA',  categoria: 'ACESSORIO' },
      { id: 'CAMERA_RE',           categoria: 'ACESSORIO' }, { id: 'FAROL_LED',           categoria: 'ACESSORIO' },
      { id: 'PILOTO_AUTOMATICO',   categoria: 'ACESSORIO' },
      { id: 'NOVO',      categoria: 'ESTADO' },       { id: 'SEMINOVO',  categoria: 'ESTADO' },
      { id: 'USADO',     categoria: 'ESTADO' },
    ];
    await session.run(
      'UNWIND $tags AS tag CREATE (:Tag {id: tag.id, categoria: tag.categoria})',
      { tags: tagsData }
    );

    // ── 3. USUÁRIOS ──────────────────────────────────────────────
    console.log('👥 Criando 3 Vendedores e 10 Compradores...');
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash('senha123', salt);

    const usuariosData = [
      { nome: 'AutoPremium',   email: 'vendedor1@teste.com',     role: 'VENDEDOR'   },
      { nome: 'Centro Autos',  email: 'vendedor2@teste.com',     role: 'VENDEDOR'   },
      { nome: 'EcoMotors',     email: 'vendedor3@teste.com',     role: 'VENDEDOR'   },
      { nome: 'Pedro OffRoad', email: 'pedro_offroad@teste.com', role: 'COMPRADOR'  },
      { nome: 'Maria Urbana',  email: 'maria_urbana@teste.com',  role: 'COMPRADOR'  },
      { nome: 'Lucas Eco',     email: 'lucas_eco@teste.com',     role: 'COMPRADOR'  },
      { nome: 'Ana Luxo',      email: 'ana_luxo@teste.com',      role: 'COMPRADOR'  },
      { nome: 'João Família',  email: 'joao_familia@teste.com',  role: 'COMPRADOR'  },
      { nome: 'Carlos Agro',   email: 'carlos_agro@teste.com',   role: 'COMPRADOR'  },
      { nome: 'Fernanda',      email: 'fernanda@teste.com',      role: 'COMPRADOR'  },
      { nome: 'Tiago Esporte', email: 'tiago_esporte@teste.com', role: 'COMPRADOR'  },
      { nome: 'Paula Popular', email: 'paula_pop@teste.com',     role: 'COMPRADOR'  },
      { nome: 'Bruno Sedan',   email: 'bruno_sedan@teste.com',   role: 'COMPRADOR'  },
    ];

    for (const u of usuariosData) {
      const roles = u.role === 'VENDEDOR' ? ['COMPRADOR', 'VENDEDOR'] : ['COMPRADOR'];

      await session.run(
        `CREATE (:Usuario {
           id: randomUUID(), nome: $nome, email: $email,
           senha: $senha, roles: $roles, precisaOnboarding: false
         })`,
        { ...u, senha: senhaHash, roles }
      );
    }

    // ── 4. MODELOS BASE (40 × 3 = 120 carros) ───────────────────
    console.log('🚗 Fabricando 120 Anúncios...');

    const modelosBase = [
      { modelo: 'Jeep Compass',    carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'JEEP',      'BANCO_COURO',        'CENTRAL_MULTIMIDIA'], precoBase: 210000 },
      { modelo: 'Jeep Renegade',   carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'MANUAL',     'FLEX',    'JEEP',      'PRATA',              'CAMERA_RE'],          precoBase: 160000 },
      { modelo: 'Jeep Commander',  carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'JEEP',      'PRETO',              'TETO_SOLAR'],         precoBase: 260000 },
      { modelo: 'Toyota Hilux',    carroceria: 'PICKUP', combustivel: 'DIESEL',   tags: ['PICKUP', 'AUTOMATICO', 'DIESEL',  'TOYOTA',    '4X4',                'BANCO_COURO'],        precoBase: 320000 },
      { modelo: 'Toyota Corolla',  carroceria: 'SEDAN',  combustivel: 'HIBRIDO',  tags: ['SEDAN',  'AUTOMATICO', 'HIBRIDO', 'TOYOTA',    'BANCO_COURO',        'PILOTO_AUTOMATICO'],  precoBase: 190000 },
      { modelo: 'Toyota SW4',      carroceria: 'SUV',    combustivel: 'DIESEL',   tags: ['SUV',    'AUTOMATICO', 'DIESEL',  'TOYOTA',    '4X4',                'PRATA'],              precoBase: 380000 },
      { modelo: 'Toyota Yaris',    carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'CVT',        'FLEX',    'TOYOTA',    'BRANCO',             'FAROL_LED'],          precoBase: 110000 },
      { modelo: 'Honda Civic',     carroceria: 'SEDAN',  combustivel: 'FLEX',     tags: ['SEDAN',  'AUTOMATICO', 'FLEX',    'HONDA',     'BANCO_COURO',        'FAROL_LED'],          precoBase: 175000 },
      { modelo: 'Honda HR-V',      carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'HONDA',     'BANCO_COURO',        'CAMERA_RE'],          precoBase: 155000 },
      { modelo: 'Honda City',      carroceria: 'SEDAN',  combustivel: 'FLEX',     tags: ['SEDAN',  'CVT',        'FLEX',    'HONDA',     'PRATA',              'CAMERA_RE'],          precoBase: 120000 },
      { modelo: 'VW Polo',         carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'MANUAL',     'FLEX',    'VW',        'PRATA',              'CENTRAL_MULTIMIDIA'], precoBase: 95000  },
      { modelo: 'VW Jetta',        carroceria: 'SEDAN',  combustivel: 'GASOLINA', tags: ['SEDAN',  'AUTOMATICO', 'GASOLINA','VW',        'TETO_SOLAR',         'BANCO_COURO'],        precoBase: 170000 },
      { modelo: 'VW Nivus',        carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'VW',        'VERMELHO',           'CAMERA_RE'],          precoBase: 130000 },
      { modelo: 'VW Amarok',       carroceria: 'PICKUP', combustivel: 'DIESEL',   tags: ['PICKUP', 'AUTOMATICO', 'DIESEL',  'VW',        'PRETO',              '4X4'],                precoBase: 310000 },
      { modelo: 'VW T-Cross',      carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'VW',        'VERMELHO',           'FAROL_LED'],          precoBase: 120000 },
      { modelo: 'BYD Dolphin',     carroceria: 'HATCH',  combustivel: 'ELETRICO', tags: ['HATCH',  'AUTOMATICO', 'ELETRICO','BYD',       'BRANCO',             'CENTRAL_MULTIMIDIA'], precoBase: 145000 },
      { modelo: 'BYD Seal',        carroceria: 'SEDAN',  combustivel: 'ELETRICO', tags: ['SEDAN',  'AUTOMATICO', 'ELETRICO','BYD',       'TETO_SOLAR',         'BANCO_COURO'],        precoBase: 230000 },
      { modelo: 'BYD Han',         carroceria: 'SEDAN',  combustivel: 'ELETRICO', tags: ['SEDAN',  'AUTOMATICO', 'ELETRICO','BYD',       'PRETO',              'PILOTO_AUTOMATICO'],  precoBase: 280000 },
      { modelo: 'Fiat Toro',       carroceria: 'PICKUP', combustivel: 'FLEX',     tags: ['PICKUP', 'AUTOMATICO', 'FLEX',    'FIAT',      'PRETO',              'CAMERA_RE'],          precoBase: 145000 },
      { modelo: 'Fiat Mobi',       carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'MANUAL',     'FLEX',    'FIAT',      'BRANCO',             'CENTRAL_MULTIMIDIA'], precoBase: 68000  },
      { modelo: 'Fiat Strada',     carroceria: 'PICKUP', combustivel: 'FLEX',     tags: ['PICKUP', 'MANUAL',     'FLEX',    'FIAT',      'BRANCO',             'CAMERA_RE'],          precoBase: 100000 },
      { modelo: 'Fiat Pulse',      carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'FIAT',      'VERMELHO',           'CENTRAL_MULTIMIDIA'], precoBase: 115000 },
      { modelo: 'Fiat Cronos',     carroceria: 'SEDAN',  combustivel: 'FLEX',     tags: ['SEDAN',  'MANUAL',     'FLEX',    'FIAT',      'BRANCO',             'CENTRAL_MULTIMIDIA'], precoBase: 82000  },
      { modelo: 'Chevrolet Tracker',  carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'CHEVROLET', 'BRANCO',            'FAROL_LED'],          precoBase: 130000 },
      { modelo: 'Chevrolet Onix',     carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'AUTOMATICO', 'FLEX',    'CHEVROLET', 'PRETO',             'CAMERA_RE'],          precoBase: 90000  },
      { modelo: 'Chevrolet S10',      carroceria: 'PICKUP', combustivel: 'DIESEL',   tags: ['PICKUP', 'MANUAL',     'DIESEL',  'CHEVROLET', '4X4',              'BANCO_COURO'],        precoBase: 270000 },
      { modelo: 'Chevrolet Equinox',  carroceria: 'SUV',    combustivel: 'ELETRICO', tags: ['SUV',    'AUTOMATICO', 'ELETRICO','CHEVROLET', 'BRANCO',           'PILOTO_AUTOMATICO'],  precoBase: 260000 },
      { modelo: 'Ford Ranger',     carroceria: 'PICKUP', combustivel: 'DIESEL',   tags: ['PICKUP', 'AUTOMATICO', 'DIESEL',  'FORD',      '4X4',                'BANCO_COURO'],        precoBase: 300000 },
      { modelo: 'Ford Mustang',    carroceria: 'COUPE',  combustivel: 'GASOLINA', tags: ['COUPE',  'AUTOMATICO', 'GASOLINA','FORD',      'BANCO_COURO',        'FAROL_LED'],          precoBase: 480000 },
      { modelo: 'Renault Kwid',    carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'MANUAL',     'FLEX',    'RENAULT',   'VERMELHO',           'CENTRAL_MULTIMIDIA'], precoBase: 72000  },
      { modelo: 'Renault Sandero', carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'MANUAL',     'FLEX',    'RENAULT',   'AZUL',               'CAMERA_RE'],          precoBase: 90000  },
      { modelo: 'Hyundai Creta',   carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'HYUNDAI',   'CINZA',              'TETO_SOLAR'],         precoBase: 140000 },
      { modelo: 'Hyundai HB20',    carroceria: 'HATCH',  combustivel: 'FLEX',     tags: ['HATCH',  'MANUAL',     'FLEX',    'HYUNDAI',   'VERMELHO',           'CENTRAL_MULTIMIDIA'], precoBase: 85000  },
      { modelo: 'KIA Sportage',    carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'AUTOMATICO', 'FLEX',    'KIA',       'PRATA',              'BANCO_COURO'],        precoBase: 155000 },
      { modelo: 'KIA EV6',         carroceria: 'SEDAN',  combustivel: 'ELETRICO', tags: ['SEDAN',  'AUTOMATICO', 'ELETRICO','KIA',       'CINZA',              'PILOTO_AUTOMATICO'],  precoBase: 290000 },
      { modelo: 'Nissan Kicks',    carroceria: 'SUV',    combustivel: 'FLEX',     tags: ['SUV',    'CVT',        'FLEX',    'NISSAN',    'BRANCO',             'CENTRAL_MULTIMIDIA'], precoBase: 130000 },
      { modelo: 'Mitsubishi Outlander', carroceria: 'SUV', combustivel: 'HIBRIDO', tags: ['SUV',   'AUTOMATICO', 'HIBRIDO', 'MITSUBISHI','PRETO',             'TETO_SOLAR'],         precoBase: 250000 },
      { modelo: 'Mercedes GLA',    carroceria: 'SUV',    combustivel: 'GASOLINA', tags: ['SUV',    'AUTOMATICO', 'GASOLINA','MERCEDES',  'PRETO',              'BANCO_COURO'],        precoBase: 380000 },
      { modelo: 'BMW X1',          carroceria: 'SUV',    combustivel: 'GASOLINA', tags: ['SUV',    'AUTOMATICO', 'GASOLINA','BMW',       'BRANCO',             'TETO_SOLAR'],         precoBase: 390000 },
      { modelo: 'Audi A3',         carroceria: 'SEDAN',  combustivel: 'GASOLINA', tags: ['SEDAN',  'AUTOMATICO', 'GASOLINA','AUDI',      'PRATA',              'BANCO_COURO'],        precoBase: 280000 },
    ];

    const vendedoresEmail = ['vendedor1@teste.com', 'vendedor2@teste.com', 'vendedor3@teste.com'];

    const instancias = [
      { estadoTag: 'NOVO',     ano: 2024, mult: 1.00, vendedorIdx: 0 },
      { estadoTag: 'SEMINOVO', ano: 2022, mult: 0.82, vendedorIdx: 1 },
      { estadoTag: 'USADO',    ano: 2019, mult: 0.62, vendedorIdx: 2 },
    ];

    const frotaFinal = [];
    modelosBase.forEach((base) => {
      instancias.forEach(({ estadoTag, ano, mult, vendedorIdx }) => {
        frotaFinal.push({
          modelo:        base.modelo,
          ano,
          preco:         Math.round((base.precoBase * mult) / 1000) * 1000,
          emailVendedor: vendedoresEmail[vendedorIdx],
          tags:          [...base.tags, estadoTag],
          urlImagem:     imagensPorModelo[base.modelo],
        });
      });
    });

    for (const carro of frotaFinal) {
      await session.run(`
        MATCH (v:Usuario {email: $emailVendedor})
        CREATE (c:Carro {
          id:        randomUUID(),
          modelo:    $modelo,
          ano:       $ano,
          preco:     $preco,
          urlImagem: $urlImagem,
          status:    'DISPONIVEL'
        })
        CREATE (v)-[:ANUNCIOU {criadoEm: $dataAtual}]->(c)
        WITH c, $tags AS tagsLista
        UNWIND tagsLista AS tagId
        MATCH (t:Tag {id: tagId})
        CREATE (c)-[:POSSUI_CARACTERISTICA]->(t)
      `, { ...carro, dataAtual });
    }

    // ── 5. HIPER-INTERAÇÕES ──────────────────────────────────────
    console.log('🧠 Disparando milhares de relacionamentos massivos...');

    // 5.1. Favoritos de Base (Garantir um "Core" de interesse forte)
    const interacoesFavoritas = [
      { email: 'pedro_offroad@teste.com', modelos: ['Toyota Hilux', 'Ford Ranger', 'Toyota SW4', 'VW Amarok', 'Chevrolet S10', 'Fiat Toro', 'Jeep Commander', 'Mitsubishi Outlander', 'Jeep Renegade', 'VW T-Cross', 'Fiat Strada'] },
      { email: 'maria_urbana@teste.com',  modelos: ['VW Polo', 'Fiat Mobi', 'Chevrolet Onix', 'Renault Kwid', 'Honda City', 'Toyota Yaris', 'Hyundai HB20', 'Renault Sandero', 'Honda HR-V', 'Fiat Pulse'] },
      { email: 'lucas_eco@teste.com',     modelos: ['BYD Dolphin', 'BYD Seal', 'Toyota Corolla', 'KIA EV6', 'Chevrolet Equinox', 'BYD Han', 'VW Nivus', 'Honda Civic', 'Audi A3'] },
      { email: 'ana_luxo@teste.com',      modelos: ['VW Jetta', 'Audi A3', 'BMW X1', 'Mercedes GLA', 'Jeep Commander', 'Toyota SW4', 'Ford Mustang', 'KIA EV6', 'BYD Seal', 'Honda Civic'] },
      { email: 'joao_familia@teste.com',  modelos: ['Jeep Compass', 'VW Nivus', 'Honda HR-V', 'Hyundai Creta', 'Chevrolet Tracker', 'Fiat Pulse', 'Nissan Kicks', 'Toyota Corolla', 'Renault Sandero', 'VW T-Cross'] },
      { email: 'carlos_agro@teste.com',   modelos: ['Fiat Toro', 'Fiat Strada', 'Chevrolet S10', 'Toyota Hilux', 'VW Amarok', 'Ford Ranger', 'Jeep Renegade', 'Mitsubishi Outlander', 'Toyota SW4'] },
      { email: 'tiago_esporte@teste.com', modelos: ['Ford Mustang', 'VW Jetta', 'BYD Seal', 'Audi A3', 'Honda Civic', 'BMW X1', 'VW Polo', 'Honda HR-V', 'Toyota Corolla'] },
      { email: 'paula_pop@teste.com',     modelos: ['Fiat Mobi', 'Renault Kwid', 'Chevrolet Onix', 'VW Polo', 'Fiat Cronos', 'Hyundai HB20', 'Toyota Yaris', 'Renault Sandero', 'Fiat Strada'] },
      { email: 'bruno_sedan@teste.com',   modelos: ['Honda Civic', 'Toyota Corolla', 'VW Jetta', 'Audi A3', 'Honda City', 'Fiat Cronos', 'BYD Seal', 'BYD Han', 'KIA EV6'] },
    ];

    // Cria favoritos e aumenta peso fortemente
    for (const interacao of interacoesFavoritas) {
      for (const modelo of interacao.modelos) {
        await session.run(`
          MATCH (u:Usuario {email: $email})
          MATCH (c:Carro {modelo: $modelo})
          MERGE (u)-[fav:FAVORITOU]->(c)
          SET fav.criadoEm = $dataAtual
          WITH u, c
          MERGE (u)-[r1:INTERAGIU]->(c)
          SET r1.peso = coalesce(r1.peso, 0) + 15, r1.ultimaAtualizacao = $dataAtual
          WITH u, c
          MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
          MERGE (u)-[r2:INTERESSADO_EM]->(t)
          SET r2.peso = coalesce(r2.peso, 0) + 8, r2.ultimaAtualizacao = $dataAtual
        `, { email: interacao.email, modelo, dataAtual });
      }
    }

    // 5.2. Loop de Algoritmo Aleatório Ampliado (Window Shopping)
    // Todos os usuários, incluindo vendedores, recebem sinais suficientes para recomendação.
    console.log('👁️  Simulando navegação intensa ("Window Shopping") por usuário...');
    const emailsUsuariosComRecomendacao = usuariosData.map(u => u.email);
    const todosModelos = modelosBase.map(m => m.modelo);

    for (const email of emailsUsuariosComRecomendacao) {
      // Mistura todos os modelos e pega até 50 para esse usuário simular cliques.
      const modelosVistos = todosModelos.sort(() => 0.5 - Math.random()).slice(0, 50);
      
      for (const modelo of modelosVistos) {
        // Ao buscar pelo modelo, ele atinge as 3 instâncias (Novo, Semi, Usado) gerando 150 relações por usuário
        await session.run(`
          MATCH (u:Usuario {email: $email})
          MATCH (c:Carro {modelo: $modelo})
          MERGE (u)-[r1:INTERAGIU]->(c)
          SET r1.peso = coalesce(r1.peso, 0) + 1, r1.ultimaAtualizacao = $dataAtual
          WITH u, c
          MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
          MERGE (u)-[r2:INTERESSADO_EM]->(t)
          SET r2.peso = coalesce(r2.peso, 0) + 1, r2.ultimaAtualizacao = $dataAtual
        `, { email, modelo, dataAtual });
      }
    }

    console.log('\nBase inicial criada. Preparando camada extra de interacoes...');
    const perfisDensos = [
      {
        email: 'vendedor1@teste.com',
        tags: ['SUV', 'AUTOMATICO', 'FLEX', 'HIBRIDO', 'JEEP', 'TOYOTA', 'HONDA', 'BANCO_COURO', 'TETO_SOLAR'],
        modelosFortes: ['Jeep Compass', 'Jeep Commander', 'Toyota Corolla', 'Toyota SW4', 'Honda HR-V', 'Hyundai Creta', 'BMW X1']
      },
      {
        email: 'vendedor2@teste.com',
        tags: ['HATCH', 'SEDAN', 'FLEX', 'CVT', 'VW', 'FIAT', 'CHEVROLET', 'CENTRAL_MULTIMIDIA', 'CAMERA_RE'],
        modelosFortes: ['VW Polo', 'VW Nivus', 'Honda City', 'Fiat Cronos', 'Chevrolet Onix', 'Toyota Yaris', 'Hyundai HB20']
      },
      {
        email: 'vendedor3@teste.com',
        tags: ['ELETRICO', 'HIBRIDO', 'AUTOMATICO', 'BYD', 'KIA', 'TOYOTA', 'SEDAN', 'HATCH', 'PILOTO_AUTOMATICO'],
        modelosFortes: ['BYD Dolphin', 'BYD Seal', 'BYD Han', 'KIA EV6', 'Toyota Corolla', 'Chevrolet Equinox', 'Audi A3']
      },
      {
        email: 'pedro_offroad@teste.com',
        tags: ['PICKUP', 'SUV', 'DIESEL', '4X4', 'TOYOTA', 'FORD', 'CHEVROLET', 'JEEP'],
        modelosFortes: ['Toyota Hilux', 'Ford Ranger', 'Toyota SW4', 'VW Amarok', 'Chevrolet S10', 'Fiat Toro', 'Jeep Commander']
      },
      {
        email: 'maria_urbana@teste.com',
        tags: ['HATCH', 'SEDAN', 'FLEX', 'AUTOMATICO', 'CVT', 'CENTRAL_MULTIMIDIA', 'CAMERA_RE'],
        modelosFortes: ['VW Polo', 'Fiat Mobi', 'Chevrolet Onix', 'Renault Kwid', 'Honda City', 'Toyota Yaris', 'Hyundai HB20']
      },
      {
        email: 'lucas_eco@teste.com',
        tags: ['ELETRICO', 'HIBRIDO', 'AUTOMATICO', 'BYD', 'KIA', 'TOYOTA', 'CENTRAL_MULTIMIDIA'],
        modelosFortes: ['BYD Dolphin', 'BYD Seal', 'BYD Han', 'KIA EV6', 'Toyota Corolla', 'Chevrolet Equinox']
      },
      {
        email: 'ana_luxo@teste.com',
        tags: ['SUV', 'SEDAN', 'AUTOMATICO', 'GASOLINA', 'BANCO_COURO', 'TETO_SOLAR', 'BMW', 'AUDI', 'MERCEDES'],
        modelosFortes: ['BMW X1', 'Mercedes GLA', 'Audi A3', 'Ford Mustang', 'VW Jetta', 'Jeep Commander']
      },
      {
        email: 'joao_familia@teste.com',
        tags: ['SUV', 'SEDAN', 'FLEX', 'AUTOMATICO', 'BANCO_COURO', 'CAMERA_RE', 'CENTRAL_MULTIMIDIA'],
        modelosFortes: ['Jeep Compass', 'Honda HR-V', 'Hyundai Creta', 'Chevrolet Tracker', 'Nissan Kicks', 'VW T-Cross', 'VW Nivus']
      },
      {
        email: 'carlos_agro@teste.com',
        tags: ['PICKUP', 'DIESEL', '4X4', 'MANUAL', 'AUTOMATICO', 'FIAT', 'TOYOTA', 'FORD', 'CHEVROLET'],
        modelosFortes: ['Fiat Toro', 'Fiat Strada', 'Chevrolet S10', 'Toyota Hilux', 'Ford Ranger', 'VW Amarok']
      },
      {
        email: 'fernanda@teste.com',
        tags: ['SUV', 'HATCH', 'FLEX', 'AUTOMATICO', 'VERMELHO', 'BRANCO', 'FAROL_LED', 'CAMERA_RE'],
        modelosFortes: ['Honda HR-V', 'VW T-Cross', 'Chevrolet Tracker', 'Hyundai Creta', 'Fiat Pulse', 'Nissan Kicks']
      },
      {
        email: 'tiago_esporte@teste.com',
        tags: ['COUPE', 'SEDAN', 'GASOLINA', 'AUTOMATICO', 'FAROL_LED', 'TETO_SOLAR', 'FORD', 'AUDI', 'BMW'],
        modelosFortes: ['Ford Mustang', 'VW Jetta', 'Audi A3', 'Honda Civic', 'BMW X1', 'BYD Seal']
      },
      {
        email: 'paula_pop@teste.com',
        tags: ['HATCH', 'FLEX', 'MANUAL', 'BRANCO', 'VERMELHO', 'CENTRAL_MULTIMIDIA', 'FIAT', 'RENAULT', 'CHEVROLET'],
        modelosFortes: ['Fiat Mobi', 'Renault Kwid', 'Chevrolet Onix', 'VW Polo', 'Fiat Cronos', 'Hyundai HB20']
      },
      {
        email: 'bruno_sedan@teste.com',
        tags: ['SEDAN', 'AUTOMATICO', 'CVT', 'FLEX', 'HIBRIDO', 'BANCO_COURO', 'HONDA', 'TOYOTA', 'AUDI'],
        modelosFortes: ['Honda Civic', 'Toyota Corolla', 'VW Jetta', 'Audi A3', 'Honda City', 'Fiat Cronos', 'BYD Seal']
      }
    ];

    const preferenciasDiretas = [];
    const favoritosDensos = [];
    const visualizacoesDensas = [];

    for (const perfil of perfisDensos) {
      perfil.tags.forEach((tag, index) => {
        preferenciasDiretas.push({
          email: perfil.email,
          tag,
          peso: Math.max(6, 22 - index)
        });
      });

      perfil.modelosFortes.forEach((modelo, index) => {
        favoritosDensos.push({
          email: perfil.email,
          modelo,
          pesoCarro: Math.max(12, 34 - index),
          pesoTags: Math.max(7, 18 - index)
        });
      });

      perfil.modelosFortes.forEach((modelo, index) => {
        visualizacoesDensas.push({
          email: perfil.email,
          modelo,
          pesoCarro: Math.max(10, 30 - index),
          pesoTags: Math.max(5, 15 - index)
        });
      });

      todosModelos
        .filter(modelo => !perfil.modelosFortes.includes(modelo))
        .forEach((modelo, index) => {
          visualizacoesDensas.push({
            email: perfil.email,
            modelo,
            pesoCarro: 2 + (index % 7),
            pesoTags: 1 + (index % 4)
          });
        });
    }

    console.log('Aplicando camada extra de interacoes por perfil...');

    await session.run(`
      UNWIND $preferencias AS pref
      MATCH (u:Usuario {email: pref.email})
      MATCH (t:Tag {id: pref.tag})
      MERGE (u)-[r:INTERESSADO_EM]->(t)
      SET r.peso = coalesce(r.peso, 0) + pref.peso,
          r.ultimaAtualizacao = $dataAtual
    `, { preferencias: preferenciasDiretas, dataAtual });

    await session.run(`
      UNWIND $favoritos AS favorito
      MATCH (u:Usuario {email: favorito.email})
      MATCH (c:Carro {modelo: favorito.modelo})
      MERGE (u)-[fav:FAVORITOU]->(c)
      SET fav.criadoEm = $dataAtual
      MERGE (u)-[r1:INTERAGIU]->(c)
      SET r1.peso = coalesce(r1.peso, 0) + favorito.pesoCarro,
          r1.ultimaAtualizacao = $dataAtual
      WITH u, c, favorito
      MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
      MERGE (u)-[r2:INTERESSADO_EM]->(t)
      SET r2.peso = coalesce(r2.peso, 0) + favorito.pesoTags,
          r2.ultimaAtualizacao = $dataAtual
    `, { favoritos: favoritosDensos, dataAtual });

    await session.run(`
      UNWIND $visualizacoes AS evento
      MATCH (u:Usuario {email: evento.email})
      MATCH (c:Carro {modelo: evento.modelo})
      MERGE (u)-[r1:INTERAGIU]->(c)
      SET r1.peso = coalesce(r1.peso, 0) + evento.pesoCarro,
          r1.ultimaAtualizacao = $dataAtual
      WITH u, c, evento
      MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
      MERGE (u)-[r2:INTERESSADO_EM]->(t)
      SET r2.peso = coalesce(r2.peso, 0) + evento.pesoTags,
          r2.ultimaAtualizacao = $dataAtual
    `, { visualizacoes: visualizacoesDensas, dataAtual });

    console.log(`Camada extra criada: ${preferenciasDiretas.length} preferencias, ${favoritosDensos.length} favoritos densos e ${visualizacoesDensas.length} grupos de visualizacao.`);
    console.log('Seed concluido com grafo denso de recomendacao.');
  } catch (error) {
    console.error('❌ Erro no Seed:', error);
  } finally {
    await session.close();
    await driver.close();
    process.exit(0);
  }
}

popularBanco();
