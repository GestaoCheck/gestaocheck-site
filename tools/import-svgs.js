/*
 * Importa os SVGs vetoriais do sistema (imagens das funcionalidades do
 * site) pra assets/sistema/.
 *
 * Uso:  node tools/import-svgs.js [--partial] <pasta> [<pasta> ...]
 *   (as pastas onde os zips `files*.zip` foram extraídos - o script
 *    procura cada arquivo da lista abaixo em todas elas)
 *
 * O que faz:
 *  - copia só os SVGs que o index.html realmente usa (escuro + -branco);
 *  - remove o bloco <metadata> (manifesto c2pa em base64, ~7,7KB por
 *    arquivo - só proveniência, não desenha nada);
 *  - confere que o arquivo é vetor de verdade (sem <image>, sem
 *    <foreignObject>, sem <script>, sem link externo) - o site roda com
 *    CSP restritivo e o SVG entra via <img>, então nada disso funcionaria.
 *
 * Os SVGs têm texto REAL (`<text>`) com as fontes Manrope/Fraunces
 * embutidas em data-URI, então renderizam iguais em qualquer zoom e não
 * dependem de nenhuma fonte externa. As animações (Multi-IA, Segurança,
 * Beneficiamento) são SMIL (`<animate>`), que roda dentro de <img>.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'sistema');
// Nome no zip -> nome no site. `09_inicial_dashboard` virou `09_inicio`: filtros
// de bloqueadores de anuncio/privacidade (extensoes do Chrome) barram URLs com
// "dashboard" e a tela "antes" do cursor aparecia como imagem quebrada.
const RENAME = { '09_inicial_dashboard': '09_inicio' };
const NEEDED = [
  // telas (numeração do sistema) - seções e popups do index.html
  '01_relatorio_composicao_primecost', '02_dre_completa', '03_curva_abc', '04_caixa_fechamento',
  '05_patrimonio', '06_despesas', '09_inicial_dashboard', '10_estoque', '11_cmv_visaogeral',
  '12_cmo', '13_cmc_visaogeral', '15_avarias', '17_checklists', '19_requisicao',
  // animados
  'multi_ia_zoom', 'beneficiamento_entrada', 'seguranca_2fa_fluxo',
];

// <svg x y width height viewBox="0 0 N N"> aninhado (icones do card de clima) vira
// <g transform>: equivalente (icone quadrado, mesma escala) e deixa UM unico </svg> por
// arquivo. O Live Server do VS Code injeta seu script de live-reload antes do PRIMEIRO
// </svg> - se ele for de um svg aninhado, o arquivo quebra (imagem quebrada no site).
const flattenNestedSvg = (str) => str.replace(/<svg x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" viewBox="0 0 (\d+) (\d+)">([\s\S]*?)<\/svg>/g,
  (m, x, y, w, h, vw, vh, body) => {
    if (vw !== vh || w !== h) throw new Error('svg aninhado nao quadrado: ' + m.slice(0, 80));
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + +(w / vw).toFixed(5) + ')">' + body + '</g>';
  });

// --partial: zip com so ALGUMAS telas (ex.: 3 trocadas) - importa as que achar e pula o resto
const partial = process.argv.includes('--partial');
const dirs = process.argv.slice(2).filter((a) => a !== '--partial');
if (!dirs.length) { console.error('Uso: node tools/import-svgs.js <pasta> [<pasta> ...]'); process.exit(1); }

const find = (name) => {
  for (const d of dirs) { const p = path.join(d, name); if (fs.existsSync(p)) return p; }
  return null;
};

fs.mkdirSync(OUT, { recursive: true });
let total = 0, before = 0, done = 0;
for (const base of NEEDED) {
  for (const suffix of ['', '-branco']) {
    const name = base + suffix + '.svg';
    const src = find(name);
    if (!src) { if (partial) continue; throw new Error('não achei ' + name + ' em ' + dirs.join(' | ')); }
    let s = fs.readFileSync(src, 'utf8');
    before += s.length;
    const bad = [/<image\b/, /<foreignObject\b/, /<script\b/, /href="https?:/, /url\(\s*https?:/];
    for (const re of bad) if (re.test(s)) throw new Error(name + ': contém ' + re + ' (não roda via <img> com o CSP do site)');
    s = flattenNestedSvg(s);
    s = s.replace(/<metadata>[\s\S]*?<\/metadata>/, '').replace(/\sxmlns:c2pa="[^"]*"/, '');
    fs.writeFileSync(path.join(OUT, (RENAME[base] || base) + suffix + '.svg'), s);
    total += s.length;
    done++;
    if (partial) console.log('  importado:', (RENAME[base] || base) + suffix + '.svg');
  }
}
console.log(`${done} SVGs em assets/sistema/ (${(before / 1024).toFixed(0)}KB -> ${(total / 1024).toFixed(0)}KB sem metadata)`);
