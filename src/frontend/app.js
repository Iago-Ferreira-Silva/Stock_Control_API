const API = "https://stock-control-api-f7em.onrender.com";
let token = "";
let socket = null;

// ─── Navegação ───────────────────────────────────────────────────────────────
const pageTitles = {
  itens: ["Itens", "Gerencie o estoque de produtos"],
  exportar: ["Exportar CSV", "Baixe os dados em formato CSV"],
  relatorios: ["Relatórios", "Gere relatórios em PDF"],
  "tempo-real": ["Tempo Real", "Eventos Socket.io em tempo real"],
  sensor: ["Sensor Wokwi", "Dados do ESP32 virtual via WebSocket"],
  video: ["Stream de Vídeo", "HTTP Range Requests para vídeo sob demanda"],
  distancia: ["Distância", "Cálculo geográfico com Haversine"],
  logs: ["Logs", "Consulte os registros de requisições"],
};

function navTo(id, el) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".navItem")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("sec-" + id).classList.add("active");
  if (el) el.classList.add("active");
  const [t, d] = pageTitles[id] || [id, ""];
  document.getElementById("pageTitle").textContent = t;
  document.getElementById("pageDesc").textContent = d;
  if (id === "itens") carregarItens();
  if (id === "logs") document.getElementById("logData").value = hoje();
}

// ─── Auth ────────────────────────────────────────────────────────────────────
async function fazerLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;
  const err = document.getElementById("loginErr");
  const btn = document.getElementById("btnLogin");

  if (!email || !senha) {
    mostrarErro(err, "Preencha email e senha");
    return;
  }
  err.style.display = "none";
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {
    const res = await fetch(`${API}/logar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    if (!res.ok) {
      mostrarErro(err, data.erro || "Erro ao fazer login");
      return;
    }
    document.getElementById("step1").classList.remove("active");
    document.getElementById("step2").classList.add("active");
  } catch (e) {
    mostrarErro(err, "Erro de conexão com o servidor");
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
}

async function verificarCodigo() {
  const email = document.getElementById("loginEmail").value.trim();
  const codigo = document.getElementById("loginCodigo").value.trim();
  const err = document.getElementById("codigoErr");
  const btn = document.getElementById("btnVerificar");

  if (!codigo) {
    mostrarErro(err, "Informe o código");
    return;
  }
  err.style.display = "none";
  btn.disabled = true;
  btn.textContent = "Verificando...";

  try {
    const res = await fetch(`${API}/logar/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codigo }),
    });
    const data = await res.json();
    if (!res.ok) {
      mostrarErro(err, data.erro || "Código inválido");
      return;
    }
    token = data.token;
    document.getElementById("tokenBadge").textContent = "🔑 Autenticado";
    document.getElementById("loginOverlay").classList.add("hidden");
    conectarSocket();
    verificarAPI();
    carregarItens();
    toast("Login realizado com sucesso!", "success");
  } catch (e) {
    mostrarErro(err, "Erro de conexão");
  } finally {
    btn.disabled = false;
    btn.textContent = "Verificar código";
  }
}

function voltarStep1() {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step1").classList.add("active");
  document.getElementById("loginCodigo").value = "";
}

function logout() {
  token = "";
  if (socket) socket.disconnect();
  socket = null;
  document.getElementById("loginOverlay").classList.remove("hidden");
  document.getElementById("tokenBadge").textContent = "Sem token";
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginSenha").value = "";
  document.getElementById("loginCodigo").value = "";
  document.getElementById("step1").classList.add("active");
  document.getElementById("step2").classList.remove("active");
  atualizarPulse("apiPulse", "apiStatus", false, "Desconectado");
  atualizarPulse("socketPulse", "socketStatus", false, "Socket off");
}

// ─── Socket.io ───────────────────────────────────────────────────────────────
function conectarSocket() {
  socket = io(API, { auth: { token } });

  socket.on("connect", () => {
    atualizarPulse("socketPulse", "socketStatus", true, "Socket on");
  });

  socket.on("disconnect", () => {
    atualizarPulse("socketPulse", "socketStatus", false, "Socket off");
  });

  socket.on("item:criado", (data) => {
    const item = Array.isArray(data) ? data[0] : data;
    addEvento("criado", `item:criado — ${item.nome} (R$ ${item.preco})`);
    carregarItens();
  });

  socket.on("item:atualizado", (data) => {
    addEvento(
      "atualizado",
      `item:atualizado — ${data.nome} (R$ ${data.preco})`,
    );
    carregarItens();
  });

  socket.on("item:deletado", (data) => {
    addEvento("deletado", `item:deletado — ${data.nome}`);
    carregarItens();
  });

  socket.on("sensor:dados", (data) => {
    document.getElementById("sensorTemp").textContent = parseFloat(
      data.temperatura,
    ).toFixed(1);
    document.getElementById("sensorUmid").textContent = parseFloat(
      data.umidade,
    ).toFixed(1);
    document.getElementById("sensorTs").textContent =
      `Último dado: ${data.timestamp}`;
    addEvento(
      "sensor",
      `sensor:dados — 🌡️ ${data.temperatura}°C | 💧 ${data.umidade}%`,
    );
  });
}

