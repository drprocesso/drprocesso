import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const loadingMessages = [
  'Verificando CPF...',
  'Buscando nome completo...',
  'Procurando nos tribunais...',
  'Organizando os dados...',
  'Analisando processos encontrados...',
  'Preparando relatório detalhado...'
];

export default function Loading() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultaId = searchParams.get('consultaId');
  const [currentMessage, setCurrentMessage] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    // If no consultaId, redirect to home
    if (!consultaId) {
      navigate('/');
      return;
    }

    // Check if alertaData is already in localStorage
    const alertaDataString = localStorage.getItem('alertaData');
    
    if (alertaDataString) {
      try {
        const alertaData = JSON.parse(alertaDataString);
        
        // Validate that we have meaningful data
        if (alertaData && 
            typeof alertaData === 'object' && 
            Object.keys(alertaData).length > 0) {
          
          console.log('Webhook data found in localStorage, redirecting to /alerta');
          
          // Short delay for visual transition, then redirect
          setTimeout(() => {
            navigate('/alerta');
          }, 2000);
          return;
        }
      } catch (error) {
        console.error("Error parsing alertaData from localStorage:", error);
        // Remove corrupted data
        localStorage.removeItem('alertaData');
      }
    }

    // If no data found, redirect back to home after a short delay
    setTimeout(() => {
      console.warn("No webhook data found. Redirecting to home.");
      navigate('/?error=no-data');
    }, 5000);

    // Message rotation every 3 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    // Time counter every second
    const timeCounter = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(messageInterval);
      clearInterval(timeCounter);
    };
  }, [navigate, consultaId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <h2 className="text-xl text-gray-600">Processando sua consulta...</h2>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Sua consulta foi processada com sucesso!
          </h1>
          
          <p className="text-xl text-gray-600">
            Estamos finalizando os últimos detalhes. Você será redirecionado em instantes.
          </p>

          {/* Loader */}
          <div className="flex flex-col items-center gap-6 py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-teal-600" />
            </motion.div>
            
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-teal-600 font-medium"
            >
              {loadingMessages[currentMessage]}
            </motion.p>

            {/* Time Counter */}
            <div className="text-sm text-gray-500">
              Tempo decorrido: {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-teal-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Finalizando processamento...
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