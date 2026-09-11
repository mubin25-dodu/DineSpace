import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Resturant } from '../../resturant/Entity/Resturant.entity';
import { Payment } from '../../payment/Entity/payment.entity';
import { WithdrawalRequest } from './WithdrawalRequest.entity';
import { WalletTransaction } from './WalletTransaction.entity';

@Entity('wallets')
export class Wallet {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
	balance!: number;

	@Column({ type: 'uuid', unique: true })
	restaurantId!: string;

	@OneToOne(() => Resturant, (restaurant) => restaurant.wallet, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'restaurantId' })
	restaurant!: Resturant;

	@OneToMany(() => Payment, (payment) => payment.wallet)
	payments!: Payment[];

	@OneToMany(() => WithdrawalRequest, (request) => request.wallet)
	withdrawalRequests!: WithdrawalRequest[];

	@OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
	transactions!: WalletTransaction[];

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
