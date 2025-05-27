import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsInt, IsNumber, IsString, MinLength } from 'class-validator';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public code!: string;

    @IsNumber()
    @Field(() => Float)
    @Column('decimal')
    public rate!: number;

    @IsInt()
    @Field(() => Int)
    @Column('int')
    public amount!: number;

    @Field(() => Date)
    public createdAtUtc!: Date;
}
