import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, FileText, X, Eye, Lock, SearchX, Users, Unlock, MessageSquare, Bell, MessageCircleQuestion, Award, Watch } from 'lucide-react';

interface AlertaData {
  id: string;
  whatsapp: string;
  nome: string;
  status: string;
  cpf: string;
  email: string;
  total_processos_alerta: number;
  processo_exibicao_borrado: string | {
    nome_envolvido: string;
    numero_cnj: string;
    resumo_borrado: string;
  };
  possui_processo_real_card: boolean;
  created_at: string;
  updated_at: string;
  mensagemNaoEncontrado?: string;
}

export default function Alerta() {
  const navigate = useNavigate();
  const [alertaData, setAlertaData] = useState<AlertaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

  useEffect(() => {
    console.log('Alerta.tsx: Starting to load alertaData from localStorage');
    
    // Get alerta data from localStorage
    const alertaDataString = localStorage.getItem('alertaData');
    console.log('Alerta.tsx: Raw alertaData from localStorage:', alertaDataString);
    
    if (alertaDataString) {
      try {
        const data = JSON.parse(alertaDataString);
        console.log('Alerta.tsx: Parsed alertaData:', data);
        
        // More flexible validation - just check if we have the essential fields
        if (data && typeof data === 'object' && data.id && data.total_processos_alerta !== undefined) {
          console.log('Alerta.tsx: Data validation passed, setting alertaData');
          setAlertaData(data);
        } else {
          console.warn('Alerta.tsx: Data validation failed - missing essential fields:', data);
          console.warn('Alerta.tsx: Required fields check - id:', !!data.id, 'total_processos_alerta:', data.total_processos_alerta);
          navigate('/');
        }
      } catch (error) {
        console.error('Alerta.tsx: Error parsing alerta data:', error);
        navigate('/');
      }
    } else {
      console.warn('Alerta.tsx: No alertaData found in localStorage');
      // No data found, redirect to home
      navigate('/');
    }
    
    setIsLoading(false);
  }, [navigate]);

  // Generate fictitious cards for additional processes
  const generateFictitiousCards = (count: number) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push({
        id: `fictitious-${i}`,
        nome: 'Processo em seu nome (Confidencial)',
        numero: 'XXXXXXXXXXXXXX.XXXX.X.XX.XXXX',
        resumo: 'Última movimentação: [Detalhes Confidenciais]. Status atual: [Informação Protegida]. Próximas ações: [Dados Sigilosos]. Valor envolvido: [Quantia Reservada]. Prazo: [Data Oculta].'
      });
    }
    return cards;
  };

  // Parse processo_exibicao_borrado if it's a string
  const getProcessoExibicao = () => {
    if (!alertaData?.processo_exibicao_borrado) return null;
    
    if (typeof alertaData.processo_exibicao_borrado === 'string') {
      try {
        return JSON.parse(alertaData.processo_exibicao_borrado);
      } catch (error) {
        console.error('Alerta.tsx: Error parsing processo_exibicao_borrado string:', error);
        return null;
      }
    }
    
    return alertaData.processo_exibicao_borrado;
  };

  // Function to handle Stripe checkout
  const handleStripeCheckout = () => {
    const baseUrl = 'https://go.unicornify.com.br/pc41lvfs7g';
    const params = new URLSearchParams();
    
    // CRITICAL: Add consultaId as client_reference_id
    if (alertaData?.id) {
      params.append('client_reference_id', alertaData.id);
    }
    
    // Add customer email if available
    if (alertaData?.email) {
      params.append('customer_email', alertaData.email);
    }
    
    const stripeCheckoutUrl = `${baseUrl}?${params.toString()}`;
    console.log('Opening Stripe checkout with consultaId as client_reference_id:', alertaData?.id);
    window.open(stripeCheckoutUrl, '_blank');
  };

  if (isLoading) {
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
            <h2 className="text-xl text-gray-600">Carregando resultados...</h2>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!alertaData) {
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
            <h2 className="text-2xl font-bold text-red-800 mb-4">Dados não encontrados</h2>
            <p className="text-red-600 mb-6">Não foi possível carregar os dados da consulta.</p>
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

  // Check if no processes were found
  const noProcessesFound = alertaData.mensagemNaoEncontrado || alertaData.total_processos_alerta === 0;

  if (noProcessesFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          {/* Logo */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-16"
          >
            <img src="/Dr-Processo-Logo.webp" alt="Dr. Processo" className="h-20 object-contain mb-4" />
          </motion.div>

          {/* No Processes Found Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-blue-100 p-8 rounded-full">
                <SearchX className="w-20 h-20 text-blue-600" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Não encontramos nenhum processo no seu nome ou CPF
            </motion.h1>

            {/* Explanation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12"
            >
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Sua busca inicial não retornou processos vinculados ao CPF/nome informado. 
                Isso não significa que você não tenha direitos ou que não haja outros registros em diferentes bases.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Por que isso pode acontecer?
                </h3>
                <ul className="text-left space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Processos muito antigos podem estar arquivados em bases diferentes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Alguns tribunais têm sistemas separados não integrados
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Processos recém-distribuídos podem não aparecer imediatamente
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Variações no nome ou grafia podem afetar a busca
                  </li>
                </ul>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Podemos tentar uma busca mais profunda com nossa funcionalidade 
                <span className="font-semibold text-teal-600"> "Cavar Mais Fundo"</span>, 
                ou você pode revisar os dados e tentar novamente.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/')}
                className="bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Fazer nova consulta
              </button>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Entender "Cavar Mais Fundo"
              </button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-12 text-center"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-semibold">Lembre-se:</span> A ausência de processos na busca inicial 
                  é comum e não indica necessariamente que você não possui direitos ou ações judiciais. 
                  Muitas vezes, uma busca mais aprofundada revela informações importantes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-gray-600">
          <p>Dr. Processo © Todos os direitos reservados.</p>
        </footer>

        {/* Modal de Planos - Simplified for "Cavar Mais Fundo" explanation */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-8">
                  <div className="bg-teal-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Eye className="w-10 h-10 text-teal-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Você está a um passo de descobrir tudo que seu advogado não te conta, diretamente no seu WhatsApp.
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8">
                    Desbloqueie os detalhes do seu processo e tenha controle total da sua vida jurídica.
                  </p>
                </div>

                {/* Single Plan Section */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-300 rounded-xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    ACOMPANHAMENTO COMPLETO
                  </h3>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-center">
                    A solução definitiva para nunca mais se sentir no escuro. Receba tudo sobre SEU processo, em tempo real, com a clareza que só o Dr. Processo oferece.
                  </p>
                  
                  <div className="bg-white border border-teal-200 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">O que você vai receber:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Visão 360°:</strong> A lista completa de todos os processos em seu nome, até o que você não sabia.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Identificação Detalhada:</strong> Número do processo, tipo de ação, de onde o processo é (Tribunal/Comarca).</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Partes Envolvidas:</strong> Quem são as partes (você, empresas, outras pessoas).</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Unlock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Processo Desbloqueado:</strong> Acesse todos os detalhes do processo que VOCÊ escolher (Valor, Movimentações, etc.), sem nada bloqueado.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Resumos Exclusivos:</strong> Movimentações do seu processo traduzidas em linguagem simples (sem juridiquês), direto no seu WhatsApp.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Alertas Instantâneos:</strong> Notificações no seu WhatsApp a CADA nova atualização do seu processo. Seu processo andou? Vc vai saber antes do seu advogado!</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageCircleQuestion className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Tire suas dúvidas:</strong> sobre seu processo com o Dr Processo pelo whatsapp. Seu advogado não quis te explicar? O Dr. Processo vai tirar todas as suas dúvidas, a qualquer hora do dia!</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Suporte VIP:</strong> Atendimento direto e prioritário via WhatsApp.</span>
                      </div>
                      <div className="flex items-start gap-3 md:col-span-2">
                        <Watch className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                        <span><strong>Acompanhamento completo:</strong> via whatsapp para você ficar sabendo de todos os detalhes antes mesmo do seu advogado!</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                    <p className="text-green-800 font-semibold text-center">
                      🔓 A liberdade de ter controle total sobre seu processo, sem depender de ninguém. Sua paz de espírito vale cada centavo!
                    </p>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={handleStripeCheckout}
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-2"
                    >
                      RECEBA TUDO NO SEU WHATSAPP!
                    </button>
                    <p className="text-sm text-gray-600">
                      *Teste por 7 dias, cancele quando quiser.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // If processes were found, continue with the original layout
  const processoExibicao = getProcessoExibicao();
  const fictitiousCards = alertaData.total_processos_alerta > 1 
    ? generateFictitiousCards(alertaData.total_processos_alerta - 1) 
    : [];

  console.log('Alerta.tsx: Rendering with data:', {
    totalProcessos: alertaData.total_processos_alerta,
    processoExibicao,
    fictitiousCardsCount: fictitiousCards.length
  });

  const allCards = [processoExibicao, ...fictitiousCards].filter(Boolean);
  const totalPages = Math.ceil(allCards.length / cardsPerPage);
  const paginatedCards = allCards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
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
            Encontramos <span className="text-teal-600 font-extrabold">{alertaData.total_processos_alerta}</span> Processos Judiciais Vinculados ao Seu CPF!<br />
            <span className="text-red-600">Mas as informações cruciais estão aguardando seu desbloqueio.</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Você está a um passo de entender o que realmente acontece. Para proteger seus direitos e ter total clareza, é fundamental acessar os detalhes completos.
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
            Seus Processos Encontrados
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cards paginated */}
            {paginatedCards.map((card: any, index: number) => (
              <motion.div
                key={card.id || index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + (index * 0.2) }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={card.nome_envolvido ? "bg-teal-100 p-3 rounded-lg" : "bg-gray-100 p-3 rounded-lg"}>
                    <FileText className={card.nome_envolvido ? "w-8 h-8 text-teal-600" : "w-8 h-8 text-gray-600"} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {card.nome_envolvido || card.nome}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Processo nº <span style={{ filter: 'blur(5px)' }} className="font-mono">
                        {card.numero_cnj || card.numero}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="relative mb-6">
                  <div style={{ filter: 'blur(5px)' }} className="text-gray-700 leading-relaxed">
                    {card.resumo_borrado || card.resumo}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-center shadow-lg">
                      <Lock className="w-5 h-5 inline mr-2" />
                      Detalhes Cruciais Ocultos<br />
                      <span className="text-sm">Desbloqueie para Ver!</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full bg-gradient-to-r ${card.nome_envolvido ? 'from-teal-600 to-teal-700' : 'from-gray-600 to-gray-700'} text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                >
                  <Eye className="w-5 h-5" />
                  Desbloquear Processo
                </button>
              </motion.div>
            ))}
          </div>
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Anterior</button>
              <span className="px-4 py-2">Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Próxima</button>
            </div>
          )}
        </motion.div>

        {/* "Cavar Mais Fundo" Alert */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-amber-100 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-800 mb-4">
                  Alerta Dr. Processo: Identificamos {alertaData.total_processos_alerta} Processos, mas pode haver mais!
                </h3>
                <p className="text-amber-700 leading-relaxed mb-6">
                  A busca inicial mostra alguns dos seus processos, mas devido à complexidade do sistema jurídico brasileiro, 
                  processos arquivados, recém-distribuídos ou em outras jurisdições podem não aparecer nesta lista preliminar. 
                  Para ter uma visão 100% completa e confiável, incluindo todos os processos antigos, arquivados ou aqueles 
                  que estão ocultos na busca simples, utilize o recurso Cavar Mais Fundo.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cavar Mais Fundo!
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>Dr. Processo © Todos os direitos reservados.</p>
      </footer>

      {/* Unified Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="bg-teal-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-teal-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Você está a um passo de descobrir tudo que seu advogado não te conta, diretamente no seu WhatsApp.
                </h2>
                
                <p className="text-xl text-gray-600 mb-8">
                  Desbloqueie os detalhes do seu processo e tenha controle total da sua vida jurídica.
                </p>
              </div>

              {/* Single Plan Section */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-300 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  ACOMPANHAMENTO COMPLETO
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  A solução definitiva para nunca mais se sentir no escuro. Receba tudo sobre SEU processo, em tempo real, com a clareza que só o Dr. Processo oferece.
                </p>
                
                <div className="bg-white border border-teal-200 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">O que você vai receber:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Visão 360°:</strong> A lista completa de todos os processos em seu nome, até o que você não sabia.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Identificação Detalhada:</strong> Número do processo, tipo de ação, de onde o processo é (Tribunal/Comarca).</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Partes Envolvidas:</strong> Quem são as partes (você, empresas, outras pessoas).</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Unlock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Processo Desbloqueado:</strong> Acesse todos os detalhes do processo que VOCÊ escolher (Valor, Movimentações, etc.), sem nada bloqueado.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Resumos Exclusivos:</strong> Movimentações do seu processo traduzidas em linguagem simples (sem juridiquês), direto no seu WhatsApp.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Alertas Instantâneos:</strong> Notificações no seu WhatsApp a CADA nova atualização do seu processo. Seu processo andou? Vc vai saber antes do seu advogado!</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircleQuestion className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Tire suas dúvidas:</strong> sobre seu processo com o Dr Processo pelo whatsapp. Seu advogado não quis te explicar? O Dr. Processo vai tirar todas as suas dúvidas, a qualquer hora do dia!</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Suporte VIP:</strong> Atendimento direto e prioritário via WhatsApp.</span>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <Watch className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span><strong>Acompanhamento completo:</strong> via whatsapp para você ficar sabendo de todos os detalhes antes mesmo do seu advogado!</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-green-800 font-semibold text-center">
                    🔓 A liberdade de ter controle total sobre seu processo, sem depender de ninguém. Sua paz de espírito vale cada centavo!
                  </p>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleStripeCheckout}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-2"
                  >
                    RECEBA TUDO NO SEU WHATSAPP!
                  </button>
                  <p className="text-sm text-gray-600">
                    *Teste por 7 dias, cancele quando quiser.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}