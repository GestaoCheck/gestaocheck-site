// Cenas 3D (rede de nos conectados) do site - uma no Hero, outra mais
// discreta no CTA final. So entram em telas grandes e quando o usuario
// nao pediu menos movimento. Reaproveita a mesma funcao pra ambas, com
// parametros mais leves na do CTA (menos nos, mais discreta).
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.0/three.module.min.js";

// Bug real corrigido (13/09/2026) - as 5 cenas 3D do site (Hero, CTA,
// Segurança, splash topo e rodapé) renderizavam pra sempre desde o
// carregamento da página, mesmo com o canvas fora da tela (nunca
// pausava) - 5 `requestAnimationFrame` + `renderer.render()` rodando
// ao mesmo tempo o tempo todo é uma carga de GPU/CPU alta em qualquer
// máquina, e reportado pelo Carlos como travamento real ("trava por
// completo") justamente ao passar pela zona do splash (a cena mais
// pesada: 95 nós + 2 anéis, e ainda por cima com a opacidade do
// `.splash-decor` sendo recalculada a cada frame de scroll). Isso já
// estava registrado como possível otimização futura, nunca
// implementada - virou bug real de verdade agora.
//
// **Segundo bug real corrigido no mesmo pente** - a primeira versão
// desta função usava `cancelAnimationFrame`/`requestAnimationFrame`
// pra parar e reiniciar o loop de animação de verdade (não só pular o
// render). Isso trouxe um bug novo: depois de rolar a página inteira
// até o fim e voltar pro topo (o canvas do splash passa por várias
// paradas/retomadas reais nesse caminho todo), a cena 3D ficava com
// uma faixa horizontal "travada" (conteúdo antigo, sem se atualizar)
// no meio da tela, mesmo com o resto da cena girando normalmente ao
// redor - um bug de composição de GPU do navegador (a textura do
// canvas fica com um "pedaço" desatualizado depois de parar e
// recomeçar `requestAnimationFrame` de verdade). Testado e confirmado:
// o padrão de nós ao redor da faixa girava normalmente entre
// screenshots, só a faixa ficava sempre igual - prova que não era a
// cena 3D "travada" de verdade, e sim algo no pipeline de composição
// não repintando aquele pedaço.
//
// **Corrigido sem nunca parar o `requestAnimationFrame` de verdade**:
// agora o loop roda pra sempre (como sempre rodou), só que pula a
// parte cara (atualizar geometria + `renderer.render()`) quando o
// canvas está fora da tela - o `IntersectionObserver` só liga/desliga
// uma flag booleana (`isVisible`), nunca chama `cancelAnimationFrame`.
// Continua cortando quase todo o custo de GPU de um canvas fora de
// tela (o render em si, que era o gasto real) sem nunca "desligar e
// religar" o pipeline de composição do canvas - o jeito que
// provavelmente evita o bug da faixa travada.
function observeVisibility(canvas, onChange) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => onChange(entry.isIntersecting));
    }, { rootMargin: "200px" });
    observer.observe(canvas);
}

