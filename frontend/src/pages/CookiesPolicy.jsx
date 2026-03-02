import PublicLayout from '../layouts/PublicLayout';

const CookiesPolicy = () => {
  return (
    <PublicLayout>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-black mb-3">Politique Cookies</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Contrôlez vos préférences</h1>
            <p className="text-sm text-slate-500">Validité du consentement : 13 mois (analytics) ; cookies essentiels non soumis à consentement.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="min-w-full text-sm text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-900 font-semibold">
                <tr>
                  <th className="px-4 py-3">Cookie</th>
                  <th className="px-4 py-3">Fournisseur</th>
                  <th className="px-4 py-3">Finalité</th>
                  <th className="px-4 py-3">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">session_id</td>
                  <td className="px-4 py-3">ZANOVA</td>
                  <td className="px-4 py-3">Maintien de la session utilisateur (essentiel)</td>
                  <td className="px-4 py-3">Durée de session</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">cookieConsent</td>
                  <td className="px-4 py-3">ZANOVA</td>
                  <td className="px-4 py-3">Stocker le choix de consentement</td>
                  <td className="px-4 py-3">13 mois</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">_ga</td>
                  <td className="px-4 py-3">Google Analytics 4</td>
                  <td className="px-4 py-3">Mesure d’audience (statistiques anonymisées)</td>
                  <td className="px-4 py-3">13 mois</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-700">Vous pouvez modifier vos préférences à tout moment via le bandeau cookies ou en effaçant vos cookies dans le navigateur. Les cookies essentiels sont nécessaires au fonctionnement du site.</p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default CookiesPolicy;
