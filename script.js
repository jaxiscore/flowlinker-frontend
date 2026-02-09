// const STRIPE_PK = 'pk_test_YOUR_PUBLISHABLE_KEY'; // Configurar via Cloudflare se possível
const stripe = typeof Stripe !== 'undefined' ? Stripe('pk_test_51Qo2hEGa4m0V9v5k4X8W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W') : null; 
const API_URL = 'https://api.flowlinker.io';

function scrollToPlans() {
    const plans = document.getElementById('plans');
    if (plans) {
        plans.scrollIntoView({ behavior: 'smooth' });
    }
}

async function checkout(plan) {
    const name = prompt('Nome da imobiliária:');
    if (!name) return;
    const email = prompt('Email:');
    if (!email) return;
    const phone = prompt('WhatsApp (com DDD):');
    if (!phone) return;

    try {
        const response = await fetch(`${API_URL}/api/create-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, plan })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'Erro ao processar. Tente novamente.');
            return;
        }

        const { sessionId } = await response.json();
        if (stripe) {
            await stripe.redirectToCheckout({ sessionId });
        } else {
            alert('Erro: Stripe não carregado.');
        }
    } catch (error) {
        alert('Erro ao processar. Verifique sua conexão.');
        console.error(error);
    }
}
