import { useState } from 'react';
import {
  BarChart3, Clock, Shield, CheckCircle, Package, ArrowRight,
  Zap, Globe, TrendingUp, Users, Star, ChevronDown, ChevronUp,
  ShoppingCart, Truck, Receipt, Bell, Layers, Repeat, Award,
  MessageCircle, Building2, Store, Factory, ExternalLink, XCircle, Car, Mail, Phone
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

interface LandingPageProps {
  onOpenLogin: () => void;
}

const STATS = [
  { value: '300 mil+', label: 'usuários ativos por dia', icon: Users },
  { value: '30 dias', label: 'de teste gratuito', icon: Clock },
  { value: '80+', label: 'automações disponíveis', icon: Zap },
  { value: '250+', label: 'integrações', icon: Globe },
];

const FEATURES = [
  {
    icon: Package,
    color: 'blue',
    title: 'Controle Total de Estoque',
    desc: 'Entradas, saídas e movimentações de produtos com rastreamento em tempo real e alertas automáticos de reposição.',
  },
  {
    icon: BarChart3,
    color: 'green',
    title: 'Relatórios Inteligentes',
    desc: 'Dashboards com dados em tempo real para decisões estratégicas. 80+ relatórios personalizáveis.',
  },
  {
    icon: Receipt,
    color: 'purple',
    title: 'Emissão de Notas Fiscais',
    desc: 'NFe, NFCe e NFSe integrados. Emita notas em segundos diretamente da plataforma.',
  },
  {
    icon: ShoppingCart,
    color: 'orange',
    title: 'Vendas Multicanal',
    desc: 'Sincronize estoque com marketplaces, loja virtual e loja física. Tudo em um só lugar.',
  },
  {
    icon: Truck,
    color: 'teal',
    title: 'Logística Completa',
    desc: 'Picking, etiquetas, DANFE e integração com as principais transportadoras do Brasil.',
  },
  {
    icon: Bell,
    color: 'red',
    title: 'Alertas Personalizados',
    desc: 'Receba notificações quando o estoque estiver abaixo do mínimo ou com excesso de produtos.',
  },
  {
    icon: Shield,
    color: 'indigo',
    title: 'Segurança Garantida',
    desc: 'Dados protegidos com criptografia avançada e backup automático na nuvem.',
  },
  {
    icon: Repeat,
    color: 'pink',
    title: 'Automações Poderosas',
    desc: 'Automatize pedidos, reposição de estoque, emissão de notas e muito mais com fluxos inteligentes.',
  },
  {
    icon: Layers,
    color: 'yellow',
    title: 'Multi-localização',
    desc: 'Gerencie múltiplos depósitos, filiais e centros de distribuição em uma única plataforma.',
  },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600' },
  green:  { bg: 'bg-green-100',  icon: 'text-green-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600' },
  teal:   { bg: 'bg-teal-100',   icon: 'text-teal-600' },
  red:    { bg: 'bg-red-100',    icon: 'text-red-600' },
  indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600' },
  pink:   { bg: 'bg-pink-100',   icon: 'text-pink-600' },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
};

const PLANS = [
  {
    name: 'Starter',
    price: 'R$ 55',
    period: '/mês',
    highlight: false,
    features: [
      'Até 500 produtos',
      'Emissão de NF-e',
      '2 usuários',
      'Relatórios básicos',
      'Suporte por e-mail',
    ],
  },
  {
    name: 'Profissional',
    price: 'R$ 129',
    period: '/mês',
    highlight: true,
    badge: 'Mais popular',
    features: [
      'Produtos ilimitados',
      'NF-e + NFC-e + NFS-e',
      '10 usuários',
      'Relatórios avançados',
      'Integrações com marketplaces',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Enterprise',
    price: 'R$ 299',
    period: '/mês',
    highlight: false,
    features: [
      'Tudo do Profissional',
      'Usuários ilimitados',
      'Multi-filiais',
      'API personalizada',
      'Gerente de conta dedicado',
      'Treinamento incluído',
    ],
  },
];

const TESTIMONIALS = [
  {
    name: 'Fernanda Castro',
    role: 'Gestora de Operações',
    company: 'Distribuidora FC',
    avatar: 'FC',
    stars: 5,
    text: 'O Estoque Fácil transformou completamente nossa operação. Antes levávamos horas para fazer o inventário, agora é questão de minutos. O sistema é intuitivo e o suporte é excelente.',
  },
  {
    name: 'Ricardo Mendes',
    role: 'Proprietário',
    company: 'Loja do Ricardo',
    avatar: 'RM',
    stars: 5,
    text: 'Gerencio três lojas com o Estoque Fácil e o controle ficou muito mais fácil. A sincronização automática com os marketplaces me economiza horas por semana.',
  },
  {
    name: 'Ana Paula Souza',
    role: 'Diretora Financeira',
    company: 'APS Comércio',
    avatar: 'AP',
    stars: 5,
    text: 'A emissão de notas fiscais integrada ao estoque foi o diferencial. Reduzi erros e minha equipe ficou mais produtiva. Recomendo para qualquer empresa que quer crescer.',
  },
];

const INTEGRATIONS = [
  'Mercado Livre', 'Shopify', 'Amazon', 'Shopee', 'Nuvemshop',
  'Magalu', 'iFood', 'Correios', 'Jadlog', 'Loggi',
];

const FAQS = [
  {
    q: 'Preciso instalar algum software?',
    a: 'Não! O Estoque Fácil é 100% online. Acesse de qualquer dispositivo com internet, sem instalações ou atualizações manuais.',
  },
  {
    q: 'Posso testar antes de contratar?',
    a: 'Sim! Oferecemos 30 dias de teste gratuito com acesso completo a todos os recursos. Sem necessidade de cartão de crédito.',
  },
  {
    q: 'Quantos produtos posso cadastrar?',
    a: 'No plano Starter, até 500 produtos. Nos planos Profissional e Enterprise, produtos ilimitados.',
  },
  {
    q: 'Tem integração com meu marketplace?',
    a: 'Integramos com mais de 250 plataformas, incluindo Mercado Livre, Shopee, Amazon, Shopify, Nuvemshop, Magalu e muitos outros.',
  },
  {
    q: 'Posso migrar meu estoque atual?',
    a: 'Sim! Nossa equipe oferece suporte completo para importação de dados via planilha Excel ou CSV, sem perda de histórico.',
  },
];

export function LandingPage({ onOpenLogin }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative w-full h-full overflow-y-auto" style={{ backgroundColor: '#EEEEF2' }}>
      {/* Background warehouse image */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-10 min-h-full">
        {/* ── HEADER ── */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <AnimatedLogo size="large" />

              <nav className="hidden md:flex items-center gap-8">
                {[
                  ['#funcionalidades', 'Funcionalidades'],
                  ['#planos', 'Planos'],
                  ['#integracoes', 'Integrações'],
                  ['#contato', 'Contato'],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenLogin}
                  className="relative px-5 py-2 text-blue-600 font-semibold transition-all duration-300 hover:scale-105 group overflow-hidden rounded-lg"
                >
                  <span className="relative z-10">Entrar</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                  <Zap className="w-4 h-4" />
                  Gestão inteligente para vender mais
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Controle seu estoque{' '}
                  <span className="text-blue-600">de forma simples</span>{' '}
                  e eficiente
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Sistema ERP completo e 100% online para gerenciar produtos, emitir notas fiscais,
                  integrar marketplaces e automatizar sua operação. Tudo em um só lugar.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    onClick={onOpenLogin}
                  >
                    Começar grátis por 30 dias
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  {['Sem cartão de crédito', 'Cancele quando quiser', 'Suporte em português'].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                    alt="Dashboard Estoque Fácil"
                    className="w-full h-auto"
                  />
                </div>
                {/* Floating card – productivity */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Produtividade</div>
                    <div className="text-xl font-bold text-gray-900">+47%</div>
                  </div>
                </div>
                {/* Floating card – active users */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Usuários ativos</div>
                    <div className="text-lg font-bold text-gray-900">300 mil+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="py-12 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="w-6 h-6 text-blue-200" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-blue-200 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IS IT FOR ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Para quem é o Estoque Fácil?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Da loja de bairro ao distribuidor nacional, nossa plataforma se adapta ao seu negócio.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Store,
                  title: 'Comércio Varejista',
                  desc: 'Gerencie seu ponto de venda, emita cupons fiscais e controle estoque físico e online de forma integrada.',
                  color: 'blue',
                },
                {
                  icon: Building2,
                  title: 'Distribuidoras',
                  desc: 'Controle grandes volumes de produtos, múltiplos fornecedores e rotas de entrega com eficiência.',
                  color: 'green',
                },
                {
                  icon: Factory,
                  title: 'Indústria',
                  desc: 'Gerencie matérias-primas, ordens de produção e produtos acabados em uma única plataforma.',
                  color: 'purple',
                },
              ].map(({ icon: Icon, title, desc, color }) => {
                const c = colorMap[color];
                return (
                  <div
                    key={title}
                    className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className={`w-14 h-14 ${c.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${c.icon}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          id="funcionalidades"
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #ffffff 70%)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tudo que você precisa para gerenciar seu negócio
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Uma solução completa com todas as ferramentas para otimizar sua operação do primeiro ao último passo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, color, title, desc }) => {
                const c = colorMap[color];
                return (
                  <div
                    key={title}
                    className="bg-white p-7 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 group"
                  >
                    <div className={`w-12 h-12 ${c.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── INTEGRATIONS ── */}
        <section id="integracoes" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm uppercase tracking-widest font-semibold mb-3">
                Integrações
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Conectado com as maiores plataformas do Brasil
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Mais de 250 integrações com marketplaces, transportadoras, meios de pagamento e ferramentas de gestão.
              </p>
            </div>

            {/* Marketplaces */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Marketplaces
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br' },
                  { name: 'Amazon', url: 'https://www.amazon.com.br' },
                  { name: 'Shopee', url: 'https://shopee.com.br' },
                  { name: 'Magalu', url: 'https://www.magazineluiza.com.br' },
                  { name: 'Shopify', url: 'https://www.shopify.com.br' },
                  { name: 'Nuvemshop', url: 'https://www.nuvemshop.com.br' },
                ].map((integration) => (
                  <a
                    key={integration.name}
                    href={integration.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 group cursor-pointer text-center"
                  >
                    <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm">{integration.name}</h4>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition mx-auto mt-1" />
                  </a>
                ))}
              </div>
            </div>

            {/* Logística */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 justify-center">
                <Truck className="w-6 h-6 text-green-600" />
                Logística e Entregas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Correios', url: 'https://www.correios.com.br' },
                  { name: 'Jadlog', url: 'https://www.jadlog.com.br' },
                  { name: 'Loggi', url: 'https://www.loggi.com' },
                  { name: 'iFood', url: 'https://www.ifood.com.br' },
                  { name: 'Rappi', url: 'https://www.rappi.com.br' },
                  { name: 'Uber Eats', url: 'https://www.ubereats.com' },
                ].map((integration) => (
                  <a
                    key={integration.name}
                    href={integration.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all border border-gray-200 hover:border-green-300 group cursor-pointer text-center"
                  >
                    <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm">{integration.name}</h4>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition mx-auto mt-1" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comece grátis por 30 dias. Sem cartão de crédito. Cancele quando quiser.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-blue-600 text-white shadow-2xl scale-105'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-200 hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`}
                        />
                        <span className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onOpenLogin}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Começar agora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section
          id="depoimentos"
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-xl text-gray-600 max-w-xl mx-auto">
                Mais de 300 mil empresas confiam no Estoque Fácil para gerenciar seus negócios.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Awards strip */}
            <div className="mt-14 flex flex-wrap justify-center gap-6">
              {[
                { icon: Award, text: 'Melhor ERP 2024' },
                { icon: Star, text: '4.9/5 no G2' },
                { icon: MessageCircle, text: 'NPS 72' },
                { icon: Users, text: '300 mil+ usuários' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-100 text-sm font-semibold text-gray-700">
                  <Icon className="w-4 h-4 text-blue-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contato" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
              <p className="text-xl text-gray-600">
                Tem alguma dúvida? Nossa equipe está pronta para ajudar você!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulário de Contato */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envie uma mensagem</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">E-mail</h4>
                      <p className="text-gray-600">contato@estoquefacil.com</p>
                      <p className="text-gray-600">suporte@estoquefacil.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Telefone</h4>
                      <p className="text-gray-600">(11) 99999-9999</p>
                      <p className="text-gray-500 text-sm mt-1">Seg-Sex: 9h às 18h</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Chat Online</h4>
                      <p className="text-gray-600">Disponível 24/7</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Iniciar conversa →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
              <p className="text-gray-600">
                Ainda tem dúvidas? Fale com nossa equipe de suporte a qualquer momento.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {faq.q}
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para transformar sua gestão de estoque?
            </h2>
            <p className="text-xl text-blue-200 mb-10">
              Junte-se a mais de 300 mil empresas que já otimizaram seus processos com o Estoque Fácil.
              30 dias gratuitos, sem burocracia.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-10 py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:scale-105"
              >
                Começar teste gratuito
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-10 py-4 border-2 border-white/50 text-white hover:border-white rounded-xl font-bold text-lg transition-all duration-300">
                Falar com consultor
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-950 text-gray-400 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-14">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center mb-4">
                  <AnimatedLogo size="small" />
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  ERP simplificado, integrado e 100% online para o empreendedor brasileiro.
                </p>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((s) => (
                    <span
                      key={s}
                      className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-colors duration-200"
                    >
                      {s[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-white font-semibold mb-4">Produto</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#funcionalidades" className="hover:text-blue-400 transition-colors">Funcionalidades</a>
                  </li>
                  <li>
                    <a href="#planos" className="hover:text-blue-400 transition-colors">Planos e Preços</a>
                  </li>
                  <li>
                    <a href="#funcionalidades" className="hover:text-blue-400 transition-colors">Integrações</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Novidades</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Roadmap</a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#depoimentos" className="hover:text-blue-400 transition-colors">Sobre nós</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Blog</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Parceiros</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Carreiras</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Imprensa</a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold mb-4">Suporte</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#faq" className="hover:text-blue-400 transition-colors">Central de Ajuda</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Tutoriais em Vídeo</a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-blue-400 transition-colors">Academia</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Status do Sistema</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">Contato</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <p>© 2026 Estoque Fácil. Todos os direitos reservados.</p>
              <div className="flex gap-6">
                {['Privacidade', 'Termos de Uso', 'Cookies'].map((item) => (
                  <a key={item} href="#" className="hover:text-blue-400 transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
