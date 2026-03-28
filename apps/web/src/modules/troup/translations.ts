import { TroupCode } from '@eoneom/api-client'

interface TroupTranslation {
  name: string
  description: string
  effect: string
}

export const TroupTranslations: Record<TroupCode, TroupTranslation> = {
  [TroupCode.EXPLORER]: {
    name: 'Explorateur',
    description: 'Créé pour se déplacer rapidement, il est capable de se camoufler et passer n\'importe où',
    effect: 'Récupère des informations sur le monde concernant les ressources à récupérer'
  },
  [TroupCode.SETTLER]: {
    name: 'Colon',
    description: 'Le colon emporte avec lui toute la nourriture et le matériel nécessaire à la création de ville',
    effect: 'Permet de coloniser un emplacement du monde en créant une nouvelle ville'
  },
  [TroupCode.LIGHT_TRANSPORTER]: {
    name: 'Transporteur léger',
    description: '',
    effect: ''
  }
}
