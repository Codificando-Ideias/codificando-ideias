$(document).ready(function () {

let formLoadedAt = Date.now();

// ================= WHATSAPP MASK =================
$("#whatsapp").on("input", function () {
  let value = $(this).val().replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  $(this).val(value);
});

// ================= VALIDATIONS =================
function isValidWhatsApp(number) {
  const digits = number.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  const ddd = parseInt(digits.substring(0, 2), 10);
  const ninthDigit = digits.charAt(2);

  if (ddd < 11 || ddd > 99) return false;
  if (ninthDigit !== "9") return false;

  return true;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ================= FORM SUBMIT =================
$("#newsletterForm").submit(async function (e) {
  e.preventDefault();

  if ($("#company").val() !== "") return;

  if (Date.now() - formLoadedAt < 3000) {
    showToast("Envio muito rápido. Tente novamente.", false);
    return;
  }

  const btn = $(this).find("button[type='submit']");
  btn.prop("disabled", true).html(`
    <span class="spinner-border spinner-border-sm me-2"></span>
    Enviando...
  `);

  const data = {
    name: $("#name").val().trim(),
    email: $("#email").val().trim(),
    whatsapp: $("#whatsapp").val().replace(/\D/g, ""),
    accepted_terms: $("#acceptedTerms").is(":checked"),
    source: "newsletter_page",
    created_at: new Date().toISOString()
  };

  if (!data.name || !data.email || !data.whatsapp) {
    showToast("Preencha todos os campos obrigatórios.", false);
    btn.prop("disabled", false).html("Inscrever-se");
    return;
  }

  if (!isValidEmail(data.email)) {
    showToast("Digite um e-mail válido.", false);
    btn.prop("disabled", false).html("Inscrever-se");
    return;
  }

  if (!isValidWhatsApp(data.whatsapp)) {
    showToast("Digite um WhatsApp válido com DDD (ex: 11987654321).", false);
    btn.prop("disabled", false).html("Inscrever-se");
    return;
  }

  try {

    const token = await gerarRecaptchaToken();

    const response = await fetch(
      "https://vwzxirmphsnwflphiaog.supabase.co/functions/v1/subscriber-newsletter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...data,
          recaptcha_token: token
        })
      }
    );

    if (response.status === 409) {
      showToast("Email ou WhatsApp já cadastrado.", false);
      btn.prop("disabled", false).html("Inscrever-se");
      return;
    }

    if (!response.ok) throw new Error("Erro Supabase");

    showToast("Inscrição realizada com sucesso 🚀");
    $("#newsletterForm")[0].reset();

  } catch (error) {
    console.error(error);
    showToast("Erro ao enviar. Tente novamente.", false);
  }

  btn.prop("disabled", false).html("Inscrever-se");
});

async function gerarRecaptchaToken() {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject("reCAPTCHA não carregado");
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "lead_submit" })
        .then(resolve)
        .catch(reject);
    });
  });
}

});