function addEvento(tipo, msg) {
  const log = document.getElementById("eventLog");
  const placeholder = log.querySelector("div");
  if (placeholder && placeholder.style.color === "#334155")
    placeholder.remove();

  const hora = new Date().toLocaleTimeString("pt-BR");
  const div = document.createElement("div");
  div.className = `evtItem evt${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
  div.innerHTML = `<span class="evtTime">${hora}</span>${msg}`;
  log.prepend(div);
}

function limparEventos() {
  document.getElementById("eventLog").innerHTML =
    '<div style="color:#334155;font-size:11px">Aguardando eventos...</div>';
}

// ─── API status ───────────────────────────────────────────────────────────────
async function verificarAPI() {
  try {
    const res = await fetch(`${API}/`);
    if (res.ok) atualizarPulse("apiPulse", "apiStatus", true, "API online");
    else atualizarPulse("apiPulse", "apiStatus", false, "API erro");
  } catch {
    atualizarPulse("apiPulse", "apiStatus", false, "API offline");
  }
}

function atualizarPulse(pulseId, labelId, on, label) {
  document.getElementById(pulseId).className = "pulse" + (on ? " on" : "");
  document.getElementById(labelId).textContent = label;
}

// ─── Itens ───────────────────────────────────────────────────────────────────
async function carregarItens() {
  const nome = document.getElementById("filtroNome").value;
  const min = document.getElementById("filtroMin").value;
  const max = document.getElementById("filtroMax").value;

  let url = `${API}/itens?`;
  if (nome) url += `nome=${encodeURIComponent(nome)}&`;
  if (min) url += `precoMin=${min}&`;
  if (max) url += `precoMax=${max}&`;

  try {
    const res = await api(url);
    const items = await res.json();
    if (!res.ok) return;

    const tbody = document.getElementById("tbodyItens");
    const stats = document.getElementById("itenStats");
    const total = items.length;
    const valorTotal = items.reduce((s, i) => s + i.preco, 0);

    stats.innerHTML = `
      <div class="stat"><strong>${total}</strong><small>Produtos</small></div>
      <div class="stat">
        <strong>R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
        <small>Valor total</small>
      </div>
    `;

    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="empty">Nenhum item encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>
          ${
            item.imagem
              ? `<img src="${item.imagem}" class="imgThumb" alt="${item.nome}">`
              : `<div class="imgPlaceholder">📦</div>`
          }
        </td>
        <td><strong>${item.nome}</strong></td>
        <td>
          <span class="badge badgeGreen">
            R$ ${item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </td>
        <td style="color:var(--gray);font-size:12px">
          ${new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </td>
        <td>
          <button class="btn btnGhost btnSmall" onclick='abrirModalEditar(${JSON.stringify(item)})'>✏️</button>
          <button class="btn btnGhost btnSmall" style="margin-left:4px" onclick='abrirModalImagem("${item._id}")'>🖼️</button>
          <button class="btn btnRed btnSmall"   style="margin-left:4px" onclick='deletarItem("${item._id}","${item.nome}")'>🗑️</button>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (e) {
    console.error(e);
  }
}

function limparFiltros() {
  document.getElementById("filtroNome").value = "";
  document.getElementById("filtroMin").value = "";
  document.getElementById("filtroMax").value = "";
  carregarItens();
}

function abrirModalCriar() {
  document.getElementById("modalItemTitle").textContent = "Novo item";
  document.getElementById("itemId").value = "";
  document.getElementById("itemNome").value = "";
  document.getElementById("itemPreco").value = "";
  document.getElementById("btnSalvarItem").textContent = "Criar item";
  document.getElementById("modalItem").classList.add("open");
}

function abrirModalEditar(item) {
  document.getElementById("modalItemTitle").textContent = "Editar item";
  document.getElementById("itemId").value = item._id;
  document.getElementById("itemNome").value = item.nome;
  document.getElementById("itemPreco").value = item.preco;
  document.getElementById("btnSalvarItem").textContent = "Salvar alterações";
  document.getElementById("modalItem").classList.add("open");
}

async function salvarItem() {
  const id = document.getElementById("itemId").value;
  const nome = document.getElementById("itemNome").value.trim();
  const preco = parseFloat(document.getElementById("itemPreco").value);

  if (!nome || isNaN(preco) || preco <= 0) {
    toast("Preencha nome e preço válidos", "error");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/itens/${id}` : `${API}/itens`;

  const res = await api(url, { method, body: { nome, preco } });
  const data = await res.json();

  if (!res.ok) {
    toast(data.erro || "Erro ao salvar", "error");
    return;
  }
  toast(id ? "Item atualizado!" : "Item criado!", "success");
  fecharModal("modalItem");
  carregarItens();
}