// Rede de pontos genérica trocada (13/09/2026) por uma peça de verdade
// - Carlos achou a rede simples demais/feia comparada com o cadeado da
// Segurança ("quero algo do mesmo jeito, só que pra gestão"). Mesma
// técnica de construção do cadeado (wireframe + miolo translúcido pra
// simular glow sem post-processing) só que moldando o check da própria
// marca (o ícone do GestãoCheck é check + seta) em vez de um cadeado -
// tematicamente "gestão" de verdade (é literalmente o logo) e no
// mesmo nível de acabamento pedido. Mais leve que a rede antiga, não
// mais pesado: a rede antiga calculava O(n²) distâncias pra desenhar
// linha entre nó próximo (até 861 checagens pro Hero de 42 nós), essa
// cena não tem nenhum cálculo de conexão - só malhas construídas +
// partículas soltas orbitando.
function initShowcaseScene(canvasId, { scale = 1, particleCount = 30, showBars = true } = {}) {
    const canvas = document.getElementById(canvasId);
    const skip = !canvas
        || window.matchMedia("(max-width: 768px)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) return;

    const CYAN = 0x7dd3dc;
    const CORAL = 0xff6b6b;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 13;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const core = new THREE.Group();
    core.scale.setScalar(scale);
    scene.add(core);

    // Check construído com 2 "braços" (curto + longo, geometria real
    // calculada pelos pontos - não é rotação chutada) + a setinha na
    // ponta (o ícone de verdade da marca é check+seta). `glowMats`
    // junta o miolo translúcido dos 2 braços pra pulsar junto.
    const glowMats = [];
    function buildArm(p1, p2, thickness, glowOpacity) {
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        const group = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(length, thickness, thickness, 3, 2, 2);
        const bodyMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.65 });
        group.add(new THREE.Mesh(bodyGeo, bodyMat));

        if (glowOpacity) {
            const glowMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: glowOpacity });
            glowMats.push(glowMat);
            group.add(new THREE.Mesh(new THREE.BoxGeometry(length * 0.92, thickness * 0.78, thickness * 0.78), glowMat));
        }
        group.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 0);
        group.rotation.z = angle;
        return group;
    }

    const vertex = { x: 0, y: -1.15 };
    const topLeft = { x: -1.35, y: 0.15 };
    const topRight = { x: 1.7, y: 1.5 };
    core.add(buildArm(vertex, topLeft, 0.42, 0.055));
    core.add(buildArm(vertex, topRight, 0.42, 0.055));

    const tipMat = new THREE.MeshBasicMaterial({ color: CORAL, wireframe: true, transparent: true, opacity: 0.75 });
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), tipMat);
    tip.position.set(topRight.x, topRight.y, 0);
    tip.rotation.z = Math.atan2(topRight.y - vertex.y, topRight.x - vertex.x) - Math.PI / 2;
    core.add(tip);

    // Mini barras de gráfico flutuando junto do check - reforça
    // "gestão/dados" (diferente do cadeado, que é só segurança), pulso
    // leve de altura pra parecer painel vivo, não estático.
    const bars = [];
    if (showBars) {
        const heights = [0.55, 1.05, 0.75, 1.3];
        heights.forEach((h, i) => {
            const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? CYAN : CORAL, transparent: true, opacity: 0.5 });
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.26), mat);
            bar.position.set(-2.7 + i * 0.4, -1.65 + h / 2, 1.3);
            core.add(bar);
            bars.push({ mesh: bar, phase: i * 0.7 });
        });
    }

    // Halo duplo orbitando (mesma técnica do splash - dois anéis, eixos
    // diferentes, sensação de "camadas girando").
    const ring1 = new THREE.Group();
    ring1.rotation.x = Math.PI / 2.4;
    ring1.add(new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.02, 8, 96), new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.4 })));
    scene.add(ring1);

    const ring2 = new THREE.Group();
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 5;
    ring2.add(new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.018, 8, 96), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.22 })));
    scene.add(ring2);

    // Nuvem de partículas orbitando (dados) - mesma distribuição
    // esférica de sempre.
    const positions = [];
    const colors = [];
    const cyanColor = new THREE.Color(CYAN);
    const coralColor = new THREE.Color(CORAL);
    for (let i = 0; i < particleCount; i++) {
        const radius = 4.6 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
        const c = Math.random() < 0.2 ? coralColor : cyanColor;
        colors.push(c.r, c.g, c.b);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true }));
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let isVisible = true;
    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        core.rotation.y += 0.0032;
        core.rotation.x = Math.sin(t * 0.2) * 0.1;
        const pulse = 1 + Math.sin(t * 1.1) * 0.035;
        core.scale.setScalar(scale * pulse);
        glowMats.forEach((m) => { m.opacity = 0.045 + Math.sin(t * 1.1) * 0.02; });

        ring1.rotation.z += 0.0038;
        ring2.rotation.z -= 0.0026;
        dots.rotation.y -= 0.0009;
        dots.rotation.x += 0.0003;

        bars.forEach(({ mesh, phase }) => {
            mesh.scale.y = 1 + Math.sin(t * 1.6 + phase) * 0.25;
        });

        camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2.2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
    observeVisibility(canvas, (visible) => { isVisible = visible; });
}

