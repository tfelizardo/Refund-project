import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { uploadReceipt } from "../api/receipts";
import { createRefund } from "../api/refunds";

type NewRequestFormData = {
  expense: string;
  category: string;
  amount: string;
  receipt: FileList;
};

export function NewRequest() {
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<NewRequestFormData>({
    defaultValues: {
      category: "",
      amount: "" // O placeholder assumirá "R$ 0,00" visualmente e a validação barrará R$ 0,00 enviados.
    }
  });

  const receiptFiles = watch("receipt");

  const onSubmit = async (data: NewRequestFormData) => {
    try {
      const file = data.receipt[0];
      if (!file) {
        return; // Retorno de segurança caso burlado o html5, mas o react-hook-form pega antes.
      }

      // 1. upload do recibo
      const receiptId = await uploadReceipt(file);

      // 2. converter valor (string → centavos)
      const numericValue = Number(data.amount.replace(/\D/g, ""));

      // 3. criar reembolso
      await createRefund({
        title: data.expense,
        category: data.category,
        value: numericValue,
        receipt: receiptId
      });

      queryClient.invalidateQueries({ queryKey: ["refunds"] });

      setIsSuccess(true);
      reset({ category: "", amount: "" });

    } catch (error: any) {
      console.error("ERRO BACKEND:", error.response?.data);
      alert("Erro ao criar reembolso");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
        setValue("amount", "");
        return;
    }
    const numericValue = (Number(value) / 100).toFixed(2);
    const formattedValue = numericValue
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValue("amount", `R$ ${formattedValue}`);
  };

  if (isSuccess) {
    return (
      <div className="card new-request-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ color: '#1f8459', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Solicitação enviada!</h1>

        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#1f8459" style={{ width: '5rem', height: '5rem', marginBottom: '1.5rem' }}>
          <circle cx="12" cy="12" r="10" stroke="#1f8459" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-6" />
        </svg>

        <p style={{ color: '#4d5c57', fontSize: '0.87rem', lineHeight: '1.5', marginBottom: '2.5rem' }}>
          Agora é apenas aguardar! Sua solicitação será analisada e, em breve, o setor financeiro irá entrar em contato com você.
        </p>

        <button
          className="submit-btn"
          style={{ width: '100%', marginTop: 'auto' }}
          onClick={() => setIsSuccess(false)}
        >
          Nova solicitação
        </button>
      </div>
    );
  }

  return (
    <div className="card new-request-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Nova solicitação de reembolso</h1>
        <p>Dados da despesa para solicitar reembolso.</p>

        <fieldset style={{ position: 'relative', paddingBottom: errors.expense ? '1.5rem' : '0' }}>
          <legend>Nome da solicitação</legend>
          <div className="input-with-icon">
            <input 
              type="text" 
              placeholder="Ex: Thiago Felizardo" 
              {...register("expense", { required: "O nome é obrigatório" })} 
              style={{ borderColor: errors.expense ? 'red' : '' }}
            />
            {errors.expense && <span style={{color: 'red', fontSize: '0.75rem', position: 'absolute', bottom: '0.2rem'}}>{errors.expense.message}</span>}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CDD5D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </fieldset>

        <div className="inputs-row" style={{ marginBottom: (errors.category || errors.amount) ? '1.5rem' : '1.5rem' }}>
          <fieldset style={{ position: 'relative', margin: 0, paddingBottom: errors.category ? '1.5rem' : '0' }}>
            <legend>Categoria</legend>
            <select 
              {...register("category", { required: "Selecione uma categoria" })}
              style={{ borderColor: errors.category ? 'red' : '' }}
            >
              <option value="" disabled hidden>Selecione</option>
              <option value="food">Alimentação</option>
              <option value="hosting">Hospedagem</option>
              <option value="services">Serviços</option>
              <option value="transport">Transporte</option>
              <option value="other">Outros</option>
            </select>
            {errors.category && <span style={{color: 'red', fontSize: '0.75rem', position: 'absolute', bottom: '0', left: 0}}>{errors.category.message}</span>}
          </fieldset>

          <fieldset style={{ position: 'relative', margin: 0, paddingBottom: errors.amount ? '1.5rem' : '0' }}>
            <legend>Valor</legend>
            <input
              type="text"
              placeholder="R$ 0,00"
              {...register("amount", { 
                required: "Valor é obrigatório",
                validate: (value) => {
                    const num = Number(value.replace(/\D/g, ""));
                    return num > 0 || "Valor deve ser maior que zero";
                }
              })}
              style={{ borderColor: errors.amount ? 'red' : '' }}
              onChange={(e) => {
                  handleAmountChange(e);
              }}
            />
            {errors.amount && <span style={{color: 'red', fontSize: '0.75rem', position: 'absolute', bottom: '0', left: 0}}>{errors.amount.message}</span>}
          </fieldset>
        </div>

        <fieldset style={{ position: 'relative', paddingBottom: errors.receipt ? '1.5rem' : '0' }}>
          <legend>Comprovante</legend>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.87rem', color: '#1f2523', fontWeight: 600, marginBottom: '0.25rem' }}>Imagem e Upload</span>
            <span style={{ fontSize: '0.75rem', color: '#4d5c57', lineHeight: '1.4' }}>
              Enviar um recibo em formato JPG, PNG ou PDF.<br />
              A imagem não deve ser maior do que 2mb.
            </span>
          </div>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="receipt"
              className="sr-only"
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("receipt", { 
                required: "O comprovante é obrigatório",
                validate: (files) => {
                  const file = files?.[0];
                  if (!file) return true; // validado pelo required antes
                  if (file.size > 2 * 1024 * 1024) {
                    return "Tamanho máximo é 2MB";
                  }
                  const validTypes = ["image/jpeg", "image/png", "application/pdf"];
                  if (!validTypes.includes(file.type)) {
                    return "Formato inválido. Use JPG, PNG ou PDF";
                  }
                  return true;
                }
              })}
            />
            <label htmlFor="receipt" className="file-input-label" style={{ borderColor: errors.receipt ? 'red' : '' }}>
              <span className="placeholder">{receiptFiles?.[0] ? receiptFiles[0].name : "Selecione um arquivo"}</span>
              <div className="upload-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
            </label>
            {errors.receipt && <span style={{color: 'red', fontSize: '0.75rem', position: 'absolute', bottom: '0', left: 0}}>{errors.receipt.message}</span>}
          </div>
        </fieldset>

        <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>Enviar</button>
      </form>
    </div>
  );
}
