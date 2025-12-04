import { type SchemaTypeDefinition } from 'sanity'
import project from '../schemas/project'
import experience from '../schemas/experience'
import education from '../schemas/education'
import skillSet from '../schemas/skillSet'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, experience, education, skillSet],
}
