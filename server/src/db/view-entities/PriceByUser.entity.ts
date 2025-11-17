import { IHasUserId } from '@shared/base-entity/interface';
import { Price } from '../entities/Price.entity';
import { User } from '@shared/entities/User.entity';
import { DataSource, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

/**
 * PriceByUser is a database view that merges system-wide default prices (userId=0)
 * with user-specific overrides. For each user and price code combination, it returns:
 * - The effective price (user override if exists, otherwise default)
 * - The default price (for comparison)
 * - Whether the user has an override (overridePriceId != null)
 *
 * This follows the same pattern as TextByUser for consistent override behavior.
 */
@ViewEntity('price_by_user', {
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('CONCAT(users.id, "_", p_base.id)', 'id')
      .addSelect('users.id', 'userId')
      .addSelect('p_base.code', 'code')
      .addSelect('p_base.description', 'description')
      .addSelect('COALESCE(p_user.price, p_base.price)', 'price')
      .addSelect('p_base.price', 'defaultPrice')
      .addSelect('p_user.id', 'overridePriceId')
      .where('p_base.userId = 0')
      .from(Price, 'p_base')
      .leftJoin(User, 'users', 'users.effective_id is null')
      .leftJoin(Price, 'p_user', 'p_user.code = p_base.code AND p_user.user_id = users.id')
      .orderBy('users.id')
      .addOrderBy('p_base.id'),
})
export class PriceByUser implements IHasUserId {
  @PrimaryColumn()
  id: string;

  @ViewColumn()
  userId: number;

  @ViewColumn()
  code: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  price: number;

  @ViewColumn()
  defaultPrice: number;

  @ViewColumn()
  overridePriceId: number | null;
}
