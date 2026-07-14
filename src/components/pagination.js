import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount = 1;
  // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page; // страница переменной, тк она может меняться при обработке действий позже

    // @todo: #2.6 — обработать действия
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу и тд
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit) || 1;
    // @todo: #2.4 — получить список видимых страниц и вывести их

    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = total > 0 ? (page - 1) * limit + 1 : 0; // С какой строки выводим
    toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
    totalRows.textContent = total;
  };

  // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
  return {
    updatePagination,
    applyPagination,
  };
};
