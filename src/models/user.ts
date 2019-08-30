import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id: string

    @Column(
        'varchar',
        {
            length: 100,
        }
    )
    firstName: string

    @Column(
        'varchar',
        {
            length: 100,
        }
    )
    lastName: string

    @Column(
        'varchar',
        {
            length: 100,
        }
    )
    email: string

    @Column('varchar')
    password: string

    @Column('varchar')
    salt: string

    @Column('varchar')
    slug: string
}