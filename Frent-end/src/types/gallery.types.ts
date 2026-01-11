// src/types/gallery.types.ts

export type StatutProjet = 'en_cours' | 'termine';

export interface Projet {
  id: number;
  domain_id: number;
  titre: string;
  description?: string;
  partenaire?: string;
  date_deb?: string;
  date_fin?: string;
  statut: StatutProjet;
   photo?: string;
}
export interface Domaine {
  id: number;
  nom: string;
}

export interface ImageGallery {
  id: number;
  project_id: number;
  image: string;
  description?: string;
  created_at: string;
}
