import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Partner } from '../auth/entities/partner.entity.js';
import { Customer } from './customer.entity.js';

@Entity()
export class CustomerPartnerPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.partnerPeriods)
  customer: Relation<Customer>;

  @ManyToOne(() => Partner, (partner) => partner.customerPeriods)
  partner: Relation<Partner>;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  endDate: Date;
}
