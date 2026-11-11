import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Building2, MapPin, Briefcase, FileText, AtSign, Search } from 'lucide-react';
import { api, AuthUser } from "../lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

const ATIVIDADES = [
  'Comércio Varejista',
  'Comércio Atacadista',
  'Distribuidora',
  'Indústria / Fabricação',
  'E-commerce',
  'Prestação de Serviços',
  'Importação / Exportação',
  'Logística / Transporte',
  'Outro',
];

function formatDoc(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regDoc, setRegDoc] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regActivity, setRegActivity] = useState('');
  const [regCep, setRegCep] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isOpen) return null;

  const fetchCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError('CEP não encontrado'); return; }
      setRegAddress(data.logradouro || '');
      setRegCity(data.localidade || '');
      setRegState(data.uf || '');
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Por favor, preencha todos os campos'); return; }
    if (!emailRegex.test(email)) { setError('Por favor, insira um e-mail válido'); return; }
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
    setSubmitting(true);
    try {
      const user = await api.login(email, password);
      onLogin(user);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regUsername || !regDoc || !regCompany || !regActivity || !regCep || !regAddress || !regCity || !regState || !regEmail || !regPassword || !regConfirm) {
      setRegError('Por favor, preencha todos os campos'); return;
    }
    if (!emailRegex.test(regEmail)) { setRegError('Por favor, insira um e-mail válido'); return; }
    if (regPassword.length < 8) { setRegError('A senha deve ter pelo menos 8 caracteres'); return; }
    if (regPassword !== regConfirm) { setRegError('As senhas não coincidem'); return; }
    setSubmitting(true);
    try {
      await api.register({
        fullName: regName,
        username: regUsername,
        document: regDoc,
        companyName: regCompany,
        activity: regActivity,
        cep: regCep,
        address: regAddress,
        city: regCity,
        state: regState,
        email: regEmail,
        password: regPassword,
      });
      setRegSuccess(true);
      setEmail(regEmail);
      setTimeout(() => { setRegSuccess(false); setMode('login'); }, 2000);
    } catch (registerError) {
      setRegError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError(''); setRegError(''); setRegSuccess(false);
    setEmail(''); setPassword('');
    setRegName(''); setRegUsername(''); setRegDoc(''); setRegCompany('');
    setRegActivity(''); setRegCep(''); setRegAddress(''); setRegCity(''); setRegState('');
    setRegEmail(''); setRegPassword(''); setRegConfirm(''); setCepError('');
  };

  const inputClass = "w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="relative rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #ffffff 70%)' }}>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition" aria-label="Fechar">
            <X className="w-6 h-6" />
          </button>

          {/* Tabs */}
          <div className="flex rounded-none overflow-hidden border-b border-gray-200 shrink-0">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${mode === 'login' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${mode === 'register' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'}`}
            >
              Criar Conta
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto p-8">
            {mode === 'login' ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Bem-vindo de volta
                  </h2>
                  <p className="text-gray-500 text-sm">Entre com suas credenciais para acessar o sistema</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} className={inputClass} placeholder="seu@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm" placeholder="Digite sua senha" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Esqueceu a senha?</a>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl">
                    {submitting ? 'Entrando...' : 'Entrar no Sistema'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Criar Conta
                  </h2>
                  <p className="text-gray-500 text-sm">Preencha os dados abaixo para se cadastrar</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  {/* Nome completo */}
                  <div>
                    <label className={labelClass}>Nome completo *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={regName} onChange={(e) => { setRegName(e.target.value); setRegError(''); }} className={inputClass} placeholder="Seu nome completo" />
                    </div>
                  </div>

                  {/* Nome de usuário */}
                  <div>
                    <label className={labelClass}>Nome de usuário *</label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={regUsername} onChange={(e) => { setRegUsername(e.target.value.replace(/\s/g, '')); setRegError(''); }} className={inputClass} placeholder="usuario123" />
                    </div>
                  </div>

                  {/* Documentação (CPF/CNPJ) */}
                  <div>
                    <label className={labelClass}>CPF / CNPJ *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={regDoc}
                        onChange={(e) => { setRegDoc(formatDoc(e.target.value)); setRegError(''); }}
                        className={inputClass}
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        maxLength={18}
                      />
                    </div>
                  </div>

                  {/* Nome da empresa */}
                  <div>
                    <label className={labelClass}>Nome da empresa *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={regCompany} onChange={(e) => { setRegCompany(e.target.value); setRegError(''); }} className={inputClass} placeholder="Nome da sua empresa" />
                    </div>
                  </div>

                  {/* Atividade */}
                  <div>
                    <label className={labelClass}>Atividade *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        value={regActivity}
                        onChange={(e) => { setRegActivity(e.target.value); setRegError(''); }}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm appearance-none"
                      >
                        <option value="">Selecione a atividade</option>
                        {ATIVIDADES.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* CEP */}
                  <div>
                    <label className={labelClass}>CEP *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={regCep}
                        onChange={(e) => {
                          const formatted = e.target.value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
                          setRegCep(formatted);
                          setRegError('');
                          setCepError('');
                        }}
                        onBlur={() => fetchCep(regCep)}
                        className={`${inputClass} pr-10`}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      <button
                        type="button"
                        onClick={() => fetchCep(regCep)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                        title="Buscar CEP"
                      >
                        {cepLoading ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className={labelClass}>Endereço *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={regAddress} onChange={(e) => { setRegAddress(e.target.value); setRegError(''); }} className={inputClass} placeholder="Rua, número, complemento" />
                    </div>
                  </div>

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className={labelClass}>Cidade *</label>
                      <input type="text" value={regCity} onChange={(e) => { setRegCity(e.target.value); setRegError(''); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm" placeholder="Cidade" />
                    </div>
                    <div>
                      <label className={labelClass}>UF *</label>
                      <input type="text" value={regState} onChange={(e) => { setRegState(e.target.value.toUpperCase().slice(0, 2)); setRegError(''); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm" placeholder="UF" maxLength={2} />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className={labelClass}>E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={regEmail} onChange={(e) => { setRegEmail(e.target.value); setRegError(''); }} className={inputClass} placeholder="seu@email.com" />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label className={labelClass}>Senha *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={(e) => { setRegPassword(e.target.value); setRegError(''); }} className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm" placeholder="Mínimo 8 caracteres" />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar senha */}
                  <div>
                    <label className={labelClass}>Confirmar senha *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showRegConfirm ? 'text' : 'password'} value={regConfirm} onChange={(e) => { setRegConfirm(e.target.value); setRegError(''); }} className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm" placeholder="Repita a senha" />
                      <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {regError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      {regError}
                    </div>
                  )}

                  {regSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Conta criada com sucesso! Redirecionando para o login...
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl mt-2">
                    {submitting ? 'Criando conta...' : 'Criar Conta'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
