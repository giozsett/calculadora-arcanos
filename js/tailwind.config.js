// Configuração do Tailwind CSS (Play CDN) compartilhada por todas as páginas.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        noite: {
          950: '#0b0820',
          900: '#140f33',
          800: '#1f1848',
          700: '#2d2463',
        },
        ouro: {
          200: '#f6e7b5',
          300: '#ecd48a',
          400: '#d9b85c',
          500: '#b8963a',
        },
      },
      fontFamily: {
        titulo: ['Cinzel', 'serif'],
        texto: ['Lora', 'Georgia', 'serif'],
      },
      backgroundImage: {
        estrelas:
          'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.6) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,.5) 50%, transparent 51%),' +
          'radial-gradient(1.5px 1.5px at 85% 20%, rgba(236,212,138,.7) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 40% 65%, rgba(255,255,255,.4) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 10% 85%, rgba(255,255,255,.5) 50%, transparent 51%)',
      },
      backgroundSize: {
        estrelas: '320px 320px',
      },
    },
  },
};
