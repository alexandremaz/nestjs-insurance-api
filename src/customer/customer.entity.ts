import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Claim } from '../claim/claim.entity';

@Entity()
// Entity to store a customer
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @OneToMany(() => Claim, (claim) => claim.customer)
  claims: Claim[];
}
