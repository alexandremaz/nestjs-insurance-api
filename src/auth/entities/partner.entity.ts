import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerPartnerPeriod } from '../../customer/customer-partner-period.entity';

// Entity to store the partner
@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  apiKey: string;

  @OneToMany(
    () => CustomerPartnerPeriod,
    (period) => period.partner,
  )
  customerPeriods: CustomerPartnerPeriod[];
}
