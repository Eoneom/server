import {
  AnyParamConstructor, BeAnObject 
} from '@typegoose/typegoose/lib/types'
import {
  ReturnModelType, mongoose 
} from '@typegoose/typegoose'

export type FilterQuery<Document> = mongoose.FilterQuery<Document>
export type DatabaseDocument = AnyParamConstructor<any>

export type DatabaseModel<Doc extends DatabaseDocument> = ReturnModelType<Doc, BeAnObject>
