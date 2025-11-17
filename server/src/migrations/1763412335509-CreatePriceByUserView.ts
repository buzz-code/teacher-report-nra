import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePriceByUserView1763412335509 implements MigrationInterface {
    name = 'CreatePriceByUserView1763412335509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE VIEW \`price_by_user\` AS
            SELECT \`p_base\`.\`code\` AS \`code\`,
                \`p_base\`.\`description\` AS \`description\`,
                \`p_base\`.\`price\` AS \`defaultPrice\`,
                \`users\`.\`id\` AS \`userId\`,
                \`p_user\`.\`id\` AS \`overridePriceId\`,
                CONCAT(\`users\`.\`id\`, "_", \`p_base\`.\`id\`) AS \`id\`,
                COALESCE(\`p_user\`.\`price\`, \`p_base\`.\`price\`) AS \`price\`
            FROM \`prices\` \`p_base\`
                LEFT JOIN \`users\` \`users\` ON \`users\`.\`effective_id\` is null
                LEFT JOIN \`prices\` \`p_user\` ON \`p_user\`.\`code\` = \`p_base\`.\`code\`
                AND \`p_user\`.\`user_id\` = \`users\`.\`id\`
            WHERE \`p_base\`.\`user_id\` = 0
            ORDER BY \`users\`.\`id\` ASC,
                \`p_base\`.\`id\` ASC
        `);
        await queryRunner.query(`
            INSERT INTO \`teacher_report_nra\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)
        `, ["teacher_report_nra","VIEW","price_by_user","SELECT `p_base`.`code` AS `code`, `p_base`.`description` AS `description`, `p_base`.`price` AS `defaultPrice`, `users`.`id` AS `userId`, `p_user`.`id` AS `overridePriceId`, CONCAT(`users`.`id`, \"_\", `p_base`.`id`) AS `id`, COALESCE(`p_user`.`price`, `p_base`.`price`) AS `price` FROM `prices` `p_base` LEFT JOIN `users` `users` ON `users`.`effective_id` is null  LEFT JOIN `prices` `p_user` ON `p_user`.`code` = `p_base`.`code` AND `p_user`.`user_id` = `users`.`id` WHERE `p_base`.`user_id` = 0 ORDER BY `users`.`id` ASC, `p_base`.`id` ASC"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","price_by_user","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`price_by_user\`
        `);
    }

}
