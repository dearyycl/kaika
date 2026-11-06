import { PlusIcon } from "./Icons.jsx";
import ProductArt from "./ProductArt.jsx";
import { rupiah } from "../lib/format.js";

export default function MenuCard({ item, onSelect }) {
  return (
    <article className="menu-card" onClick={() => onSelect(item)}>
      <ProductArt
        className="menu-card__img"
        category={item.category}
        name={item.name}
        src={item.image}
      />
      <div className="menu-card__body">
        <span className="menu-card__cat">{item.category}</span>
        <h3 className="menu-card__name">{item.name}</h3>
        <p className="menu-card__desc">{item.description}</p>
        <div className="menu-card__row">
          <span className="menu-card__price">{rupiah(item.price)}</span>
          <button
            type="button"
            className="btn-add"
            aria-label={`Racik ${item.name}`}
            onClick={() => onSelect(item)}
          >
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
