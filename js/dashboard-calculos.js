function calcularEstimativa(lead) {

  const baseValues = {
    "Site Institucional": 1200,
    "Sistema Personalizado": 8000,
    "Plataforma de Gestão": 15000,
    "Solução com Inteligência Artificial": 18000
  };

  const base = baseValues[lead.tipo_sistema] || 8000;

  if (lead.modelo_contratacao === "Plano Recorrente (Recomendado)") {
    return {
      setup: Math.round(base * 0.7),
      mensal: Math.round(base * 0.03)
    };
  }

  if (lead.modelo_contratacao === "Pacote Flexível") {
    return {
      projeto: Math.round(base * 0.85)
    };
  }

  return {
    projeto: base
  };
}