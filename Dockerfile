# Site estatico (HTML/CSS/JS puro) - build step so pra minificar
# css/js antes de ir pra producao (14/09/2026, Carlos liberou usar
# build step se ajudar de verdade: minificar antes do gzip corta
# script.js/three-hero.js/style.css mais uns 50-64% ALEM do que o
# gzip sozinho ja tira - o codigo tem bastante comentario/documentacao
# em portugues, que nao comprime tao bem quanto codigo repetitivo).
# O codigo-fonte no repo continua 100% comentado/legivel - so o que
# vai pro nginx final sai minificado deste estagio, nunca editado a
# mao. `demo/` (mini sistema da vitrine) NAO passa por aqui de proposito:
# e gerado por `tools/build-demo.js` e commitado ja pronto (legivel), o
# gzip do nginx ja tira ~80% dele, e a pasta `tools/` (build do demo,
# postcss, telas de origem) nem entra na imagem (ver .dockerignore). HTML nao entra na minificacao de proposito: `index.html` tem
# um bloco JSON-LD liberado no CSP por hash exato (ver nginx.conf) -
# minificar mudaria o hash e quebraria ele; gzip sozinho ja reduz
# HTML uns 82%, suficiente sem esse risco.
FROM node:20-alpine AS build
WORKDIR /build
COPY css/style.css css/style.css
COPY js/script.js js/three-hero.js js/demo.js js/
RUN npm install -g terser@5 clean-css-cli@5 && \
    cleancss -o css/style.min.css css/style.css && \
    mv css/style.min.css css/style.css && \
    terser js/script.js -c -m -o js/script.min.js && \
    mv js/script.min.js js/script.js && \
    terser js/three-hero.js --module -c -m -o js/three-hero.min.js && \
    mv js/three-hero.min.js js/three-hero.js && \
    terser js/demo.js -c -m -o js/demo.min.js && \
    mv js/demo.min.js js/demo.js

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
COPY --from=build /build/css/style.css /usr/share/nginx/html/css/style.css
COPY --from=build /build/js/script.js /usr/share/nginx/html/js/script.js
COPY --from=build /build/js/three-hero.js /usr/share/nginx/html/js/three-hero.js
COPY --from=build /build/js/demo.js /usr/share/nginx/html/js/demo.js
EXPOSE 80
