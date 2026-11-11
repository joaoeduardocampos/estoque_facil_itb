import { useEffect, useState, useRef } from 'react';
import { Plus, Package, LogOut, Smartphone, Home, Laptop, Phone, Shirt, Book, Gift, Dumbbell, Wrench, Car, Flower2, Sparkles, PawPrint, FileText, ShoppingBag, Upload, X, Users, Pencil, Trash2, ShieldCheck, User, Mail, BarChart3, TrendingUp, TrendingDown, Activity, UserCheck, UserX, Eye, Clock, Globe, ExternalLink, CheckCircle, XCircle, Crown, Lock, Unlock, Settings, AlertTriangle, RefreshCw, Search, Filter, KeyRound, Ban, Bell } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { api, AuthUser } from "../lib/api";

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  model: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  entryQuantity: number;
  exitQuantity: number;
  addedAt: string;
  image?: string;
}

interface DashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: 'master' | 'admin' | 'usuario';
  status: 'ativo' | 'inativo' | 'bloqueado';
  createdAt: string;
  lastLogin?: string;
  permissions: {
    produtos: boolean;
    usuarios: boolean;
    analytics: boolean;
    master: boolean;
  };
}

// Ícones por categoria
const categoryIcons: Record<string, any> = {
  "Eletrônicos": Smartphone,
  "Eletrodomésticos": Home,
  "Eletro": Home,
  "Informática": Laptop,
  "Telefonia": Phone,
  "Móveis": Home,
  "Alimentos": ShoppingBag,
  "Bebidas": ShoppingBag,
  "Vestuário": Shirt,
  "Calçados": Shirt,
  "Livros": Book,
  "Brinquedos": Gift,
  "Esportes": Dumbbell,
  "Ferramentas": Wrench,
  "Automotivo": Car,
  "Casa e Jardim": Flower2,
  "Beleza e Saúde": Sparkles,
  "Pet Shop": PawPrint,
  "Papelaria": FileText,
  "Outros": Package
};

