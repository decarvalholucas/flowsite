document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("formMatricula");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitButton");

    // --- INÍCIO DA MÁSCARA DE DATA (dd/mm/aaaa) ---
    const dataNascimentoInput = document.getElementById("data_nascimento");

    dataNascimentoInput.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + "/" + value.substring(5);
        }
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        e.target.value = value;
    });
    // --- FIM DA MÁSCARA DE DATA ---


    form.addEventListener("submit", (e) => { 
        e.preventDefault(); 

        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxAzPIna-OQkp1cvqLDZ2YY6eK23iYl9emD45sNCv24RRgEsHT8bO-hEc2JMt4eMiX/exec"; 
        const ASAAS_PAYMENT_LINK = "https://www.asaas.com/c/nhvlixhdros15crz";

        formStatus.innerHTML = "Enviando dados, aguarde...";
        formStatus.className = "";
        formStatus.style.display = "block";
        submitButton.disabled = true;
        submitButton.innerHTML = "ENVIANDO...";

        const formData = new FormData(form);
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

        for (const key in dataObject) {
            if (Array.isArray(dataObject[key])) {
                dataObject[key] = dataObject[key].join(', ');
            }
        }
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: 'no-cors',
            body: new URLSearchParams(dataObject)
        })
        .then(() => {
            formStatus.innerHTML = "Matrícula enviada com sucesso! Você será redirecionado para o pagamento em 3 segundos...";
            formStatus.classList.add("success");
            
            form.reset(); // Limpa o formulário SÓ NO SUCESSO

            setTimeout(() => {
                window.location.href = ASAAS_PAYMENT_LINK;
            }, 3000);
        })
        .catch(error => {
            console.error("Erro de rede ao enviar formulário:", error);
            
            // --- MENSAGEM DE ERRO ATUALIZADA ---
            formStatus.innerHTML = "Ocorreu um erro ao enviar. Tente novamente. Se o erro persistir, entre em contato com a recepção da escola.";
            // --- FIM DA ATUALIZAÇÃO ---

            formStatus.classList.add("error");
            submitButton.disabled = false;
            submitButton.innerHTML = "Enviar Matrícula e Pagar";
            
            // Note que o 'form.reset()' NÃO é chamado aqui, preservando os dados.
        });
    });
});