// scale maior (era 1) - Carlos adorou a cena mas não dava pra ver ela
// direito atrás do texto do Hero; maior + canvas com opacidade mais
// alta (ver #hero-3d em style.css) fazem ela "vazar" bem mais nas
// bordas/entrelinhas do texto.
initShowcaseScene("hero-3d", { scale: 1.35, particleCount: 32, showBars: true });
initShowcaseScene("cta-3d", { scale: 0.8, particleCount: 18, showBars: false });
// #sobre (quem-somos-nos.html, 14/09/2026) - substitui a constelação 2D
// que cruzava por cima do título grande dessa seção e ficava "muito
// feia" - mesma cena do Hero/CTA (`initShowcaseScene` já checa sozinha
// se o canvas existe, então essa chamada não faz nada nas páginas que
// não têm `#sobre-3d`). Sem barra de gráfico (`showBars`, só faz
// sentido no Hero, que fala de "dados/gestão" - aqui é a história da
// empresa) e escala um pouco menor que o Hero (seção mais alta, mas
// não precisa da mesma presença "abrindo o site").
initShowcaseScene("sobre-3d", { scale: 1.1, particleCount: 28, showBars: false });

// Abertura (splash) - a PRIMEIRA coisa que a pessoa vê, então pediu
// tratamento mais forte que só reaproveitar a rede do Hero: uma rede
// bem mais densa (nós/linhas) + dois anéis cruzados girando em eixos
// diferentes (mesma técnica de "halo orbitando" da Segurança, mas
// combinada aqui com a rede de nós - nenhuma das duas cenas do site já
// tinha essa mistura específica). Sem parallax de mouse (o logo já é o
// centro das atenções, orbitar sozinho fica mais elegante que seguir o
// cursor atrás de um elemento fazendo zoom dramático por cima).
function initSplashScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const skip = !canvas
        || window.matchMedia("(max-width: 768px)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) return;

    const CYAN = "#7DD3DC";
    const CORAL = "#FF6B6B";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 13;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Rede de nós densa (mais nós/conexões que o Hero - o dobro da
    // densidade relativa, já que aqui é o único elemento 3D da tela,
    // sem competir com texto/cards por cima).
    // Bug real corrigido (13/09/2026) - densidade reduzida de 95 pra 35
    // nós: essa é a cena mais pesada das 5 do site (a única com anéis
    // extras por cima da rede), e ficou confirmado como o gargalo real
    // de um travamento de verdade (`requestAnimationFrame` parava de
    // disparar por dezenas de segundos) bem na hora de transicionar
    // pra essa zona vindo de outra parte da página. Ainda densa o
    // bastante pra não perder o efeito "rede rica" pedido antes, só
    // sem ser a cena mais cara do site inteiro.
    const nodeCount = 35;
    const positions = [];
    const colors = [];
    const cyanColor = new THREE.Color(CYAN);
    const coralColor = new THREE.Color(CORAL);
    for (let i = 0; i < nodeCount; i++) {
        const radius = 7.5 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        const c = Math.random() < 0.15 ? coralColor : cyanColor;
        colors.push(c.r, c.g, c.b);
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const pointsMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true });
    group.add(new THREE.Points(pointsGeo, pointsMat));

    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
        const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
        for (let j = i + 1; j < nodeCount; j++) {
            const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
            const dist = Math.hypot(ax - bx, ay - by, az - bz);
            if (dist < 3.2) linePositions.push(ax, ay, az, bx, by, bz);
        }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7dd3dc, transparent: true, opacity: 0.2 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Dois anéis cruzados, eixos diferentes, cor e velocidade
    // diferentes - o "halo duplo" que dá a sensação de mesclagem/camada
    // extra por cima da rede.
    const ring1 = new THREE.Group();
    ring1.rotation.x = Math.PI / 2.3;
    ring1.add(new THREE.Mesh(
        new THREE.TorusGeometry(8.4, 0.02, 8, 100),
        new THREE.MeshBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.4 })
    ));
    scene.add(ring1);

    const ring2 = new THREE.Group();
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 5;
    ring2.add(new THREE.Mesh(
        new THREE.TorusGeometry(9.4, 0.015, 8, 100),
        new THREE.MeshBasicMaterial({ color: 0x7dd3dc, transparent: true, opacity: 0.3 })
    ));
    scene.add(ring2);

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let isVisible = true;
    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        group.rotation.y += 0.0013;
        group.rotation.x = Math.sin(t * 0.2) * 0.1;
        group.scale.setScalar(1 + Math.sin(t * 0.7) * 0.03);

        ring1.rotation.z += 0.0032;
        ring2.rotation.z -= 0.0021;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();
    observeVisibility(canvas, (visible) => { isVisible = visible; });
}

