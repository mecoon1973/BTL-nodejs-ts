import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nameHotel: string

    @Column()
    countRoom: number

    @Column()
    imgHotel: string

    @Column()
    city: string

    @Column()
    Address: string

    @Column()
    typeOf: string

    @Column()
    moneyForOneNight: number


}
