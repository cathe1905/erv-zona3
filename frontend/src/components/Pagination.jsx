import Pagination from "react-bootstrap/Pagination";
import { useState, useEffect } from "react";

const PaginationGeneral = ({ total, current_page, limit, onSelectPage }) => {
  const total_pages = Math.ceil(total / limit);
  const [items, setItems] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(7); // Cambiado a 7 para mostrar solo 7 páginas

  useEffect(() => {
    if (total_pages === 0) {
      setItems([]); // Si no hay páginas, limpiar items
      return;
    }

    let newStart = start;
    let newEnd = end;

    if (total_pages > 7) {
      // Ajustar el rango para mostrar solo 7 páginas
      if (current_page > end) {
        newStart = current_page - 6; // Cambiado a 6 para mostrar 7 páginas
        newEnd = current_page;
      } else if (current_page < start) {
        newStart = current_page;
        newEnd = current_page + 6; // Cambiado a 6 para mostrar 7 páginas
      }

      // Asegurarse de que el rango no sea menor que 1 ni mayor que el total de páginas
      if (newStart < 1) newStart = 1;
      if (newEnd > total_pages) newEnd = total_pages;

      setStart(newStart);
      setEnd(newEnd);
    } else {
      // Si hay menos de 7 páginas, mostrar todas
      newStart = 1;
      newEnd = total_pages;
    }

    // Crear los elementos de paginación
    const paginationItems = [];
    for (let i = newStart; i <= newEnd; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === current_page}
          onClick={() => onSelectPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    setItems(paginationItems);
  }, [total, current_page, limit, total_pages, start, end]);

  return (
    <Pagination>
      <Pagination.First
        onClick={() => onSelectPage(1)}
        disabled={current_page === 1}
      />
      <Pagination.Prev
        disabled={current_page === 1}
        onClick={() => onSelectPage(current_page > 1 ? current_page - 1 : 1)}
      />
      {items}
      <Pagination.Next
        disabled={current_page === total_pages}
        onClick={() =>
          onSelectPage(current_page < total_pages ? current_page + 1 : total_pages)
        }
      />
      <Pagination.Last
        disabled={current_page === total_pages}
        onClick={() => onSelectPage(total_pages)}
      />
    </Pagination>
  );
};

export default PaginationGeneral;