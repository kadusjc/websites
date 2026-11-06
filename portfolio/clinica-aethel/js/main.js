/* ==========================================================================
   AETHEL SAÚDE INTEGRATIVA - MAIN JAVASCRIPT
   Interatividade, Animações Smooth e Modal LGPD Responsivo
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar na rolagem
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Menu Hambúrguer Responsivo
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 3. Gerenciamento das Abas de Especialidades
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // 4. Modal LGPD / Gestão de Cookies
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    const openCookieSettings = document.getElementById('openCookieSettings');

    // Verificar se o usuário já fez uma escolha
    const cookieConsent = localStorage.getItem('aethel_cookie_consent');

    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 1500);
    }

    const setConsent = (status) => {
        localStorage.setItem('aethel_cookie_consent', status);
        cookieBanner.classList.remove('active');
    };

    acceptBtn.addEventListener('click', () => setConsent('accepted'));
    rejectBtn.addEventListener('click', () => setConsent('rejected'));

    openCookieSettings.addEventListener('click', (e) => {
        e.preventDefault();
        cookieBanner.classList.add('active');
    });
});
