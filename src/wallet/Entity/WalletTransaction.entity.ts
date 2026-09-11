import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "src/payment/Entity/payment.entity";
import { Wallet } from "./wallet.entity";

@Entity("wallet_transactions")
export class WalletTransaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    walletId!: string;

    @Column({ type: "uuid", unique: true })
    paymentId!: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount!: number;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "walletId" })
    wallet!: Wallet;

    @ManyToOne(() => Payment, { onDelete: "CASCADE" })
    @JoinColumn({ name: "paymentId" })
    payment!: Payment;

    @CreateDateColumn()
    createdAt!: Date;
}