// Marcas por categoria de produto
const brandsByProduct: Record<string, string[]> = {
  "Smartphone": ["Samsung", "Apple", "Xiaomi", "Motorola", "LG", "Asus", "Realme", "OnePlus", "Oppo", "Vivo", "Nokia", "Sony", "Honor", "Google Pixel", "Outra marca"],
  "Tablet": ["Samsung", "Apple", "Xiaomi", "Lenovo", "Huawei", "Microsoft", "Amazon", "Asus", "LG", "Multilaser", "Outra marca"],
  "Smart TV": ["Samsung", "LG", "Sony", "TCL", "Philips", "Panasonic", "Hisense", "AOC", "Multilaser", "Philco", "Semp", "Xiaomi", "Outra marca"],
  "Notebook": ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "Samsung", "Positivo", "Avell", "Vaio", "MSI", "Alienware", "Razer", "Outra marca"],
  "Desktop": ["Dell", "HP", "Lenovo", "Positivo", "Asus", "Acer", "Apple", "Alienware", "Corsair", "Outra marca"],
  "Monitor": ["Samsung", "LG", "Dell", "AOC", "Asus", "BenQ", "Philips", "Acer", "HP", "ViewSonic", "Outra marca"],
  "Geladeira": ["Brastemp", "Consul", "Electrolux", "Samsung", "LG", "Panasonic", "Philco", "Midea", "Frost", "Outra marca"],
  "Fogão": ["Brastemp", "Consul", "Electrolux", "Atlas", "Continental", "Dako", "Esmaltec", "Mueller", "Outra marca"],
  "Micro-ondas": ["Brastemp", "Consul", "Electrolux", "LG", "Panasonic", "Philco", "Midea", "Mondial", "Outra marca"],
  "Máquina de Lavar": ["Brastemp", "Consul", "Electrolux", "LG", "Samsung", "Panasonic", "Philco", "Mueller", "Colormaq", "Outra marca"],
  "Ar Condicionado": ["Samsung", "LG", "Midea", "Gree", "Elgin", "Springer", "Consul", "Electrolux", "Philco", "Outra marca"],
  "Ventilador": ["Britânia", "Mondial", "Arno", "Philco", "Mallory", "Cadence", "Ventisol", "Outra marca"],
  "Celular": ["Samsung", "Apple", "Xiaomi", "Motorola", "Nokia", "LG", "Asus", "OnePlus", "Realme", "Outra marca"],
  "Câmera Digital": ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus", "GoPro", "DJI", "Outra marca"],
  "Fone de Ouvido": ["JBL", "Sony", "Beats", "Bose", "Sennheiser", "Audio-Technica", "Edifier", "Philips", "Samsung", "Apple", "Outra marca"],
  "Smartwatch": ["Apple", "Samsung", "Xiaomi", "Garmin", "Fitbit", "Amazfit", "Huawei", "Fossil", "Outra marca"],
  "Console de Videogame": ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Outra marca"],
  "Teclado": ["Logitech", "Razer", "Corsair", "HyperX", "Redragon", "Microsoft", "Dell", "HP", "Outra marca"],
  "Mouse": ["Logitech", "Razer", "Corsair", "HyperX", "Redragon", "Microsoft", "Dell", "HP", "Outra marca"],
  "Impressora": ["HP", "Canon", "Epson", "Brother", "Samsung", "Xerox", "Lexmark", "Outra marca"],
  "Roteador": ["TP-Link", "D-Link", "Intelbras", "Asus", "Netgear", "Linksys", "Mercusys", "Outra marca"],
  "Tênis": ["Nike", "Adidas", "Puma", "Olympikus", "Mizuno", "Asics", "New Balance", "Reebok", "Fila", "Vans", "Converse", "Outra marca"],
  "Camiseta": ["Nike", "Adidas", "Puma", "Lacoste", "Reserva", "Hering", "Polo Ralph Lauren", "Tommy Hilfiger", "Ellus", "Outra marca"],
  "Calça": ["Levis", "Wrangler", "Diesel", "Calvin Klein", "Zara", "H&M", "Gap", "Lee", "Colcci", "Forum", "Outra marca"],
  "Sandália": ["Havaianas", "Ipanema", "Rider", "Melissa", "Grendene", "Kenner", "Outra marca"],
  "Sapato Social": ["Ferracini", "Democrata", "Pegada", "Rafarillo", "Samello", "Outra marca"],
  "Sofá": ["Tok&Stok", "Etna", "Mobly", "Madesa", "Casas Bahia", "Outra marca"],
  "Mesa": ["Tok&Stok", "Madesa", "Móveis Bechara", "Politorno", "Outra marca"],
  "Cadeira": ["Tok&Stok", "Madesa", "Tramontina", "Flexform", "DTPallets", "Outra marca"],
  "Arroz": ["Tio João", "Camil", "Prato Fino", "Blue Ville", "Namorado", "Carreteiro", "Outra marca"],
  "Feijão": ["Camil", "Kicaldo", "Vapza", "Combrasil", "Outra marca"],
  "Macarrão": ["Barilla", "Adria", "Galo", "Renata", "Santa Amália", "Outra marca"],
  "Refrigerante": ["Coca-Cola", "Pepsi", "Guaraná Antarctica", "Sprite", "Fanta", "Schweppes", "Outra marca"],
  "Cerveja": ["Brahma", "Skol", "Heineken", "Budweiser", "Stella Artois", "Corona", "Antarctica", "Outra marca"],
  "Shampoo": ["Pantene", "Dove", "Elseve", "Seda", "Clear", "Head & Shoulders", "TRESemmé", "Outra marca"],
  "Perfume": ["Natura", "O Boticário", "Eudora", "Avon", "Chanel", "Dior", "Calvin Klein", "Outra marca"],
  "Ração": ["Pedigree", "Whiskas", "Royal Canin", "Premier", "Golden", "Gran Plus", "Outra marca"],
  "Boneca": ["Mattel", "Hasbro", "Estrela", "Candide", "MGA Entertainment", "Baby Alive", "Barbie", "Polly Pocket", "L.O.L. Surprise!", "Bratz", "Outra marca"],
  "Carrinho": ["Hot Wheels", "Mattel", "Candide", "Bandeirante", "Maisto", "Matchbox", "Outra marca"],
  "Lego": ["LEGO Classic", "LEGO City", "LEGO Creator", "LEGO Speed Champions", "LEGO Technic", "LEGO Friends", "LEGO Star Wars", "Outra marca"],
  "Quebra-cabeça": ["Estrela", "Toyster", "Grow", "Pais & Filhos", "Jak", "Outra marca"],
  "Jogo de Tabuleiro": ["Estrela", "Hasbro", "Mattel", "Grow", "Elka", "Copag", "Galápagos Jogos", "Outra marca"],
  "Pelúcia": ["Estrela", "Candide", "Sunny", "Buba", "Multikids", "Outra marca"],
  "Massinha de Modelar": ["Play-Doh", "Hasbro", "Estrela", "Tris", "Elka", "Outra marca"],
  "Blocos de Montar": ["LEGO", "Elka", "Xalingo", "Mega Bloks", "Banbao", "Outra marca"],
  "Nerf/Lançadores": ["Nerf", "Hasbro", "X-Shot", "Candide", "Outra marca"],
  "Action Figure": ["Hasbro", "Mattel", "Sunny", "Estrela", "Transformers", "Marvel", "DC Comics", "Outra marca"],
  "Triciclo": ["Bandeirante", "Brinquedos Cardoso", "Calesita", "Xalingo", "Outra marca"],
  "Patinete": ["Bandeirante", "Atrio", "Oxer", "Bel Sports", "Outra marca"],
  "Brinquedo Educativo": ["Elka", "Xalingo", "Estrela", "Fisher-Price", "Mattel", "Grow", "Outra marca"],
  "Jogo Pedagógico": ["Elka", "Xalingo", "Carlu", "Grow", "Nig Brinquedos", "Outra marca"],
  "Brinquedo de Madeira": ["Xalingo", "Carlu", "Brinquedos Anjo", "NewArt", "Outra marca"],
  "Kit de Ciências": ["Grow", "Estrela", "Sunny", "National Geographic", "Outra marca"],
  "Beyblade": ["Hasbro", "Sunny", "Takara Tomy", "Outra marca"],
  "Patrulha Canina": ["Sunny", "Mattel", "Elka", "Outra marca"],
  "Transformers": ["Hasbro", "Takara Tomy", "Outra marca"],
  "Default": ["Genérica", "Sem Marca", "Nacional", "Importada", "Outra marca"]
};

