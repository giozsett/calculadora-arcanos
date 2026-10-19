# Imagem leve do servidor web Nginx para servir o site estático
FROM nginx:1.27-alpine

# Copia as páginas, os scripts e a "API" estática das cartas
COPY index.html calcular.html resultado.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

# O Nginx atende na porta 80 dentro do container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
