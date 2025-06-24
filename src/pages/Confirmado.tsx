import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Confirmado() {
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
        </motion.div>

        {/* Success Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Processo selecionado com sucesso!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-gray-600 mb-12 leading-relaxed"
          >
            Perfeito! Agora vamos analisar os detalhes do seu processo e preparar um relatório completo e fácil de entender.
          </motion.p>

          {/* Info Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
              </div>
              <p className="text-gray-600">
                Você receberá o relatório detalhado do seu processo diretamente no seu WhatsApp em até 24 horas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">E-mail</h3>
              </div>
              <p className="text-gray-600">
                Uma cópia do relatório também será enviada para o seu e-mail cadastrado.
              </p>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-amber-800 mb-3">
              ⚠️ Importante
            </h3>
            <p className="text-amber-700">
              Mantenha seu WhatsApp ativo e verifique também sua caixa de entrada e spam no e-mail. 
              Nosso relatório conterá informações valiosas sobre o andamento do seu processo.
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Fazer nova consulta
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>Dr. Processo © Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}