import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from '../auth/entities/partner.entity';
import { Customer } from './customer.entity';

@Entity()
export class CustomerPartnerPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Customer,
    (customer) => customer.partnerPeriods,
  )
  customer: Customer;

  @ManyToOne(
    () => Partner,
    (partner) => partner.customerPeriods,
  )
  partner: Partner;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  endDate: Date;
}
