import { type SchemaTypeDefinition } from 'sanity'
import project from '../schemas/project'
import experience from '../schemas/experience'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, experience],
}