async function deletarItem(id, nome) {
  if (!confirm(`Remover "${nome}"?`)) return;
  const res = await api(`${API}/itens/${id}`, { method: "DELETE" });
  if (res.ok) {
    toast("Item removido!", "success");
    carregarItens();
  } else {
    const d = await res.json();
    toast(d.erro || "Erro", "error");
  }
}

function abrirModalImagem(id) {
  document.getElementById("imagemItemId").value = id;
  document.getElementById("imagemArquivo").value = "";
  document.getElementById("modalImagem").classList.add("open");
}

async function enviarImagem() {
  const id = document.getElementById("imagemItemId").value;
  const arquivo = document.getElementById("imagemArquivo").files[0];
  if (!arquivo) {
    toast("Selecione uma imagem", "error");
    return;
  }

  const form = new FormData();
  form.append("imagem", arquivo);

  const res = await fetch(`${API}/itens/${id}/imagem`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();

  if (res.ok) {
    toast("Imagem enviada!", "success");
    fecharModal("modalImagem");
    carregarItens();
  } else {
    toast(data.erro || "Erro no upload", "error");
  }
}

// ─── CSV / PDF ────────────────────────────────────────────────────────────────
async function exportarCSV() {
  const res = await api(`${API}/exportar/csv`);
  if (!res.ok) {
    toast("Erro ao exportar", "error");
    return;
  }
  const blob = await res.blob();
  baixarBlob(blob, `itens_${hoje()}.csv`);
  toast("CSV baixado!", "success");
}

async function baixarPDF(rota, nome) {
  const res = await api(`${API}${rota}`);
  if (!res.ok) {
    toast("Erro ao gerar PDF", "error");
    return;
  }
  const blob = await res.blob();
  baixarBlob(blob, nome);
  toast("PDF baixado!", "success");
}

function baixarBlob(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
async function buscarLogs() {
  const data = document.getElementById("logData").value;
  if (!data) {
    toast("Selecione uma data", "error");
    return;
  }

  const res = await api(`${API}/logs?data=${data}`);
  const logs = await res.json();
  const tbody = document.getElementById("tbodyLogs");

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty">${logs.erro}</td></tr>`;
    return;
  }
  if (!logs.length) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="empty">Nenhum log nesta data</td></tr>';
    return;
  }

  tbody.innerHTML = logs
    .map(
      (l) => `
    <tr>
      <td style="font-family:monospace;font-size:12px">${l.rota}</td>
      <td><span class="badge badgeBlue">${l.metodo}</span></td>
      <td style="font-size:12px;color:var(--gray)">
        ${new Date(l.createdAt).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" })}
      </td>
    </tr>
  `,
    )
    .join("");
}

// ─── Distância ────────────────────────────────────────────────────────────────
async function calcularDistancia() {
  const lat1 = document.getElementById("lat1").value;
  const lon1 = document.getElementById("lon1").value;
  const lat2 = document.getElementById("lat2").value;
  const lon2 = document.getElementById("lon2").value;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    toast("Preencha todas as coordenadas", "error");
    return;
  }

  const res = await api(
    `${API}/distancia?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`,
  );
  const data = await res.json();
  if (!res.ok) {
    toast(data.erro || "Erro", "error");
    return;
  }

  document.getElementById("distResult").style.display = "block";
  document.getElementById("distKm").textContent = `${data.distancia.km} km`;
  document.getElementById("distMetros").textContent =
    `${data.distancia.metros.toLocaleString("pt-BR")} metros`;
}

function preencherCratoFortaleza() {
  document.getElementById("lat1").value = "-7.2306";
  document.getElementById("lon1").value = "-39.3167";
  document.getElementById("lat2").value = "-3.7172";
  document.getElementById("lon2").value = "-38.5431";
}

// ─── Vídeo ────────────────────────────────────────────────────────────────────
function carregarVideo() {
  const base = document.getElementById("videoBase").value.trim();
  const arquivo = document.getElementById("videoArquivo").value.trim();
  const player = document.getElementById("videoPlayer");

  player.src = `${base}/video/stream/${arquivo}?token=${token}`;
  player.style.display = "block";
  player.load();
  player.play().catch(() => {});
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function api(url, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...opts.headers,
  };
  if (opts.body && typeof opts.body === "object") {
    opts.body = JSON.stringify(opts.body);
  }
  return fetch(url, { ...opts, headers });
}

function fecharModal(id) {
  document.getElementById(id).classList.remove("open");
}

function mostrarErro(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
}

let toastTimer;
function toast(msg, tipo = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "show" + (tipo ? " " + tipo : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = "";
  }, 3000);
}

function hoje() {
  return new Date().toISOString().split("T")[0];
}

// ─── Inicialização ────────────────────────────────────────────────────────────
document.querySelectorAll(".modalBackdrop").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("open");
  });
});

document.getElementById("logData").value = hoje();
verificarAPI();
