import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Claim } from '../claim/claim.entity.js';
import { CustomerPartnerPeriod } from './customer-partner-period.entity.js';

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
  claims: Relation<Claim[]>;

  @OneToMany(() => CustomerPartnerPeriod, (period) => period.customer)
  partnerPeriods: CustomerPartnerPeriod[];
}
