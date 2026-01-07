import React, { useEffect, useState } from "react";

export default function RestaurantInfo({ id: propId }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavori, setIsFavori] = useState(false);

  // compute restaurant id from prop or pathname so handlers can use it
  const rid =
    propId ||
    (() => {
      const m =
        window.location.pathname &&
        window.location.pathname.match(/^\/restaurants\/(.+)$/);
      return m ? decodeURIComponent(m[1]) : null;
    })();

  useEffect(() => {
    const rid =
      propId ||
      (() => {
        const m =
          window.location.pathname &&
          window.location.pathname.match(/^\/restaurants\/(.+)$/);
        return m ? decodeURIComponent(m[1]) : null;
      })();
    if (!rid) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`/api/restaurants/${encodeURIComponent(rid)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        if (mounted) setRestaurant(data);
          // also fetch user favourites for this restaurant
          if (mounted) {
            try {
              const token2 = localStorage.getItem('accessToken');
              if (token2) {
                const me = await fetch('/api/user-restaurants/me', { headers: { Authorization: `Bearer ${token2}` } });
                if (me.ok) {
                  const rows = await me.json();
                  const found = (Array.isArray(rows) ? rows : []).find(rw => rw.restaurant_id === data.dataId || rw.restaurant_id === data._id);
                  setIsFavori(Boolean(found && found.is_favorite));
                }
              }
            } catch (e) {
              // ignore
            }
          }
      } catch (err) {
        if (mounted) setError(err.message || "Erreur lors de la récupération");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [propId]);

  if (!propId && !window.location.pathname.match(/^\/restaurants\//))
    return null;

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 12 }}>
        <a
          href="/restaurants"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/restaurants");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Retour
        </a>
      </nav>
      <main className="card" style={{ padding: 16 }}>
        <h2>Informations sur le restaurant</h2>
        {loading && <p>Chargement…</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {restaurant && (
          <div>
            <h3 style={{ marginTop: 0 }}>
              {restaurant.title || restaurant.name}
            </h3>
            <div style={{ marginBottom: 12 }}>
              <button
                type="button"
                style={{ padding: '8px 12px', cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    const apiBase = (typeof window !== 'undefined' && window.location.port === '5173') ? 'http://localhost:3000' : '';
                    const url = `${apiBase}/api/user-restaurants/${isFavori ? 'unlike' : 'like'}`;
                    const res = await fetch(url, {
                      method: 'POST',
                      headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ restaurantId: rid })
                    });
                    if (!res.ok) {
                      const text = await res.text().catch(() => '');
                      console.error('Like API responded', res.status, text);
                    } else {
                      const j = await res.json().catch(() => null);
                      // toggle local state
                      setIsFavori(!isFavori);
                      // notify other components (RestaurantsList) to update UI
                      try {
                        window.dispatchEvent(new CustomEvent('user-restaurants-changed', { detail: { restaurantId: rid, favori: !isFavori } }));
                      } catch (e) {}
                      console.log(isFavori ? 'Removed favorite' : 'Added favorite', j);
                    }
                  } catch (e) {
                    console.error('Erreur lors de l\'appel /like or /unlike', e);
                  }
                }}
              >
                {isFavori ? 'Retirer des favoris' : "J'aime"}
              </button>
            </div>
            {restaurant.thumbnail != null && (
              <img
                src={restaurant.thumbnail}
                alt={restaurant.name}
                style={{ maxWidth: "100%", height: "auto", marginBottom: 16 }}
              />
            )}
            {restaurant.address != null && (
              <p>
                <strong>Adresse:</strong> {restaurant.address}
              </p>
            )}
            {restaurant.website != null && (
              <p>
                <strong>Website:</strong>{" "}
                <a href={restaurant.website} target="_blank" rel="noreferrer">
                  {restaurant.website}
                </a>
              </p>
            )}
            {restaurant.phone != null && (
              <p>
                <strong>Téléphone:</strong> {restaurant.phone}
              </p>
            )}
            {restaurant.rating != null && (
              <p>
                <strong>Note:</strong> {restaurant.rating}
              </p>
            )}
            {restaurant.reviews != null && (
              <p>
                <strong>Avis:</strong> {restaurant.reviews}
              </p>
            )}
            {restaurant.type != null && (
              <p>
                <strong>Type:</strong> {restaurant.type}
              </p>
            )}
            {restaurant.price != null && (
              <p>
                <strong>Prix:</strong> {restaurant.price}
              </p>
            )}
            {restaurant.description != null && (
              <p>
                <strong>Description:</strong> {restaurant.description}
              </p>
            )}
            {restaurant.openState != null && (
              <p>
                <strong>État d'ouverture:</strong> {restaurant.openState}
              </p>
            )}
            {restaurant.serviceOptions != null && (
              <p>
                <strong>Options de service:</strong>{" "}
                {restaurant.serviceOptions.join(", ")}
              </p>
            )}
            {restaurant.keyword != null && (
              <p>
                <strong>Mots-clés:</strong> {restaurant.keyword.join(", ")}
              </p>
            )}
            {restaurant.googleMapsRank != null && (
              <p>
                <strong>Classement Google Maps:</strong>{" "}
                {restaurant.googleMapsRank}
              </p>
            )}
            {restaurant.mainEmail != null && (
              <p>
                <strong>Email principal:</strong> {restaurant.mainEmail}
              </p>
            )}
            {restaurant.otherEmails != null &&
              restaurant.otherEmails.length > 0 && (
                <p>
                  <strong>Autres emails:</strong>{" "}
                  {restaurant.otherEmails.join(", ")}
                </p>
              )}
            {
              <iframe width="600" height="450" style={{ border: 0, margin: "0 auto", display: "block" }} loading="lazy" allowFullScreen  referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`}
              ></iframe>
            }
          </div>
        )}
      </main>
    </div>
  );
}
