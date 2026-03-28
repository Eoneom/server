import { TechnologyCode } from '@kroust/swarm-client'

interface TechnologyTranslation {
  name: string
  description: string
  effect: string
}

export const TechnologyTranslations: Record<TechnologyCode, TechnologyTranslation> = {
  [TechnologyCode.ARCHITECTURE]: {
    name: 'Architecture',
    description: 'Réfléchir à la construction de bâtiments permet de nouvelles prouesses d\'optimisation de place',
    effect: 'Débloque des bâtiments et réduit le temps de construction de 10% par niveau'
  },
  [TechnologyCode.REPLICATION_CATALYST]: {
    name: 'Catalyseur de réplication',
    description: 'L\'ajout de catalyseur dans le bain des clones permet d\'accélérer leur développement',
    effect: 'Accélère la production de troupes de 10% par niveau'
  }
}