initSplashScene("splash-3d-top");

// Cena 3D da seção Segurança - "cadeado protegido": um cadeado de
// verdade (corpo + argola, montado com primitivas - Box pro corpo,
// meio-Torus pra argola) em wireframe, com um miolo sólido bem
// translúcido por dentro (dá o efeito de brilho/glow sem precisar de
// post-processing de bloom, que pesaria mais), um anel girando num
// eixo inclinado (efeito de "escaneamento"/órbita de proteção) e uma
// nuvem de pontos orbitando em volta (dados protegidos). Pulsa devagar
// (respiração) pra não ficar estático. Carlos pediu algo "mais
// tecnológico, diferente, chamativo, grandioso" - trocado de um
// icosaedro genérico (formas "quadradas" sem relação nenhuma com o
// tema) pra um cadeado de propósito, remete a segurança de cara.
function initSecurityShield(canvasId) {
    const canvas = document.getElementById(canvasId);
    const skip = !canvas
        || window.matchMedia("(max-width: 768px)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) return;

    const CYAN = 0x7dd3dc;
    const CORAL = 0xff6b6b;

    // 20/09/2026: o canvas agora vive DENTRO do "palco" da chave (`.sec-stage`,
    // index.html) em vez de ser fundo da seção inteira - o cadeado aparece
    // grande, sozinho, sem texto/cards por cima. O estado "aberto" vem da
    // classe `is-open` do palco (colocada por script.js quando a chave é
    // encaixada) - lida a cada frame, então não depende de qual script
    // carregou primeiro.
    const stage = canvas.parentElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 8.4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const core = new THREE.Group();
    scene.add(core);

    // Corpo do cadeado (caixa com segmentos extras pra render tipo
    // "circuito" no wireframe, não só as 12 arestas de uma caixa lisa)
    // + argola (metade de um torus - a geometria do Torus varre um
    // arco no plano XY começando em (R,0,0) e subindo até (-R,0,0)
    // passando por (0,R,0) com arc=PI, ou seja, já nasce em formato de
    // "U invertido" - só precisa ficar encostada no topo do corpo).
    const bodyW = 2.7, bodyH = 2.1, bodyD = 1.5;
    const shackleR = 1.05, shackleTube = 0.22;

    let glowMat = null;
    // A argola fica num pivô no pé ESQUERDO dela: ao abrir, sobe e gira em
    // torno dessa perna (como um cadeado de verdade), em vez de só subir.
    let shacklePivot = null;
    const shackleBaseY = -bodyH * 0.35 + bodyH / 2 - 0.15;
    function buildLockLayer(opacity, glowOpacity) {
        const group = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(bodyW, bodyH, bodyD, 3, 3, 2);
        const bodyMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = -bodyH * 0.35;
        group.add(body);

        const shackleGeo = new THREE.TorusGeometry(shackleR, shackleTube, 8, 32, Math.PI);
        const shackleMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity });
        const shackle = new THREE.Mesh(shackleGeo, shackleMat);
        shackle.position.x = shackleR; // relativo ao pivô (pé esquerdo)
        shacklePivot = new THREE.Group();
        shacklePivot.position.set(-shackleR, shackleBaseY, 0);
        shacklePivot.add(shackle);
        group.add(shacklePivot);

        if (glowOpacity) {
            glowMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: glowOpacity });
            const glowBody = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.94, bodyH * 0.94, bodyD * 0.94), glowMat);
            glowBody.position.copy(body.position);
            group.add(glowBody);
        }
        return group;
    }

    core.add(buildLockLayer(0.6, 0.06));

    // "Fechadura" - um pequeno furo/marca no corpo (torus fininho) pra
    // reforçar a leitura de "cadeado" mesmo de longe/ângulos variados.
    const keyholeGeo = new THREE.TorusGeometry(0.22, 0.05, 8, 20);
    const keyholeMat = new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.7 });
    const keyhole = new THREE.Mesh(keyholeGeo, keyholeMat);
    keyhole.position.set(0, -bodyH * 0.35, bodyD / 2 + 0.01);
    core.add(keyhole);

    // Anel inclinado, tipo halo de escaneamento/proteção orbitando o
    // núcleo - eixo diferente do resto pra dar sensação de camadas
    // girando em velocidades/direções distintas.
    const ring = new THREE.Group();
    ring.rotation.x = Math.PI / 2.6;
    const ringGeo = new THREE.TorusGeometry(5.1, 0.025, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.45 });
    ring.add(new THREE.Mesh(ringGeo, ringMat));
    scene.add(ring);

    // Nuvem de pontos orbitando (dados protegidos) - mesma técnica de
    // distribuição esférica do initNodeNetwork, sem linhas de conexão
    // (fica mais "partícula solta ao redor do núcleo" que "rede").
    const dotCount = 46;
    const positions = [];
    const colors = [];
    const cyanColor = new THREE.Color(CYAN);
    const coralColor = new THREE.Color(CORAL);
    for (let i = 0; i < dotCount; i++) {
        const radius = 5.6 + Math.random() * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        const c = Math.random() < 0.15 ? coralColor : cyanColor;
        colors.push(c.r, c.g, c.b);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const dotsMat = new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const dots = new THREE.Points(dotsGeo, dotsMat);
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function resize() {
        const rect = stage.getBoundingClientRect();
        // palco escondido (display:none - ex.: imagem aberta no lugar dele)
        // mede 0x0: aspect virava NaN. Ignora e espera o ResizeObserver.
        if (!rect.width || !rect.height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    resize();

    const clock = new THREE.Clock();
    let isVisible = true;
    let openAmt = 0;   // 0 = trancado, 1 = argola aberta (suavizado)
    let boost = 0;     // pico de brilho quando destranca
    let wasOpen = false;
    const TWO_PI = Math.PI * 2;
    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        const open = stage.classList.contains("is-open");
        if (open && !wasOpen) boost = 1;
        wasOpen = open;
        openAmt += ((open ? 1 : 0) - openAmt) * 0.07;
        boost *= 0.955;

        // aberto: para de girar e vira de frente pra mostrar a argola abrindo
        if (open) {
            const front = Math.round(core.rotation.y / TWO_PI) * TWO_PI;
            core.rotation.y += (front - core.rotation.y) * 0.06;
        } else {
            core.rotation.y += 0.0026;
        }
        core.rotation.x = Math.sin(t * 0.25) * 0.12 * (1 - openAmt * 0.6);
        const pulse = 1 + Math.sin(t * 1.1) * 0.04 + boost * 0.12;
        core.scale.setScalar(pulse);
        glowMat.opacity = 0.04 + Math.sin(t * 1.1) * 0.025 + boost * 0.3 + openAmt * 0.06;

        shacklePivot.position.y = shackleBaseY + 0.42 * openAmt;
        shacklePivot.rotation.y = -Math.PI * 0.62 * openAmt;

        ring.rotation.z += 0.006 + boost * 0.09;
        dots.rotation.y -= 0.0011 + boost * 0.02;
        dots.rotation.x += 0.0004;

        camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2.2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
    observeVisibility(canvas, (visible) => { isVisible = visible; });
    // avisa o CSS que o 3D está de pé (esconde o cadeado SVG de reserva)
    stage.classList.add("has-3d");
}

initSecurityShield("security-3d");

// Cena 3D da seção "O Problema" (13/09/2026) - Carlos pediu melhorar
// de novo depois da primeira rodada (que só tinha mexido no efeito 2D
// de constelação, não numa cena 3D de verdade). Conceito pensado pra
// contrastar com o check do Hero (organizado, uma peça só, cores da
// marca) - aqui é o OPOSTO: fragmentos soltos, cada um girando no seu
// próprio eixo/velocidade (não uma rotação unificada), maioria coral
// (cor de alerta do site) com uns poucos ciano, e linhas de "conexão"
// entre os fragmentos mais próximos que piscam fraco em vez de ficar
// acesas - a ideia visual é "informação espalhada, conexões quebradas/
// instáveis", literalmente o que a seção descreve (estoque
// desorganizado, informações espalhadas, falta de indicador
// confiável). Mesma técnica de sempre (wireframe + partículas +
// pausa via IntersectionObserver), só a composição/movimento é
// deliberadamente mais caótica que as outras cenas do site.
function initFragmentsScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const skip = !canvas
        || window.matchMedia("(max-width: 768px)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) return;

    const CYAN = 0x7dd3dc;
    const CORAL = 0xff6b6b;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 13;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    // 9 fragmentos soltos (não um grupo só - cada um tem seu próprio
    // Object3D, gira sozinho) espalhados num volume amplo, tamanho e
    // posição variados - de propósito irregular, não numa grade/
    // padrão, pra reforçar "desorganizado".
    const fragmentCount = 9;
    const fragments = [];
    for (let i = 0; i < fragmentCount; i++) {
        const isCoral = i % 3 !== 0;
        const size = 0.5 + Math.random() * 0.55;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshBasicMaterial({
            color: isCoral ? CORAL : CYAN,
            wireframe: true,
            transparent: true,
            opacity: 0.55 + Math.random() * 0.25,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const radius = 3 + Math.random() * 4.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta) * 0.7,
            radius * Math.cos(phi) * 0.6
        );
        mesh.userData.spin = {
            x: (Math.random() - 0.5) * 0.012,
            y: (Math.random() - 0.5) * 0.012,
            z: (Math.random() - 0.5) * 0.012,
        };
        mesh.userData.bob = { phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.5 };
        mesh.userData.basePos = mesh.position.clone();
        scene.add(mesh);
        fragments.push(mesh);
    }

    // Linhas de "tentativa de conexão" entre pares próximos - cada
    // linha pisca fraco (nunca fica sólida/estável), representando
    // conexão quebrada, não uma rede funcionando (isso é o Hero).
    const linkPairs = [];
    for (let i = 0; i < fragmentCount; i++) {
        for (let j = i + 1; j < fragmentCount; j++) {
            const dist = fragments[i].position.distanceTo(fragments[j].position);
            if (dist < 5) linkPairs.push([i, j]);
        }
    }
    const linkGeo = new THREE.BufferGeometry();
    const linkPositions = new Float32Array(linkPairs.length * 6);
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: CORAL, transparent: true, opacity: 0.25 });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    scene.add(links);

    // Poeira de partículas espalhada (mesma técnica de sempre, volume
    // mais espalhado/menos concentrado no centro que as outras cenas).
    const particleCount = 26;
    const positions = [];
    const colors = [];
    const cyanColor = new THREE.Color(CYAN);
    const coralColor = new THREE.Color(CORAL);
    for (let i = 0; i < particleCount; i++) {
        const radius = 2 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta) * 0.7, radius * Math.cos(phi) * 0.6);
        const c = Math.random() < 0.3 ? coralColor : cyanColor;
        colors.push(c.r, c.g, c.b);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true }));
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let isVisible = true;
    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        fragments.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.spin.x;
            mesh.rotation.y += mesh.userData.spin.y;
            mesh.rotation.z += mesh.userData.spin.z;
            const { phase, speed } = mesh.userData.bob;
            mesh.position.y = mesh.userData.basePos.y + Math.sin(t * speed + phase) * 0.35;
        });

        const posAttr = links.geometry.attributes.position;
        linkPairs.forEach(([i, j], idx) => {
            const a = fragments[i].position, b = fragments[j].position;
            posAttr.setXYZ(idx * 2, a.x, a.y, a.z);
            posAttr.setXYZ(idx * 2 + 1, b.x, b.y, b.z);
        });
        posAttr.needsUpdate = true;
        // Pisca fraco e fora de sincronia - "conexão instável", nunca
        // uma rede firme como a do Hero.
        linkMat.opacity = 0.08 + Math.abs(Math.sin(t * 0.6)) * 0.22;

        dots.rotation.y += 0.0006;

        camera.position.x += (mouseX * 1.8 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.8 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
    observeVisibility(canvas, (visible) => { isVisible = visible; });
}

