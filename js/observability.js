/* =====================================================
   Codificando Ideias - Observability Layer
   Microsoft Clarity + Custom Analytics
===================================================== */

function trackEvent(eventName, data = {}) {

    if (typeof clarity !== "undefined") {

        clarity("event", eventName);

        Object.entries(data).forEach(([key, value]) => {
            clarity("set", key, value);
        });

    } else {
        console.warn("Clarity not loaded yet");
    }

    console.log("Tracking:", eventName, data);
}

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       SCROLL TRACKING
    ======================================== */

    let scroll50 = false;
    let scroll90 = false;
    let ticking = false;

    window.addEventListener("scroll", () => {

        if (!ticking) {

            window.requestAnimationFrame(() => {

                const scrollPercent =
                    (window.scrollY + window.innerHeight) /
                    document.documentElement.scrollHeight;

                if (scrollPercent > 0.5 && !scroll50) {
                    scroll50 = true;
                    trackEvent("scroll_50");
                    updateAnalytics("scrolled_50",true);
                }

                if (scrollPercent > 0.9 && !scroll90) {
                    scroll90 = true;
                    trackEvent("scroll_90");
                    updateAnalytics("scrolled_90",true);
                }

                ticking = false;

            });

            ticking = true;
        }

    });

    /* ========================================
       MENU NAVIGATION TRACKING
    ======================================== */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", function () {

            const target = this.getAttribute("href")
                .replace("#", "")
                .toLowerCase();

            trackEvent("menu_click_" + target);
            updateAnalytics("menu_clicked",target);
        });

    });

    /* ========================================
       ENGAGEMENT TIME
    ======================================== */

    setTimeout(() => {
        trackEvent("engaged_30s");
        updateAnalytics("engaged_30s",true);
    }, 30000);

    setTimeout(() => {
        trackEvent("engaged_60s");
        updateAnalytics("engaged_60s",true);
    }, 60000);

    /* ========================================
       CTA TRACKING
    ======================================== */

    const cta = document.getElementById("cta-especialista");

    if (cta) {
        cta.addEventListener("click", () => {
            trackEvent("cta_especialista_click");
            updateAnalytics("cta_clicked","hero");
        });
    }

    const ctaMid = document.getElementById("cta-mid-especialista");

    if (ctaMid) {
        ctaMid.addEventListener("click", () => {
            trackEvent("cta_mid_especialista_click");
            updateAnalytics("cta_clicked","mid");
        });
    }

    const ctaFloating = document.getElementById("cta-floating-especialista");

    if (ctaFloating) {
        ctaFloating.addEventListener("click", () => {
            trackEvent("cta_floating_especialista_click");
            updateAnalytics("cta_clicked","floating");
        });
    }

    /* ========================================
       FORM TRACKING
    ======================================== */

    const form = document.getElementById("contactForm");

    if (form) {

        let started = false;

        form.addEventListener("input", function () {

            if (!started) {
                started = true;
                trackEvent("form_start");
                updateAnalytics("form_started",true);
            }

        });

        form.addEventListener("submit", function () {
            trackEvent("form_submit");
            updateAnalytics("form_submitted",true);
        });

    }

    /* ========================================
       FORM VIEW OBSERVER
    ======================================== */

    const formSection = document.getElementById("lead");

    if (formSection) {

        let viewed = false;

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting && !viewed) {

                    viewed = true;

                    trackEvent("form_view");
                    updateAnalytics("form_viewed",true);
                    observer.disconnect();

                }

            });

        }, {
            threshold: 0.4
        });

        observer.observe(formSection);

    }

});

/* ========================================
   CLICK EVENTS FROM CARDS
======================================== */

function abrirServico(tipo) {
    trackEvent("servico_click_" + tipo);
    updateAnalytics("servico_clicked",tipo);
}

function abrirProblema(tipo) {
    trackEvent("problema_click_" + tipo);
    updateAnalytics("problema_clicked",tipo);
}

function abrirModeloContratacao(tipo) {
    trackEvent("modelo_contratacao_click_" + tipo);
    updateAnalytics("modelo_contratacao_clicked",tipo);
}