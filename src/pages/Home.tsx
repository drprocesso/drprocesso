import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, UserX, FileQuestion, AlertTriangle, Clock, Shield, UserMinus, CheckCircle, Eye, MessageSquare, Bell, Users, Search, FileText, Smartphone, Star, Quote, Lock, Timer, Award, Phone, Mail, User, ChevronDown, ChevronUp, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { supabase } from '../lib/supabase';

// Memoized components for better performance
const PainPointCard = React.memo(({ point, index }: { point: any; index: number }) => {
  const IconComponent = point.icon;
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.0 + (index * 0.1) }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
          <IconComponent className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            "{point.text}"
          </p>
          <p className="text-sm text-gray-600 italic">
            {point.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const BenefitCard = React.memo(({ benefit, index }: { benefit: any; index: number }) => {
  const IconComponent = benefit.icon;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.5 + (index * 0.1) }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`bg-gradient-to-r ${benefit.color} p-4 rounded-xl shadow-lg`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {benefit.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Solução Garantida</span>
        </div>
      </div>
    </motion.div>
  );
});

const TestimonialCard = React.memo(({ testimonial, index }: { testimonial: any; index: number }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay: 4.4 + (index * 0.1) }}
    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
  >
    {/* Quote Icon */}
    <div className="flex justify-center mb-6">
      <div className="bg-teal-100 p-3 rounded-full">
        <Quote className="w-8 h-8 text-teal-600" />
      </div>
    </div>

    {/* Testimonial Text */}
    <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 text-center italic">
      "{testimonial.text}"
    </blockquote>

    {/* Rating */}
    <div className="flex justify-center mb-6">
      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>

    {/* User Info */}
    <div className="flex items-center justify-center gap-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
        width="64"
        height="64"
        loading="lazy"
      />
      <div className="text-center">
        <p className="font-semibold text-gray-900 text-lg">
          {testimonial.name}
        </p>
        <p className="text-sm text-gray-600">
          Usuário verificado
        </p>
      </div>
    </div>
  </motion.div>
));

