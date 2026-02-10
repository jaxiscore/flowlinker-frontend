const stripe = typeof Stripe !== 'undefined' ? Stripe('pk_test_51Qo2hEGa4m0V9v5k4X8W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W4Y4W') : null; 
const API_URL = 'https://api.flowlinker.io';

// MODAL CONTROL
function openCheckout(plan) {
    document.getElementById('selectedPlan').value = plan;
    const modal = document.getElementById('checkoutModal');
    modal.style.display = "flex"; // Usa flex para centralizar
    document.getElementById('name').focus();
}

function closeModal() {
    document.getElementById('checkoutModal').style.display = "none";
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target == modal) {
        closeModal();
    }
}

function scrollToPlans() {
    const plans = document.getElementById('plans');
    if (plans) {
        plans.scrollIntoView({ behavior: 'smooth' });
    }
}

// CHECKOUT LOGIC
async function submitCheckout(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerText;
    btn.innerText = "Processando...";
    btn.disabled = true;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const plan = document.getElementById('selectedPlan').value;

    try {
        const response = await fetch(`${API_URL}/api/create-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, plan })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'Erro ao processar. Tente novamente.');
            resetBtn(btn, originalText);
            return;
        }

        const { sessionId } = await response.json();
        
        if (stripe) {
            const result = await stripe.redirectToCheckout({ sessionId });
            if (result.error) {
                alert(result.error.message);
                resetBtn(btn, originalText);
            }
        } else {
            alert('Erro: Stripe não carregado. Verifique sua conexão.');
            resetBtn(btn, originalText);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Erro de conexão. Verifique sua internet.');
        resetBtn(btn, originalText);
    }
}

function resetBtn(btn, text) {
    btn.innerText = text;
    btn.disabled = false;
}
