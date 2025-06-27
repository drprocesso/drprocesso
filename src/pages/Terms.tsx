import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const currentDate = new Date().toLocaleDateString('pt-BR');

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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📄 Termos de Uso – Dr. Processo</h1>
          <p className="text-gray-600 mb-8">Última atualização: {currentDate}</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Bem-vindo ao Dr. Processo, uma plataforma que facilita a consulta de processos judiciais públicos a partir de dados fornecidos voluntariamente pelos usuários.
            </p>

            <p className="text-gray-700 mb-6">
              Ao utilizar este site ou qualquer um de nossos serviços, você concorda com os seguintes termos:
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Objetivo da Plataforma</h2>
            <p className="text-gray-700 mb-4">O Dr. Processo oferece aos usuários a possibilidade de:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Consultar a existência e o status de processos judiciais associados ao seu CPF ou CNPJ;</li>
              <li className="mb-2">Receber essas informações de forma automatizada via WhatsApp e e-mail;</li>
              <li className="mb-2">Armazenar seus dados de forma segura para facilitar consultas futuras ou envio de atualizações processuais.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              O serviço visa facilitar o acesso à informação pública de forma simples e acessível para o usuário comum, sem fins jurídicos, advocatícios ou oficiais.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Consentimento de Dados</h2>
            <p className="text-gray-700 mb-4">Ao preencher o formulário, você autoriza expressamente o Dr. Processo a:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Armazenar os dados informados (nome, WhatsApp, e-mail, CPF ou CNPJ);</li>
              <li className="mb-2">Utilizar o CPF/CNPJ para consultar APIs públicas ou privadas que permitem o acesso a processos judiciais;</li>
              <li className="mb-2">Enviar os resultados dessas consultas para o seu WhatsApp e/ou e-mail.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Os dados fornecidos não serão compartilhados com terceiros, exceto quando estritamente necessário para a execução da consulta ou exigido por lei.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Gratuidade e Limitação de Uso</h2>
            <p className="text-gray-700 mb-4">A primeira consulta é oferecida gratuitamente, com base nos dados fornecidos pelo usuário.</p>
            <p className="text-gray-700 mb-4">Nos reservamos o direito de:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Restringir o número de consultas por usuário;</li>
              <li className="mb-2">Recusar ou bloquear consultas que pareçam fraudulentas, abusivas ou que envolvam tentativa de uso malicioso da plataforma.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Fontes de Dados</h2>
            <p className="text-gray-700 mb-6">
              As informações obtidas e entregues ao usuário são baseadas em dados públicos acessíveis por meio de sistemas integrados, como APIs de terceiros (ex: Escavador) e sites de tribunais de justiça.
            </p>
            <p className="text-gray-700 mb-6">
              O Dr. Processo não manipula, altera ou garante a precisão, completude ou atualidade das informações extraídas dessas fontes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 mb-4">O Dr. Processo é um serviço informativo e automatizado. Não nos responsabilizamos por:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Eventuais erros, atrasos ou indisponibilidades das APIs externas utilizadas;</li>
              <li className="mb-2">Informações incompletas ou desatualizadas fornecidas pelos tribunais;</li>
              <li className="mb-2">Qualquer tipo de decisão pessoal, jurídica ou financeira tomada com base nas informações recebidas.</li>
            </ul>
            <p className="text-gray-700 mb-6">Não prestamos serviços jurídicos nem substituímos o papel de advogados.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Privacidade e Segurança</h2>
            <p className="text-gray-700 mb-6">
              Os dados são armazenados de forma segura, com criptografia e acesso restrito. Nos comprometemos a proteger suas informações, conforme a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
            </p>
            <p className="text-gray-700 mb-6">
              Você poderá, a qualquer momento, solicitar a remoção de seus dados de nossa base, entrando em contato através do e-mail contato@drprocesso.com.br.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Atualizações nos Termos</h2>
            <p className="text-gray-700 mb-6">
              Estes Termos de Uso podem ser atualizados a qualquer momento, sem aviso prévio. Recomendamos que os usuários revisem esta página periodicamente.
            </p>
            <p className="text-gray-700 mb-6">
              Ao continuar utilizando o serviço após qualquer alteração, você estará concordando com os novos termos.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contato</h2>
            <p className="text-gray-700 mb-4">
              Em caso de dúvidas sobre estes termos ou sobre o funcionamento da plataforma, entre em contato pelo e-mail:
            </p>
            <p className="text-gray-700">
              📩 <a href="mailto:contato@drprocesso.com.br" className="text-teal-600 hover:text-teal-700">contato@drprocesso.com.br</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}