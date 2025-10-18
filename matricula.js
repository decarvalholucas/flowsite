// Espera o DOM carregar para anexar o evento
document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("formMatricula");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitButton");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        // -----------------------------------------------------------------
        // 1. ATUALIZE ESTAS DUAS VARIÁVEIS
        // -----------------------------------------------------------------
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAK2e4Wv7MYpGvvq1FmjUwq4oAt7vnk47nvpIlqiio6hidrtRyfwfptu5G_AT-wQTf/exec"; // Cole a URL do seu script (veja Passo 2)
        const ASAAS_PAYMENT_LINK = "https://www.asaas.com/c/nhvlixhdros15crz"; // Cole seu link do Asaas
        // -----------------------------------------------------------------


        // Mostra status de envio
        formStatus.innerHTML = "Enviando dados, aguarde...";
        formStatus.className = ""; // Limpa classes
        formStatus.style.display = "block";
        submitButton.disabled = true;
        submitButton.innerHTML = "ENVIANDO...";

        try {
            // Cria o FormData a partir do formulário
            const formData = new FormData(form);
            
            // Converte checkboxes (que podem ter múltiplos valores) em strings
            const dataObject = {};
            formData.forEach((value, key) => {
                if (dataObject.hasOwnProperty(key)) {
                    if (Array.isArray(dataObject[key])) {
                        dataObject[key].push(value);
                    } else {
                        dataObject[key] = [dataObject[key], value];
                    }
                } else {
                    dataObject[key] = value;
                }
            });

            // Converte valores agrupados (checkboxes) em string separada por vírgula
            for (const key in dataObject) {
                if (Array.isArray(dataObject[key])) {
                    dataObject[key] = dataObject[key].join(', ');
                }
            }
            
            // Envia os dados para o Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: 'no-cors', // Necessário para Google Scripts
                body: new URLSearchParams(dataObject) 
            });

            // Sucesso! Mostra mensagem e prepara redirecionamento
            formStatus.innerHTML = "Matrícula enviada com sucesso! Você será redirecionado para o pagamento em 3 segundos...";
            formStatus.classList.add("success");
            
            form.reset();

            // Redireciona após 3 segundos
            setTimeout(() => {
                window.location.href = ASAAS_PAYMENT_LINK;
            }, 3000);

        } catch (error) {
            // Mostra mensagem de erro
            console.error("Erro ao enviar formulário:", error);
            formStatus.innerHTML = "Houve um erro ao enviar sua matrícula. Tente novamente ou entre em contato via WhatsApp.";
            formStatus.classList.add("error");
            submitButton.disabled = false;
            submitButton.innerHTML = "Enviar Matrícula e Pagar";
        }
    });
});