import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entity to store the partner
@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  apiKey: string;
}
