document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("formMatricula");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitButton");

    form.addEventListener("submit", (e) => { // Removi 'async'
        e.preventDefault(); // Impede o envio padrão do formulário

        // -----------------------------------------------------------------
        // 1. COLE A *NOVA* URL DO PASSO 1 AQUI:
        // -----------------------------------------------------------------
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxAzPIna-OQkp1cvqLDZ2YY6eK23iYl9emD45sNCv24RRgEsHT8bO-hEc2JMt4eMiX/exec"; 
        
        // 2. COLOQUE SEU LINK DO ASAAS AQUI:
        const ASAAS_PAYMENT_LINK = "https://flowescoladejiujitsu.com.br/";
        // -----------------------------------------------------------------


        // Mostra status de envio
        formStatus.innerHTML = "Enviando dados, aguarde...";
        formStatus.className = ""; // Limpa classes
        formStatus.style.display = "block";
        submitButton.disabled = true;
        submitButton.innerHTML = "ENVIANDO...";

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
        
        // --- LÓGICA DE ENVIO CORRIGIDA ---
        // Usamos fetch com 'no-cors' e tratamos com .then() e .catch()
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: 'no-cors', // Necessário, mas significa que não lemos a resposta
            body: new URLSearchParams(dataObject)
        })
        .then(() => {
            // Com 'no-cors', não podemos ler a resposta do servidor (como 200 ou 403).
            // O erro 403 que você viu foi no console, causado pela permissão errada.
            // Se a permissão (Passo 1) estiver correta, o envio funcionará.
            
            formStatus.innerHTML = "Matrícula enviada com sucesso! Você será redirecionado para o pagamento em 3 segundos...";
            formStatus.classList.add("success");
            
            form.reset();

            // Redireciona após 3 segundos
            setTimeout(() => {
                window.location.href = ASAAS_PAYMENT_LINK;
            }, 3000);
        })
        .catch(error => {
            // Este 'catch' agora só pega erros de rede (ex: DNS, sem internet)
            console.error("Erro de rede ao enviar formulário:", error);
            formStatus.innerHTML = "Houve um erro de *rede* ao enviar. Verifique sua conexão e tente novamente.";
            formStatus.classList.add("error");
            submitButton.disabled = false;
            submitButton.innerHTML = "Enviar Matrícula e Pagar";
        });
    });
});