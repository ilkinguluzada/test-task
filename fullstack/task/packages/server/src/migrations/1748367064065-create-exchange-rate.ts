import { MigrationInterface, QueryRunner } from 'typeorm';

export class createExchangeRate1695820000000 implements MigrationInterface {
    name = 'createExchangeRate1748367064065';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "exchange_rate" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAtUtc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAtUtc" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "deleteDateUtc" TIMESTAMP WITH TIME ZONE,
                "version" integer NOT NULL,
                "currency" character varying(255) NOT NULL,
                "code" character varying(255) NOT NULL,
                "rate" decimal NOT NULL,
                "amount" integer NOT NULL,
                CONSTRAINT "PK_exchange_rate_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
    }
}
