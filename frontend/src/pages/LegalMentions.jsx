import PublicLayout from '../layouts/PublicLayout';

const LegalMentions = () => {
  const lastUpdate = "2 mars 2026";
  return (
    <PublicLayout>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-black mb-3">Mentions légales</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Identité & responsabilités</h1>
            <p className="text-sm text-slate-500">Dernière mise à jour : {lastUpdate}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-700">
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Éditeur du site</h2>
              <ul className="space-y-1">
                <li><span className="font-medium">Dénomination :</span> ZANOVA Talenta RH</li>
                <li><span className="font-medium">Adresse :</span> Antananarivo, Madagascar</li>
                <li><span className="font-medium">Téléphone :</span> +261 (0) xx xx xxx</li>
                <li><span className="font-medium">Email :</span> contact@zanova.mg</li>
                <li><span className="font-medium">Représentant légal :</span> À confirmer</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Hébergeur</h2>
              <ul className="space-y-1">
                <li><span className="font-medium">Nom :</span> Hostinger International Ltd.</li>
                <li><span className="font-medium">Adresse :</span> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
                <li><span className="font-medium">Contact :</span> <a className="text-orange-600 font-medium" href="https://www.hostinger.fr/contact" target="_blank" rel="noreferrer">https://www.hostinger.fr/contact</a></li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-700">
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-900">Directeur de publication</h2>
              <p>Représentant légal de ZANOVA Talenta RH.</p>
              <h2 className="font-semibold text-slate-900 mt-4">Propriété intellectuelle</h2>
              <p>Les marques, logos, textes, visuels et bases de données présents sur le site sont la propriété de ZANOVA Talenta RH ou font l’objet d’autorisations. Toute reproduction non autorisée est interdite.</p>
            </div>
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-900">Responsabilité</h2>
              <p>Le site est fourni “en l’état”. Nous veillons à l’exactitude des informations sans garantir l’absence totale d’erreur. Les liens externes ne nous engagent pas. L’accès peut être interrompu pour maintenance ou cas de force majeure.</p>
              <h2 className="font-semibold text-slate-900 mt-4">Signalement</h2>
              <p>Pour tout signalement de contenu ou abus, contactez : <a className="text-orange-600 font-medium" href="mailto:contact@zanova.mg">contact@zanova.mg</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LegalMentions;
