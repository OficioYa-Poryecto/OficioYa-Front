import ui from '../design-system/ui.module.css';

function EditNav({ items }) {
  return (
    <aside className={ui.editNav}>
      {items.map((item, index) => (
        <button className={index === 0 ? ui.editNavActive : ''} key={item} type="button">
          <span>{index + 1}</span>
          {item}
        </button>
      ))}
    </aside>
  );
}

export default EditNav;
