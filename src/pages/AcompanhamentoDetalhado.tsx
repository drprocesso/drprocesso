import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, Eye, X, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

interface AcompanhamentoDetalhadoData {
  nomeCompleto: string;
  cpfParaExibicao: string;
  totalProcessosEncontradosCavarMaisFundo: number;
  processosCompletos: ProcessoCompleto[];
  consultaId: string;
}

interface UserData {
  whatsapp: string;
  email: string;
  cpf: string;
  nome: string;
}

export default function AcompanhamentoDetalhado() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [acompanhamentoData, setAcompanhamentoData] = useState<AcompanhamentoDetalhadoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcessCnj, setSelectedProcessCnj] = useState<string>('');
  const [confirmedProcessCnj, setConfirmedProcessCnj] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionId) {
      const fetchAcompanhamentoData = async () => {
        setIsLoading(true);
        try {
          console.log('Fetching data from n8n for session_id:', sessionId);
          const response = await fetch(`https://drprocesso.app.n8n.cloud/webhook/get-detailed-data?session_id=${sessionId}`);
          
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
          localStorage.setItem('acompanhamentoDetalhadoData', JSON.stringify(data));
          setAcompanhamentoData(data);
        } catch (error) {
          console.error('Error fetching acompanhamento detalhado data:', error);
          setError('Erro ao carregar os dados. Redirecionando...');
          
          // Redirect to home after a short delay
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAcompanhamentoData();
    } else {
      console.warn('No session_id found in URL');
      navigate('/'); // Redirect if no session_id
    }
  }, [sessionId, navigate]);

  // Function to handle opening the confirmation modal
  const handleOpenConfirmModal = (numeroCnj: string) => {
    // Only allow opening modal if no process has been confirmed yet
    if (confirmedProcessCnj === null) {
      setSelectedProcessCnj(numeroCnj);
      setIsModalOpen(true);
    }
  };

  // Function to handle confirmation of process tracking
  const handleConfirmAcompanhamento = async () => {
    if (!acompanhamentoData || !selectedProcessCnj) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting confirmation process for:', selectedProcessCnj);
      
      // 1. Fetch user data from consultas table
      const { data: consultaData, error: consultaError } = await supabase
        .from('consultas')
        .select('whatsapp, email, cpf, nome')
        .eq('id', acompanhamentoData.consultaId)
        .single();

      if (consultaError) {
        throw new Error(`Erro ao buscar dados do usuário: ${consultaError.message}`);
      }

      if (!consultaData) {
        throw new Error('Dados do usuário não encontrados');
      }

      console.log('User data fetched:', consultaData);

      // 2. Find the selected process details
      const selectedProcess = acompanhamentoData.processosCompletos.find(
        processo => processo.numero_cnj === selectedProcessCnj
      );

      if (!selectedProcess) {
        throw new Error('Processo selecionado não encontrado');
      }

      console.log('Selected process details:', selectedProcess);

      // 3. Prepare webhook payload
      const webhookPayload = {
        // User data
        userData: {
          nome: consultaData.nome || acompanhamentoData.nomeCompleto,
          whatsapp: consultaData.whatsapp,
          email: consultaData.email,
          cpf: consultaData.cpf
        },
        // Process data
        processData: {
          numero_cnj: selectedProcess.numero_cnj,
          titulo_polo_ativo: selectedProcess.titulo_polo_ativo,
          titulo_polo_passivo: selectedProcess.titulo_polo_passivo,
          tipo_processo: selectedProcess.tipo_processo,
          unidade_origem: selectedProcess.unidade_origem,
          valor_causa: selectedProcess.valor_causa,
          data_ultima_movimentacao: selectedProcess.data_ultima_movimentacao,
          resumo_ultima_movimentacao_detalhado: selectedProcess.resumo_ultima_movimentacao_detalhado,
          id_processo_escavador: selectedProcess.id_processo_escavador,
          status: selectedProcess.status
        },
        // Additional metadata
        consultaId: acompanhamentoData.consultaId,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      };

      console.log('Sending webhook payload:', webhookPayload);

      // 4. Send webhook to n8n
      const webhookResponse = await fetch('https://drprocesso.app.n8n.cloud/webhook/resumo-ia-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }

      console.log('Webhook sent successfully');

      // 5. Update state to mark this process as confirmed
      setConfirmedProcessCnj(selectedProcessCnj);
      
      // Close modal and reset selection
      setIsModalOpen(false);
      setSelectedProcessCnj('');

      console.log('Process confirmation completed successfully');

    } catch (error) {
      console.error('Error confirming process tracking:', error);
      setError(`Erro ao confirmar acompanhamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
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

  // Function to get button content based on confirmation status
  const getButtonContent = (numeroCnj: string) => {
    if (confirmedProcessCnj === numeroCnj) {
      return {
        text: 'PROCESSO SELECIONADO',
        icon: <CheckCircle className="w-6 h-6" />,
        className: 'bg-green-600 text-white cursor-not-allowed',
        disabled: true
      };
    } else if (confirmedProcessCnj !== null) {
      return {
        text: 'BLOQUEADO',
        icon: <Lock className="w-6 h-6" />,
        className: 'bg-gray-400 text-white cursor-not-allowed',
        disabled: true
      };
    } else {
      return {
        text: 'Acompanhar este processo no Whatsapp',
        icon: <Eye className="w-6 h-6" />,
        className: 'bg-teal-600 text-white hover:bg-teal-700',
        disabled: false
      };
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

  if (error || !acompanhamentoData) {
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
            Parabéns, <span className="text-teal-600">{acompanhamentoData.nomeCompleto}</span>!
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Sua busca profunda revelou <span className="font-bold text-teal-600">{acompanhamentoData.totalProcessosEncontradosCavarMaisFundo} processos</span> vinculados ao seu CPF. 
            {confirmedProcessCnj ? (
              <span className="block mt-2 text-green-600 font-semibold">
                ✅ Processo selecionado para acompanhamento!
              </span>
            ) : (
              <span className="block mt-2">
                Selecione um processo para acompanhar via WhatsApp.
              </span>
            )}
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
            {acompanhamentoData.processosCompletos.map((processo, index) => {
              const buttonConfig = getButtonContent(processo.numero_cnj);
              
              return (
                <motion.div
                  key={processo.id_processo_escavador || index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden ${
                    confirmedProcessCnj === processo.numero_cnj ? 'ring-2 ring-green-500' : 
                    confirmedProcessCnj !== null && confirmedProcessCnj !== processo.numero_cnj ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${
                      confirmedProcessCnj === processo.numero_cnj ? 'bg-green-100' : 'bg-teal-100'
                    }`}>
                      <FileText className={`w-8 h-8 ${
                        confirmedProcessCnj === processo.numero_cnj ? 'text-green-600' : 'text-teal-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Processo nº {processo.numero_cnj}
                        {confirmedProcessCnj === processo.numero_cnj && (
                          <span className="ml-2 text-green-600 text-sm font-normal">
                            (Selecionado para acompanhamento)
                          </span>
                        )}
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

                  {/* Unlocked Content Section */}
                  <div className="space-y-4 mb-6">
                    {/* Valor da Causa */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Valor da Causa:</p>
                      <div className="text-lg font-bold text-green-600">
                        {processo.valor_causa}
                      </div>
                    </div>

                    {/* Última Movimentação */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Última Movimentação ({processo.data_ultima_movimentacao}):
                      </p>
                      <div className="text-gray-700 leading-relaxed">
                        {processo.resumo_ultima_movimentacao_detalhado}
                      </div>
                    </div>
                  </div>

                  {/* Process Tracking Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleOpenConfirmModal(processo.numero_cnj)}
                      disabled={buttonConfig.disabled}
                      className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2 ${buttonConfig.className}`}
                    >
                      {buttonConfig.icon}
                      {buttonConfig.text}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>Dr. Processo © Todos os direitos reservados.</p>
      </footer>

      {/* Confirmation Modal */}
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
              className="bg-white rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-amber-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Confirmar Acompanhamento
                </h2>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                  <p className="text-lg text-amber-800 leading-relaxed">
                    <strong>Importante:</strong> O plano adquirido permite acompanhar 1 processo por vez. 
                    Ao selecionar este processo, você não poderá acompanhar outros simultaneamente a não ser 
                    que faça um upgrade para um plano mensal com múltiplos acompanhamentos. 
                    Tem certeza que deseja iniciar o acompanhamento deste processo?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleConfirmAcompanhamento}
                    disabled={isSubmitting}
                    className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Confirmar e Acompanhar'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}