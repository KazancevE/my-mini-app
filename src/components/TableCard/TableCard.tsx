import React from 'react';
import './tableCard.scss';

const TableCard: React.FC<{ table: any; onSelect: (table: any) => void; }> = ({ table, onSelect }) => {
  return (
    <div className="table-card" onClick={() => onSelect(table)}>
      <img src={table.image} alt={`Table ${table.id}`} />
      <h6>{table.description}</h6>
      <p>Цена: {table.price} руб.</p>
      <div>
        {table.privileges.map((privilege: string) => (
          <span key={privilege}>{privilege} </span>
        ))}
      </div>
    </div>
  );
};

export default TableCard;
