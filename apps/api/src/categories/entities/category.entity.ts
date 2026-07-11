import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('categories')
@Unique(['name', 'userId'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
