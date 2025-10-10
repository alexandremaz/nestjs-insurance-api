import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerPartnerPeriodTrigger1731159125011
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.info('Adding customer partner period trigger');

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION prevent_customer_partner_overlap()
      RETURNS TRIGGER AS $$
      BEGIN
          IF EXISTS (
              SELECT 1
              FROM customer_partner_period
              WHERE "customerId" = NEW."customerId"
              AND id != NEW.id
              AND (
                  (NEW."startDate" <= "endDate" OR "endDate" IS NULL)
                  AND (NEW."endDate" >= "startDate" OR NEW."endDate" IS NULL)
              )
          ) THEN
              RAISE EXCEPTION 'Period overlaps with existing period for this customer';
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER check_customer_partner_overlap
      BEFORE INSERT OR UPDATE ON customer_partner_period
      FOR EACH ROW EXECUTE FUNCTION prevent_customer_partner_overlap();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.info('Removing customer partner period trigger');
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS check_customer_partner_overlap ON customer_partner_period;
      DROP FUNCTION IF EXISTS prevent_customer_partner_overlap;
    `);
  }
}
