import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function Privacy() {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    question: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      
      // Reset form after 10 seconds and close modal
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar para a página inicial
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔐 Política de Privacidade – Dr. Processo</h1>
          <p className="text-gray-600 mb-8">Última atualização: {currentDate}</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Esta Política de Privacidade descreve como o Dr. Processo coleta, armazena, usa e protege os dados pessoais fornecidos por seus usuários. Ao utilizar nossos serviços, você concorda com os termos desta política.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Coleta de Dados Pessoais</h2>
            <p className="text-gray-700 mb-4">Coletamos os seguintes dados fornecidos voluntariamente pelo usuário:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Nome completo</li>
              <li className="mb-2">Número de WhatsApp com DDD</li>
              <li className="mb-2">Endereço de e-mail</li>
              <li className="mb-2">CPF ou CNPJ</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Essas informações são necessárias para realizar a consulta processual e enviar os resultados de forma segura e personalizada.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Uso das Informações</h2>
            <p className="text-gray-700 mb-4">As informações fornecidas são utilizadas para os seguintes fins:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Realizar consultas processuais em sistemas públicos e APIs parceiras;</li>
              <li className="mb-2">Enviar os resultados das consultas via WhatsApp e/ou e-mail;</li>
              <li className="mb-2">Melhorar a experiência do usuário e personalizar os serviços;</li>
              <li className="mb-2">Realizar comunicação institucional, como confirmações e notificações.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Não vendemos, trocamos ou repassamos seus dados a terceiros, exceto quando necessário para cumprir obrigações legais ou integrar serviços essenciais à operação da plataforma.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Compartilhamento com Terceiros</h2>
            <p className="text-gray-700 mb-4">
              Alguns dados podem ser compartilhados com plataformas parceiras estritamente para execução da consulta processual, como:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">APIs de terceiros (como Escavador);</li>
              <li className="mb-2">Plataformas de automação e mensageria (como WhatsApp Business API).</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Todos os parceiros seguem normas rigorosas de segurança da informação.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Segurança dos Dados</h2>
            <p className="text-gray-700 mb-4">
              Adotamos medidas de segurança físicas, eletrônicas e administrativas para proteger seus dados contra acesso não autorizado, vazamentos ou uso indevido, incluindo:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Criptografia de dados sensíveis;</li>
              <li className="mb-2">Controle de acesso;</li>
              <li className="mb-2">Monitoramento de atividades suspeitas.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Retenção e Exclusão de Dados</h2>
            <p className="text-gray-700 mb-6">
              Seus dados são armazenados pelo tempo necessário para prestação do serviço, e podem ser excluídos a qualquer momento mediante solicitação.
            </p>
            <p className="text-gray-700 mb-6">
              Você pode solicitar a exclusão dos seus dados enviando um e-mail para:
              <br />
              📩 <a href="mailto:contato@drprocesso.com.br" className="text-teal-600 hover:text-teal-700">contato@drprocesso.com.br</a>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Direitos do Usuário (LGPD)</h2>
            <p className="text-gray-700 mb-4">
              Nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Confirmar a existência do tratamento de dados;</li>
              <li className="mb-2">Acessar os dados coletados;</li>
              <li className="mb-2">Corrigir informações incorretas;</li>
              <li className="mb-2">Solicitar anonimização ou exclusão;</li>
              <li className="mb-2">Revogar o consentimento.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies e Tecnologias de Rastreamento</h2>
            <p className="text-gray-700 mb-4">Nosso site pode utilizar cookies para:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Melhorar a experiência de navegação;</li>
              <li className="mb-2">Analisar estatísticas de uso;</li>
              <li className="mb-2">Direcionar campanhas de remarketing.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Você pode desativar os cookies diretamente nas configurações do seu navegador.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Alterações nesta Política</h2>
            <p className="text-gray-700 mb-6">
              Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você a revise regularmente.
            </p>
            <p className="text-gray-700 mb-6">
              Mudanças significativas serão informadas diretamente pelo WhatsApp ou e-mail cadastrado.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contato para dúvidas ou solicitações</h2>
            <p className="text-gray-700 mb-4">
              Caso você tenha qualquer dúvida sobre esta Política de Privacidade ou deseje exercer seus direitos, entre em contato:
            </p>
            <p className="text-gray-700">
              📩 <a href="mailto:contato@drprocesso.com.br" className="text-teal-600 hover:text-teal-700">contato@drprocesso.com.br</a>
              <br />
              📬 Ou acesse nosso formulário{' '}
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Contato
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                onClick={() => setIsModalOpen(false)}
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