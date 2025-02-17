import Pagination from "react-bootstrap/Pagination";
import { useState } from "react";
import { useEffect } from "react";

const PaginationGeneral = ({total, current_page, limit, onSelectPage}) => {
  const total_pages= Math.ceil(total / limit);
  const [items, setItems] = useState([])
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);

  useEffect(() => {
    if (total_pages === 0) {
      setItems([]); // Si no hay páginas, limpiar items
      return;
    }

    let newStart = start;
    let newEnd = end;

    if (total_pages > 10) {
      if (current_page > end) {
        newStart = current_page - 9;
        newEnd = current_page;
      } else if (current_page < start) {
        newStart = current_page;
        newEnd = current_page + 9;
      }

      if (newStart < 1) newStart = 1;
      if (newEnd > total_pages) newEnd = total_pages;

      setStart(newStart);
      setEnd(newEnd);
    } else {
      newStart = 1;
      newEnd = total_pages;
    }

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
  }, [total, current_page, limit]);useEffect(() => {
    if (total_pages === 0) {
      setItems([]); // Si no hay páginas, limpiar items
      return;
    }

    let newStart = start;
    let newEnd = end;

    if (total_pages > 10) {
      if (current_page > end) {
        newStart = current_page - 9;
        newEnd = current_page;
      } else if (current_page < start) {
        newStart = current_page;
        newEnd = current_page + 9;
      }

      if (newStart < 1) newStart = 1;
      if (newEnd > total_pages) newEnd = total_pages;

      setStart(newStart);
      setEnd(newEnd);
    } else {
      newStart = 1;
      newEnd = total_pages;
    }

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
  }, [total, current_page, limit]);

  return (
    <Pagination>
      <Pagination.First onClick={() => onSelectPage(1)} disabled={current_page == 1}  />
      <Pagination.Prev disabled={current_page == 1} onClick={() => onSelectPage(current_page > 1 ? current_page - 1 : 1)} />
      {items}
      <Pagination.Next disabled={current_page == total_pages} onClick={() => onSelectPage(current_page < total_pages ? current_page + 1: total_pages)} />
      <Pagination.Last disabled={current_page == total_pages} onClick={() => onSelectPage(total_pages)} />
    </Pagination>
  );
};

export default PaginationGeneral;
