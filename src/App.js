import React, { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import Draggable from "react-draggable";

const createDefaultBoard = () => [
  { id: 1, title: "To Do", cards: [] },
  { id: 2, title: "In Progress", cards: [] },
  { id: 3, title: "Completed", cards: [] },
];

const loadBoard = () => {
  try {
    const savedBoard = window.localStorage.getItem("data");
    if (!savedBoard) return createDefaultBoard();

    const parsedBoard = JSON.parse(savedBoard);
    if (!Array.isArray(parsedBoard)) return createDefaultBoard();

    return parsedBoard
      .filter((list) => list && list.id !== undefined)
      .map((list) => ({
        ...list,
        title: typeof list.title === "string" ? list.title : "Untitled",
        cards: Array.isArray(list.cards) ? list.cards : [],
      }));
  } catch (error) {
    console.error("Could not load the saved board:", error);
    return createDefaultBoard();
  }
};

const createCardId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function KanbanCard({ card, onMove, onUpdate }) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      onStop={(event) => onMove(card.id, event.clientX, event.clientY)}
    >
      <article ref={nodeRef} className="kanban-card">
        <input
          type="text"
          aria-label="Card title"
          value={card.title || ""}
          placeholder="Card title"
          onChange={(event) => onUpdate(card.id, "title", event.target.value)}
        />
        <textarea
          aria-label="Card description"
          value={card.description || ""}
          placeholder="Add a description..."
          rows={3}
          onChange={(event) => onUpdate(card.id, "description", event.target.value)}
        />
      </article>
    </Draggable>
  );
}

export default function App() {
  const [board, setBoard] = useState(loadBoard);

  useEffect(() => {
    try {
      window.localStorage.setItem("data", JSON.stringify(board));
    } catch (error) {
      console.error("Could not save the board:", error);
    }
  }, [board]);

  const addCard = (listId) => {
    setBoard((currentBoard) =>
      currentBoard.map((list) =>
        String(list.id) === String(listId)
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: createCardId(),
                  title: "New card",
                  description: "",
                },
              ],
            }
          : list
      )
    );
  };

  const updateCard = (cardId, field, value) => {
    setBoard((currentBoard) =>
      currentBoard.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          String(card.id) === String(cardId)
            ? { ...card, [field]: value }
            : card
        ),
      }))
    );
  };

  const moveCard = (cardId, clientX, clientY) => {
    const target = document
      .elementFromPoint(clientX, clientY)
      ?.closest("[data-list-id]");
    if (!target) return;

    const targetListId = target.getAttribute("data-list-id");
    setBoard((currentBoard) => {
      let movingCard = null;
      const boardWithoutCard = currentBoard.map((list) => ({
        ...list,
        cards: list.cards.filter((card) => {
          if (String(card.id) === String(cardId)) {
            movingCard = card;
            return false;
          }
          return true;
        }),
      }));

      if (!movingCard) return currentBoard;

      return boardWithoutCard.map((list) =>
        String(list.id) === String(targetListId)
          ? { ...list, cards: [...list.cards, movingCard] }
          : list
      );
    });
  };

  return (
    <div className="kanban-app">
      <Header />
      <main className="kanban-board" aria-label="Kanban board">
        {board.map((list) => (
          <section
            className="kanban-list"
            data-list-id={list.id}
            key={list.id}
            aria-labelledby={`list-title-${list.id}`}
          >
            <div className="kanban-list-header">
              <h2 id={`list-title-${list.id}`}>{list.title}</h2>
              <span className="card-count">{list.cards.length}</span>
            </div>

            <button
              type="button"
              className="add-card-button"
              onClick={() => addCard(list.id)}
            >
              + Add card
            </button>

            <div className="kanban-cards">
              {list.cards.length === 0 ? (
                <p className="empty-list">No cards yet</p>
              ) : (
                list.cards.map((card) => (
                  <KanbanCard
                    key={`${list.id}-${card.id}`}
                    card={card}
                    onMove={moveCard}
                    onUpdate={updateCard}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
