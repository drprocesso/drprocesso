import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Loader2, Lock, Eye } from 'lucide-react';

interface ProcessoCompleto {
  numero_cnj: string;
  titulo_polo_ativo: string;
  titulo_polo_passivo: string;
  tipo_processo: string;
  unidade_origem: string;
  valor_causa: string;
  data_ultima_movimentacao: string;
  resumo_ultima_movimentacao_detalhado: string;
  id_processo_escavador: string;
  status: string;
}

interface CavarMaisFundoData {
  nomeCompleto: string;
  cpfParaExibicao: string;
  totalProcessosEncontradosCavarMaisFundo: number;
  processosCompletos: ProcessoCompleto[];
  consultaId: string;
}

export default function CavarMaisFundo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [cavarMaisFundoData, setCavarMaisFundoData] = useState<CavarMaisFundoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchCavarMaisFundoData = async () => {
        setIsLoading(true);
        try {
          console.log('Fetching data from n8n for session_id:', sessionId);
          const response = await fetch(`https://drprocesso.app.n8n.cloud/webhook/get-cavar-fundo-data?session_id=${sessionId}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Received data from n8n:', data);

          // Validate data structure
          if (!data || !data.nomeCompleto || !data.processosCompletos || !Array.isArray(data.processosCompletos)) {
            throw new Error('Invalid data structure received from server');
          }

          // Store in localStorage for future reference
          localStorage.setItem('cavarMaisFundoData', JSON.stringify(data));
          setCavarMaisFundoData(data);
        } catch (error) {
          console.error('Error fetching cavar mais fundo data:', error);
          setError('Erro ao carregar os dados. Redirecionando...');
          
          // Redirect to home after a short delay
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCavarMaisFundoData();
    } else {
      console.warn('No session_id found in URL');
      navigate('/'); // Redirect if no session_id
    }
  }, [sessionId, navigate]);

  // Function to handle individual process upsell - now scrolls to upsell section
  const handleProcessUpsell = (numeroCnj: string) => {
    document.getElementById('upsell-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle general upsell
  const handleGeneralUpsell = () => {
    const baseUrl = 'https://buy.stripe.com/test_9B6eVc5hTbME5yJagPbwk01';
    const params = new URLSearchParams();
    
    // CRITICAL: Add consultaId as client_reference_id
    if (cavarMaisFundoData?.consultaId) {
      params.append('client_reference_id', cavarMaisFundoData.consultaId);
    }
    
    // Add the session_id as metadata for additional tracking
    if (sessionId) {
      params.append('metadata[session_id]', sessionId);
    }
    
    // Add consultation ID as metadata as well (for redundancy)
    if (cavarMaisFundoData?.consultaId) {
      params.append('metadata[consulta_id]', cavarMaisFundoData.consultaId);
    }
    
    const stripeCheckoutUrl = `${baseUrl}?${params.toString()}`;
    console.log('Opening Stripe checkout with consultaId as client_reference_id:', cavarMaisFundoData?.consultaId);
    window.open(stripeCheckoutUrl, '_blank');
  };

  // Function to get status color based on status value
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === 'ATIVO') {
      return 'text-green-600';
    } else if (normalizedStatus === 'ARQUIVADO' || normalizedStatus === 'INATIVO') {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          {/* Logo */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-16"
          >
            <img src="/Dr-Processo-Logo.webp" alt="Dr. Processo" className="h-20 object-contain mb-4" />
            <h2 className="text-xl text-gray-600">Carregando seus dados completos...</h2>
          </motion.div>

          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-teal-600" />
            </motion.div>
            
            <p className="text-lg text-teal-600 font-medium">
              Preparando sua lista completa de processos...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !cavarMaisFundoData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-16"
          >
            <img src="/Dr-Processo-Logo.webp" alt="Dr. Processo" className="h-20 object-contain mb-4" />
          </motion.div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Erro ao carregar dados</h2>
            <p className="text-red-600 mb-6">{error || 'Não foi possível carregar os dados da consulta.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
            >
              Voltar ao início
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <img src="/Dr-Processo-Logo.webp" alt="Dr. Processo" className="h-20 object-contain mb-4" />
        </motion.div>

        {/* Main Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Parabéns, <span className="text-teal-600">{cavarMaisFundoData.nomeCompleto}</span>!
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Sua busca profunda revelou <span className="font-bold text-teal-600">{cavarMaisFundoData.totalProcessosEncontradosCavarMaisFundo} processos</span> vinculados ao seu CPF. Veja a lista completa abaixo!
          </p>
        </motion.div>

        {/* Process Cards Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Lista Completa dos Seus Processos
          </h2>

          <div className="grid gap-8">
            {cavarMaisFundoData.processosCompletos.map((processo, index) => (
              <motion.div
                key={processo.id_processo_escavador || index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <FileText className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Processo nº {processo.numero_cnj}
                    </h3>
                    <p className={`text-sm font-semibold mb-4 ${getStatusColor(processo.status)}`}>
                      Status: {processo.status}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Polo Ativo:</p>
                        <p className="text-gray-600">{processo.titulo_polo_ativo}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Polo Passivo:</p>
                        <p className="text-gray-600">{processo.titulo_polo_passivo}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Tipo de Ação:</p>
                        <p className="text-gray-600">{processo.tipo_processo}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Origem:</p>
                        <p className="text-gray-600">{processo.unidade_origem}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blurred Content Section */}
                <div className="space-y-4 mb-6">
                  {/* Valor da Causa - Blurred */}
                  <div className="relative">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Valor da Causa:</p>
                    <div className="relative">
                      <div style={{ filter: 'blur(5px)' }} className="text-lg font-bold text-green-600">
                        {processo.valor_causa}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-bold">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Valor a ser Desbloqueado
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Última Movimentação - Blurred */}
                  <div className="relative">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Última Movimentação ({processo.data_ultima_movimentacao}):
                    </p>
                    <div className="relative">
                      <div style={{ filter: 'blur(5px)' }} className="text-gray-700 leading-relaxed">
                        {processo.resumo_ultima_movimentacao_detalhado}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-bold">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Movimentação Detalhada Bloqueada
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upsell Button for Individual Process */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleProcessUpsell(processo.numero_cnj)}
                    className="bg-gray-200 text-teal-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2 border-2 border-teal-200"
                  >
                    <Eye className="w-6 h-6" />
                    Quero acompanhar este processo pelo WhatsApp!
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Persuasive Upsell Section */}
        <motion.div
          id="upsell-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Quer ter controle total e saber de tudo NA HORA?
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Você já deu o primeiro passo! Agora, leve sua tranquilidade ao próximo nível. 
              Ao assinar o acompanhamento mensal, você terá o processo que escolher completamente desbloqueado, 
              receberá resumos em português, e notificações em tempo real direto no seu WhatsApp.
            </p>

            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                O que você ganha com o acompanhamento:
              </h3>
              <ul className="text-left space-y-2 text-gray-700 max-w-2xl mx-auto">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Processo Completamente Desbloqueado:</strong> Veja valores, movimentações detalhadas e tudo mais</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Resumos em Português:</strong> Sem juridiquês, direto no seu WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Alertas Instantâneos:</strong> Saiba de cada movimentação antes do seu advogado</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Suporte VIP:</strong> Atendimento prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleGeneralUpsell}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Acompanhar TUDO Pelo Whatsapp!
            </button>

            <p className="text-xl text-gray-700 mt-2 font-semibold">
              R$ 29,90/mês
            </p>

            <p className="text-sm text-gray-600 mt-4">
              * Cancele quando quiser, sem fidelidade
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>Dr. Processo © Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}