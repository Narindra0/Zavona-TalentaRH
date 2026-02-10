<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmailTemplate;

class EmailTemplateSeeder extends Seeder
{
    public function run()
    {
        EmailTemplate::updateOrCreate(
            ['name' => 'recruiter_contacted'],
            [
                'subject' => 'Mise en relation avec {talent_name}',
                'body' => "Bonjour {recruiter_name},\n\nNous avons bien reçu votre intérêt pour {talent_name} de la part de {company}.\n\nUn consultant de ZANOVA va vous contacter prochainement pour organiser un entretien.\n\nCordialement,\nL'équipe ZANOVA",
                'variables_available' => ['recruiter_name', 'talent_name', 'company']
            ]
        );
    }
}
