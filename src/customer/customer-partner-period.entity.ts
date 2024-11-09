import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Partner } from '../auth/entities/partner.entity';

@Entity()
export class CustomerPartnerPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.partnerPeriods)
  customer: Customer;

  @ManyToOne(() => Partner, (partner) => partner.customerPeriods)
  partner: Partner;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;
}
