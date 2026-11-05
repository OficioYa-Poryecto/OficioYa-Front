import Icon from '../design-system/Icon';
import ui from '../design-system/ui.module.css';

function NeighborhoodCard({ label, zone, note }) {
  return (
    <section className={ui.neighborhoodCard}>
      <span className={ui.mapPin}><Icon name="map" /></span>
      <div>
        <small>{label}</small>
        <strong>{zone}</strong>
        <p>{note}</p>
      </div>
    </section>
  );
}

export default NeighborhoodCard;
