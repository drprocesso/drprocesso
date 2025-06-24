import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProcessItem {
  id: number;
  numero: string;
  nome: string;
  display: string;
}

export default function Resultados() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const consultaId = searchParams.get('consultaId');
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!consultaId) {
      navigate('/');
      return;
    }

    const fetchProcesses = async () => {
      try {
        // Query the consultas table using consultaId
        const { data, error } = await supabase
          .from('consultas')
          .select('processo_exibicao_borrado')
          .eq('id', consultaId)
          .single();

        if (error) {
          throw error;
        }

        if (data && data.processo_exibicao_borrado && Array.isArray(data.processo_exibicao_borrado)) {
          setProcesses(data.processo_exibicao_borrado);
        } else {
          setError('Nenhum resultado encontrado para esta consulta.');
        }
      } catch (err) {
        console.error('Error fetching processes:', err);
        setError('Erro ao carregar os processos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, [consultaId, navigate]);

  const handleSelectProcess = async (process: ProcessItem) => {
    setIsSubmitting(true);
    
    try {
      // Update the existing consultas record with the selected process
      const { error } = await supabase
        .from('consultas')
        .update({
          status: 'selected',
          processo_exibicao_borrado: {
            selected_process: {
              id: process.id,
              numero: process.numero,
              nome: process.nome,
              display: process.display
            }
          }
        })
        .eq('id', consultaId);

      if (error) {
        throw error;
      }

      // Redirect to confirmation page
      navigate('/confirmado');
    } catch (err) {
      console.error('Error submitting process selection:', err);
      setError('Erro ao selecionar o processo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
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
            <h2 className="text-xl text-gray-600">Carregando seus resultados...</h2>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-teal-600" />
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
            <h2 className="text-2xl font-bold text-red-800 mb-4">Ops! Algo deu errado</h2>
            <p className="text-red-600 mb-6">{error}</p>
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

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Escolha o processo
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Foram encontrados <span className="font-semibold text-teal-600">{processes.length} processos</span> no seu nome.<br />
            Selecione um deles para consultar os detalhes de forma simples e sem juridiquês.
          </p>
        </motion.div>

        {/* Process Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {processes.map((process, index) => (
            <motion.div
              key={process.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {process.nome}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Processo nº {process.numero}
                  </p>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {process.display}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectProcess(process)}
                  disabled={isSubmitting}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Selecionando...
                    </>
                  ) : (
                    <>
                      Selecionar este processo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No processes found */}
        {processes.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              Nenhum processo encontrado
            </h2>
            <p className="text-yellow-700 mb-6">
              Não foram encontrados processos em seu nome nos tribunais consultados.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
            >
              Fazer nova consulta
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>Dr. Processo © Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}