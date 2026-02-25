function enviarEmailDashboard(lead) {

  const estimativa = calcularEstimativa(lead);

  let estimativaTexto = "";

  if (estimativa.projeto) {
    estimativaTexto = `Estimativa Projeto: R$ ${estimativa.projeto.toLocaleString()}`;
  }

  if (estimativa.setup && estimativa.mensal) {
    estimativaTexto =
`Setup: R$ ${estimativa.setup.toLocaleString()}
Mensal: R$ ${estimativa.mensal.toLocaleString()}`;
  }

  const assunto = `Sobre seu projeto - Codificando Ideias`;

  const corpo = `
Olá ${lead.nome},

Estou entrando em contato sobre sua solicitação enviada pelo site Codificando Ideias.

━━━━━━━━━━━━━━━━━━
Tipo de Projeto:
${lead.tipo_sistema}

Modelo de Contratação:
${lead.modelo_contratacao}

${estimativaTexto}

Descrição enviada:
${lead.descricao || "-"}

━━━━━━━━━━━━━━━━━━
Gostaria de conversar para alinharmos os próximos passos.

Fico à disposição.

━━━━━━━━━━━━━━━━━━
Você pode conhecer mais sobre nosso trabalho em:
Codificando Ideias
Impulsionando negócios através da tecnologia
https://www.codificandoideias.site
`;

  const mailtoLink =
    `mailto:${lead.email}` +
    `?subject=${encodeURIComponent(assunto)}` +
    `&body=${encodeURIComponent(corpo.trim())}`;

  window.location.href = mailtoLink;
}