import { MigrationInterface, QueryRunner } from 'typeorm';

export class hello1653213185668 implements MigrationInterface {
  name = 'hello1653213185668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`UserDifficulty\` (\`difficulty\` int NOT NULL, \`gameID\` int NOT NULL, \`userID\` varchar(255) NOT NULL, PRIMARY KEY (\`gameID\`, \`userID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`User\` ADD \`totalStars\` INT NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserDifficulty\` ADD CONSTRAINT \`FK_61b7c8d1e044920cc8febf0fceb\` FOREIGN KEY (\`gameID\`) REFERENCES \`Game\`(\`gameid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserDifficulty\` ADD CONSTRAINT \`FK_0a82b90bb98877cd9a94b51520c\` FOREIGN KEY (\`userID\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`UserDifficulty\` DROP FOREIGN KEY \`FK_0a82b90bb98877cd9a94b51520c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserDifficulty\` DROP FOREIGN KEY \`FK_61b7c8d1e044920cc8febf0fceb\``,
    );

    await queryRunner.query(`DROP TABLE \`UserDifficulty\``);
    await queryRunner.query(`ALTER TABLE \`User\` DROP \`totalStars\``);
  }
}