// Modelos por marca (exemplo simplificado)
const modelsByBrand: Record<string, string[]> = {
  // Smartphones e TVs Samsung (mesclado)
  "Samsung": ["Galaxy S24", "Galaxy S23", "Galaxy A54", "Galaxy A34", "Galaxy M14", "S95H OLED", "S95F QD-OLED", "S90H OLED", "QN90H Neo QLED", "QN990F 8K", "QN95D Neo QLED", "Q80D QLED", "The Frame", "The Serif", "Crystal UHD"],
  "Apple": ["iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone SE"],
  // Smartphones e TVs Xiaomi (mesclado)
  "Xiaomi": ["Redmi Note 13", "Redmi 12", "Poco X6", "Mi 13", "Redmi Note 12", "TV A Pro", "TV P1", "TV Q1E", "Mi TV 4S", "Redmi Smart TV"],
  "Motorola": ["Moto G84", "Moto G54", "Edge 40", "Moto G23", "Edge 30"],

  // Notebooks
  "Dell": ["Inspiron 15", "Inspiron 14", "XPS 13", "XPS 15", "Vostro 15"],
  "HP": ["Pavilion 15", "Pavilion 14", "Envy 13", "ProBook 450", "Victus 16"],
  "Lenovo": ["IdeaPad 3", "IdeaPad 5", "ThinkPad E14", "V15", "Legion 5"],
  "Asus": ["VivoBook 15", "VivoBook 14", "ZenBook 14", "TUF Gaming F15", "ROG Strix"],

  // TVs - Modelos atualizados 2024-2026
  "LG": ["C6 OLED", "C5 OLED", "G6 OLED", "B5 OLED", "C4 OLED", "G4 OLED", "B4 OLED", "QNED Mini LED", "NanoCell", "UHD AI ThinQ"],
  "Sony": ["Bravia XR A95L", "Bravia 9 Mini LED", "Bravia 8 OLED", "Bravia 7 Mini LED", "Bravia 3 K-65S30", "X95L Mini LED", "X90L", "X85L", "X80L"],
  "TCL": ["C855 Mini LED", "C745 QLED", "C645 QLED", "P755 4K", "P635 4K", "S5400 Full HD"],
  "Philips": ["OLED+908", "OLED808", "The One", "7000 Series", "6000 Series"],
  "Panasonic": ["MX950 OLED", "MZ800 OLED", "LX940 Mini LED", "LX800 LED"],
  "Hisense": ["U8N Mini LED", "U7N QLED", "U6N QLED", "A7N", "A6N"],
  "AOC": ["Roku TV", "Google TV", "Smart TV 4K", "Full HD"],
  "Multilaser": ["TL070", "TL021", "TL024", "TL018"],
  "Philco": ["PTV55G70SBLSG", "PTV50G70SBL", "PTV43G70SBL", "PTV32G70SBL"],
  "Semp": ["43S5300FS", "50SK8300", "55SK8300", "65SK8300"],

  // Eletrodomésticos
  "Brastemp": ["Frost Free", "Duplex", "Side by Side", "Inverse"],
  "Consul": ["Bem Estar", "Facilite", "Frost Free"],
  "Electrolux": ["Top Freezer", "Infinity", "French Door"],

  // Tênis
  "Nike": ["Air Max", "Air Force 1", "Revolution", "Downshifter", "Pegasus"],
  "Adidas": ["Ultraboost", "Superstar", "Stan Smith", "Forum", "Samba"],
  "Puma": ["Suede", "RS-X", "Cali", "Mayze", "Smash"],

  // Brinquedos
  "Mattel": ["Barbie", "Hot Wheels", "Fisher-Price", "Uno", "Polly Pocket"],
  "Hasbro": ["Nerf", "Play-Doh", "Monopoly", "Baby Alive", "Transformers"],
  "LEGO Classic": ["Blocos Criativos", "Caixa Média", "Caixa Grande", "Base Verde", "Base Azul"],
  "LEGO City": ["Quartel dos Bombeiros", "Delegacia de Polícia", "Aeroporto", "Centro da Cidade"],
  "LEGO Creator": ["Casa Moderna", "Super Robô", "Aventura de Dragão", "Carro Esportivo"],
  "LEGO Speed Champions": ["Ferrari", "Lamborghini", "McLaren", "Porsche", "Aston Martin"],
  "LEGO Technic": ["Escavadeira", "Guindaste", "Buggy Off-Road", "Moto"],
  "LEGO Friends": ["Casa da Stephanie", "Clínica Veterinária", "Café", "Shopping"],
  "LEGO Star Wars": ["Millennium Falcon", "X-Wing", "TIE Fighter", "AT-AT"],
  "Sunny": ["Patrulha Canina", "Beyblade", "L.O.L. Surprise!", "Playmobil"],
  "MGA Entertainment": ["L.O.L. Surprise!", "Bratz", "Rainbow High", "Little Tikes"],
  "Estrela": ["Banco Imobiliário", "Cara a Cara", "Genius", "Susi", "Detetive", "War"],
  "Candide": ["Carrinhos RC", "Brinquedos com Som", "Brinquedos com Luz", "Veículos"],
  "Bandeirante": ["Triciclo", "Patinete", "Carrinho a Pedal", "Veículo Elétrico", "Gangorra"],
  "Elka": ["Blocos de Encaixe", "Jogos Educativos", "Mesa Infantil", "Brinquedos Pedagógicos"],
  "Grow": ["Perfil", "Jogo da Vida", "Detetive", "Imagem & Ação", "Québra-cabeça"],
  "Baby Alive": ["Bebê Come Papinha", "Bebê Primeiro Peniquinho", "Bebê Pequena Artista"],
  "Hot Wheels": ["Pista Loop", "Lançador Turbo", "Conjunto Cidade", "Carrinhos Individuais"],
  "Nerf": ["Elite", "Mega", "Ultra", "Rival", "Modulus"],
  "Play-Doh": ["Massinha Clássica", "Super Fábrica", "Dentista Brincalhão", "Pizzaria"],

  "Default": ["Modelo Padrão", "Básico", "Standard", "Classic", "Personalizado"]
};

