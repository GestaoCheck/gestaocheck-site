<div class="vitrine-aviso">Demonstração interativa — clique numa classe (A/B/C) pra filtrar a lista de itens.</div>
<div class="kgrid kgrid-3">
    <div class="kcard"><span class="kcard-val">R$ 559.646,00</span><span class="kcard-lbl">Classe A (6 itens)</span></div>
    <div class="kcard"><span class="kcard-val">R$ 85.626,00</span><span class="kcard-lbl">Classe B (5 itens)</span></div>
    <div class="kcard"><span class="kcard-val">R$ 25.507,00</span><span class="kcard-lbl">Classe C (4 itens)</span></div>
</div>

<div class="painel" style="padding:18px;margin-top:14px">
    <div class="painel-titulo-linha"><div class="secao-titulo">Itens por classe</div></div>
    <p style="font-size:12.5px;color:var(--texto-muted);margin:6px 0 12px">A = os itens que já somam os primeiros 80% do faturamento (os mais importantes); B = até 95%; C = o resto.</p>
    <div style="display:flex;gap:8px;margin-bottom:14px">
        <button class="vit-classe-chip active" data-gc-click="vitFiltrarClasse('todas', this)">Todas</button>
        <button class="vit-classe-chip" data-gc-click="vitFiltrarClasse('A', this)">Classe A</button>
        <button class="vit-classe-chip" data-gc-click="vitFiltrarClasse('B', this)">Classe B</button>
        <button class="vit-classe-chip" data-gc-click="vitFiltrarClasse('C', this)">Classe C</button>
    </div>
    <div class="tabela-scroll">
        <table class="tabela">
            <thead><tr><th>Item</th><th>Faturamento</th><th>Qtd. vendida</th><th>% do total</th><th>Classe</th></tr></thead>
            <tbody id="vitTbody"><tr data-classe="A"><td>Filé Mignon ao Molho Madeira</td><td>R$ 176.024,20</td><td>1958</td><td>26,2%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="A"><td>Picanha na Brasa (300g)</td><td>R$ 142.982,00</td><td>1459</td><td>21,3%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="A"><td>Risoto de Camarão</td><td>R$ 91.035,00</td><td>1190</td><td>13,6%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="A"><td>Salmão Grelhado com Legumes</td><td>R$ 72.324,00</td><td>882</td><td>10,8%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="A"><td>Taça de Vinho Tinto</td><td>R$ 49.172,00</td><td>1294</td><td>7,3%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="A"><td>Espaguete à Bolonhesa</td><td>R$ 28.108,80</td><td>512</td><td>4,2%</td><td><span class="badge badge-green">A</span></td></tr><tr data-classe="B"><td>Chopp Artesanal (500ml)</td><td>R$ 21.337,00</td><td>1123</td><td>3,2%</td><td><span class="badge badge-orange">B</span></td></tr><tr data-classe="B"><td>Caipirinha de Limão</td><td>R$ 18.768,00</td><td>782</td><td>2,8%</td><td><span class="badge badge-orange">B</span></td></tr><tr data-classe="B"><td>Bruschetta de Tomate e Manjericão</td><td>R$ 15.872,00</td><td>496</td><td>2,4%</td><td><span class="badge badge-orange">B</span></td></tr><tr data-classe="B"><td>Carpaccio de Filé Mignon</td><td>R$ 15.345,00</td><td>341</td><td>2,3%</td><td><span class="badge badge-orange">B</span></td></tr><tr data-classe="B"><td>Petit Gateau com Sorvete</td><td>R$ 14.304,00</td><td>447</td><td>2,1%</td><td><span class="badge badge-orange">B</span></td></tr><tr data-classe="C"><td>Tiramisu da Casa</td><td>R$ 8.988,00</td><td>321</td><td>1,3%</td><td><span class="badge badge-red">C</span></td></tr><tr data-classe="C"><td>Bolinho de Bacalhau (6un)</td><td>R$ 8.968,00</td><td>236</td><td>1,3%</td><td><span class="badge badge-red">C</span></td></tr><tr data-classe="C"><td>Refrigerante Lata</td><td>R$ 4.311,00</td><td>479</td><td>0,6%</td><td><span class="badge badge-red">C</span></td></tr><tr data-classe="C"><td>Água com Gás</td><td>R$ 3.240,00</td><td>405</td><td>0,5%</td><td><span class="badge badge-red">C</span></td></tr></tbody>
        </table>
    </div>
</div>
