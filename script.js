document.addEventListener('DOMContentLoaded', () => {
    // URL de tu aplicación Google Apps Script (Sustituir por el enlace de implementación)
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyc79L7r6EBIvAAvyhMpatw_DhKZBeGbFirpaLb2jn5blcVBCsYTmJ4WFGLkwT_pkZc/exec';

    const state = { email: '', name: '', isFirstTime: false };

    // Elementos
    const screens = {
        email: document.getElementById('email-step'),
        pin: document.getElementById('pin-step')
    };
    const inputs = {
        emailUser: document.getElementById('email-user'),
        pin: document.getElementById('pin-input')
    };
    const loader = document.getElementById('loader');

    // Función genérica para llamar a la API de GAS usando JSONP o fetch
    async function callGas(action, params = {}) {
        const queryParams = new URLSearchParams({ action, ...params }).toString();
        const url = `${GAS_API_URL}?${queryParams}`;

        try {
            // Usamos fetch con modo no-cors para una respuesta simple si es posible, 
            // pero mejor llamar a un endpoint que devuelva JSON directamente.
            // Google Apps Script suele requerir redireccionamiento.
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la conexión con el servidor');
            return await response.json();
        } catch (error) {
            console.error("Error API:", error);
            // Si falla por CORS, sugerimos al usuario habilitar CORS en GAS o usar JSONP
            throw error;
        }
    }

    // Siguiente - Comprobar Usuario
    document.getElementById('btn-next').onclick = async () => {
        const user = inputs.emailUser.value.trim();
        if (!user) return alert('Por favor, ingresa tu nombre de usuario');

        state.email = user + '@automaticoscanarios.es';
        loader.classList.remove('hidden');

        // Simulación o llamada real (Deberás configurar CORS en GAS)
        // Por ahora, como es un cambio estructural, usaremos un mock o avisaremos
        // Si quieres mantener google.script.run, el HTML debe vivir en GAS.
        // Si mueves el HTML a GitHub, debes cambiar Code.gs para servir JSON.

        alert("¡Aviso! Se requiere configurar la API en Code.gs para recibir peticiones externas.");
        loader.classList.add('hidden');

        // Mock de transición para visualización inmediata en GitHub
        state.exists = true;
        state.isFirstTime = true;
        state.name = user;
        document.getElementById('pin-label').textContent = 'Crea tu PIN de 6 dígitos';
        document.getElementById('first-time-msg').classList.remove('hidden');
        screens.email.classList.add('hidden');
        screens.pin.classList.remove('hidden');
    };

    // Entrar
    document.getElementById('btn-login').onclick = () => {
        const pin = inputs.pin.value.trim();
        if (pin.length !== 6 || isNaN(pin)) return alert('El PIN debe ser de 6 dígitos numéricos');

        document.getElementById('user-display-name').textContent = state.name;
        document.getElementById('login-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');

        // Guardar sesión
        localStorage.setItem('sigt_portal_user', JSON.stringify({ email: state.email, name: state.name }));
    };

    // Logout
    document.getElementById('btn-logout').onclick = () => {
        localStorage.removeItem('sigt_portal_user');
        location.reload();
    };

    // Descripción desplegable
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.onclick = (e) => {
            const details = e.target.nextElementSibling;
            details.classList.toggle('hidden');
            btn.textContent = details.classList.contains('hidden') ? 'Ver descripción ▾' : 'Cerrar descripción ▴';
        };
    });

    // Sesión guardada
    const savedUser = localStorage.getItem('sigt_portal_user');
    if (savedUser) {
        const data = JSON.parse(savedUser);
        document.getElementById('user-display-name').textContent = data.name;
        document.getElementById('login-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
    }
});
