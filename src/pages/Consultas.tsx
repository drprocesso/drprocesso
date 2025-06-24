import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Consultas() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsapp: '',
    email: '',
    document: '',
    consent: false
  });

  const [formErrors, setFormErrors] = useState({
    whatsapp: false,
    email: false,
    document: false
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    question: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsContactModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateWhatsapp = (whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, '');
    return numbers.length === 11 && !numbers.startsWith('0');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Validate all fields
    const errors = {
      whatsapp: !validateWhatsapp(formData.whatsapp),
      email: !validateEmail(formData.email),
      document: !validateCPF(formData.document)
    };

    setFormErrors(errors);

    // If there are any errors, don't submit
    if (Object.values(errors).some(error => error)) {
      return;
    }

    setIsLoading(true);

    try {
      // Clean up phone and CPF
      const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
      const cleanCPF = formData.document.replace(/\D/g, '');

      console.log('Starting form submission with data:', {
        whatsapp: cleanWhatsapp,
        email: formData.email,
        cpf: cleanCPF
      });

      // Insert into consultas table first
      const { data: consultaData, error: consultaError } = await supabase
        .from('consultas')
        .insert([{
          whatsapp: cleanWhatsapp,
          cpf: cleanCPF,
          email: formData.email,
          nome: 'Cliente', // Default placeholder
          status: 'pending'
        }])
        .select('id')
        .single();

      if (consultaError) throw consultaError;

      const consultaId = consultaData.id;
      console.log('Consulta created with ID:', consultaId);

      // Send data to webhook with consultaId
      console.log('Sending webhook request...');
      const webhookResponse = await fetch('https://drprocesso.app.n8n.cloud/webhook/callback-escavador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsapp: cleanWhatsapp,
          email: formData.email,
          document: cleanCPF,
          consultaId: consultaId
        })
      });

      console.log('Webhook response status:', webhookResponse.status);
      console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
      }

      // Clone the response to read it as text first
      const responseClone = webhookResponse.clone();
      const rawResponseText = await responseClone.text();
      console.log('Raw webhook response text:', rawResponseText);

      // Get webhook response data
      const webhookData = await webhookResponse.json();
      console.log('Parsed webhookData:', webhookData);
      
      // Store webhook response in localStorage
      localStorage.setItem('alertaData', JSON.stringify(webhookData));
      console.log('Data stored in localStorage:', localStorage.getItem('alertaData'));

      // Navigate to loading page with consultaId
      navigate(`/loading?consultaId=${consultaId}`);

      // Reset form
      setFormData({
        whatsapp: '',
        email: '',
        document: '',
        consent: false
      });
      
      // Reset errors
      setFormErrors({
        whatsapp: false,
        email: false,
        document: false
      });
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: contactForm.name,
          whatsapp: contactForm.whatsapp,
          email: contactForm.email,
          question: contactForm.question
        }]);

      if (error) throw error;

      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsContactModalOpen(false);
        setContactForm({
          name: '',
          email: '',
          whatsapp: '',
          question: ''
        });
      }, 10000);
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    setFormData({ ...formData, whatsapp: value });
    setFormErrors({ ...formErrors, whatsapp: !validateWhatsapp(value) });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    setFormErrors({ ...formErrors, email: !validateEmail(value) });
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    setFormData({ ...formData, document: value });
    setFormErrors({ ...formErrors, document: !validateCPF(value) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {/* Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-16"
        >
          <img src="/Dr-Processo-Logo.webp" alt="Dr. Processo" className="h-20 object-contain" />
        </motion.div>

        {/* Headlines */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Seu advogado some?<br />A gente te responde!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Descubra o status do seu processo direto no WhatsApp,<br />
            com uma consulta gratuita e segura.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 flex flex-col items-center"
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="max-w-lg bg-white border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-teal-50 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Como funciona? {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden w-full max-w-2xl mt-4"
              >
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                  <div className="space-y-4 text-gray-700">
                    <p>1️⃣ Preencha seus dados corretamente: WhatsApp, e-mail e CPF.</p>
                    <p>2️⃣ Usamos seu CPF para buscar automaticamente todos os processos em seu nome.</p>
                    <p>3️⃣ Você recebe no seu WhatsApp e e-mail um resumo com os processos encontrados e seus status.</p>
                    <p className="text-green-600 font-semibold">✅ A consulta é 100% gratuita, mas só é possível fazer uma, então faça valer a pena!</p>
                    <p className="text-amber-600 font-semibold">⚠️ Importante: informe um WhatsApp e um e-mail válidos, pois é por lá que vamos te enviar os resultados.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100"
        >
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp com DDD*
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out ${
                  formErrors.whatsapp ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.whatsapp}
                onChange={handleWhatsappChange}
                placeholder="(00) 00000-0000"
              />
              {formErrors.whatsapp && (
                <p className="mt-1 text-sm text-red-500">Digite um número de WhatsApp válido com DDD (11 dígitos)</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail*
              </label>
              <input
                type="email"
                id="email"
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out ${
                  formErrors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="seu@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">Digite um e-mail válido</p>
              )}
            </div>

            <div>
              <label htmlFor="document" className="block text-sm font-semibold text-gray-700 mb-2">
                CPF*
              </label>
              <input
                type="text"
                id="document"
                required
                maxLength={14}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out ${
                  formErrors.document ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.document}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
              />
              {formErrors.document && (
                <p className="mt-1 text-sm text-red-500">Digite um CPF válido (11 dígitos)</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                required
                className="mt-1.5 h-5 w-5 text-teal-600 focus:ring-2 focus:ring-teal-500 border-2 border-gray-300 rounded transition-all duration-200 ease-in-out"
                checked={formData.consent}
                onChange={(e) => setFormData({...formData, consent: e.target.checked})}
              />
              <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                Autorizo o uso dos meus dados para consulta processual e comunicação do Dr. Processo.*
              </label>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="max-w-lg bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Search size={24} />
                    Consultar Processo Grátis
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Security notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p className="flex items-center justify-center gap-2">
            <Lock size={18} /> Seus dados estão protegidos. Não enviamos spam.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <nav className="space-x-6">
            <Link to="/termos" className="hover:text-teal-600 transition-colors duration-200">Termos de uso</Link>
            <span>|</span>
            <Link to="/privacidade" className="hover:text-teal-600 transition-colors duration-200">Política de privacidade</Link>
            <span>|</span>
            <button 
              onClick={() => setIsContactModalOpen(true)} 
              className="hover:text-teal-600 transition-colors duration-200"
            >
              Contato
            </button>
          </nav>
        </div>
      </footer>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X size={24} />
              </button>

              {!isSuccess ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tem dúvidas? Fale conosco.</h2>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Digite seu nome completo"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="contact-whatsapp"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={contactForm.whatsapp}
                        onChange={(e) => setContactForm({...contactForm, whatsapp: e.target.value})}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-question" className="block text-sm font-semibold text-gray-700 mb-2">
                        Sua dúvida
                      </label>
                      <textarea
                        id="contact-question"
                        required
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={contactForm.question}
                        onChange={(e) => setContactForm({...contactForm, question: e.target.value})}
                        placeholder="Digite sua dúvida ou mensagem aqui..."
                      />
                    </div>

                    <div className="flex justify-center mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Sua dúvida foi enviada com sucesso!</h3>
                  <p className="text-gray-600">
                    O Dr. Processo irá te responder em até 24 horas. Não esqueça: Confira sua caixa de entrada e também o lixo eletrônico (spam).
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}