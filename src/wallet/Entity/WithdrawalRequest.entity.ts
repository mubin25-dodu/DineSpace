import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Wallet } from "./wallet.entity";
import { WithdrawalStatus } from "../Enum/WithdrawalStatus.enum";
import { WithdrawalType } from "../Enum/WithdrawalType.enum";

@Entity("withdrawal_requests")
export class WithdrawalRequest {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    walletId!: string;

    @ManyToOne(() => Wallet, (wallet) => wallet.withdrawalRequests, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "walletId" })
    wallet!: Wallet;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount!: number;

    @Column({
        type: "enum",
        enum: WithdrawalStatus,
        default: WithdrawalStatus.Pending,
    })
    status!: WithdrawalStatus;

    @Column({
        type: "enum",
        enum: WithdrawalType,
        default: WithdrawalType.Withdraw,
    })
    type!: WithdrawalType;

    @Column({ type: "varchar", length: 30 })
    paymentMethod!: string;

    @Column({ type: "varchar", length: 100 })
    accountNumber!: string;

    @Column({ type: "timestamp", nullable: true })
    processedAt?: Date;

    @Column({ type: "varchar", length: 500, nullable: true })
    rejectionReason?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
