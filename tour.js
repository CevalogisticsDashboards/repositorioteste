/* ====
   TOUR GUIADO – Gestão de Devoluções (CVT / CEVA)
   Autônomo: injeta próprio CSS/HTML, usa dados fictícios apenas
   durante o tour (com backup/restauração automática do real)
   e executa demonstrações animadas com mouse e digitação.
   ==== */
(function () {
  'use strict';

  const TOUR_DONE_KEY = 'devolucoesTourDone_v1';
  const STORAGE_KEY = 'devolucoes_cargas_tickets';
  const BACKUP_KEY = 'devolucoes_cargas_tickets__tour_backup';
  const NULL_SENTINEL = '__TOUR_EMPTY_STORAGE__';

  const $ = (s) => document.querySelector(s);

  const store = {
    get() { try { return localStorage.getItem(TOUR_DONE_KEY); } catch (e) { return null; } },
    set() { try { localStorage.setItem(TOUR_DONE_KEY, '1'); } catch (e) {} }
  };

  function getMockTickets() {
    const now = Date.now();
    const h = (hrs) => new Date(now - hrs * 3600 * 1000).toISOString();
    return [
      {
        id: 'tour-mock-1',
        ticket_id_serial: 'DEV-0001',
        created_at: h(2),
        notas_fiscais: 'NF 45890, NF 45891',
        transportadora: 'Jadlog',
        qtd_volumes: 4,
        cliente: 'Cliente 1',
        motivo_devolucao: 'Recusa no Cliente',
        tipo_carga: 'Paletizada',
        observacoes: 'Cliente solicitou retorno por janela de recebimento expirada.',
        status: 'coleta-solicitada',
        comments: [
          {
            id: 'tour-cmt-1',
            created_at: h(2),
            content: 'Devolução registrada na etapa COLETA SOLICITADA - CVT (NFs: NF 45890, NF 45891)',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      },
      {
        id: 'tour-mock-2',
        ticket_id_serial: 'DEV-0002',
        created_at: h(5),
        notas_fiscais: 'NF 46102',
        transportadora: 'Braspress',
        qtd_volumes: 12,
        cliente: 'Cliente 4',
        motivo_devolucao: 'Desacordo Comercial',
        tipo_carga: 'Granel',
        observacoes: '',
        status: 'coleta-solicitada',
        comments: [
          {
            id: 'tour-cmt-2',
            created_at: h(5),
            content: 'Devolução registrada na etapa COLETA SOLICITADA - CVT (NFs: NF 46102)',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      },
      {
        id: 'tour-mock-3',
        ticket_id_serial: 'DEV-0003',
        created_at: h(10),
        notas_fiscais: 'NF 45715',
        transportadora: 'DHL Supply Chain',
        qtd_volumes: 2,
        cliente: 'Cliente 2',
        motivo_devolucao: 'Divergência de Pedido',
        tipo_carga: 'Paletizada',
        observacoes: 'Veículo descarregado na doca 04 sem avarias aparentes.',
        status: 'chegada-ceva',
        comments: [
          {
            id: 'tour-cmt-3',
            created_at: h(8),
            content: 'Status alterado para: CHEGADA EM DOCA - CEVA',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          },
          {
            id: 'tour-cmt-4',
            created_at: h(10),
            content: 'Devolução registrada na etapa COLETA SOLICITADA - CVT (NFs: NF 45715)',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 2
      },
      {
        id: 'tour-mock-4',
        ticket_id_serial: 'DEV-0004',
        created_at: h(16),
        notas_fiscais: 'NF 45601, NF 45602',
        transportadora: 'FedEx / TNT',
        qtd_volumes: 6,
        cliente: 'Cliente 7',
        motivo_devolucao: 'Avaria',
        tipo_carga: 'Granel',
        observacoes: 'Caixas externas amassadas durante o transporte.',
        status: 'grau-motivo',
        comments: [
          {
            id: 'tour-cmt-5',
            created_at: h(12),
            content: 'Status alterado para: GRAU / MOTIVO - CVT',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          },
          {
            id: 'tour-cmt-6',
            created_at: h(14),
            content: 'Fotos das caixas amassadas anexadas ao dossiê da QA.',
            is_system_generated: false,
            user: { full_name: 'Operador' }
          }
        ],
        comments_count: 2
      },
      {
        id: 'tour-mock-5',
        ticket_id_serial: 'DEV-0005',
        created_at: h(24),
        notas_fiscais: 'NF 45488',
        transportadora: 'Rodonaves',
        qtd_volumes: 1,
        cliente: 'Cliente 5',
        motivo_devolucao: 'Produto Vencido',
        tipo_carga: 'Paletizada',
        observacoes: 'Lote segregado para conferência física no WMS.',
        status: 'recebimento-wms',
        comments: [
          {
            id: 'tour-cmt-7',
            created_at: h(19),
            content: 'Status alterado para: RECEBIMENTO WMS - CEVA',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      },
      {
        id: 'tour-mock-6',
        ticket_id_serial: 'DEV-0006',
        created_at: h(32),
        notas_fiscais: 'NF 45320',
        transportadora: 'Patrus Transportes',
        qtd_volumes: 3,
        cliente: 'Cliente 3',
        motivo_devolucao: 'Avaria',
        tipo_carga: 'Paletizada',
        observacoes: 'Aguardando parecer final da equipe de Qualidade.',
        status: 'checklist-qa',
        comments: [
          {
            id: 'tour-cmt-8',
            created_at: h(26),
            content: 'Status alterado para: CHECK LIST - QA - CEVA',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      },
      {
        id: 'tour-mock-7',
        ticket_id_serial: 'DEV-0007',
        created_at: h(48),
        armazenado_em: h(20),
        notas_fiscais: 'NF 45110',
        transportadora: 'Jamef',
        qtd_volumes: 5,
        cliente: 'Cliente 9',
        motivo_devolucao: 'Recusa no Cliente',
        tipo_carga: 'Granel',
        observacoes: 'Lançamento fiscal e estoque concluídos no SAP.',
        status: 'recebimento-sap',
        comments: [
          {
            id: 'tour-cmt-9',
            created_at: h(20),
            content: 'Status alterado para: RECEBIMENTO SAP - CVT',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      },
      {
        id: 'tour-mock-8',
        ticket_id_serial: 'DEV-0008',
        created_at: h(55),
        notas_fiscais: 'NF 45009',
        transportadora: 'Correios',
        qtd_volumes: 1,
        cliente: 'Cliente 6',
        motivo_devolucao: 'Divergência de Pedido',
        tipo_carga: 'Granel',
        observacoes: 'Registro cancelado por abertura em duplicidade.',
        status: 'CANCELADOS',
        comments: [
          {
            id: 'tour-cmt-10',
            created_at: h(50),
            content: 'Status alterado para: CANCELADOS',
            is_system_generated: true,
            user: { full_name: 'Sistema' }
          }
        ],
        comments_count: 1
      }
    ];
  }

  function recoverInterruptedBackup() {
    let changed = false;
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup !== null) {
        if (backup === NULL_SENTINEL) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, backup);
        localStorage.removeItem(BACKUP_KEY);
        changed = true;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((t) => !String(t && t.id || '').startsWith('tour-mock-'));
          if (cleaned.length !== parsed.length) {
            if (cleaned.length === 0) localStorage.removeItem(STORAGE_KEY);
            else localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            changed = true;
          }
        }
      }
    } catch (e) {}
    return changed;
  }

  // Limpa eventuais backups/registros fictícios residuais no localStorage sem expô-los fora do tour
  recoverInterruptedBackup();

  function activateMockData() {
    try {
      window.__devTourBridge?.setTourTickets(getMockTickets());
    } catch (e) {}
  }

  function resetMockData() {
    try {
      window.__devTourBridge?.setTourTickets(getMockTickets());
    } catch (e) {}
  }

  function restoreRealData() {
    try {
      recoverInterruptedBackup();
      window.__devTourBridge?.clearTourTickets();
    } catch (e) {}
  }

  const STEPS = [
    {
      title: '👋 Bem-vindo à Gestão de Devoluções',
      text: `Este painel acompanha o ciclo completo das <b>devoluções de carga</b>, desde a solicitação de coleta até o recebimento final no SAP.<br><br>Durante este tour usaremos apenas <b>dados fictícios de demonstração</b> com animações de mouse e digitação. Ao finalizar, seus dados reais permanecem intactos.`
    },
    {
      sel: '#kanban-columns-area',
      title: '📋 Fluxo Kanban em 7 etapas',
      text: `As colunas representam a jornada da devolução: <b>Coleta Solicitada - CVT</b>, <b>CHEGADA EM DOCA - CEVA</b>, <b>Grau / Motivo - CVT</b>, <b>Recebimento WMS - CEVA</b>, <b>Check List - QA - CEVA</b>, <b>Recebimento SAP - CVT</b> e <b>Cancelados</b>.<br><br>Em cada etapa você acompanha a quantidade de tickets e o responsável (<b>CVT</b> ou <b>CEVA</b>).`
    },
    {
      sel: '#search-input',
      anim: 'search',
      title: '🔍 Busca instantânea',
      text: `Digite qualquer trecho de <b>Nota Fiscal, transportadora, cliente, motivo ou código DEV</b> para filtrar o quadro em tempo real.<br><br>Acompanhe a digitação simulada filtrando os cartões instantaneamente.`
    },
    {
      sel: '#filter-status-select',
      anim: 'filter',
      title: '🎯 Filtro por status',
      text: `Precisa focar em apenas uma etapa da operação? Clique no filtro para visualizar todas as opções e selecionar o status desejado.<br><br>O quadro isola automaticamente a coluna escolhida e você pode voltar para <b>Todos os status</b> a qualquer momento.`
    },
    {
      sel: '.ticket-card[data-ticket-id="tour-mock-1"]',
      title: '🪪 Cartões de devolução',
      text: `Cada cartão resume os dados principais da carga: <b>Transportadora</b>, logo do responsável (<b>CVT</b> ou <b>CEVA</b>), <b>Cliente</b>, <b>Motivo</b>, quantidade de <b>Volumes/Pallets</b>, código sequencial de número do registro (<b>DEV-XXXX</b>) e total de comentários.`
    },
    {
      sel: '.ticket-card[data-ticket-id="tour-mock-1"]',
      anim: 'ticketModal',
      offsetY: 999,
      title: '💬 Detalhes, comentários e avanço de etapa',
      text: `Clique em qualquer cartão para abrir seus detalhes completos, registrar ocorrências e avançar a devolução para a próxima etapa do fluxo.`
    },
    {
      sel: '.new-ticket-btn-trigger',
      anim: 'newTicket',
      title: '➕ Registrar nova devolução',
      text: `Clique no botão azul <b>+</b> no canto inferior direito para cadastrar uma nova devolução.<br><br>Acompanhe a demonstração preenchendo as <b>Notas Fiscais</b>, selecionando <b>Transportadora</b> e <b>Cliente</b> nos campos de busca, escolhendo o <b>Motivo</b> (<i>Recusa no Cliente</i>) e o <b>Tipo de Carga</b>.`
    },
    {
        sel: '#wtHelpBtn',
        title: '✅ Tour concluído!',
        text: `Tudo pronto! Quando encerrar, os dados fictícios serão removidos automaticamente para você operar com segurança.<br><br>Para rever este guia quando quiser, clique no botão <b>? Tour guiado</b> no cabeçalho. Atalhos: <kbd>←</kbd> <kbd>→</kbd> navegam e <kbd>Esc</kbd> fecha.`
      }
  ];

  let idx = 0, active = false, built = false;
  const el = {};

  function injectCSS() {
    const st = document.createElement('style');
    st.textContent = `
      .wt-block{position:fixed;inset:0;z-index:20000;display:none;-webkit-backdrop-filter:blur(2.5px);backdrop-filter:blur(2.5px);transition:clip-path .28s ease}
      .wt-spot{position:fixed;z-index:20001;pointer-events:none;border-radius:10px;display:none;
        box-shadow:0 0 0 9999px rgba(15,23,42,.78),0 0 0 3px #60a5fa;transition:all .28s ease}
          .wt-tip{position:fixed;z-index:20002;display:none;width:min(365px,calc(100vw - 24px));background:#fff;color:#1f2937;
            border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.32);overflow:hidden;font-size:12.5px;line-height:1.5;
            user-select:none;animation:wtIn .2s ease;border:1px solid #e5e7eb}
          @keyframes wtIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
          .wt-prog{height:4px;background:#e5e7eb}
          .wt-prog>div{height:100%;background:#2563eb;transition:width .28s ease}
          .wt-body{padding:14px 16px 8px;position:relative}
          .wt-title{font-size:14.5px;font-weight:700;color:#1d4ed8;margin-bottom:6px}
          .wt-text b{color:#111827;font-weight:600}
          .wt-text i{color:#b45309;font-style:normal;font-weight:600}
          .wt-text kbd{background:#f3f4f6;border:1px solid #d1d5db;border-bottom-width:2px;border-radius:4px;padding:0 5px;font-family:monospace;font-size:11px;color:#111827}
          .wt-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 16px 14px;border-top:1px solid #f3f4f6;background:#fafafa}
          .wt-count{font-size:11px;color:#6b7280;font-weight:600}
          .wt-btns{display:flex;gap:6px}
          .wt-btn{height:28px;padding:0 12px;border-radius:6px;border:1px solid #d1d5db;background:#fff;color:#374151;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
          .wt-btn:hover{background:#f3f4f6}
          .wt-btn.primary{background:#2563eb;border-color:#2563eb;color:#fff}
          .wt-btn.primary:hover{background:#1d4ed8}
          .wt-btn.skip{border-color:transparent;color:#6b7280;background:transparent}
          .wt-btn[disabled]{opacity:.4;cursor:default}
          #wtHelpBtn{display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 11px;border-radius:9999px;border:1px solid #bfdbfe;
            background:#eff6ff;color:#1d4ed8;font-weight:600;font-size:12px;cursor:pointer;flex-shrink:0;transition:all .15s ease}
          #wtHelpBtn:hover{background:#dbeafe;border-color:#93c5fd}
          .wt-sim-select{position:fixed;z-index:20001;background:#fff;border:1px solid #d1d5db;border-radius:8px;
            box-shadow:0 12px 28px rgba(0,0,0,.22);padding:4px 0;font-size:12px;color:#1f2937;min-width:205px;display:none;pointer-events:none}
          .wt-sim-opt{padding:6px 12px;white-space:nowrap;display:flex;align-items:center;justify-content:space-between;transition:background .12s ease}
          .wt-sim-opt.hover{background:#eff6ff;color:#1d4ed8;font-weight:600}
          .wt-sim-opt.selected::after{content:'✓';font-size:11px;color:#2563eb;margin-left:10px;font-weight:700}
          .wt-cursor{position:fixed;left:0;top:0;z-index:100001;display:none;pointer-events:none;width:24px;height:24px;
            transition-property:left,top;transition-timing-function:cubic-bezier(.45,.05,.25,1);transition-duration:0ms;
            filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))}
          .wt-cursor svg{display:block;transition:transform .12s ease;transform-origin:1px 1px}
          .wt-cursor.press svg{transform:scale(.82)}
              .wt-ripple{position:fixed;z-index:100000;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;pointer-events:none;
                border:2px solid #2563eb;background:rgba(37,99,235,.28);animation:wtRipple .55s ease-out forwards}
              @keyframes wtRipple{from{transform:scale(.3);opacity:1}to{transform:scale(1.7);opacity:0}}
              .wt-player{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:20003;display:none;align-items:center;gap:10px;
                width:min(490px,calc(100vw - 24px));padding:8px 14px;border-radius:9999px;background:rgba(15,23,42,.92);
                -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#f8fafc;border:1px solid rgba(148,163,184,.28);
                box-shadow:0 12px 32px rgba(0,0,0,.4);user-select:none;font-size:12px}
              .wt-pbtn{width:30px;height:30px;border-radius:9999px;border:none;background:rgba(255,255,255,.1);color:#f8fafc;cursor:pointer;
                display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s ease,transform .1s ease}
              .wt-pbtn:hover{background:rgba(255,255,255,.2)}
              .wt-pbtn:active{transform:scale(.94)}
              .wt-pbtn.play{background:#2563eb;color:#fff}
              .wt-pbtn.play:hover{background:#1d4ed8}
              .wt-track-wrap{position:relative;flex:1;height:22px;display:flex;align-items:center;cursor:pointer;touch-action:none}
              .wt-track{position:relative;width:100%;height:6px;border-radius:9999px;background:rgba(255,255,255,.22);overflow:visible;transition:height .12s ease}
              .wt-track-wrap:hover .wt-track,.wt-track-wrap.scrubbing .wt-track{height:8px}
              .wt-track-fill{position:absolute;left:0;top:0;bottom:0;width:0%;border-radius:9999px;background:linear-gradient(90deg,#3b82f6,#60a5fa);pointer-events:none}
              .wt-track-thumb{position:absolute;top:50%;left:0%;width:14px;height:14px;border-radius:9999px;background:#fff;border:2px solid #2563eb;
                box-shadow:0 1px 4px rgba(0,0,0,.45);transform:translate(-50%,-50%) scale(.85);transition:transform .12s ease;pointer-events:none}
              .wt-track-wrap:hover .wt-track-thumb,.wt-track-wrap.scrubbing .wt-track-thumb{transform:translate(-50%,-50%) scale(1.1)}
              .wt-ptime{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#cbd5e1;white-space:nowrap;flex-shrink:0;min-width:72px;text-align:right}
              .wt-pbadge{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 7px;border-radius:9999px;
                background:rgba(245,158,11,.2);color:#fbbf24;border:1px solid rgba(245,158,11,.35);display:none;flex-shrink:0}
              .wt-player.is-paused .wt-pbadge{display:inline-flex}
              .wt-pspeed{min-width:48px;height:26px;padding:0 8px;border-radius:9999px;border:1px solid rgba(148,163,184,.28);
                background:rgba(255,255,255,.1);color:#f8fafc;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:700;
                cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
                transition:background .15s ease,border-color .15s ease,color .15s ease,transform .1s ease}
              .wt-pspeed:hover{background:rgba(255,255,255,.2)}
                  .wt-pspeed:active{transform:scale(.94)}
                  .wt-pspeed.active{background:rgba(37,99,235,.32);border-color:rgba(96,165,250,.65);color:#93c5fd}
                  body.wt-seeking .modal-backdrop,body.wt-seeking .modal-panel,body.wt-seeking .wt-cursor{animation:none !important;transition:none !important}
                  body.wt-scrubbing .wt-block,body.wt-scrubbing .wt-spot{transition:none !important}
                `;
                document.head.appendChild(st);
              }

          function build() {
            if (built) return;
            built = true;
            injectCSS();
            el.block = document.createElement('div'); el.block.className = 'wt-block';
            el.spot = document.createElement('div'); el.spot.className = 'wt-spot';
            el.tip = document.createElement('div'); el.tip.className = 'wt-tip';
            el.tip.innerHTML = `
              <div class="wt-prog"><div id="wtBar"></div></div>
              <div class="wt-body">
                <div class="wt-title" id="wtTitle"></div>
                <div class="wt-text" id="wtText"></div>
              </div>
              <div class="wt-foot">
                <span class="wt-count" id="wtCount"></span>
                <div class="wt-btns">
                  <button type="button" class="wt-btn skip" id="wtSkip">Pular</button>
                  <button type="button" class="wt-btn" id="wtPrev">← Anterior</button>
                  <button type="button" class="wt-btn primary" id="wtNext">Próximo →</button>
                </div>
              </div>`;
            el.player = document.createElement('div'); el.player.className = 'wt-player';
            el.player.innerHTML = `
              <button type="button" class="wt-pbtn play" id="wtPlayPause" title="Pausar / Continuar (Espaço)" aria-label="Pausar ou continuar simulação"></button>
              <button type="button" class="wt-pbtn" id="wtRewind" title="Voltar 3 segundos" aria-label="Voltar 3 segundos">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <div class="wt-track-wrap" id="wtTrackWrap" role="slider" aria-label="Progresso da simulação" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="wt-track">
                  <div class="wt-track-fill" id="wtTrackFill"></div>
                  <div class="wt-track-thumb" id="wtTrackThumb"></div>
                </div>
              </div>
              <span class="wt-pbadge" id="wtPauseBadge">Pausado</span>
              <span class="wt-ptime" id="wtPlayerTime">0:00 / 0:00</span>
              <button type="button" class="wt-pspeed" id="wtSpeed" title="Velocidade de reprodução" aria-label="Alterar velocidade de reprodução">1x</button>`;
            el.simSelect = document.createElement('div'); el.simSelect.className = 'wt-sim-select';
            el.cursor = document.createElement('div'); el.cursor.className = 'wt-cursor';
            el.cursor.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M0.5 0.5 L0.5 17 L5 12.8 L8.2 20.4 L11.2 19.1 L8 11.6 L14 11.6 Z" fill="#fff" stroke="#111827" stroke-width="1.4" stroke-linejoin="round"/></svg>';
            document.body.append(el.block, el.spot, el.simSelect, el.tip, el.player, el.cursor);
            $('#wtSkip').onclick = finish;
            $('#wtPrev').onclick = () => show(idx - 1);
            $('#wtNext').onclick = () => (idx === STEPS.length - 1 ? finish() : show(idx + 1));
            bindPlayerEvents();
          }

  function addHelpButton() {
    if ($('#wtHelpBtn')) return;
    const headerRow = document.querySelector('header .flex.items-center.justify-between');
    if (!headerRow) return;
    const btn = document.createElement('button');
    btn.id = 'wtHelpBtn';
    btn.type = 'button';
    btn.title = 'Tour guiado';
    btn.innerHTML = '<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:9999px;background:#2563eb;color:#fff;font-size:11px;font-weight:700">?</span><span>Tour guiado</span>';
    btn.onclick = () => start();
    headerRow.appendChild(btn);
  }

  function getZoom() {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;left:100px;top:100px;width:100px;height:100px;visibility:hidden;pointer-events:none;z-index:-1;';
    document.body.appendChild(probe);
    const r = probe.getBoundingClientRect();
    document.body.removeChild(probe);
    const zx = (r.width / 100) || 1;
    const zy = (r.height / 100) || 1;
    const ox = r.left - (100 * zx);
    const oy = r.top - (100 * zy);
    return { zx, zy, ox, oy };
  }

  function rectOf(node) {
    if (!node) return null;
    const q = node.getBoundingClientRect();
    if (q.width <= 0 || q.height <= 0) return null;
    return { left: q.left, top: q.top, right: q.right, bottom: q.bottom, width: q.width, height: q.height };
  }

  function unionRect(a, b) {
    if (!a) return b;
    if (!b) return a;
    const l = Math.min(a.left, b.left), t = Math.min(a.top, b.top);
    const r = Math.max(a.right, b.right), bt = Math.max(a.bottom, b.bottom);
    return { left: l, top: t, right: r, bottom: bt, width: r - l, height: bt - t };
  }

  function kanbanPreviewRect(maxH) {
    const sh = rectOf($('#sticky-header-clone-container'));
    const kb = rectOf($('#kanban-container'));
    const base = unionRect(sh, kb);
    if (!base) return null;
    const h = Math.min(base.height, maxH || 280);
    return { left: base.left, top: base.top, right: base.right, bottom: base.top + h, width: base.width, height: h };
  }

  function visibleRect(sel) {
    if (sel === '#kanban-columns-area') {
      return kanbanPreviewRect(320);
    }
    const node = $(sel);
    if (!node) return null;
    try {
      node.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    } catch (e) {}
    return rectOf(node);
  }

  function place(r, z, offsetY) {
    const t = el.tip;
    const tw = t.offsetWidth * z.zx;
    const th = t.offsetHeight * z.zy;
    const vw = innerWidth, vh = innerHeight, m = 12, gap = 14;
    const hasPlayer = !!(STEPS[idx] && STEPS[idx].anim);
    const pw = hasPlayer ? Math.min(490, vw - 24) : 0;
    const pLeft = (vw - pw) / 2 - 8;
    const pRight = (vw + pw) / 2 + 8;
    const checkMb = (cx) => (hasPlayer && cx + tw > pLeft && cx < pRight) ? 84 : m;
    let x, y;
    if (!r) {
      x = (vw - tw) / 2; y = (vh - th) / 2;
    } else if (r.bottom + gap + th + checkMb(Math.max(m, Math.min(r.left + r.width / 2 - tw / 2, vw - tw - m))) <= vh) {
      y = r.bottom + gap; x = r.left + r.width / 2 - tw / 2;
    } else if (r.top - gap - th - m >= 0) {
      y = r.top - gap - th; x = r.left + r.width / 2 - tw / 2;
    } else if (r.right + gap + tw + m <= vw) {
      y = Math.max(m, r.top); x = r.right + gap;
    } else if (r.left - gap - tw - m >= 0) {
      y = Math.max(m, r.top); x = r.left - gap - tw;
    } else {
      x = 14; y = vh - th - checkMb(14);
    }
    x = Math.max(m, Math.min(x, vw - tw - m));
    if (offsetY) y += offsetY;
    y = Math.max(m, Math.min(y, vh - th - checkMb(x)));
    t.style.left = ((x - z.ox) / z.zx) + 'px';
    t.style.top = ((y - z.oy) / z.zy) + 'px';
  }

  function applySpot(r, keepTipPos, offsetY) {
    const z = getZoom();
    const sp = el.spot;
    sp.style.display = 'block';
    if (r) {
      const p = 6;
      const x1 = ((r.left - p - z.ox) / z.zx);
      const y1 = ((r.top - p - z.oy) / z.zy);
      const w = ((r.width + p * 2) / z.zx);
      const h = ((r.height + p * 2) / z.zy);
      const x2 = x1 + w;
      const y2 = y1 + h;
      sp.style.left = x1 + 'px';
      sp.style.top = y1 + 'px';
      sp.style.width = w + 'px';
      sp.style.height = h + 'px';
      el.block.style.clipPath = `polygon(0% 0%, 0% 100%, ${x1}px 100%, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px 100%, 100% 100%, 100% 0%)`;
    } else {
      sp.style.left = '50%'; sp.style.top = '50%'; sp.style.width = '0px'; sp.style.height = '0px';
      el.block.style.clipPath = 'none';
    }
    if (!keepTipPos) place(r, z, offsetY);
  }

  //  MOTOR DE ANIMAÇÕES (CURSOR + DIGITAÇÃO)
  const ABORT = { aborted: true };
  const DEMO_DURATIONS = { search: 7523, filter: 13890, ticketModal: 12340, newTicket: 16645 };
  const SPEEDS = [1, 0.75, 0.5, 0.25];
  let demoToken = 0, shownStep = -1, activeModalSpot = false;
  let demoPaused = false, demoElapsed = 0, demoDuration = 0, seekTarget = null, playbackSpeed = 1;
  let currentAnim = null, isScrubbing = false, wasPausedBeforeScrub = false, lastScrubSeek = 0;
  let cursorPos = { x: 0, y: 0 };
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  function setSeekingMode(on) {
    document.body.classList.toggle('wt-seeking', !!on);
  }

  const ICON_PLAY = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';

  function formatTime(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  }

  function updatePlayerUI() {
    if (!el.player) return;
    const dur = Math.max(1, demoDuration || 1);
    const shownElapsed = (seekTarget !== null) ? seekTarget : demoElapsed;
    const pct = Math.max(0, Math.min(100, (shownElapsed / dur) * 100));
    const fill = $('#wtTrackFill'), thumb = $('#wtTrackThumb'), wrap = $('#wtTrackWrap');
    const timeEl = $('#wtPlayerTime'), playBtn = $('#wtPlayPause'), speedBtn = $('#wtSpeed');
    if (!isScrubbing) {
      if (fill) fill.style.width = pct.toFixed(2) + '%';
      if (thumb) thumb.style.left = pct.toFixed(2) + '%';
      if (wrap) wrap.setAttribute('aria-valuenow', String(Math.round(pct)));
      if (timeEl) timeEl.textContent = `${formatTime(shownElapsed)} / ${formatTime(dur)}`;
    }
    if (playBtn) playBtn.innerHTML = demoPaused ? ICON_PLAY : ICON_PAUSE;
    if (speedBtn) {
      speedBtn.textContent = `${playbackSpeed}x`;
      speedBtn.classList.toggle('active', playbackSpeed !== 1);
    }
    el.player.classList.toggle('is-paused', demoPaused);
  }

  function cycleSpeed() {
    const nextIdx = (SPEEDS.indexOf(playbackSpeed) + 1) % SPEEDS.length;
    playbackSpeed = SPEEDS[nextIdx];
    updatePlayerUI();
  }

  function applyBaseStepSpot(s) {
    activeModalSpot = false;
    if (!s) return;
    let r = null;
    if (s.anim === 'search' || s.anim === 'filter') {
      r = unionRect(visibleRect(s.sel), kanbanPreviewRect(240));
    } else if (s.sel) {
      r = visibleRect(s.sel);
    }
    applySpot(r, true, s.offsetY);
  }

  function togglePause() {
    if (!currentAnim) return;
    demoPaused = !demoPaused;
    updatePlayerUI();
  }

  function seekTo(targetMs, keepPaused) {
    const s = STEPS[idx];
    if (!active || !s || !s.anim || !DEMOS[s.anim]) return;
    const dur = demoDuration || DEMO_DURATIONS[s.anim] || 10000;
    const clamped = Math.max(0, Math.min(dur, Math.round(targetMs)));
    demoToken++;
    activeModalSpot = false;
    closeSimFilterDropdown();
    document.querySelectorAll('.wt-ripple').forEach((n) => n.remove());
    if (el.cursor) {
      el.cursor.style.display = 'none';
      el.cursor.classList.remove('press');
    }
    demoPaused = !!keepPaused;
    setSeekingMode(clamped > 0);
    runDemo(s, clamped);
  }

  function rewindDemo(ms) {
    if (!currentAnim) return;
    const base = (seekTarget !== null) ? seekTarget : demoElapsed;
    seekTo(Math.max(0, base - (ms || 3000)), demoPaused);
  }

  function bindPlayerEvents() {
    const playBtn = $('#wtPlayPause'), rewBtn = $('#wtRewind'), speedBtn = $('#wtSpeed'), trackWrap = $('#wtTrackWrap');
    if (playBtn) playBtn.onclick = togglePause;
    if (rewBtn) rewBtn.onclick = () => rewindDemo(3000);
    if (speedBtn) speedBtn.onclick = cycleSpeed;
    if (!trackWrap) return;

    const msFromEvent = (ev) => {
      const r = trackWrap.getBoundingClientRect();
      const ratio = r.width > 0 ? Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) : 0;
      return ratio * (demoDuration || DEMO_DURATIONS[currentAnim] || 10000);
    };

    const previewRatio = (ev) => {
      const r = trackWrap.getBoundingClientRect();
      const pct = r.width > 0 ? Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100)) : 0;
      const fill = $('#wtTrackFill'), thumb = $('#wtTrackThumb'), timeEl = $('#wtPlayerTime');
      if (fill) fill.style.width = pct.toFixed(2) + '%';
      if (thumb) thumb.style.left = pct.toFixed(2) + '%';
      trackWrap.setAttribute('aria-valuenow', String(Math.round(pct)));
      if (timeEl) timeEl.textContent = `${formatTime((pct / 100) * (demoDuration || 1))} / ${formatTime(demoDuration || 1)}`;
    };

    const onScrubMove = (ev) => {
      if (!isScrubbing) return;
      previewRatio(ev);
      const now = performance.now();
      if (now - lastScrubSeek >= 32) {
        lastScrubSeek = now;
        seekTo(msFromEvent(ev), true);
      }
    };

    const onScrubEnd = (ev) => {
      if (!isScrubbing) return;
      isScrubbing = false;
      trackWrap.classList.remove('scrubbing');
      document.body.classList.remove('wt-scrubbing');
      window.removeEventListener('pointermove', onScrubMove, true);
      window.removeEventListener('pointerup', onScrubEnd, true);
      window.removeEventListener('pointercancel', onScrubEnd, true);
      seekTo(msFromEvent(ev), wasPausedBeforeScrub);
    };

    trackWrap.addEventListener('pointerdown', (ev) => {
      if (!currentAnim) return;
      ev.preventDefault();
      wasPausedBeforeScrub = demoPaused;
      isScrubbing = true;
      lastScrubSeek = performance.now();
      trackWrap.classList.add('scrubbing');
      document.body.classList.add('wt-scrubbing');
      previewRatio(ev);
      seekTo(msFromEvent(ev), true);
      window.addEventListener('pointermove', onScrubMove, true);
      window.addEventListener('pointerup', onScrubEnd, true);
      window.addEventListener('pointercancel', onScrubEnd, true);
    });
  }

  async function sleepCheck(tok, ms) {
    let rem = ms;
    while (rem > 0) {
      if (!active || tok !== demoToken) throw ABORT;
      if (demoPaused || isScrubbing) {
        await sleep(40);
        continue;
      }
      const chunk = Math.max(10, Math.min(rem / playbackSpeed, 40));
      const t0 = performance.now();
      await sleep(chunk);
      if (!active || tok !== demoToken) throw ABORT;
      if (!demoPaused && !isScrubbing) {
        rem -= Math.min(rem, Math.max(chunk, performance.now() - t0) * playbackSpeed);
      }
    }
  }

  async function wait(tok, ms) {
    if (!active || tok !== demoToken) throw ABORT;
    if (ms <= 0) return;

    if (seekTarget !== null) {
      if (demoElapsed + ms <= seekTarget) {
        demoElapsed += ms;
        return;
      }
      const consumed = Math.max(0, seekTarget - demoElapsed);
      demoElapsed = seekTarget;
      seekTarget = null;
      setSeekingMode(false);
      updatePlayerUI();
      ms -= consumed;
      if (ms <= 0) return;
    }

    let remaining = ms;
    while (remaining > 0) {
      if (demoPaused || isScrubbing) {
        await sleep(40);
        if (!active || tok !== demoToken) throw ABORT;
        continue;
      }
      const chunk = Math.max(10, Math.min(remaining / playbackSpeed, 35));
      const t0 = performance.now();
      await sleep(chunk);
      if (!active || tok !== demoToken) throw ABORT;
      if (!demoPaused && !isScrubbing) {
        const dt = Math.min(remaining, Math.max(chunk, performance.now() - t0) * playbackSpeed);
        remaining -= dt;
        demoElapsed = Math.min(demoDuration || (demoElapsed + dt), demoElapsed + dt);
        updatePlayerUI();
      }
    }
  }

  function cursorPlace(x, y, ms) {
    const z = getZoom();
    const c = el.cursor;
    cursorPos = { x, y };
    c.style.transitionDuration = (ms || 0) + 'ms';
    c.style.left = ((x - z.ox) / z.zx) + 'px';
    c.style.top = ((y - z.oy) / z.zy) + 'px';
  }

  function cursorStart(x, y) {
    el.cursor.style.display = 'block';
    cursorPlace(x, y, 0);
    void el.cursor.offsetWidth;
  }

  function pointOf(node) {
    const q = node.getBoundingClientRect();
    return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
  }

  async function cursorTo(tok, node, ms) {
    if (!rectOf(node)) return;
    const p = pointOf(node);
    const startX = cursorPos.x;
    const startY = cursorPos.y;
    const dur = Math.max(1, ms || 0);

    if (seekTarget !== null && demoElapsed + dur <= seekTarget) {
      demoElapsed += dur;
      cursorPlace(p.x, p.y, 0);
      await wait(tok, 60);
      return;
    }

    let moved = 0;
    if (seekTarget !== null) {
      moved = Math.max(0, seekTarget - demoElapsed);
      demoElapsed = seekTarget;
      seekTarget = null;
      setSeekingMode(false);
      const ratio = Math.min(1, moved / dur);
      const eased = ratio < 0.5 ? 4 * ratio * ratio * ratio : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
      cursorPlace(startX + (p.x - startX) * eased, startY + (p.y - startY) * eased, 0);
      updatePlayerUI();
    }

    while (moved < dur) {
      if (demoPaused || isScrubbing) {
        await sleep(40);
        if (!active || tok !== demoToken) throw ABORT;
        continue;
      }
      const step = Math.max(10, Math.min((dur - moved) / playbackSpeed, 20));
      const t0 = performance.now();
      await sleep(step);
      if (!active || tok !== demoToken) throw ABORT;
      if (!demoPaused && !isScrubbing) {
        const dt = Math.min(dur - moved, Math.max(step, performance.now() - t0) * playbackSpeed);
        moved += dt;
        demoElapsed = Math.min(demoDuration || (demoElapsed + dt), demoElapsed + dt);
        const ratio = Math.min(1, moved / dur);
        const eased = ratio < 0.5 ? 4 * ratio * ratio * ratio : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
        cursorPlace(startX + (p.x - startX) * eased, startY + (p.y - startY) * eased, 0);
        updatePlayerUI();
      }
    }
    cursorPlace(p.x, p.y, 0);
    await wait(tok, 60);
  }

  function ripple(x, y) {
    const z = getZoom();
    const d = document.createElement('div');
    d.className = 'wt-ripple';
    d.style.left = ((x - z.ox) / z.zx) + 'px';
    d.style.top = ((y - z.oy) / z.zy) + 'px';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 650);
  }

  async function pressAt(tok, node) {
    const p = pointOf(node);
    el.cursor.classList.add('press');
    if (seekTarget === null) ripple(p.x, p.y);
    await wait(tok, 150);
  }

  function release() {
    if (el.cursor) el.cursor.classList.remove('press');
  }

  async function clickNode(tok, node, opts) {
    opts = opts || {};
    if (!node || !rectOf(node)) return;
    await cursorTo(tok, node, opts.ms || 750);
    await pressAt(tok, node);
    if (opts.mousedown) {
      node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    } else if (opts.nativeClick) {
      node.click();
    } else {
      node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
      if (opts.focus && typeof node.focus === 'function') {
        node.focus();
        node.dispatchEvent(new Event('focus'));
      }
      await wait(tok, 160);
      release();
    }

  async function typeText(tok, inputEl, text, charDelay) {
    if (!inputEl) return;
    try { inputEl.focus({ preventScroll: true }); } catch (e) { inputEl.focus(); }
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    let typed = '';
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      inputEl.value = typed;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(tok, charDelay || 70);
    }
    await wait(tok, 250);
  }

  async function clearInput(tok, inputEl) {
    if (!inputEl) return;
    while (inputEl.value.length > 0) {
      inputEl.value = inputEl.value.slice(0, -1);
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(tok, 28);
    }
  }

  function openSimFilterDropdown(sel) {
    const drop = el.simSelect;
    if (!drop || !sel) return null;
    const z = getZoom();
    drop.innerHTML = '';
    Array.from(sel.options).forEach((opt) => {
      const item = document.createElement('div');
      item.className = 'wt-sim-opt' + (opt.value === sel.value ? ' selected' : '');
      item.dataset.value = opt.value;
      item.textContent = opt.textContent;
      drop.appendChild(item);
    });
    drop.style.display = 'block';
    const sr = sel.getBoundingClientRect();
    const dw = Math.max(drop.offsetWidth * z.zx, sr.width);
    const dh = drop.offsetHeight * z.zy;
    const left = Math.max(12, Math.min(sr.right - dw, innerWidth - dw - 12));
    const top = (sr.bottom + 4 + dh <= innerHeight - 12) ? (sr.bottom + 4) : Math.max(12, sr.top - dh - 4);
    drop.style.left = ((left - z.ox) / z.zx) + 'px';
    drop.style.top = ((top - z.oy) / z.zy) + 'px';
    return drop;
  }

  function closeSimFilterDropdown() {
    if (el.simSelect) {
      el.simSelect.style.display = 'none';
      el.simSelect.innerHTML = '';
    }
  }

  function getModalSpotRect() {
    const mainModal = $('#modal-container .bg-white.rounded-lg');
    const confirmModal = $('#confirm-modal-overlay .bg-white.rounded-lg');
    return unionRect(rectOf(mainModal), rectOf(confirmModal));
  }

  function spotlightModal() {
    const r = getModalSpotRect();
    if (r) {
      activeModalSpot = true;
      applySpot(r, true);
    }
  }

  function stopDemo() {
    demoToken++;
    activeModalSpot = false;
    seekTarget = null;
    setSeekingMode(false);
    document.body.classList.remove('wt-scrubbing');
    demoPaused = false;
    isScrubbing = false;
    currentAnim = null;
    demoElapsed = 0;
    demoDuration = 0;
    closeSimFilterDropdown();
    if (el.player) {
      el.player.style.display = 'none';
      el.player.classList.remove('is-paused');
    }
    if (el.cursor) {
      el.cursor.style.display = 'none';
      el.cursor.classList.remove('press');
    }
  }

  const DEMOS = {
    search: async (tok) => {
      const inp = $('#search-input');
      if (!inp) return false;
      cursorStart(innerWidth * 0.55, innerHeight * 0.45);
      await wait(tok, 300);
      await clickNode(tok, inp, { focus: true, ms: 650 });
      await typeText(tok, inp, 'Jadlog', 95);
      await wait(tok, 1700);
      await clearInput(tok, inp);
      await wait(tok, 350);
      await typeText(tok, inp, '45890', 95);
      await wait(tok, 1700);
      await clearInput(tok, inp);
      await wait(tok, 600);
    },

    filter: async (tok) => {
      const sel = $('#filter-status-select');
      if (!sel) return false;
      cursorStart(innerWidth * 0.65, innerHeight * 0.45);
      await wait(tok, 300);
      const picks = ['chegada-ceva', 'checklist-qa', 'todos'];
      for (let i = 0; i < picks.length; i++) {
        await clickNode(tok, sel, { ms: 650 });
            const drop = openSimFilterDropdown(sel);
            const dropRect = rectOf(drop);
            applySpot(unionRect(unionRect(visibleRect('#filter-status-select'), dropRect), kanbanPreviewRect(240)), true);
            await wait(tok, 750);

            const optEl = drop ? drop.querySelector(`.wt-sim-opt[data-value="${picks[i]}"]`) : null;
            if (optEl) {
              await cursorTo(tok, optEl, 550);
              optEl.classList.add('hover');
              await wait(tok, 260);
              await pressAt(tok, optEl);
              await wait(tok, 140);
              release();
            }
            closeSimFilterDropdown();
            sel.value = picks[i];
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            applySpot(unionRect(visibleRect('#filter-status-select'), kanbanPreviewRect(240)), true);
            await wait(tok, 1600);
          }
        },

        ticketModal: async (tok) => {
          const card = $('.ticket-card[data-ticket-id="tour-mock-1"]');
          if (!card) return false;
          activeModalSpot = false;
          applySpot(rectOf(card), true);

          cursorStart(innerWidth * 0.45, innerHeight * 0.55);
          await wait(tok, 400);
          await clickNode(tok, card, { ms: 750 });
          await wait(tok, 350);
          spotlightModal();
          await wait(tok, 650);

          const textarea = $('#new-comment-textarea');
          const sendBtn = $('#add-comment-btn');
          if (textarea && sendBtn) {
            await clickNode(tok, textarea, { focus: true, ms: 650 });
            await typeText(tok, textarea, 'Conferência OK, sem avarias.', 55);
            await wait(tok, 250);
            await clickNode(tok, sendBtn, { ms: 550 });
            await wait(tok, 1000);
          }

            const advanceBtn = $('#actions-container button[data-status="chegada-ceva"]');
            if (advanceBtn) {
              advanceBtn.scrollIntoView({ block: 'nearest' });
              await clickNode(tok, advanceBtn, { ms: 700 });
              await wait(tok, 400);
              const confirmBtn = $('#confirm-action-btn');
              if (confirmBtn) {
                spotlightModal();
                await wait(tok, 250);
                await clickNode(tok, confirmBtn, { ms: 650 });
                if (seekTarget !== null) {
                  $('#confirm-modal-overlay.is-closing')?.remove();
                  const mc = $('#modal-container');
                  if (mc && mc.querySelector('.modal-backdrop.is-closing')) mc.innerHTML = '';
                }
                await wait(tok, 300);
              }
            }

            activeModalSpot = false;
            applySpot(kanbanPreviewRect(340), true);
            await wait(tok, 1800);
          },

        newTicket: async (tok) => {
          const plusBtn = $('.new-ticket-btn-trigger');
          if (!plusBtn) return false;
          activeModalSpot = false;
          applySpot(rectOf(plusBtn), true);

          cursorStart(innerWidth * 0.72, innerHeight * 0.7);
          await wait(tok, 400);
          await clickNode(tok, plusBtn, { ms: 750 });
          await wait(tok, 350);
          spotlightModal();
          await wait(tok, 550);

          const nfInp = $('#new-notas-fiscais');
          await clickNode(tok, nfInp, { focus: true, ms: 550 });
          await typeText(tok, nfInp, '98210, 98211, 98212', 55);

          const transpInp = $('#combobox-transportadora input');
          await clickNode(tok, transpInp, { focus: true, ms: 550 });
          const transpDrop = $('#combobox-transportadora .combobox-options');
          if (transpDrop) transpDrop.classList.remove('hidden');
          await wait(tok, 350);
          const transpOpt = Array.from(document.querySelectorAll('#combobox-transportadora .combobox-option'))
            .find(o => o.textContent.trim() === 'Braspress');
          if (transpOpt) {
            await clickNode(tok, transpOpt, { mousedown: true, ms: 480 });
          }
          if (transpInp && !transpInp.value.trim()) {
            transpInp.value = 'Braspress';
            if (transpDrop) transpDrop.classList.add('hidden');
          }

          const qtdInp = $('#new-qtd-volumes');
          await clickNode(tok, qtdInp, { focus: true, ms: 500 });
          await typeText(tok, qtdInp, '4', 90);

          const cliInp = $('#combobox-cliente input');
          await clickNode(tok, cliInp, { focus: true, ms: 550 });
          const cliDrop = $('#combobox-cliente .combobox-options');
          if (cliDrop) cliDrop.classList.remove('hidden');
          await wait(tok, 350);
          const cliOpt = Array.from(document.querySelectorAll('#combobox-cliente .combobox-option'))
            .find(o => o.textContent.trim() === 'Cliente 3');
          if (cliOpt) {
            await clickNode(tok, cliOpt, { mousedown: true, ms: 480 });
          }
          if (cliInp && !cliInp.value.trim()) {
            cliInp.value = 'Cliente 3';
            if (cliDrop) cliDrop.classList.add('hidden');
          }

          const motivoBtn = $('.option-btn-group[data-group="motivo_devolucao"] .option-btn[data-value="Recusa no Cliente"]');
          if (motivoBtn) {
            motivoBtn.scrollIntoView({ block: 'nearest' });
            await clickNode(tok, motivoBtn, { ms: 550 });
            if (!motivoBtn.classList.contains('active')) motivoBtn.classList.add('active');
          }
          await wait(tok, 550);

          const tipoBtn = $('.option-btn-group[data-group="tipo_carga"] .option-btn[data-value="Paletizada"]');
          if (tipoBtn) {
            tipoBtn.scrollIntoView({ block: 'nearest' });
            await clickNode(tok, tipoBtn, { ms: 550 });
            if (!tipoBtn.classList.contains('active')) tipoBtn.classList.add('active');
          }
          await wait(tok, 350);

          if (nfInp && !nfInp.value.trim()) nfInp.value = '98210, 98211, 98212';
          if (qtdInp && (!qtdInp.value.trim() || parseInt(qtdInp.value, 10) < 1)) qtdInp.value = '4';

          const submitBtn = $('#new-ticket-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.scrollIntoView({ block: 'nearest' });
            await clickNode(tok, submitBtn, { nativeClick: true, ms: 650 });
          }
          const formEl = $('#new-ticket-form');
          if (formEl && !$('#modal-container .modal-backdrop.is-closing')) {
            if (typeof formEl.requestSubmit === 'function') {
              try { formEl.requestSubmit(submitBtn); } catch (e) {}
            }
            if ($('#new-ticket-form') && !$('#modal-container .modal-backdrop.is-closing')) {
              formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
          }
          if ($('#new-ticket-form') && !$('#modal-container .modal-backdrop.is-closing')) {
            window.__devTourBridge?.submitNewTicket?.();
          }
                  if ($('#modal-container .modal-backdrop') && !$('#modal-container .modal-backdrop.is-closing')) {
                    window.__devTourBridge?.closeModals?.();
                  }
                  if (seekTarget !== null) {
                    const mc = $('#modal-container');
                    if (mc && mc.querySelector('.modal-backdrop.is-closing')) mc.innerHTML = '';
                  }
                  await wait(tok, 400);

                  activeModalSpot = false;
                  const firstCol = $('.kanban-column-wrapper[data-status="coleta-solicitada"]');
                  applySpot(unionRect(kanbanPreviewRect(260), rectOf(firstCol)), true);
                  await wait(tok, 2000);
                }
          };

          function runDemo(s, initialSeekMs) {
            if (!s.anim || !DEMOS[s.anim]) return;
            const tok = ++demoToken;
            currentAnim = s.anim;
            demoDuration = DEMO_DURATIONS[s.anim] || 10000;
            demoElapsed = 0;
            seekTarget = (typeof initialSeekMs === 'number' && initialSeekMs > 0) ? initialSeekMs : null;
            setSeekingMode(seekTarget !== null);
            if (el.player) el.player.style.display = 'flex';
            updatePlayerUI();

            (async () => {
              try {
                if (typeof initialSeekMs !== 'number') {
                  await sleepCheck(tok, 550);
                }
                while (active && tok === demoToken) {
                  resetMockData();
                  applyBaseStepSpot(s);
                  demoElapsed = 0;
                  if (seekTarget === null && typeof initialSeekMs !== 'number') {
                    await sleepCheck(tok, 200);
                  }
                  initialSeekMs = undefined;
                  if (seekTarget === null) updatePlayerUI();
                  const ok = await DEMOS[s.anim](tok, s);
                  if (ok === false) break;
                  seekTarget = null;
                  setSeekingMode(false);
                  if (demoElapsed > 0) demoDuration = demoElapsed;
                  updatePlayerUI();
                  await sleepCheck(tok, 700);
                  resetMockData();
                  applyBaseStepSpot(s);
                  demoElapsed = 0;
                  updatePlayerUI();
                  await sleepCheck(tok, 500);
                }
              } catch (e) {
                if (e !== ABORT) console.error(e);
              }
            })();
          }

  function startDemo(s) {
    if (!s.anim || !DEMOS[s.anim]) return;
    demoPaused = false;
    runDemo(s);
  }

  function show(n) {
    if (n < 0 || n >= STEPS.length) return;
    idx = n;
    const s = STEPS[n];
    const isReshow = (n === shownStep);
    if (!isReshow) {
      stopDemo();
      resetMockData();
    }
    shownStep = n;

    let r = null;
    if (activeModalSpot) {
      r = getModalSpotRect();
    } else if (s.anim === 'search' || s.anim === 'filter') {
      const simDrop = (el.simSelect && el.simSelect.style.display === 'block') ? rectOf(el.simSelect) : null;
      r = unionRect(unionRect(visibleRect(s.sel), simDrop), kanbanPreviewRect(240));
    } else if (s.sel) {
      r = visibleRect(s.sel);
    }

    $('#wtTitle').textContent = s.title;
    $('#wtText').innerHTML = s.text;
    $('#wtCount').textContent = `${n + 1} de ${STEPS.length}`;
    $('#wtBar').style.width = ((n + 1) / STEPS.length) * 100 + '%';
    $('#wtPrev').disabled = n === 0;

    $('#wtSkip').textContent = 'Pular';
    $('#wtPrev').textContent = '← Anterior';
    $('#wtNext').textContent = n === STEPS.length - 1 ? 'Concluir ✓' : 'Próximo →';

    el.tip.style.display = 'block';
    applySpot(r, isReshow || activeModalSpot, s.offsetY);
    if (!isReshow) startDemo(s);
  }

  function onKey(e) {
    if (!active) return;
    const k = e.key;
    if (k === ' ' && currentAnim) {
      e.preventDefault();
      e.stopPropagation();
      togglePause();
      return;
    }
    if (['ArrowRight', 'ArrowLeft', 'Enter', 'Escape'].includes(k)) {
      e.preventDefault();
      e.stopPropagation();
      if (k === 'Escape') finish();
      else if (k === 'ArrowLeft') show(idx - 1);
      else idx === STEPS.length - 1 ? finish() : show(idx + 1);
    } else if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const BLOCKED_USER_EVENTS = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'touchstart', 'touchend', 'submit', 'change'];

  function onUserInteract(e) {
    if (!active || !e.isTrusted) return;
    if (isScrubbing) return;
    if (e.target && e.target.closest && e.target.closest('.wt-tip, .wt-player')) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  const onResize = () => { if (active) show(idx); };
  const onScroll = () => { if (active) show(idx); };

  function start() {
    build();
    addHelpButton();
    if (active) return;
    active = true;
    shownStep = -1;
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    window.scrollTo(0, 0);
    activateMockData();
    el.block.style.display = 'block';
    el.block.style.clipPath = 'none';
    BLOCKED_USER_EVENTS.forEach((ev) => document.addEventListener(ev, onUserInteract, { capture: true, passive: false }));
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(() => show(0), 150);
  }

  function finish() {
    if (!active) return;
    active = false;
    playbackSpeed = 1;
    stopDemo();
    shownStep = -1;
    el.block.style.display = el.spot.style.display = el.tip.style.display = el.player.style.display = 'none';
    el.block.style.clipPath = '';
    BLOCKED_USER_EVENTS.forEach((ev) => document.removeEventListener(ev, onUserInteract, true));
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    restoreRealData();
    store.set();
  }

  function init() {
    build();
    addHelpButton();
    if (store.get()) return;
    if (window.__devTourBridge) {
      start();
      return;
    }
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (window.__devTourBridge || tries > 60) {
        clearInterval(timer);
        start();
      }
    }, 50);
  }

  window.addEventListener('beforeunload', () => {
    if (active) restoreRealData();
  });

  window.startDevolucoesTour = start;
  window.resetDevolucoesTour = () => { try { localStorage.removeItem(TOUR_DONE_KEY); } catch (e) {} };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
