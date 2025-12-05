'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset después de 5 segundos
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800">
      <h3 className="text-xl font-bold text-white mb-6">Envíanos un mensaje</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-zinc-300 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            placeholder="Tu nombre"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-zinc-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            placeholder="tu@email.com"
          />
        </div>

        {/* Asunto */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-zinc-300 mb-2">
            Asunto *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
          >
            <option value="">Selecciona un asunto</option>
            <option value="Información general">Información general</option>
            <option value="Unirme al club">Quiero unirme al club</option>
            <option value="Próximas aventuras">Próximas aventuras</option>
            <option value="Licencia FEDME">Licencia FEDME</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-zinc-300 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition resize-none"
            placeholder="Cuéntanos qué necesitas..."
          />
        </div>

        {/* Estados de feedback */}
        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-green-400 font-bold text-sm">¡Mensaje enviado!</p>
                <p className="text-green-200/80 text-xs mt-1">
                  Te responderemos lo antes posible.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <p className="text-red-400 font-bold text-sm">Error al enviar</p>
                <p className="text-red-200/80 text-xs mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
}