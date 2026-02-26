function calcularEstimativa(lead) {

  // ===============================
  // CONFIGURAÇÕES
  // ===============================

  const VALOR_HORA = 100;
  const MARGEM_ESTRATEGICA = 0.15;
  const HORAS_MES_DISPONIVEIS = 30;

  const horasBasePorTipo = {
    "Site Institucional": 40,
    "Sistema Personalizado": 100,
    "Plataforma de Gestão": 150,
    "Solução com Inteligência Artificial": 180
  };

  const modelMultiplier = {
    "Projeto Fechado": 1.1,
    "Plano Recorrente (Recomendado)": 0.7,
    "Pacote Flexível": 0.9,
    "Preciso de orientação": 1.2
  };

  // ===============================
  // BASE
  // ===============================

  const horasBase = horasBasePorTipo[lead.tipo_sistema] || 80;
  const multiplier = modelMultiplier[lead.modelo_contratacao] || 1;

  // ===============================
  // COMPLEXIDADE TEXTUAL
  // ===============================

  const tamanho = lead.descricao?.length || 0;

  let complexidadeBonusPreco = 0;
  let complexidadeImpactoPrazo = 1;

  if (tamanho > 700) {
    complexidadeBonusPreco = 0.30;
    complexidadeImpactoPrazo = 1.35;
  } else if (tamanho > 400) {
    complexidadeBonusPreco = 0.20;
    complexidadeImpactoPrazo = 1.20;
  } else if (tamanho > 200) {
    complexidadeBonusPreco = 0.10;
    complexidadeImpactoPrazo = 1.05;
  }

  // ===============================
  // CÁLCULO FINANCEIRO
  // ===============================

  const valorBase = horasBase * VALOR_HORA * multiplier;
  const valorComComplexidade = valorBase * (1 + complexidadeBonusPreco);
  const valorFinal = Math.round(valorComComplexidade * (1 + MARGEM_ESTRATEGICA));

  // ===============================
  // PRAZO
  // ===============================

  const horasEstimadas = Math.round(
    horasBase * (1 + complexidadeBonusPreco) * complexidadeImpactoPrazo
  );

  let mesesEstimados = Math.ceil(horasEstimadas / HORAS_MES_DISPONIVEIS);
  if (mesesEstimados < 1) mesesEstimados = 1;

  // ===============================
  // CLASSIFICAÇÃO DO PROJETO
  // ===============================

  let categoriaProjeto = "medio";
  let mensalPos12 = 80;

  if (horasBase <= 60) {
    categoriaProjeto = "simples";
    mensalPos12 = 50;
  } else if (horasBase > 120) {
    categoriaProjeto = "complexo";
    mensalPos12 = 100;
  }

  // ===============================
  // MODELO DE PAGAMENTO
  // ===============================

  let tipoPagamento = "projeto";
  let projeto = null;
  let setup = null;
  let mensalDurante12 = null;

  if (lead.modelo_contratacao === "Plano Recorrente (Recomendado)") {

    tipoPagamento = "recorrente";

    const valorSetupTotal = Math.round(valorFinal * 0.5);
    setup = Math.round(valorSetupTotal / 12);
    mensalDurante12 = Math.round((valorFinal - valorSetupTotal) / 12);
  } else {
    projeto = valorFinal;
  }

  // ===============================
  // RETORNO FINAL
  // ===============================

  return {
    valorFinal,
    horasEstimadas,
    mesesEstimados,
    tipoPagamento,
    projeto,
    setup,
    mensalDurante12,
    mensalPos12,
    categoriaProjeto,
    detalhes: {
      valorHora: VALOR_HORA,
      margemAplicada: MARGEM_ESTRATEGICA,
      multiplierModelo: multiplier,
      bonusComplexidade: complexidadeBonusPreco,
      impactoPrazo: complexidadeImpactoPrazo
    }
  };
}