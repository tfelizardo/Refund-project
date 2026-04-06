import { useState, useEffect } from "react";
import { useRefunds } from "../hooks/useRefunds";

import foodIcon from '../assets/food.svg';
import accommodationIcon from '../assets/accommodation.svg';
import servicesIcon from '../assets/services.svg';
import transportIcon from '../assets/transport.svg';
import othersIcon from '../assets/others.svg';

export function RequestList({ onSelect }: any) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data } = useRefunds(page, search);

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return foodIcon;
      case 'hosting': return accommodationIcon;
      case 'services': return servicesIcon;
      case 'transport': return transportIcon;
      case 'other': return othersIcon;
      default: return othersIcon;
    }
  };

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'food': return 'Alimentação';
      case 'hosting': return 'Hospedagem';
      case 'services': return 'Serviços';
      case 'transport': return 'Transporte';
      case 'other': return 'Outros';
      default: return type;
    }
  };

  const requests = data?.refunds?.data || [];

  return (
    <div className="card requests-card">
      <h1>Solicitações</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar solicitação..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <ul className="requests-list">
        {requests.map((item: any) => (
          <li 
            key={item.id} 
            className="request-item"
            onClick={() => onSelect(item)}
            style={{ cursor: "pointer" }}
          >
            <div className="icon-wrapper">
              <img src={getIcon(item.category)} alt={item.category} />
            </div>

            <div className="request-info">
              <strong>{item.title}</strong>
              <span>{getCategoryName(item.category)}</span>
            </div>

            <span className="request-amount">
              R$ {(item.value / 100).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <span className="page-info">
          {data?.refunds?.meta?.currentPage} / {data?.refunds?.meta?.lastPage}
        </span>

        <button
          className="page-btn"
          onClick={() => setPage((prev) => prev + 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}