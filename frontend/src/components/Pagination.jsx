import Pagination from "react-bootstrap/Pagination";
import { useState } from "react";
import { useEffect } from "react";

const PaginationGeneral = ({total, current_page, limit, onSelectPage}) => {
  const total_pages= Math.ceil(total / limit);
  const [items, setItems] = useState([])

  useEffect(() =>{
    const paginationItems= [];
    for (let i = 1; i <= total_pages; i++) {
      paginationItems.push(
        <Pagination.Item key={i} active={i == current_page} onClick={() => onSelectPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    setItems(paginationItems);
  }, [total, current_page, limit, onSelectPage])

  return (
    <>
    <Pagination>
      <Pagination.First onClick={() => onSelectPage(1)} />
      <Pagination.Prev disabled={current_page == 1} onClick={() => onSelectPage(current_page > 1 ? current_page - 1 : 1)} />
      {items}
      <Pagination.Next />
      <Pagination.Last disabled={current_page == total_pages} onClick={() => onSelectPage(current_page < total_pages ? current_page + 1 : total_pages)} />
    </Pagination>
    </>
  );
};

export default PaginationGeneral;
