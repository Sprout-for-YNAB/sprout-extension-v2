import styles from "./autocomplete.module.css";
import { Dispatch, KeyboardEvent, useMemo, useRef, useState } from "react";
import { useTransactionFormContext } from "contexts/transactionFormContext";
import { filterItems } from "utils/filter";
import { Selection, SubtransactionAction } from "@shared/types/app";
import Suggestions from "components/transaction/autocomplete/suggestions/suggestions";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import useSettings from "@shared/hooks/useSettings";
import { useTransactionViewContext } from "contexts/transactionViewContext";

type Props = {
  label: string;
  showAddItem?: boolean;
  subtransactionDispatch?: Dispatch<SubtransactionAction>;
  initialValue?: string;
  ariaLabel?: string;
};

export default function Autocomplete({
  label,
  showAddItem,
  subtransactionDispatch,
  initialValue,
  ariaLabel
}: Props) {
  const [highlighted, setHighlighted] = useState<Selection | null>(null);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [value, setValue] = useState(initialValue ?? "");
  const offsetTop = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = useRef("");
  const itemHeight = 32;
  const id = `${label.toLowerCase()}-input`;
  const { accounts, payees, categoryGroups, setShowSubtransactionModal } =
    useTransactionViewContext();
  const { dispatch } = useTransactionFormContext();
  const { expandAutocomplete } = useSettings();
  const filteredItems = useMemo(() => {
    let items;
    switch (label) {
      case "Account":
        items = accounts;
        break;
      case "Payee":
        items = payees;
        break;
      case "Category":
        items = categoryGroups;
        break;
    }
    const newFilteredItems = filterItems(value, items ?? []);
    if (newFilteredItems.length > 0 && value.trim().length > 0) {
      const { id, name } = newFilteredItems[0].items[0];
      setHighlighted({
        id,
        name,
        index: {
          groupIndex: 0,
          itemIndex: 0
        }
      });
    }
    return newFilteredItems;
  }, [accounts, categoryGroups, label, payees, value]);

  const showSuggestions = () => {
    setSuggestionsExpanded(true);
    if (expandAutocomplete && !subtransactionDispatch && rowRef.current) {
      offsetTop.current = -Math.abs(rowRef.current.getBoundingClientRect().top - 16);
      setFullscreen(true);
    }
  };

  const hideSuggestions = () => {
    setSuggestionsExpanded(false);
    setHighlighted(null);
  };

  const showSubtransactionModal = () => {
    setValue("Split (Multiple Categories)");
    setSuggestionsExpanded(false);
    setShowSubtransactionModal(true);
  };

  const setFullscreenView = () => {
    const isFullscreen = !fullscreen;
    if (isFullscreen && rowRef.current) {
      offsetTop.current = -Math.abs(rowRef.current.getBoundingClientRect().top - 16);
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
    setFullscreen(isFullscreen);
  };

  const saveItem = (item: Selection) => {
    hideSuggestions();
    selected.current = item.id ? item.id : item.name;
    setValue(item.name);
    if (subtransactionDispatch) {
      subtransactionDispatch({
        type: "payee",
        payee_id: item.id,
        payee_name: item.name
      });
    } else {
      switch (label) {
        case "Account":
          dispatch({
            type: "account",
            account_id: item.id
          });
          break;
        case "Payee":
          dispatch({
            type: "payee",
            payee_id: item.id,
            payee_name: !item.id ? item.name : undefined
          });
          break;
        case "Category":
          dispatch({
            type: "category",
            category_id: item.id
          });
          break;
      }
    }
  };

  const scrollSuggestions = (direction: "ArrowDown" | "ArrowUp") => {
    const listHeight = fullscreen ? 527 : 210;
    const current = highlighted;
    if (!highlighted) {
      const item = filteredItems[0].items[0];
      setHighlighted({
        id: item.id,
        name: item.name,
        index: {
          groupIndex: 0,
          itemIndex: 0
        }
      });
    } else if (current?.index) {
      let newGroupIndex = current?.index?.groupIndex;
      let newItemIndex;
      const listViewTop = listRef.current
        ? listRef.current.scrollTop + itemHeight / 2
        : itemHeight / 2;
      const listViewBottom = listViewTop
        ? listViewTop + listHeight - itemHeight / 2
        : listHeight - itemHeight / 2;
      if (direction === "ArrowDown") {
        newItemIndex = current?.index?.itemIndex + 1;
        if (newItemIndex === filteredItems[newGroupIndex].items.length) {
          newGroupIndex = newGroupIndex + 1 === filteredItems.length ? 0 : newGroupIndex + 1;
          newItemIndex = 0;
        }
      } else {
        newItemIndex = current?.index?.itemIndex - 1;
        if (newItemIndex === -1) {
          newGroupIndex = newGroupIndex - 1 === -1 ? filteredItems.length - 1 : newGroupIndex - 1;
          newItemIndex = filteredItems[newGroupIndex].items.length - 1;
        }
      }
      const item = filteredItems[newGroupIndex].items[newItemIndex];
      const itemLi = document.getElementById(item.id);
      const itemPositionTop = itemLi ? itemLi.offsetTop : 0;
      const itemPositionBottom = itemPositionTop ? itemPositionTop + itemHeight : itemHeight;
      const isItemInView = itemPositionBottom <= listViewBottom && itemPositionTop >= listViewTop;

      if (!isItemInView) {
        listRef.current?.scrollTo({
          top:
            direction === "ArrowDown"
              ? itemPositionTop - listHeight + itemHeight + itemHeight / 2
              : itemPositionTop - itemHeight / 2
        });
      }
      setHighlighted({
        id: item.id,
        name: item.name,
        index: {
          groupIndex: newGroupIndex,
          itemIndex: newItemIndex
        }
      });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestionsExpanded) {
        scrollSuggestions(event.key);
      }
    }
    setSuggestionsExpanded(true);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      selectItem();
    }
  };

  const selectItem = () => {
    if (showAddItem && !highlighted && value) {
      saveItem({ name: value });
    } else if (highlighted) {
      saveItem(highlighted);
    } else {
      hideSuggestions();
    }
    setFullscreen(false);
  };

  return (
    <div
      ref={rowRef}
      className={`form__row ${styles.row} ${fullscreen ? styles.fullscreen : ""} ${
        subtransactionDispatch ? styles.subtransaction : ""
      }`}
      style={fullscreen ? { transform: `translateY(${offsetTop.current}px)` } : {}}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        ref={inputRef}
        className={styles.input}
        value={value}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => showSuggestions()}
        onChange={(event) => setValue(event.target.value)}
        onBlur={selectItem}
        type="text"
        role="combobox"
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-expanded={suggestionsExpanded}
        aria-label={ariaLabel ?? label}
      />
      {!subtransactionDispatch && (
        <button
          tabIndex={-1}
          aria-hidden={true}
          className={`${styles.button} secondary icon`}
          onClick={() => setFullscreenView()}
        >
          {fullscreen ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}
        </button>
      )}
      {suggestionsExpanded && (
        <Suggestions
          label={label}
          ref={listRef}
          items={filteredItems}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          selectedId={selected.current}
          selectItem={selectItem}
          showAddItem={showAddItem ?? false}
          value={value}
          fullscreen={fullscreen}
          showSubtransactionModal={() => showSubtransactionModal()}
        />
      )}
    </div>
  );
}
