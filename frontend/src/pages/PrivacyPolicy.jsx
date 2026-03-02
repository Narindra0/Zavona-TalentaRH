import PublicLayout from '../layouts/PublicLayout';

const PrivacyPolicy = () => {
  const lastUpdate = "2 mars 2026";
  return (
    <PublicLayout>
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-black mb-3">Politique de confidentialité</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Vos données, nos engagements</h1>
            <p className="text-sm text-slate-500">Dernière mise à jour : {lastUpdate}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-700">
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Bases légales</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Exécution de mesures précontractuelles : traitement des candidatures et échanges associés.</li>
                <li>Intérêt légitime : amélioration du service et mesure d’audience.</li>
              </ul>

              <h2 className="font-semibold text-slate-900 mt-4">Données collectées</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Identité et contact : nom, prénom, email, téléphone.</li>
                <li>CV et informations professionnelles fournies via formulaire.</li>
                <li>Données techniques et navigation (logs, cookies de mesure).</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Finalités</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Gestion et suivi des candidatures.</li>
                <li>Matching avec les offres et communications associées.</li>
                <li>Amélioration du site et statistiques d’audience.</li>
              </ul>

              <h2 className="font-semibold text-slate-900 mt-4">Durées de conservation</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Dossiers de candidature : 24 mois après dernier contact.</li>
                <li>Logs techniques : 12 mois.</li>
                <li>Cookies de mesure : 13 mois maximum.</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-700">
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Destinataires & transferts</h2>
              <p>Les données sont accessibles à l’équipe RH de ZANOVA Talenta RH et à nos sous-traitants techniques (hébergeur, outils analytics). Aucun transfert hors Madagascar/UE n’est prévu ; en cas d’outil tiers basé hors UE, nous appliquons des clauses contractuelles types (SCC).</p>

              <h2 className="font-semibold text-slate-900 mt-4">Sécurité</h2>
              <p>Chiffrement en transit (HTTPS), contrôle d’accès, journalisation des accès, sauvegardes régulières.</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-slate-900">Vos droits</h2>
              <p>Accès, rectification, effacement, limitation, opposition et portabilité (lorsque applicable). Pour exercer vos droits :</p>
              <p><a className="text-orange-600 font-medium" href="mailto:privacy@zanova.mg">privacy@zanova.mg</a></p>

              <h2 className="font-semibold text-slate-900 mt-4">Réclamation</h2>
              <p>Autorité compétente : Commission Malagasy de l’Informatique et des Libertés (ou autorité locale équivalente). Vous pouvez d’abord nous contacter pour toute demande.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