// Produtos por categoria
const productsByCategory: Record<string, string[]> = {
  "Eletrônicos": ["Smartphone", "Tablet", "Smart TV", "Câmera Digital", "Fone de Ouvido", "Smartwatch", "Console de Videogame"],
  "Eletrodomésticos": ["Geladeira", "Fogão", "Micro-ondas", "Máquina de Lavar", "Ar Condicionado", "Ventilador", "Liquidificador"],
  "Eletro": ["Ferro de Passar", "Aspirador de Pó", "Cafeteira", "Torradeira", "Secador de Cabelo", "Mixer"],
  "Informática": ["Notebook", "Desktop", "Monitor", "Teclado", "Mouse", "Impressora", "Roteador", "HD Externo"],
  "Telefonia": ["Celular", "Carregador", "Capinha", "Película", "Fone Bluetooth", "Cabo USB"],
  "Móveis": ["Sofá", "Mesa", "Cadeira", "Guarda-roupa", "Cama", "Estante", "Rack"],
  "Alimentos": ["Arroz", "Feijão", "Macarrão", "Óleo", "Açúcar", "Sal", "Farinha", "Café"],
  "Bebidas": ["Refrigerante", "Suco", "Água", "Cerveja", "Vinho", "Energético"],
  "Vestuário": ["Camiseta", "Calça", "Vestido", "Jaqueta", "Shorts", "Saia", "Blusa"],
  "Calçados": ["Tênis", "Sandália", "Sapato Social", "Chinelo", "Bota", "Sapatilha"],
  "Livros": ["Romance", "Ficção", "Técnico", "Infantil", "Didático", "Biografia"],
  "Brinquedos": ["Boneca", "Carrinho", "Lego", "Quebra-cabeça", "Jogo de Tabuleiro", "Pelúcia", "Massinha de Modelar", "Blocos de Montar", "Nerf/Lançadores", "Action Figure", "Triciclo", "Patinete", "Brinquedo Educativo", "Jogo Pedagógico", "Brinquedo de Madeira", "Kit de Ciências", "Beyblade", "Patrulha Canina", "Transformers"],
  "Esportes": ["Bola", "Raquete", "Bicicleta", "Patins", "Halteres", "Esteira"],
  "Ferramentas": ["Furadeira", "Martelo", "Chave de Fenda", "Alicate", "Serra", "Parafusadeira"],
  "Automotivo": ["Pneu", "Bateria", "Óleo de Motor", "Filtro", "Lâmpada", "Limpador de Para-brisa"],
  "Casa e Jardim": ["Vaso", "Mangueira", "Cortina", "Tapete", "Almofada", "Luminária"],
  "Beleza e Saúde": ["Shampoo", "Condicionador", "Creme Facial", "Perfume", "Maquiagem", "Protetor Solar"],
  "Pet Shop": ["Ração", "Coleira", "Brinquedo para Pet", "Casinha", "Shampoo Pet", "Comedouro"],
  "Papelaria": ["Caderno", "Caneta", "Lápis", "Borracha", "Papel A4", "Grampeador"],
  "Outros": ["Produto Personalizado"]
};

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'produtos' | 'usuarios' | 'analytics' | 'master'>('produtos');

  // --- Users state ---
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 1, name: 'Master', email: 'master@empresa.com', role: 'master', status: 'ativo', createdAt: '01/01/2024', lastLogin: 'Hoje, 09:00', permissions: { produtos: true, usuarios: true, analytics: true, master: true } },
    { id: 2, name: 'Admin', email: 'admin@empresa.com', role: 'admin', status: 'ativo', createdAt: '15/01/2024', lastLogin: 'Hoje, 11:30', permissions: { produtos: true, usuarios: true, analytics: true, master: false } },
    { id: 3, name: 'João Silva', email: 'joao@empresa.com', role: 'usuario', status: 'ativo', createdAt: '10/03/2024', lastLogin: 'Ontem, 16:45', permissions: { produtos: true, usuarios: false, analytics: false, master: false } },
    { id: 4, name: 'Maria Souza', email: 'maria@empresa.com', role: 'usuario', status: 'inativo', createdAt: '22/04/2024', lastLogin: '10/06/2024', permissions: { produtos: true, usuarios: false, analytics: false, master: false } },
  ]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'master' | 'admin' | 'usuario'>('usuario');
  const [userStatus, setUserStatus] = useState<'ativo' | 'inativo' | 'bloqueado'>('ativo');
  const [userPermissions, setUserPermissions] = useState({ produtos: true, usuarios: false, analytics: false, master: false });

  // --- Master state ---
  const [masterSearch, setMasterSearch] = useState('');
  const [masterFilter, setMasterFilter] = useState<'todos' | 'master' | 'admin' | 'usuario'>('todos');
  const [showPermModal, setShowPermModal] = useState(false);
  const [permUser, setPermUser] = useState<UserRecord | null>(null);
  const [permState, setPermState] = useState({ produtos: false, usuarios: false, analytics: false, master: false });
  const [masterLogs] = useState([
    { id: 1, user: 'Master', action: 'Criou usuário "João Silva"', time: 'Hoje, 09:15', type: 'create' },
    { id: 2, user: 'Admin', action: 'Alterou produto "Smart TV 55"', time: 'Hoje, 10:22', type: 'edit' },
    { id: 3, user: 'João Silva', action: 'Adicionou 10 unidades ao estoque', time: 'Hoje, 11:05', type: 'stock' },
    { id: 4, user: 'Admin', action: 'Inativou usuário "Maria Souza"', time: 'Ontem, 15:30', type: 'block' },
    { id: 5, user: 'Master', action: 'Alterou permissões de "Admin"', time: 'Ontem, 09:00', type: 'perm' },
  ]);

  // --- Contact state ---
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const openNewUserForm = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('usuario');
    setUserStatus('ativo');
    setUserPermissions({ produtos: true, usuarios: false, analytics: false, master: false });
    setShowUserForm(true);
  };

  const openEditUserForm = (u: UserRecord) => {
    setEditingUser(u);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserStatus(u.status);
    setUserPermissions(u.permissions);
    setShowUserForm(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: userName, email: userEmail, role: userRole, status: userStatus, permissions: userPermissions } : u));
    } else {
      const newUser: UserRecord = {
        id: Date.now(),
        name: userName,
        email: userEmail,
        role: userRole,
        status: userStatus,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        permissions: userPermissions,
      };
      setUsers([...users, newUser]);
    }
    setShowUserForm(false);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id !== id || u.role === 'master') return u;
      const next = u.status === 'ativo' ? 'bloqueado' : 'ativo';
      return { ...u, status: next };
    }));
  };

  const openPermModal = (u: UserRecord) => {
    setPermUser(u);
    setPermState({ ...u.permissions });
    setShowPermModal(true);
  };

  const savePermissions = () => {
    if (!permUser) return;
    setUsers(users.map(u => u.id === permUser.id ? { ...u, permissions: permState } : u));
    setShowPermModal(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula envio de formulário
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 3000);
  };

  // --- Products state ---
  const [products, setProducts] = useState<Product[]>([]);
  const [productError, setProductError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productModel, setProductModel] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productCostPrice, setProductCostPrice] = useState('');
  const [productSalePrice, setProductSalePrice] = useState('');
  const [productEntryQuantity, setProductEntryQuantity] = useState('');
  const [productExitQuantity, setProductExitQuantity] = useState('');
  const [productImage, setProductImage] = useState<string>('');
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.products<Product>()
      .then(setProducts)
      .catch((loadError) => setProductError(loadError instanceof Error ? loadError.message : 'Erro ao carregar produtos.'));
  }, []);

  const handleCategoryChange = (category: string) => {
    setProductCategory(category);
    setProductName('');
    setProductBrand('');
    setProductModel('');
    setAvailableProducts(productsByCategory[category] || []);
    setAvailableBrands([]);
    setAvailableModels([]);
  };

  const handleProductChange = (product: string) => {
    setProductName(product);
    setProductBrand('');
    setProductModel('');
    const brands = brandsByProduct[product] || brandsByProduct["Default"];
    setAvailableBrands(brands);
    setAvailableModels([]);
  };

  const handleBrandChange = (brand: string) => {
    setProductBrand(brand);
    setProductModel('');
    const models = modelsByBrand[brand] || modelsByBrand["Default"];
    setAvailableModels(models);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProductImage = (category: string, productName: string) => {
    // Retorna imagem placeholder baseada na categoria
    const imageMap: Record<string, string> = {
      "Smartphone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
      "Tablet": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop",
      "Smart TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
      "Notebook": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
      "Geladeira": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop",
      "Fogão": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop",
      "Micro-ondas": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop",
      "Celular": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop",
      "Tênis": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      "Camiseta": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    };

    return imageMap[productName] || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop`;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: productName,
      category: productCategory,
      brand: productBrand,
      model: productModel,
      quantity: parseInt(productQuantity) || 0,
      costPrice: parseFloat(productCostPrice) || 0,
      salePrice: parseFloat(productSalePrice) || 0,
      entryQuantity: parseInt(productEntryQuantity) || 0,
      exitQuantity: parseInt(productExitQuantity) || 0,
      addedAt: new Date().toLocaleDateString('pt-BR'),
      image: productImage || getProductImage(productCategory, productName),
    };

    try {
      setProductError('');
      const result = await api.createProduct(productData);
      setProducts([{ ...productData, id: result.id }, ...products]);
    } catch (saveError) {
      setProductError(saveError instanceof Error ? saveError.message : 'Erro ao salvar produto.');
      return;
    }
    setProductName('');
    setProductCategory('');
    setProductBrand('');
    setProductModel('');
    setProductQuantity('');
    setProductCostPrice('');
    setProductSalePrice('');
    setProductEntryQuantity('');
    setProductExitQuantity('');
    setProductImage('');
    setAvailableProducts([]);
    setAvailableBrands([]);
    setAvailableModels([]);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="size-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <AnimatedLogo size="large" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role === 'user' ? 'Usuário' : user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('produtos')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition -mb-px whitespace-nowrap ${activeTab === 'produtos' ? 'bg-white border border-b-white border-gray-200 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Package className="w-4 h-4" />
            Produtos
          </button>
          {user.role !== 'user' && (
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition -mb-px whitespace-nowrap ${activeTab === 'usuarios' ? 'bg-white border border-b-white border-gray-200 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4" />
              Usuários
            </button>
          )}
          {user.role !== 'user' && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition -mb-px whitespace-nowrap ${activeTab === 'analytics' ? 'bg-white border border-b-white border-gray-200 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          )}
          {user.role === 'master' && (
            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition -mb-px whitespace-nowrap ${activeTab === 'master' ? 'bg-white border border-b-white border-gray-200 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Crown className="w-4 h-4" />
              Master
            </button>
          )}
        </div>

        {/* Integrations Tab - REMOVIDO (movido para Landing Page) */}
        {false && activeTab === 'integracoes' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Integrações Disponíveis</h2>
              <p className="text-gray-600 text-sm mt-1">Conecte seu estoque com as principais plataformas do mercado</p>
            </div>

            {/* Marketplaces */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Marketplaces
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://www.mercadolivre.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Mercado Livre</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a
                  href="https://www.amazon.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Amazon</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a
                  href="https://shopee.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Shopee</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a
                  href="https://www.magazineluiza.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Magalu</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a
                  href="https://www.americanas.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Americanas</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a
                  href="https://www.casasbahia.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Casas Bahia</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>
              </div>
            </div>

            {/* E-commerce Platforms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Plataformas de E-commerce
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="https://www.shopify.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Shopify</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a href="https://www.nuvemshop.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Nuvemshop</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a href="https://woocommerce.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">WooCommerce</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://www.tray.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Tray</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://vtex.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">VTEX</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://lojaintegrada.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Loja Integrada</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Logistics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-600" />
                Logística e Entregas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="https://www.correios.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Correios</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a href="https://www.jadlog.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Jadlog</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a href="https://www.loggi.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Loggi</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://www.totalexpress.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Total Express</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://www.azulcargo.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Azul Cargo</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://www.mandae.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Mandaê</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Food Delivery */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                Delivery de Alimentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="https://www.ifood.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">iFood</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Conectado</span>
                  </div>
                </a>

                <a href="https://www.rappi.com.br" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Rappi</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>

                <a href="https://www.ubereats.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Uber Eats</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Não conectado</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Painel Administrativo</h2>
              <p className="text-gray-600 text-sm mt-1">Métricas e estatísticas do sistema</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Logins */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+12%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total de Logins</h3>
                <p className="text-3xl font-bold text-gray-900">1,847</p>
                <p className="text-xs text-gray-500 mt-2">Últimos 30 dias</p>
              </div>

              {/* Products */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+8%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Produtos Cadastrados</h3>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-gray-500 mt-2">Total no estoque</p>
              </div>

              {/* Active Users */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+5%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Usuários Ativos</h3>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'ativo').length}</p>
                <p className="text-xs text-gray-500 mt-2">De {users.length} total</p>
              </div>

              {/* Dropouts */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">-3%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Desistências</h3>
                <p className="text-3xl font-bold text-gray-900">23</p>
                <p className="text-xs text-gray-500 mt-2">Últimos 30 dias</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Login Activity Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Atividade de Logins</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-48">
                    {[45, 78, 62, 88, 95, 72, 85].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-t overflow-hidden" style={{ height: '100%' }}>
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Categorias Mais Populares</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Eletrônicos', value: 45, color: 'bg-blue-500' },
                    { name: 'Informática', value: 32, color: 'bg-green-500' },
                    { name: 'Vestuário', value: 28, color: 'bg-purple-500' },
                    { name: 'Alimentos', value: 22, color: 'bg-orange-500' },
                    { name: 'Outros', value: 15, color: 'bg-gray-500' },
                  ].map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        <span className="text-sm text-gray-500">{cat.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${cat.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Atividades Recentes</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { user: 'Admin', action: 'Login no sistema', time: 'Hoje às 14:30', status: 'success' },
                      { user: 'João Silva', action: 'Cadastrou 5 produtos', time: 'Hoje às 13:15', status: 'success' },
                      { user: 'Maria Santos', action: 'Tentativa de login', time: 'Hoje às 12:45', status: 'error' },
                      { user: 'Carlos Lima', action: 'Editou produto #1247', time: 'Hoje às 11:20', status: 'success' },
                      { user: 'Ana Costa', action: 'Login no sistema', time: 'Hoje às 10:05', status: 'success' },
                    ].map((activity, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{activity.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{activity.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{activity.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            activity.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {activity.status === 'success' ? 'Sucesso' : 'Erro'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab - REMOVIDO (movido para Landing Page) */}
        {false && activeTab === 'contato' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Entre em Contato</h2>
                  <p className="text-gray-600 text-sm">Envie sua mensagem e retornaremos em breve</p>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Mensagem Enviada com Sucesso!</h3>
                  <p className="text-green-700">Obrigado pelo contato. Responderemos em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <select
                      id="contactSubject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="comercial">Comercial</option>
                      <option value="duvida">Dúvida</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="contactMessage"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium shadow-md hover:shadow-lg"
                    >
                      Enviar Mensagem
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContactName('');
                        setContactEmail('');
                        setContactSubject('');
                        setContactMessage('');
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition font-medium"
                    >
                      Limpar
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Outras formas de contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-sm font-medium text-gray-800">contato@estoquefacil.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-800">(11) 99999-9999</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'usuarios' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Gerenciar Usuários</h2>
              <button
                onClick={openNewUserForm}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Novo Usuário
              </button>
            </div>

            {/* User Form */}
            {showUserForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                <form onSubmit={handleSaveUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="email@empresa.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Perfil</label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as 'admin' | 'usuario')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="usuario">Usuário</option>
                        <option value="admin">Administrador</option>
                        <option value="master">Master</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={userStatus}
                        onChange={(e) => setUserStatus(e.target.value as 'ativo' | 'inativo')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                      Salvar
                    </button>
                    <button type="button" onClick={() => setShowUserForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum usuário cadastrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                              {u.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              {u.role === 'admin' ? 'Admin' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${u.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                              {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{u.createdAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditUserForm(u)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Master Tab */}
        {activeTab === 'master' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Painel Master</h2>
                  <p className="text-sm text-gray-500">Controle total de usuários e permissões</p>
                </div>
              </div>
              <button
                onClick={openNewUserForm}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total de Usuários', value: users.length, icon: Users, color: 'blue' },
                { label: 'Ativos', value: users.filter(u => u.status === 'ativo').length, icon: UserCheck, color: 'green' },
                { label: 'Inativos', value: users.filter(u => u.status === 'inativo').length, icon: UserX, color: 'gray' },
                { label: 'Bloqueados', value: users.filter(u => u.status === 'bloqueado').length, icon: Ban, color: 'red' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color === 'blue' ? 'bg-blue-100' : s.color === 'green' ? 'bg-green-100' : s.color === 'red' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <s.icon className={`w-4 h-4 ${s.color === 'blue' ? 'text-blue-600' : s.color === 'green' ? 'text-green-600' : s.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Users Table */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={masterSearch}
                      onChange={(e) => setMasterSearch(e.target.value)}
                      placeholder="Buscar usuário..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                    />
                  </div>
                  <select
                    value={masterFilter}
                    onChange={(e) => setMasterFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-yellow-400 outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="master">Master</option>
                    <option value="admin">Admin</option>
                    <option value="usuario">Usuário</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perfil</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último acesso</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users
                        .filter(u => masterFilter === 'todos' || u.role === masterFilter)
                        .filter(u => masterSearch === '' || u.name.toLowerCase().includes(masterSearch.toLowerCase()) || u.email.toLowerCase().includes(masterSearch.toLowerCase()))
                        .map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${u.role === 'master' ? 'bg-yellow-100 text-yellow-700' : u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{u.name}</p>
                                <p className="text-xs text-gray-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${u.role === 'master' ? 'bg-yellow-100 text-yellow-700' : u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {u.role === 'master' ? <Crown className="w-3 h-3" /> : u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {u.role === 'master' ? 'Master' : u.role === 'admin' ? 'Admin' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'ativo' ? 'bg-green-100 text-green-700' : u.status === 'bloqueado' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                              {u.status === 'ativo' ? 'Ativo' : u.status === 'bloqueado' ? 'Bloqueado' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{u.lastLogin || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openPermModal(u)} title="Permissões" className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
                                <KeyRound className="w-4 h-4" />
                              </button>
                              <button onClick={() => openEditUserForm(u)} title="Editar" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                <Pencil className="w-4 h-4" />
                              </button>
                              {u.role !== 'master' && (
                                <button onClick={() => handleToggleStatus(u.id)} title={u.status === 'ativo' ? 'Bloquear' : 'Desbloquear'} className={`p-1.5 rounded-lg transition ${u.status === 'ativo' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                                  {u.status === 'ativo' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                </button>
                              )}
                              {u.role !== 'master' && (
                                <button onClick={() => handleDeleteUser(u.id)} title="Excluir" className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-lg transition">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-700 text-sm">Log de Atividades</h3>
                </div>
                <div className="p-3 space-y-3">
                  {masterLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${log.type === 'create' ? 'bg-green-100' : log.type === 'edit' ? 'bg-blue-100' : log.type === 'block' ? 'bg-red-100' : log.type === 'perm' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        {log.type === 'create' ? <Plus className="w-3.5 h-3.5 text-green-600" /> :
                         log.type === 'edit' ? <Pencil className="w-3.5 h-3.5 text-blue-600" /> :
                         log.type === 'block' ? <Ban className="w-3.5 h-3.5 text-red-600" /> :
                         log.type === 'perm' ? <KeyRound className="w-3.5 h-3.5 text-yellow-600" /> :
                         <Package className="w-3.5 h-3.5 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800">{log.user}</p>
                        <p className="text-xs text-gray-500 leading-snug">{log.action}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-800">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                    <button onClick={() => setShowUserForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm" placeholder="Nome completo" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm" placeholder="email@empresa.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                        <select value={userRole} onChange={(e) => setUserRole(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm bg-white">
                          <option value="usuario">Usuário</option>
                          <option value="admin">Administrador</option>
                          <option value="master">Master</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={userStatus} onChange={(e) => setUserStatus(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm bg-white">
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                          <option value="bloqueado">Bloqueado</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permissões de acesso</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(userPermissions) as Array<keyof typeof userPermissions>).map((key) => (
                          <label key={key} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="checkbox" checked={userPermissions[key]} onChange={(e) => setUserPermissions(p => ({ ...p, [key]: e.target.checked }))} className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700 capitalize">{key === 'master' ? 'Painel Master' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={() => setShowUserForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                      <button type="submit" className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition font-medium">Salvar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Permissions Modal */}
            {showPermModal && permUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800">Permissões</h3>
                      <p className="text-sm text-gray-500">{permUser.name}</p>
                    </div>
                    <button onClick={() => setShowPermModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-2 mb-5">
                    {(Object.keys(permState) as Array<keyof typeof permState>).map((key) => (
                      <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">{key === 'master' ? 'Painel Master' : key === 'produtos' ? 'Produtos' : key === 'usuarios' ? 'Usuários' : 'Analytics'}</span>
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${permState[key] ? 'bg-yellow-400' : 'bg-gray-300'}`} onClick={() => setPermState(p => ({ ...p, [key]: !p[key] }))}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${permState[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowPermModal(false)} className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                    <button onClick={savePermissions} className="flex-1 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition font-medium">Salvar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'produtos' && (
        <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Produtos no Estoque</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Adicionar Produto
          </button>
        </div>

        {/* Formulário de Adicionar Produto */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Novo Produto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Selecione uma categoria</option>
                    {Object.keys(productsByCategory).map((cat) => {
                      const Icon = categoryIcons[cat];
                      return (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      );
                    })}
                  </select>
                  {productCategory && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      {(() => {
                        const Icon = categoryIcons[productCategory];
                        return <Icon className="w-4 h-4" />;
                      })()}
                      <span>{productCategory}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                    Produto
                  </label>
                  <select
                    id="productName"
                    value={productName}
                    onChange={(e) => handleProductChange(e.target.value)}
                    required
                    disabled={!productCategory}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um produto</option>
                    {availableProducts.map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productBrand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    id="productBrand"
                    value={productBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    required
                    disabled={!productName}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione uma marca</option>
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="productModel" className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <select
                    id="productModel"
                    value={productModel}
                    onChange={(e) => setProductModel(e.target.value)}
                    required
                    disabled={!productBrand}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um modelo</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto do Produto (Opcional)
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="productImageUpload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50"
                    >
                      <Upload className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {productImage ? 'Alterar imagem' : 'Clique para fazer upload'}
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      id="productImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {productImage && (
                    <div className="relative">
                      <img
                        src={productImage}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productCostPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor de Custo (R$)
                  </label>
                  <input
                    id="productCostPrice"
                    type="number"
                    step="0.01"
                    value={productCostPrice}
                    onChange={(e) => setProductCostPrice(e.target.value)}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="productSalePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor de Venda (R$)
                  </label>
                  <input
                    id="productSalePrice"
                    type="number"
                    step="0.01"
                    value={productSalePrice}
                    onChange={(e) => setProductSalePrice(e.target.value)}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque
                  </label>
                  <input
                    id="productQuantity"
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="productEntryQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Entrada Total
                  </label>
                  <input
                    id="productEntryQuantity"
                    type="number"
                    value={productEntryQuantity}
                    onChange={(e) => setProductEntryQuantity(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="productExitQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Saída Total
                  </label>
                  <input
                    id="productExitQuantity"
                    type="number"
                    value={productExitQuantity}
                    onChange={(e) => setProductExitQuantity(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {productError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {productError}
          </div>
        )}

        {/* Lista de Produtos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum produto cadastrado ainda</p>
              <p className="text-gray-400 text-sm mt-2">Clique em "Adicionar Produto" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saída
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const Icon = categoryIcons[product.category];
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            <Icon className="w-3.5 h-3.5" />
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {product.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {product.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{product.quantity}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <span className="text-green-700 font-medium">R$ {product.costPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          <span className="text-blue-700 font-medium">R$ {product.salePrice.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600 font-medium">+{product.entryQuantity}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-red-600 font-medium">-{product.exitQuantity}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {product.addedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
        )} {/* end produtos tab */}
      </main>
    </div>
  );
}
