let leadAtual = null;
// ================= MODAL DETALHES =================
function abrirDetalhes(lead) {
  leadAtual = lead;
  const estimativa = calcularEstimativa(lead);

let estimativaTexto = "";

if (estimativa.tipoPagamento === "projeto") {
  estimativaTexto = `
    R$ ${estimativa.projeto.toLocaleString()}
    <br>
    <small>${estimativa.horasEstimadas}h • ${estimativa.mesesEstimados} mês(es)</small>
  `;
} else {
  estimativaTexto = `
    Durante 12 meses:
    <br>
    Setup: R$ ${estimativa.setup.toLocaleString()}/mês
    <br>
    + Mensal: R$ ${estimativa.mensalDurante12.toLocaleString()}
    <br>
    Valor total: R$ ${(estimativa.setup * 12 + estimativa.mensalDurante12 * 12).toLocaleString()}
    <br><br>
    Após 12 meses:
    <br>
    R$ ${estimativa.mensalPos12.toLocaleString()} / mês
    <br>
    valor total: R$ ${(estimativa.mensalPos12 * 12).toLocaleString()}
    <br>
    <small>${estimativa.horasEstimadas}h • ${estimativa.mesesEstimados} mês(es)</small>
  `;
}
  const html = `
    <div class="row g-3">
      <div class="col-md-6"><strong>Nome:</strong><br>${lead.nome}</div>
<div class="col-md-6">
  <strong>Email:</strong><br>
  <button id="emailLink"
          class="btn btn-outline-info btn-sm mt-1">
    <i class="bi bi-envelope me-1"></i>
    ${lead.email}
  </button>
</div>
<div class="col-md-6 mb-3"> <strong>WhatsApp:</strong><br> <button id="whatsappLink" class="btn btn-outline-success btn-sm mt-1"> <i class="bi bi-whatsapp me-1"></i> ${lead.whatsapp} </button> </div>      <div class="col-md-6"><strong>Tipo:</strong><br>${lead.tipo_sistema}</div>
      <div class="col-md-6"><strong>Modelo:</strong><br>${lead.modelo_contratacao}</div>
      <div class="col-md-6"><strong>Status:</strong><br>
<select id="statusSelect" class="form-select mt-1">
  <option ${lead.status === "Novo" ? "selected" : ""}>Novo</option>
  <option ${lead.status === "Contato" ? "selected" : ""}>Contato</option>
  <option ${lead.status === "Proposta" ? "selected" : ""}>Proposta</option>
  <option ${lead.status === "Contrato" ? "selected" : ""}>Contrato</option>
  <option ${lead.status === "Fechado" ? "selected" : ""}>Fechado</option>
</select>

<button class="btn btn-sm btn-success mt-2"
  onclick="atualizarStatus('${lead.id}')">
  Salvar Status
</button>
</div>
      <div class="col-12">
        <strong>Descrição:</strong>
        <div class="p-2 bg-secondary rounded mt-1">
          ${lead.descricao || "-"}
        </div>
      </div>
      <div class="col-12">
        <strong>Link:</strong><br>
        ${lead.link_empresa
          ? `<a href="${lead.link_empresa}" target="_blank">${lead.link_empresa}</a>`
          : "-"}
      </div>
      <div class="col-6">
        <strong>Estimativa:</strong><br>${estimativaTexto}
      </div>
      <div class="col-6">
        <strong>Criado em:</strong><br>
        ${new Date(lead.created_at).toLocaleString()}
      </div>
    <div id="acoesContrato" class="mt-4 d-flex gap-2"></div>
    </div>
  `;

  document.getElementById("leadDetalhes").innerHTML = html;
renderizarBotoesStatus(lead.status);
const whatsappEl = document.getElementById("whatsappLink"); 
if (whatsappEl) { 
    whatsappEl.addEventListener("click", function () {
      enviarWhatsAppDashboard(leadAtual);
    });
}

const emailEl = document.getElementById("emailLink");

if (emailEl) {
  emailEl.addEventListener("click", function () {
    enviarEmailDashboard(leadAtual);
  });
}

  const modal = new bootstrap.Modal(
    document.getElementById("leadModal")
  );
  modal.show();
}

function renderizarBotoesStatus(status) {

  const container = document.getElementById("acoesContrato");
  container.innerHTML = "";

  if (status === "Proposta") {
    container.innerHTML = `
      <button class="btn btn-primary"
        onclick="gerarPropostaPDF(leadAtual)">
        📄 Gerar Proposta
      </button>
    `;
  }

  if (status === "Contrato") {
    container.innerHTML = `
     <button class="btn btn-primary"
        onclick="gerarPropostaPDF(leadAtual)">
        📄 Visualizar Proposta
      </button>
      <button class="btn btn-success"
        onclick="gerarContratoPDF(leadAtual)">
        📝 Gerar Contrato
      </button>
    `;
  }

  if (status === "Fechado") {
    container.innerHTML = `
      <button class="btn btn-primary"
        onclick="gerarPropostaPDF(leadAtual)">
        📄 Visualizar Proposta
      </button>
      <button class="btn btn-success"
        onclick="gerarContratoPDF(leadAtual)">
        📝 Visualizar Contrato
      </button>
    `;
  }
}