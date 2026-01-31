import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import subscriber from './subscriber'
import user from './user'
import advertisement from './advertisement'
import livestream from './livestream'
import writer from './writer'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, subscriber, user, advertisement, livestream, writer],
}
