import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Customer } from '../customer/customer.entity.js';

@Entity()
// Entity to store a claim of a customer
export class Claim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  pointValue: number;

  @ManyToOne(() => Customer, (customer) => customer.claims)
  customer: Relation<Customer>;
}
