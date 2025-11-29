import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Claim } from '../claim/claim.entity';
import { CustomerPartnerPeriod } from './customer-partner-period.entity';

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

  @OneToMany(() => CustomerPartnerPeriod, (period) => period.customer)
  partnerPeriods: CustomerPartnerPeriod[];
}
