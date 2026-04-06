import { useState } from 'react';
import './App.css';
import { NewRequest } from './components/NewRequest';
import { RequestList } from './components/RequestList';
import logo from './assets/logo.svg';
import { useQueryClient } from '@tanstack/react-query';
import { deleteRefund } from './api/refunds';

function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <header className="app-header">
        <img src={logo} alt="Convert logo" className="logo" />
        
        <nav className="nav-actions">
          <button 
            className={`nav-link ${activeTab === 'list' && !selectedRefund ? 'active' : ''}`}
            onClick={() => { setActiveTab('list'); setSelectedRefund(null); }}
          >
            Solicitações de reembolso
          </button>
          
          <button 
            className={`btn-primary ${activeTab === 'new' && !selectedRefund ? 'active' : ''}`}
            onClick={() => { setActiveTab('new'); setSelectedRefund(null); }}
          >
            Nova solicitação
          </button>
        </nav>
      </header>

      <main className="main-content">
        {selectedRefund ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="card new-request-card">
              <form>
                <h1>Solicitação de reembolso</h1>
                <p>Dados da despesa para solicitar reembolso.</p>

                <fieldset>
                  <legend>Nome da solicitação</legend>
                  <input type="text" readOnly value={selectedRefund.title} />
                </fieldset>

                <div className="inputs-row">
                  <fieldset>
                    <legend>Categoria</legend>
                    <select disabled value={selectedRefund.category}>
                      <option value="food">Alimentação</option>
                      <option value="hosting">Hospedagem</option>
                      <option value="services">Serviços</option>
                      <option value="transport">Transporte</option>
                      <option value="other">Outros</option>
                    </select>
                  </fieldset>

                  <fieldset>
                    <legend>Valor</legend>
                    <input type="text" readOnly value={`R$ ${(selectedRefund.value / 100).toFixed(2)}`} />
                  </fieldset>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      let filename = "";

                      if (typeof selectedRefund.receipt === "string") {
                        filename = selectedRefund.receipt;
                      } else if (selectedRefund.receipt) {
                        // O banco retorna "filename" sem extensão, porém "path" tem o caminho completo.
                        if (selectedRefund.receipt.path) {
                          filename = selectedRefund.receipt.path.split("/").pop() || "";
                        } else if (selectedRefund.receipt.filename && selectedRefund.receipt.extname) {
                          filename = `${selectedRefund.receipt.filename}.${selectedRefund.receipt.extname}`;
                        } else {
                          filename = selectedRefund.receipt.filename || "";
                        }
                      }

                      if (!filename) {
                        alert("Arquivo não encontrado");
                        return;
                      }

                      console.log("RECEIPT FINAL QUE VAI PRA URL:", filename);
                      console.log("OBJETO ORIGINAL:", selectedRefund.receipt);

                      window.open(
                        `http://localhost:3333/receipts/file/${filename}`,
                        "_blank"
                      );
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Abrir comprovante
                  </button>

                  <button 
                    type="button" 
                    className="submit-btn" 
                    onClick={() => setDeleteModalOpen(true)}
                    style={{ margin: 0 }}
                  >
                    Excluir
                  </button>
                </div>
              </form>
            </div>

            {deleteModalOpen && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
              }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1f2523' }}>Deseja realmente excluir este comprovante ?</h2>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                      className="submit-btn" 
                      style={{ margin: 0, flex: 1 }} 
                      onClick={async () => {
                        try {
                          await deleteRefund(selectedRefund.id);
                          queryClient.invalidateQueries({ queryKey: ["refunds"] });
                        } catch(e) {
                          console.log("Falha ao excluir reembolso (a rota delete pode não existir):", e);
                        }
                        setDeleteModalOpen(false);
                        setSelectedRefund(null);
                      }}
                    >
                      SIM
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ margin: 0, flex: 1 }} 
                      onClick={() => setDeleteModalOpen(false)}
                    >
                      NAO
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ width: '100%', display: activeTab === 'new' ? 'flex' : 'none', justifyContent: 'center' }}>
              <NewRequest />
            </div>

            <div style={{ width: '100%', display: activeTab === 'list' ? 'flex' : 'none', justifyContent: 'center' }}>
              <RequestList onSelect={setSelectedRefund} />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;

