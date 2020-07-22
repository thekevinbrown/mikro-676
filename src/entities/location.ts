import {
	PrimaryKey,
	BigIntType,
	Entity,
	OneToOne,
	IdentifiedReference,
	BaseEntity,
} from '@mikro-orm/core';

import { Organisation } from './organisation';

@Entity({ tableName: 'location' })
export class Location extends BaseEntity<Location, 'id'> {
	@PrimaryKey({ type: BigIntType })
	id!: string;

	@OneToOne({ entity: () => Organisation, wrappedReference: true, nullable: true })
	organisation?: IdentifiedReference<Organisation>;
}