initFragmentsScene("problemas-3d");

// Cena 3D da seção "Visão completa" (#indicadores, 13/09/2026) - Carlos
// pediu o mesmo tratamento de "O Problema", mas avisou que essa seção
// é pequena (só 3 cards - CMV/CMO/CMC), então a cena precisa fazer
// sentido nesse tamanho, não ser grandiosa igual Hero/Segurança.
// Conceito: o OPOSTO de "O Problema" de propósito (aquela é fragmentos
// soltos com conexão quebrada/piscando) - aqui são só 3 núcleos
// pequenos (um por indicador), ligados por linhas SÓLIDAS e estáveis
// (nunca piscam), girando juntos como um grupo só (ordem, não caos),
// com um anel fino de "escaneamento" passando por eles (remete a
// "visão completa"/enxergar tudo de uma vez). Poucas partículas de
// propósito - seção pequena não precisa de cena densa.
function initInsightScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const skip = !canvas
        || window.matchMedia("(max-width: 768px)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) return;

    const CYAN = 0x7dd3dc;
    const CORAL = 0xff6b6b;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);

    // 3 núcleos (1 por indicador - CMV/CMO/CMC) em formação de
    // triângulo estável, cada um wireframe + miolo translúcido (mesma
    // técnica de glow do cadeado/check).
    const glowMats = [];
    const nodeCount = 3;
    const nodeRadius = 2.3;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
        const pos = new THREE.Vector3(Math.cos(angle) * nodeRadius, Math.sin(angle) * nodeRadius, 0);
        const color = i === 1 ? CORAL : CYAN;

        const nodeGroup = new THREE.Group();
        nodeGroup.position.copy(pos);
        const bodyMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 });
        nodeGroup.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), bodyMat));
        const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 });
        glowMats.push(glowMat);
        nodeGroup.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), glowMat));
        group.add(nodeGroup);
        nodes.push(nodeGroup);
    }

    // Linhas sólidas conectando os 3 (nunca piscam - o oposto da
    // conexão quebrada de "O Problema").
    const linkGeo = new THREE.BufferGeometry();
    const linkPositions = new Float32Array(nodeCount * 2 * 3);
    for (let i = 0; i < nodeCount; i++) {
        const a = nodes[i].position, b = nodes[(i + 1) % nodeCount].position;
        linkPositions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    }
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5 });
    group.add(new THREE.LineSegments(linkGeo, linkMat));

    // Anel fino de "escaneamento" passando pelos 3 núcleos - remete a
    // "enxergar tudo de uma vez" (visão completa).
    const scanRing = new THREE.Mesh(
        new THREE.TorusGeometry(nodeRadius, 0.015, 8, 96),
        new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35 })
    );
    group.add(scanRing);

    // Poeira esparsa - de propósito bem menos densa que as outras
    // cenas, a seção é pequena.
    const particleCount = 10;
    const positions = [];
    const colors = [];
    const cyanColor = new THREE.Color(CYAN);
    const coralColor = new THREE.Color(CORAL);
    for (let i = 0; i < particleCount; i++) {
        const radius = 3.4 + Math.random() * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi) * 0.6);
        const c = Math.random() < 0.3 ? coralColor : cyanColor;
        colors.push(c.r, c.g, c.b);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true }));
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let isVisible = true;
    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        // Gira junto, como um grupo só - ordem/clareza, diferente dos
        // fragmentos de "O Problema" que giram cada um por conta.
        group.rotation.y += 0.0034;
        group.rotation.x = Math.sin(t * 0.22) * 0.14;

        glowMats.forEach((m, i) => { m.opacity = 0.1 + Math.sin(t * 1.1 + i * 1.8) * 0.05; });
        linkMat.opacity = 0.45 + Math.sin(t * 0.8) * 0.08;

        scanRing.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.4;
        scanRing.rotation.z += 0.003;

        dots.rotation.y -= 0.0008;

        camera.position.x += (mouseX * 1.6 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.6 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
    observeVisibility(canvas, (visible) => { isVisible = visible; });
}

initInsightScene("indicadores-3d");
