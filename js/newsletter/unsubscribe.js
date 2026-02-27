$(document).ready(function () {

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  if (!email) {
    $("#unsubscribeBox").html("<p class='text-danger'>Link inválido.</p>");
    return;
  }

  $("#emailDisplay").html(`Email: <strong>${email}</strong>`);

  $("#confirmUnsubscribe").click(async function () {

    const btn = $(this);
    btn.prop("disabled", true).html(`
      <span class="spinner-border spinner-border-sm me-2"></span>
      Processando...
    `);

    try {

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.${email}`,
        {
          method: "PATCH",
          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            is_active: false,
            unsubscribed_at: new Date().toISOString()
          })
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar");

      $("#feedback").html(
        "<div class='alert alert-success'>Sua inscrição foi cancelada com sucesso.</div>"
      );

      btn.remove();

    } catch (error) {
      console.error(error);
      $("#feedback").html(
        "<div class='alert alert-danger'>Erro ao cancelar inscrição.</div>"
      );
      btn.prop("disabled", false).text("Confirmar Cancelamento");
    }

  });

});