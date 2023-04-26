import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript'


@Table({
  indexes:[
    { fields: ['email','password'], unique:true}
  ]
})
export class Users extends Model {
  
  @Column
  email: string

  @Column
  password: string

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  image: string;


  @Column({type: DataType.BLOB})
  pdf: Buffer

}