// Debounce hook for form inputs
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Home() {
  const navigate = useNavigate();
  const [offerFormData, setOfferFormData] = useState({
    cpf: '',
    email: '',
    whatsapp: '',
    consent: false
  });
  const [offerFormErrors, setOfferFormErrors] = useState({
    cpf: false,
    email: false,
    whatsapp: false
  });
  const [isOfferLoading, setIsOfferLoading] = useState(false);
  const [offerErrorMessage, setOfferErrorMessage] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Debounced form values for better performance
  const debouncedCpf = useDebounce(offerFormData.cpf, 300);
  const debouncedEmail = useDebounce(offerFormData.email, 300);
  const debouncedWhatsapp = useDebounce(offerFormData.whatsapp, 300);

  // Load video script with optimizations
  useEffect(() => {
    const loadVideoScript = () => {
      // Check if script is already loaded
      if (document.getElementById('scr_6848bd5ca082b39615cb5022')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'scr_6848bd5ca082b39615cb5022';
      script.src = 'https://scripts.converteai.net/e0ad35f5-f49d-4adb-8c02-1993c76c86e0/players/6848bd5ca082b39615cb5022/player.js';
      script.async = true;
      script.defer = true;
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load ConvertAI video script');
      };
      
      script.onload = () => {
        console.log('ConvertAI video script loaded successfully');
      };

      document.head.appendChild(script);
    };

    // Load script after component mounts with a slight delay to not block initial render
    const timer = setTimeout(loadVideoScript, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Memoized data arrays to prevent unnecessary re-renders
  const painPoints = useMemo(() => [
    {
      icon: UserX,
      text: "Meu advogado sumiu e não responde mais!",
      description: "Sensação de abandono"
    },
    {
      icon: FileQuestion,
      text: "Não entendo nada do meu processo, é só juridiquês!",
      description: "Falta de clareza"
    },
    {
      icon: AlertTriangle,
      text: "Tenho medo de estar sendo enganado e perder meu dinheiro!",
      description: "Desconfiança e medo de golpe"
    },
    {
      icon: Clock,
      text: "Faz meses que não tenho notícias, estou ansioso sem saber se ganhei ou perdi!",
      description: "Ansiedade por falta de notícias"
    },
    {
      icon: Shield,
      text: "Queria saber tudo sozinho, sem depender dele!",
      description: "Desejo de controle direto"
    }
  ], []);

  const benefits = useMemo(() => [
    {
      icon: Users,
      title: "Autonomia Total",
      description: "Consulte seu processo usando seu CPF e veja tudo o que está em andamento em seu nome.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Linguagem Clara e Acessível",
      description: "Receba resumos detalhados em português, sem juridiquês complicado, para você entender cada passo.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Eye,
      title: "Transparência e Confiança",
      description: "Acompanhe cada movimentação e saiba exatamente o que acontece, eliminando o medo de ser enganado.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Bell,
      title: "Paz de Espírito Imediata",
      description: "Receba notificações automáticas no seu WhatsApp a cada atualização, aliviando a ansiedade.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Independência Total",
      description: "Tenha o controle direto do seu processo, sem ter que correr atrás de informações com seu advogado.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Lock,
      title: "Informação Confiável e Segura",
      description: "Receba dados direto dos tribunais e resumos gerados com inteligência artificial, garantindo a veracidade e a proteção das suas informações.",
      color: "from-gray-500 to-gray-600"
    }
  ], []);

  const steps = useMemo(() => [
    {
      number: "1",
      icon: Search,
      title: "Consulte com seu CPF",
      description: "No nosso site, você digita o seu CPF e nós mostramos todos os processos judiciais abertos em seu nome, em todas as esferas.",
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "2",
      icon: FileText,
      title: "Escolha e Receba o Resumo",
      description: "Selecione o processo que deseja acompanhar. Em instantes, você recebe um resumo completo e fácil de entender no seu WhatsApp.",
      color: "from-green-500 to-green-600"
    },
    {
      number: "3",
      icon: Smartphone,
      title: "Acompanhe em Tempo Real",
      description: "A partir daí, sempre que houver uma nova movimentação no seu processo, você recebe uma notificação instantânea diretamente no seu WhatsApp.",
      color: "from-purple-500 to-purple-600"
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Maria S.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      text: "Finalmente consigo dormir tranquila sabendo o que acontece com meu processo. O Dr. Processo mudou minha vida!",
      rating: 5
    },
    {
      name: "João P.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      text: "Meu advogado não me atendia nunca. Agora, com as notificações no WhatsApp, eu sei de tudo antes dele! É libertador!",
      rating: 5
    },
    {
      name: "Ana L.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      text: "Chega de juridiquês! O resumo é claro, direto, e me faz entender cada passo. Valeu cada centavo!",
      rating: 5
    }
  ], []);

  const faqItems = useMemo(() => [
    {
      question: "O Dr. Processo substitui um advogado?",
      answer: "Não, o Dr. Processo não substitui um advogado. Ele complementa o trabalho jurídico, dando a você controle total das informações do seu processo. Você continua com seu advogado, mas agora tem autonomia para acompanhar tudo em tempo real, sem depender de respostas que podem não vir."
    },
    {
      question: "É seguro colocar meu CPF?",
      answer: "Sim, é completamente seguro. Seus dados são protegidos por criptografia SSL e usados exclusivamente para a consulta do seu processo. Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD) e não compartilhamos suas informações com terceiros."
    },
    {
      question: "Consigo ver processos antigos?",
      answer: "Sim! O sistema busca por todos os processos em seu nome, incluindo processos antigos e arquivados. Você terá acesso ao histórico completo da sua vida judicial, desde processos ativos até os já finalizados."
    },
    {
      question: "Se eu tiver mais de um processo, posso acompanhar todos?",
      answer: "Sim! Você pode acompanhar quantos processos desejar e irá receber atualizações de todos eles diretamente em seu Whatsapp."
    },
    {
      question: "Como recebo as informações?",
      answer: "Você recebe as informações diretamente no seu WhatsApp, de forma clara e objetiva, sem juridiquês. Também enviamos uma cópia por e-mail. As notificações são automáticas sempre que há movimentação no seu processo."
    },
    {
      question: "Qual a diferença para outros sites que mostram processos?",
      answer: "Nosso diferencial é a linguagem simples e acessível, resumos exclusivos feitos especialmente para você entender, e as notificações automáticas no WhatsApp. Transformamos informação jurídica complexa em algo que qualquer pessoa consegue compreender."
    }
  ], []);

  // Validation functions for offer form
  const validateOfferWhatsapp = useCallback((whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, '');
    return numbers.length === 11 && !numbers.startsWith('0');
  }, []);

  const validateOfferEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateOfferCPF = useCallback((cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  }, []);

  // Handle offer form submission
  const handleOfferSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferErrorMessage(null);
    
    // Validate all fields
    const errors = {
      whatsapp: !validateOfferWhatsapp(offerFormData.whatsapp),
      email: !validateOfferEmail(offerFormData.email),
      cpf: !validateOfferCPF(offerFormData.cpf)
    };

    setOfferFormErrors(errors);

    // If there are any errors, don't submit
    if (Object.values(errors).some(error => error)) {
      return;
    }

    setIsOfferLoading(true);

    try {
      // Clean up phone and CPF
      const cleanWhatsapp = offerFormData.whatsapp.replace(/\D/g, '');
      const cleanCPF = offerFormData.cpf.replace(/\D/g, '');

      console.log('Starting form submission with data:', {
        whatsapp: cleanWhatsapp,
        email: offerFormData.email,
        cpf: cleanCPF
      });

      // Insert into consultas table first
      const { data: consultaData, error: consultaError } = await supabase
        .from('consultas')
        .insert([{
          whatsapp: cleanWhatsapp,
          cpf: cleanCPF,
          email: offerFormData.email,
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
          email: offerFormData.email,
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
      setOfferFormData({
        cpf: '',
        email: '',
        whatsapp: '',
        consent: false
      });
      
      // Reset errors
      setOfferFormErrors({
        cpf: false,
        email: false,
        whatsapp: false
      });
    } catch (error) {
      console.error('Error:', error);
      setOfferErrorMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setIsOfferLoading(false);
    }
  }, [offerFormData, validateOfferWhatsapp, validateOfferEmail, validateOfferCPF, navigate]);

  // Handle form field changes for offer form with debouncing
  const handleOfferWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    setOfferFormData(prev => ({ ...prev, whatsapp: value }));
  }, []);

  const handleOfferEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOfferFormData(prev => ({ ...prev, email: value }));
  }, []);

  const handleOfferCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    setOfferFormData(prev => ({ ...prev, cpf: value }));
  }, []);

  // Update validation errors when debounced values change
  useEffect(() => {
    setOfferFormErrors(prev => ({
      ...prev,
      whatsapp: debouncedWhatsapp ? !validateOfferWhatsapp(debouncedWhatsapp) : false
    }));
  }, [debouncedWhatsapp, validateOfferWhatsapp]);

  useEffect(() => {
    setOfferFormErrors(prev => ({
      ...prev,
      email: debouncedEmail ? !validateOfferEmail(debouncedEmail) : false
    }));
  }, [debouncedEmail, validateOfferEmail]);

  useEffect(() => {
    setOfferFormErrors(prev => ({
      ...prev,
      cpf: debouncedCpf ? !validateOfferCPF(debouncedCpf) : false
    }));
  }, [debouncedCpf, validateOfferCPF]);

  const toggleFAQ = useCallback((index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  }, [expandedFAQ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col relative">
      {/* Login Button */}
      <Link
        to="/login"
        className="absolute top-4 right-4 z-10 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        FAZER LOGIN
      </Link>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-16"
        >
          <img 
            src="/Dr-Processo-Logo.webp" 
            alt="Dr. Processo" 
            className="h-20 object-contain" 
            width="200"
            height="80"
            fetchPriority="high"
          />
        </motion.div>

        {/* Headlines */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            89% dos brasileiros estão insatisfeitos com seus advogados — veja por quê.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Uma reportagem polêmica mostrou o que está por trás do sumiço,<br />
            da enrolação e da falta de respostas.
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 max-w-4xl mx-auto"
        >
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video border border-gray-200">
            {/* YouTube Video Embed */}
            <iframe
              src="https://www.youtube.com/embed/0mTP8viA21I?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1&disablekb=1&playsinline=1&enablejsapi=1&origin=https://drprocesso.com.br"
              title="Dr. Processo Video"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-20"
        >
          <HashLink
            to="/#como-funciona"
            smooth
            className="max-w-lg bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl text-center"
          >
            Como acompanho meu processo?
          </HashLink>
        </motion.div>

        {/* Pain Points Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Você se identifica com alguma dessas situações?
            </h2>
          </div>

          {/* Pain Points Grid */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {painPoints.map((point, index) => (
              <PainPointCard key={index} point={point} index={index} />
            ))}
          </div>

          {/* Connection Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-center mt-12"
          >
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-xl text-teal-800 font-semibold leading-relaxed">
                Essas são as queixas reais de milhares de brasileiros.<br />
                <span className="text-teal-600">Você não está sozinho nessa!</span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Common Enemy Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              O Verdadeiro Inimigo da sua Paz e do seu Processo:
            </h2>
          </div>

          {/* Enemy Content */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Visual Element */}
              <div className="lg:w-1/3 bg-white flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.9 }}
                  className="text-center"
                >
                  {/* Image with Question Mark */}
                  <div className="relative">
                    <div className="w-48 h-48 flex items-center justify-center mb-4 mx-auto">
                      <img 
                        src="/Design-sem-nome-_3_.webp" 
                        alt="Advogado Negligente" 
                        className="w-full h-full object-contain"
                        width="192"
                        height="192"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">O Advogado Negligente</p>
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.1 }}
                >
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    <span className="font-semibold text-gray-900">Não é a justiça, nem a complexidade da lei.</span> O que rouba sua tranquilidade é o advogado que:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Some após o contrato</span> e deixa você no escuro</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Não responde mensagens</span> nem retorna ligações</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Não repassa informações</span> sobre o andamento do processo</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700">E em alguns casos, <span className="font-semibold text-red-600">recebe valores e não entrega ao cliente</span></p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-800 font-semibold text-center">
                      É hora de retomar o controle da SUA vida e do SEU processo!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              O Dr. Processo é a sua Solução Definitiva para:
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </div>

          {/* Differential */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Nosso Diferencial</h3>
              </div>
              <p className="text-xl text-white leading-relaxed">
                <span className="font-semibold">Nosso foco é exclusivamente você, cidadão comum.</span><br />
                Não somos para advogados, somos para sua tranquilidade!
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          id="como-funciona"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.2 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Como o Dr. Processo Funciona em Apenas 3 Passos Simples:
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 3.4 + (index * 0.2) }}
                >
                  <div className="flex flex-col items-center gap-8">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0">
                      <div className={`bg-gradient-to-r ${step.color} rounded-2xl p-8 shadow-2xl`}>
                        <div className="flex flex-col items-center text-white">
                          <div className="bg-white bg-opacity-20 rounded-full p-4 mb-4">
                            <IconComponent className="w-12 h-12" />
                          </div>
                          <div className="bg-white text-gray-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                            {step.number}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="text-center">
                      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Passo {step.number}: {step.title}
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Infographic Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 4.0 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                É simples assim! Em poucos minutos você tem o controle total.
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">Rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Fácil</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold">Automático</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Proof Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 4.2 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              O que nossos usuários (e a realidade) dizem sobre a dor de depender de advogados:
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 4.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-12 max-w-4xl mx-auto shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-4xl font-bold text-white mb-2">
                    11.265.247
                  </div>
                  <p className="text-xl text-white opacity-90">
                    Brasileiros já recuperaram o controle
                  </p>
                </div>
              </div>
              
              <p className="text-2xl text-white font-semibold leading-relaxed">
                Mais de <span className="text-yellow-300">11 milhões de brasileiros</span> já recuperaram o controle de seus processos com o Dr. Processo!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">98.7%</div>
                  <p className="text-white opacity-90">Satisfação dos usuários</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">132 Milhões</div>
                  <p className="text-white opacity-90">De processos pesquisados</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">100%</div>
                  <p className="text-white opacity-90">Dados seguros e protegidos</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* New Section 7: Desvende o Andamento do Seu Processo Agora! */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 5.0 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
                       
            {/* Main Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Seu advogado sumiu? Nós te respondemos na HORA!
              
            </h2>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Milhões de brasileiros se sentem no escuro. Você está a um passo de ter todas as informações na palma da sua mão.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 max-w-lg mx-auto">
            <form onSubmit={handleOfferSubmit} className="space-y-6">
              {offerErrorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {offerErrorMessage}
                </div>
              )}

              {/* WhatsApp Field */}
              <div>
                <label htmlFor="offer-whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp com DDD*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="offer-whatsapp"
                    required
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      offerFormErrors.whatsapp ? 'border-red-500' : 'border-gray-200'
                    }`}
                    value={offerFormData.whatsapp}
                    onChange={handleOfferWhatsappChange}
                    placeholder="(99) 99999-9999"
                  />
                </div>
                {offerFormErrors.whatsapp && (
                  <p className="mt-1 text-sm text-red-500">Digite um número de WhatsApp válido com DDD (11 dígitos)</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="offer-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="offer-email"
                    required
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      offerFormErrors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    value={offerFormData.email}
                    onChange={handleOfferEmailChange}
                    placeholder="seumail@exemplo.com"
                  />
                </div>
                {offerFormErrors.email && (
                  <p className="mt-1 text-sm text-red-500">Digite um e-mail válido</p>
                )}
              </div>

              {/* CPF Field */}
              <div>
                <label htmlFor="offer-cpf" className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="offer-cpf"
                    required
                    maxLength={14}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      offerFormErrors.cpf ? 'border-red-500' : 'border-gray-200'
                    }`}
                    value={offerFormData.cpf}
                    onChange={handleOfferCPFChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                {offerFormErrors.cpf && (
                  <p className="mt-1 text-sm text-red-500">Digite um CPF válido (11 dígitos)</p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="offer-consent"
                  required
                  className="mt-1.5 h-5 w-5 text-teal-600 focus:ring-2 focus:ring-teal-500 border-2 border-gray-300 rounded transition-all duration-200 ease-in-out"
                  checked={offerFormData.consent}
                  onChange={(e) => setOfferFormData(prev => ({...prev, consent: e.target.checked}))}
                />
                <label htmlFor="offer-consent" className="text-sm text-gray-700 leading-relaxed">
                  Autorizo o uso dos meus dados para consulta processual e comunicação do Dr. Processo.*
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isOfferLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isOfferLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Consultar Meu Processo!'
                )}
              </motion.button>
            </form>
          </div>

          {/* Scarcity/Urgency Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 5.2 }}
            className="text-center mt-8"
          >
            <p className="text-lg text-red-600 font-semibold max-w-2xl mx-auto">
              Não deixe que a demora e a falta de informação acabem com seus direitos! Consulte agora e evite surpresas extraordinárias.
            </p>
          </motion.div>

          {/* Reinforcement/Trust Texts */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 5.4 }}
            className="text-center mt-4 text-gray-600 text-sm space-y-1"
          >
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Consulta em tempo real. Seus dados seguros e protegidos.
            </p>
            <p className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Serviço exclusivo para o cidadão, sem juridiquês.
            </p>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 5.6 }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Ainda tem dúvidas? Veja as perguntas frequentes:
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 5.8 + (index * 0.1) }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-6 h-6 text-teal-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6">
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Enhanced Footer Section */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Logo and Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/Dr-Processo-Logo.webp" 
                  alt="Dr. Processo" 
                  className="h-12 object-contain" 
                  width="120"
                  height="48"
                  loading="lazy"
                />
               
              </div>
              <p className="text-gray-300 leading-relaxed">
                Sua plataforma de confiança para acompanhar processos judiciais de forma simples, 
                clara e sem juridiquês. Recupere o controle da sua vida jurídica.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Dados protegidos por criptografia SSL</span>
              </div>
            </div>

            {/* Links Úteis */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Links Úteis</h3>
              <nav className="space-y-3">
                <Link 
                  to="/termos" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Termos de Uso
                </Link>
                <Link 
                  to="/privacidade" 
                  className="block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Política de Privacidade
                </Link>
               
              </nav>
            </div>

            {/* Contato */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-600 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">E-mail de Suporte</p>
                    <a 
                      href="mailto:contato@drprocesso.com.br" 
                      className="text-white hover:text-teal-400 transition-colors duration-200"
                    >
                      contato@drprocesso.com.br
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Atendimento</p>
                    <p className="text-white">Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-12"></div>

          {/* Bottom Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Dr. Processo. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                CNPJ: 52.470.780/0001-48 | Desenvolvido com ❤️ para o cidadão brasileiro
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>LGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>Dados Protegidos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}